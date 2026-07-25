import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { User, Mail, Lock, Phone, MapPin, Upload, Heart, Droplets, ArrowRight } from 'lucide-react';

const registerSchema = yup.object().shape({
  role: yup.string().oneOf(['donor', 'recipient']).required(),
  name: yup.string().trim().required('Name is required'),
  email: yup.string().email('Valid email required').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  phone: yup.string().trim().required('Phone number is required'),
  bloodGroup: yup.string().required('Blood group is required'),
  district: yup.string().trim().required('District is required'),
  address: yup.string().trim().required('Address is required'),
  age: yup.number().when('role', {
    is: 'donor',
    then: (schema) => schema.min(18, 'Must be at least 18').max(65, 'Max age 65').required('Age required for donors'),
    otherwise: (schema) => schema.nullable().optional(),
  }),
  gender: yup.string().when('role', {
    is: 'donor',
    then: (schema) => schema.required('Gender required for donors'),
    otherwise: (schema) => schema.optional(),
  }),
});

export default function RegisterPage() {
  const { register: registerAuth } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState('donor');
  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      role: 'donor',
      bloodGroup: 'A+',
      gender: 'male',
    },
  });

  const handleRoleToggle = (selectedRole) => {
    setRole(selectedRole);
    setValue('role', selectedRole);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await registerAuth(data);
      if (res.success) {
        toast.success(`Welcome to RaktoSetu, ${res.user.name}!`);
        navigate(data.role === 'donor' ? '/donors' : '/requests');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-700 to-rose-600 flex items-center justify-center mx-auto shadow-lg shadow-red-700/30 text-white">
          <Droplets className="w-6 h-6" />
        </div>
        <h2 className="text-3xl font-bold text-white">Join RaktoSetu Network</h2>
        <p className="text-sm text-slate-400">Register as a voluntary donor or emergency blood recipient</p>
      </div>

      {/* Role Toggle Switch */}
      <div className="bg-slate-900 border border-slate-800 p-1.5 rounded-2xl flex max-w-sm mx-auto">
        <button
          type="button"
          onClick={() => handleRoleToggle('donor')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition ${
            role === 'donor'
              ? 'bg-red-700 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Blood Donor
        </button>
        <button
          type="button"
          onClick={() => handleRoleToggle('recipient')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition ${
            role === 'recipient'
              ? 'bg-red-700 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Recipient
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-slate-900/60 border border-slate-800 p-6 sm:p-8 rounded-3xl space-y-5 shadow-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name *</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                {...register('name')}
                placeholder="Rahim Ahmed"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-100 focus:border-red-600 focus:outline-none"
              />
            </div>
            {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>}
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                {...register('email')}
                placeholder="rahim@example.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-100 focus:border-red-600 focus:outline-none"
              />
            </div>
            {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                {...register('password')}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-100 focus:border-red-600 focus:outline-none"
              />
            </div>
            {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number *</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                {...register('phone')}
                placeholder="01712345678"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-100 focus:border-red-600 focus:outline-none"
              />
            </div>
            {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone.message}</p>}
          </div>

          {/* Blood Group */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Blood Group *</label>
            <select
              {...register('bloodGroup')}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:border-red-600 focus:outline-none"
            >
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
            {errors.bloodGroup && <p className="text-xs text-red-400 mt-1">{errors.bloodGroup.message}</p>}
          </div>

          {/* District */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">District *</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                {...register('district')}
                placeholder="e.g. Dhaka, Chittagong"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-100 focus:border-red-600 focus:outline-none"
              />
            </div>
            {errors.district && <p className="text-xs text-red-400 mt-1">{errors.district.message}</p>}
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Full Address *</label>
          <input
            type="text"
            {...register('address')}
            placeholder="House #12, Road #4, Mirpur 10, Dhaka"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:border-red-600 focus:outline-none"
          />
          {errors.address && <p className="text-xs text-red-400 mt-1">{errors.address.message}</p>}
        </div>

        {/* Donor Specific Fields */}
        {role === 'donor' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-red-950/20 border border-red-900/30">
            <div>
              <label className="block text-xs font-semibold text-red-300 mb-1">Age (18 - 65) *</label>
              <input
                type="number"
                {...register('age')}
                placeholder="25"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:border-red-600 focus:outline-none"
              />
              {errors.age && <p className="text-xs text-red-400 mt-1">{errors.age.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-red-300 mb-1">Gender *</label>
              <select
                {...register('gender')}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:border-red-600 focus:outline-none"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && <p className="text-xs text-red-400 mt-1">{errors.gender.message}</p>}
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-gradient-to-r from-red-700 to-rose-600 hover:from-red-800 text-white font-bold rounded-xl shadow-lg shadow-red-700/30 transition flex items-center justify-center gap-2 text-base disabled:opacity-50"
        >
          {loading ? 'Registering Account...' : 'Complete Registration'}
          <ArrowRight className="w-5 h-5" />
        </button>

        <p className="text-center text-xs text-slate-400">
          Already registered?{' '}
          <Link to="/login" className="text-red-400 font-semibold hover:underline">
            Log In here
          </Link>
        </p>
      </form>
    </div>
  );
}
