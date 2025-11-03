import prisma from "../../prisma/client.js";
import bcrypt from "bcryptjs";

const slugify = (name) =>
  String(name)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

// POST /api/tenant/business-sign-up
export const businessSignUp = async (req, res) => {
  try {
    const {
      companyName,
      email,
      phone,
      first_name,
      last_name,
      password,
      plan,
      invitedEmails,
    } = req.body || {};
    if (!companyName || !email || !first_name || !last_name) {
      return res.status(400).json({
        message: "companyName, first_name, last_name, email are required",
      });
    }

    // Password требуется только для новых пользователей
    // Для существующих пользователей (авторизованных) password не обязателен

    const normalizedEmail = email.trim().toLowerCase();
    // Проверяем уникальность названия компании (не email!)
    const existingCompany = await prisma.tenant.findFirst({
      where: { name: companyName },
    });
    if (existingCompany) {
      return res.status(409).json({ message: "Company name already taken" });
    }

    const base = slugify(companyName);
    let candidate = base || `company-${Math.floor(Math.random() * 10000)}`;
    let suffix = 0;
    while (await prisma.tenant.findUnique({ where: { domain: candidate } })) {
      suffix += 1;
      candidate = `${base}-${suffix}`;
    }

    const tenant = await prisma.tenant.create({
      data: {
        name: companyName,
        domain: candidate,
      },
    });

    // Проверяем, существует ли Identity
    let identity = await prisma.identity.findUnique({
      where: { email: normalizedEmail },
    });

    if (identity) {
      // Обновляем существующего пользователя
      identity = await prisma.identity.update({
        where: { email: normalizedEmail },
        data: {
          firstName: first_name,
          lastName: last_name,
          // Обновляем пароль только если он предоставлен
          ...(password && {
            passwordHash: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
          }),
        },
      });
    } else {
      // Создаем нового пользователя (password обязателен)
      if (!password) {
        return res.status(400).json({
          message: "Password is required for new users",
        });
      }
      const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
      identity = await prisma.identity.create({
        data: {
          email: normalizedEmail,
          firstName: first_name,
          lastName: last_name,
          passwordHash,
          emailVerified: false,
        },
      });
    }

    const membership = await prisma.membership.upsert({
      where: {
        identityId_tenantId: { identityId: identity.id, tenantId: tenant.id },
      },
      update: { role: "ADMIN" },
      create: { identityId: identity.id, tenantId: tenant.id, role: "ADMIN" },
    });

    // Создаем PartnerProfile для ADMIN
    const existingProfile = await prisma.partnerProfile.findUnique({
      where: { membershipId: membership.id },
    });

    if (!existingProfile) {
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
    }

    // TODO: Сохранить plan в tenant settings или отдельной таблице
    // TODO: Отправить приглашения по email, если provided

    // Генерируем токены
    const { generateTokens } = await import("../../utils/jwt.js");
    const tokens = generateTokens({
      id: identity.id,
      role: "ADMIN",
      tenantId: tenant.id,
    });

    return res.status(201).json({
      user: {
        id: identity.id,
        email: normalizedEmail,
        role: "ADMIN",
        tenantId: tenant.id,
      },
      tenant: { id: tenant.id, name: tenant.name, slug: tenant.domain },
      token: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      message: "Workspace created successfully",
    });
  } catch (error) {
    console.error("❌ businessSignUp error:", error);
    return res
      .status(500)
      .json({ message: "Server error. Please try again later." });
  }
};
