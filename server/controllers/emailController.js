import { sendVerificationEmail } from "../utils/mailer.js";
import jwt from "jsonwebtoken";
import prisma from "../prisma/client.js";
import dotenv from "dotenv";
dotenv.config();

// Send email with varification link function
export const resendEmailController = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.emailVerified) {
      return res.status(400).json({ message: "Email already verified." });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    if (!user.email) {
      throw new Error("User email is undefined");
    }

    await sendVerificationEmail(user.email, user.first_name || "", token);

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
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user) return res.status(404).json({ message: "User not found." });

    if (user.emailVerified) {
      return res.status(409).json({
        message: "Email is already verified.",
      });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true },
    });

    const authToken = jwt.sign(
      { id: user.id, role: user.role, avatarUrl: user.avatarUrl },
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
