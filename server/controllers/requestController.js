const BloodRequest = require('../models/BloodRequest');
const User = require('../models/User');
const { sendBloodRequestAlert } = require('../config/email');

/**
 * @route   POST /api/requests
 * @desc    Create a new emergency blood request
 * @access  Private (Requires verifyToken AND checkProfileComplete)
 */
const createBloodRequest = async (req, res) => {
  try {
    const { bloodGroupNeeded, hospitalName, district, urgencyLevel, reason } = req.body;

    if (!bloodGroupNeeded || !hospitalName || !district) {
      return res.status(400).json({
        success: false,
        message: 'Please provide bloodGroupNeeded, hospitalName, and district.',
      });
    }

    const bloodRequest = await BloodRequest.create({
      requestedBy: req.user._id,
      bloodGroupNeeded,
      hospitalName,
      district,
      urgencyLevel: urgencyLevel || 'normal',
      reason,
      status: 'pending',
    });

    // Notify matching available donors via Email for Urgent / Critical requests
    if (urgencyLevel === 'urgent' || urgencyLevel === 'critical') {
      User.find({
        role: 'donor',
        bloodGroup: bloodGroupNeeded,
        district: { $regex: district, $options: 'i' },
        isAvailable: true,
      })
        .limit(10)
        .then((donors) => {
          donors.forEach((donor) => sendBloodRequestAlert(donor, bloodRequest));
        })
        .catch((err) => console.error('Failed to query matching donors for email alerts:', err));
    }

    const populatedRequest = await BloodRequest.findById(bloodRequest._id).populate(
      'requestedBy',
      'name bloodGroup district profilePhoto'
    );

    res.status(201).json({
      success: true,
      message: 'Blood request created successfully',
      data: populatedRequest,
    });
  } catch (error) {
    console.error('Create Request Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating blood request',
      error: error.message,
    });
  }
};

/**
 * @route   GET /api/requests
 * @desc    List blood requests with filters (bloodGroup, district, status, urgencyLevel) & pagination
 * @access  Public
 */
const getBloodRequests = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const query = {};

    if (req.query.bloodGroup || req.query.bloodGroupNeeded) {
      query.bloodGroupNeeded = req.query.bloodGroup || req.query.bloodGroupNeeded;
    }

    if (req.query.district) {
      query.district = { $regex: req.query.district, $options: 'i' };
    }

    if (req.query.status) {
      query.status = req.query.status;
    }

    if (req.query.urgencyLevel) {
      query.urgencyLevel = req.query.urgencyLevel;
    }

    const total = await BloodRequest.countDocuments(query);

    const requests = await BloodRequest.find(query)
      .populate('requestedBy', 'name bloodGroup district profilePhoto phone email')
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: requests.length,
      total,
      page,
      pages: Math.ceil(total / limit) || 1,
      data: requests,
    });
  } catch (error) {
    console.error('Get Requests Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching blood requests',
      error: error.message,
    });
  }
};

/**
 * @route   PUT /api/requests/:id/status
 * @desc    Update blood request status (fulfilled / cancelled / pending)
 * @access  Private (Requires verifyToken, requester or admin)
 */
const updateBloodRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['pending', 'fulfilled', 'cancelled'];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Allowed values: pending, fulfilled, cancelled.',
      });
    }

    const bloodRequest = await BloodRequest.findById(req.params.id);

    if (!bloodRequest) {
      return res.status(404).json({
        success: false,
        message: 'Blood request not found',
      });
    }

    const isCreator = bloodRequest.requestedBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isCreator && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this blood request status',
      });
    }

    bloodRequest.status = status;
    await bloodRequest.save();

    res.status(200).json({
      success: true,
      message: `Blood request status updated to ${status}`,
      data: bloodRequest,
    });
  } catch (error) {
    console.error('Update Request Status Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating request status',
      error: error.message,
    });
  }
};

module.exports = {
  createBloodRequest,
  getBloodRequests,
  updateBloodRequestStatus,
};
