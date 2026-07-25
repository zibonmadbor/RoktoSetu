const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');

dotenv.config({ path: path.join(__dirname, '../.env') });

const seedAdmin = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/raktosetu';
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to MongoDB database...');

    const adminEmail = 'admin@raktosetu.org';
    const adminPassword = 'admin123456';

    let admin = await User.findOne({ email: adminEmail });

    if (admin) {
      console.log(`[Seed] Admin user already exists with email: ${adminEmail}`);
      admin.role = 'admin';
      admin.isProfileComplete = true;
      await admin.save();
      console.log('[Seed] Admin privileges updated.');
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminPassword, salt);

      admin = await User.create({
        name: 'System Administrator',
        email: adminEmail,
        password: hashedPassword,
        phone: '01700000000',
        role: 'admin',
        bloodGroup: 'O+',
        district: 'Dhaka',
        address: 'RaktoSetu HQ, Panthapath, Dhaka',
        isProfileComplete: true,
      });

      console.log('[Seed] Default Admin User Created Successfully:');
      console.log(`Email: ${adminEmail}`);
      console.log(`Password: ${adminPassword}`);
      console.log(`Role: ${admin.role}`);
    }

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedAdmin();
