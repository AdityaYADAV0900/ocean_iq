import React from 'react';
import { Zap } from 'lucide-react';

export default function Hero() {
  return (
    <section className="hero-section" id="overview">
      <div className="hero-layout">
        
        {/* Left Text Column */}
        <div className="hero-left">
          <div className="hero-content">
            


            <h1 className="hero-title">
              Autonomous Fleet Chartering & <br/><span className="gradient-text">Intelligent Command</span>
            </h1>

            <p className="hero-desc">
              Empowering India's national steel production with mathematical fleet optimization. Predicting freight rates, enforcing dual-terminal draft constraints, and delivering prescriptive MILP fleet allocations.
            </p>

            <div className="hero-cta-group">
              <a href="#simulator" className="btn btn-primary">
                <Zap size={18} />
                <span>Launch Live Simulator</span>
              </a>
            </div>

            <div className="hero-hud-grid">
              <div className="hud-card">
                <div className="hud-label">
                  <span>Freight Model</span>
                  <span style={{ color: '#38BDF8' }}>XGBoost</span>
                </div>
                <div className="hud-value">$34.20</div>
                <div className="hud-sub">R² = 92.01% ML accuracy</div>
              </div>

              <div className="hud-card">
                <div className="hud-label">
                  <span>Prescriptive Solver</span>
                  <span style={{ color: '#A78BFA' }}>PuLP MILP</span>
                </div>
                <div className="hud-value">Global Opt.</div>
                <div className="hud-sub">Capesize & Panamax</div>
              </div>
            </div>
            
          </div>
        </div>

        {/* Right Imagery Column */}
        <div className="hero-right">
          {/* Photoreal image is applied as background in CSS */}
          {/* R3F Stub Option (Uncomment to use) */}
          {/* 
          <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 5 }}>
            <Canvas>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} />
              <mesh>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="hotpink" />
              </mesh>
            </Canvas>
          </div>
          */}
        </div>
        
      </div>
    </section>
  );
}
