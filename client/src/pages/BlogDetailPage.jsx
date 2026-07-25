import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { BLOG_ARTICLES } from './BlogPage';
import { ArrowLeft, Clock, Calendar, Share2, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BlogDetailPage() {
  const { slug } = useParams();
  const article = BLOG_ARTICLES.find((a) => a.slug === slug);

  if (!article) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Article Not Found</h2>
        <p className="text-sm text-slate-400">The article you are looking for does not exist or has been moved.</p>
        <Link to="/blog" className="inline-block px-5 py-2.5 bg-red-700 text-white font-semibold text-xs rounded-xl">
          Back to Blog
        </Link>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Article link copied to clipboard!');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      <Link to="/blog" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition">
        <ArrowLeft className="w-4 h-4" /> Back to Articles
      </Link>

      <div className="space-y-4">
        <div className="flex items-center space-x-3 text-xs">
          <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 font-bold uppercase border border-red-500/20">
            {article.category}
          </span>
          <span className="text-slate-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {article.readTime}
          </span>
          <span className="text-slate-400 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> {article.date}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">{article.title}</h1>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-3xl space-y-6 text-slate-200 text-sm leading-relaxed shadow-2xl">
        <div dangerouslySetInnerHTML={{ __html: article.content }}></div>

        <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">Published by RaktoSetu Medical Team</span>
          <button
            onClick={handleShare}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition flex items-center gap-1.5"
          >
            <Share2 className="w-4 h-4" /> Share Article
          </button>
        </div>
      </div>
    </div>
  );
}
