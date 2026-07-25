<div align="center">

  <img src="https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=1200&q=80" alt="RaktoSetu Banner" width="100%" style="border-radius: 20px; margin-bottom: 20px;" />

  # 🩸 RaktoSetu — রক্তসেতু
  ### *Every Drop Counts. Every Donor is a Hero.*

  **A Modern, Life-Saving MERN Stack Voluntary Blood Bank & Emergency Matching Platform**

  [![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-roktosetuu.netlify.app-FF0000?style=for-the-badge&logo=netlify&logoColor=white)](https://roktosetuu.netlify.app/)

  <br />

  [![License: MIT](https://img.shields.io/badge/License-MIT-red.svg)](./LICENSE)
  [![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
  [![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
  [![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
  [![Express](https://img.shields.io/badge/Express-4.19-000000?logo=express&logoColor=white)](https://expressjs.com/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
  [![Framer Motion](https://img.shields.io/badge/Framer_Motion-Animations-0055FF?logo=framer&logoColor=white)](https://www.framer.com/motion/)

  ---

  ### 🌐 **Live Demo Website:** [https://roktosetuu.netlify.app/](https://roktosetuu.netlify.app/)

</div>

---

## 🌟 Overview

**RaktoSetu (রক্তসেতু)** is a full-stack web application designed to bridge the emergency gap between blood seekers and voluntary donors across all 64 districts of Bangladesh. Built with the **MERN Stack** (MongoDB, Express, React, Node.js), **Tailwind CSS**, and **Framer Motion**, it delivers an intuitive, privacy-conscious, and visually stunning digital healthcare ecosystem.

<div align="center">
  <img src="https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1000&q=80" alt="Hospital Care" width="80%" style="border-radius: 16px;" />
</div>

---

## ✨ Key Features

### 🩸 Core Blood Management
- **Role-Aware Authentication**: Dual registration workflows for **Donors** and **Recipients (Collectors)** with bcrypt password hashing and JWT authentication.
- **Privacy-First Data Projection**: Public donor directory (`/donors`) projects *only* non-sensitive fields (Name, Blood Group, District, Total Donations). Sensitive contact details (Phone, Email, Full Address) are strictly hidden until authenticated users complete their profile verification.
- **Full Contact Gating**: Attempting to view full contact details with an incomplete profile returns HTTP 403 with a guided checklist prompt to complete missing information.
- **Emergency Blood Requests**: Recipients can post urgent blood requests specifying hospital name, district, blood group, reason, and urgency level (`normal`, `urgent`, `critical`).

### 👑 Admin Control Panel (`/admin`)
- **Interactive Recharts Dashboard**: Analytics visualizing registrations over time, monthly verified donations, and blood group distribution pie charts.
- **User Moderation & Search**: Real-time searchable and sortable table to manage user roles (`donor`, `recipient`, `admin`) or remove accounts.
- **Donation Verification**: Admin crediting interface to verify reported blood donations, automatically upgrading donor honor ranks (**Bronze**, **Silver**, **Gold**, **Platinum**).
- **Support Ticket Center**: Manage incoming contact messages and toggle read/unread status.

### ✉️ Automated Email Notifications (Nodemailer)
- **Welcome Email**: Sent automatically upon user registration.
- **Emergency Donor Alerts**: Automated email notification dispatched to matching available donors when an urgent or critical request is posted.
- **Donation Verification Receipt**: Email confirmation sent to donors when an admin verifies a donation.

### 🎨 Visual & Interactive Polish
- **Blood Donation Eligibility Quiz (`/eligibility-check`)**: Instant eligibility checker evaluating age, weight, donation interval countdowns, and health conditions.
- **Awareness Journal (`/blog` & `/blog/:slug`)**: Educational articles on blood donation importance, health benefits, and myth busters.
- **Homepage Emergency Banner**: Dismissible glowing top alert banner displaying active critical emergency blood requests.
- **Dark/Light Mode**: Smooth theme toggling persisted via `localStorage`.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Live Hosting** | [Netlify](https://roktosetuu.netlify.app/) |
| **Frontend Framework** | React 18 + Vite |
| **Styling & UI** | Tailwind CSS + Lucide React + Glassmorphism |
| **Animations** | Framer Motion |
| **Backend Runtime** | Node.js + Express.js |
| **Database & ODM** | MongoDB + Mongoose |
| **Authentication** | JSON Web Tokens (JWT) + Bcrypt.js |
| **FileUploads** | Multer (Profile Photo Disk Storage) |
| **Email Transporter** | Nodemailer (SMTP / Ethereal Test Account) |
| **Data Visualization** | Recharts |

---

## 📸 Screenshots Showcase

<div align="center">
  <img src="https://images.unsplash.com/photo-1536856136534-bb679c52a9aa?auto=format&fit=crop&w=1000&q=80" alt="Voluntary Blood Drive" width="48%" style="border-radius: 12px; margin-right: 2%;" />
  <img src="https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1000&q=80" alt="Medical Team" width="48%" style="border-radius: 12px;" />
</div>

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- [MongoDB](https://www.mongodb.com/) running locally on `mongodb://localhost:27017` or a MongoDB Atlas connection string.

---

### 1. Repository Setup
```bash
# Clone the repository
git clone https://github.com/your-username/RaktoSetu.git
cd RaktoSetu
```

---

### 2. Backend Configuration (`/server`)

```bash
cd server

# Install backend dependencies
npm install

# Create environment file (.env)
cat <<EOT > .env
PORT=5000
MONGO_URI=mongodb://localhost:27017/raktosetu
JWT_SECRET=raktosetu_super_secret_jwt_key_2026
EOT

# Seed Default Admin Account
npm run seed:admin

# Seed Sample Donors, Recipients & Emergency Requests for Decoration
npm run seed:data

# Start Backend Development Server
npm run dev
```

---

### 3. Frontend Configuration (`/client`)

Open a new terminal window:

```bash
cd client

# Install frontend dependencies
npm install

# Start Frontend Development Server (Vite)
npm run dev
```

The application will be accessible at:
- **Live Demo:** `https://roktosetuu.netlify.app/`
- **Local Client App:** `http://localhost:3000` (or Vite assigned port)
- **Local Backend API:** `http://localhost:5000`

---

## 🔑 Default Credentials

### Administrator Account
- **Email:** `admin@raktosetu.org`
- **Password:** `admin123456`
- **Access Route:** `/admin`

### Sample Donor & Recipient Accounts
- **Donor Login:** `ariful.donor@example.com` / `password123`
- **Recipient Login:** `kamrul.collector@example.com` / `password123`

---

## 📁 Repository Structure

```
RaktoSetu/
├── client/                     # Vite + React + Tailwind CSS Client
│   ├── src/
│   │   ├── api/                # Axios configuration & interceptors
│   │   ├── components/         # Navbar, Footer, EmergencyBanner, ProtectedRoute, RequireAdmin, ScrollToTop
│   │   ├── context/            # AuthContext & ThemeContext
│   │   ├── pages/              # LandingPage, DonorSearch, Requests, Leaderboard, Quiz, Blog, Admin
│   │   ├── App.jsx             # Main Application Routing
│   │   └── main.jsx            # Entry point
│   └── package.json
│
├── server/                     # Node.js + Express + Mongoose Server
│   ├── config/                 # db.js & email.js (Nodemailer setup)
│   ├── controllers/            # auth, user, request, admin, contact controllers
│   ├── middleware/             # auth, checkProfileComplete, checkAdmin, upload
│   ├── models/                 # User, BloodRequest, Donation, Message schemas
│   ├── routes/                 # Express API endpoints
│   ├── scripts/                # seedAdmin.js & seedData.js
│   ├── uploads/                # Profile photo uploads
│   └── server.js               # Express application entry point
│
├── LICENSE                     # MIT License
└── README.md                   # Documentation
```

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](./LICENSE) for more details.

---

<div align="center">
  <p>Built with ❤️ in Bangladesh to save lives through voluntary blood donation.</p>
  <p>🚀 Live Demo: <a href="https://roktosetuu.netlify.app/">https://roktosetuu.netlify.app/</a></p>
</div>
