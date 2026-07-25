import React, { useState, useEffect } from 'react';
import { Award, Trophy, Medal, Star, Droplet, User, MapPin, Search } from 'lucide-react';
import API from '../api/axios';
import { TableSkeleton } from '../components/Skeleton';

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('all-time'); // 'all-time' | 'this-year'

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const res = await API.get('/leaderboard?limit=50');
        if (res.data.success) {
          setLeaderboard(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load leaderboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [timeframe]);

  const getBadgeStyling = (badge) => {
    switch (badge) {
      case 'Platinum':
        return {
          bg: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
          icon: <Trophy className="w-4 h-4 text-purple-400" />,
        };
      case 'Gold':
        return {
          bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          icon: <Medal className="w-4 h-4 text-amber-400" />,
        };
      case 'Silver':
        return {
          bg: 'bg-slate-300/10 text-slate-300 border-slate-300/30',
          icon: <Award className="w-4 h-4 text-slate-300" />,
        };
      case 'Bronze':
        return {
          bg: 'bg-orange-600/10 text-orange-400 border-orange-600/30',
          icon: <Award className="w-4 h-4 text-orange-400" />,
        };
      default:
        return {
          bg: 'bg-slate-800 text-slate-400 border-slate-700',
          icon: <Star className="w-4 h-4 text-slate-500" />,
        };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-950/80 via-slate-900 to-slate-950 border border-red-900/30 p-8 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
            <Trophy className="w-3.5 h-3.5" />
            Top Voluntary Donors Hall of Fame
          </div>
          <h2 className="text-3xl font-extrabold text-white">Donor Leaderboard</h2>
          <p className="text-sm text-slate-400 max-w-xl">
            Recognizing dedicated heroes who donate blood regularly to save lives in Bangladesh.
          </p>
        </div>

        {/* Timeframe Toggle Filter */}
        <div className="bg-slate-900 border border-slate-800 p-1.5 rounded-2xl flex text-xs">
          <button
            onClick={() => setTimeframe('all-time')}
            className={`px-4 py-2 rounded-xl font-semibold transition ${
              timeframe === 'all-time' ? 'bg-red-700 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            All-Time
          </button>
          <button
            onClick={() => setTimeframe('this-year')}
            className={`px-4 py-2 rounded-xl font-semibold transition ${
              timeframe === 'this-year' ? 'bg-red-700 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            This Year (2026)
          </button>
        </div>
      </div>

      {/* Leaderboard Table / Cards */}
      {loading ? (
        <TableSkeleton />
      ) : leaderboard.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-12 text-center text-slate-400">
          No leaderboard data available yet.
        </div>
      ) : (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/80 text-xs uppercase font-semibold text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-4 px-6">Rank</th>
                  <th className="py-4 px-6">Donor Info</th>
                  <th className="py-4 px-6">Blood Group</th>
                  <th className="py-4 px-6 text-center">Total Donations</th>
                  <th className="py-4 px-6 text-right">Honor Badge</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {leaderboard.map((donor, idx) => {
                  const badgeStyle = getBadgeStyling(donor.badge);
                  const isTop3 = idx < 3;

                  return (
                    <tr key={donor._id} className="hover:bg-slate-800/40 transition">
                      {/* Rank */}
                      <td className="py-4 px-6 font-bold">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${
                            idx === 0
                              ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/30'
                              : idx === 1
                              ? 'bg-slate-300 text-slate-950 shadow'
                              : idx === 2
                              ? 'bg-amber-700 text-white shadow'
                              : 'text-slate-400 bg-slate-800'
                          }`}
                        >
                          #{idx + 1}
                        </div>
                      </td>

                      {/* Donor Name & Photo */}
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-red-400 font-bold overflow-hidden shrink-0">
                            {donor.profilePhoto ? (
                              <img src={donor.profilePhoto} alt={donor.name} className="w-full h-full object-cover" />
                            ) : (
                              <User className="w-5 h-5" />
                            )}
                          </div>
                          <div>
                            <span className="font-bold text-white block">{donor.name}</span>
                            <span className="text-xs text-slate-400 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-red-500" />
                              {donor.district || 'Bangladesh'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Blood Group */}
                      <td className="py-4 px-6">
                        <span className="px-2.5 py-1 rounded-lg bg-red-600/10 border border-red-500/20 text-rose-400 font-bold text-xs">
                          {donor.bloodGroup}
                        </span>
                      </td>

                      {/* Total Donations */}
                      <td className="py-4 px-6 text-center">
                        <span className="text-base font-extrabold text-white">{donor.totalDonations || 0}</span>
                        <span className="text-xs text-slate-400 ml-1">times</span>
                      </td>

                      {/* Badge Icon */}
                      <td className="py-4 px-6 text-right">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${badgeStyle.bg}`}
                        >
                          {badgeStyle.icon}
                          {donor.badge || 'None'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
