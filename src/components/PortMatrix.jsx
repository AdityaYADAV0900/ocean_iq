import React from 'react';

export default function PortMatrix() {
  const ports = [
    {
      name: "Gangavaram",
      jurisdiction: "Andhra Pradesh (Private)",
      draft: "18.2 m",
      loa: "300 m",
      dischargeRate: "35,000 MT/day",
      wait: "1.1 Days (Fast)",
      vessel: "Capesize / Baby Cape",
      badgeType: "badge-deep"
    },
    {
      name: "Dhamra",
      jurisdiction: "Odisha (Private)",
      draft: "18.0 m",
      loa: "290 m",
      dischargeRate: "30,000 MT/day",
      wait: "2.0 Days",
      vessel: "Capesize / Panamax",
      badgeType: "badge-deep"
    },
    {
      name: "Paradip",
      jurisdiction: "Odisha (Major Port)",
      draft: "16.5 m",
      loa: "260 m",
      dischargeRate: "25,000 MT/day",
      wait: "4.8 Days (Congested)",
      vessel: "Panamax / Baby Cape",
      badgeType: "badge-deep"
    },
    {
      name: "Visakhapatnam (Vizag)",
      jurisdiction: "Andhra Pradesh (Major Port)",
      draft: "14.5 m",
      loa: "240 m",
      dischargeRate: "22,000 MT/day",
      wait: "3.2 Days",
      vessel: "Panamax",
      badgeType: "badge-deep"
    },
    {
      name: "Gopalpur",
      jurisdiction: "Odisha (Private)",
      draft: "14.5 m",
      loa: "230 m",
      dischargeRate: "18,000 MT/day",
      wait: "2.5 Days",
      vessel: "Panamax / Supramax",
      badgeType: "badge-deep"
    },
    {
      name: "Haldia (HDC)",
      jurisdiction: "West Bengal (Major Tidal)",
      draft: "8.5 m (Riverine)",
      loa: "190 m",
      dischargeRate: "14,000 MT/day",
      wait: "4.5 Days (Tidal Delay)",
      vessel: "Handysize (Requires lightering)",
      badgeType: "badge-river"
    }
  ];

  return (
    <section className="section" id="ports">
      <div className="container">
        
        <div className="section-header">
          <span className="section-tag">Terminal Constraints & Ground Truth</span>
          <h2 className="section-title">Indian Inbound Maritime Infrastructure</h2>
          <p className="section-desc">
            Physical parameters governing SAIL & RINL raw material imports along India's eastern maritime seaboard.
          </p>
        </div>

        <div className="table-wrapper">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Discharge Port</th>
                <th>State & Jurisdiction</th>
                <th>Permissible Draft</th>
                <th>Max LOA</th>
                <th>Daily Discharge</th>
                <th>Avg Anchor Wait</th>
                <th>Primary Vessel Class</th>
              </tr>
            </thead>
            <tbody>
              {ports.map((port, idx) => (
                <tr key={idx}>
                  <td><strong>{port.name}</strong></td>
                  <td>{port.jurisdiction}</td>
                  <td>
                    <span className={`port-pill-badge ${port.badgeType}`}>
                      {port.draft}
                    </span>
                  </td>
                  <td>{port.loa}</td>
                  <td>{port.dischargeRate}</td>
                  <td>{port.wait}</td>
                  <td>{port.vessel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </section>
  );
}
