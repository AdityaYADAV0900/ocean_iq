import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Pillars from './components/Pillars';
import PortMatrix from './components/PortMatrix';
import ImpactSection from './components/ImpactSection';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="ocean-iq-app">
      <Navbar />
      <Hero />
      <Pillars />
      <PortMatrix />
      <div className="seabed-section">
        <ImpactSection />
        <Footer />
      </div>
    </div>
  );
}
