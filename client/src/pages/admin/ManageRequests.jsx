import React, { useState, useEffect } from 'react';
import { ShieldCheck, Filter, Building2, MapPin, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import API from '../../api/axios';
import toast from 'react-hot-toast';

export default function ManageRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;

      const res = await API.get('/requests', { params });
      if (res.data.success) {
        setRequests(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [statusFilter]);

  const handleUpdateStatus = async (requestId, newStatus) => {
    try {
      const res = await API.put(`/requests/${requestId}/status`, { status: newStatus });
      if (res.data.success) {
        toast.success(`Request status updated to ${newStatus}`);
        fetchRequests();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update request status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Manage Blood Requests</h2>
          <p className="text-xs text-slate-400">Review and control emergency blood request statuses</p>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="fulfilled">Fulfilled</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-400 text-sm">Loading blood requests...</div>
      ) : (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-4 px-6">Requester</th>
                  <th className="py-4 px-6">Blood Needed</th>
                  <th className="py-4 px-6">Hospital</th>
                  <th className="py-4 px-6">District</th>
                  <th className="py-4 px-6">Urgency</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {requests.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-800/40 transition">
                    <td className="py-4 px-6 font-semibold text-white">
                      {item.requestedBy?.name || 'Unknown User'}
                    </td>
                    <td className="py-4 px-6 font-bold text-rose-400">{item.bloodGroupNeeded}</td>
                    <td className="py-4 px-6">{item.hospitalName}</td>
                    <td className="py-4 px-6">{item.district}</td>
                    <td className="py-4 px-6">
                      <span className="capitalize text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                        {item.urgencyLevel}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          item.status === 'fulfilled'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : item.status === 'cancelled'
                            ? 'bg-slate-800 text-slate-400'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      {item.status !== 'fulfilled' && (
                        <button
                          onClick={() => handleUpdateStatus(item._id, 'fulfilled')}
                          className="px-3 py-1 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-600/30 rounded-lg text-[10px] font-semibold transition"
                        >
                          Mark Fulfilled
                        </button>
                      )}
                      {item.status !== 'cancelled' && (
                        <button
                          onClick={() => handleUpdateStatus(item._id, 'cancelled')}
                          className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 rounded-lg text-[10px] font-semibold transition"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
