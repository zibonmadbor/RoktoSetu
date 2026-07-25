import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Mail, Lock, Droplets, LogIn, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await login(email, password);
      if (res.success) {
        toast.success(`Welcome back, ${res.user.name}!`);
        navigate(res.user.role === 'donor' ? '/donors' : '/requests');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-red-700 to-rose-600 flex items-center justify-center mx-auto shadow-lg shadow-red-700/30 text-white">
          <Droplets className="w-7 h-7" />
        </div>
        <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
        <p className="text-sm text-slate-400">Log in to your RaktoSetu account</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-900/60 border border-slate-800 p-8 rounded-3xl space-y-5 shadow-2xl">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="rahim@example.com"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-3 text-sm text-slate-100 focus:border-red-600 focus:outline-none"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-3 text-sm text-slate-100 focus:border-red-600 focus:outline-none"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-gradient-to-r from-red-700 to-rose-600 hover:from-red-800 text-white font-bold rounded-xl shadow-lg shadow-red-700/30 transition flex items-center justify-center gap-2 text-base disabled:opacity-50"
        >
          {loading ? 'Authenticating...' : 'Log In'}
          <ArrowRight className="w-5 h-5" />
        </button>

        <p className="text-center text-xs text-slate-400 pt-2">
          Don't have an account?{' '}
          <Link to="/register" className="text-red-400 font-semibold hover:underline">
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
}
