import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Github, MessageCircle, Linkedin, Edit2, Save, X, Instagram, Twitter, Globe, Youtube, Facebook, Mail, Plus } from 'lucide-react';
import { useUser } from '../context/AuthContext';

export default function Hero() {
  const { user } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [heroContent, setHeroContent] = useState({
    title: 'THIRUMURUGAN S.',
    role: 'Design Engineer',
    description: 'I am an engineering student with a passion for creative design and technical precision. I specialize in building functional, aesthetic, and user-centric solutions that bridge the gap between imagination and reality.',
    socialLinks: [
      { platform: 'Github', url: '#', icon: 'Github' },
      { platform: 'LinkedIn', url: 'https://www.linkedin.com/in/thirumurugan-s-9691ba310', icon: 'Linkedin' },
      { platform: 'WhatsApp', url: 'https://wa.me/919345029922', icon: 'MessageCircle' },
      { platform: 'Email', url: 'mailto:thirumurugans182@gmail.com', icon: 'Mail' }
    ]
  });

  const [editForm, setEditForm] = useState(heroContent);

  useEffect(() => {
    // Increment visit count on every page load
    fetch('/api/visits/increment', { method: 'POST' })
      .catch(err => console.error("Error incrementing visits:", err));

    fetch('/api/about')
      .then(res => res.json())
      .then(data => {
        if (data.heroImage) {
          setProfileImage(data.heroImage);
        } else {
          setProfileImage('/src/assets/images/thirumurugans_anime_portrait_v2_1782457017979.jpg');
        }
        if (data.heroTitle || data.heroRole || data.heroDescription || (data.socialLinks && data.socialLinks.length > 0)) {
          const fetchedContent = {
            title: data.heroTitle || 'THIRUMURUGAN S.',
            role: data.heroRole || 'Design Engineer',
            description: data.heroDescription || 'I am an engineering student with a passion for creative design and technical precision. I specialize in building functional, aesthetic, and user-centric solutions that bridge the gap between imagination and reality.',
            socialLinks: (data.socialLinks && data.socialLinks.length > 0) ? data.socialLinks : [
              { platform: 'Github', url: '#', icon: 'Github' },
              { platform: 'LinkedIn', url: 'https://www.linkedin.com/in/thirumurugan-s-9691ba310', icon: 'Linkedin' },
              { platform: 'WhatsApp', url: 'https://wa.me/919345029922', icon: 'MessageCircle' },
              { platform: 'Email', url: 'mailto:thirumurugans182@gmail.com', icon: 'Mail' }
            ]
          };
          setHeroContent(fetchedContent);
          setEditForm(fetchedContent);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching about data:", err);
        setLoading(false);
      });
  }, []);

  const getIcon = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('github')) return Github;
    if (p.includes('linkedin')) return Linkedin;
    if (p.includes('whatsapp')) return MessageCircle;
    if (p.includes('instagram')) return Instagram;
    if (p.includes('twitter') || p.includes('x.com')) return Twitter;
    if (p.includes('youtube')) return Youtube;
    if (p.includes('facebook')) return Facebook;
    if (p.includes('mail') || p.includes('email')) return Mail;
    return Globe; // Default
  };

  const handleSave = async () => {
    setHeroContent(editForm);
    setIsEditing(false);
  };

  return (
    <section className="relative min-h-[70vh] sm:min-h-[80vh] pt-20 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6 flex items-center bg-brand-50 group">
      {user && !isEditing && (
        <button 
          onClick={() => setIsEditing(true)}
          className="absolute top-20 sm:top-8 right-8 p-3 bg-white border border-brand-900/10 rounded-full text-brand-900 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-10"
        >
          <Edit2 className="w-5 h-5" />
        </button>
      )}

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-12 lg:gap-24 items-center">
        
        {/* Left: Image Container (Blob shape) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative order-1"
        >
          <div className="relative aspect-square w-full max-w-[200px] sm:max-w-md mr-auto sm:mx-auto">
            {/* The "Blob" or stylized circle frame */}
            <div className="absolute inset-0 bg-brand-100 rounded-[40%_60%_70%_30%_/_40%_50%_60%_50%] border-4 border-brand-900/10" />
            <div className="absolute inset-3 sm:inset-4 overflow-hidden rounded-[40%_60%_70%_30%_/_40%_50%_60%_50%] bg-brand-900/5">
              {!loading && profileImage && (
                <motion.img
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  src={profileImage}
                  alt="Thirumurugan S."
                  className="w-full h-full object-cover scale-110"
                />
              )}
            </div>
            <div className="absolute inset-3 sm:inset-4 rounded-[40%_60%_70%_30%_/_40%_50%_60%_50%] bg-brand-900/10 mix-blend-overlay pointer-events-none" />
          </div>
        </motion.div>

        {/* Right: Text Content */}
        <div className="order-2 space-y-4 sm:space-y-8 text-left">
          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.div 
                key="edit-hero"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-display font-bold text-brand-900">Edit Hero Content</h3>
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-brand-900/40">Your Name</label>
                    <input 
                      type="text" 
                      value={editForm.title}
                      onChange={e => setEditForm({...editForm, title: e.target.value})}
                      className="w-full bg-white border border-brand-900/10 rounded-xl px-4 py-3 text-brand-900 focus:outline-none focus:ring-2 focus:ring-brand-900/5"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-brand-900/40">Your Role</label>
                    <input 
                      type="text" 
                      value={editForm.role}
                      onChange={e => setEditForm({...editForm, role: e.target.value})}
                      className="w-full bg-white border border-brand-900/10 rounded-xl px-4 py-3 text-brand-900 focus:outline-none focus:ring-2 focus:ring-brand-900/5"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-brand-900/40">Introduction</label>
                    <textarea 
                      rows={4}
                      value={editForm.description}
                      onChange={e => setEditForm({...editForm, description: e.target.value})}
                      className="w-full bg-white border border-brand-900/10 rounded-xl px-4 py-3 text-brand-900 focus:outline-none focus:ring-2 focus:ring-brand-900/5 resize-none"
                    />
                  </div>

                  {/* Social Links Editor */}
                  <div className="space-y-3 pt-4 border-t border-brand-900/5">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-brand-900/40">Social Links</label>
                      <button 
                        onClick={() => setEditForm({
                          ...editForm,
                          socialLinks: [...editForm.socialLinks, { platform: 'New', url: '#', icon: 'Link' }]
                        })}
                        className="text-[10px] font-bold text-brand-900 hover:underline flex items-center gap-1"
                      >
                        <Plus className="w-2.5 h-2.5" /> Add New
                      </button>
                    </div>
                    {editForm.socialLinks.map((link, idx) => (
                      <div key={idx} className="flex gap-2 items-start bg-brand-900/5 p-3 rounded-xl">
                        <div className="flex-1 space-y-2">
                          <input 
                            type="text"
                            value={link.platform}
                            onChange={e => {
                              const newLinks = [...editForm.socialLinks];
                              newLinks[idx].platform = e.target.value;
                              setEditForm({...editForm, socialLinks: newLinks});
                            }}
                            placeholder="Platform (e.g. Github)"
                            className="w-full bg-white border border-brand-900/10 rounded-lg px-3 py-1.5 text-xs text-brand-900 focus:outline-none"
                          />
                          <input 
                            type="text"
                            value={link.url}
                            onChange={e => {
                              const newLinks = [...editForm.socialLinks];
                              newLinks[idx].url = e.target.value;
                              setEditForm({...editForm, socialLinks: newLinks});
                            }}
                            placeholder="URL"
                            className="w-full bg-white border border-brand-900/10 rounded-lg px-3 py-1.5 text-xs text-brand-900 focus:outline-none"
                          />
                        </div>
                        <button 
                          onClick={() => {
                            const newLinks = editForm.socialLinks.filter((_, i) => i !== idx);
                            setEditForm({...editForm, socialLinks: newLinks});
                          }}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors mt-0.5"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={handleSave}
                    className="bg-brand-900 text-brand-50 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-brand-800 transition-all"
                  >
                    <Save className="w-4 h-4" /> Save
                  </button>
                  <button 
                    onClick={() => { setIsEditing(false); setEditForm(heroContent); }}
                    className="bg-brand-900/5 text-brand-900 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-brand-900/10 transition-all"
                  >
                    <X className="w-4 h-4" /> Cancel
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="view-hero"
                initial={{ opacity: 1 }}
                className="space-y-8"
              >
                <div className="space-y-2 sm:space-y-4">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-brand-900 leading-tight">
                      Hello, I am <span className="text-brand-400 drop-shadow-sm uppercase">{heroContent.title}</span>
                    </h1>
                    <h2 className="text-lg sm:text-2xl md:text-3xl font-display font-medium text-brand-900 mt-1 sm:mt-2">
                      I am a <span className="text-brand-400">{heroContent.role}</span>
                    </h2>
                  </motion.div>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-brand-900/80 leading-relaxed max-w-lg text-sm sm:text-lg"
                  >
                    {heroContent.description}
                  </motion.p>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="flex flex-wrap items-center justify-start gap-2 sm:gap-4"
                >
                  {heroContent.socialLinks.map((item, i) => {
                    const Icon = getIcon(item.platform);
                    const isMail = item.url.toLowerCase().startsWith('mailto:') || item.platform.toLowerCase() === 'email' || item.platform.toLowerCase() === 'mail';
                    let url = item.url;
                    if ((item.platform.toLowerCase() === 'email' || item.platform.toLowerCase() === 'mail') && !url.toLowerCase().startsWith('mailto:')) {
                      url = `mailto:${url}`;
                    }
                    
                    const isEmailPlatform = item.platform.toLowerCase() === 'email' || item.platform.toLowerCase() === 'mail';

                    return (
                      <div key={i} className="flex flex-col items-center gap-1 sm:gap-2">
                        <a 
                          href={url} 
                          target={isMail ? undefined : "_blank"}
                          rel={isMail ? undefined : "noreferrer"}
                          className="w-8 h-8 sm:w-12 sm:h-12 rounded-full border border-brand-900/10 flex items-center justify-center text-brand-900 hover:bg-brand-900 hover:text-brand-50 transition-all shadow-sm bg-white/50 backdrop-blur-sm"
                          title={item.platform}
                        >
                          <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                        </a>
                        <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest text-brand-900/40">
                          {item.platform}
                        </span>
                      </div>
                    );
                  })}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                >
                  <button className="px-6 sm:px-10 py-3 sm:py-4 bg-brand-900 text-brand-50 rounded-lg font-bold text-sm sm:text-lg hover:bg-brand-400 transition-colors shadow-lg shadow-brand-900/20">
                    Download CV
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
