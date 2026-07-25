import React, { useState, useEffect } from 'react';
import { AlertTriangle, X, ArrowRight, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import API from '../api/axios';

export default function EmergencyBanner() {
  const [criticalRequest, setCriticalRequest] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const fetchCriticalRequest = async () => {
      try {
        const res = await API.get('/requests', {
          params: { urgencyLevel: 'critical', status: 'pending', limit: 1 },
        });
        if (res.data.success && res.data.data.length > 0) {
          setCriticalRequest(res.data.data[0]);
        }
      } catch (err) {
        console.error('Failed to load critical emergency banner:', err);
      }
    };

    fetchCriticalRequest();
  }, []);

  if (!criticalRequest || dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-red-700 via-rose-700 to-red-800 text-white px-4 py-3 shadow-xl relative z-40 border-b border-red-500/40 animate-fadeIn">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex items-center space-x-3 text-center sm:text-left">
          <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0 animate-bounce">
            <AlertTriangle className="w-5 h-5 text-white" />
          </span>
          <div>
            <span className="font-extrabold uppercase bg-white/20 px-2 py-0.5 rounded text-[10px] tracking-wider mr-2">
              Critical Emergency
            </span>
            <span>
              Patient at <strong>{criticalRequest.hospitalName} ({criticalRequest.district})</strong> needs <strong>{criticalRequest.bloodGroupNeeded}</strong> blood urgently!
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <Link
            to="/requests"
            className="px-4 py-1.5 bg-white text-red-700 font-bold rounded-xl text-xs hover:bg-slate-100 transition shadow"
          >
            Respond Now
          </Link>
          <button
            onClick={() => setDismissed(true)}
            className="p-1 hover:bg-white/20 rounded-lg transition"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
