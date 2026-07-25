import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, CheckCircle2, Heart, AlertCircle, Droplets, Clock } from 'lucide-react';
import API from '../api/axios';

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Generate dynamic notification items based on user context
    const generateNotifications = async () => {
      setLoading(true);
      try {
        const dummyNotifications = [];

        if (user?.role === 'donor') {
          // Fetch matching requests for donor
          const res = await API.get('/requests', {
            params: { bloodGroup: user.bloodGroup, status: 'pending' },
          });
          if (res.data.success && res.data.data.length > 0) {
            res.data.data.forEach((reqItem) => {
              dummyNotifications.push({
                id: reqItem._id,
                title: `Urgent ${reqItem.bloodGroupNeeded} Blood Needed`,
                message: `Patient at ${reqItem.hospitalName} (${reqItem.district}) requires your blood group.`,
                type: 'urgent',
                time: new Date(reqItem.createdAt).toLocaleTimeString(),
                read: false,
              });
            });
          }
        }

        // Welcome / General Notification
        dummyNotifications.push({
          id: 'welcome-notif',
          title: 'Welcome to RaktoSetu',
          message: 'Your account is active. Keep your availability status up-to-date to receive donor alerts.',
          type: 'general',
          time: 'Just now',
          read: true,
        });

        setNotifications(dummyNotifications);
      } catch (err) {
        console.error('Failed to generate notifications:', err);
      } finally {
        setLoading(false);
      }
    };

    generateNotifications();
  }, [user]);

  const toggleReadStatus = (id) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: !item.read } : item))
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-red-600/10 border border-red-500/20 text-red-500 flex items-center justify-center">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Notifications</h2>
            <p className="text-xs text-slate-400">Emergency alerts and status updates</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-8 text-center text-slate-400 text-sm">Loading alerts...</div>
      ) : notifications.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-12 text-center text-slate-400">
          No notifications yet.
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleReadStatus(item.id)}
              className={`p-4 rounded-2xl border transition cursor-pointer flex items-start space-x-4 ${
                item.read
                  ? 'bg-slate-900/40 border-slate-800/80 text-slate-400'
                  : 'bg-slate-900 border-red-800/40 text-slate-100 shadow-md'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  item.type === 'urgent'
                    ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                    : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                }`}
              >
                {item.type === 'urgent' ? <Heart className="w-5 h-5 fill-red-500/20" /> : <Bell className="w-5 h-5" />}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className={`text-sm font-bold ${item.read ? 'text-slate-300' : 'text-white'}`}>
                    {item.title}
                  </h4>
                  <span className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {item.time}
                  </span>
                </div>
                <p className="text-xs text-slate-300">{item.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
