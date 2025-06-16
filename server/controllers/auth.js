import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { signUpSchema, loginSchema } from "../validations/validationSchemas.js";
import { sendVerificationEmail } from "../utils/mailer.js";
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
    const isUsed = await User.findOne({ email });

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

    res.status(200).json({
      token,
      user: {
        ...user.toJSON(),
        password: undefined,
      },
      message: "You are in",
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Login failed. Please try again" });
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
