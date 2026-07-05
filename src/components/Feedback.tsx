import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Quote, Send, CheckCircle2, ShieldCheck, Trash2, Clock } from 'lucide-react';
import { useUser } from '../context/AuthContext';

interface FeedbackData {
  _id: string;
  name: string;
  role: string;
  message: string;
  rating: number;
  isApproved: boolean;
  createdAt: string;
}

export default function Feedback() {
  const [feedbacks, setFeedbacks] = useState<FeedbackData[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [message, setMessage] = useState('');
  const { user } = useUser();

  useEffect(() => {
    fetchFeedbacks();
  }, [user]);

  const fetchFeedbacks = async () => {
    try {
      const url = user ? '/api/admin/feedback' : '/api/feedback';
      console.log(`Fetching feedbacks from: ${url}`);
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        console.log(`Successfully fetched ${data.length} feedbacks`);
        setFeedbacks(data);
      } else {
        console.error(`Failed to fetch feedbacks: ${res.status} ${res.statusText}`);
      }
    } catch (err) {
      console.error("Error fetching feedbacks:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          role,
          rating,
          message
        })
      });
      if (res.ok) {
        setSubmitted(true);
        setName('');
        setRole('');
        setMessage('');
        setRating(5);
        fetchFeedbacks();
      }
    } catch (err) {
      console.error("Error saving feedback:", err);
      alert("Failed to submit feedback. Please try again.");
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch(`/api/feedback/${id}/approve`, { method: 'PUT' });
      if (res.ok) {
        fetchFeedbacks();
      }
    } catch (err) {
      console.error("Error approving feedback:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/feedback/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchFeedbacks();
      }
    } catch (err) {
      console.error("Error deleting feedback:", err);
    }
  };
  return (
    <section id="feedback" className="py-24 px-6 bg-brand-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-900/40 mb-4">Testimonials</p>
          <h2 className="text-4xl md:text-5xl font-display font-light tracking-tight text-brand-900">What People <span className="italic font-normal">Say</span></h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {feedbacks.filter(f => f.isApproved || user).map((item, idx) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`p-8 rounded-2xl relative border ${
                item.isApproved 
                  ? "bg-brand-100/20 border-brand-900/5" 
                  : "bg-amber-50/50 border-amber-200/50"
              }`}
            >
              <Quote className="absolute top-6 right-8 w-8 h-8 text-brand-900/5" />
              
              {!item.isApproved && (
                <div className="absolute top-4 left-4 flex items-center gap-2 px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  <Clock className="w-3 h-3" />
                  Pending Approval
                </div>
              )}

              <div className="flex gap-1 mb-4 mt-2">
                {[...Array(item.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-brand-400 text-brand-400" />
                ))}
              </div>
              <p className="text-brand-900/70 mb-8 italic leading-relaxed">"{item.message}"</p>
              <div className="flex justify-between items-end">
                <div>
                  <h4 className="font-display font-bold text-brand-900">{item.name}</h4>
                  <p className="text-xs text-brand-900/40 uppercase tracking-widest">{item.role}</p>
                </div>
                
                {user && (
                  <div className="flex gap-2">
                    {!item.isApproved && (
                      <button 
                        onClick={() => handleApprove(item._id)}
                        className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                        title="Approve"
                      >
                        <ShieldCheck className="w-4 h-4" />
                      </button>
                    )}
                    <button 
                      onClick={() => handleDelete(item._id)}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          {feedbacks.length === 0 && (
            <div className="col-span-full text-center py-12 text-brand-900/30 font-display italic">
              No testimonials yet. Be the first to share your thoughts!
            </div>
          )}
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-brand-50 border border-brand-900/10 rounded-3xl p-8 md:p-12 shadow-sm">
            <div className="text-center mb-10">
              <h3 className="text-2xl font-display font-semibold text-brand-900 mb-2">Give your feedback</h3>
              <p className="text-brand-900/50 text-sm">Your feedback helps me grow and improve my engineering solutions.</p>
            </div>

            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form 
                  key="feedback-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit} 
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-brand-900/40 px-1">Full Name</label>
                      <input 
                        required
                        type="text" 
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full bg-white border border-brand-900/10 rounded-xl px-4 py-3 text-brand-900 placeholder:text-brand-900/20 focus:outline-none focus:ring-2 focus:ring-brand-900/5 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-brand-900/40 px-1">Role / Company</label>
                      <input 
                        required
                        type="text" 
                        value={role}
                        onChange={e => setRole(e.target.value)}
                        placeholder="Project Manager"
                        className="w-full bg-white border border-brand-900/10 rounded-xl px-4 py-3 text-brand-900 placeholder:text-brand-900/20 focus:outline-none focus:ring-2 focus:ring-brand-900/5 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-brand-900/40 px-1">Rating</label>
                    <div className="flex gap-2 p-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(0)}
                          className="focus:outline-none transition-transform active:scale-90"
                        >
                          <Star 
                            className={`w-8 h-8 ${
                              star <= (hoveredRating || rating) 
                                ? "fill-brand-400 text-brand-400" 
                                : "text-brand-900/10"
                            } transition-colors`} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-brand-900/40 px-1">Your Message</label>
                    <textarea 
                      required
                      rows={4}
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      placeholder="Share your thoughts on our collaboration..."
                      className="w-full bg-white border border-brand-900/10 rounded-xl px-4 py-3 text-brand-900 placeholder:text-brand-900/20 focus:outline-none focus:ring-2 focus:ring-brand-900/5 transition-all resize-none"
                    ></textarea>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-brand-900 text-brand-50 py-4 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-brand-800 transition-all active:scale-[0.98]"
                  >
                    <Send className="w-4 h-4" />
                    Submit Feedback
                  </button>
                </motion.form>
              ) : (
                <motion.div 
                  key="success-message"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-2xl font-display font-bold text-brand-900 mb-2">Thank you!</h4>
                  <p className="text-brand-900/60 mb-8">Your feedback has been submitted successfully.</p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="text-brand-900 font-bold text-sm uppercase tracking-widest hover:underline"
                  >
                    Submit another
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
