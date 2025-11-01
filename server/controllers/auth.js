import { getAuth, clerkClient } from "@clerk/express";
import prisma from "../prisma/client.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import dotenv from "dotenv";
import { signUpSchema, loginSchema } from "../middleware/validationSchemas.js";
import { sendVerificationEmail } from "../utils/mailer.js";
import { generateTokens, verifyToken } from "../utils/jwt.js";

dotenv.config();

const slugify = (name) =>
  String(name)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

// Helper: resolve tenant slug from request (query first in dev, then subdomain)
const extractTenantSlug = (req) => {
  const host = (req.headers?.host || "").toLowerCase();
  const search = req.query || {};
  const qSlug = search.tenant || search.slug;
  const isLocal = host.startsWith("localhost") || host.startsWith("127.0.0.1");

  if (qSlug) return String(qSlug).toLowerCase();

  if (!isLocal) {
    const root = (process.env.ROOT_DOMAIN || "").toLowerCase();
    if (root && host.endsWith(root) && host !== root) {
      const withoutPort = host.split(":")[0];
      const sub = withoutPort.slice(0, -root.length).replace(/\.$/, "");
      if (sub) return sub;
    }
    // Fallback: generic subdomain.domain.tld
    const parts = host.split(":")[0].split(".");
    if (parts.length >= 3) return parts[0];
  }
  return null;
};

const resolveTenantIdFromRequest = async (req) => {
  const slug = extractTenantSlug(req);
  if (!slug) return null;
  const tenant = await prisma.tenant.findFirst({ where: { domain: slug } });
  return tenant?.id || null;
};

// ✅ Register
export const signUp = async (req, res) => {
  try {
    const { error } = signUpSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        success: false,
        errors: error.details.map((err) => ({
          field: err.context.key,
          message: err.message,
        })),
      });
    }

    const { email, phone, first_name, last_name, password, tenantSlug } =
      req.body;
    const normalizedEmail = email.trim().toLowerCase();

    // Проверяем, существует ли Identity с таким email
    const existingIdentity = await prisma.identity.findUnique({
      where: { email: normalizedEmail },
    });
    if (existingIdentity) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

    // Определяем tenant: prefer request resolve; fallback к tenantSlug
    let tenantId = await resolveTenantIdFromRequest(req);
    if (!tenantId && tenantSlug) {
      const tenant = await prisma.tenant
        .findFirst({ where: { domain: tenantSlug } })
        .catch(() => null);
      if (!tenant)
        return res
          .status(400)
          .json({ message: "Tenant not found for provided slug" });
      tenantId = tenant.id;
    }

    if (!tenantId) {
      return res
        .status(400)
        .json({ message: "Tenant ID is required for registration" });
    }

    // Создаем Identity
    const newIdentity = await prisma.identity.create({
      data: {
        email: normalizedEmail,
        firstName: first_name,
        lastName: last_name,
        passwordHash: hash,
        emailVerified: false, // Email требует подтверждения при кастомной регистрации
      },
    });

    // Создаем Membership
    const membership = await prisma.membership.create({
      data: {
        identityId: newIdentity.id,
        tenantId: tenantId,
        role: "PARTNER",
      },
    });

    // Создаем PartnerProfile с affiliateId
    const affiliateId = `${first_name.toLowerCase()}_${Math.floor(
      Math.random() * 90000 + 10000
    )}`;

    await prisma.partnerProfile.create({
      data: {
        membershipId: membership.id,
        affiliateId: affiliateId,
        phone: phone || null,
        level: "BRONZE",
      },
    });

    const tokenPayload = {
      id: newIdentity.id,
      role: "PARTNER",
      tenantId: tenantId,
    };
    const { accessToken, refreshToken } = generateTokens(tokenPayload);

    await sendVerificationEmail(
      newIdentity.email,
      newIdentity.firstName || first_name,
      accessToken
    );

    res.status(201).json({
      user: { id: newIdentity.id, email: newIdentity.email },
      token: accessToken,
      refreshToken,
      message: "Account created successfully. Please check your email.",
    });
  } catch (error) {
    console.error("❌ signUp error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// ✅ Business Signup (создание tenant + первого ADMIN пользователя)
// businessSignUp вынесен в controllers/tenant/businessSignUp.js

// ✅ Login
export const login = async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        success: false,
        errors: error.details.map((err) => ({
          field: err.context.key,
          message: err.message,
        })),
      });
    }

    const { email, password } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    // Проверяем identity и пароль СНАЧАЛА (до проверки tenant)
    const identity = await prisma.identity.findUnique({
      where: { email: normalizedEmail },
    });
    if (!identity)
      return res.status(404).json({ message: "User does not exist" });

    // Проверяем пароль через Identity.passwordHash
    if (!identity.passwordHash) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const passwordValid = await bcrypt.compare(password, identity.passwordHash);
    if (!passwordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Попытка резолвить tenantId (опционально)
    let tenantId = await resolveTenantIdFromRequest(req);
    let membership = null;
    let currentTenant = null;

    if (tenantId) {
      // Если tenant указан - проверяем membership
      membership = await prisma.membership.findUnique({
        where: { identityId_tenantId: { identityId: identity.id, tenantId } },
        include: { tenant: { select: { id: true, name: true, domain: true } } },
      });
      if (membership) {
        currentTenant = membership.tenant;
      } else {
        // Если membership не найден - сбрасываем tenantId
        tenantId = null;
      }
    }

    // Получаем все доступные tenants для пользователя
    const allMemberships = await prisma.membership.findMany({
      where: { identityId: identity.id },
      include: { tenant: { select: { id: true, name: true, domain: true } } },
      orderBy: { createdAt: "asc" },
    });
    const availableTenants = allMemberships
      .map((m) => m.tenant)
      .filter(Boolean);

    // Если tenantId не указан, но есть доступные tenants - используем первый (для обратной совместимости)
    if (!tenantId && availableTenants.length > 0) {
      tenantId = availableTenants[0].id;
      currentTenant = availableTenants[0];
      membership = allMemberships.find((m) => m.tenantId === tenantId) || null;
    }

    // Генерируем токен (tenantId может быть null)
    const tokenPayload = {
      id: identity.id,
      role: membership?.role || "PARTNER",
      tenantId: tenantId || null,
    };
    const { accessToken, refreshToken } = generateTokens(tokenPayload);

    const safeUser = {
      id: identity.id,
      email: normalizedEmail,
      first_name: identity.firstName || "",
      last_name: identity.lastName || "",
      role: membership?.role || "PARTNER",
      emailVerified: identity.emailVerified || false, // Используем реальное значение из базы
      tenantId: tenantId || null,
    };

    console.log("LOGIN:", {
      normalizedEmail,
      tenantId,
      hasTenants: availableTenants.length > 0,
    });

    res.status(200).json({
      token: accessToken,
      refreshToken,
      user: safeUser,
      currentTenant: currentTenant, // Текущий tenant (если есть)
      availableTenants: availableTenants, // Все доступные tenants
      message: "You are signed in",
    });
  } catch (error) {
    console.error("❌ login error:", error);
    res.status(500).json({ message: "Login failed. Try again later." });
  }
};

