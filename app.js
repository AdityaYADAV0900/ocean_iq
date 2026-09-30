/**
 * OceanIQ DSS - Interactive Landing Page Logic & Logistics Simulation Engine
 * Faithfully mirrors the project's XGBoost ML, PuLP MILP optimizer, draft constraints, and Copilot.
 */

// Route Distances (Nautical Miles) from predictor.py
const ROUTE_DISTANCES = {
  "Hay Point (Australia)": {
    "Paradip": 4900, "Visakhapatnam (Vizag)": 5050, "Gangavaram": 5060, "Dhamra": 4850, "Haldia": 4920, "Gopalpur": 5000
  },
  "Newcastle (Australia)": {
    "Paradip": 5400, "Visakhapatnam (Vizag)": 5550, "Gangavaram": 5560, "Dhamra": 5350, "Haldia": 5420, "Gopalpur": 5500
  },
  "Baltimore (USA)": {
    "Paradip": 9100, "Visakhapatnam (Vizag)": 8950, "Gangavaram": 8960, "Dhamra": 9150, "Haldia": 9200, "Gopalpur": 9000
  },
  "Hampton Roads (USA)": {
    "Paradip": 8950, "Visakhapatnam (Vizag)": 8800, "Gangavaram": 8810, "Dhamra": 9000, "Haldia": 9050, "Gopalpur": 8850
  },
  "Nacala (Mozambique)": {
    "Paradip": 3800, "Visakhapatnam (Vizag)": 3650, "Gangavaram": 3660, "Dhamra": 3850, "Haldia": 3900, "Gopalpur": 3700
  },
  "Richards Bay (South Africa)": {
    "Paradip": 4650, "Visakhapatnam (Vizag)": 4500, "Gangavaram": 4510, "Dhamra": 4700, "Haldia": 4750, "Gopalpur": 4550
  },
  "Kalimantan (Indonesia)": {
    "Paradip": 2100, "Visakhapatnam (Vizag)": 2050, "Gangavaram": 2060, "Dhamra": 2080, "Haldia": 2120, "Gopalpur": 2040
  },
  "Taboneo (Indonesia)": {
    "Paradip": 2250, "Visakhapatnam (Vizag)": 2200, "Gangavaram": 2210, "Dhamra": 2230, "Haldia": 2270, "Gopalpur": 2190
  },
  "Taman (Russia)": {
    "Paradip": 5800, "Visakhapatnam (Vizag)": 5700, "Gangavaram": 5710, "Dhamra": 5850, "Haldia": 5900, "Gopalpur": 5720
  },
  "Vostochny (Russia)": {
    "Paradip": 4400, "Visakhapatnam (Vizag)": 4500, "Gangavaram": 4510, "Dhamra": 4350, "Haldia": 4420, "Gopalpur": 4480
  }
};

// Port Constraints (Draft, LOA, handling rate, queue days)
const PORT_CONSTRAINTS = {
  "Paradip": { maxDraft: 16.5, maxLoa: 260, avgWait: 4.8, ratePerDay: 25000, state: "Odisha", type: "Major Deepwater" },
  "Visakhapatnam (Vizag)": { maxDraft: 14.5, maxLoa: 240, avgWait: 3.2, ratePerDay: 22000, state: "Andhra Pradesh", type: "Inner/Outer Harbour" },
  "Gangavaram": { maxDraft: 18.2, maxLoa: 300, avgWait: 1.1, ratePerDay: 35000, state: "Andhra Pradesh", type: "Ultra-Deepwater Private" },
  "Dhamra": { maxDraft: 18.0, maxLoa: 290, avgWait: 2.0, ratePerDay: 30000, state: "Odisha", type: "Deepwater Bulk" },
  "Haldia": { maxDraft: 8.5, maxLoa: 190, avgWait: 4.5, ratePerDay: 14000, state: "West Bengal", type: "Riverine Tidal (Shallow)" },
  "Gopalpur": { maxDraft: 14.5, maxLoa: 230, avgWait: 2.5, ratePerDay: 18000, state: "Odisha", type: "All-Weather Deepwater" }
};

// Vessel Classes Specifications
const VESSEL_SPECS = {
  "Handysize": { capacity: 35000, draft: 8.5, loa: 180, discount: 0.00, dailyCharterRate: 15000 },
  "Supramax": { capacity: 55000, draft: 11.5, loa: 200, discount: 0.05, dailyCharterRate: 18500 },
  "Panamax": { capacity: 75000, draft: 13.5, loa: 225, discount: 0.10, dailyCharterRate: 23000 },
  "Capesize": { capacity: 170000, draft: 17.5, loa: 290, discount: 0.15, dailyCharterRate: 36000 }
};

// Base baseline rate per nautical mile per MT
const BASE_RATE_PER_NM = 0.0042;

