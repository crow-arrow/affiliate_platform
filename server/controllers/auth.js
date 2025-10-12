import { getAuth, clerkClient } from "@clerk/express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { signUpSchema, loginSchema } from "../middleware/validationSchemas.js";
import { sendVerificationEmail } from "../utils/mailer.js";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

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

    const token = jwt.sign(
      { id: newUser.id, role: newUser.role, avatarUrl: newUser.avatarUrl },
      process.env.JWT_SECRET,
      { expiresIn: "30m" }
    );
    sendVerificationEmail(newUser.email, newUser.first_name, token);

    res.status(201).json({
      user: { id: newUser.id, email: newUser.email },
      token,
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

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const { password: _, ...safeUser } = user.toJSON();

    res.status(200).json({
      token,
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
  console.log("🎯 INSIDE oauthLogin FUNCTION");
  console.log("Request method:", req.method);
  console.log("Request body:", req.body);
  console.log("AUTH HEADER:", req.headers.authorization);
  try {
    const authData = getAuth(req);
    console.log("getAuth(req):", authData);

    const { userId } = authData;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    console.log("OAuth login attempt for Clerk userId:", userId);

    const clerkUser = await clerkClient.users.getUser(userId);
    if (!clerkUser) {
      return res.status(400).json({ message: "Clerk user not found" });
    }
    const email =
      clerkUser?.primaryEmailAddress?.emailAddress ||
      clerkUser?.emailAddresses?.[0]?.emailAddress ||
      clerkUser?.externalAccounts?.[0]?.emailAddress ||
      null;
    const firstName = clerkUser?.firstName || "NoName";
    const lastName = clerkUser?.lastName || "NoName";
    const imageUrl = clerkUser?.imageUrl || null;

    console.log("Clerk user data:", { email, firstName, lastName, imageUrl });

    // if (!email) {
    //   return res
    //     .status(400)
    //     .json({ message: "Email is missing from OAuth provider" });
    // }

    // Try to find by clerkId first
    let user = await User.findOne({ where: { clerkId: userId } });

    // If not found by clerkId, try by email to link existing account
    if (!user && email) {
      user = await User.findOne({ where: { email } });
      if (user) {
        user.clerkId = userId;
        await user.save();
        console.log("Linked existing user with Clerk ID");
      }
    }

    // If still not found — create a new user
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
      });

      console.log("Created new user from Clerk data");
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "30m" }
    );

    const { password: _, ...safeUser } = user.toJSON();

    res.status(200).json({
      token,
      user: safeUser,
      message: "Welcome via SSO",
    });
  } catch (error) {
    console.error("OAuth login error:", error);
    res
      .status(500)
      .json({ message: "OAuth login failed", error: error.message });
  }
};

// Get Me
export const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
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
