const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');
const BloodRequest = require('../models/BloodRequest');
const Donation = require('../models/Donation');

dotenv.config({ path: path.join(__dirname, '../.env') });

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/raktosetu';
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to MongoDB for data decoration...');

    const salt = await bcrypt.genSalt(10);
    const defaultPassword = await bcrypt.hash('password123', salt);

    // Sample Donors Data
    const donorsData = [
      {
        name: 'Dr. Ariful Islam',
        email: 'ariful.donor@example.com',
        password: defaultPassword,
        phone: '01711122334',
        role: 'donor',
        bloodGroup: 'O+',
        age: 32,
        gender: 'male',
        district: 'Dhaka',
        address: 'Dhanmondi Road 27, Dhaka',
        isProfileComplete: true,
        totalDonations: 22,
        isAvailable: true,
        lastDonationDate: new Date('2026-04-15'),
      },
      {
        name: 'Nusrat Sharmin',
        email: 'nusrat.donor@example.com',
        password: defaultPassword,
        phone: '01822334455',
        role: 'donor',
        bloodGroup: 'A+',
        age: 26,
        gender: 'female',
        district: 'Chittagong',
        address: 'GEC Circle, Chittagong',
        isProfileComplete: true,
        totalDonations: 14,
        isAvailable: true,
        lastDonationDate: new Date('2026-03-20'),
      },
      {
        name: 'Tanvir Ahmed',
        email: 'tanvir.donor@example.com',
        password: defaultPassword,
        phone: '01933445566',
        role: 'donor',
        bloodGroup: 'B+',
        age: 29,
        gender: 'male',
        district: 'Sylhet',
        address: 'Zindabazar, Sylhet',
        isProfileComplete: true,
        totalDonations: 8,
        isAvailable: true,
        lastDonationDate: new Date('2026-05-10'),
      },
      {
        name: 'Sabrina Rahman',
        email: 'sabrina.donor@example.com',
        password: defaultPassword,
        phone: '01544556677',
        role: 'donor',
        bloodGroup: 'AB+',
        age: 24,
        gender: 'female',
        district: 'Dhaka',
        address: 'Uttara Sector 7, Dhaka',
        isProfileComplete: true,
        totalDonations: 3,
        isAvailable: true,
        lastDonationDate: new Date('2026-02-01'),
      },
      {
        name: 'Kazi Mahbub',
        email: 'mahbub.donor@example.com',
        password: defaultPassword,
        phone: '01655667788',
        role: 'donor',
        bloodGroup: 'O-',
        age: 38,
        gender: 'male',
        district: 'Rajshahi',
        address: 'Shaheb Bazar, Rajshahi',
        isProfileComplete: true,
        totalDonations: 19,
        isAvailable: true,
        lastDonationDate: new Date('2026-01-18'),
      },
      {
        name: 'Fatema Khatun',
        email: 'fatema.donor@example.com',
        password: defaultPassword,
        phone: '01766778899',
        role: 'donor',
        bloodGroup: 'B-',
        age: 27,
        gender: 'female',
        district: 'Khulna',
        address: 'Sonadanga, Khulna',
        isProfileComplete: true,
        totalDonations: 6,
        isAvailable: true,
        lastDonationDate: new Date('2026-03-05'),
      },
      {
        name: 'Shakil Hossain',
        email: 'shakil.donor@example.com',
        password: defaultPassword,
        phone: '01877889900',
        role: 'donor',
        bloodGroup: 'A-',
        age: 31,
        gender: 'male',
        district: 'Barisal',
        address: 'Sadat Road, Barisal',
        isProfileComplete: true,
        totalDonations: 11,
        isAvailable: true,
        lastDonationDate: new Date('2026-04-02'),
      },
    ];

    // Sample Recipients (Collectors) Data
    const recipientsData = [
      {
        name: 'Kamrul Hasan (Patient Relative)',
        email: 'kamrul.collector@example.com',
        password: defaultPassword,
        phone: '01799001122',
        role: 'recipient',
        bloodGroup: 'B+',
        district: 'Dhaka',
        address: 'Panthapath, Dhaka',
        isProfileComplete: true,
      },
      {
        name: 'Mehedi Hasan (Collector)',
        email: 'mehedi.collector@example.com',
        password: defaultPassword,
        phone: '01800112233',
        role: 'recipient',
        bloodGroup: 'O+',
        district: 'Chittagong',
        address: 'Agrabad, Chittagong',
        isProfileComplete: true,
      },
    ];

    console.log('[Seed] Upserting Donors and Recipients...');

    const createdDonors = [];
    for (const d of donorsData) {
      let u = await User.findOne({ email: d.email });
      if (!u) {
        u = await User.create(d);
      } else {
        Object.assign(u, d);
        await u.save();
      }
      createdDonors.push(u);
    }

    const createdRecipients = [];
    for (const r of recipientsData) {
      let u = await User.findOne({ email: r.email });
      if (!u) {
        u = await User.create(r);
      } else {
        Object.assign(u, r);
        await u.save();
      }
      createdRecipients.push(u);
    }

    // Seed Blood Requests
    console.log('[Seed] Creating Emergency Blood Requests...');
    await BloodRequest.deleteMany({}); // refresh requests

    const sampleRequests = [
      {
        requestedBy: createdRecipients[0]._id,
        bloodGroupNeeded: 'B+',
        hospitalName: 'Square Hospital, Dhaka',
        district: 'Dhaka',
        urgencyLevel: 'critical',
        status: 'pending',
        reason: 'Emergency CABG heart surgery. Required 2 bags B+ blood immediately.',
      },
      {
        requestedBy: createdRecipients[1]._id,
        bloodGroupNeeded: 'O+',
        hospitalName: 'Chittagong Medical College Hospital',
        district: 'Chittagong',
        urgencyLevel: 'urgent',
        status: 'pending',
        reason: 'Road accident patient needs urgent transfusion.',
      },
      {
        requestedBy: createdRecipients[0]._id,
        bloodGroupNeeded: 'A-',
        hospitalName: 'Dhaka Medical College Hospital',
        district: 'Dhaka',
        urgencyLevel: 'normal',
        status: 'pending',
        reason: 'Routine thalassemia transfusion scheduled for tomorrow morning.',
      },
    ];

    await BloodRequest.insertMany(sampleRequests);

    console.log('[Seed] Decoration Data Successfully Seeded!');
    console.log(`Donors Created: ${createdDonors.length}`);
    console.log(`Recipients Created: ${createdRecipients.length}`);
    console.log(`Requests Created: ${sampleRequests.length}`);

    process.exit(0);
  } catch (error) {
    console.error('[Seed Data Error]:', error);
    process.exit(1);
  }
};

seedData();
