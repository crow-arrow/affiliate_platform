import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { resetPasswordValidation } from "../validations/validationSchemas.js";
import transporter from "../utils/mailer.js";
import User from "../models/User.js";
import dotenv from "dotenv";
dotenv.config();
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logoPath = path.resolve(__dirname, "../assets/logo.png");
const logoBase64 = fs.readFileSync(logoPath, { encoding: "base64" });

export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(401).json({ message: "Email is required" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });
    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    const mailOptions = {
      from: `"Jinn Travel" <hello@example.com>`,
      to: `${email}`,
      subject: "Password recover",
      html: `
      <table role="presentation" 
        style="width: 100%; 
            height: 100%; 
            min-height: 100vh; 
            border-spacing: 0; 
            padding: 0; 
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;"
        >
        <tr>
            <td style="padding: 25px; vertical-align: top;">
                <div style="text-align: center; margin-top: 50px">
                    <a href="https://www.jinn-travel.com">
                        <img src="data:image/png;base64,${logoBase64}" width="150px" height="92px" alt="Jinn Travel" />
                    </a>
                </div>
                <header style="
                    display: block;
                    padding: 20px;
                    text-align: center;
                    background-image: linear-gradient(150deg, rgba(11,46,51,1) 0%, rgba(79,124,130,1) 100%);
                    font-size: 24px;
                    font-weight: bold;
                    color: white;
                    margin-block: 50px;
                ">
                    Please reset your password
                </header>
                <div style="text-align: start;">
                    <h1>Password recover</h1>
                    <p>Hello ${user.first_name || ""},</p>
                    <p>you requested a reset link for your password. Simply click on the link below and create a new password:</p>
                </div>
                <div class="center" style="text-align: start; margin-block: 50px;">
                    <a 
                        href="${resetLink}"
                        style="
                            background-image: linear-gradient(150deg, rgba(11,46,51,1) 0%, rgba(79,124,130,1) 100%); 
                            color: white; 
                            text-decoration: none; 
                            padding: 15px; 
                            border-radius: 50px;"
                        target="_blank" 
                        title="Open in new tab"
                    >
                        <b>Reset Password</b>
                    </a>
                </div>
                <p style="font-size: 14px;">* the link will expire in 15 minutes *</p>
                <footer style="text-align: start;">
                    <b>That wasn't you?</b>
                    <p>Please contact our customer care team directly to protect your account:</p>
                    <span>
                        <img data-emoji="✉️" class="icon" alt="✉️" aria-label="✉️" draggable="false" src="https://fonts.gstatic.com/s/e/notoemoji/16.0/2709_fe0f/72.png" loading="lazy">
                        <a 
                            style="font-weight:normal;color:black" 
                            href="mailto:hello@jinn-travel.com?subject=I%20want%20to%20protect%20my%20account" 
                            target="_blank"
                        >
                            hello@jinn-travel.com
                        </a>
                    </span>
                </footer>
            </td>
        </tr>
    </table>
    <style>
        .icon {
            height: 1.2em;
            width: 1.2em;
            vertical-align: middle;
        }
        @media only screen and (max-width: 767px) {
            .center {
                text-align: center !important;
            }
        }
    </style>
  `,
    };

    await transporter.sendMail(mailOptions);
    return res.json({ message: "Reset link sent to your email" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const checkResetLink = async (req, res) => {
  try {
    const { token } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.json({ valid: true });
  } catch (error) {
    console.error("Error in checkResetLink:", error);

    if (error instanceof jwt.TokenExpiredError) {
      return res
        .status(400)
        .json({ valid: false, message: "Token has expired" });
    } else {
      return res.status(500).json({ valid: false, message: "Server error" });
    }
  }
};

export const resetPassword = async (req, res) => {
  try {
    req.body.token = req.params.token;
    const { error } = resetPasswordValidation.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        success: false,
        errors: error.details.map((err) => ({
          field: err.context.key,
          message: err.message,
        })),
      });
    }

    const { token, newPassword } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res.json({ message: "Password successfully reset" });
  } catch (error) {
    console.error("Error in resetPassword:", error);

    if (error instanceof jwt.TokenExpiredError) {
      return res.status(400).json({ message: "Token has expired" });
    }
  }
};
