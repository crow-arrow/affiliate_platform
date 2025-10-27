import { getAuth, clerkClient } from "@clerk/express";
import prisma from "../prisma/client.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import dotenv from "dotenv";
import { signUpSchema, loginSchema } from "../middleware/validationSchemas.js";
import { sendVerificationEmail } from "../utils/mailer.js";
import { generateTokens, verifyToken } from "../utils/jwt.js";

dotenv.config();

// ✅ Register
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

    const isUsed = await prisma.user.findUnique({ where: { email } });
    if (isUsed) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const affiliateId = `${first_name.toLowerCase()}_${Math.floor(
      Math.random() * 90000 + 10000
    )}`;
    const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

    const newUser = await prisma.user.create({
      data: {
        email,
        phone,
        first_name,
        last_name,
        password: hash,
        affiliate_id: affiliateId,
        role: "GENIE",
        emailVerified: false,
      },
    });

    const { accessToken, refreshToken } = generateTokens(newUser);
    await sendVerificationEmail(newUser.email, newUser.first_name, accessToken);

    res.status(201).json({
      user: { id: newUser.id, email: newUser.email },
      token: accessToken,
      refreshToken,
      message: "Account created successfully. Please check your email.",
    });
  } catch (error) {
    console.error("❌ signUp error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// ✅ Login
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
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return res.status(404).json({ message: "User does not exist" });
    if (!user.emailVerified)
      return res.status(400).json({ message: "Please verify your email" });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      return res.status(401).json({ message: "Invalid email or password" });

    const { accessToken, refreshToken } = generateTokens(user);
    const { password: _, ...safeUser } = user;

    res.status(200).json({
      token: accessToken,
      refreshToken,
      user: safeUser,
      message: "You are signed in",
    });
  } catch (error) {
    console.error("❌ login error:", error);
    res.status(500).json({ message: "Login failed. Try again later." });
  }
};

// ✅ OAuth Login (Clerk)
export const oauthLogin = async (req, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const clerkUser = await clerkClient.users.getUser(userId);
    if (!clerkUser)
      return res.status(400).json({ message: "Clerk user not found" });

    const email =
      clerkUser.primaryEmailAddress?.emailAddress ||
      clerkUser.emailAddresses?.[0]?.emailAddress ||
      clerkUser.externalAccounts?.[0]?.emailAddress ||
      null;

    if (!email) return res.status(400).json({ message: "No email from Clerk" });

    const firstName = clerkUser.firstName || "NoName";
    const lastName = clerkUser.lastName || "NoName";
    const imageUrl = clerkUser.imageUrl || null;

    let user = await prisma.user.findUnique({ where: { clerkId: userId } });

    if (!user) {
      const foundByEmail = await prisma.user.findUnique({ where: { email } });
      if (foundByEmail && !foundByEmail.clerkId) {
        await prisma.user.update({
          where: { id: foundByEmail.id },
          data: { clerkId: userId },
        });
        user = await prisma.user.findUnique({ where: { id: foundByEmail.id } });
      }
    }

    if (!user) {
      const hash = bcrypt.hashSync(crypto.randomBytes(32).toString("hex"), 10);
      user = await prisma.user.create({
        data: {
          clerkId: userId,
          email,
          first_name: firstName,
          last_name: lastName,
          avatarUrl: imageUrl,
          role: "GENIE",
          emailVerified: true,
          password: hash,
        },
      });
      console.log("✅ Created user from Clerk");
    }

    const { accessToken, refreshToken } = generateTokens(user);
    const { password: _, ...safeUser } = user;

    res.status(200).json({
      token: accessToken,
      refreshToken,
      user: safeUser,
      message: "Welcome via SSO",
    });
  } catch (error) {
    console.error("OAuth error:", error);
    res
      .status(500)
      .json({ message: "OAuth login failed", error: error.message });
  }
};

// ✅ Get current user
export const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) return res.status(404).json({ message: "User does not exist" });

    const { password: _, ...safeUser } = user;
    res.status(200).json({ user: safeUser });
  } catch (error) {
    console.error("getMe error:", error);
    res.status(403).json({ message: "Access denied" });
  }
};

// ✅ Refresh token
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken: refreshTokenBody } = req.body;

    if (!refreshTokenBody)
      return res.status(401).json({ message: "Refresh token is required" });

    const decoded = verifyToken(
      refreshTokenBody,
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
    );

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const tokens = generateTokens(user);

    res.status(200).json({
      token: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      message: "Token refreshed",
    });
  } catch (error) {
    console.error("Refresh token error:", error);

    if (error.name === "TokenExpiredError")
      return res.status(401).json({ message: "Refresh token expired" });
    if (error.name === "JsonWebTokenError")
      return res.status(401).json({ message: "Invalid refresh token" });

    res.status(500).json({ message: "Failed to refresh token" });
  }
};
