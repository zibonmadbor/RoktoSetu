import React from 'react';
import { Droplets, Heart, Phone, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-700 to-rose-500 flex items-center justify-center shadow-lg shadow-red-700/30">
                <Droplets className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">RaktoSetu</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              RaktoSetu (রক্তসেতু) is Bangladesh's voluntary blood donor network connecting patients with verified donors rapidly across all districts.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Quick Links</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/" className="hover:text-red-400 transition">Home</Link></li>
              <li><Link to="/donors" className="hover:text-red-400 transition">Find Donors</Link></li>
              <li><Link to="/requests" className="hover:text-red-400 transition">Blood Requests</Link></li>
              <li><Link to="/leaderboard" className="hover:text-red-400 transition">Top Donors Leaderboard</Link></li>
            </ul>
          </div>

          {/* Guidelines */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Donor Eligibility</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>• Age: 18 – 65 years</li>
              <li>• Minimum Weight: 50 kg</li>
              <li>• Donation Interval: Every 90 days</li>
              <li>• Hemoglobin Level: &gt;= 12.5 g/dL</li>
            </ul>
          </div>

          {/* Emergency Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Emergency Support</h4>
            <div className="space-y-2 text-xs">
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-red-500" />
                Emergency Hotline: +880 1700-000000
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-red-500" />
                help@raktosetu.org
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-500" />
                Dhaka, Bangladesh
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} RaktoSetu. Dedicated to saving lives through voluntary donation.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
