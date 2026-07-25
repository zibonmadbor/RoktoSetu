import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Building2, MapPin, FileText, ArrowLeft } from 'lucide-react';
import API from '../api/axios';
import toast from 'react-hot-toast';

export default function CreateRequestPage() {
  const [formData, setFormData] = useState({
    bloodGroupNeeded: 'A+',
    hospitalName: '',
    district: '',
    urgencyLevel: 'normal',
    reason: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
        navigate('/requests');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-red-600/10 border border-red-500/20 flex items-center justify-center mx-auto text-red-500">
          <Heart className="w-6 h-6 fill-red-500/20" />
        </div>
        <h2 className="text-3xl font-bold text-white">Post Blood Request</h2>
        <p className="text-sm text-slate-400">Reach voluntary donors in your district immediately</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-900/60 border border-slate-800 p-8 rounded-3xl space-y-5 shadow-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Blood Group Needed *</label>
            <select
              name="bloodGroupNeeded"
              value={formData.bloodGroupNeeded}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:border-red-600 focus:outline-none"
            >
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Urgency Level *</label>
            <select
              name="urgencyLevel"
              value={formData.urgencyLevel}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:border-red-600 focus:outline-none"
            >
              <option value="normal">Normal (Within 24 Hours)</option>
              <option value="urgent">Urgent (Within 6 Hours)</option>
              <option value="critical">Critical (Immediate Transfusion)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Hospital Name *</label>
          <div className="relative">
            <Building2 className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
            <input
              type="text"
              name="hospitalName"
              value={formData.hospitalName}
              onChange={handleChange}
              placeholder="e.g. Square Hospital, Dhaka Medical College"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-100 focus:border-red-600 focus:outline-none"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">District *</label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
            <input
              type="text"
              name="district"
              value={formData.district}
              onChange={handleChange}
              placeholder="e.g. Dhaka, Chittagong, Rajshahi"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-100 focus:border-red-600 focus:outline-none"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Reason / Additional Medical Info</label>
          <div className="relative">
            <FileText className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              rows="4"
              placeholder="Patient details, required units, or emergency instructions..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-100 focus:border-red-600 focus:outline-none"
            ></textarea>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-gradient-to-r from-red-700 to-rose-600 hover:from-red-800 text-white font-bold text-base rounded-xl shadow-lg shadow-red-700/30 transition disabled:opacity-50"
        >
          {loading ? 'Submitting Request...' : 'Publish Emergency Request'}
        </button>
      </form>
    </div>
  );
}
