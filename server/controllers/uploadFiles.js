import fs from "fs";
import path from "path";
import prisma from "../prisma/client.js";

export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    // req.user.id это Identity.id (строка)
    const identityId = req.user?.id;

    if (!identityId) {
      return res.status(400).json({ message: "Missing identity in request" });
    }

    // Получаем Identity
    const identity = await prisma.identity.findUnique({
      where: { id: identityId },
      select: { avatarUrl: true },
    });

    if (!identity) {
      return res.status(404).json({ message: "Identity not found" });
    }

    const oldAvatar = identity.avatarUrl
      ? path.join("/var/www/uploads", path.basename(identity.avatarUrl))
      : null;

    const newAvatarUrl = `uploads/${req.file.filename}`;

    // Сохраняем avatarUrl в Identity (глобально для пользователя)
    const updatedIdentity = await prisma.identity.update({
      where: { id: identityId },
      data: { avatarUrl: newAvatarUrl },
    });

    console.log("🧾 req.file:", req.file);

    if (
      oldAvatar &&
      newAvatarUrl.startsWith("uploads/") &&
      fs.existsSync(oldAvatar)
    ) {
      fs.unlinkSync(oldAvatar);
    }

    res.status(200).json({
      message: "Avatar uploaded successfully!",
      user: {
        id: updatedIdentity.id,
        email: updatedIdentity.email,
        firstName: updatedIdentity.firstName,
        lastName: updatedIdentity.lastName,
        avatarUrl: updatedIdentity.avatarUrl,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
