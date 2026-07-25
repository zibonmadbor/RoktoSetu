import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  Heart,
  Search,
  Users,
  Award,
  ShieldCheck,
  ArrowRight,
  Droplet,
  Star,
  CheckCircle,
  Sparkles,
  ChevronDown,
  Activity,
  UserPlus,
  HeartHandshake,
  MapPin,
  Quote,
  Clock,
  Building2,
  PhoneCall,
  CheckCircle2,
} from 'lucide-react';
import API from '../api/axios';
import EmergencyBanner from '../components/EmergencyBanner';

/**
 * Animated Counter Component for Smooth Numerical Reveal on Scroll
 */
function AnimatedCounter({ from = 0, to, duration = 2, suffix = '' }) {
  const [count, setCount] = useState(from);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (inView) {
      let startTime = null;
      const animateCount = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
        setCount(Math.floor(progress * (to - from) + from));
        if (progress < 1) {
          requestAnimationFrame(animateCount);
        }
      };
      requestAnimationFrame(animateCount);
    }
  }, [inView, from, to, duration]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function LandingPage() {
  const [topDonors, setTopDonors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopDonors = async () => {
      try {
        const res = await API.get('/leaderboard?limit=5');
        if (res.data.success) {
          setTopDonors(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load leaderboard preview:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTopDonors();
  }, []);

  const getRankBorder = (idx) => {
    if (idx === 0) return 'border-amber-400 shadow-amber-400/30';
    if (idx === 1) return 'border-slate-300 shadow-slate-300/30';
    if (idx === 2) return 'border-amber-700 shadow-amber-700/30';
    return 'border-rose-500/40 shadow-rose-500/20';
  };

  const getBadgeTag = (donations) => {
    if (donations >= 20) return 'Platinum Hero';
    if (donations >= 10) return 'Gold Hero';
    if (donations >= 5) return 'Silver Hero';
    return 'Bronze Donor';
  };

  return (
    <div className="space-y-24 pb-20 overflow-hidden bg-slate-950 text-slate-100">
      {/* 0. Emergency Critical Request Banner */}
      <EmergencyBanner />

      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center pt-12 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Background Image with Deep Red Gradient Overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=1920&q=80"
            alt="Blood Donation Compassion"
            className="w-full h-full object-cover object-center scale-105 filter brightness-75"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-red-950/90 to-slate-950/85 backdrop-blur-[2px]"></div>
        </div>

        <div className="max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Main Hero Copy */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-600/20 border border-red-500/30 text-red-300 text-xs font-semibold backdrop-blur-md shadow-lg">
              <Sparkles className="w-4 h-4 text-red-400 animate-pulse" />
              Bangladesh's Premier Voluntary Blood Donation Platform
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
              Every Drop Counts. <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-400 via-rose-300 to-white">
                Every Donor is a Hero.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-xl mx-auto lg:mx-0 font-light">
              RaktoSetu connects voluntary blood donors with patients in emergency need across 64 districts. Your decision to donate can save up to 3 human lives today.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-700 hover:to-rose-800 text-white font-bold rounded-2xl shadow-xl shadow-red-600/40 transition transform hover:-translate-y-1 flex items-center justify-center gap-3 text-base group"
              >
                <Heart className="w-5 h-5 fill-white group-hover:scale-110 transition duration-300" />
                Become a Donor
              </Link>

              <Link
                to="/requests/new"
                className="w-full sm:w-auto px-8 py-4 bg-slate-900/80 hover:bg-slate-800/90 text-white font-semibold rounded-2xl border border-slate-700/80 backdrop-blur-md transition flex items-center justify-center gap-2 text-base hover:border-red-500/50"
              >
                Need Blood? Request Now
                <ArrowRight className="w-5 h-5 text-slate-400" />
              </Link>
            </div>
          </motion.div>

          {/* Floating Glassmorphism Hero Badges */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4"
          >
            {/* Stat Card 1 */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-5 rounded-3xl shadow-2xl flex items-center space-x-4 hover:border-red-500/30 transition duration-300">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-red-600/30">
                <Users className="w-7 h-7" />
              </div>
              <div>
                <div className="text-3xl font-extrabold text-white tracking-tight">
                  <AnimatedCounter to={12450} suffix="+" />
                </div>
                <div className="text-xs uppercase font-semibold text-red-400 tracking-wider">Registered Donors</div>
              </div>
            </div>

            {/* Stat Card 2 */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-5 rounded-3xl shadow-2xl flex items-center space-x-4 hover:border-red-500/30 transition duration-300">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-600 to-red-700 flex items-center justify-center text-white shrink-0 shadow-lg shadow-rose-600/30">
                <Heart className="w-7 h-7 fill-white" />
              </div>
              <div>
                <div className="text-3xl font-extrabold text-white tracking-tight">
                  <AnimatedCounter to={25800} suffix="+" />
                </div>
                <div className="text-xs uppercase font-semibold text-rose-400 tracking-wider">Lives Saved</div>
              </div>
            </div>

            {/* Stat Card 3 */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-5 rounded-3xl shadow-2xl flex items-center space-x-4 hover:border-red-500/30 transition duration-300">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-amber-500/30">
                <MapPin className="w-7 h-7" />
              </div>
              <div>
                <div className="text-3xl font-extrabold text-white tracking-tight">
                  <AnimatedCounter to={64} suffix=" Districts" />
                </div>
                <div className="text-xs uppercase font-semibold text-amber-400 tracking-wider">Nationwide Coverage</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 text-slate-400 animate-bounce hidden sm:flex flex-col items-center gap-1 text-xs">
          <span>Scroll to explore</span>
          <ChevronDown className="w-4 h-4 text-red-500" />
        </div>
      </section>

      {/* 2. "WHY DONATE BLOOD" / INSPIRE SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
        >
          {/* Left Side: Emotional Image with Frame */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-800 group">
              <img
                src="https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1000&q=80"
                alt="Care and Hope in Hospital"
                className="w-full h-[450px] object-cover group-hover:scale-105 transition duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80"></div>
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-white/10">
                <p className="text-xs text-rose-300 font-semibold">"A single unit of blood saved my daughter during her heart surgery."</p>
                <span className="text-[10px] text-slate-400 block mt-1">— Rashida Begum, Recipient Parent</span>
              </div>
            </div>
          </div>

          {/* Right Side: Inspiring Copy & Quick Facts */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wider">
              <Droplet className="w-3.5 h-3.5 fill-red-500/30" />
              Hope & Healing
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
              Your Blood, Someone's <span className="text-red-500">Second Chance</span> at Life
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-light">
              Blood cannot be manufactured in a laboratory. It can only come from generous voluntary donors like you. Every day, surgeries, trauma care, and cancer treatments require urgent blood transfusions.
            </p>

            {/* Bulleted Quick Facts */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start space-x-3 bg-slate-900/50 p-3.5 rounded-2xl border border-slate-800">
                <CheckCircle2 className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-slate-200"><strong>1 Donation = 3 Lives Saved:</strong> Red cells, platelets, and plasma can be separated to help 3 patients.</span>
              </div>

              <div className="flex items-start space-x-3 bg-slate-900/50 p-3.5 rounded-2xl border border-slate-800">
                <CheckCircle2 className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-slate-200"><strong>Every 2 Seconds:</strong> Someone in Bangladesh requires an emergency blood transfusion.</span>
              </div>

              <div className="flex items-start space-x-3 bg-slate-900/50 p-3.5 rounded-2xl border border-slate-800">
                <CheckCircle2 className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-slate-200"><strong>Free Health Screenings:</strong> Donors receive complimentary checkups for hemoglobin, blood pressure, and blood group.</span>
              </div>
            </div>

            {/* Testimonial Quote Box */}
            <div className="bg-gradient-to-r from-red-950/60 to-slate-900 border border-red-800/40 p-5 rounded-2xl relative">
              <Quote className="w-8 h-8 text-red-600/30 absolute top-3 right-3" />
              <p className="text-xs italic text-slate-200 leading-relaxed">
                "Finding B- negative blood in Sylhet was impossible until RaktoSetu notified a voluntary donor within 15 minutes. Thank you for giving my brother a new life."
              </p>
              <div className="text-[11px] font-bold text-red-400 mt-2">— Shahriar Alam, Emergency Seeker</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 3. HOW IT WORKS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-red-500 uppercase tracking-widest">Simple 4-Step Process</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">How RaktoSetu Works</h2>
          <p className="text-sm text-slate-400">Streamlined process connecting voluntary donors directly with patients in need.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Step 1 */}
          <motion.div
            whileHover={{ y: -8 }}
            className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl relative space-y-4 shadow-xl hover:border-red-500/40 transition duration-300"
          >
            <span className="text-5xl font-extrabold text-slate-800 absolute top-4 right-6">01</span>
            <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-600/30">
              <UserPlus className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">1. Register Profile</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Create an account specifying your blood group, district, and donation availability status.
            </p>
          </motion.div>

          {/* Step 2 */}
          <motion.div
            whileHover={{ y: -8 }}
            className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl relative space-y-4 shadow-xl hover:border-red-500/40 transition duration-300"
          >
            <span className="text-5xl font-extrabold text-slate-800 absolute top-4 right-6">02</span>
            <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-600/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">2. Get Verified</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Complete your profile verification to unlock direct contact access and trust badges.
            </p>
          </motion.div>

          {/* Step 3 */}
          <motion.div
            whileHover={{ y: -8 }}
            className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl relative space-y-4 shadow-xl hover:border-red-500/40 transition duration-300"
          >
            <span className="text-5xl font-extrabold text-slate-800 absolute top-4 right-6">03</span>
            <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-600/30">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">3. Get Matched</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Receive real-time email alerts whenever a patient in your district needs your blood group.
            </p>
          </motion.div>

          {/* Step 4 */}
          <motion.div
            whileHover={{ y: -8 }}
            className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl relative space-y-4 shadow-xl hover:border-red-500/40 transition duration-300"
          >
            <span className="text-5xl font-extrabold text-slate-800 absolute top-4 right-6">04</span>
            <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-600/30">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">4. Donate & Earn Rank</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Donate blood safely at verified hospitals and earn honor ranks on the Leaderboard.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 4. IMPACT GALLERY SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-red-500 uppercase tracking-widest">Our Community in Action</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Impact Gallery</h2>
          <p className="text-sm text-slate-400">Moments of hope, compassion, and voluntary donation drives across Bangladesh.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Gallery Image 1 */}
          <div className="group relative rounded-3xl overflow-hidden border border-slate-800 h-64 shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1536856136534-bb679c52a9aa?auto=format&fit=crop&w=800&q=80"
              alt="Voluntary Blood Donation Camp"
              className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-90 transition"></div>
            <div className="absolute bottom-4 left-4 right-4">
              <span className="text-[10px] font-bold uppercase text-red-400 bg-red-950/60 px-2 py-0.5 rounded border border-red-800/40">Dhaka Drive</span>
              <h4 className="text-sm font-bold text-white mt-1">Community Donation Camp — Panthapath</h4>
            </div>
          </div>

          {/* Gallery Image 2 */}
          <div className="group relative rounded-3xl overflow-hidden border border-slate-800 h-64 shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80"
              alt="Medical Volunteer Team"
              className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-90 transition"></div>
            <div className="absolute bottom-4 left-4 right-4">
              <span className="text-[10px] font-bold uppercase text-red-400 bg-red-950/60 px-2 py-0.5 rounded border border-red-800/40">Chittagong</span>
              <h4 className="text-sm font-bold text-white mt-1">Volunteer Medical Unit — GEC Circle</h4>
            </div>
          </div>

          {/* Gallery Image 3 */}
          <div className="group relative rounded-3xl overflow-hidden border border-slate-800 h-64 shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80"
              alt="Hospital Care & Compassion"
              className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-90 transition"></div>
            <div className="absolute bottom-4 left-4 right-4">
              <span className="text-[10px] font-bold uppercase text-red-400 bg-red-950/60 px-2 py-0.5 rounded border border-red-800/40">Emergency Transfusion</span>
              <h4 className="text-sm font-bold text-white mt-1">Pediatric Ward Patient Support</h4>
            </div>
          </div>

          {/* Gallery Image 4 */}
          <div className="group relative rounded-3xl overflow-hidden border border-slate-800 h-64 shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=800&q=80"
              alt="Blood Testing & Screening"
              className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-90 transition"></div>
            <div className="absolute bottom-4 left-4 right-4">
              <span className="text-[10px] font-bold uppercase text-red-400 bg-red-950/60 px-2 py-0.5 rounded border border-red-800/40">Lab Safety</span>
              <h4 className="text-sm font-bold text-white mt-1">Strict Blood Screening & Testing</h4>
            </div>
          </div>

          {/* Gallery Image 5 */}
          <div className="group relative rounded-3xl overflow-hidden border border-slate-800 h-64 shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80"
              alt="Youth Donor Rally"
              className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-90 transition"></div>
            <div className="absolute bottom-4 left-4 right-4">
              <span className="text-[10px] font-bold uppercase text-red-400 bg-red-950/60 px-2 py-0.5 rounded border border-red-800/40">Sylhet</span>
              <h4 className="text-sm font-bold text-white mt-1">University Youth Blood Rally</h4>
            </div>
          </div>

          {/* Gallery Image 6 */}
          <div className="group relative rounded-3xl overflow-hidden border border-slate-800 h-64 shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=800&q=80"
              alt="Donor Hero Celebration"
              className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-90 transition"></div>
            <div className="absolute bottom-4 left-4 right-4">
              <span className="text-[10px] font-bold uppercase text-red-400 bg-red-950/60 px-2 py-0.5 rounded border border-red-800/40">Recognition</span>
              <h4 className="text-sm font-bold text-white mt-1">Honoring 20+ Time Repeat Donors</h4>
            </div>
          </div>
        </div>
      </section>

      {/* 5. LIVE STATS COUNTER BAND */}
      <section className="bg-gradient-to-r from-red-900 via-rose-700 to-red-950 py-16 text-white shadow-2xl relative overflow-hidden border-y border-red-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center relative z-10">
          <div className="space-y-2">
            <Users className="w-8 h-8 text-white/80 mx-auto" />
            <div className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              <AnimatedCounter to={12450} suffix="+" />
            </div>
            <p className="text-xs uppercase font-bold text-red-200 tracking-wider">Registered Donors</p>
          </div>

          <div className="space-y-2">
            <Droplet className="w-8 h-8 text-white/80 fill-white/30 mx-auto" />
            <div className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              <AnimatedCounter to={18920} suffix="+" />
            </div>
            <p className="text-xs uppercase font-bold text-red-200 tracking-wider">Total Donations</p>
          </div>

          <div className="space-y-2">
            <Heart className="w-8 h-8 text-white/80 fill-white/30 mx-auto" />
            <div className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              <AnimatedCounter to={25800} suffix="+" />
            </div>
            <p className="text-xs uppercase font-bold text-red-200 tracking-wider">Lives Saved</p>
          </div>

          <div className="space-y-2">
            <Activity className="w-8 h-8 text-white/80 mx-auto" />
            <div className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              <AnimatedCounter to={42} suffix=" Active" />
            </div>
            <p className="text-xs uppercase font-bold text-red-200 tracking-wider">Emergency Requests</p>
          </div>
        </div>
      </section>

      {/* 6. TOP DONORS / LEADERBOARD PREVIEW ("Our Heroes This Month") */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-red-500 uppercase tracking-widest">Hall of Fame</span>
            <h2 className="text-3xl font-extrabold text-white">Our Heroes This Month</h2>
          </div>
          <Link
            to="/leaderboard"
            className="text-sm font-semibold text-red-400 hover:text-red-300 flex items-center gap-1.5"
          >
            View Full Leaderboard <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="py-8 text-center text-slate-400 text-sm">Loading hall of fame...</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {topDonors.map((donor, idx) => (
              <motion.div
                key={donor._id}
                whileHover={{ y: -6 }}
                className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl flex flex-col items-center text-center space-y-3 relative shadow-xl hover:border-red-500/40 transition duration-300"
              >
                <div className="w-7 h-7 rounded-full bg-red-700 text-white font-bold text-xs flex items-center justify-center absolute top-3 left-3 shadow">
                  #{idx + 1}
                </div>

                {/* Profile Photo with Metallic Rank Border */}
                <div className={`w-20 h-20 rounded-full bg-slate-800 border-4 ${getRankBorder(idx)} flex items-center justify-center text-rose-400 font-bold text-xl overflow-hidden shadow-lg`}>
                  {donor.profilePhoto ? (
                    <img src={donor.profilePhoto} alt={donor.name} className="w-full h-full object-cover" />
                  ) : (
                    donor.bloodGroup
                  )}
                </div>

                <div>
                  <h4 className="font-bold text-white text-base line-clamp-1">{donor.name}</h4>
                  <p className="text-xs text-slate-400 flex items-center justify-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                    {donor.district || 'Bangladesh'}
                  </p>
                </div>

                <div className="px-3 py-1 bg-red-950/60 border border-red-800/40 rounded-full text-xs font-bold text-red-300">
                  {donor.totalDonations} Donations
                </div>

                <span className="text-[10px] text-slate-400 uppercase font-semibold">
                  {getBadgeTag(donor.totalDonations)}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* 7. TESTIMONIALS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-red-500 uppercase tracking-widest font-mono">Heartfelt Stories</span>
          <h2 className="text-3xl font-extrabold text-white">Voices of Hope</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl">
            <div className="flex text-amber-400 space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-slate-300 italic leading-relaxed">
              "When my father needed 3 bags of B+ blood urgently at Square Hospital, RaktoSetu connected us with a donor in less than 20 minutes!"
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
                alt="Tanvir Hasan"
                className="w-10 h-10 rounded-full object-cover border border-red-500/40"
              />
              <div>
                <span className="text-xs font-bold text-white block">Tanvir Hasan</span>
                <span className="text-[10px] text-red-400">Recipient Relative • Dhaka</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl">
            <div className="flex text-amber-400 space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-slate-300 italic leading-relaxed">
              "Being able to keep my donation availability updated on RaktoSetu ensures I am only called when I am eligible to donate again."
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80"
                alt="Nusrat Jahan"
                className="w-10 h-10 rounded-full object-cover border border-red-500/40"
              />
              <div>
                <span className="text-xs font-bold text-white block">Nusrat Jahan</span>
                <span className="text-[10px] text-red-400">Voluntary Donor • Chittagong</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl">
            <div className="flex text-amber-400 space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-slate-300 italic leading-relaxed">
              "The leaderboard and donor badges motivate us to donate regularly. A truly life-saving digital initiative in Bangladesh!"
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
                alt="Shakil Ahmed"
                className="w-10 h-10 rounded-full object-cover border border-red-500/40"
              />
              <div>
                <span className="text-xs font-bold text-white block">Shakil Ahmed</span>
                <span className="text-[10px] text-red-400">11-Time Donor • Sylhet</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. EMERGENCY CALL-TO-ACTION BAND */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-red-950 via-slate-900 to-red-950 border border-red-600/40 p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-red-600/20 border border-red-500/30 text-red-500 flex items-center justify-center shrink-0 animate-pulse">
              <Activity className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Someone Needs Blood Urgently Near You</h3>
              <p className="text-xs text-slate-300">Browse active emergency patient requests across Bangladesh and offer immediate help.</p>
            </div>
          </div>

          <Link
            to="/requests"
            className="px-8 py-3.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 text-white font-bold text-sm rounded-xl shadow-xl shadow-red-600/30 transition shrink-0 flex items-center gap-2"
          >
            See Emergency Requests <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 9. FINAL CTA SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden p-12 text-center space-y-6 border border-slate-800 shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1600&q=80"
            alt="Ready to save a life"
            className="absolute inset-0 w-full h-full object-cover filter brightness-[0.25]"
            loading="lazy"
          />
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white">Ready to Save a Life?</h2>
            <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
              Join thousands of Bangladeshis who are standing by to help patients in emergency need. Registration takes less than 2 minutes.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 text-white font-extrabold text-lg rounded-2xl shadow-2xl shadow-red-600/50 transition transform hover:scale-105"
            >
              <Heart className="w-6 h-6 fill-white" />
              Join RaktoSetu Today
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
