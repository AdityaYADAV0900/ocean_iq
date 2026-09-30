import React from 'react';
import { Compass, LineChart, Cpu, Anchor } from 'lucide-react';

export default function Pillars() {
  const pillarsData = [
    {
      icon: <Compass size={28} color="#00E5FF" />,
      title: "Geospatial & Dual-Terminal Draft Engine",
      desc: "Physical boundary gatekeeper. Automatically validates origin loading and discharge draft, LOA, beam, and riverine lock constraints before any charter execution.",
      points: [
        "Haldia Hooghly river sandbar & tidal modeling (8.5m max draft)",
        "Gangavaram & Dhamra ultra-deepwater berthing (18.2m Capesize)",
        "Under-Keel Clearance (UKC) safety enforcement"
      ]
    },
    {
      icon: <LineChart size={28} color="#38BDF8" />,
      title: "XGBoost Machine Learning Forecaster",
      desc: "Predictive rate intelligence trained on multi-year coking coal fixture data, Baltic Dry Index (BDI), bunker prices, and seasonal trade lane dynamics.",
      points: [
        "92.01% R² validation score across 10 global trade lanes",
        "30-day proactive rate trajectory & uncertainty bands",
        "Spot vs Mid-Term Contract of Affreightment (COA) timing"
      ]
    },
    {
      icon: <Cpu size={28} color="#A78BFA" />,
      title: "PuLP Mixed-Integer Linear Programming",
      desc: "Mathematical global optimization solver. Minimizes total charter expenditure while strictly satisfying cargo volumes and vessel-port physical limits.",
      points: [
        "Simultaneous Capesize, Panamax, Supramax, Handysize fleet mix",
        "Deadweight slack minimization & volume scale discounts",
        "Zero heuristic guessing — mathematically proven global optimum"
      ]
    },
    {
      icon: <Anchor size={28} color="#F59E0B" />,
      title: "Bay of Bengal Demurrage & Risk Radar",
      desc: "Predictive laytime accounting. Estimates pre-berthing anchor queues, Southwest Monsoon swell delays, and recommends high-yield port diversions.",
      points: [
        "Pre-berthing waiting time quantification per port",
        "Monsoon weather risk multipliers (15% Bay of Bengal index)",
        "Real-time diversion financial payoff vs Gangavaram / Dhamra"
      ]
    }
  ];

  return (
    <section className="section" id="pillars">
      <div className="container">
        
        <div className="section-header text-center">
          <span className="section-tag">Core Technical Architecture</span>
          <h2 className="section-title">Four Pillars of Prescriptive Maritime AI</h2>
          <p className="section-desc">
            Engineered specifically to solve the high-stakes logistical complexities of importing 18+ Million Metric Tonnes of metallurgical coal annually for SAIL & RINL.
          </p>
        </div>

        <div className="pillars-grid">
          {pillarsData.map((pillar, idx) => (
            <div key={idx} className="pillar-card">
              <div className="pillar-icon-box">
                {pillar.icon}
              </div>
              <h3 className="pillar-title">{pillar.title}</h3>
              <p className="pillar-desc">{pillar.desc}</p>
              <ul className="pillar-highlights">
                {pillar.points.map((pt, pIdx) => (
                  <li key={pIdx}>{pt}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
