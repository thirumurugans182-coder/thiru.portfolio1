import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { LogOut } from 'lucide-react';
import { useUser } from '../context/AuthContext';

const navItems = [
  { label: 'Home', href: '#home', id: 'home' },
  { label: 'About', href: '#about', id: 'about' },
  { label: 'Skills', href: '#skills', id: 'skills' },
  { label: 'Projects', href: '#projects', id: 'projects' },
  { label: 'Feedback', href: '#feedback', id: 'feedback' },
  { label: 'Contact', href: '#contact', id: 'contact' }
];

interface NavbarProps {
  onLoginClick: () => void;
}

export default function Navbar({ onLoginClick }: NavbarProps) {
  const [activeSection, setActiveSection] = useState('home');
  const { user, logout } = useUser();

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    const sections = ['home', 'about', 'skills', 'projects', 'feedback', 'contact'];
    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-brand-50/90 backdrop-blur-md border-b border-brand-900/5 py-4 sm:py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
        <div className="flex items-center gap-3 sm:gap-4">
          <a 
            href="#home" 
            onClick={(e) => handleNavClick(e, '#home')}
            className="group"
          >
            <span className="font-display text-base sm:text-xl font-bold tracking-tight text-brand-900 uppercase">THIRUMURUGAN S.</span>
          </a>
          {!user ? (
            <button 
              onClick={onLoginClick}
              className="w-4 h-4 rounded-full bg-brand-900/5 border border-brand-900/20 hover:bg-brand-900 hover:border-brand-900 transition-all cursor-pointer relative group/login"
              title="Admin Login"
            >
              <div className="absolute inset-0 rounded-full bg-brand-900 scale-0 group-hover/login:scale-110 transition-transform duration-300 -z-10 opacity-20" />
            </button>
          ) : (
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-1 bg-brand-900 text-brand-50 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-brand-800 transition-all"
              title="Logout"
            >
              <LogOut className="w-3 h-3" />
              Logout
            </button>
          )}
        </div>

        {/* Navigation - Scrollable on mobile, flex on desktop */}
        <div className="w-full md:w-auto overflow-x-auto no-scrollbar flex items-center flex-nowrap gap-5 md:gap-8 lg:gap-10 px-4 -mx-4 md:mx-0 md:px-0">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className={`text-[9px] sm:text-xs font-bold uppercase tracking-[0.2em] transition-all whitespace-nowrap py-1 relative shrink-0 ${
                activeSection === item.id ? 'text-brand-900' : 'text-brand-900/30 hover:text-brand-900'
              }`}
            >
              {item.label}
              {activeSection === item.id && (
                <motion.div 
                  layoutId="activeNav"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-brand-900 rounded-full"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
