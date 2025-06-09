import jwt from "jsonwebtoken";
const { verify } = jwt;

export const checkAuth = (req, res, next) => {
  const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");

  if (!token) {
    return res.status(401).json({
      message: "No access",
    });
  }
  try {
    const decoded = verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    return next();
  } catch (error) {
    console.error("JWT Verification Error:", error);
    return res.status(401).json({
      message: "No access",
    });
  }
};
