/**
 * Middleware to gate features requiring a fully completed profile.
 * Expects `req.user` to be attached by `verifyToken`.
 */
const checkProfileComplete = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required before checking profile completeness.',
    });
  }

  if (!req.user.isProfileComplete) {
    return res.status(403).json({
      success: false,
      message: 'Access restricted. Please complete your profile details first.',
      isProfileComplete: false,
    });
  }

  next();
};

module.exports = { checkProfileComplete };