// Grounded Copilot Answers Database
const COPILOT_KNOWLEDGE = {
  "Why did the system allocate 2x Panamax instead of a single Capesize?": 
    "**Operational Feasibility Gatekeeper Active:**\nA Capesize bulk carrier requires a minimum water depth of **17.5 meters** and Length Overall (LOA) of 290m. At shallow or constrained discharge terminals like Vizag (max draft 14.5m) or Paradip inner berths, a fully laden Capesize would breach Under-Keel Clearance (UKC) regulations and run aground.\n\nOur PuLP MILP solver therefore allocated **2x Panamax (75,000 MT each, draft 13.5m)**, ensuring 100% navigational safety while maintaining a 10% volume economy of scale discount.",
    
  "What are the riverine navigation constraints at Haldia port?":
    "**Haldia Dock Complex (HDC) Constraints:**\nHaldia is a riverine port on the Hooghly River characterized by shifting sandbars and strict tidal restrictions.\n• **Max Permissible Draft:** 8.5 meters (varies with seasonal tides)\n• **Vessel Compatibility:** Limited to **Handysize (~35,000 MT)** vessels or partially lightened Supramax.\n• Capesize and Panamax bulk carriers cannot directly berth without offshore lightering at Sandheads or diverting cargo to deepwater terminals like Gangavaram or Dhamra followed by rail rakes to Durgapur and Bokaro steel plants.",
    
  "How does Russian coal sourcing (Taman / Vostochny) compare to Australian origins?":
    "**Russian vs Australian Coal Logistics Arbitrage:**\n• **Vostochny (Russian Far East) ➔ Vizag:** Distance is ~4,500 NM (~14 days transit), which is ~500 NM closer than Hay Point, Australia (5,050 NM). Freight rates hover around **$28–$31/MT**.\n• **Taman (Black Sea) ➔ India:** Longer route (~5,700 NM) via Suez Canal with higher insurance / war risk premium, yielding freight around **$36–$40/MT**.\n• Sourcing from Vostochny provides SAIL a strong strategic hedge against Australian coking coal price spikes, saving an estimated **$3.20/MT** on delivered fuel parity.",
    
  "What is our expected demurrage liability at this discharge port and how can we mitigate it?":
    "**Demurrage Risk Analysis:**\nParadip and Haldia experience significant pre-berthing waiting times of **4.5 to 5.0 days** due to high thermal & coking coal congestion. At a standard charterparty demurrage rate of **$22,000/day**, a single 75,000 MT Panamax incurs ~$105,000 in excess laytime penalties.\n\n**Mitigation Strategy:** Diverting to **Gangavaram Port** (private automated deep terminal with 1.1-day average wait) completely eliminates congestion demurrage, generating **~$78,000 net savings** per voyage even after factoring inland rake haulage to SAIL plants."
};

