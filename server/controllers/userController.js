const User = require('../models/User');

/**
 * Helper to compute donor badge based on totalDonations count
 */
const computeBadge = (totalDonations = 0) => {
  if (totalDonations >= 20) return 'Platinum';
  if (totalDonations >= 10) return 'Gold';
  if (totalDonations >= 5) return 'Silver';
  if (totalDonations >= 1) return 'Bronze';
  return 'None';
};

/**
 * @route   GET /api/donors
 * @desc    List all donors with pagination and filters (Limited fields only)
 * @access  Public
 */
const getDonors = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const query = { role: 'donor' };

    if (req.query.bloodGroup) {
      query.bloodGroup = req.query.bloodGroup;
    }

    if (req.query.district) {
      query.district = { $regex: req.query.district, $options: 'i' };
    }

    if (req.query.isAvailable !== undefined) {
      query.isAvailable = req.query.isAvailable === 'true' || req.query.isAvailable === true;
    }

    const total = await User.countDocuments(query);

    // STRICT PROJECTION: Only include public fields, NEVER phone/email/address
    const donors = await User.find(query)
      .select('name bloodGroup district profilePhoto totalDonations isAvailable lastDonationDate _id')
      .sort({ totalDonations: -1, createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: donors.length,
      total,
      page,
      pages: Math.ceil(total / limit) || 1,
      data: donors,
    });
  } catch (error) {
    console.error('Get Donors Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching donors',
      error: error.message,
    });
  }
};

/**
 * @route   GET /api/donors/:id/full
 * @desc    Get full donor contact details
 * @access  Private (Requires verifyToken AND checkProfileComplete)
 */
const getDonorFullDetails = async (req, res) => {
  try {
    const donor = await User.findOne({ _id: req.params.id, role: 'donor' }).select('-password');

    if (!donor) {
      return res.status(404).json({
        success: false,
        message: 'Donor not found',
      });
    }

    res.status(200).json({
      success: true,
      data: donor,
    });
  } catch (error) {
    console.error('Get Donor Full Details Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching donor details',
      error: error.message,
    });
  }
};

/**
 * @route   GET /api/recipients
 * @desc    List all recipients with pagination and filters (Limited fields only)
 * @access  Public
 */
const getRecipients = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const query = { role: 'recipient' };

    if (req.query.bloodGroup) {
      query.bloodGroup = req.query.bloodGroup;
    }

    if (req.query.district) {
      query.district = { $regex: req.query.district, $options: 'i' };
    }

    const total = await User.countDocuments(query);

    // STRICT PROJECTION: Only include non-sensitive fields, NEVER phone/email/address
    const recipients = await User.find(query)
      .select('name bloodGroup district profilePhoto recipientDetails createdAt _id')
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: recipients.length,
      total,
      page,
      pages: Math.ceil(total / limit) || 1,
      data: recipients,
    });
  } catch (error) {
    console.error('Get Recipients Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching recipients',
      error: error.message,
    });
  }
};

/**
 * @route   GET /api/recipients/:id/full
 * @desc    Get full recipient contact details
 * @access  Private (Requires verifyToken AND checkProfileComplete)
 */
const getRecipientFullDetails = async (req, res) => {
  try {
    const recipient = await User.findOne({ _id: req.params.id, role: 'recipient' }).select('-password');

    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: 'Recipient not found',
      });
    }

    res.status(200).json({
      success: true,
      data: recipient,
    });
  } catch (error) {
    console.error('Get Recipient Full Details Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching recipient details',
      error: error.message,
    });
  }
};

/**
 * @route   GET /api/leaderboard
 * @desc    Top donors sorted by totalDonations descending with badge calculation (Max 50)
 * @access  Public
 */
const getLeaderboard = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const requestedLimit = parseInt(req.query.limit, 10) || 10;
    const limit = Math.min(requestedLimit, 50); // Capped at top 50
    const startIndex = (page - 1) * limit;

    const query = { role: 'donor' };

    const total = await User.countDocuments(query);

    const donors = await User.find(query)
      .select('name bloodGroup district profilePhoto totalDonations lastDonationDate _id')
      .sort({ totalDonations: -1, lastDonationDate: -1, createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    const leaderboardData = donors.map((donor) => {
      const donorObj = donor.toObject();
      donorObj.badge = computeBadge(donorObj.totalDonations);
      return donorObj;
    });

    res.status(200).json({
      success: true,
      count: leaderboardData.length,
      total: Math.min(total, 50),
      page,
      pages: Math.ceil(Math.min(total, 50) / limit) || 1,
      data: leaderboardData,
    });
  } catch (error) {
    console.error('Get Leaderboard Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching leaderboard',
      error: error.message,
    });
  }
};

module.exports = {
  computeBadge,
  getDonors,
  getDonorFullDetails,
  getRecipients,
  getRecipientFullDetails,
  getLeaderboard,
};
