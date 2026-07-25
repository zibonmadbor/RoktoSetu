const nodemailer = require('nodemailer');

/**
 * Configure Nodemailer Transporter
 */
const createTransporter = async () => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // Fallback to Ethereal Test Account if no SMTP settings provided
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
};

/**
 * Send Welcome Email on User Registration
 */
const sendWelcomeEmail = async (user) => {
  try {
    const transporter = await createTransporter();
    const info = await transporter.sendMail({
      from: '"RaktoSetu Support" <no-reply@raktosetu.org>',
      to: user.email,
      subject: 'Welcome to RaktoSetu — Life-Saving Blood Network',
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 24px; borderRadius: 16px;">
          <h2 style="color: #ef4444;">Welcome to RaktoSetu, ${user.name}!</h2>
          <p>Thank you for joining Bangladesh's voluntary blood donor network.</p>
          <p><strong>Your Account Details:</strong></p>
          <ul>
            <li><strong>Role:</strong> ${user.role}</li>
            <li><strong>Blood Group:</strong> ${user.bloodGroup || 'Not specified'}</li>
            <li><strong>District:</strong> ${user.district || 'Not specified'}</li>
          </ul>
          <p>Ensure your profile is 100% complete so you can access donor contacts and emergency alerts.</p>
          <p style="color: #64748b; font-size: 12px;">RaktoSetu — Dedicated to saving lives.</p>
        </div>
      `,
    });
    console.log('[Email Sent] Welcome Email:', info.messageId);
    if (nodemailer.getTestMessageUrl(info)) {
      console.log('[Ethereal Test Mail URL]:', nodemailer.getTestMessageUrl(info));
    }
  } catch (error) {
    console.error('Failed to send welcome email:', error.message);
  }
};

/**
 * Send Alert Email to Donor for Urgent Blood Request
 */
const sendBloodRequestAlert = async (donor, bloodRequest) => {
  try {
    const transporter = await createTransporter();
    const info = await transporter.sendMail({
      from: '"RaktoSetu Emergency" <alerts@raktosetu.org>',
      to: donor.email,
      subject: `🚨 URGENT: ${bloodRequest.bloodGroupNeeded} Blood Needed in ${bloodRequest.district}`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 24px; borderRadius: 16px;">
          <h2 style="color: #ef4444;">Urgent Blood Request Alert</h2>
          <p>Dear ${donor.name},</p>
          <p>An urgent request matching your blood group (<strong>${bloodRequest.bloodGroupNeeded}</strong>) has just been posted in <strong>${bloodRequest.district}</strong>.</p>
          <div style="background-color: #1e293b; padding: 16px; border-radius: 12px; margin: 16px 0;">
            <p style="margin: 4px 0;"><strong>Hospital:</strong> ${bloodRequest.hospitalName}</p>
            <p style="margin: 4px 0;"><strong>Urgency Level:</strong> ${bloodRequest.urgencyLevel.toUpperCase()}</p>
            <p style="margin: 4px 0;"><strong>Reason:</strong> ${bloodRequest.reason || 'N/A'}</p>
          </div>
          <p>If you are available to donate, please log in to RaktoSetu to connect with the patient.</p>
        </div>
      `,
    });
    console.log('[Email Sent] Blood Request Alert:', info.messageId);
  } catch (error) {
    console.error('Failed to send blood request alert:', error.message);
  }
};

/**
 * Send Confirmation Email when Admin Verifies a Donation
 */
const sendDonationVerifiedEmail = async (donor, donation) => {
  try {
    const transporter = await createTransporter();
    const info = await transporter.sendMail({
      from: '"RaktoSetu Verification" <no-reply@raktosetu.org>',
      to: donor.email,
      subject: '🏆 Blood Donation Verified — Thank You!',
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 24px; borderRadius: 16px;">
          <h2 style="color: #10b981;">Donation Verified!</h2>
          <p>Dear ${donor.name},</p>
          <p>Your recent blood donation on <strong>${new Date(donation.donationDate).toLocaleDateString()}</strong> at <strong>${donation.location}</strong> has been officially verified by RaktoSetu Administrators.</p>
          <p><strong>Updated Stats:</strong> Total Verified Donations: <strong>${donor.totalDonations}</strong></p>
          <p>Thank you for your life-saving contribution to society!</p>
        </div>
      `,
    });
    console.log('[Email Sent] Donation Verified Email:', info.messageId);
  } catch (error) {
    console.error('Failed to send donation verification email:', error.message);
  }
};

module.exports = {
  sendWelcomeEmail,
  sendBloodRequestAlert,
  sendDonationVerifiedEmail,
};
