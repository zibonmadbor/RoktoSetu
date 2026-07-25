/**
 * Middleware to restrict access to admin users only.
 * Expects `req.user` to be attached by `verifyToken`.
 */
const checkAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required before checking admin privileges.',
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Forbidden. Access restricted to administrator accounts only.',
    });
  }

  next();
};

module.exports = { checkAdmin };
