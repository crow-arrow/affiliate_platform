import { getAuth, clerkClient } from "@clerk/express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { signUpSchema, loginSchema } from "../middleware/validationSchemas.js";
import { sendVerificationEmail } from "../utils/mailer.js";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

// Функция генерации токенов
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" } // Короткий access token
  );

  const refreshToken = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, // Используйте отдельный секрет!
    { expiresIn: "7d" } // Долгий refresh token
  );

  return { accessToken, refreshToken };
};

// Register User
export const signUp = async (req, res) => {
  try {
    const { error } = signUpSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        success: false,
        errors: error.details.map((err) => ({
          field: err.context.key,
          message: err.message,
        })),
      });
    }

    const { email, phone, first_name, last_name, password } = req.body;
    const isUsed = await User.findOne({ where: { email } });

    if (isUsed) {
      return res.status(409).json({ message: "Email already exists" });
    }

    function generateRandom5DigitNumberShort() {
      return Math.floor(Math.random() * 90000) + 10000;
    }

    const randomNumberShort = generateRandom5DigitNumberShort();
    const affiliateId = `${first_name.toLowerCase()}_${randomNumberShort}`;

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const newUser = await User.create({
      email,
      phone,
      first_name,
      last_name,
      password: hash,
      affiliate_id: affiliateId,
      role: "Genie",
      emailVerified: false,
    });

    const { accessToken, refreshToken } = generateTokens(newUser);

    sendVerificationEmail(newUser.email, newUser.first_name, accessToken);

    res.status(201).json({
      user: { id: newUser.id, email: newUser.email },
      token: accessToken,
      refreshToken,
      message:
        "Account created successfully. Please check your email to verify your account.",
    });
  } catch (error) {
    res.status(500).json({ message: "User creation error" });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        success: false,
        errors: error.details.map((err) => ({
          field: err.context.key,
          message: err.message,
        })),
      });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    if (!user.emailVerified) {
      return res.status(400).json({
        message: "👌 Almost Done — verify your email any.",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const { accessToken, refreshToken } = generateTokens(user);

    const { password: _, ...safeUser } = user.toJSON();

    res.status(200).json({
      token: accessToken,
      refreshToken,
      user: safeUser,
      message: "You are in",
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Login failed. Please try again" });
  }
};

// POST /auth/oauth-login
export const oauthLogin = async (req, res) => {
  try {
    const authData = getAuth(req);

    const { userId } = authData;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const clerkUser = await clerkClient.users.getUser(userId);
    if (!clerkUser) {
      return res.status(400).json({ message: "Clerk user not found" });
    }
    const email =
      clerkUser?.primaryEmailAddress?.emailAddress ||
      clerkUser?.emailAddresses?.[0]?.emailAddress ||
      clerkUser?.externalAccounts?.[0]?.emailAddress ||
      null;

    if (!email) {
      return res
        .status(400)
        .json({ message: "Cannot create user without email" });
    }

    const firstName = clerkUser?.firstName || "NoName";
    const lastName = clerkUser?.lastName || "NoName";
    const imageUrl = clerkUser?.imageUrl || null;

    let user = await User.findOne({ where: { clerkId: userId } });

    if (!user && email) {
      const foundByEmail = await User.findOne({ where: { email } });
      if (foundByEmail) {
        foundByEmail.clerkId = userId;
        if (typeof foundByEmail.save === "function") {
          await foundByEmail.save();
        }
        user = foundByEmail;
      }
    }

    if (!user) {
      const randomPassword = crypto.randomBytes(32).toString("hex");
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(randomPassword, salt);

      user = await User.create({
        clerkId: userId,
        email,
        first_name: firstName,
        last_name: lastName,
        avatarUrl: imageUrl,
        role: "Genie",
        emailVerified: true,
        password: hash,
      }).catch(async (err) => {
        if (err.name === "SequelizeUniqueConstraintError") {
          const existing = await User.findOne({ where: { email } });
          if (existing && !existing.clerkId) {
            existing.clerkId = userId;
            await existing.save();
          }
          return existing;
        }
        throw err; // пробрасываем неизвестные ошибки дальше
      });

      console.log("Created new user from Clerk data");
    }

    const { accessToken, refreshToken } = generateTokens(user);

    const { password: _, ...safeUser } = user.toJSON();

    res.status(200).json({
      token: accessToken,
      refreshToken,
      user: safeUser,
      message: "Welcome via SSO",
    });
  } catch (error) {
    console.error("OAuth login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get Me
export const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    res.json({
      user: user.get({
        plain: true,
        attributes: { exclude: ["password"] },
      }),
    });
  } catch (error) {
    console.error(error);
    res.status(403).json({ message: "Access denied" });
  }
};

// Refresh Token endpoint
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token is required" });
    }

    // Верифицируем refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
    );

    // Находим пользователя
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Генерируем новые токены
    const tokens = generateTokens(user);

    res.status(200).json({
      token: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      message: "Token refreshed successfully",
    });
  } catch (error) {
    console.error("Refresh token error:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Refresh token expired" });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    res.status(500).json({ message: "Failed to refresh token" });
  }
};
