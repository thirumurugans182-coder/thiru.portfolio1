import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User as AuthUser, Lock, ArrowLeft, LogIn, Clock, CheckCircle2, Trash2, ShieldCheck, Image as ImageIcon, Camera, Link as LinkIcon, Plus, X as CloseIcon, Mail, Phone, Github, Linkedin, MessageCircle, Instagram, Twitter, Youtube, Facebook, Globe } from 'lucide-react';
import { useUser } from '../context/AuthContext';

interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

interface AboutData {
  heroTitle?: string;
  heroRole?: string;
  heroDescription?: string;
  heroImage?: string;
  aboutImage?: string;
  contactEmail?: string;
  contactPhone?: string;
  socialLinks?: SocialLink[];
}

interface FeedbackData {
  _id: string;
  name: string;
  role: string;
  message: string;
  isApproved: boolean;
}

interface LoginProps {
  onClose: () => void;
}

export default function Login({ onClose }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pendingFeedbacks, setPendingFeedbacks] = useState<FeedbackData[]>([]);
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [isUpdatingImage, setIsUpdatingImage] = useState(false);
  const [isUpdatingText, setIsUpdatingText] = useState(false);
  const { user, login } = useUser();

  useEffect(() => {
    if (user) {
      fetchPendingFeedbacks();
      fetchAboutData();
    }
  }, [user]);

  const fetchAboutData = async () => {
    try {
      const res = await fetch('/api/about');
      if (res.ok) {
        const data = await res.json();
        setAboutData(data);
      }
    } catch (err) {
      console.error("Error fetching about data:", err);
    }
  };

  const handleTextUpdate = async () => {
    setIsUpdatingText(true);
    try {
      const res = await fetch('/api/about', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aboutData)
      });
      if (res.ok) {
        const updated = await res.json();
        setAboutData(updated);
        alert('Hero content updated successfully!');
      }
    } catch (err) {
      console.error("Error updating text content:", err);
    } finally {
      setIsUpdatingText(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'heroImage' | 'aboutImage') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        await updateProfileImage(base64, type);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateProfileImage = async (base64: string, type: 'heroImage' | 'aboutImage') => {
    setIsUpdatingImage(true);
    try {
      const res = await fetch('/api/about', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...aboutData, [type]: base64 })
      });
      if (res.ok) {
        const updated = await res.json();
        setAboutData(updated);
      }
    } catch (err) {
      console.error("Error updating profile image:", err);
    } finally {
      setIsUpdatingImage(false);
    }
  };

  const fetchPendingFeedbacks = async () => {
    try {
      const res = await fetch('/api/admin/feedback');
      if (res.ok) {
        const data = await res.json();
        setPendingFeedbacks(data.filter((f: FeedbackData) => !f.isApproved));
      }
    } catch (err) {
      console.error("Error fetching pending feedbacks:", err);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch(`/api/feedback/${id}/approve`, { method: 'PUT' });
      if (res.ok) {
        setPendingFeedbacks(prev => prev.filter(f => f._id !== id));
      }
    } catch (err) {
      console.error("Error approving feedback:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/feedback/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPendingFeedbacks(prev => prev.filter(f => f._id !== id));
      }
    } catch (err) {
      console.error("Error deleting feedback:", err);
    }
  };

  const getPlatformIcon = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('github')) return Github;
    if (p.includes('linkedin')) return Linkedin;
    if (p.includes('whatsapp')) return MessageCircle;
    if (p.includes('instagram')) return Instagram;
    if (p.includes('twitter') || p.includes('x.com')) return Twitter;
    if (p.includes('youtube')) return Youtube;
    if (p.includes('facebook')) return Facebook;
    if (p.includes('mail') || p.includes('email')) return Mail;
    return Globe;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    // Simple hardcoded login
    if (username === 'thiru' && password === '2005') {
      login();
      setIsLoading(false);
      // Don't close immediately so user can see pending feedbacks if any
    } else {
      setError('Invalid username or password.');
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] bg-brand-50 flex items-center justify-center p-6 overflow-y-auto"
    >
      <button 
        onClick={onClose}
        className="absolute top-8 left-8 flex items-center gap-2 text-brand-900/60 hover:text-brand-900 transition-colors font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Portfolio
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-10 rounded-3xl border border-brand-900/10 shadow-xl my-auto"
      >
        {!user ? (
          <>
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-brand-900 text-brand-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-brand-900/20">
                <AuthUser className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-display font-bold text-brand-900 mb-2">Welcome Back</h2>
              <p className="text-brand-900/50 text-sm">Sign in to access your dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 rounded-lg bg-red-50 text-red-600 text-xs font-medium border border-red-100">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-brand-900/40 px-1">Username</label>
                <div className="relative">
                  <AuthUser className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-900/30" />
                  <input 
                    required
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="thiru"
                    className="w-full bg-brand-50/50 border border-brand-900/10 rounded-xl pl-12 pr-4 py-3 text-brand-900 placeholder:text-brand-900/20 focus:outline-none focus:ring-2 focus:ring-brand-900/5 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-brand-900/40 px-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-900/30" />
                  <input 
                    required
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-brand-50/50 border border-brand-900/10 rounded-xl pl-12 pr-4 py-3 text-brand-900 placeholder:text-brand-900/20 focus:outline-none focus:ring-2 focus:ring-brand-900/5 transition-all"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-brand-900 text-brand-50 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-brand-800 transition-all active:scale-[0.98] shadow-lg shadow-brand-900/10 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-brand-50/30 border-t-brand-50 rounded-full animate-spin" />
                ) : (
                  <LogIn className="w-5 h-5" />
                )}
                {isLoading ? 'Initializing...' : 'Sign In'}
              </button>
            </form>
          </>
        ) : (
          <div className="space-y-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/20">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-display font-bold text-brand-900 mb-2">Signed In</h2>
              <p className="text-brand-900/50 text-sm">Manage your portfolio from here</p>
            </div>

            {/* Profile Images Management */}
            <div className="p-6 bg-brand-50/50 rounded-2xl border border-brand-900/5 space-y-6">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-brand-900/40 flex items-center gap-2">
                <Camera className="w-3 h-3" />
                Manage Photos
              </h3>
              
              <div className="grid grid-cols-1 gap-6">
                {/* Hero Image */}
                <label className="space-y-3 cursor-pointer block group/photo">
                  <div className="relative">
                    <div className="aspect-square rounded-xl overflow-hidden bg-brand-900/5 border border-brand-900/10 group-hover/photo:border-brand-900/30 transition-colors">
                      {aboutData?.heroImage ? (
                        <img src={aboutData.heroImage} className="w-full h-full object-cover" alt="Hero" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-brand-900/10" />
                        </div>
                      )}
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-brand-900/20 opacity-0 group-hover/photo:opacity-100 flex items-center justify-center transition-opacity">
                        <Camera className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    {isUpdatingImage && (
                      <div className="absolute inset-0 bg-white/60 flex items-center justify-center rounded-xl">
                        <div className="w-4 h-4 border-2 border-brand-900/30 border-t-brand-900 rounded-full animate-spin" />
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] sm:text-xs font-bold text-brand-900 uppercase tracking-widest group-hover/photo:underline">Hero Photo</span>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageChange(e, 'heroImage')} />
                  </div>
                </label>
              </div>
            </div>

            {/* Hero Text Management */}
            <div className="p-6 bg-brand-50/50 rounded-2xl border border-brand-900/5 space-y-4">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-brand-900/40 flex items-center gap-2">
                <LogIn className="w-3 h-3 rotate-90" />
                Hero Content
              </h3>
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-brand-900/40 uppercase tracking-wider ml-1">Hero Title</label>
                  <input 
                    type="text"
                    value={aboutData?.heroTitle || ''}
                    onChange={(e) => setAboutData(prev => prev ? ({ ...prev, heroTitle: e.target.value }) : null)}
                    placeholder="THIRUMURUGAN S."
                    className="w-full bg-white border border-brand-900/10 rounded-xl px-4 py-2.5 text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-brand-900/5 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-brand-900/40 uppercase tracking-wider ml-1">Hero Role</label>
                  <input 
                    type="text"
                    value={aboutData?.heroRole || ''}
                    onChange={(e) => setAboutData(prev => prev ? ({ ...prev, heroRole: e.target.value }) : null)}
                    placeholder="Design Engineer"
                    className="w-full bg-white border border-brand-900/10 rounded-xl px-4 py-2.5 text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-brand-900/5 transition-all"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-brand-900/40 uppercase tracking-wider ml-1">Hero Description</label>
                  <textarea 
                    value={aboutData?.heroDescription || ''}
                    onChange={(e) => setAboutData(prev => prev ? ({ ...prev, heroDescription: e.target.value }) : null)}
                    placeholder="I am an engineering student with a passion for creative design..."
                    rows={3}
                    className="w-full bg-white border border-brand-900/10 rounded-xl px-4 py-2.5 text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-brand-900/5 transition-all resize-none"
                  />
                </div>

                <button 
                  onClick={handleTextUpdate}
                  disabled={isUpdatingText}
                  className="w-full bg-brand-900 text-brand-50 py-2.5 rounded-xl text-xs font-bold hover:bg-brand-800 transition-all disabled:opacity-50"
                >
                  {isUpdatingText ? 'Updating...' : 'Update Hero Text'}
                </button>
              </div>
            </div>

            {/* Contact Details Management */}
            <div className="p-6 bg-brand-50/50 rounded-2xl border border-brand-900/5 space-y-4">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-brand-900/40 flex items-center gap-2">
                <Mail className="w-3 h-3" />
                Contact Details
              </h3>
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-brand-900/40 uppercase tracking-wider ml-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand-900/20" />
                    <input 
                      type="email"
                      value={aboutData?.contactEmail || ''}
                      onChange={(e) => setAboutData(prev => prev ? ({ ...prev, contactEmail: e.target.value }) : null)}
                      placeholder="engineering@portfolio.com"
                      className="w-full bg-white border border-brand-900/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-brand-900/5 transition-all"
                    />
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-brand-900/40 uppercase tracking-wider ml-1">Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand-900/20" />
                    <input 
                      type="text"
                      value={aboutData?.contactPhone || ''}
                      onChange={(e) => setAboutData(prev => prev ? ({ ...prev, contactPhone: e.target.value }) : null)}
                      placeholder="+91 9345029922"
                      className="w-full bg-white border border-brand-900/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-brand-900/5 transition-all"
                    />
                  </div>
                </div>

                <button 
                  onClick={handleTextUpdate}
                  disabled={isUpdatingText}
                  className="w-full bg-brand-900 text-brand-50 py-2.5 rounded-xl text-xs font-bold hover:bg-brand-800 transition-all disabled:opacity-50"
                >
                  {isUpdatingText ? 'Updating...' : 'Update Contact Info'}
                </button>
              </div>
            </div>

            {/* Social Links Management */}
            <div className="p-6 bg-brand-50/50 rounded-2xl border border-brand-900/5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-brand-900/40 flex items-center gap-2">
                  <LinkIcon className="w-3 h-3" />
                  Social Links
                </h3>
                <button 
                  onClick={() => setAboutData(prev => prev ? ({ 
                    ...prev, 
                    socialLinks: [...(prev.socialLinks || []), { platform: '', url: '', icon: 'Link' }] 
                  }) : null)}
                  className="text-[10px] font-bold text-brand-900 hover:underline flex items-center gap-1"
                >
                  <Plus className="w-2.5 h-2.5" /> Add New
                </button>
              </div>

              <div className="space-y-3">
                {aboutData?.socialLinks?.map((link, index) => {
                  const Icon = getPlatformIcon(link.platform);
                  return (
                    <div key={index} className="flex gap-2 items-start">
                      <div className="flex-1 grid grid-cols-2 gap-2">
                        <input 
                          type="text"
                          value={link.platform}
                          onChange={(e) => {
                            const newLinks = [...(aboutData.socialLinks || [])];
                            newLinks[index].platform = e.target.value;
                            setAboutData({ ...aboutData, socialLinks: newLinks });
                          }}
                          placeholder="Platform"
                          className="bg-white border border-brand-900/10 rounded-lg px-3 py-1.5 text-xs text-brand-900 focus:outline-none focus:ring-1 focus:ring-brand-900/5 transition-all"
                        />
                        <input 
                          type="text"
                          value={link.url}
                          onChange={(e) => {
                            const newLinks = [...(aboutData.socialLinks || [])];
                            newLinks[index].url = e.target.value;
                            setAboutData({ ...aboutData, socialLinks: newLinks });
                          }}
                          placeholder="URL"
                          className="bg-white border border-brand-900/10 rounded-lg px-3 py-1.5 text-xs text-brand-900 focus:outline-none focus:ring-1 focus:ring-brand-900/5 transition-all"
                        />
                      </div>
                      <div className="mt-1 p-1.5 bg-brand-900/5 rounded-lg border border-brand-900/5">
                        <Icon className="w-3.5 h-3.5 text-brand-900/40" />
                      </div>
                      <button 
                        onClick={() => {
                          const newLinks = aboutData.socialLinks?.filter((_, i) => i !== index);
                          setAboutData({ ...aboutData, socialLinks: newLinks });
                        }}
                        className="p-1.5 bg-brand-900/5 text-brand-900 hover:bg-brand-900/10 rounded-lg transition-all mt-0.5"
                      >
                        <CloseIcon className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
                
                {aboutData?.socialLinks && aboutData.socialLinks.length > 0 && (
                  <button 
                    onClick={handleTextUpdate}
                    disabled={isUpdatingText}
                    className="w-full bg-brand-900 text-brand-50 py-2 rounded-xl text-[10px] font-bold hover:bg-brand-800 transition-all disabled:opacity-50 mt-2"
                  >
                    {isUpdatingText ? 'Saving...' : 'Save Social Links'}
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-brand-900/40 flex items-center gap-2">
                <Clock className="w-3 h-3" />
                Pending Approvals ({pendingFeedbacks.length})
              </h3>
              
              {pendingFeedbacks.length === 0 ? (
                <div className="p-8 text-center bg-brand-50/50 rounded-2xl border border-dashed border-brand-900/10 text-brand-900/40 italic text-sm">
                  All caught up! No pending feedbacks.
                </div>
              ) : (
                pendingFeedbacks.map(item => (
                  <div key={item._id} className="p-4 bg-brand-50/50 rounded-xl border border-brand-900/5 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-brand-900 text-sm">{item.name}</h4>
                        <p className="text-[10px] text-brand-900/40 uppercase tracking-wider">{item.role}</p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleApprove(item._id)}
                          className="p-1.5 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                          title="Approve"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(item._id)}
                          className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-brand-900/70 italic leading-relaxed line-clamp-3">"{item.message}"</p>
                  </div>
                ))
              )}
            </div>

            <button 
              onClick={onClose}
              className="w-full bg-brand-900 text-brand-50 py-4 rounded-xl font-bold hover:bg-brand-800 transition-all shadow-lg"
            >
              Back to Portfolio
            </button>
          </div>
        )}

        <div className="mt-10 text-center">
          <p className="text-sm text-brand-900/50">
            {user ? 'Admin Access Granted' : "Don't have an account? "}
            {!user && <a href="#" className="text-brand-900 font-bold hover:underline">Create one</a>}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
