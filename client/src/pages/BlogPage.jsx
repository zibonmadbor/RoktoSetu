import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, ArrowRight, Sparkles, Heart } from 'lucide-react';

export const BLOG_ARTICLES = [
  {
    id: 1,
    slug: 'why-blood-donation-matters',
    title: 'Why Voluntary Blood Donation Matters in Bangladesh',
    category: 'Awareness',
    readTime: '4 min read',
    date: 'July 20, 2026',
    excerpt: 'Bangladesh requires over 1 million units of blood annually. Learn how voluntary donors are bridging the emergency gap.',
    content: `
      <p>In Bangladesh, blood transfusion is a crucial part of healthcare management. Thousands of patients undergoing major surgeries, accident victims, mothers experiencing childbirth complications, and thalassemia patients require immediate blood transfusions every day.</p>
      <h3>The Annual Demand</h3>
      <p>According to health statistics, Bangladesh requires nearly 1 million units of safe blood each year. However, voluntary blood donations currently account for only a portion of the required supply, leaving many families scrambling for replacement donors in critical hours.</p>
      <h3>The Role of Digital Networks</h3>
      <p>Digital platforms like <strong>RaktoSetu</strong> connect voluntary donors with emergency seekers in real time across all 64 districts. By maintaining active donor availability profiles, response times during life-threatening emergencies can be drastically reduced.</p>
    `,
  },
  {
    id: 2,
    slug: 'health-benefits-of-donating-blood',
    title: 'Surprising Health Benefits of Donating Blood Regularly',
    category: 'Health & Science',
    readTime: '3 min read',
    date: 'July 15, 2026',
    excerpt: 'Donating blood isn\'t just good for recipients — it has proven cardiovascular and psychological benefits for donors too.',
    content: `
      <p>While donating blood saves lives, research shows that voluntary donors also experience several health benefits from regular donation every 3 to 4 months.</p>
      <h3>1. Balances Iron Levels in the Body</h3>
      <p>Excessive iron build-up in the bloodstream can contribute to oxidative damage in blood vessels. Regular donation helps maintain healthy iron levels and protects against hemochromatosis.</p>
      <h3>2. Free Health Screening</h3>
      <p>Before every donation, vital health checks including hemoglobin levels, blood pressure, pulse rate, and screening for major infectious diseases are conducted free of charge.</p>
      <h3>3. Mental Wellbeing</h3>
      <p>Knowing that a single donation can save up to 3 lives provides a profound sense of purpose and reduces stress levels.</p>
    `,
  },
  {
    id: 3,
    slug: 'myth-busters-blood-donation-safety',
    title: 'Myth Busters: Common Misconceptions About Donating Blood',
    category: 'Myths vs Facts',
    readTime: '5 min read',
    date: 'July 10, 2026',
    excerpt: 'Debunking fear-based myths about weakness, disease transmission, and recovery after blood donation.',
    content: `
      <p>Many potential donors hesitate due to persistent myths surrounding blood donation. Let’s address the most common misconceptions with medical facts.</p>
      <h3>Myth 1: Donating blood makes you physically weak.</h3>
      <p><strong>Fact:</strong> Your body replaces lost fluid within 24–48 hours, and red blood cells are fully replenished in 4 to 8 weeks. Normal daily activities can be resumed immediately after a brief rest.</p>
      <h3>Myth 2: You can contract diseases while donating.</h3>
      <p><strong>Fact:</strong> Sterile, single-use disposable needles and equipment are used for every single donor. There is zero risk of contracting HIV or Hepatitis during donation.</p>
    `,
  },
  {
    id: 4,
    slug: 'preparing-for-your-first-donation',
    title: 'How to Prepare for Your Very First Blood Donation',
    category: 'Guide',
    readTime: '3 min read',
    date: 'July 05, 2026',
    excerpt: 'Essential tips on hydration, diet, and rest before arriving at the blood bank or donation campaign.',
    content: `
      <p>If you are planning to donate blood for the first time, follow these simple preparation steps for a smooth experience.</p>
      <ul>
        <li><strong>Stay Hydrated:</strong> Drink plenty of water (500ml extra) before your appointment.</li>
        <li><strong>Eat a Healthy Meal:</strong> Have an iron-rich meal 2-3 hours before donating. Avoid fatty foods.</li>
        <li><strong>Get Good Sleep:</strong> Ensure 7-8 hours of sound sleep the night before.</li>
      </ul>
    `,
  },
];

export default function BlogPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-950/80 via-slate-900 to-slate-950 border border-red-900/30 p-8 rounded-3xl space-y-2 text-center md:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          Blood Awareness & Education
        </div>
        <h2 className="text-3xl font-extrabold text-white">RaktoSetu Awareness Journal</h2>
        <p className="text-sm text-slate-400 max-w-xl">
          Articles, medical insights, and guides promoting safe voluntary blood donation in Bangladesh.
        </p>
      </div>

      {/* Articles Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {BLOG_ARTICLES.map((article) => (
          <div
            key={article.id}
            className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-4 hover:border-red-600/30 transition duration-300 shadow-xl"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-400 font-bold uppercase border border-red-500/20">
                  {article.category}
                </span>
                <span className="text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {article.readTime}
                </span>
              </div>

              <h3 className="text-xl font-bold text-white hover:text-red-400 transition">
                <Link to={`/blog/${article.slug}`}>{article.title}</Link>
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">{article.excerpt}</p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-500">{article.date}</span>
              <Link
                to={`/blog/${article.slug}`}
                className="font-semibold text-red-400 hover:text-red-300 flex items-center gap-1"
              >
                Read Full Article <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
