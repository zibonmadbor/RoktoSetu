import React, { useState } from 'react';
import { X, Heart, AlertCircle, Building2, MapPin, FileText } from 'lucide-react';
import API from '../api/axios';
import toast from 'react-hot-toast';

export default function CreateRequestModal({ isOpen, onClose, onRequestCreated }) {
  const [formData, setFormData] = useState({
    bloodGroupNeeded: 'A+',
    hospitalName: '',
    district: '',
    urgencyLevel: 'normal',
    reason: '',
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.hospitalName.trim() || !formData.district.trim()) {
      toast.error('Hospital name and district are required.');
      return;
    }

    setLoading(true);
    try {
      const res = await API.post('/requests', formData);
      if (res.data.success) {
        toast.success('Emergency blood request posted successfully!');
        if (onRequestCreated) onRequestCreated(res.data.data);
        onClose();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post blood request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-500">
            <Heart className="w-6 h-6 fill-red-500/20" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Post Blood Request</h3>
            <p className="text-xs text-slate-400">Request urgent blood donation from nearby donors</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Blood Group Needed</label>
              <select
                name="bloodGroupNeeded"
                value={formData.bloodGroupNeeded}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-red-600"
              >
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Urgency Level</label>
              <select
                name="urgencyLevel"
                value={formData.urgencyLevel}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-red-600"
              >
                <option value="normal">Normal</option>
                <option value="urgent">Urgent</option>
                <option value="critical">Critical (Immediate)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Hospital Name</label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                name="hospitalName"
                value={formData.hospitalName}
                onChange={handleChange}
                placeholder="e.g. Square Hospital, West Panthapath"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-red-600"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">District</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                placeholder="e.g. Dhaka, Chittagong, Sylhet"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-red-600"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Reason / Medical Note</label>
            <div className="relative">
              <FileText className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                rows="3"
                placeholder="Details regarding patient condition, required units, or contact instructions..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-red-600"
              ></textarea>
            </div>
          </div>

          <div className="pt-3 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-red-700 to-rose-600 hover:from-red-800 text-white font-semibold text-sm rounded-xl shadow-lg shadow-red-700/25 transition disabled:opacity-50"
            >
              {loading ? 'Posting...' : 'Post Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
