import jwt from "jsonwebtoken";
const { verify, TokenExpiredError, JsonWebTokenError } = jwt;

export const checkAuth = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace(/Bearer\s?/, "");

  if (!token) {
    return res.status(401).json({ message: "Access denied. Token required." });
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (error) {
    console.error("JWT Error:", error.name, error.message);

    if (error instanceof TokenExpiredError) {
      return res.status(401).json({ message: "Token expired" });
    }

    if (error instanceof JsonWebTokenError) {
      return res.status(401).json({ message: "Invalid token" });
    }

    return res.status(500).json({ message: "Internal auth error" });
  }
};

export const checkRole =
  (roles = []) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
