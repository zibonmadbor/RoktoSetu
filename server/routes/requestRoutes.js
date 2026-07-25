const express = require('express');
const { createBloodRequest, getBloodRequests, updateBloodRequestStatus } = require('../controllers/requestController');
const { verifyToken } = require('../middleware/auth');
const { checkProfileComplete } = require('../middleware/checkProfileComplete');

const router = express.Router();

// POST /api/requests (Create blood request)
router.post('/', verifyToken, checkProfileComplete, createBloodRequest);

// GET /api/requests (List requests with filters)
router.get('/', getBloodRequests);

// PUT /api/requests/:id/status (Update request status)
router.put('/:id/status', verifyToken, updateBloodRequestStatus);

module.exports = router;
