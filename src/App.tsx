/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
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

export default function App() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <AuthProvider>
      <div className="min-h-screen">
        <Navbar onLoginClick={() => setShowLogin(true)} />
        <main>
          {showLogin && <Login onClose={() => setShowLogin(false)} />}
          <div id="home" className="scroll-mt-24"><Hero /></div>
          
          <div id="about" className="scroll-mt-24"><EditableAbout /></div>

          <div id="skills" className="scroll-mt-24"><Skills /></div>

          <div id="projects" className="scroll-mt-24"><ProjectGallery /></div>

          <div id="feedback" className="scroll-mt-24"><Feedback /></div>

          <div id="contact" className="scroll-mt-24"><ContactForm /></div>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

