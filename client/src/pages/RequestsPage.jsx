import React, { useState, useEffect } from 'react';
import { Heart, Plus, Filter, MapPin, Building2, Clock, AlertTriangle, Phone, CheckCircle, RefreshCw } from 'lucide-react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import CreateRequestModal from '../components/CreateRequestModal';
import { CardSkeleton } from '../components/Skeleton';
import toast from 'react-hot-toast';

export default function RequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isLoggedIn, user } = useAuth();

  // Filters
  const [bloodGroup, setBloodGroup] = useState('');
  const [district, setDistrict] = useState('');
  const [urgencyLevel, setUrgencyLevel] = useState('');
  const [status, setStatus] = useState('pending');

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const params = {};
      if (bloodGroup) params.bloodGroup = bloodGroup;
      if (district.trim()) params.district = district.trim();
      if (urgencyLevel) params.urgencyLevel = urgencyLevel;
      if (status) params.status = status;

      const res = await API.get('/requests', { params });
      if (res.data.success) {
        setRequests(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch blood requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [bloodGroup, urgencyLevel, status]);

  const handleCreateNewClick = () => {
    if (!isLoggedIn) {
      toast.error('Please log in to post a blood request.');
      return;
    }
    setIsModalOpen(true);
  };

  const handleHelpClick = (reqItem) => {
    if (!isLoggedIn) {
      toast.error('Please log in to respond to blood requests.');
      return;
    }
    const contactPhone = reqItem.requestedBy?.phone;
    if (contactPhone) {
      toast.success(`Contacting requester: ${contactPhone}`, { duration: 5000 });
      window.location.href = `tel:${contactPhone}`;
    } else {
      toast.success('Thank you for offering help! Our team will notify the requester.');
    }
  };

  const getUrgencyBadge = (urgency) => {
    switch (urgency) {
      case 'critical':
        return <span className="bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Critical</span>;
      case 'urgent':
        return <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full">Urgent</span>;
      default:
        return <span className="bg-slate-800 text-slate-300 text-[10px] uppercase font-medium px-2.5 py-0.5 rounded-full">Normal</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-950/80 via-slate-900 to-slate-950 border border-red-900/30 p-8 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">
            <Heart className="w-3.5 h-3.5 fill-red-500/30" />
            Emergency Blood Requests
          </div>
          <h2 className="text-3xl font-extrabold text-white">Active Patient Requests</h2>
          <p className="text-sm text-slate-400 max-w-xl">
            View urgent blood requirements posted by patients and hospitals across Bangladesh.
          </p>
        </div>

        <button
          onClick={handleCreateNewClick}
          className="px-6 py-3 bg-gradient-to-r from-red-700 to-rose-600 hover:from-red-800 text-white font-bold rounded-2xl shadow-xl shadow-red-700/30 transition flex items-center gap-2 text-sm shrink-0"
        >
          <Plus className="w-5 h-5" />
          Post Blood Request
        </button>
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl flex flex-wrap items-center gap-4 text-xs">
        <span className="font-semibold text-slate-300 flex items-center gap-1.5">
          <Filter className="w-4 h-4 text-red-500" /> Filter Requests:
        </span>

        {/* Blood Group Filter */}
        <select
          value={bloodGroup}
          onChange={(e) => setBloodGroup(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none"
        >
          <option value="">All Blood Groups</option>
          {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
            <option key={bg} value={bg}>{bg}</option>
          ))}
        </select>

        {/* Urgency Filter */}
        <select
          value={urgencyLevel}
          onChange={(e) => setUrgencyLevel(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none"
        >
          <option value="">All Urgency Levels</option>
          <option value="normal">Normal</option>
          <option value="urgent">Urgent</option>
          <option value="critical">Critical</option>
        </select>

        {/* Status Filter */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none"
        >
          <option value="pending">Pending</option>
          <option value="fulfilled">Fulfilled</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Requests Grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-12 text-center space-y-4">
          <Heart className="w-12 h-12 text-slate-600 mx-auto" />
          <h4 className="text-xl font-bold text-white">No Active Requests</h4>
          <p className="text-sm text-slate-400">There are currently no blood requests matching your filter criteria.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((item) => (
            <div
              key={item._id}
              className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-xl hover:border-red-600/30 transition duration-300"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-red-600/10 border border-red-500/20 text-rose-400 font-bold text-lg flex items-center justify-center">
                    {item.bloodGroupNeeded}
                  </div>
                  {getUrgencyBadge(item.urgencyLevel)}
                </div>

                <div>
                  <h4 className="font-bold text-white text-base flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-red-500 shrink-0" />
                    {item.hospitalName}
                  </h4>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    District: <span className="text-slate-200 font-medium">{item.district}</span>
                  </p>
                </div>

                {item.reason && (
                  <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 line-clamp-3">
                    "{item.reason}"
                  </p>
                )}

                <div className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-500" />
                  Posted: {new Date(item.createdAt).toLocaleDateString()}
                </div>
              </div>

              <button
                onClick={() => handleHelpClick(item)}
                className="w-full py-3 bg-gradient-to-r from-red-700 to-rose-600 hover:from-red-800 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2"
              >
                <Heart className="w-4 h-4 fill-white" />
                I Can Help (Donate)
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Creating New Blood Request */}
      <CreateRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRequestCreated={() => fetchRequests()}
      />
    </div>
  );
}
