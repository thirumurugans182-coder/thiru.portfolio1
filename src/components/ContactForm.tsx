import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Mail, ArrowRight, Phone, Eye } from 'lucide-react';

export default function ContactForm() {
  const [contactData, setContactData] = useState({
    email: 'thirumurugans182@gmail.com',
    phone: '+91 9345029922'
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [isHighlighted, setIsHighlighted] = useState(false);
  const [visitCount, setVisitCount] = useState<number | null>(null);

  useEffect(() => {
    // Increment visit count on load
    fetch('/api/visits/increment', { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        if (data.count !== undefined) setVisitCount(data.count);
      })
      .catch(err => {
        console.error("Error incrementing visit:", err);
        // Fallback to just fetching if increment fails
        fetch('/api/visits')
          .then(res => res.json())
          .then(data => {
            if (data.count !== undefined) setVisitCount(data.count);
          });
      });
  }, []);

  useEffect(() => {
    const handleHighlight = () => {
      setIsHighlighted(false);
      // Small delay to restart animation if triggered again
      setTimeout(() => {
        setIsHighlighted(true);
      }, 10);
      
      const timer = setTimeout(() => setIsHighlighted(false), 3000); 
      return () => clearTimeout(timer);
    };

    window.addEventListener('highlight-contact-email', handleHighlight);
    return () => window.removeEventListener('highlight-contact-email', handleHighlight);
  }, []);

  useEffect(() => {
    fetch('/api/about')
      .then(res => res.json())
      .then(data => {
        if (data.contactEmail || data.contactPhone) {
          setContactData({
            email: data.contactEmail || 'thirumurugans182@gmail.com',
            phone: data.contactPhone || '+91 9345029922'
          });
        }
      })
      .catch(err => console.error("Error fetching contact data:", err));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const phoneNumber = contactData.phone.replace(/[^0-9]/g, '');
    const text = `*New Message from Portfolio*\n\n*Name:* ${formData.name}\n*Email:* ${formData.email}\n*Message:* ${formData.message}`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
    
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section id="contact" className="py-24 bg-brand-900 text-brand-50 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
        <div>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-display font-light tracking-tight mb-8">Let's Build the <span className="italic">Impossible</span>.</h2>
          <p className="text-brand-50/60 mb-12 max-w-md leading-relaxed text-sm sm:text-base">
            I am consistently seeking opportunities for collaborative research, industrial internships, and challenging technical projects.
          </p>
          
          <div className="space-y-6">
            <motion.a 
              animate={isHighlighted ? { 
                scale: [1, 1.02, 1],
                backgroundColor: ["rgba(166, 124, 82, 0)", "rgba(166, 124, 82, 0.2)", "rgba(166, 124, 82, 0)"],
                boxShadow: [
                  "0 0 0 rgba(166, 124, 82, 0)",
                  "0 0 20px rgba(166, 124, 82, 0.3)",
                  "0 0 0 rgba(166, 124, 82, 0)"
                ]
              } : {}}
              transition={{ duration: 1, repeat: 2 }}
              href={`mailto:${contactData.email}`} 
              className={`flex items-center gap-3 sm:gap-4 text-brand-50 group p-2 sm:p-3 -ml-2 sm:-ml-3 rounded-2xl transition-all ${isHighlighted ? 'ring-2 ring-brand-400' : ''}`}
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-brand-50/20 flex items-center justify-center group-hover:bg-brand-50 group-hover:text-brand-900 transition-all bg-brand-900/50 shrink-0">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-xs sm:text-lg font-medium tracking-widest uppercase break-all sm:break-normal">{contactData.email}</span>
            </motion.a>

            {contactData.phone && (
              <a href={`tel:${contactData.phone.replace(/\s/g, '')}`} className="flex items-center gap-3 sm:gap-4 text-brand-50 group p-2 sm:p-3 -ml-2 sm:-ml-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-brand-50/20 flex items-center justify-center group-hover:bg-brand-50 group-hover:text-brand-900 transition-all bg-brand-900/50 shrink-0">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="text-xs sm:text-lg font-medium tracking-widest uppercase">{contactData.phone}</span>
              </a>
            )}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest text-brand-50/40">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-transparent border-b border-brand-50/20 py-3 focus:border-brand-50 outline-none transition-colors"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest text-brand-50/40">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-transparent border-b border-brand-50/20 py-3 focus:border-brand-50 outline-none transition-colors"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase tracking-widest text-brand-50/40">Your Vision</label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="bg-transparent border-b border-brand-50/20 py-3 focus:border-brand-50 outline-none transition-colors resize-none"
              />
            </div>
            <button
              type="submit"
              className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] group hover:text-brand-50 transition-colors"
            >
              Send Message <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </button>

            {visitCount !== null && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-16 flex flex-col items-center gap-4 w-full"
              >
                <div className="flex items-center gap-4 px-6 py-3 bg-white/[0.03] rounded-full border border-white/10 shadow-xl backdrop-blur-xl group hover:border-brand-400/30 transition-colors">
                  <div className="flex -space-x-2.5">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-5 h-5 rounded-full bg-brand-400/20 border-2 border-brand-900 flex items-center justify-center overflow-hidden">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-400/40" />
                      </div>
                    ))}
                  </div>
                  <div className="w-px h-4 bg-white/10" />
                  <div className="flex items-center gap-2.5">
                    <Eye className="w-4 h-4 text-brand-400" />
                    <span className="text-[11px] font-bold text-white/90 uppercase tracking-[0.2em]">
                      {visitCount.toLocaleString()} <span className="text-white/40 font-light">Global Visits</span>
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-40">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-[8px] text-white uppercase tracking-[0.3em] font-medium">Network Active</span>
                </div>
              </motion.div>
            )}
          </form>
        </motion.div>
      </div>
    </section>
  );
}
