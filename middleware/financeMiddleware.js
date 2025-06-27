const isFinance = (req, res, next) => {
    if (req.user && req.user.role === "finance") return next();
    res.status(403).json({ message: "Access denied. Finance team only." });
  };
  
  module.exports = { isFinance };
  