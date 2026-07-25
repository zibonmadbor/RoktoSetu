const express = require('express');
const {
  getAdminStats,
  getAllUsers,
  updateUser,
  deleteUser,
  getDonations,
  verifyDonation,
} = require('../controllers/adminController');
const { verifyToken } = require('../middleware/auth');
const { checkAdmin } = require('../middleware/checkAdmin');

const router = express.Router();

// Apply verifyToken and checkAdmin globally to all admin routes
router.use(verifyToken, checkAdmin);

// GET /api/admin/stats
router.get('/stats', getAdminStats);

// GET /api/admin/users
router.get('/users', getAllUsers);

// PUT /api/admin/users/:id
router.put('/users/:id', updateUser);

// DELETE /api/admin/users/:id
router.delete('/users/:id', deleteUser);

// GET /api/admin/donations
router.get('/donations', getDonations);

// POST /api/admin/donations/verify
router.post('/donations/verify', verifyDonation);

module.exports = router;
