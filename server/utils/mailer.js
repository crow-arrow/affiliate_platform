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

export const sendVerificationEmail = async (email, username, token) => {
  try {
    const verificationLink = `${process.env.CLIENT_URL}/verify-email/${token}`;

    const mailOptions = {
      from: `"Jinn Travel" <hello@jinn-travel.com>`,
      to: email,
      subject: "Email verification",
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
                        background-color: #0b2e33; /* fallback */
                        font-size: 24px;
                        font-weight: bold;
                        color: white !important;
                        margin: 50px 0;
                        -webkit-text-fill-color: white !important;
                        color-scheme: light;
                      "
                    >
                      <span style="color: white !important; -webkit-text-fill-color: white !important;">NEW PARTNER</span>
                    </div>
                    <div style="text-align: start; color">
                      <h1>Email Confirmation</h1>
                      <p>Hello ${username || ""},</p>
                      <p>Click the link below to confirm your email:</p>
                    </div>
                    <div class="center" style="text-align: start; margin: 50px 0">
                      <table
                        role="presentation"
                        border="0"
                        cellspacing="0"
                        cellpadding="0"
                      >
                        <tr>
                          <td
                            style="
                              border-radius: 8px;
                              border: 2px solid #0b2e33;
                              padding: 12px 24px;
                              text-align: center;
                            "
                          >
                            <a
                              href="${verificationLink}"
                              style="
                                color: #0b2e33;
                                text-decoration: none;
                                font-weight: bold;
                                display: inline-block;
                              "
                              >Verify your account</a
                            >
                          </td>
                        </tr>
                      </table>
                    </div>
                    <p style="font-size: 14px">* the link will expire in 15 minutes *</p>
                    <div style="text-align: start; font-size: 14px;">
                      <p><strong>Didn't expect this email?</strong></p>
                      <p>
                        Reach out to our team to make sure your account is secure.
                        <span style="display: inline-block; width: 1px; height: 1px;">&zwnj;</span>
                      </p>
                      <span>
                        <img
                          data-emoji="✉️"
                          class="icon"
                          alt="✉️"
                          aria-label="✉️"
                          draggable="false"
                          src="https://fonts.gstatic.com/s/e/notoemoji/16.0/2709_fe0f/72.png"
                          style="width: 24px; height: auto"
                        />
                        <a
                          style="font-weight: normal; color: black;"
                          href="mailto:hello@jinn-travel.com?subject=I%20want%20to%20protect%20my%20account"
                        >
                          hello@jinn-travel.com
                        </a>
                      </span>
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
    console.error("Error sending verification email:", error);
    throw error;
  }
};

export const sendPasswordResetEmail = async (email, username, resetLink) => {
  const mailOptions = {
    from: `"Jinn Travel" <hello@jinn-travel.com>`,
    to: email,
    subject: "Password recover",
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
                        background-color: #0b2e33; /* fallback */
                        font-size: 1.5rem;
                        font-weight: bold;
                        color: white !important;
                        margin: 50px 0;
                        -webkit-text-fill-color: white !important;
                        color-scheme: light;
                      "
                    >
                      <span
                        style="
                          display: inline-flex;
                          align-items: center;
                          color: white !important;
                          -webkit-text-fill-color: white !important;
                        "
                      >
                        *** Password recover ***
                      </span>
                    </div>
                    <div style="text-align: start; color">
                      <p>Hello ${username || ""},</p>
                      <p>you requested a reset link for your password. Simply click on the link below and create a new password:</p>
                    </div>
                    <div class="center" style="text-align: start; margin: 50px 0">
                      <table
                        role="presentation"
                        border="0"
                        cellspacing="0"
                        cellpadding="0"
                      >
                        <tr>
                          <td
                            style="
                              border-radius: 8px;
                              border: 2px solid #0b2e33;
                              padding: 12px 24px;
                              text-align: center;
                            "
                          >
                            <a
                              href="${resetLink}"
                              style="
                                color: #0b2e33;
                                text-decoration: none;
                                font-weight: bold;
                                display: inline-block;
                              "
                            >
                              Reset Password
                            </a>
                          </td>
                        </tr>
                      </table>
                    </div>
                    <p style="font-size: 14px">* the link will expire in 15 minutes *</p>
                    <div style="text-align: start; font-size: 14px;">
                      <p><strong>Didn't expect this email?</strong></p>
                      <p>
                        Reach out to our team to make sure your account is secure.
                        <span style="display: inline-block; width: 1px; height: 1px;">&zwnj;</span>
                      </p>
                      <span>
                        <img
                          data-emoji="✉️"
                          class="icon"
                          alt="✉️"
                          aria-label="✉️"
                          draggable="false"
                          src="https://fonts.gstatic.com/s/e/notoemoji/16.0/2709_fe0f/72.png"
                          style="width: 24px; height: auto"
                        />
                        <a
                          style="font-weight: normal; color: black;"
                          href="mailto:hello@jinn-travel.com?subject=I%20want%20to%20protect%20my%20account"
                        >
                          hello@jinn-travel.com
                        </a>
                      </span>
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
};
