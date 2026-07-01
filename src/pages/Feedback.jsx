import React, { useState } from 'react';
import { Star, Send, Loader2 } from 'lucide-react';
import { api } from '../api';

const Feedback = () => {
  const [name, setName]           = useState('');
  const [rating, setRating]       = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [message, setMessage]     = useState('');
  const [status, setStatus]       = useState(''); // '' | 'loading' | 'success' | 'error'
  const [error, setError]         = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) { setError('Please select a rating.'); return; }
    if (!message.trim()) { setError('Please enter a feedback message.'); return; }

    setError('');
    setStatus('loading');
    try {
      await api.submitContact({
        name:    name.trim() || 'Anonymous',
        email:   'feedback@skillforge.club',
        subject: `Feedback — ${rating}/5 stars`,
        message: message.trim(),
      });
      setStatus('success');
    } catch {
      setStatus('error');
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto flex items-center justify-center">
      <div className="w-full glass-card p-10 md:p-14 rounded-3xl relative overflow-hidden">

        <div className="absolute -top-32 -right-32 w-64 h-64 bg-yellow-500/20 rounded-full blur-3xl mix-blend-screen" />
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl mix-blend-screen" />

        <div className="text-center mb-10 relative z-10">
          <h1 className="text-4xl font-bold text-white mb-2">Your <span className="text-yellow-400">Feedback</span></h1>
          <p className="text-gray-400">We value your thoughts to improve SkillForge.</p>
        </div>

        {status === 'success' ? (
          <div className="relative z-10 text-center py-12 space-y-4">
            <div className="text-6xl">🎉</div>
            <p className="text-green-400 font-bold text-xl">Thank you for your feedback!</p>
            <p className="text-gray-400 text-sm">Your response has been recorded.</p>
            <button
              onClick={() => { setStatus(''); setRating(0); setMessage(''); setName(''); }}
              className="mt-4 px-6 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition-colors"
            >
              Submit Another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Name (Optional)</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Anonymous Developer"
                className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all"
              />
            </div>

            <div className="space-y-4">
              <label className="text-sm font-medium text-gray-300 block text-center">Rate your experience</label>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      size={40}
                      className={`transition-colors duration-300 ${
                        star <= (hoverRating || rating)
                          ? 'fill-yellow-400 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]'
                          : 'text-gray-600 hover:text-gray-500'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Feedback Message</label>
              <textarea
                rows="5"
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="What could we do better?"
                className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all resize-none"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 disabled:opacity-60 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(234,179,8,0.4)] hover:shadow-[0_0_25px_rgba(234,179,8,0.6)]"
            >
              {status === 'loading'
                ? <><Loader2 size={18} className="animate-spin" /> Submitting...</>
                : <><Send size={18} /> Submit Feedback</>
              }
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Feedback;
