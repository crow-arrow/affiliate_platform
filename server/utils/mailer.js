import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log("SMTP error:", error);
  } else {
    console.log("SMTP server is ready to send emails", success);
  }
});

// Старая функция sendPasswordResetEmail удалена - теперь используется sendPasswordResetOTP

export const sendVerificationOTP = async (email, username, code) => {
  try {
    const mailOptions = {
      from: `"Jinn Travel" <hello@jinn-travel.com>`,
      to: email,
      subject: "Email verification code",
      html: `
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
          <tr>
            <td align="center">
              <table cellpadding="0" cellspacing="0" role="presentation" style="max-width: 560px; border-spacing: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
                <tr>
                  <td style="padding: 25px; vertical-align: top">
                    <div style="text-align: center; margin: 0 50px 0 0">
                      <a href="https://www.jinn-travel.com">
                        <img
                          src="https://jinn-travel.com/wp-content/uploads/2024/11/logo-scaled.png"
                          alt="Jinn Travel Logo"
                          width="100"
                          height="auto"
                          style="display: block"
                        />
                      </a>
                    </div>
                    <div
                      role="banner"
                      style="
                        display: block;
                        padding: 20px;
                        border-radius: 6px;
                        text-align: center;
                        background-image: linear-gradient(
                          150deg,
                          rgba(11, 46, 51, 1) 0%,
                          rgba(79, 124, 130, 1) 100%
                        );
                        background-color: #0b2e33;
                        font-size: 24px;
                        font-weight: bold;
                        color: white !important;
                        margin: 50px 0;
                      "
                    >
                      <span style="color: white !important;">EMAIL VERIFICATION</span>
                    </div>
                    <div style="text-align: start;">
                      <h1>Verification Code</h1>
                      <p>Hello ${username || ""},</p>
                      <p>Use the following code to verify your email address:</p>
                    </div>
                    <div style="text-align: center; margin: 50px 0">
                      <div
                        style="
                          display: inline-block;
                          padding: 20px 40px;
                          border-radius: 8px;
                          background-color: #f5f5f5;
                          border: 2px solid #0b2e33;
                          font-size: 32px;
                          font-weight: bold;
                          letter-spacing: 8px;
                          color: #0b2e33;
                          font-family: monospace;
                        "
                      >
                        ${code}
                      </div>
                    </div>
                    <p style="font-size: 14px; text-align: center;">* This code will expire in 15 minutes *</p>
                    <p style="font-size: 14px; text-align: center;">
                      If you didn't request this code, you can safely ignore this email.
                    </p>
                    <div style="text-align: start; font-size: 14px; margin-top: 30px;">
                      <p><strong>Need help?</strong></p>
                      <p>Reach out to our team at <a href="mailto:hello@jinn-travel.com">hello@jinn-travel.com</a></p>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending verification OTP:", error);
    throw error;
  }
};

export const sendPasswordResetOTP = async (email, username, code) => {
  try {
    const mailOptions = {
      from: `"Jinn Travel" <hello@jinn-travel.com>`,
      to: email,
      subject: "Password reset code",
      html: `
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
          <tr>
            <td align="center">
              <table cellpadding="0" cellspacing="0" role="presentation" style="max-width: 560px; border-spacing: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
                <tr>
                  <td style="padding: 25px; vertical-align: top">
                    <div style="text-align: center; margin: 0 50px 0 0">
                      <a href="https://www.jinn-travel.com">
                        <img
                          src="https://jinn-travel.com/wp-content/uploads/2024/11/logo-scaled.png"
                          alt="Jinn Travel Logo"
                          width="100"
                          height="auto"
                          style="display: block"
                        />
                      </a>
                    </div>
                    <div
                      role="banner"
                      style="
                        display: block;
                        padding: 20px;
                        border-radius: 6px;
                        text-align: center;
                        background-image: linear-gradient(
                          150deg,
                          rgba(11, 46, 51, 1) 0%,
                          rgba(79, 124, 130, 1) 100%
                        );
                        background-color: #0b2e33;
                        font-size: 24px;
                        font-weight: bold;
                        color: white !important;
                        margin: 50px 0;
                      "
                    >
                      <span style="color: white !important;">PASSWORD RESET</span>
                    </div>
                    <div style="text-align: start;">
                      <h1>Password Reset Code</h1>
                      <p>Hello ${username || ""},</p>
                      <p>You requested to reset your password. Use the following code to verify your identity:</p>
                    </div>
                    <div style="text-align: center; margin: 50px 0">
                      <div
                        style="
                          display: inline-block;
                          padding: 20px 40px;
                          border-radius: 8px;
                          background-color: #f5f5f5;
                          border: 2px solid #0b2e33;
                          font-size: 32px;
                          font-weight: bold;
                          letter-spacing: 8px;
                          color: #0b2e33;
                          font-family: monospace;
                        "
                      >
                        ${code}
                      </div>
                    </div>
                    <p style="font-size: 14px; text-align: center;">* This code will expire in 15 minutes *</p>
                    <p style="font-size: 14px; text-align: center;">
                      If you didn't request a password reset, you can safely ignore this email.
                    </p>
                    <div style="text-align: start; font-size: 14px; margin-top: 30px;">
                      <p><strong>Need help?</strong></p>
                      <p>Reach out to our team at <a href="mailto:hello@jinn-travel.com">hello@jinn-travel.com</a></p>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending password reset OTP:", error);
    throw error;
  }
};
