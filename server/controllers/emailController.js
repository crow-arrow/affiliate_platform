import transporter from "../utils/mailer.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logoPath = path.resolve(__dirname, "../assets/logo.png");
const logoBase64 = fs.readFileSync(logoPath, { encoding: "base64" });

// Send email with varification link function
export const sendVerificationEmail = async (email, token, res) => {
  try {
    const verificationLink = `${process.env.CLIENT_URL}/verify-email/${token}`;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const mailOptions = {
      from: `"Jinn Travel" <hello@example.com>`,
      to: `${email}`,
      subject: "Email verification",
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
                    NEW AFFILIATE
                </header>
                <div style="text-align: start;">
                    <h1>Email Confirmation</h1>
                    <p>Hello ${user.first_name || ""},</p>
                    <p>Click the link below to confirm your email:</p>
                </div>
                <div class="center" style="text-align: start; margin-block: 50px;">
                    <a 
                        href="${verificationLink}"
                        style="
                            background-image: linear-gradient(150deg, rgba(11,46,51,1) 0%, rgba(79,124,130,1) 100%);
                            color: white; 
                            text-decoration: none; 
                            padding: 15px; 
                            border-radius: 50px;"
                        target="_blank" 
                        title="Open in new tab"
                    >
                        <b>Verify your account</b>
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
    console.log("Verification email sent to:", email);
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
};

// Email Confirmation Function
export const verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.emailVerified) {
      return res.status(409).json({
        message: "Email is already verified",
      });
    }

    user.emailVerified = true;
    await user.save();

    const authToken = jwt.sign(
      { id: user.id, role: user.role, avatarUrl: user.avatarUrl },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.status(200).json({
      message: "Email successfully verified",
      token: authToken,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Invalid or expired token" });
  }
};
