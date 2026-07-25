const express = require('express');
const {
  submitContactMessage,
  getContactMessages,
  toggleMessageRead,
} = require('../controllers/contactController');
const { verifyToken } = require('../middleware/auth');
const { checkAdmin } = require('../middleware/checkAdmin');

const router = express.Router();

// POST /api/contact (Public support submission)
router.post('/', submitContactMessage);

// GET /api/contact (Admin list messages)
router.get('/', verifyToken, checkAdmin, getContactMessages);

// PUT /api/contact/:id/read (Admin toggle read status)
router.put('/:id/read', verifyToken, checkAdmin, toggleMessageRead);

module.exports = router;
