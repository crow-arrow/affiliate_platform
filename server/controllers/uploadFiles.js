import fs from "fs";
import path from "path";
import prisma from "../prisma/client.js";
import { UPLOAD_DIR } from "../middleware/file.js";

export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const identityId = req.user?.id;

    if (!identityId) {
      return res.status(400).json({ message: "Missing identity in request" });
    }

    const identity = await prisma.identity.findUnique({
      where: { id: identityId },
      select: { avatarUrl: true },
    });

    if (!identity) {
      return res.status(404).json({ message: "Identity not found" });
    }

    const oldAvatar = identity.avatarUrl
      ? path.join(UPLOAD_DIR, path.basename(identity.avatarUrl))
      : null;

    const baseUrl = process.env.API_BASE_URL?.replace(/\/$/, "") || "";
    const newAvatarUrl = baseUrl
      ? `${baseUrl}/uploads/${req.file.filename}`
      : `uploads/${req.file.filename}`;

    const updatedIdentity = await prisma.identity.update({
      where: { id: identityId },
      data: { avatarUrl: newAvatarUrl },
    });

    if (oldAvatar && fs.existsSync(oldAvatar)) {
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

export const deleteAvatar = async (req, res) => {
  try {
    const identityId = req.user?.id;
    if (!identityId) {
      return res.status(400).json({ message: "Missing identity in request" });
    }

    const identity = await prisma.identity.findUnique({
      where: { id: identityId },
      select: { avatarUrl: true },
    });

    if (!identity) {
      return res.status(404).json({ message: "Identity not found" });
    }

    const filePath = identity.avatarUrl
      ? path.join(UPLOAD_DIR, path.basename(identity.avatarUrl))
      : null;

    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    const updatedIdentity = await prisma.identity.update({
      where: { id: identityId },
      data: { avatarUrl: null },
    });

    res.status(200).json({
      message: "Avatar removed",
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
