import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';

export default function LiveTicker() {
  const [telemetry, setTelemetry] = useState(null);

  useEffect(() => {
    // Try fetching from Node.js backend
    fetch('/api/telemetry')
      .then(res => res.json())
      .then(data => setTelemetry(data))
      .catch(() => {
        // Fallback default
        setTelemetry({
          bdi: { value: 1842, delta: '+1.4%' },
          capesize_tc: { value: '$24,650/day', delta: '+2.1%' },
          panamax_4tc: { value: '$14,820/day', delta: '-0.6%' },
          bunker_vlsfo: { value: '$618.50/MT', delta: '+0.8%' }
        });
      });
  }, []);

  const bdiVal = telemetry?.bdi?.value || 1842;
  const bdiDelta = telemetry?.bdi?.delta || '+1.4%';
  const capeVal = telemetry?.capesize_tc?.value || '$24,650 / day';
  const panamaxVal = telemetry?.panamax_4tc?.value || '$14,820 / day';
  const bunkerVal = telemetry?.bunker_vlsfo?.value || '$618.50 / MT';

  return (
    <div className="ticker-bar" style={{
      background: 'rgba(6, 14, 30, 0.95)',
      borderTop: '1px solid var(--border-subtle)',
      borderBottom: '1px solid var(--border-subtle)',
      padding: '12px 0',
      overflow: 'hidden',
      position: 'relative',
      zIndex: 10
    }}>
      <div style={{
        display: 'flex',
        gap: '40px',
        width: 'max-content',
        animation: 'tickerSlide 40s linear infinite'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: '#94A3B8', whiteSpace: 'nowrap' }}>
          <span>BALTIC DRY INDEX (BDI):</span> <strong style={{ color: '#fff' }}>{bdiVal}</strong> <span style={{ color: '#10B981' }}>▲ {bdiDelta}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: '#94A3B8', whiteSpace: 'nowrap' }}>
          <span>CAPESIZE TC AVERAGE:</span> <strong style={{ color: '#fff' }}>{capeVal}</strong> <span style={{ color: '#10B981' }}>▲ +2.1%</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: '#94A3B8', whiteSpace: 'nowrap' }}>
          <span>PANAMAX 4TC:</span> <strong style={{ color: '#fff' }}>{panamaxVal}</strong> <span style={{ color: '#F43F5E' }}>▼ -0.6%</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: '#94A3B8', whiteSpace: 'nowrap' }}>
          <span>VLSFO BUNKER FUEL (SINGAPORE):</span> <strong style={{ color: '#fff' }}>{bunkerVal}</strong> <span style={{ color: '#10B981' }}>▲ +0.8%</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: '#94A3B8', whiteSpace: 'nowrap' }}>
          <span>PARADIP COAL CONGESTION:</span> <strong style={{ color: '#fff' }}>4.8 Days Avg Wait</strong> <span style={{ color: '#F43F5E' }}>⚠️ Heavy Queue</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: '#94A3B8', whiteSpace: 'nowrap' }}>
          <span>GANGAVARAM DEEP TERMINAL:</span> <strong style={{ color: '#fff' }}>1.1 Days Avg Wait</strong> <span style={{ color: '#10B981' }}>🟢 Fluid Turnaround</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: '#94A3B8', whiteSpace: 'nowrap' }}>
          <span>HALDIA HOOGHLY DRAFT:</span> <strong style={{ color: '#fff' }}>8.5m Max Permissible</strong> <span style={{ color: '#F59E0B' }}>⚠️ Riverine Lock</span>
        </div>

        {/* Duplicate for infinite loop */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: '#94A3B8', whiteSpace: 'nowrap' }}>
          <span>BALTIC DRY INDEX (BDI):</span> <strong style={{ color: '#fff' }}>{bdiVal}</strong> <span style={{ color: '#10B981' }}>▲ {bdiDelta}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: '#94A3B8', whiteSpace: 'nowrap' }}>
          <span>CAPESIZE TC AVERAGE:</span> <strong style={{ color: '#fff' }}>{capeVal}</strong> <span style={{ color: '#10B981' }}>▲ +2.1%</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: '#94A3B8', whiteSpace: 'nowrap' }}>
          <span>PANAMAX 4TC:</span> <strong style={{ color: '#fff' }}>{panamaxVal}</strong> <span style={{ color: '#F43F5E' }}>▼ -0.6%</span>
        </div>
      </div>
    </div>
  );
}
