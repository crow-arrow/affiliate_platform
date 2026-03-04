import rateLimit from "express-rate-limit";

// Унифицированный обработчик — не раскрываем детали причины блокировки
const genericHandler = (_req, res) =>
  res
    .status(429)
    .json({ message: "Too many requests. Please try again later." });

const getEmail = (req) => {
  const raw = req?.body?.email;
  return typeof raw === "string" ? raw.trim().toLowerCase() : "";
};

// Персональный лимит по email (строже)
export const passwordResetLimiterEmail = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 минут
  max: 3, // на один email
  standardHeaders: true,
  legacyHeaders: false,
  handler: genericHandler,
  keyGenerator: (req) => {
    const email = getEmail(req);
    return email
      ? `pwd-reset:email:${email}`
      : `pwd-reset:email:none:${req.ip}`;
  },
});

// Дополнительный общий лимит по IP (мягче)
export const passwordResetLimiterIP = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: genericHandler,
  keyGenerator: (req) => `pwd-reset:ip:${req.ip}`,
});

// Экспортируем составной лимитер — подключается как массив middleware
export const passwordResetLimiter = [
  passwordResetLimiterEmail,
  passwordResetLimiterIP,
];
