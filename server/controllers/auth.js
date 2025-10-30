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

    const { email, phone, first_name, last_name, password, tenantSlug } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    const isUsed = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (isUsed) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const affiliateId = `${first_name.toLowerCase()}_${Math.floor(
      Math.random() * 90000 + 10000
    )}`;
    const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

    // Определяем tenant: prefer request resolve; fallback к tenantSlug
    let tenantId = await resolveTenantIdFromRequest(req);
    if (!tenantId && tenantSlug) {
      const tenant = await prisma.tenant.findFirst({ where: { domain: tenantSlug } }).catch(() => null);
      if (!tenant) return res.status(400).json({ message: "Tenant not found for provided slug" });
      tenantId = tenant.id;
    }

    const newUser = await prisma.user.create({
      data: {
        email: normalizedEmail,
        phone,
        first_name,
        last_name,
        password: hash,
        affiliate_id: affiliateId,
        role: "PARTNER",
        emailVerified: false,
        tenantId,
      },
    });

    const { accessToken, refreshToken } = generateTokens(newUser);
    await sendVerificationEmail(newUser.email, newUser.first_name, accessToken);

    res.status(201).json({
      user: { id: newUser.id, email: newUser.email },
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

    // Auto-resolve tenantId (required for multi-tenant isolation)
    const tenantId = await resolveTenantIdFromRequest(req);
    if (!tenantId) {
      return res.status(400).json({ message: "Tenant is not resolved. Provide ?tenant=slug (dev) or use workspace subdomain." });
    }

    console.log('LOGIN:', { normalizedEmail, tenantId });
    // Проверяем, что у identity есть членство в данном tenant
    const identity = await prisma.identity.findUnique({ where: { email: normalizedEmail } });
    if (!identity) return res.status(404).json({ message: "User does not exist" });
    const membership = await prisma.membership.findUnique({ where: { identityId_tenantId: { identityId: identity.id, tenantId } } });
    if (!membership) return res.status(403).json({ message: "No access to this workspace" });

    // Проверяем пароль: сперва Identity.passwordHash, затем legacy User (совместимость)
    if (identity.passwordHash) {
      const ok = await bcrypt.compare(password, identity.passwordHash);
      if (!ok) return res.status(401).json({ message: "Invalid email or password" });
    } else {
      const legacyUser = await prisma.user.findFirst({ where: { email: normalizedEmail, tenantId } });
      if (legacyUser?.password) {
        const isPasswordCorrect = await bcrypt.compare(password, legacyUser.password);
        if (!isPasswordCorrect) return res.status(401).json({ message: "Invalid email or password" });
      }
    }

    const tokenPayload = { id: identity.id, role: membership.role, tenantId };
    const { accessToken, refreshToken } = generateTokens(tokenPayload);
    const safeUser = {
      id: identity.id,
      email: normalizedEmail,
      first_name: identity.firstName || "",
      last_name: identity.lastName || "",
      role: membership.role,
      emailVerified: true,
      tenantId,
    };

    res.status(200).json({
      token: accessToken,
      refreshToken,
      user: safeUser,
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

    const tenantId = await resolveTenantIdFromRequest(req);
    if (!tenantId) {
      return res.status(400).json({ message: "Tenant is not resolved. Provide ?tenant=slug (dev) or use workspace subdomain." });
    }

    console.log('OAUTH LOGIN:', { email, tenantId });

    const firstName = clerkUser.firstName || "NoName";
    const lastName = clerkUser.lastName || "NoName";
    const imageUrl = clerkUser.imageUrl || null;

    // Upsert Identity по clerkId/email
    let identity = await prisma.identity.findUnique({ where: { clerkId: userId } });
    if (!identity) {
      const byEmail = await prisma.identity.findUnique({ where: { email } });
      if (byEmail) {
        identity = await prisma.identity.update({ where: { id: byEmail.id }, data: { clerkId: userId, firstName, lastName, avatarUrl: imageUrl } });
      } else {
        identity = await prisma.identity.create({ data: { clerkId: userId, email, firstName, lastName, avatarUrl: imageUrl } });
      }
    }

    // Ensure membership in current tenant
    const membership = await prisma.membership.upsert({
      where: { identityId_tenantId: { identityId: identity.id, tenantId } },
      update: {},
      create: { identityId: identity.id, tenantId, role: "PARTNER" },
    });

    const tokenPayload = { id: identity.id, role: membership.role, tenantId };
    const { accessToken, refreshToken } = generateTokens(tokenPayload);
    const safeUser = {
      id: identity.id,
      email,
      first_name: firstName,
      last_name: lastName,
      avatarUrl: imageUrl,
      role: membership.role,
      emailVerified: true,
      tenantId,
    };

    res.status(200).json({
      token: accessToken,
      refreshToken,
      user: safeUser,
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
    const identity = await prisma.identity.findUnique({ where: { id: req.user.id } });
    if (identity) {
      const membership = await prisma.membership.findUnique({ where: { identityId_tenantId: { identityId: identity.id, tenantId } } });
      const safeUser = {
        id: identity.id,
        email: identity.email,
        first_name: identity.firstName || "",
        last_name: identity.lastName || "",
        role: membership?.role || "PARTNER",
        emailVerified: true,
        tenantId,
      };
      return res.status(200).json({ user: safeUser });
    }

    // Фоллбэк: старые токены по User.id
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) return res.status(404).json({ message: "User does not exist" });
    const { password: _, ...safeUserLegacy } = user;
    res.status(200).json({ user: safeUserLegacy });
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

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const tokens = generateTokens(user);

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
      orderBy: { createdAt: 'asc' }
    });

    const tenants = memberships
      .map(m => m.tenant)
      .filter(Boolean)
      .filter((t, i, a) => t && a.findIndex(tt => tt.id === t.id) === i);

    res.json(tenants);
  } catch (e) {
    console.error('getUserTenants:', e);
    res.status(500).json({ message: 'Failed to get companies' });
  }
}

// Возвращает компании текущего пользователя по JWT (Identity + Membership)
export const getMyTenants = async (req, res) => {
  try {
    const identityId = req.user?.id;
    if (!identityId) return res.status(401).json({ message: "Unauthorized" });

    const memberships = await prisma.membership.findMany({
      where: { identityId },
      include: { tenant: { select: { id: true, name: true, domain: true } } },
      orderBy: { createdAt: 'asc' }
    });

    const tenants = memberships
      .map(m => m.tenant)
      .filter(Boolean)
      .filter((t, i, a) => t && a.findIndex(tt => tt.id === t.id) === i);

    res.json(tenants);
  } catch (e) {
    console.error('getMyTenants:', e);
    res.status(500).json({ message: 'Failed to get companies' });
  }
}
