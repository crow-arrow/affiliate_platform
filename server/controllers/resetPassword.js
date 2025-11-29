import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { resetPasswordValidation } from "../middleware/validationSchemas.js";
import { sendPasswordResetOTP } from "../utils/mailer.js";
import prisma from "../prisma/client.js";
import dotenv from "dotenv";
dotenv.config();

// Генерация 6-значного кода
const generateOTPCode = () => {
  return crypto.randomInt(100000, 999999).toString();
};

export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const identity = await prisma.identity.findUnique({
      where: { email: normalizedEmail },
    });
    if (!identity) {
      return res.status(404).json({ message: "User not found" });
    }

    // Генерируем OTP код
    const code = generateOTPCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 минут

    // Инвалидируем предыдущие неиспользованные коды для восстановления пароля
    await prisma.verificationCode.updateMany({
      where: {
        identityId: identity.id,
        type: "PASSWORD_RESET",
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
        type: "PASSWORD_RESET",
        expiresAt,
      },
    });

    // Отправляем OTP код на email
    await sendPasswordResetOTP(
      identity.email,
      identity.firstName || "",
      code
    );

    return res.json({ message: "Password reset code sent to your email" });
  } catch (error) {
    console.error("Error in requestPasswordReset:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const verifyPasswordResetOTP = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ message: "Email and code are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const identity = await prisma.identity.findUnique({
      where: { email: normalizedEmail },
    });

    if (!identity) {
      return res.status(404).json({ message: "User not found" });
    }

    // Ищем валидный код
    const verificationCode = await prisma.verificationCode.findFirst({
      where: {
        identityId: identity.id,
        code,
        type: "PASSWORD_RESET",
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
        message: "Invalid or expired verification code",
      });
    }

    // Помечаем код как использованный
    await prisma.verificationCode.update({
      where: { id: verificationCode.id },
      data: { used: true },
    });

    // Генерируем временный токен для сброса пароля (действует 10 минут)
    const resetToken = jwt.sign(
      { id: identity.id, type: "password_reset" },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );

    return res.json({
      valid: true,
      token: resetToken,
      message: "Code verified successfully",
    });
  } catch (error) {
    console.error("Error in verifyPasswordResetOTP:", error);
    return res.status(500).json({ valid: false, message: "Server error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { error } = resetPasswordValidation.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        success: false,
        errors: error.details.map((err) => ({
          field: err.context.key,
          message: err.message,
        })),
      });
    }

    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: "Token and new password are required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Проверяем, что токен для сброса пароля
    if (decoded.type !== "password_reset") {
      return res.status(400).json({ message: "Invalid token type" });
    }

    const identity = await prisma.identity.findUnique({
      where: { id: decoded.id },
    });
    if (!identity) return res.status(404).json({ message: "User not found" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.identity.update({
      where: { id: identity.id },
      data: { passwordHash: hashedPassword },
    });

    return res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error in resetPassword:", error);

    if (error instanceof jwt.TokenExpiredError) {
      return res.status(400).json({ message: "Token has expired" });
    } else if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({ message: "Invalid token" });
    } else {
      return res.status(500).json({ valid: false, message: "Server error" });
    }
  }
};