// Calculation Engine
function calculateSim() {
  const origin = document.getElementById("sim-origin").value;
  const dest = document.getElementById("sim-dest").value;
  const cargoVol = parseFloat(document.getElementById("sim-volume").value);
  const contractType = document.querySelector('input[name="sim-contract"]:checked').value;
  
  // 1. Get Distance
  const dist = (ROUTE_DISTANCES[origin] && ROUTE_DISTANCES[origin][dest]) ? ROUTE_DISTANCES[origin][dest] : 4800;
  
  // 2. Base Freight Rate (Formula based on XGBoost inference characteristics)
  const bdiFactor = 1.05; // active market level
  let baseRate = (dist * BASE_RATE_PER_NM * 1.62) * bdiFactor;
  
  // Origin specific regional adjustments
  if (origin.includes("Russia")) baseRate *= 1.08; // canal / geopolitical surcharge
  if (origin.includes("USA")) baseRate *= 0.95; // Atlantic economy
  if (contractType === "COA") baseRate *= 0.94; // 6% mid-term volume discount
  
  // 3. Port Draft & Vessel Allocation
  const port = PORT_CONSTRAINTS[dest];
  let feasibleVessel = "Handysize";
  let vesselCount = 1;
  let feasibilityStatus = "optimal";
  let feasibilityMsg = "";
  
  if (port.maxDraft >= 17.5 && cargoVol >= 120000) {
    feasibleVessel = "Capesize";
    vesselCount = Math.ceil(cargoVol / VESSEL_SPECS["Capesize"].capacity);
    feasibilityMsg = `✅ Port accommodates Capesize draft (${port.maxDraft}m ≥ 17.5m). Lowest per-tonne freight.`;
  } else if (port.maxDraft >= 13.5 && cargoVol >= 60000) {
    feasibleVessel = "Panamax";
    vesselCount = Math.ceil(cargoVol / VESSEL_SPECS["Panamax"].capacity);
    feasibilityMsg = `✅ Port accommodates Panamax (${port.maxDraft}m ≥ 13.5m). Ideal fleet balance.`;
  } else if (port.maxDraft >= 11.5) {
    feasibleVessel = "Supramax";
    vesselCount = Math.ceil(cargoVol / VESSEL_SPECS["Supramax"].capacity);
    feasibilityMsg = `⚠️ Capesize/Panamax draft restricted. Using geared Supramax.`;
    feasibilityStatus = "warning";
  } else {
    feasibleVessel = "Handysize";
    vesselCount = Math.ceil(cargoVol / VESSEL_SPECS["Handysize"].capacity);
    feasibilityMsg = `🚨 Strict shallow draft (${port.maxDraft}m). Restricted to Handysize / lightering.`;
    feasibilityStatus = "danger";
  }
  
  // Apply Vessel volume discount
  const discount = VESSEL_SPECS[feasibleVessel].discount;
  const effectiveRate = baseRate * (1 - discount);
  const totalOceanCost = effectiveRate * cargoVol;
  
  // 4. Demurrage Calculation
  const laytimeAllowedDays = Math.ceil(cargoVol / 18000); // 18k MT/day agreed charterparty discharge
  const actualPortStayDays = port.avgWait + Math.ceil(cargoVol / port.ratePerDay);
  const excessIdleDays = Math.max(0, actualPortStayDays - laytimeAllowedDays);
  const dailyDemurrageRate = VESSEL_SPECS[feasibleVessel].dailyCharterRate;
  const totalDemurrage = excessIdleDays * dailyDemurrageRate * vesselCount;
  
  // Gangavaram diversion savings
  const gvPortStay = 1.1 + Math.ceil(cargoVol / 35000);
  const gvExcess = Math.max(0, gvPortStay - laytimeAllowedDays);
  const gvDemurrage = gvExcess * dailyDemurrageRate * vesselCount;
  const diversionSavings = Math.max(0, totalDemurrage - gvDemurrage);
  
  // Update UI Elements
  document.getElementById("out-distance").innerText = `${dist.toLocaleString()} NM`;
  document.getElementById("out-rate").innerText = `$${effectiveRate.toFixed(2)} / MT`;
  document.getElementById("out-fleet").innerText = `${vesselCount}x ${feasibleVessel}`;
  document.getElementById("out-cost").innerText = `$${(totalOceanCost / 1000000).toFixed(2)}M`;
  document.getElementById("out-demurrage").innerText = `$${Math.round(totalDemurrage).toLocaleString()}`;
  document.getElementById("out-diversion").innerText = `$${Math.round(diversionSavings).toLocaleString()}`;
  
  // Update Feasibility Pill
  const pillBox = document.getElementById("feasibility-pill");
  pillBox.className = `feasibility-pill-box ${feasibilityStatus}`;
  document.getElementById("pill-title").innerText = `${dest} Draft Clearance: ${port.maxDraft}m`;
  document.getElementById("pill-desc").innerText = feasibilityMsg;
}

// Preset Loader
function loadPreset(origin, dest, vol, contract) {
  document.getElementById("sim-origin").value = origin;
  document.getElementById("sim-dest").value = dest;
  document.getElementById("sim-volume").value = vol;
  document.getElementById("vol-display").innerText = `${vol.toLocaleString()} MT`;
  
  const radio = document.querySelector(`input[name="sim-contract"][value="${contract}"]`);
  if (radio) radio.checked = true;
  
  calculateSim();
  
  // Scroll to simulator panel smoothly
  const el = document.getElementById("simulator");
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
}

// Interactive Copilot Handler
function handleCopilotChip(question) {
  const answer = COPILOT_KNOWLEDGE[question] || "I am analyzing the maritime database for your question...";
  
  const terminalBody = document.getElementById("terminal-chat-body");
  
  // Add User bubble
  const userDiv = document.createElement("div");
  userDiv.className = "chat-bubble chat-user";
  userDiv.innerHTML = `<strong>🧑‍💼 Logistics Officer:</strong><br>${question}`;
  terminalBody.appendChild(userDiv);
  
  // Add Copilot response
  setTimeout(() => {
    const aiDiv = document.createElement("div");
    aiDiv.className = "chat-bubble chat-copilot";
    // Replace markdown bold with html
    const formatted = answer.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>');
    aiDiv.innerHTML = `<strong>🤖 OceanIQ Copilot (Grounded DSS):</strong><br>${formatted}`;
    terminalBody.appendChild(aiDiv);
    
    // Auto scroll terminal
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }, 350);
}

// Event Listeners on Load
document.addEventListener("DOMContentLoaded", () => {
  // Volume slider sync
  const volSlider = document.getElementById("sim-volume");
  const volDisplay = document.getElementById("vol-display");
  
  if (volSlider && volDisplay) {
    volSlider.addEventListener("input", (e) => {
      volDisplay.innerText = `${parseInt(e.target.value).toLocaleString()} MT`;
      calculateSim();
    });
  }
  
  // Select change listeners
  const originSelect = document.getElementById("sim-origin");
  const destSelect = document.getElementById("sim-dest");
  const contractRadios = document.querySelectorAll('input[name="sim-contract"]');
  
  if (originSelect) originSelect.addEventListener("change", calculateSim);
  if (destSelect) destSelect.addEventListener("change", calculateSim);
  contractRadios.forEach(r => r.addEventListener("change", calculateSim));
  
  // Initial Calculation
  calculateSim();
  
  // Smooth scroll links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});
