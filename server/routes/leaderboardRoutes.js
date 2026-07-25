const express = require('express');
const { getLeaderboard } = require('../controllers/userController');

const router = express.Router();

// GET /api/leaderboard
router.get('/', getLeaderboard);

module.exports = router;
