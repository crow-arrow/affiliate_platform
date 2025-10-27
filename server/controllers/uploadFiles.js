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

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const oldAvatar = user.avatarUrl
      ? path.join("/var/www/uploads", path.basename(user.avatarUrl))
      : null;

    const newAvatarUrl = `uploads/${req.file.filename}`;
    
    await prisma.user.update({
      where: { id: user.id },
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

    const updatedUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    res.status(200).json({ message: "Avatar uploaded successfully!", user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
