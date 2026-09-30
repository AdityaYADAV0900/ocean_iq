import React from 'react';

export default function MarineBiodiversity() {
  return (
    <section className="section" id="biodiversity">
      <div className="container">
        <div className="section-header text-center">
          <span className="section-tag">Ecosystem Health</span>
          <h2 className="section-title">Marine Biodiversity</h2>
          <p className="section-desc">
            Monitoring species hotspots, migration paths, and observation density to ensure sustainable maritime operations and protect local marine life.
          </p>
        </div>
        
        <div style={{
          position: 'relative',
          width: '100%',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
          border: '1px solid rgba(0, 229, 255, 0.2)'
        }}>
          {/* Using the generated image */}
          <img 
            src="/marine-biodiversity.jpg" 
            alt="Marine Biodiversity" 
            style={{ width: '100%', height: 'auto', display: 'block' }} 
          />
          
          {/* Overlay Species Cards */}
          <div style={{
            position: 'absolute',
            bottom: '24px',
            left: '24px',
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap'
          }}>
            <div className="hud-card" style={{ padding: '12px 16px', background: 'rgba(5, 15, 30, 0.7)' }}>
              <div className="hud-label">Species</div>
              <div className="hud-value" style={{ fontSize: '1.2rem' }}>Megaptera novaeangliae</div>
              <div className="hud-sub">Humpback Whale &bull; Stable</div>
            </div>
            
            <div className="hud-card" style={{ padding: '12px 16px', background: 'rgba(5, 15, 30, 0.7)' }}>
              <div className="hud-label">Observation Density</div>
              <div className="hud-value" style={{ fontSize: '1.2rem' }}>High</div>
              <div className="hud-sub">Migration Route 12A active</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
