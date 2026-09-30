import React from 'react';
import { Ship, ArrowUp, Zap } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="container">
        
        <div className="footer-top">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(0, 229, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#00E5FF'
              }}>
                <Ship size={20} />
              </div>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF' }}>
                OceanIQ DSS
              </span>
            </div>
            <p style={{ fontSize: '0.88rem', color: '#94A3B8', maxWidth: '480px' }}>
              Executive Decision Support System for Intelligent Maritime Freight Chartering, Dual-Terminal Navigational Feasibility, and Prescriptive Fleet Optimization.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <button onClick={scrollToTop} className="btn btn-secondary btn-sm">
              <ArrowUp size={14} /> Top
            </button>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            &copy; 2026 OceanIQ &bull; Developed for Ministry of Steel, Government of India &bull; Steel Authority of India Limited (SAIL) & RINL.
          </div>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <span>PuLP Mixed-Integer Linear Solver</span>
            <span>XGBoost Machine Learning (R²=92%)</span>
            <span>Grounded Multimodal Copilot</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
