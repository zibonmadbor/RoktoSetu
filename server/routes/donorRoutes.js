const express = require('express');
const { getDonors, getDonorFullDetails } = require('../controllers/userController');
const { verifyToken } = require('../middleware/auth');
const { checkProfileComplete } = require('../middleware/checkProfileComplete');

const router = express.Router();

// GET /api/donors
router.get('/', getDonors);

// GET /api/donors/:id/full
router.get('/:id/full', verifyToken, checkProfileComplete, getDonorFullDetails);

module.exports = router;
