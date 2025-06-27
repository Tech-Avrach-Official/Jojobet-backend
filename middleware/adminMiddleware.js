const isAdmin = (req, res, next) => {
  console.log("req.user in isAdmin:", req.user);
  if (req.user && req.user.role === "admin") {
    return next();
  }
  res.status(403).json({ message: "Access denied. Admins only." });
};

module.exports = { isAdmin };
