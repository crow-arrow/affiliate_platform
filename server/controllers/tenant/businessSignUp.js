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
    const { companyName, email, phone, first_name, last_name, password } =
      req.body || {};
    if (!companyName || !email || !password || !first_name || !last_name) {
      return res
        .status(400)
        .json({
          message:
            "companyName, first_name, last_name, email, password are required",
        });
    }

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

    // Создаем/обновляем глобальную Identity и Membership (ADMIN) для нового tenant
    const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    const identity = await prisma.identity.upsert({
      where: { email: normalizedEmail },
      update: {
        firstName: first_name,
        lastName: last_name,
        // Обновлять пароль ТОЛЬКО если явно пришёл новый пароль
        passwordHash,
        // emailVerified не обновляем при update (оставляем существующее значение)
      },
      create: {
        email: normalizedEmail,
        firstName: first_name,
        lastName: last_name,
        passwordHash,
        emailVerified: false, // Email требует подтверждения при кастомной регистрации
      },
    });

    await prisma.membership.upsert({
      where: {
        identityId_tenantId: { identityId: identity.id, tenantId: tenant.id },
      },
      update: { role: "ADMIN" },
      create: { identityId: identity.id, tenantId: tenant.id, role: "ADMIN" },
    });

    // Вариант A: больше не создаём пер-tenant профиль `User`.
    // Управление доступом и принадлежностью делаем через Identity + Membership.
    const adminUser = null;

    // tokens формируются в auth.js; здесь не создает токены специально,
    // но для обратной совместимости можно вернуть минимум
    // Автологин: выдаём токены из Identity+Membership
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
      message: "Business account created",
    });
  } catch (error) {
    console.error("❌ businessSignUp error:", error);
    return res
      .status(500)
      .json({ message: "Server error. Please try again later." });
  }
};
