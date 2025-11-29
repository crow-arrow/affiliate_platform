import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { resetPasswordValidation } from "../middleware/validationSchemas.js";
import { sendPasswordResetEmail } from "../utils/mailer.js";
import User from "../models/User.js";
import dotenv from "dotenv";
dotenv.config();

export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });
    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    await sendPasswordResetEmail(email, user.first_name, resetLink);

    return res.json({ message: "Reset link sent to your email" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const checkResetLink = async (req, res) => {
  try {
    const { token } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.json({ valid: true });
  } catch (error) {
    console.error("Error in checkResetLink:", error);

    if (error instanceof jwt.TokenExpiredError) {
      return res
        .status(400)
        .json({ valid: false, message: "Token has expired" });
    } else {
      return res.status(500).json({ valid: false, message: "Server error" });
    }
  }
};

export const resetPassword = async (req, res) => {
  try {
    req.body.token = req.params.token;
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

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error in resetPassword:", error);

    if (error instanceof jwt.TokenExpiredError) {
      return res.status(400).json({ message: "Token has expired" });
    } else {
      return res.status(500).json({ valid: false, message: "Server error" });
    }
  }
};
