import React, { useState, useEffect } from 'react';
import { X, Phone, Mail, MapPin, User, Calendar, Droplet, ShieldAlert, Award, CheckCircle } from 'lucide-react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function DonorDetailModal({ donorId, type = 'donor', onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const { isLoggedIn, user } = useAuth();

  useEffect(() => {
    if (!donorId) return;

    const fetchFullDetails = async () => {
      setLoading(true);
      setErrorStatus(null);
      setErrorMessage('');

      try {
        const endpoint = type === 'donor' ? `/donors/${donorId}/full` : `/recipients/${donorId}/full`;
        const res = await API.get(endpoint);
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err) {
        if (err.response) {
          setErrorStatus(err.response.status);
          setErrorMessage(err.response.data.message || 'Access restricted');
        } else {
          setErrorStatus(500);
          setErrorMessage('Unable to connect to server');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFullDetails();
  }, [donorId, type]);

  if (!donorId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative overflow-hidden text-slate-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {loading ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm text-slate-400">Fetching verified details...</p>
          </div>
        ) : errorStatus === 403 ? (
          /* Profile Incomplete Gating Prompt */
          <div className="text-center py-6 px-2 space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto text-amber-400">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">Full Contact Details Locked</h3>
            <p className="text-sm text-slate-300 max-w-sm mx-auto leading-relaxed">
              {errorMessage || 'Please complete your profile to view full contact details.'}
            </p>

            <div className="pt-4 flex flex-col gap-2">
              {!isLoggedIn ? (
                <Link
                  to="/login"
                  onClick={onClose}
                  className="w-full py-3 bg-red-700 hover:bg-red-800 text-white font-semibold rounded-xl transition"
                >
                  Log In to Access
                </Link>
              ) : (
                <Link
                  to="/register"
                  onClick={onClose}
                  className="w-full py-3 bg-gradient-to-r from-red-700 to-rose-600 hover:from-red-800 text-white font-semibold rounded-xl shadow-lg shadow-red-700/20 transition"
                >
                  Complete Your Profile Now
                </Link>
              )}
              <button
                onClick={onClose}
                className="w-full py-2.5 text-slate-400 hover:text-slate-200 text-xs font-medium"
              >
                Dismiss
              </button>
            </div>
          </div>
        ) : errorStatus === 401 ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto text-red-400">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-white">Authentication Required</h3>
            <p className="text-sm text-slate-400">You must be logged in as a registered user to view contact information.</p>
            <Link
              to="/login"
              onClick={onClose}
              className="inline-block px-6 py-2.5 bg-red-700 hover:bg-red-800 text-white text-sm font-semibold rounded-xl transition"
            >
              Log In
            </Link>
          </div>
        ) : data ? (
          /* Full Contact Details View */
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-2xl bg-red-950 border border-red-800/40 flex items-center justify-center text-red-400 font-bold text-2xl overflow-hidden shrink-0">
                {data.profilePhoto ? (
                  <img src={data.profilePhoto} alt={data.name} className="w-full h-full object-cover" />
                ) : (
                  data.bloodGroup || <User className="w-8 h-8 text-red-500" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  {data.name}
                  {data.isAvailable && (
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-medium">
                      Available
                    </span>
                  )}
                </h3>
                <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  {data.district || 'Location unspecified'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-2xl flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-red-500/10 text-red-400">
                  <Droplet className="w-5 h-5 fill-red-500/20" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Blood Group</span>
                  <span className="text-base font-bold text-rose-400">{data.bloodGroup || 'N/A'}</span>
                </div>
              </div>

              <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-2xl flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Donations</span>
                  <span className="text-base font-bold text-white">{data.totalDonations ?? 0} Times</span>
                </div>
              </div>
            </div>

            {/* Contact Details Grid */}
            <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 space-y-3">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Verified Contact Info</h4>

              <div className="flex items-center space-x-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Phone Number</span>
                  <a href={`tel:${data.phone}`} className="font-semibold text-emerald-400 hover:underline">
                    {data.phone || 'N/A'}
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Email Address</span>
                  <a href={`mailto:${data.email}`} className="font-semibold text-slate-200 hover:underline">
                    {data.email || 'N/A'}
                  </a>
                </div>
              </div>

              {data.address && (
                <div className="flex items-start space-x-3 text-sm pt-1">
                  <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Full Address</span>
                    <span className="text-slate-300">{data.address}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={onClose}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold rounded-xl transition"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-slate-400 text-sm">Unable to load details.</div>
        )}
      </div>
    </div>
  );
}
