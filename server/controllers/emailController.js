import { sendVerificationOTP } from "../utils/mailer.js";
import jwt from "jsonwebtoken";
import prisma from "../prisma/client.js";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

// Генерация 6-значного кода
const generateOTPCode = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// Отправка OTP кода для верификации email
export const sendOTPCode = async (req, res) => {
  const { email } = req.body;

  try {
    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail) {
      return res.status(400).json({ message: "Email is required" });
    }

    const identity = await prisma.identity.findUnique({
      where: { email: normalizedEmail },
    });

    if (!identity) {
      return res.status(404).json({ message: "User not found" });
    }

    // Генерируем код
    const code = generateOTPCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 минут

    // Инвалидируем предыдущие неиспользованные коды для этого пользователя
    await prisma.verificationCode.updateMany({
      where: {
        identityId: identity.id,
        type: "EMAIL_VERIFICATION",
        used: false,
      },
      data: {
        used: true,
      },
    });

    // Создаем новый код
    await prisma.verificationCode.create({
      data: {
        identityId: identity.id,
        code,
        type: "EMAIL_VERIFICATION",
        expiresAt,
      },
    });

    // Отправляем email
    await sendVerificationOTP(identity.email, identity.firstName || "", code);

    res.status(200).json({
      message: "Verification code sent successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send verification code." });
  }
};

// Верификация OTP кода
export const verifyOTPCode = async (req, res) => {
  const { email, code } = req.body;

  try {
    if (!email || !code) {
      return res.status(400).json({ message: "Email and code are required." });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const identity = await prisma.identity.findUnique({
      where: { email: normalizedEmail },
    });

    if (!identity) {
      return res.status(404).json({ message: "User not found." });
    }

    // Ищем валидный код
    const verificationCode = await prisma.verificationCode.findFirst({
      where: {
        identityId: identity.id,
        code,
        type: "EMAIL_VERIFICATION",
        used: false,
        expiresAt: {
          gt: new Date(), // Код не истек
        },
      },
      orderBy: {
        createdAt: "desc", // Берем самый свежий
      },
    });

    if (!verificationCode) {
      return res.status(400).json({
        message: "Invalid or expired verification code.",
      });
    }

    // Помечаем код как использованный
    await prisma.verificationCode.update({
      where: { id: verificationCode.id },
      data: { used: true },
    });

    // Обновляем emailVerified
    await prisma.identity.update({
      where: { id: identity.id },
      data: { emailVerified: true },
    });

    // Получаем membership для генерации токена (может быть null, если пользователь без tenant)
    const membership = await prisma.membership.findFirst({
      where: { identityId: identity.id },
    });

    // Генерируем auth token (работает с tenant или без него)
    const authToken = jwt.sign(
      {
        id: identity.id,
        role: membership?.role || null,
        tenantId: membership?.tenantId || null,
        avatarUrl: identity.avatarUrl || null,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Email verified successfully.",
      token: authToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};