// ✅ OAuth Login (Clerk)
export const oauthLogin = async (req, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const clerkUser = await clerkClient.users.getUser(userId);
    if (!clerkUser)
      return res.status(400).json({ message: "Clerk user not found" });

    let email =
      clerkUser.primaryEmailAddress?.emailAddress ||
      clerkUser.emailAddresses?.[0]?.emailAddress ||
      clerkUser.externalAccounts?.[0]?.emailAddress ||
      null;
    if (email) email = email.trim().toLowerCase();

    if (!email) return res.status(400).json({ message: "No email from Clerk" });

    // Попытка резолвить tenantId (опционально)
    let tenantId = await resolveTenantIdFromRequest(req);

    const firstName = clerkUser.firstName || "NoName";
    const lastName = clerkUser.lastName || "NoName";
    const imageUrl = clerkUser.imageUrl || null;

    // Upsert Identity по clerkId/email
    let identity = await prisma.identity.findUnique({
      where: { clerkId: userId },
    });
    if (!identity) {
      const byEmail = await prisma.identity.findUnique({ where: { email } });
      if (byEmail) {
        identity = await prisma.identity.update({
          where: { id: byEmail.id },
          data: {
            clerkId: userId,
            firstName,
            lastName,
            avatarUrl: imageUrl,
            emailVerified: true, // OAuth email уже верифицирован Clerk
          },
        });
      } else {
        identity = await prisma.identity.create({
          data: {
            clerkId: userId,
            email,
            firstName,
            lastName,
            avatarUrl: imageUrl,
            emailVerified: true, // OAuth email уже верифицирован Clerk
          },
        });
      }
    }

    let membership = null;
    let currentTenant = null;

    if (tenantId) {
      // Если tenant указан - проверяем/создаем membership
      membership = await prisma.membership.upsert({
        where: { identityId_tenantId: { identityId: identity.id, tenantId } },
        update: {},
        create: { identityId: identity.id, tenantId, role: "PARTNER" },
        include: { tenant: { select: { id: true, name: true, domain: true } } },
      });
      currentTenant = membership.tenant;
    }

    // Получаем все доступные tenants для пользователя
    const allMemberships = await prisma.membership.findMany({
      where: { identityId: identity.id },
      include: { tenant: { select: { id: true, name: true, domain: true } } },
      orderBy: { createdAt: "asc" },
    });
    const availableTenants = allMemberships
      .map((m) => m.tenant)
      .filter(Boolean);

    // Если tenantId не указан, но есть доступные tenants - используем первый
    if (!tenantId && availableTenants.length > 0) {
      tenantId = availableTenants[0].id;
      currentTenant = availableTenants[0];
      membership = allMemberships.find((m) => m.tenantId === tenantId) || null;
    }

    const tokenPayload = {
      id: identity.id,
      role: membership?.role || "PARTNER",
      tenantId: tenantId || null,
    };
    const { accessToken, refreshToken } = generateTokens(tokenPayload);

    const safeUser = {
      id: identity.id,
      email,
      first_name: firstName,
      last_name: lastName,
      avatarUrl: imageUrl,
      role: membership?.role || "PARTNER",
      emailVerified: identity.emailVerified || false, // Используем реальное значение из базы
      tenantId: tenantId || null,
    };

    console.log("OAUTH LOGIN:", {
      email,
      tenantId,
      hasTenants: availableTenants.length > 0,
    });

    res.status(200).json({
      token: accessToken,
      refreshToken,
      user: safeUser,
      currentTenant: currentTenant,
      availableTenants: availableTenants,
      message: "Welcome via SSO",
    });
  } catch (error) {
    console.error("OAuth error:", error);
    res
      .status(500)
      .json({ message: "OAuth login failed", error: error.message });
  }
};

