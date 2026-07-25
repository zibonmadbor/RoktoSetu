const express = require('express');
const { body } = require('express-validator');
const { registerUser, loginUser, getMe, updateProfile } = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');
const { uploadProfilePhoto } = require('../middleware/upload');

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register user
 */
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please provide a valid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('phone').trim().notEmpty().withMessage('Phone number is required'),
    body('role').optional().isIn(['donor', 'recipient']).withMessage('Role must be either donor or recipient'),
    body('bloodGroup')
      .optional()
      .isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
      .withMessage('Invalid blood group'),
  ],
  registerUser
);

/**
 * @route   POST /api/auth/login
 * @desc    Login user & get JWT token
 */
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please provide a valid email address'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  loginUser
);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 */
router.get('/me', verifyToken, getMe);

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile & upload profile photo
 */
router.put('/profile', verifyToken, uploadProfilePhoto.single('profilePhoto'), updateProfile);

module.exports = router;
