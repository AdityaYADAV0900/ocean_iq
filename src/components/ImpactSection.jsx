import React from 'react';

export default function ImpactSection() {
  const plants = [
    "🏭 Bhilai Steel Plant (Chhattisgarh)",
    "🏭 Bokaro Steel Plant (Jharkhand)",
    "🏭 Rourkela Steel Plant (Odisha)",
    "🏭 Durgapur Steel Plant (West Bengal)",
    "🏭 IISCO Burnpur (West Bengal)",
    "🏭 Vizag Steel Plant (RINL - Andhra Pradesh)"
  ];

  return (
    <section className="section" id="impact">
      <div className="container">
        
        <div className="section-header text-center">
          <span className="section-tag">National Economic Impact</span>
          <h2 className="section-title">Strategic Value for India's Steel Plants</h2>
          <p className="section-desc">
            Directly supporting the production of crude steel across SAIL and RINL integrated facilities by cutting landed coking coal logistics costs.
          </p>
        </div>

        <div className="impact-grid">
          
          <div className="impact-stat-card">
            <div className="impact-number">₹180+ Cr</div>
            <div className="impact-label">Annual Charter Savings</div>
            <div className="impact-sub">By locking optimal contract timing & multi-vessel allocation</div>
          </div>

          <div className="impact-stat-card">
            <div className="impact-number">38%</div>
            <div className="impact-label">Demurrage Reduction</div>
            <div className="impact-sub">Via automated Gangavaram/Dhamra diversion analysis</div>
          </div>

          <div className="impact-stat-card">
            <div className="impact-number">18M+ MT</div>
            <div className="impact-label">Annual Coal Monitored</div>
            <div className="impact-sub">Imported through Paradip, Vizag, Gangavaram & Haldia</div>
          </div>

          <div className="impact-stat-card">
            <div className="impact-number">100%</div>
            <div className="impact-label">Draft Safety Compliance</div>
            <div className="impact-sub">Zero UKC groundings and IMO 2023 safety adherence</div>
          </div>

        </div>

        {/* Steel Plants Badge Ribbon */}
        <div style={{ marginTop: '50px', textAlign: 'center' }}>
          <div style={{
            fontSize: '0.84rem',
            color: '#94A3B8',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '16px'
          }}>
            Supplying Integrated Steel Plants Nationwide:
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            {plants.map((plant, idx) => (
              <span key={idx} className="badge badge-cyan" style={{ padding: '8px 16px' }}>
                {plant}
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
