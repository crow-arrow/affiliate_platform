import { sendVerificationEmail } from "../utils/mailer.js";
import jwt from "jsonwebtoken";
import prisma from "../prisma/client.js";
import dotenv from "dotenv";
dotenv.config();

// Send email with varification link function
export const resendEmailController = async (req, res) => {
  const { email } = req.body;

  try {
    const identity = await prisma.identity.findUnique({ where: { email } });

    if (!identity) {
      return res.status(404).json({ message: "User not found" });
    }

    // Identity всегда считается верифицированным (email уникален и проверен при создании)
    // Если нужна дополнительная верификация, можно добавить поле emailVerified в Identity
    // Пока оставляем логику без проверки верификации для Identity

    const token = jwt.sign({ id: identity.id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    if (!identity.email) {
      throw new Error("User email is undefined");
    }

    await sendVerificationEmail(
      identity.email,
      identity.firstName || "",
      token
    );

    res.status(200).json({
      message: "Email resent successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send verification email." });
  }
};

// Email Confirmation Function
export const verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const identity = await prisma.identity.findUnique({
      where: { id: decoded.id },
    });

    if (!identity) return res.status(404).json({ message: "User not found." });

    // Обновляем emailVerified = true после успешной верификации
    await prisma.identity.update({
      where: { id: identity.id },
      data: { emailVerified: true },
    });

    // Получаем первый доступный membership для генерации токена
    const membership = await prisma.membership.findFirst({
      where: { identityId: identity.id },
    });

    if (!membership) {
      return res.status(404).json({ message: "User membership not found." });
    }

    const authToken = jwt.sign(
      {
        id: identity.id,
        role: membership.role,
        tenantId: membership.tenantId,
        avatarUrl: identity.avatarUrl,
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
    res.status(400).json({ message: "Invalid or expired token." });
  }
};
