import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 587,
  auth: {
    user: "2df8216a2b034a",
    pass: "7520fc7cf4a733",
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log("SMTP error:", error);
  } else {
    console.log("SMTP server is ready to send emails", success);
  }
});

export default transporter;
