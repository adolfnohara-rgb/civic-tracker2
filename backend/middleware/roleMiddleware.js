// module.exports = (role) => {
//   return (req, res, next) => {
//     if (req.user.role !== role)
//       return res.status(403).json({ message: "Access denied" });
//     next();
//   };
// };



module.exports = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== requiredRole) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};
