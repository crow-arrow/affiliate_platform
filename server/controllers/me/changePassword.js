import bcrypt from "bcryptjs";
import prisma from "../../prisma/client.js";
import { signUpSchema } from "../../middleware/validationSchemas.js";

export const changePassword = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { currentPassword, newPassword } = req.body || {};

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Current password and new password are required" });
    }

    const identity = await prisma.identity.findUnique({
      where: { id: userId },
    });
    if (!identity || !identity.passwordHash) {
      return res
        .status(400)
        .json({ message: "Password cannot be changed for this account" });
    }

    const isValid = await bcrypt.compare(
      currentPassword,
      identity.passwordHash
    );
    if (!isValid) {
      return res.status(403).json({ message: "Current password is incorrect" });
    }

    if (currentPassword === newPassword) {
      return res
        .status(400)
        .json({ message: "New password must be different from current" });
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

    return res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("changePassword error:", error);
    return res.status(500).json({ message: "Failed to change password" });
  }
};
