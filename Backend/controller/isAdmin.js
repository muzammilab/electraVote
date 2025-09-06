// Middleware to check if the user is an admin
const User = require("../model/user");

const isAdmin = async (req, res, next) => {
  try {
    // JWT Token should be already decoded by jwtAuthMiddleware
    const user = await User.findById(req.user.id);

    if (!user || user.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }

    next();
  } catch (err) {
    res.status(401).json({ error: "Unauthorized" });
  }
};

module.exports = isAdmin;
