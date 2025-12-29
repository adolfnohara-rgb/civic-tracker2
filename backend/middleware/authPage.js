
const jwt = require("jsonwebtoken");

module.exports = (role) => {
  return (req, res, next) => {
    const token = req.headers.cookie?.split("=")[1];
    if (!token) return res.redirect("/");

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (role && decoded.role !== role) {
        return res.redirect("/");
      }
      next();
    } catch {
      return res.redirect("/");
    }
  };
};
