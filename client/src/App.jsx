import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import RequireAdmin from './components/RequireAdmin';
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Layouts
import AdminLayout from './components/AdminLayout';

// Public Pages
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DonorSearchPage from './pages/DonorSearchPage';
import RequestsPage from './pages/RequestsPage';
import LeaderboardPage from './pages/LeaderboardPage';
import EligibilityCheckPage from './pages/EligibilityCheckPage';
import BlogPage from './pages/BlogPage';
import BlogDetailPage from './pages/BlogDetailPage';
import ContactPage from './pages/ContactPage';

// Authenticated User Pages
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import CreateRequestPage from './pages/CreateRequestPage';
import NotificationsPage from './pages/NotificationsPage';

// Admin Panel Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageRequests from './pages/admin/ManageRequests';
import VerifyDonations from './pages/admin/VerifyDonations';
import ManageMessages from './pages/admin/ManageMessages';

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <ThemeProvider>
        <AuthProvider>
          <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-red-700 selection:text-white font-sans transition-colors">
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: '#0f172a',
                  color: '#f8fafc',
                  border: '1px solid #1e293b',
                },
              }}
            />

            <Routes>
              {/* ADMIN PANEL ROUTES */}
              <Route
                path="/admin"
                element={
                  <RequireAdmin>
                    <AdminLayout />
                  </RequireAdmin>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<ManageUsers />} />
                <Route path="requests" element={<ManageRequests />} />
                <Route path="donations" element={<VerifyDonations />} />
                <Route path="messages" element={<ManageMessages />} />
              </Route>

              {/* MAIN APP ROUTES */}
              <Route
                path="*"
                element={
                  <>
                    <Navbar />
                    <main className="flex-1">
                      <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/donors" element={<DonorSearchPage />} />
                        <Route path="/requests" element={<RequestsPage />} />
                        <Route path="/leaderboard" element={<LeaderboardPage />} />
                        <Route path="/eligibility-check" element={<EligibilityCheckPage />} />
                        <Route path="/blog" element={<BlogPage />} />
                        <Route path="/blog/:slug" element={<BlogDetailPage />} />
                        <Route path="/contact" element={<ContactPage />} />

                        {/* Protected User Routes */}
                        <Route
                          path="/dashboard"
                          element={
                            <ProtectedRoute>
                              <DashboardPage />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/profile"
                          element={
                            <ProtectedRoute>
                              <ProfilePage />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/requests/new"
                          element={
                            <ProtectedRoute>
                              <CreateRequestPage />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/notifications"
                          element={
                            <ProtectedRoute>
                              <NotificationsPage />
                            </ProtectedRoute>
                          }
                        />
                      </Routes>
                    </main>
                    <Footer />
                  </>
                }
              />
            </Routes>
          </div>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}
