import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Droplet, User, ShieldCheck, ChevronLeft, ChevronRight, AlertCircle, RefreshCw } from 'lucide-react';
import API from '../api/axios';
import DonorDetailModal from '../components/DonorDetailModal';
import { CardSkeleton } from '../components/Skeleton';

export default function DonorSearchPage() {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDonorId, setSelectedDonorId] = useState(null);

  // Filters
  const [bloodGroup, setBloodGroup] = useState('');
  const [district, setDistrict] = useState('');
  const [isAvailableOnly, setIsAvailableOnly] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchDonors = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 9,
      };
      if (bloodGroup) params.bloodGroup = bloodGroup;
      if (district.trim()) params.district = district.trim();
      if (isAvailableOnly) params.isAvailable = true;

      const res = await API.get('/donors', { params });
      if (res.data.success) {
        setDonors(res.data.data);
        setTotalPages(res.data.pages || 1);
        setTotalCount(res.data.total || 0);
      }
    } catch (err) {
      console.error('Failed to fetch donors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonors();
  }, [page, bloodGroup, isAvailableOnly]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchDonors();
  };

  const handleResetFilters = () => {
    setBloodGroup('');
    setDistrict('');
    setIsAvailableOnly(false);
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-950/60 via-slate-900 to-slate-950 border border-red-900/30 p-8 rounded-3xl space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">
          <Droplet className="w-3.5 h-3.5 fill-red-500/30" />
          Verified Donor Directory
        </div>
        <h2 className="text-3xl font-extrabold text-white">Find Voluntary Blood Donors</h2>
        <p className="text-sm text-slate-400 max-w-xl">
          Search for compatible donors by blood group and district across Bangladesh.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filter Sidebar */}
        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl h-fit space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Filter className="w-4 h-4 text-red-500" />
              Filter Donors
            </h3>
            <button
              onClick={handleResetFilters}
              className="text-xs text-slate-400 hover:text-red-400 flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Reset
            </button>
          </div>

          <form onSubmit={handleSearchSubmit} className="space-y-4">
            {/* Blood Group Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Blood Group</label>
              <select
                value={bloodGroup}
                onChange={(e) => {
                  setBloodGroup(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:border-red-600 focus:outline-none"
              >
                <option value="">All Blood Groups</option>
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>

            {/* District Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">District</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="e.g. Dhaka, Sylhet"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-100 focus:border-red-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Availability Checkbox */}
            <div className="flex items-center space-x-2 pt-1">
              <input
                type="checkbox"
                id="isAvailableOnly"
                checked={isAvailableOnly}
                onChange={(e) => {
                  setIsAvailableOnly(e.target.checked);
                  setPage(1);
                }}
                className="w-4 h-4 rounded bg-slate-950 border-slate-800 text-red-600 focus:ring-red-600 focus:ring-offset-slate-900"
              />
              <label htmlFor="isAvailableOnly" className="text-xs text-slate-300 font-medium cursor-pointer">
                Available to donate now
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-red-700 hover:bg-red-800 text-white font-semibold text-sm rounded-xl transition shadow-md"
            >
              Apply Filter
            </button>
          </form>
        </div>

        {/* Donors Grid */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Showing {donors.length} of {totalCount} Donors</span>
            <span>Page {page} of {totalPages}</span>
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : donors.length === 0 ? (
            /* Empty State */
            <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto text-red-400">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-white">No Donors Found</h4>
              <p className="text-sm text-slate-400 max-w-md mx-auto">
                No voluntary donors match your current filter criteria. Try adjusting blood group or district filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl transition"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            /* Donor Cards Grid */
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {donors.map((donor) => (
                <div
                  key={donor._id}
                  className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-red-600/40 transition duration-300 shadow-xl space-y-4"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-xl bg-red-950 border border-red-800/40 flex items-center justify-center text-rose-400 font-bold text-lg overflow-hidden shrink-0">
                          {donor.profilePhoto ? (
                            <img src={donor.profilePhoto} alt={donor.name} className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-6 h-6 text-red-400" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-sm line-clamp-1">{donor.name}</h4>
                          <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                            {donor.district || 'Location Unspecified'}
                          </p>
                        </div>
                      </div>

                      <div className="w-9 h-9 rounded-xl bg-red-600/10 border border-red-500/20 text-rose-400 font-bold text-xs flex items-center justify-center shrink-0">
                        {donor.bloodGroup}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                      <span className="text-slate-400">Total Donations:</span>
                      <span className="font-semibold text-white">{donor.totalDonations || 0} times</span>
                    </div>

                    <div className="mt-2 flex items-center justify-between text-xs">
                      <span className="text-slate-400">Status:</span>
                      <span
                        className={`font-semibold px-2 py-0.5 rounded-full text-[10px] ${
                          donor.isAvailable
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {donor.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedDonorId(donor._id)}
                    className="w-full py-2.5 bg-red-700/20 hover:bg-red-700 text-red-300 hover:text-white border border-red-700/30 rounded-xl text-xs font-semibold transition"
                  >
                    View Full Details
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-4 pt-6 border-t border-slate-800">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 disabled:opacity-40 hover:bg-slate-800 transition flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              <span className="text-xs text-slate-400">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 disabled:opacity-40 hover:bg-slate-800 transition flex items-center gap-1"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Full Details Modal Gating Window */}
      {selectedDonorId && (
        <DonorDetailModal
          donorId={selectedDonorId}
          type="donor"
          onClose={() => setSelectedDonorId(null)}
        />
      )}
    </div>
  );
}
