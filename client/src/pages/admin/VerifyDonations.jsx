import React, { useState, useEffect } from 'react';
import { CheckCircle2, Award, Plus, Search, User, MapPin, Calendar, Droplets } from 'lucide-react';
import API from '../../api/axios';
import toast from 'react-hot-toast';

export default function VerifyDonations() {
  const [donations, setDonations] = useState([]);
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [selectedDonorId, setSelectedDonorId] = useState('');
  const [location, setLocation] = useState('');
  const [donationDate, setDonationDate] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [donationsRes, donorsRes] = await Promise.all([
        API.get('/admin/donations'),
        API.get('/admin/users?role=donor&limit=100'),
      ]);

      if (donationsRes.data.success) {
        setDonations(donationsRes.data.data);
      }

      if (donorsRes.data.success) {
        setDonors(donorsRes.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch verification data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    if (!selectedDonorId) {
      toast.error('Please select a donor.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await API.post('/admin/donations/verify', {
        donorId: selectedDonorId,
        location,
        donationDate,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        setSelectedDonorId('');
        setLocation('');
        setDonationDate('');
        fetchData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to verify donation');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white">Donation Verification & Crediting</h2>
        <p className="text-xs text-slate-400">Confirm completed blood donations to credit donor scores and update honor badges</p>
      </div>

      {/* Verify Form Card */}
      <div className="bg-slate-900/80 border border-slate-800 p-6 sm:p-8 rounded-3xl space-y-6 shadow-xl">
        <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Record & Verify New Donation
        </h3>

        <form onSubmit={handleVerifySubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Select Donor *</label>
            <select
              value={selectedDonorId}
              onChange={(e) => setSelectedDonorId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:border-red-600 focus:outline-none"
              required
            >
              <option value="">-- Choose Registered Donor --</option>
              {donors.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.name} ({d.bloodGroup}) — {d.district || 'Location N/A'} [{d.totalDonations || 0} donations]
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Donation Center / Hospital</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Red Crescent Blood Center, Dhaka"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:border-red-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Donation Date</label>
            <input
              type="date"
              value={donationDate}
              onChange={(e) => setDonationDate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:border-red-600 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-3 flex justify-end pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/25 transition disabled:opacity-50 flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              {submitting ? 'Verifying...' : 'Confirm & Increment Donation Count'}
            </button>
          </div>
        </form>
      </div>

      {/* Verified Donations Log Table */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white">Verified Donation Log</h3>

        {loading ? (
          <div className="py-8 text-center text-slate-400 text-xs">Loading verification logs...</div>
        ) : donations.length === 0 ? (
          <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 text-center text-slate-400 text-xs">
            No donation records verified yet.
          </div>
        ) : (
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
                  <tr>
                    <th className="py-4 px-6">Donor</th>
                    <th className="py-4 px-6">Blood Group</th>
                    <th className="py-4 px-6">Location</th>
                    <th className="py-4 px-6">Donation Date</th>
                    <th className="py-4 px-6">Verified By Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {donations.map((item) => (
                    <tr key={item._id} className="hover:bg-slate-800/40 transition">
                      <td className="py-4 px-6 font-bold text-white">
                        {item.donor?.name || 'Deleted User'}
                      </td>
                      <td className="py-4 px-6 font-bold text-rose-400">
                        {item.donor?.bloodGroup || 'N/A'}
                      </td>
                      <td className="py-4 px-6">{item.location || 'Official Center'}</td>
                      <td className="py-4 px-6">
                        {new Date(item.donationDate).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6 font-semibold text-emerald-400">
                        {item.verifiedBy?.name || 'Administrator'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
