const jwt = require("jsonwebtoken");
const authenticateUser = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ errors: "token is required" });
  }
  try {
    const tokenData = jwt.verify(token, process.env.JWt_SECRET);
    req.user = {
      id: tokenData.id,
      role: tokenData.role,
    };
    next();
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

const authorizeUser = (permittedUser) => {
  return (req, res, next) => {
    if (permittedUser.includes(req.user.role)) {
      next();
    } else {
      return res
        .status(404)
        .json({ errors: "You are not authorized to access" });
    }
  };
};

module.exports = {
  authenticateUser,
  authorizeUser,
};
