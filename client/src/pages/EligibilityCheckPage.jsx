import React, { useState } from 'react';
import { CheckCircle2, XCircle, AlertCircle, HelpCircle, Calendar, Scale, Activity, ArrowRight } from 'lucide-react';

export default function EligibilityCheckPage() {
  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    lastDonationDate: '',
    hasFever: false,
    hasSurgery: false,
    hasHepatitis: false,
    isPregnant: false,
    hasTattoo: false,
  });

  const [result, setResult] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const calculateEligibility = (e) => {
    e.preventDefault();
    const age = Number(formData.age);
    const weight = Number(formData.weight);

    const reasons = [];
    let isEligible = true;

    // Age Check (18 - 65)
    if (!age || age < 18) {
      isEligible = false;
      reasons.push('Minimum age required to donate blood is 18 years.');
    } else if (age > 65) {
      isEligible = false;
      reasons.push('Maximum age limit for voluntary donation is 65 years.');
    }

    // Weight Check (min 50 kg)
    if (!weight || weight < 50) {
      isEligible = false;
      reasons.push('Minimum body weight required is 50 kg for safe donation.');
    }

    // Interval Check (90 days / 3 months)
    let nextEligibleDateStr = null;
    if (formData.lastDonationDate) {
      const lastDate = new Date(formData.lastDonationDate);
      const today = new Date();
      const diffTime = Math.abs(today - lastDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 90) {
        isEligible = false;
        const remainingDays = 90 - diffDays;
        const nextDate = new Date(lastDate);
        nextDate.setDate(nextDate.getDate() + 90);
        nextEligibleDateStr = nextDate.toLocaleDateString();
        reasons.push(`You must wait 90 days between donations (${remainingDays} days remaining until ${nextEligibleDateStr}).`);
      }
    }

    // Health conditions checks
    if (formData.hasFever) {
      isEligible = false;
      reasons.push('Current fever, flu, or active infection defer donation until full recovery.');
    }
    if (formData.hasSurgery) {
      isEligible = false;
      reasons.push('Major surgery in the past 6 months requires temporary medical deferral.');
    }
    if (formData.hasHepatitis) {
      isEligible = false;
      reasons.push('History of Hepatitis B/C or chronic blood-borne illness permanently restricts donation.');
    }
    if (formData.isPregnant) {
      isEligible = false;
      reasons.push('Pregnancy or active breastfeeding defers donation.');
    }
    if (formData.hasTattoo) {
      isEligible = false;
      reasons.push('Tattoos or body piercings in the last 6 months require temporary deferral.');
    }

    setResult({
      isEligible,
      reasons,
      nextEligibleDate: nextEligibleDateStr,
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-red-600/10 border border-red-500/20 flex items-center justify-center mx-auto text-red-500">
          <Activity className="w-7 h-7" />
        </div>
        <h2 className="text-3xl font-extrabold text-white">Blood Donation Eligibility Checker</h2>
        <p className="text-sm text-slate-400">
          Answer a few quick questions to check if you are eligible to donate blood today.
        </p>
      </div>

      <form onSubmit={calculateEligibility} className="bg-slate-900/60 border border-slate-800 p-8 rounded-3xl space-y-6 shadow-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Your Age (Years) *</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              placeholder="e.g. 24"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:border-red-600 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Body Weight (kg) *</label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleInputChange}
              placeholder="e.g. 62"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:border-red-600 focus:outline-none"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Last Blood Donation Date (If applicable)</label>
          <input
            type="date"
            name="lastDonationDate"
            value={formData.lastDonationDate}
            onChange={handleInputChange}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:border-red-600 focus:outline-none"
          />
        </div>

        {/* Medical Checkboxes */}
        <div className="space-y-3 pt-2">
          <label className="block text-xs font-semibold text-slate-300">Health & Deferral Checklist</label>

          <div className="space-y-2 text-xs">
            <label className="flex items-center space-x-3 p-3 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer hover:border-slate-700 transition">
              <input
                type="checkbox"
                name="hasFever"
                checked={formData.hasFever}
                onChange={handleInputChange}
                className="w-4 h-4 text-red-600 rounded bg-slate-900 border-slate-700"
              />
              <span className="text-slate-300">Active fever, flu, cold, or ongoing antibiotic treatment</span>
            </label>

            <label className="flex items-center space-x-3 p-3 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer hover:border-slate-700 transition">
              <input
                type="checkbox"
                name="hasSurgery"
                checked={formData.hasSurgery}
                onChange={handleInputChange}
                className="w-4 h-4 text-red-600 rounded bg-slate-900 border-slate-700"
              />
              <span className="text-slate-300">Major surgery or blood transfusion in the last 6 months</span>
            </label>

            <label className="flex items-center space-x-3 p-3 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer hover:border-slate-700 transition">
              <input
                type="checkbox"
                name="hasHepatitis"
                checked={formData.hasHepatitis}
                onChange={handleInputChange}
                className="w-4 h-4 text-red-600 rounded bg-slate-900 border-slate-700"
              />
              <span className="text-slate-300">History of Hepatitis B/C, HIV, or chronic blood illness</span>
            </label>

            <label className="flex items-center space-x-3 p-3 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer hover:border-slate-700 transition">
              <input
                type="checkbox"
                name="isPregnant"
                checked={formData.isPregnant}
                onChange={handleInputChange}
                className="w-4 h-4 text-red-600 rounded bg-slate-900 border-slate-700"
              />
              <span className="text-slate-300">Currently pregnant or breastfeeding</span>
            </label>

            <label className="flex items-center space-x-3 p-3 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer hover:border-slate-700 transition">
              <input
                type="checkbox"
                name="hasTattoo"
                checked={formData.hasTattoo}
                onChange={handleInputChange}
                className="w-4 h-4 text-red-600 rounded bg-slate-900 border-slate-700"
              />
              <span className="text-slate-300">Tattoo or body piercing in the last 6 months</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 bg-gradient-to-r from-red-700 to-rose-600 hover:from-red-800 text-white font-bold rounded-xl shadow-lg shadow-red-700/25 transition text-base"
        >
          Check Eligibility Result
        </button>
      </form>

      {/* Result Display Box */}
      {result && (
        <div
          className={`p-6 sm:p-8 rounded-3xl border space-y-4 shadow-2xl animate-fadeIn ${
            result.isEligible
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-100'
              : 'bg-red-950/40 border-red-500/40 text-red-100'
          }`}
        >
          <div className="flex items-center space-x-3">
            {result.isEligible ? (
              <CheckCircle2 className="w-10 h-10 text-emerald-400 shrink-0" />
            ) : (
              <XCircle className="w-10 h-10 text-red-400 shrink-0" />
            )}
            <div>
              <h3 className="text-2xl font-bold">
                {result.isEligible ? 'You Are Eligible to Donate!' : 'Currently Not Eligible to Donate'}
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                {result.isEligible
                  ? 'Great news! You meet all basic physical and medical criteria for voluntary blood donation.'
                  : 'Based on medical guidelines, you are temporarily deferred from donating blood.'}
              </p>
            </div>
          </div>

          {!result.isEligible && result.reasons.length > 0 && (
            <div className="bg-slate-950/60 p-4 rounded-2xl border border-red-900/40 space-y-2 text-xs">
              <h4 className="font-bold text-red-300 uppercase tracking-wider">Deferral Reason(s):</h4>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                {result.reasons.map((reason, idx) => (
                  <li key={idx}>{reason}</li>
                ))}
              </ul>
            </div>
          )}

          {result.isEligible && (
            <div className="pt-2 flex justify-end">
              <a
                href="/donors"
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-2"
              >
                Find Patients Needing Blood <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
