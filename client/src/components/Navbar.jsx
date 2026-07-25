import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Droplets, LogOut, User, Menu, X, Sun, Moon, Bell, LayoutDashboard, UserCheck, PlusCircle, AlertCircle, Activity, BookOpen, MessageSquare } from 'lucide-react';

export default function Navbar() {
  const { user, isLoggedIn, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Find Donors', path: '/donors' },
    { name: 'Blood Requests', path: '/requests' },
    { name: 'Leaderboard', path: '/leaderboard' },
    { name: 'Eligibility Quiz', path: '/eligibility-check' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact Us', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-slate-950/80 dark:bg-slate-950/80 backdrop-blur-lg border-b border-slate-800/80 sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-700 via-red-600 to-rose-500 flex items-center justify-center shadow-lg shadow-red-700/30 group-hover:scale-105 transition-transform duration-300">
              <Droplets className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 via-rose-300 to-white">
                RaktoSetu
              </span>
              <span className="block text-[10px] text-red-400/80 uppercase font-semibold tracking-wider -mt-1">
                রক্তসেতু
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? 'bg-red-700/20 text-red-400 border border-red-700/30 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* User Section & Theme Toggle */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Dark / Light Mode Switcher */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 transition"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-300" />}
            </button>

            {isLoggedIn ? (
              <div className="flex items-center space-x-2">
                {/* Dashboard Button */}
                <Link
                  to="/dashboard"
                  className={`p-2 rounded-xl text-slate-300 hover:text-white border border-slate-800 transition ${
                    isActive('/dashboard') ? 'bg-red-700/20 text-red-400 border-red-700/40' : 'hover:bg-slate-900'
                  }`}
                  title="Dashboard"
                >
                  <LayoutDashboard className="w-4.5 h-4.5" />
                </Link>

                {/* Notifications Button */}
                <Link
                  to="/notifications"
                  className={`p-2 rounded-xl text-slate-300 hover:text-white border border-slate-800 relative transition ${
                    isActive('/notifications') ? 'bg-red-700/20 text-red-400 border-red-700/40' : 'hover:bg-slate-900'
                  }`}
                  title="Notifications"
                >
                  <Bell className="w-4.5 h-4.5" />
                  <span className="w-2 h-2 rounded-full bg-red-500 absolute top-1.5 right-1.5 animate-pulse"></span>
                </Link>

                {/* User Profile Dropdown Button */}
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded-full py-1 px-3 hover:border-red-600/40 transition"
                >
                  <div className="w-7 h-7 rounded-full bg-red-700 flex items-center justify-center overflow-hidden border border-red-500/40">
                    {user?.profilePhoto ? (
                      <img src={user.profilePhoto} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className="text-xs">
                    <span className="font-semibold text-slate-200 block leading-tight">{user?.name}</span>
                    <span className="text-[10px] text-red-400 font-bold uppercase">{user?.bloodGroup || user?.role}</span>
                  </div>
                  {!user?.isProfileComplete && (
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400" title="Profile incomplete" />
                  )}
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 transition"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-red-700 to-rose-600 hover:from-red-800 hover:to-rose-700 rounded-xl shadow-lg shadow-red-700/25 transition duration-200"
                >
                  Join RaktoSetu
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="lg:hidden flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-400 hover:text-white"
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950 border-b border-slate-800 px-4 pt-2 pb-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-base font-medium ${
                isActive(link.path) ? 'bg-red-700/20 text-red-400' : 'text-slate-300 hover:bg-slate-900'
              }`}
            >
              {link.name}
            </Link>
          ))}

          {isLoggedIn ? (
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm text-slate-200 hover:bg-slate-900 rounded-lg flex items-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4 text-red-500" /> Dashboard
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm text-slate-200 hover:bg-slate-900 rounded-lg flex items-center gap-2"
              >
                <UserCheck className="w-4 h-4 text-red-500" /> Edit Profile
              </Link>
              <Link
                to="/notifications"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm text-slate-200 hover:bg-slate-900 rounded-lg flex items-center gap-2"
              >
                <Bell className="w-4 h-4 text-red-500" /> Notifications
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-950/40 rounded-lg"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center py-2 text-slate-300 hover:bg-slate-900 rounded-lg text-sm"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center py-2 bg-red-700 text-white font-semibold rounded-lg text-sm"
              >
                Register Now
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
