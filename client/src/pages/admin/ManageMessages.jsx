import React, { useState, useEffect } from 'react';
import { Mail, MessageSquare, CheckCircle, Clock, Eye, Trash2 } from 'lucide-react';
import API from '../../api/axios';
import toast from 'react-hot-toast';

export default function ManageMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await API.get('/contact');
      if (res.data.success) {
        setMessages(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch contact messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleToggleRead = async (id) => {
    try {
      const res = await API.put(`/contact/${id}/read`);
      if (res.data.success) {
        toast.success('Message read status updated.');
        fetchMessages();
      }
    } catch (err) {
      toast.error('Failed to update message status.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Support & Contact Messages</h2>
        <p className="text-xs text-slate-400">Review user feedback, emergency support inquiries, and platform messages</p>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-400 text-xs">Loading support messages...</div>
      ) : messages.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-12 text-center text-slate-400 text-xs">
          No contact messages received yet.
        </div>
      ) : (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-4 px-6">Sender</th>
                  <th className="py-4 px-6">Subject</th>
                  <th className="py-4 px-6">Message Content</th>
                  <th className="py-4 px-6">Submitted Date</th>
                  <th className="py-4 px-6 text-right">Status / Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {messages.map((item) => (
                  <tr key={item._id} className={`hover:bg-slate-800/40 transition ${item.isRead ? 'opacity-70' : ''}`}>
                    <td className="py-4 px-6 font-bold text-white">
                      <div>{item.name}</div>
                      <div className="text-[10px] text-slate-400">{item.email}</div>
                    </td>
                    <td className="py-4 px-6 font-semibold text-rose-300">{item.subject}</td>
                    <td className="py-4 px-6 max-w-xs text-slate-300 line-clamp-2">{item.message}</td>
                    <td className="py-4 px-6 text-slate-400">
                      {new Date(item.createdAt).toLocaleString()}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleToggleRead(item._id)}
                        className={`px-3 py-1 rounded-lg text-[10px] font-semibold border transition ${
                          item.isRead
                            ? 'bg-slate-800 text-slate-400 border-slate-700'
                            : 'bg-emerald-600/20 text-emerald-300 border-emerald-600/30 hover:bg-emerald-600 hover:text-white'
                        }`}
                      >
                        {item.isRead ? 'Mark Unread' : 'Mark as Read'}
                      </button>
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
