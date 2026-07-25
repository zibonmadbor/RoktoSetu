const Message = require('../models/Message');

/**
 * @route   POST /api/contact
 * @desc    Submit a support / inquiry message
 * @access  Public
 */
const submitContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, subject, and message.',
      });
    }

    const newMessage = await Message.create({
      name,
      email,
      subject,
      message,
    });

    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully. Our support team will get back to you shortly.',
      data: newMessage,
    });
  } catch (error) {
    console.error('Submit Contact Message Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error submitting message',
      error: error.message,
    });
  }
};

/**
 * @route   GET /api/contact
 * @desc    Get list of all support messages
 * @access  Private (Admin Only)
 */
const getContactMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    console.error('Get Contact Messages Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching contact messages',
      error: error.message,
    });
  }
};

/**
 * @route   PUT /api/contact/:id/read
 * @desc    Toggle message read/unread status
 * @access  Private (Admin Only)
 */
const toggleMessageRead = async (req, res) => {
  try {
    const msg = await Message.findById(req.params.id);
    if (!msg) {
      return res.status(404).json({
        success: false,
        message: 'Message not found',
      });
    }

    msg.isRead = !msg.isRead;
    await msg.save();

    res.status(200).json({
      success: true,
      data: msg,
    });
  } catch (error) {
    console.error('Toggle Message Read Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating message read status',
      error: error.message,
    });
  }
};

module.exports = {
  submitContactMessage,
  getContactMessages,
  toggleMessageRead,
};
