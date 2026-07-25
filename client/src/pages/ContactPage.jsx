import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Heart } from 'lucide-react';
import API from '../api/axios';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      const res = await API.post('/contact', formData);
      if (res.data.success) {
        toast.success(res.data.message);
        setFormData({ name: '', email: '', subject: '', message: '' });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-red-600/10 border border-red-500/20 flex items-center justify-center mx-auto text-red-500">
          <MessageSquare className="w-6 h-6" />
        </div>
        <h2 className="text-3xl font-extrabold text-white">Get in Touch with RaktoSetu</h2>
        <p className="text-sm text-slate-400">
          Have questions, feedback, or need emergency helpline support? Send us a message below.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Contact Info Cards */}
        <div className="space-y-4 md:col-span-1">
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-base">Emergency Hotline</h4>
            <p className="text-xs text-slate-400">Available 24/7 for critical blood matching support</p>
            <p className="text-sm font-bold text-red-400">+880 1700-000000</p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-base">Email Support</h4>
            <p className="text-xs text-slate-400">Send inquiries and partner requests</p>
            <p className="text-sm font-bold text-slate-200">support@raktosetu.org</p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-base">Central Office</h4>
            <p className="text-xs text-slate-400">RaktoSetu HQ, Panthapath, Dhaka 1205, Bangladesh</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="bg-slate-900/60 border border-slate-800 p-8 rounded-3xl space-y-5 shadow-2xl">
            <h3 className="text-xl font-bold text-white border-b border-slate-800 pb-3">Send Support Message</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Your Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Shakil Ahmed"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:border-red-600 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="shakil@example.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:border-red-600 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Subject *</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Inquiry regarding donor partnership / issue"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:border-red-600 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Message *</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                placeholder="Write your message details here..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:border-red-600 focus:outline-none"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-red-700 to-rose-600 hover:from-red-800 text-white font-bold text-sm rounded-xl shadow-lg shadow-red-700/25 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {loading ? 'Sending Message...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
