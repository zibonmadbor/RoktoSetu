import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { LayoutDashboard, Award, Heart, Droplets, CheckCircle2, Clock, AlertCircle, Plus, ShieldCheck, UserCheck, ToggleLeft, ToggleRight, FileText } from 'lucide-react';

export default function DashboardPage() {
  const { user, updateProfile } = useAuth();
  const [myRequests, setMyRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [togglingAvailability, setTogglingAvailability] = useState(false);

  const fetchMyRequests = async () => {
    if (!user) return;
    setLoadingRequests(true);
    try {
      const res = await API.get('/requests');
      if (res.data.success) {
        // Filter requests created by logged in user
        const userReqs = res.data.data.filter(
          (item) => item.requestedBy && (item.requestedBy._id === user._id || item.requestedBy === user._id)
        );
        setMyRequests(userReqs);
      }
    } catch (err) {
      console.error('Failed to fetch user requests:', err);
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'recipient' || myRequests.length === 0) {
      fetchMyRequests();
    }
  }, [user]);

  const handleToggleAvailability = async () => {
    setTogglingAvailability(true);
    try {
      const newStatus = !user?.isAvailable;
      const formData = new FormData();
      formData.append('isAvailable', newStatus);

      const res = await updateProfile(formData);
      if (res.success) {
        toast.success(`Availability updated to ${newStatus ? 'Available' : 'Unavailable'}`);
      }
    } catch (err) {
      toast.error('Failed to update availability status');
    } finally {
      setTogglingAvailability(false);
    }
  };

  const handleUpdateStatus = async (requestId, newStatus) => {
    try {
      const res = await API.put(`/requests/${requestId}/status`, { status: newStatus });
      if (res.data.success) {
        toast.success(`Request status updated to ${newStatus}`);
        fetchMyRequests();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update request status');
    }
  };

  const getBadge = (donations = 0) => {
    if (donations >= 20) return { name: 'Platinum', color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' };
    if (donations >= 10) return { name: 'Gold', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
    if (donations >= 5) return { name: 'Silver', color: 'text-slate-300 bg-slate-400/10 border-slate-400/30' };
    if (donations >= 1) return { name: 'Bronze', color: 'text-orange-400 bg-orange-500/10 border-orange-500/30' };
    return { name: 'New Donor', color: 'text-slate-400 bg-slate-800 border-slate-700' };
  };

  const badgeInfo = getBadge(user?.totalDonations);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Incomplete Banner */}
      {!user?.isProfileComplete && (
        <div className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-slate-950 border border-amber-500/30 p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">Your profile is incomplete!</h4>
              <p className="text-xs text-slate-300">
                Complete all profile fields to unlock direct donor contact info and emergency requests.
              </p>
            </div>
          </div>
          <Link
            to="/profile"
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl transition shrink-0"
          >
            Complete Profile Now
          </Link>
        </div>
      )}

      {/* Header Welcome Bar */}
      <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-red-950 border border-red-800/40 flex items-center justify-center text-rose-400 font-bold text-2xl overflow-hidden shrink-0">
            {user?.profilePhoto ? (
              <img src={user.profilePhoto} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              user?.bloodGroup || <UserCheck className="w-8 h-8 text-red-500" />
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              Welcome back, {user?.name}!
            </h2>
            <p className="text-xs text-slate-400 capitalize">
              Role: <span className="text-red-400 font-semibold">{user?.role}</span> • District: {user?.district || 'Not set'}
            </p>
          </div>
        </div>

        {/* Role Quick Action Button */}
        <div className="flex items-center gap-3">
          {user?.role === 'donor' ? (
            <div className="flex items-center space-x-3 bg-slate-950 border border-slate-800 p-3 rounded-2xl">
              <span className="text-xs text-slate-300 font-medium">Donation Availability:</span>
              <button
                onClick={handleToggleAvailability}
                disabled={togglingAvailability}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  user?.isAvailable
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {user?.isAvailable ? (
                  <>
                    <ToggleRight className="w-5 h-5 text-emerald-400" /> Available
                  </>
                ) : (
                  <>
                    <ToggleLeft className="w-5 h-5 text-slate-500" /> Unavailable
                  </>
                )}
              </button>
            </div>
          ) : (
            <Link
              to="/requests/new"
              className="px-5 py-3 bg-gradient-to-r from-red-700 to-rose-600 hover:from-red-800 text-white font-bold rounded-2xl text-xs flex items-center gap-2 shadow-lg shadow-red-700/25"
            >
              <Plus className="w-4 h-4" /> Post New Blood Request
            </Link>
          )}
        </div>
      </div>

      {/* DONOR DASHBOARD VIEW */}
      {user?.role === 'donor' && (
        <div className="space-y-8">
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Total Donations</span>
                <Droplets className="w-5 h-5 text-red-500" />
              </div>
              <div className="text-3xl font-extrabold text-white">{user?.totalDonations || 0} Times</div>
              <p className="text-[11px] text-slate-500">Every donation saves up to 3 lives.</p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Donor Honor Badge</span>
                <Award className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${badgeInfo.color}`}>
                  🏆 {badgeInfo.name} Badge
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Donate regularly to upgrade your rank.</p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Blood Group</span>
                <Heart className="w-5 h-5 text-rose-400 fill-rose-500/20" />
              </div>
              <div className="text-3xl font-extrabold text-rose-400">{user?.bloodGroup || 'N/A'}</div>
              <p className="text-[11px] text-slate-500">Registered blood group</p>
            </div>
          </div>

          {/* Quick Match Recommendations */}
          <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" /> Matching Emergency Requests
              </h3>
              <Link to="/requests" className="text-xs text-red-400 font-semibold hover:underline">
                View All Requests
              </Link>
            </div>
            <p className="text-xs text-slate-400">
              Browse urgent requests needing your blood group ({user?.bloodGroup}) in {user?.district || 'your area'}.
            </p>
          </div>
        </div>
      )}

      {/* RECIPIENT DASHBOARD VIEW */}
      {user?.role === 'recipient' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-red-500" /> Your Posted Requests
            </h3>
            <Link
              to="/requests/new"
              className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Create Request
            </Link>
          </div>

          {loadingRequests ? (
            <div className="py-8 text-center text-slate-400 text-sm">Loading your requests...</div>
          ) : myRequests.length === 0 ? (
            <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-12 text-center space-y-4">
              <Heart className="w-12 h-12 text-slate-600 mx-auto" />
              <h4 className="text-lg font-bold text-white">No Requests Posted Yet</h4>
              <p className="text-xs text-slate-400">You haven't submitted any blood requests yet.</p>
              <Link
                to="/requests/new"
                className="inline-block px-6 py-2.5 bg-red-700 hover:bg-red-800 text-white font-semibold text-xs rounded-xl"
              >
                Post Your First Request
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {myRequests.map((reqItem) => (
                <div
                  key={reqItem._id}
                  className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-xl bg-red-600/10 border border-red-500/20 text-rose-400 font-bold text-xs">
                      Blood Needed: {reqItem.bloodGroupNeeded}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                        reqItem.status === 'fulfilled'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : reqItem.status === 'cancelled'
                          ? 'bg-slate-800 text-slate-400'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {reqItem.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-white text-base">{reqItem.hospitalName}</h4>
                    <p className="text-xs text-slate-400">District: {reqItem.district}</p>
                  </div>

                  {reqItem.reason && (
                    <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800">
                      "{reqItem.reason}"
                    </p>
                  )}

                  {/* Actions Bar */}
                  {reqItem.status === 'pending' && (
                    <div className="pt-2 border-t border-slate-800 flex gap-2">
                      <button
                        onClick={() => handleUpdateStatus(reqItem._id, 'fulfilled')}
                        className="flex-1 py-2 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-600/30 rounded-xl text-xs font-semibold transition"
                      >
                        Mark Fulfilled
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(reqItem._id, 'cancelled')}
                        className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 rounded-xl text-xs font-semibold transition"
                      >
                        Cancel Request
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
