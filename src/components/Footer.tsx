import React from 'react';
import { MessageCircle, Linkedin, Mail, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-brand-900/5 bg-brand-50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brand-900/40" />
            <span className="font-display text-sm tracking-widest text-brand-900/40 uppercase">THIRUMURUGAN S. © 2026</span>
          </div>
        </div>
        
        <div className="flex gap-8">
          <a 
            href="#contact" 
            onClick={(e) => {
              e.preventDefault();
              const element = document.getElementById('contact');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
                setTimeout(() => {
                  window.dispatchEvent(new CustomEvent('highlight-contact-email'));
                }, 800);
              }
            }}
            className="text-brand-900/40 hover:text-brand-900 transition-colors" 
            title="Email"
          >
            <Mail className="w-5 h-5" />
          </a>
          <a href="https://wa.me/919345029922" target="_blank" rel="noreferrer" className="text-brand-900/40 hover:text-brand-900 transition-colors" title="WhatsApp"><MessageCircle className="w-5 h-5" /></a>
          <a href="https://www.linkedin.com/in/thirumurugan-s-9691ba310" target="_blank" rel="noreferrer" className="text-brand-900/40 hover:text-brand-900 transition-colors" title="LinkedIn"><Linkedin className="w-5 h-5" /></a>
        </div>
        
        <div className="text-brand-900/40 text-[10px] uppercase tracking-widest">
          Based in Tamil Nadu, India
        </div>
      </div>
    </footer>
  );
}