// ✅ Get current user
export const getMe = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    // Сначала пробуем как Identity (вариант A токен)
    const identity = await prisma.identity.findUnique({
      where: { id: req.user.id },
    });
    if (identity) {
      const membership = await prisma.membership.findUnique({
        where: { identityId_tenantId: { identityId: identity.id, tenantId } },
      });
      const safeUser = {
        id: identity.id,
        email: identity.email,
        first_name: identity.firstName || "",
        last_name: identity.lastName || "",
        role: membership?.role || "PARTNER",
        emailVerified: identity.emailVerified || false, // Используем реальное значение из базы
        tenantId,
      };
      return res.status(200).json({ user: safeUser });
    }

    // Identity не найден
    return res.status(404).json({ message: "User does not exist" });
  } catch (error) {
    console.error("getMe error:", error);
    res.status(403).json({ message: "Access denied" });
  }
};

// ✅ Refresh token
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken: refreshTokenBody } = req.body;

    if (!refreshTokenBody)
      return res.status(401).json({ message: "Refresh token is required" });

    const decoded = verifyToken(
      refreshTokenBody,
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
    );

    // Используем Identity вместо User
    const identity = await prisma.identity.findUnique({
      where: { id: decoded.id },
    });
    if (!identity) return res.status(404).json({ message: "User not found" });

    // Получаем tenantId из decoded или первого доступного membership
    let tenantId = decoded.tenantId || null;
    let role = decoded.role || "PARTNER";

    if (!tenantId) {
      const firstMembership = await prisma.membership.findFirst({
        where: { identityId: identity.id },
      });
      if (firstMembership) {
        tenantId = firstMembership.tenantId;
        role = firstMembership.role;
      }
    }

    const tokenPayload = {
      id: identity.id,
      role: role,
      tenantId: tenantId,
    };
    const tokens = generateTokens(tokenPayload);

    res.status(200).json({
      token: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      message: "Token refreshed",
    });
  } catch (error) {
    console.error("Refresh token error:", error);

    if (error.name === "TokenExpiredError")
      return res.status(401).json({ message: "Refresh token expired" });
    if (error.name === "JsonWebTokenError")
      return res.status(401).json({ message: "Invalid refresh token" });

    res.status(500).json({ message: "Failed to refresh token" });
  }
};

// Получить все компании, где есть юзер с этим email
export const getUserTenants = async (req, res) => {
  try {
    const email = req.query?.email?.trim().toLowerCase();
    if (!email) return res.status(400).json({ message: "email required" });

    // Новая модель: ищем Identity и его Memberships → Tenants
    const identity = await prisma.identity.findUnique({ where: { email } });
    if (!identity) return res.json([]);

    const memberships = await prisma.membership.findMany({
      where: { identityId: identity.id },
      include: { tenant: { select: { id: true, name: true, domain: true } } },
      orderBy: { createdAt: "asc" },
    });

    const tenants = memberships
      .map((m) => m.tenant)
      .filter(Boolean)
      .filter((t, i, a) => t && a.findIndex((tt) => tt.id === t.id) === i);

    res.json(tenants);
  } catch (e) {
    console.error("getUserTenants:", e);
    res.status(500).json({ message: "Failed to get companies" });
  }
};

// Возвращает компании текущего пользователя по JWT (Identity + Membership)
export const getMyTenants = async (req, res) => {
  try {
    const identityId = req.user?.id;
    if (!identityId) return res.status(401).json({ message: "Unauthorized" });

    const memberships = await prisma.membership.findMany({
      where: { identityId },
      include: { tenant: { select: { id: true, name: true, domain: true } } },
      orderBy: { createdAt: "asc" },
    });

    const tenants = memberships
      .map((m) => m.tenant)
      .filter(Boolean)
      .filter((t, i, a) => t && a.findIndex((tt) => tt.id === t.id) === i);

    res.json(tenants);
  } catch (e) {
    console.error("getMyTenants:", e);
    res.status(500).json({ message: "Failed to get companies" });
  }
};
