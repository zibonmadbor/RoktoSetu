const User = require('../models/User');
const BloodRequest = require('../models/BloodRequest');
const Donation = require('../models/Donation');
const { sendDonationVerifiedEmail } = require('../config/email');

/**
 * @route   GET /api/admin/stats
 * @desc    Get aggregate statistics and data distributions for admin dashboard
 * @access  Private (Admin only)
 */
const getAdminStats = async (req, res) => {
  try {
    const totalDonors = await User.countDocuments({ role: 'donor' });
    const totalRecipients = await User.countDocuments({ role: 'recipient' });
    const pendingRequests = await BloodRequest.countDocuments({ status: 'pending' });

    // Total donations aggregated across all donors
    const donationAggregate = await User.aggregate([
      { $match: { role: 'donor' } },
      { $group: { _id: null, total: { $sum: '$totalDonations' } } },
    ]);
    const totalDonations = donationAggregate[0]?.total || 0;

    // Registrations this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const newRegistrationsThisMonth = await User.countDocuments({
      createdAt: { $gte: startOfMonth },
    });

    // Blood Group Distribution for PieChart
    const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    const bloodGroupDistribution = await Promise.all(
      bloodGroups.map(async (bg) => {
        const count = await User.countDocuments({ role: 'donor', bloodGroup: bg });
        return { name: bg, value: count };
      })
    );

    // Mock/Aggregated Monthly Registrations for LineChart
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
    const monthlyRegistrations = months.map((month, idx) => ({
      month,
      registrations: Math.floor(Math.random() * 30) + 10 + idx * 5,
    }));

    // Mock/Aggregated Monthly Donations for BarChart
    const monthlyDonations = months.map((month, idx) => ({
      month,
      donations: Math.floor(Math.random() * 45) + 15 + idx * 8,
    }));

    res.status(200).json({
      success: true,
      data: {
        totalDonors,
        totalRecipients,
        totalDonations,
        pendingRequests,
        newRegistrationsThisMonth,
        bloodGroupDistribution,
        monthlyRegistrations,
        monthlyDonations,
      },
    });
  } catch (error) {
    console.error('Admin Stats Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching admin statistics',
      error: error.message,
    });
  }
};

/**
 * @route   GET /api/admin/users
 * @desc    Search, filter, and list all registered users
 * @access  Private (Admin only)
 */
const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;

    const query = {};

    if (req.query.search) {
      const searchRegex = { $regex: req.query.search, $options: 'i' };
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
        { district: searchRegex },
      ];
    }

    if (req.query.role) {
      query.role = req.query.role;
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      page,
      pages: Math.ceil(total / limit) || 1,
      data: users,
    });
  } catch (error) {
    console.error('Get Admin Users Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching users',
      error: error.message,
    });
  }
};

/**
 * @route   PUT /api/admin/users/:id
 * @desc    Update user profile, role, or availability status as admin
 * @access  Private (Admin only)
 */
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const allowedFields = ['name', 'phone', 'role', 'bloodGroup', 'district', 'address', 'isAvailable', 'isProfileComplete'];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    await user.save();
    const updatedUser = user.toObject();
    delete updatedUser.password;

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    console.error('Update User Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating user',
      error: error.message,
    });
  }
};

/**
 * @route   DELETE /api/admin/users/:id
 * @desc    Delete a user account as admin
 * @access  Private (Admin only)
 */
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.role === 'admin' && user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Admin cannot delete their own active account',
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Delete User Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting user',
      error: error.message,
    });
  }
};

/**
 * @route   GET /api/admin/donations
 * @desc    Get list of reported/recorded blood donations
 * @access  Private (Admin only)
 */
const getDonations = async (req, res) => {
  try {
    const donations = await Donation.find()
      .populate('donor', 'name email phone bloodGroup district totalDonations')
      .populate('verifiedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: donations.length,
      data: donations,
    });
  } catch (error) {
    console.error('Get Donations Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching donations',
      error: error.message,
    });
  }
};

/**
 * @route   POST /api/admin/donations/verify
 * @desc    Admin confirms/records a donation, incrementing donor totalDonations and updating lastDonationDate
 * @access  Private (Admin only)
 */
const verifyDonation = async (req, res) => {
  try {
    const { donorId, location, donationDate } = req.body;

    if (!donorId) {
      return res.status(400).json({
        success: false,
        message: 'Donor ID is required to verify a donation',
      });
    }

    const donor = await User.findById(donorId);
    if (!donor || donor.role !== 'donor') {
      return res.status(404).json({
        success: false,
        message: 'Donor user account not found',
      });
    }

    const newDonationDate = donationDate ? new Date(donationDate) : new Date();

    // Create Donation log
    const donation = await Donation.create({
      donor: donor._id,
      verifiedBy: req.user._id,
      donationDate: newDonationDate,
      location: location || donor.district || 'Verified Center',
    });

    // Increment totalDonations and update lastDonationDate
    donor.totalDonations = (donor.totalDonations || 0) + 1;
    donor.lastDonationDate = newDonationDate;
    await donor.save();

    // Trigger Email Notification to Donor
    sendDonationVerifiedEmail(donor, donation);

    res.status(201).json({
      success: true,
      message: `Donation verified! Donor ${donor.name} now has ${donor.totalDonations} total donations.`,
      data: donation,
    });
  } catch (error) {
    console.error('Verify Donation Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error verifying donation',
      error: error.message,
    });
  }
};

module.exports = {
  getAdminStats,
  getAllUsers,
  updateUser,
  deleteUser,
  getDonations,
  verifyDonation,
};
