const express = require('express');
const { getRecipients, getRecipientFullDetails } = require('../controllers/userController');
const { verifyToken } = require('../middleware/auth');
const { checkProfileComplete } = require('../middleware/checkProfileComplete');

const router = express.Router();

// GET /api/recipients
router.get('/', getRecipients);

// GET /api/recipients/:id/full
router.get('/:id/full', verifyToken, checkProfileComplete, getRecipientFullDetails);

module.exports = router;
