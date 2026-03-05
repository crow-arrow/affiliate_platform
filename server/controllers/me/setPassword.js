import bcrypt from "bcryptjs";
import prisma from "../../prisma/client.js";
import { signUpSchema } from "../../middleware/validationSchemas.js";

export const setPassword = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { newPassword } = req.body || {};

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!newPassword) {
      return res.status(400).json({ message: "Password is required" });
    }

    const identity = await prisma.identity.findUnique({
      where: { id: userId },
    });

    if (!identity) return res.status(404).json({ message: "User not found" });
    if (identity.passwordHash) {
      return res.status(400).json({
        message: "Password already set. Use change password instead.",
      });
    }

    const passwordSchema = signUpSchema.extract("password");
    const { error: passwordError } = passwordSchema.validate(newPassword, {
      abortEarly: true,
    });
    if (passwordError) {
      return res
        .status(400)
        .json({ message: passwordError.details[0].message });
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await prisma.identity.update({
      where: { id: identity.id },
      data: { passwordHash: newHash },
    });

    return res.json({
      message:
        "Password set successfully. You can now sign in with email and password.",
    });
  } catch (error) {
    console.error("setPassword error:", error);
    return res.status(500).json({ message: "Failed to set password" });
  }
};
