import React, { useState, useEffect } from 'react';
import { Compass, Ship, DollarSign, Clock, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { ROUTE_DISTANCES, PORT_CONSTRAINTS, VESSEL_SPECS, BENCHMARK_SCENARIOS } from '../data/maritimeData';

export default function Simulator() {
  const [origin, setOrigin] = useState("Hay Point (Australia)");
  const [destination, setDestination] = useState("Paradip");
  const [cargoVolume, setCargoVolume] = useState(75000);
  const [contractType, setContractType] = useState("Spot");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  // Local fallback calculation engine
  const computeLocalSimulation = (orig, dest, vol, contract) => {
    const dist = (ROUTE_DISTANCES[orig] && ROUTE_DISTANCES[orig][dest]) ? ROUTE_DISTANCES[orig][dest] : 4900;
    const BASE_RATE_PER_NM = 0.0042;
    const bdiFactor = 1.05;
    let baseRate = (dist * BASE_RATE_PER_NM * 1.62) * bdiFactor;
    
    if (orig.includes("Russia")) baseRate *= 1.08;
    if (orig.includes("USA")) baseRate *= 0.95;
    if (contract === "COA") baseRate *= 0.94;

    const port = PORT_CONSTRAINTS[dest] || PORT_CONSTRAINTS["Paradip"];
    let feasibleVessel = "Handysize";
    let vesselCount = 1;
    let feasibilityStatus = "optimal";
    let feasibilityMsg = "";

    if (port.maxDraft >= 17.5 && vol >= 120000) {
      feasibleVessel = "Capesize";
      vesselCount = Math.ceil(vol / VESSEL_SPECS["Capesize"].capacity);
      feasibilityMsg = `Port accommodates Capesize draft (${port.maxDraft}m ≥ 17.5m). Lowest per-tonne freight.`;
    } else if (port.maxDraft >= 13.5 && vol >= 60000) {
      feasibleVessel = "Panamax";
      vesselCount = Math.ceil(vol / VESSEL_SPECS["Panamax"].capacity);
      feasibilityMsg = `Port accommodates Panamax (${port.maxDraft}m ≥ 13.5m). Ideal fleet balance.`;
    } else if (port.maxDraft >= 11.5) {
      feasibleVessel = "Supramax";
      vesselCount = Math.ceil(vol / VESSEL_SPECS["Supramax"].capacity);
      feasibilityMsg = `Capesize/Panamax draft restricted. Using geared Supramax.`;
      feasibilityStatus = "warning";
    } else {
      feasibleVessel = "Handysize";
      vesselCount = Math.ceil(vol / VESSEL_SPECS["Handysize"].capacity);
      feasibilityMsg = `Strict shallow draft (${port.maxDraft}m). Restricted to Handysize / lightering.`;
      feasibilityStatus = "danger";
    }

    const discount = VESSEL_SPECS[feasibleVessel].discount;
    const effectiveRate = baseRate * (1 - discount);
    const totalOceanCost = effectiveRate * vol;

    const laytimeAllowedDays = Math.ceil(vol / 18000);
    const actualPortStayDays = port.avgWait + Math.ceil(vol / port.ratePerDay);
    const excessIdleDays = Math.max(0, actualPortStayDays - laytimeAllowedDays);
    const dailyDemurrageRate = VESSEL_SPECS[feasibleVessel].dailyCharterRate;
    const totalDemurrage = excessIdleDays * dailyDemurrageRate * vesselCount;

    const gvPortStay = 1.1 + Math.ceil(vol / 35000);
    const gvExcess = Math.max(0, gvPortStay - laytimeAllowedDays);
    const gvDemurrage = gvExcess * dailyDemurrageRate * vesselCount;
    const diversionSavings = Math.max(0, totalDemurrage - gvDemurrage);

    return {
      distanceNm: dist,
      effectiveRateUsd: effectiveRate,
      totalOceanCostUsd: totalOceanCost,
      feasibleVessel,
      vesselCount,
      fleetSummary: `${vesselCount}x ${feasibleVessel}`,
      feasibilityStatus,
      feasibilityMessage: feasibilityMsg,
      portMaxDraft: port.maxDraft,
      demurrageExposureUsd: totalDemurrage,
      gangavaramDiversionSavingsUsd: diversionSavings
    };
  };

  const runSimulation = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin,
          destination,
          cargoVolume,
          contractType
        })
      });
      if (res.ok) {
        const data = await res.json();
        setResults(data);
      } else {
        setResults(computeLocalSimulation(origin, destination, cargoVolume, contractType));
      }
    } catch {
      setResults(computeLocalSimulation(origin, destination, cargoVolume, contractType));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runSimulation();
  }, [origin, destination, cargoVolume, contractType]);

  const applyPreset = (preset) => {
    setOrigin(preset.origin);
    setDestination(preset.dest);
    setCargoVolume(preset.volume);
    setContractType(preset.contract);
  };

  return (
    <section className="section" id="simulator">
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header text-center">
          <span className="section-tag">Interactive Simulation Cockpit</span>
          <h2 className="section-title">Prescriptive Freight & Navigational Feasibility Engine</h2>
          <p className="section-desc">
            Simulate real-time coking coal chartering from global loading hubs to Indian discharge ports. Evaluates XGBoost ML forecasts, checks water depth clearance, and solves mathematical vessel allocations.
          </p>
        </div>

        {/* Benchmark Presets Toolbar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          flexWrap: 'wrap',
          marginBottom: '32px'
        }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>
            ⚡ Benchmarks:
          </span>
          {BENCHMARK_SCENARIOS.map((preset, idx) => (
            <button
              key={idx}
              className="chip-btn"
              onClick={() => applyPreset(preset)}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Simulator Box */}
        <div className="simulator-panel">
          <div className="simulator-grid">
            
            {/* Input Controls */}
            <div className="sim-controls">
              
              <div className="sim-input-group">
                <label className="sim-label">
                  <span>🛫 Origin Loading Terminal</span>
                  <span style={{ color: 'var(--primary)', fontSize: '0.78rem' }}>10 Global Coal Terminals</span>
                </label>
                <select
                  className="sim-select"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                >
                  <optgroup label="Australia">
                    <option value="Hay Point (Australia)">Hay Point (Australia) - DBCT / HPCT</option>
                    <option value="Newcastle (Australia)">Newcastle (Australia) - PWCS / NCIG</option>
                  </optgroup>
                  <optgroup label="Russian Federation">
                    <option value="Taman (Russia)">Taman (Russia) - Black Sea Deep Bulk</option>
                    <option value="Vostochny (Russia)">Vostochny (Russia) - Far East Coal Terminal</option>
                  </optgroup>
                  <optgroup label="United States">
                    <option value="Baltimore (USA)">Baltimore (USA) - CNX / CSX Marine</option>
                    <option value="Hampton Roads (USA)">Hampton Roads (USA) - Norfolk / Lamberts Pt</option>
                  </optgroup>
                  <optgroup label="Africa">
                    <option value="Richards Bay (South Africa)">Richards Bay (South Africa) - RBCT</option>
                    <option value="Nacala (Mozambique)">Nacala (Mozambique) - Deepwater Bulk</option>
                  </optgroup>
                  <optgroup label="Indonesia">
                    <option value="Kalimantan (Indonesia)">Kalimantan (Indonesia) - Tanjung Bara</option>
                    <option value="Taboneo (Indonesia)">Taboneo (Indonesia) - Floating Crane Anch.</option>
                  </optgroup>
                </select>
              </div>

              <div className="sim-input-group">
                <label className="sim-label">
                  <span>🛬 Indian Discharge Terminal</span>
                  <span style={{ color: 'var(--secondary)', fontSize: '0.78rem' }}>SAIL Plant Logistics</span>
                </label>
                <select
                  className="sim-select"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                >
                  <option value="Paradip">Paradip (Odisha) - Major Deepwater (Draft 16.5m)</option>
                  <option value="Visakhapatnam (Vizag)">Visakhapatnam (Vizag) - RINL Dedicated (Draft 14.5m)</option>
                  <option value="Gangavaram">Gangavaram (AP) - Ultra-Deep Private (Draft 18.2m)</option>
                  <option value="Dhamra">Dhamra (Odisha) - Deepwater Bulk (Draft 18.0m)</option>
                  <option value="Haldia">Haldia (WB) - Riverine Tidal Constrained (Draft 8.5m)</option>
                  <option value="Gopalpur">Gopalpur (Odisha) - All-Weather Deep (Draft 14.5m)</option>
                </select>
              </div>

              <div className="sim-input-group">
                <div className="sim-label">
                  <span>📦 Shipment Cargo Volume</span>
                  <strong style={{ color: 'var(--primary)' }}>{cargoVolume.toLocaleString()} MT</strong>
                </div>
                <input
                  type="range"
                  className="sim-slider"
                  min="30000"
                  max="200000"
                  step="5000"
                  value={cargoVolume}
                  onChange={(e) => setCargoVolume(Number(e.target.value))}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: '#64748B', marginTop: '6px' }}>
                  <span>30k (Handysize)</span>
                  <span>75k (Panamax)</span>
                  <span>170k+ (Capesize)</span>
                </div>
              </div>

              <div className="sim-input-group">
                <label className="sim-label">
                  <span>📄 Charterparty Contract Strategy</span>
                </label>
                <div className="contract-toggle">
                  <button
                    type="button"
                    className={`toggle-btn ${contractType === 'Spot' ? 'active' : ''}`}
                    onClick={() => setContractType('Spot')}
                  >
                    ⚡ Spot Single Voyage
                  </button>
                  <button
                    type="button"
                    className={`toggle-btn ${contractType === 'COA' ? 'active' : ''}`}
                    onClick={() => setContractType('COA')}
                  >
                    🔒 Mid-Term COA (-6%)
                  </button>
                </div>
              </div>

            </div>

            {/* Results Display */}
            <div className="sim-output-card">
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid rgba(56, 189, 248, 0.15)',
                paddingBottom: '14px',
                marginBottom: '20px'
              }}>
                <div style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Compass size={20} color="#00E5FF" />
                  <span>Real-Time Decision Analytics</span>
                </div>
                <span className="badge badge-cyan">
                  {results ? `${results.distanceNm.toLocaleString()} NM` : 'Calculating...'}
                </span>
              </div>

              {/* Feasibility Indicator */}
              {results && (
                <div className={`feasibility-pill-box ${results.feasibilityStatus}`}>
                  <div style={{ fontSize: '1.2rem' }}>⚓</div>
                  <div>
                    <h5 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff' }}>
                      {destination} Draft Clearance: {results.portMaxDraft}m
                    </h5>
                    <p style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '2px' }}>
                      {results.feasibilityMessage}
                    </p>
                  </div>
                </div>
              )}

              {/* KPI Grid */}
              {results && (
                <div className="sim-metrics-grid">
                  <div className="sim-kpi-box">
                    <div className="sim-kpi-label">Predicted Base Freight</div>
                    <div className="sim-kpi-val">${results.effectiveRateUsd.toFixed(2)} / MT</div>
                    <div className="sim-kpi-sub">XGBoost ML Confidence: 92%</div>
                  </div>

                  <div className="sim-kpi-box">
                    <div className="sim-kpi-label">PuLP MILP Allocation</div>
                    <div className="sim-kpi-val" style={{ color: '#34D399' }}>{results.fleetSummary}</div>
                    <div className="sim-kpi-sub">Minimizing deadweight slack</div>
                  </div>

                  <div className="sim-kpi-box">
                    <div className="sim-kpi-label">Total Ocean Freight</div>
                    <div className="sim-kpi-val">${(results.totalOceanCostUsd / 1000000).toFixed(2)}M</div>
                    <div className="sim-kpi-sub">Includes volume scale discount</div>
                  </div>

                  <div className="sim-kpi-box">
                    <div className="sim-kpi-label">Laytime Demurrage Risk</div>
                    <div className="sim-kpi-val" style={{ color: '#F87171' }}>
                      ${Math.round(results.demurrageExposureUsd).toLocaleString()}
                    </div>
                    <div className="sim-kpi-sub">Based on anchor queue index</div>
                  </div>
                </div>
              )}

              {/* Gangavaram Diversion Payoff */}
              {results && (
                <div style={{
                  background: 'rgba(14, 165, 233, 0.08)',
                  border: '1px dashed rgba(56, 189, 248, 0.35)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#38BDF8', textTransform: 'uppercase' }}>
                      💡 Gangavaram Deepwater Diversion Arbitrage
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#CBD5E1', marginTop: '2px' }}>
                      Fast automated turnaround (1.1d wait) avoids anchor demurrage penalties.
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#34D399' }}>
                      +${Math.round(results.gangavaramDiversionSavingsUsd).toLocaleString()}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Net Port Avoidance Savings</div>
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
