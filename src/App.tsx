/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProjectGallery from './components/ProjectGallery';
import Skills from './components/Skills';
import Feedback from './components/Feedback';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';
import Login from './components/Login';

import { AuthProvider } from './context/AuthContext';

import EditableAbout from './components/EditableAbout';

function MainContent() {
  const [showLogin, setShowLogin] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === '/admin') {
      setShowLogin(true);
    }
  }, [location]);

  const handleCloseLogin = () => {
    setShowLogin(false);
    if (location.pathname === '/admin') {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar onLoginClick={() => setShowLogin(true)} />
      <main>
        {showLogin && <Login onClose={handleCloseLogin} />}
        <div id="home" className="scroll-mt-24"><Hero /></div>
        
        <div id="about" className="scroll-mt-24"><EditableAbout /></div>

        <div id="skills" className="scroll-mt-24"><Skills /></div>

        <div id="projects" className="scroll-mt-24"><ProjectGallery /></div>

        <div id="feedback" className="scroll-mt-24"><Feedback /></div>

        <div id="contact" className="scroll-mt-24"><ContactForm /></div>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<MainContent />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

