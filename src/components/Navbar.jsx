import React, { useState } from 'react';
import { Ship, X } from 'lucide-react';

export default function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Redirect to the HTML dashboard relatively
    window.location.href = '/main_dashboard.html';
  };
  return (
    <header className="navbar" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      zIndex: 100,
      paddingTop: '20px' /* Space from top */
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '70px',
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '0 4vw'
      }}>
        {/* Left Corner: Brand Symbol */}
        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(0, 229, 255, 0.2), rgba(99, 102, 241, 0.3))',
            border: '1px solid rgba(0, 229, 255, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#00E5FF'
          }}>
            <Ship size={22} />
          </div>
          {/* Optional text or keep it just the symbol, I'll keep the text for brand identity but user asked for "the symbol" on the left corner. I'll keep both but make it clean */}
          <span style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 700,
            fontSize: '1.2rem',
            letterSpacing: '-0.02em',
            color: '#FFFFFF'
          }}>
            OceanIQ
          </span>
        </a>

        {/* Center: Glass Pill Menu */}
        <nav style={{ 
          display: 'flex', 
          gap: '32px', 
          alignItems: 'center',
          background: 'rgba(2, 6, 15, 0.45)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
          padding: '10px 32px',
          borderRadius: '9999px'
        }}>
          <a href="#overview" style={{ color: '#E2E8F0', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500, transition: 'color 0.2s' }}>Overview</a>
          <a href="#help" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500, transition: 'color 0.2s' }}>Help</a>
          <a href="#faqs" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500, transition: 'color 0.2s' }}>FAQs</a>
        </nav>

        {/* Right Corner: Sign In Action */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={() => setIsModalOpen(true)} className="btn btn-secondary btn-sm" style={{ 
            borderRadius: '9999px', 
            padding: '8px 24px', 
            fontSize: '0.85rem',
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            cursor: 'pointer',
            color: 'white'
          }}>
            Sign In
          </button>
        </div>
      </div>

      {/* Sign In Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'rgba(6, 12, 26, 0.9)',
            border: '1px solid rgba(0, 229, 255, 0.3)',
            borderRadius: '24px',
            padding: '40px',
            width: '100%',
            maxWidth: '420px',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.6), 0 0 20px rgba(0, 229, 255, 0.1)',
            position: 'relative'
          }}>
            <button 
              onClick={() => setIsModalOpen(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'transparent',
                border: 'none',
                color: '#94A3B8',
                cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>
            
            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'white', marginBottom: '8px', fontSize: '1.8rem' }}>Welcome Back</h2>
            <p style={{ color: '#94A3B8', fontSize: '0.9rem', marginBottom: '32px' }}>Enter your details to access the DSS.</p>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', color: '#E2E8F0', fontSize: '0.85rem', marginBottom: '8px', fontWeight: 500 }}>Full Name</label>
                <input required type="text" placeholder="e.g. Aditi Sharma" style={{
                  width: '100%',
                  background: 'rgba(2, 6, 15, 0.5)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  color: 'white',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.95rem'
                }} />
              </div>

              <div>
                <label style={{ display: 'block', color: '#E2E8F0', fontSize: '0.85rem', marginBottom: '8px', fontWeight: 500 }}>Date of Birth</label>
                <input required type="date" style={{
                  width: '100%',
                  background: 'rgba(2, 6, 15, 0.5)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  color: 'white',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.95rem',
                  colorScheme: 'dark'
                }} />
              </div>

              <div>
                <label style={{ display: 'block', color: '#E2E8F0', fontSize: '0.85rem', marginBottom: '8px', fontWeight: 500 }}>Email Address</label>
                <input required type="email" placeholder="email@example.com" style={{
                  width: '100%',
                  background: 'rgba(2, 6, 15, 0.5)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  color: 'white',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.95rem'
                }} />
              </div>

              <button type="submit" className="btn btn-primary" style={{
                marginTop: '12px',
                width: '100%',
                padding: '14px',
                display: 'flex',
                justifyContent: 'center',
                borderRadius: '12px',
                fontSize: '1rem'
              }}>
                Access Dashboard
              </button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
