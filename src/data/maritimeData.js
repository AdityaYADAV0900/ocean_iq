export const ROUTE_DISTANCES = {
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

export const PORT_CONSTRAINTS = {
  "Paradip": { maxDraft: 16.5, maxLoa: 260, avgWait: 4.8, ratePerDay: 25000, state: "Odisha", type: "Major Deepwater" },
  "Visakhapatnam (Vizag)": { maxDraft: 14.5, maxLoa: 240, avgWait: 3.2, ratePerDay: 22000, state: "Andhra Pradesh", type: "Inner/Outer Harbour" },
  "Gangavaram": { maxDraft: 18.2, maxLoa: 300, avgWait: 1.1, ratePerDay: 35000, state: "Andhra Pradesh", type: "Ultra-Deepwater Private" },
  "Dhamra": { maxDraft: 18.0, maxLoa: 290, avgWait: 2.0, ratePerDay: 30000, state: "Odisha", type: "Deepwater Bulk" },
  "Haldia": { maxDraft: 8.5, maxLoa: 190, avgWait: 4.5, ratePerDay: 14000, state: "West Bengal", type: "Riverine Tidal (Shallow)" },
  "Gopalpur": { maxDraft: 14.5, maxLoa: 230, avgWait: 2.5, ratePerDay: 18000, state: "Odisha", type: "All-Weather Deepwater" }
};

export const VESSEL_SPECS = {
  "Handysize": { capacity: 35000, draft: 8.5, loa: 180, discount: 0.00, dailyCharterRate: 15000 },
  "Supramax": { capacity: 55000, draft: 11.5, loa: 200, discount: 0.05, dailyCharterRate: 18500 },
  "Panamax": { capacity: 75000, draft: 13.5, loa: 225, discount: 0.10, dailyCharterRate: 23000 },
  "Capesize": { capacity: 170000, draft: 17.5, loa: 290, discount: 0.15, dailyCharterRate: 36000 }
};

export const COPILOT_PRESETS = [
  {
    id: "panamax_vs_cape",
    title: "🚢 1. Why 2x Panamax vs Capesize?",
    question: "Why did the system allocate 2x Panamax instead of a single Capesize for this cargo?",
    answer: "A Capesize bulk carrier requires a minimum water depth of 17.5 meters and Length Overall (LOA) of 290m. At draft-constrained discharge terminals such as Vizag (14.5m) or Paradip inner berths, a laden Capesize would violate Under-Keel Clearance (UKC) regulations. OceanIQ's PuLP MILP solver optimizes for 2x Panamax (75,000 MT, draft 13.5m), guaranteeing 100% navigational safety while capturing a 10% volume discount."
  },
  {
    id: "haldia_constraints",
    title: "🌊 2. Haldia River Constraints?",
    question: "What are the riverine navigation constraints and vessel restrictions at Haldia port?",
    answer: "Haldia Dock Complex (HDC) is located on the Hooghly River estuary with severe tidal drafts (~8.5m max permissible). It cannot accommodate Capesize or Panamax vessels without offshore lightering at Sandheads or diverting to deepwater terminals like Gangavaram or Dhamra followed by railway rakes to Durgapur and Bokaro steel plants."
  },
  {
    id: "russian_coal",
    title: "🇷🇺 3. Russian Coal Arbitrage?",
    question: "How does sourcing metallurgical coal from Russian ports (Taman / Vostochny) compare to Australian origins?",
    answer: "Vostochny (Russian Far East) ➔ Vizag is ~4,500 NM (~14 days transit), ~500 NM shorter than Hay Point, Australia. Taman (Black Sea) is longer (~5,700 NM) with higher canal fees. Sourcing from Vostochny provides SAIL a strong strategic hedge against Australian coking coal price spikes, yielding ~$3.20/MT delivered fuel parity savings."
  },
  {
    id: "demurrage_mitigation",
    title: "⏳ 4. Demurrage & Gangavaram?",
    question: "What is our expected demurrage liability at this discharge port and how can we mitigate it via Gangavaram?",
    answer: "Paradip and Haldia experience significant queue waits of 4.5 to 4.8 days due to high thermal/coking coal congestion, accumulating ~$80,000–$105,000 in excess laytime penalties per voyage. Diverting to Gangavaram Port (1.1-day turnaround) eliminates demurrage, generating net savings of up to $78,000 per voyage."
  }
];

export const BENCHMARK_SCENARIOS = [
  {
    label: "🇦🇺 Australia ➔ Paradip (150k MT Cape)",
    origin: "Hay Point (Australia)",
    dest: "Paradip",
    volume: 150000,
    contract: "Spot"
  },
  {
    label: "🇷🇺 Russia (Taman) ➔ Haldia (35k MT Handy)",
    origin: "Taman (Russia)",
    dest: "Haldia",
    volume: 35000,
    contract: "Spot"
  },
  {
    label: "🇺🇸 USA (Baltimore) ➔ Gangavaram (160k MT COA)",
    origin: "Baltimore (USA)",
    dest: "Gangavaram",
    volume: 160000,
    contract: "COA"
  },
  {
    label: "🇮🇩 Indonesia ➔ Vizag (55k MT Supramax)",
    origin: "Kalimantan (Indonesia)",
    dest: "Visakhapatnam (Vizag)",
    volume: 55000,
    contract: "Spot"
  }
];
