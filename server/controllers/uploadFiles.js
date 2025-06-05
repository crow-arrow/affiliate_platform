import fs from "fs";
import path from "path";
import User from "../models/User.js";

export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const oldAvatar = user.avatarUrl
      ? path.join("uploads/", path.basename(user.avatarUrl))
      : null;

    user.avatarUrl = `uploads/${req.file.filename}`;
    await user.save();

    if (
      oldAvatar &&
      user.avatarUrl.startsWith("uploads/") &&
      fs.existsSync(oldAvatar)
    ) {
      fs.unlinkSync(oldAvatar);
    }

    res.status(200).json({ message: "Avatar uploaded successfully!", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
