import rateLimit, { ipKeyGenerator } from "express-rate-limit";

const genericHandler = (_req, res) =>
  res
    .status(429)
    .json({ message: "Too many requests. Please try again later." });

const getEmail = (req) => {
  const raw = req?.body?.email;
  return typeof raw === "string" ? raw.trim().toLowerCase() : "";
};

export const passwordResetLimiterEmail = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  handler: genericHandler,
  validate: { keyGenerator: false }, // Отключает панику валидатора
  keyGenerator: (req) => {
    const email = getEmail(req);
    const ip = req.ip ? ipKeyGenerator(req.ip) : "127.0.0.1";
    return email ? `pwd-reset:email:${email}` : `pwd-reset:email:none:${ip}`;
  },
});

export const passwordResetLimiterIP = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: genericHandler,
  validate: { keyGenerator: false },
  keyGenerator: (req) => {
    const ip = req.ip ? ipKeyGenerator(req.ip) : "127.0.0.1";
    return `pwd-reset:ip:${ip}`;
  },
});

export const passwordResetLimiter = [
  passwordResetLimiterEmail,
  passwordResetLimiterIP,
];
