import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { User, Phone, Mail, MapPin, Upload, ShieldCheck, AlertCircle, CheckCircle2, Save, Droplet } from 'lucide-react';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    bloodGroup: 'A+',
    age: '',
    gender: 'male',
    district: '',
    address: '',
    isAvailable: true,
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        bloodGroup: user.bloodGroup || 'A+',
        age: user.age || '',
        gender: user.gender || 'male',
        district: user.district || '',
        address: user.address || '',
        isAvailable: user.isAvailable !== undefined ? user.isAvailable : true,
      });
      if (user.profilePhoto) {
        setPhotoPreview(user.profilePhoto);
      }
    }
  }, [user]);

  // Calculate Profile Completion Percentage
  const calculateCompletion = () => {
    if (!user) return 0;
    const requiredFields = [
      { key: 'name', label: 'Full Name', done: Boolean(formData.name) },
      { key: 'phone', label: 'Phone Number', done: Boolean(formData.phone) },
      { key: 'bloodGroup', label: 'Blood Group', done: Boolean(formData.bloodGroup) },
      { key: 'district', label: 'District', done: Boolean(formData.district) },
      { key: 'address', label: 'Address', done: Boolean(formData.address) },
    ];

    if (user.role === 'donor') {
      requiredFields.push(
        { key: 'age', label: 'Age (>=18)', done: Boolean(formData.age && Number(formData.age) >= 18) },
        { key: 'gender', label: 'Gender', done: Boolean(formData.gender) }
      );
    }

    const completed = requiredFields.filter((f) => f.done).length;
    const percentage = Math.round((completed / requiredFields.length) * 100);

    return { percentage, fields: requiredFields };
  };

  const completionInfo = calculateCompletion();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Profile photo must be less than 5MB.');
        return;
      }
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        dataToSend.append(key, formData[key]);
      });

      if (photoFile) {
        dataToSend.append('profilePhoto', photoFile);
      }

      const res = await updateProfile(dataToSend);
      if (res.success) {
        toast.success('Profile updated successfully!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Banner if Profile Incomplete */}
      {!user?.isProfileComplete && (
        <div className="bg-gradient-to-r from-red-950/80 via-slate-900 to-slate-950 border border-red-800/40 p-6 rounded-3xl space-y-3 shadow-xl">
          <div className="flex items-center space-x-3 text-red-400 font-bold text-base">
            <AlertCircle className="w-6 h-6 shrink-0" />
            <span>Complete your profile to unlock full contact details of donors/recipients!</span>
          </div>
          <p className="text-xs text-slate-300">
            For community trust and emergency verification, please ensure all mandatory fields below are filled.
          </p>
        </div>
      )}

      {/* Profile Completion Checklist & Progress Bar */}
      <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-red-500" /> Profile Completion Checklist
          </h3>
          <span className="text-sm font-extrabold text-red-400">{completionInfo.percentage}% Complete</span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-800">
          <div
            className="bg-gradient-to-r from-red-700 to-rose-500 h-full transition-all duration-500 rounded-full"
            style={{ width: `${completionInfo.percentage}%` }}
          ></div>
        </div>

        {/* Checklist items */}
        <div className="grid sm:grid-cols-3 gap-2 pt-2 text-xs">
          {completionInfo.fields.map((f) => (
            <div
              key={f.key}
              className={`p-2.5 rounded-xl border flex items-center justify-between ${
                f.done ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              <span>{f.label}</span>
              {f.done ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <div className="w-2 h-2 rounded-full bg-slate-700"></div>}
            </div>
          ))}
        </div>
      </div>

      {/* Main Profile Form */}
      <form onSubmit={handleSubmit} className="bg-slate-900/60 border border-slate-800 p-8 rounded-3xl space-y-6 shadow-2xl">
        <h3 className="text-xl font-bold text-white border-b border-slate-800 pb-4">Edit Personal Information</h3>

        {/* Photo Upload Section */}
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <div className="w-24 h-24 rounded-full bg-slate-950 border-2 border-red-600/40 flex items-center justify-center text-red-500 overflow-hidden relative group shrink-0">
            {photoPreview ? (
              <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <User className="w-12 h-12 text-slate-500" />
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Profile Photo</label>
            <div className="flex items-center space-x-3">
              <label className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl cursor-pointer transition flex items-center gap-2">
                <Upload className="w-4 h-4" /> Upload Image
                <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
              </label>
              {photoFile && <span className="text-xs text-emerald-400 font-medium">New image selected</span>}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Allowed formats: JPEG, PNG, WebP (Max 5MB)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:border-red-600 focus:outline-none"
              required
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:border-red-600 focus:outline-none"
              required
            />
          </div>

          {/* Blood Group */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Blood Group</label>
            <select
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleInputChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:border-red-600 focus:outline-none"
            >
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
          </div>

          {/* District */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">District</label>
            <input
              type="text"
              name="district"
              value={formData.district}
              onChange={handleInputChange}
              placeholder="e.g. Dhaka"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:border-red-600 focus:outline-none"
              required
            />
          </div>

          {/* Donor Fields */}
          {user?.role === 'donor' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Age (18 - 65)</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  placeholder="25"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:border-red-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:border-red-600 focus:outline-none"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </>
          )}
        </div>

        {/* Address */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Full Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="House, Road, Area details"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:border-red-600 focus:outline-none"
            required
          />
        </div>

        {/* Save Button */}
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-gradient-to-r from-red-700 to-rose-600 hover:from-red-800 text-white font-bold text-sm rounded-xl shadow-lg shadow-red-700/30 transition flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Saving Changes...' : 'Save Profile Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
