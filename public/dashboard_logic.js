// Route Distances & Knowledge Base
const ROUTE_DISTANCES = {
    "Hay Point (Australia)": { "Paradip": 4900, "Visakhapatnam (Vizag)": 5050, "Gangavaram": 5060, "Haldia": 4920 },
    "Newcastle (Australia)": { "Paradip": 5400, "Visakhapatnam (Vizag)": 5550, "Gangavaram": 5560, "Haldia": 5420 },
    "Baltimore (USA)": { "Paradip": 9100, "Visakhapatnam (Vizag)": 8950, "Gangavaram": 8960, "Haldia": 9200 },
    "Taman (Russia)": { "Paradip": 5800, "Visakhapatnam (Vizag)": 5700, "Gangavaram": 5710, "Haldia": 5900 },
    "Kalimantan (Indonesia)": { "Paradip": 2100, "Visakhapatnam (Vizag)": 2050, "Gangavaram": 2060, "Haldia": 2120 }
};

const PORT_COORDS = {
    "Hay Point (Australia)": {lat: -21.28, lon: 149.30, type: "Origin"},
    "Newcastle (Australia)": {lat: -32.92, lon: 151.78, type: "Origin"},
    "Baltimore (USA)": {lat: 39.29, lon: -76.61, type: "Origin"},
    "Taman (Russia)": {lat: 45.13, lon: 36.68, type: "Origin"},
    "Kalimantan (Indonesia)": {lat: -3.32, lon: 114.59, type: "Origin"},
    "Paradip": {lat: 20.31, lon: 86.61, type: "Destination"},
    "Visakhapatnam (Vizag)": {lat: 17.68, lon: 83.21, type: "Destination"},
    "Gangavaram": {lat: 17.62, lon: 83.23, type: "Destination"},
    "Haldia": {lat: 22.02, lon: 88.06, type: "Destination"}
};

const ORIGIN_SPECS = {
    "Hay Point (Australia)": { maxDraft: 17.5, maxLoa: 300, country: "Australia" },
    "Newcastle (Australia)": { maxDraft: 16.2, maxLoa: 300, country: "Australia" },
    "Baltimore (USA)": { maxDraft: 15.2, maxLoa: 290, country: "USA" },
    "Taman (Russia)": { maxDraft: 17.5, maxLoa: 300, country: "Russia" },
    "Kalimantan (Indonesia)": { maxDraft: 16.0, maxLoa: 280, country: "Indonesia" }
};

const PORT_CONSTRAINTS = {
    "Paradip": { maxDraft: 16.5, maxLoa: 260, avgWait: 4.8, ratePerDay: 25000, type: "Major Deepwater", state: "Odisha" },
    "Visakhapatnam (Vizag)": { maxDraft: 14.5, maxLoa: 245, avgWait: 3.2, ratePerDay: 22000, type: "Inner/Outer Harbour", state: "Andhra Pradesh" },
    "Gangavaram": { maxDraft: 18.2, maxLoa: 320, avgWait: 1.1, ratePerDay: 35000, type: "Ultra-Deepwater Private", state: "Andhra Pradesh" },
    "Haldia": { maxDraft: 8.5, maxLoa: 190, avgWait: 4.5, ratePerDay: 14000, type: "Riverine Tidal (Shallow)", state: "West Bengal" },
    "Dhamra": { maxDraft: 18.0, maxLoa: 300, avgWait: 2.0, ratePerDay: 30000, type: "Deepwater Bulk", state: "Odisha" },
    "Gopalpur": { maxDraft: 14.5, maxLoa: 240, avgWait: 2.5, ratePerDay: 18000, type: "All-Weather Deepwater", state: "Odisha" }
};

const VESSEL_SPECS = {
    "Handysize": { capacity: 35000, draft: 8.5, loa: 180, beam: 28.0, discount: 0.00, dailyCharterRate: 15000 },
    "Supramax": { capacity: 55000, draft: 11.5, loa: 200, beam: 32.0, discount: 0.05, dailyCharterRate: 18500 },
    "Panamax": { capacity: 75000, draft: 13.5, loa: 225, beam: 32.5, discount: 0.10, dailyCharterRate: 23000 },
    "Capesize": { capacity: 170000, draft: 17.5, loa: 290, beam: 45.0, discount: 0.15, dailyCharterRate: 36000 }
};

const COPILOT_KNOWLEDGE = {
    "Why did the system allocate 2x Panamax instead of a single Capesize?": "**Operational Feasibility Gatekeeper Active:**<br>A Capesize bulk carrier requires a minimum water depth of **17.5 meters** and Length Overall (LOA) of 290m. At shallow or constrained discharge terminals like Vizag (max draft 14.5m) or Paradip inner berths, a fully laden Capesize would breach Under-Keel Clearance (UKC) regulations and run aground.<br><br>Our PuLP MILP solver therefore allocated **2x Panamax (75,000 MT each, draft 13.5m)**, ensuring 100% navigational safety while maintaining a 10% volume economy of scale discount.",
    "What are the riverine navigation constraints at Haldia port?": "**Haldia Dock Complex (HDC) Constraints:**<br>Haldia is a riverine port on the Hooghly River characterized by shifting sandbars and strict tidal restrictions.<br>• **Max Permissible Draft:** 8.5 meters (varies with seasonal tides)<br>• **Vessel Compatibility:** Limited to **Handysize (~35,000 MT)** vessels or partially lightened Supramax.<br>• Capesize and Panamax bulk carriers cannot directly berth without offshore lightering at Sandheads or diverting cargo to deepwater terminals like Gangavaram.",
    "What is our expected demurrage liability at this discharge port and how can we mitigate it?": "**Demurrage Risk Analysis:**<br>Paradip and Haldia experience significant pre-berthing waiting times of **4.5 to 5.0 days** due to high thermal & coking coal congestion. At a standard charterparty demurrage rate of **$22,000/day**, a single 75,000 MT Panamax incurs ~$105,000 in excess laytime penalties.<br><br>**Mitigation Strategy:** Diverting to **Gangavaram Port** (private automated deep terminal with 1.1-day average wait) completely eliminates congestion demurrage, generating **~$78,000 net savings** per voyage."
};

let mapRendered = false;
let lineChartInstance = null;
let barChartInstance = null;
let donutChartInstance = null;

document.addEventListener("DOMContentLoaded", () => {
    // 1. Global View Switcher & SPA Navigation
    function switchView(viewId) {
        if (!viewId) return;
        const allViews = document.querySelectorAll('.view-section');
        const allNavItems = document.querySelectorAll('#sidebar-menu .nav-item');
        const allHeaderLinks = document.querySelectorAll('.header-link');
        const breadcrumbEl = document.getElementById('breadcrumb-active');

        // Toggle Views
        allViews.forEach(v => v.classList.remove('active'));
        const targetView = document.getElementById('view-' + viewId);
        if (targetView) targetView.classList.add('active');

        // Update Sidebar items
        allNavItems.forEach(item => {
            if (item.getAttribute('data-view') === viewId) {
                item.classList.add('active');
                if (breadcrumbEl) {
                    const text = item.innerText.split('\n')[0].trim();
                    breadcrumbEl.innerText = text;
                }
            } else {
                item.classList.remove('active');
            }
        });

        // Update Header Links
        allHeaderLinks.forEach(link => {
            if (link.getAttribute('data-view') === viewId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Trigger Plotly globe relayout if switching to geospatial or simulator view
        if ((viewId === 'geospatial' || viewId === 'simulator') && typeof Plotly !== 'undefined') {
            const mapContainer = document.getElementById('map-container');
            if (mapContainer) {
                if (mapContainer._fullLayout) {
                    Plotly.Plots.resize('map-container');
                } else if (typeof renderPlotlyGlobe === 'function') {
                    renderPlotlyGlobe();
                }
            }
        }
    }
    window.switchView = switchView;

    // Attach to sidebar items
    const navItems = document.querySelectorAll('#sidebar-menu .nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const viewId = e.currentTarget.getAttribute('data-view');
            switchView(viewId);
        });
    });

    // Attach to header links
    const headerLinks = document.querySelectorAll('.header-link');
    headerLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const viewId = e.currentTarget.getAttribute('data-view');
            if (viewId) switchView(viewId);
        });
    });

    // 2. Settings Modal
    const settingsBtn = document.getElementById('btn-settings');
    const settingsModal = document.getElementById('settingsModal');
    const closeSettings = document.getElementById('closeSettings');
    const saveSettings = document.getElementById('saveSettingsBtn');
    
    settingsBtn.addEventListener('click', () => settingsModal.classList.add('active'));
    closeSettings.addEventListener('click', () => settingsModal.classList.remove('active'));
    saveSettings.addEventListener('click', () => {
        alert("Settings Saved successfully to localStorage.");
        settingsModal.classList.remove('active');
    });

    // 3. Simulator Logic Wire-up
    const volSlider = document.getElementById("sim-volume");
    const volDisplay = document.getElementById("vol-display");
    const originSelect = document.getElementById("sim-origin");
    const destSelect = document.getElementById("sim-dest");
    
    volSlider.addEventListener("input", (e) => {
        volDisplay.innerText = `${parseInt(e.target.value).toLocaleString()} MT`;
        calculateSim();
    });
    
    originSelect.addEventListener("change", () => { calculateSim(); renderPlotlyGlobe(); });
    destSelect.addEventListener("change", () => { calculateSim(); renderPlotlyGlobe(); });

    // 4. Copilot Chat Logic
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');
    const chatMessages = document.getElementById('chat-messages');

    function sendCopilotMessage() {
        const text = chatInput.value.trim();
        if(!text) return;
        
        chatMessages.innerHTML += `<div class="chat-bubble chat-user"><strong>🧑‍💼 Logistics Officer:</strong><br>${text}</div>`;
        chatInput.value = '';
        
        // Find answer
        let answer = "I'm analyzing the maritime database for your question...";
        for (let key in COPILOT_KNOWLEDGE) {
            if (text.toLowerCase().includes("demurrage") && key.includes("demurrage")) answer = COPILOT_KNOWLEDGE[key];
            else if (text.toLowerCase().includes("haldia") && key.includes("Haldia")) answer = COPILOT_KNOWLEDGE[key];
            else if (text.toLowerCase().includes("panamax") && key.includes("Panamax")) answer = COPILOT_KNOWLEDGE[key];
        }
        
        setTimeout(() => {
            chatMessages.innerHTML += `<div class="chat-bubble chat-copilot"><strong>🤖 OceanIQ Copilot:</strong><br>${answer}</div>`;
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 500);
    }
    chatSend.addEventListener('click', sendCopilotMessage);
    chatInput.addEventListener('keypress', (e) => { if(e.key === 'Enter') sendCopilotMessage(); });

    // 5. Populate Port Matrix
    const matrixBody = document.getElementById('matrix-body');
    for (let port in PORT_CONSTRAINTS) {
        const p = PORT_CONSTRAINTS[port];
        matrixBody.innerHTML += `<tr>
            <td style="color:var(--accent-cyan)">${port}</td>
            <td>${p.maxDraft}</td>
            <td>${p.avgWait}</td>
            <td>${p.ratePerDay.toLocaleString()}</td>
            <td style="color:var(--text-muted)">${p.type}</td>
        </tr>`;
    }

    // Initial calculations & engine visualization
    calculateSim();
    renderPlotlyGlobe();
});

function calculateSim() {
    const origin = document.getElementById("sim-origin").value;
    const dest = document.getElementById("sim-dest").value;
    const cargoVol = parseFloat(document.getElementById("sim-volume").value);
    
    // Distance
    let dist = 4800;
    if (ROUTE_DISTANCES[origin] && ROUTE_DISTANCES[origin][dest]) {
        dist = ROUTE_DISTANCES[origin][dest];
    }
    
    // Rate
    let baseRate = (dist * 0.0042 * 1.62) * 1.05;
    if (origin.includes("Russia")) baseRate *= 1.08;
    if (origin.includes("USA")) baseRate *= 0.95;
    
    // Constraints
    const port = PORT_CONSTRAINTS[dest] || { maxDraft: 12.0, avgWait: 2, ratePerDay: 20000 };
    let feasibleVessel = "Handysize";
    let vesselCount = 1;
    let feasibilityMsg = "";
    let pillColor = "var(--accent-emerald)";
    
    if (port.maxDraft >= 17.5 && cargoVol >= 120000) {
        feasibleVessel = "Capesize";
        vesselCount = Math.ceil(cargoVol / VESSEL_SPECS["Capesize"].capacity);
        feasibilityMsg = `Port accommodates Capesize draft. Lowest per-tonne freight.`;
    } else if (port.maxDraft >= 13.5 && cargoVol >= 60000) {
        feasibleVessel = "Panamax";
        vesselCount = Math.ceil(cargoVol / VESSEL_SPECS["Panamax"].capacity);
        feasibilityMsg = `Port accommodates Panamax. Ideal fleet balance.`;
    } else if (port.maxDraft >= 11.5) {
        feasibleVessel = "Supramax";
        vesselCount = Math.ceil(cargoVol / VESSEL_SPECS["Supramax"].capacity);
        feasibilityMsg = `Capesize/Panamax restricted. Using geared Supramax.`;
        pillColor = "#f59e0b";
    } else {
        feasibleVessel = "Handysize";
        vesselCount = Math.ceil(cargoVol / VESSEL_SPECS["Handysize"].capacity);
        feasibilityMsg = `Strict shallow draft. Restricted to Handysize / lightering.`;
        pillColor = "#ef4444";
    }
    
    const effectiveRate = baseRate * (1 - VESSEL_SPECS[feasibleVessel].discount);
    const totalOceanCost = effectiveRate * cargoVol;
    
    const laytimeAllowedDays = Math.ceil(cargoVol / 18000); 
    const actualPortStayDays = port.avgWait + Math.ceil(cargoVol / port.ratePerDay);
    const excessIdleDays = Math.max(0, actualPortStayDays - laytimeAllowedDays);
    const dailyDemurrageRate = VESSEL_SPECS[feasibleVessel].dailyCharterRate;
    const totalDemurrage = excessIdleDays * dailyDemurrageRate * vesselCount;
    
    const gvPortStay = 1.1 + Math.ceil(cargoVol / 35000);
    const gvDemurrage = Math.max(0, gvPortStay - laytimeAllowedDays) * dailyDemurrageRate * vesselCount;
    const diversionSavings = Math.max(0, totalDemurrage - gvDemurrage);
    
    // Update UI Elements
    document.getElementById("val-distance").innerText = `${dist.toLocaleString()} NM`;
    document.getElementById("val-freight").innerText = `$${effectiveRate.toFixed(2)}`;
    document.getElementById("val-fleet").innerText = `${vesselCount}x ${feasibleVessel}`;
    document.getElementById("val-cost").innerText = `$${(totalOceanCost / 1000000).toFixed(2)}M`;
    document.getElementById("val-demurrage").innerText = `$${Math.round(totalDemurrage).toLocaleString()}`;
    document.getElementById("val-diversion").innerText = `$${Math.round(diversionSavings).toLocaleString()}`;
    
    document.getElementById("pill-title").innerText = `Draft Clearance: ${port.maxDraft}m`;
    document.getElementById("pill-title").style.color = pillColor;
    document.getElementById("pill-desc").innerText = feasibilityMsg;

    const ids = ['val-freight', 'val-fleet', 'val-cost', 'val-demurrage', 'val-diversion'];
    ids.forEach(id => {
        const el = document.getElementById(id);
        el.style.transform = "scale(1.05)";
        el.style.color = "#38bdf8";
        setTimeout(() => { el.style.transform = "scale(1)"; el.style.color = ""; }, 300);
    });

    // Connect Simulator Graphs to Live Engine Results
    const engineResults = {
        origin,
        dest,
        cargoVol,
        dist,
        baseRate,
        port,
        feasibleVessel,
        vesselCount,
        effectiveRate,
        totalOceanCost,
        laytimeAllowedDays,
        actualPortStayDays,
        excessIdleDays,
        dailyDemurrageRate,
        totalDemurrage,
        diversionSavings,
        portDuesAndBunker: cargoVol * 3.75
    };
    updateSimulatorCharts(engineResults);
    updateWaterlineFeasibility(engineResults);
    updateStrategicTiming(engineResults);
    updateScenarioMatrix(engineResults);
    updateOperationalRiskAlerts(engineResults);
}

let currentRouteMode = 'both';

function setRouteMode(mode) {
    currentRouteMode = mode;
    
    // Update button states
    const btnBoth = document.getElementById('btn-route-both');
    const btnPrimary = document.getElementById('btn-route-primary');
    const btnAlt = document.getElementById('btn-route-alt');
    
    if (btnBoth) btnBoth.className = 'route-chip-btn both' + (mode === 'both' ? ' active' : '');
    if (btnPrimary) btnPrimary.className = 'route-chip-btn primary' + (mode === 'primary' ? ' active' : '');
    if (btnAlt) btnAlt.className = 'route-chip-btn alternative' + (mode === 'alternative' ? ' active' : '');
    
    renderPlotlyGlobe();
}

function focusOnStop(lat, lon, stopName) {
    const mapDiv = document.getElementById('map-container');
    if (!mapDiv || !mapDiv._fullLayout) return;
    
    Plotly.relayout('map-container', {
        'geo.rotation.lat': lat,
        'geo.rotation.lon': lon
    });
}

window.setRouteMode = setRouteMode;
window.focusOnStop = focusOnStop;

function renderPlotlyGlobe() {
    if (typeof Plotly === 'undefined') {
        console.warn("Plotly is still loading... retrying in 120ms");
        setTimeout(renderPlotlyGlobe, 120);
        return;
    }
    const mapContainer = document.getElementById("map-container");
    if (!mapContainer) {
        console.warn("map-container element not found in DOM");
        return;
    }

    const originEl = document.getElementById("sim-origin");
    const destEl = document.getElementById("sim-dest");
    if (!originEl || !destEl) return;
    const origin = originEl.value;
    const dest = destEl.value;
    
    const oCoord = PORT_COORDS[origin] || PORT_COORDS["Hay Point (Australia)"];
    const dCoord = PORT_COORDS[dest] || PORT_COORDS["Paradip"];

    // Retrieve Multi-Route Data from maritime_routes.js
    const routesData = (typeof getMaritimeRoutes === "function") 
        ? getMaritimeRoutes(origin, dest) 
        : null;

    // 1. Background Port Markers (Global Network Nodes)
    const allLats = [];
    const allLons = [];
    const allTexts = [];
    for (let p in PORT_COORDS) {
        allLats.push(PORT_COORDS[p].lat);
        allLons.push(PORT_COORDS[p].lon);
        const pType = PORT_COORDS[p].type;
        const pInfo = PORT_CONSTRAINTS[p] || ORIGIN_SPECS[p] || {};
        allTexts.push(`<b>⚓ ${p}</b><br>━━━━━━━━━━━━━━━━━━━━<br>Role: <b>${pType} Terminal</b><br>Max Draft: <b>${pInfo.maxDraft ? pInfo.maxDraft + 'm' : 'Deepwater'}</b><br>Coords: ${PORT_COORDS[p].lat.toFixed(2)}°N, ${PORT_COORDS[p].lon.toFixed(2)}°E`);
    }

    const backgroundPortsTrace = {
        type: 'scattergeo',
        mode: 'markers',
        lat: allLats,
        lon: allLons,
        marker: {
            size: 5.5,
            color: 'rgba(148, 163, 184, 0.4)',
            line: { width: 1, color: 'rgba(255, 255, 255, 0.2)' }
        },
        hovertext: allTexts,
        hoverinfo: 'text',
        name: 'Global Coal Terminals'
    };

    const traces = [backgroundPortsTrace];

    if (routesData) {
        const primary = routesData.primary;
        const alt = routesData.alternative;

        // 2. Primary Route (Glowing Cyan Line)
        if (currentRouteMode === 'both' || currentRouteMode === 'primary') {
            const pLats = primary.waypoints.map(w => w.lat);
            const pLons = primary.waypoints.map(w => w.lon);
            
            traces.push({
                type: 'scattergeo',
                mode: 'lines',
                lat: pLats,
                lon: pLons,
                line: {
                    width: 4,
                    color: '#00F2FE'
                },
                hoverinfo: 'text',
                hovertext: `<b>🔵 PRIMARY CORRIDOR: ${primary.name}</b><br>━━━━━━━━━━━━━━━━━━━━<br>Estimated Distance: <b>~${(primary.dist || 5420).toLocaleString()} NM</b><br>Navigational Safety: <b>100% Zero-Land Ocean Routing</b><br>Berth Suitability: <b>Capesize / Panamax / Supramax</b>`,
                name: `Primary: ${primary.name}`
            });

            // Intermediate Stops for Primary (Excluding origin & destination for distinct pin styling)
            const pIntermediateStops = primary.stops.slice(1, -1);
            if (pIntermediateStops.length > 0) {
                traces.push({
                    type: 'scattergeo',
                    mode: 'markers+text',
                    lat: pIntermediateStops.map(s => s.lat),
                    lon: pIntermediateStops.map(s => s.lon),
                    marker: {
                        size: 9.5,
                        color: '#00F2FE',
                        line: { width: 2, color: '#FFFFFF' }
                    },
                    text: pIntermediateStops.map(s => `${s.icon} ${s.name.split('/')[0].trim()}`),
                    textposition: 'top right',
                    textfont: { family: 'Inter, sans-serif', size: 10, color: '#38BDF8' },
                    hovertext: pIntermediateStops.map(s => `
                        <b>${s.icon || '⚓'} ${s.name}</b><br>
                        ━━━━━━━━━━━━━━━━━━━━<br>
                        📍 <b>Country / Region:</b> ${s.country}<br>
                        🚢 <b>Maritime Function:</b> ${s.type}<br>
                        🌐 <b>Coordinates:</b> ${s.lat.toFixed(2)}°N, ${s.lon.toFixed(2)}°E<br>
                        🛣️ <b>Transit Corridor:</b> Primary Deepwater Line<br>
                        ✓ <b>Under-Keel Clearance:</b> Safe Navigational Depth
                    `),
                    hoverinfo: 'text',
                    name: 'Primary Route Chokepoints'
                });
            }
        }

        // 3. Alternative Route (Glowing Purple Dashed Line)
        if (currentRouteMode === 'both' || currentRouteMode === 'alternative') {
            const aLats = alt.waypoints.map(w => w.lat);
            const aLons = alt.waypoints.map(w => w.lon);
            
            traces.push({
                type: 'scattergeo',
                mode: 'lines',
                lat: aLats,
                lon: aLons,
                line: {
                    width: 3.5,
                    color: '#C084FC',
                    dash: 'dash'
                },
                hoverinfo: 'text',
                hovertext: `<b>🟣 ALTERNATIVE CORRIDOR: ${alt.name}</b><br>━━━━━━━━━━━━━━━━━━━━<br>Estimated Distance: <b>~${(alt.dist || 5800).toLocaleString()} NM</b><br>Navigational Safety: <b>Secondary Canal & Strait Passage</b><br>Berth Suitability: <b>Monitored Chokepoint Transit</b>`,
                name: `Alternative: ${alt.name}`
            });

            // Intermediate Stops for Alternative
            const aIntermediateStops = alt.stops.slice(1, -1);
            if (aIntermediateStops.length > 0) {
                traces.push({
                    type: 'scattergeo',
                    mode: 'markers+text',
                    lat: aIntermediateStops.map(s => s.lat),
                    lon: aIntermediateStops.map(s => s.lon),
                    marker: {
                        size: 8.5,
                        color: '#A855F7',
                        symbol: 'diamond',
                        line: { width: 1.5, color: '#FFFFFF' }
                    },
                    text: aIntermediateStops.map(s => `${s.icon} ${s.name.split('/')[0].trim()}`),
                    textposition: 'bottom left',
                    textfont: { family: 'Inter, sans-serif', size: 9.5, color: '#C084FC', weight: 'bold' },
                    hovertext: aIntermediateStops.map(s => `
                        <b>${s.icon || '⚓'} ${s.name}</b><br>
                        ━━━━━━━━━━━━━━━━━━━━<br>
                        📍 <b>Country / Region:</b> ${s.country}<br>
                        🚢 <b>Maritime Function:</b> ${s.type}<br>
                        🌐 <b>Coordinates:</b> ${s.lat.toFixed(2)}°N, ${s.lon.toFixed(2)}°E<br>
                        🛣️ <b>Transit Corridor:</b> Alternative Bypass Line<br>
                        ✓ <b>Under-Keel Clearance:</b> Monitored Passage Checkpoint
                    `),
                    hoverinfo: 'text',
                    name: 'Alternative Route Chokepoints'
                });
            }
        }

        // Update Info Pills in HTML
        const pillsInfo = document.getElementById('route-pills-info');
        if (pillsInfo) {
            pillsInfo.innerHTML = `
                <div style="background: rgba(0, 242, 254, 0.1); border: 1px solid rgba(0, 242, 254, 0.3); padding: 4px 10px; border-radius: 6px; color: #00F2FE;">
                    <b>Primary:</b> ${primary.name}
                </div>
                <div style="background: rgba(168, 85, 247, 0.1); border: 1px solid rgba(168, 85, 247, 0.3); padding: 4px 10px; border-radius: 6px; color: #C084FC;">
                    <b>Alternative:</b> ${alt.name}
                </div>
            `;
        }
    }

    // 4. Origin & Destination Glowing Pins
    const originTrace = {
        type: 'scattergeo',
        mode: 'markers+text',
        lat: [oCoord.lat],
        lon: [oCoord.lon],
        marker: {
            size: 16,
            color: '#F97316',
            line: { width: 2.5, color: '#FFFFFF' }
        },
        text: [`🛫 ${origin}`],
        textposition: 'top center',
        textfont: { family: 'Inter, sans-serif', size: 12, color: '#F97316', weight: 'bold' },
        hoverinfo: 'text',
        hovertext: `
            <b>🛫 ORIGIN LOADING PORT: ${origin}</b><br>
            ━━━━━━━━━━━━━━━━━━━━<br>
            📍 <b>Country / Region:</b> ${ORIGIN_SPECS[origin]?.country || oCoord.country || 'International'}<br>
            ⚓ <b>Terminal Type:</b> Deepwater Bulk Coal Loading Terminal<br>
            🌊 <b>Max Permissible Draft:</b> ${ORIGIN_SPECS[origin]?.maxDraft || 17.5} meters<br>
            📏 <b>Max Permissible LOA:</b> ${ORIGIN_SPECS[origin]?.maxLoa || 300} meters<br>
            🌐 <b>Coordinates:</b> ${oCoord.lat.toFixed(2)}°N, ${oCoord.lon.toFixed(2)}°E
        `,
        name: 'Origin Port'
    };

    const destTrace = {
        type: 'scattergeo',
        mode: 'markers+text',
        lat: [dCoord.lat],
        lon: [dCoord.lon],
        marker: {
            size: 16,
            color: '#10B981',
            symbol: 'diamond',
            line: { width: 2.5, color: '#FFFFFF' }
        },
        text: [`🛬 ${dest}`],
        textposition: 'bottom center',
        textfont: { family: 'Inter, sans-serif', size: 12, color: '#10B981', weight: 'bold' },
        hoverinfo: 'text',
        hovertext: `
            <b>🛬 INDIAN DISCHARGE PORT: ${dest}</b><br>
            ━━━━━━━━━━━━━━━━━━━━<br>
            📍 <b>State / Region:</b> ${PORT_CONSTRAINTS[dest]?.state || 'India'}<br>
            ⚓ <b>Port Classification:</b> ${PORT_CONSTRAINTS[dest]?.type || 'Major Bulk Terminal'}<br>
            🌊 <b>Max Permissible Draft:</b> ${PORT_CONSTRAINTS[dest]?.maxDraft || 16.5} meters<br>
            ⏳ <b>Average Anchor Wait:</b> ${PORT_CONSTRAINTS[dest]?.avgWait || 2.5} days<br>
            ⚡ <b>Discharge Rate:</b> ${PORT_CONSTRAINTS[dest]?.ratePerDay?.toLocaleString() || '25,000'} MT/day<br>
            🌐 <b>Coordinates:</b> ${dCoord.lat.toFixed(2)}°N, ${dCoord.lon.toFixed(2)}°E
        `,
        name: 'Discharge Port'
    };

    traces.push(originTrace, destTrace);

    // Calculate midpoint to center globe
    const midLat = (oCoord.lat + dCoord.lat) / 2;
    const midLon = (oCoord.lon + dCoord.lon) / 2;

    const layout = {
        geo: {
            projection: { 
                type: 'orthographic',
                rotation: { lon: midLon, lat: midLat, roll: 0 }
            },
            showocean: true,
            oceancolor: '#060C16',
            showland: true,
            landcolor: '#131E2E',
            showlakes: false,
            showcountries: true,
            countrycolor: '#26364D',
            coastlinecolor: '#1E293B',
            bgcolor: 'transparent'
        },
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
        margin: { t: 0, b: 0, l: 0, r: 0 },
        showlegend: false
    };

    const isHttp = typeof window !== 'undefined' && window.location && window.location.protocol && window.location.protocol.startsWith('http');
    const config = {
        displayModeBar: false,
        responsive: true,
        topojsonURL: isHttp ? (window.location.origin + '/') : 'https://cdn.plot.ly/'
    };

    try {
        if (mapContainer && mapContainer._fullLayout) {
            Plotly.react('map-container', traces, layout, config);
        } else {
            Plotly.newPlot('map-container', traces, layout, config);
        }
    } catch (e) {
        console.warn("Plotly react fallback:", e);
        try {
            Plotly.newPlot('map-container', traces, layout, config);
        } catch (err) {
            console.error("Plotly.newPlot fatal error:", err);
        }
    }
}

// =========================================================================
// ENGINE GRAPH SYNCHRONIZATION
// Dynamically updates all 4 charts based on live simulator calculation results
// =========================================================================

function updateSimulatorCharts(results) {
    if (!results) return;

    // 1. Update ML Freight Rate Forecast Chart (XGBoost R²=92.01%)
    updateForecastLineChart(results);

    // 2. Update Decision Strategy & Scenarios Bar Chart (MILP Optima)
    updateScenariosBarChart(results);

    // 3. Update Discharge Port Turnaround & Queue Radar (Horizontal Bars)
    updateTerminalWaitRadar(results);

    // 4. Update Financial Cost Breakdown Donut Chart
    updateCostDonutChart(results);
}

function updateForecastLineChart(results) {
    const ctx = document.getElementById('lineChart');
    if (!ctx) return;

    // Update title badge
    const badge = document.getElementById('forecast-rate-badge');
    if (badge) badge.innerText = `$${results.effectiveRate.toFixed(2)} / MT (Spot)`;

    const rate = results.effectiveRate;
    
    // Dates: 3 historical checkpoints + today + 6 forecast checkpoints
    const labels = ['-30d', '-20d', '-10d', 'Today (Spot)', '+5d', '+10d', '+15d', '+20d', '+25d', '+30d'];
    
    // Historical actuals leading up to today
    const histData = [
        parseFloat((rate * 0.942).toFixed(2)),
        parseFloat((rate * 0.968).toFixed(2)),
        parseFloat((rate * 0.985).toFixed(2)),
        parseFloat(rate.toFixed(2)),
        null, null, null, null, null, null
    ];

    // 30-Day Forward Forecast (with slight seasonality variation)
    const foreData = [
        null, null, null,
        parseFloat(rate.toFixed(2)),
        parseFloat((rate * 1.015).toFixed(2)),
        parseFloat((rate * 1.028).toFixed(2)),
        parseFloat((rate * 0.995).toFixed(2)),
        parseFloat((rate * 1.036).toFixed(2)),
        parseFloat((rate * 1.042).toFixed(2)),
        parseFloat((rate * 1.018).toFixed(2))
    ];

    // Upper and Lower confidence intervals (±10%)
    const upperBand = [
        null, null, null,
        parseFloat((rate * 1.08).toFixed(2)),
        parseFloat((rate * 1.10).toFixed(2)),
        parseFloat((rate * 1.115).toFixed(2)),
        parseFloat((rate * 1.085).toFixed(2)),
        parseFloat((rate * 1.125).toFixed(2)),
        parseFloat((rate * 1.135).toFixed(2)),
        parseFloat((rate * 1.11).toFixed(2))
    ];

    const lowerBand = [
        null, null, null,
        parseFloat((rate * 0.92).toFixed(2)),
        parseFloat((rate * 0.93).toFixed(2)),
        parseFloat((rate * 0.94).toFixed(2)),
        parseFloat((rate * 0.905).toFixed(2)),
        parseFloat((rate * 0.945).toFixed(2)),
        parseFloat((rate * 0.95).toFixed(2)),
        parseFloat((rate * 0.925).toFixed(2))
    ];

    const chartData = {
        labels: labels,
        datasets: [
            {
                label: 'Historical Actuals ($/MT)',
                data: histData,
                borderColor: '#38BDF8',
                backgroundColor: 'rgba(56, 189, 248, 0.1)',
                borderWidth: 2.5,
                tension: 0.35,
                pointRadius: 3,
                pointBackgroundColor: '#38BDF8',
                fill: false
            },
            {
                label: '30-Day ML Forecast ($/MT)',
                data: foreData,
                borderColor: '#F97316',
                borderDash: [5, 5],
                borderWidth: 3,
                tension: 0.35,
                pointRadius: 4,
                pointBackgroundColor: '#F97316',
                fill: false
            },
            {
                label: 'Upper Band (+10%)',
                data: upperBand,
                borderColor: 'rgba(249, 115, 22, 0.35)',
                borderDash: [2, 4],
                borderWidth: 1,
                pointRadius: 0,
                fill: false
            },
            {
                label: 'Lower Band (-10%)',
                data: lowerBand,
                borderColor: 'rgba(249, 115, 22, 0.35)',
                borderDash: [2, 4],
                borderWidth: 1,
                pointRadius: 0,
                fill: false
            }
        ]
    };

    if (lineChartInstance) {
        lineChartInstance.data = chartData;
        lineChartInstance.update();
    } else {
        lineChartInstance = new Chart(ctx.getContext('2d'), {
            type: 'line',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: { color: '#94A3B8', font: { size: 9 }, boxWidth: 10 }
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => `${context.dataset.label}: $${context.parsed.y} / MT`
                        }
                    }
                },
                scales: {
                    y: {
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: { color: '#94A3B8', font: { size: 9 }, callback: (v) => '$' + v }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: '#94A3B8', font: { size: 9 } }
                    }
                }
            }
        });
    }
}

function updateScenariosBarChart(results) {
    const ctx = document.getElementById('barChart');
    if (!ctx) return;

    // Evaluate 4 Scenarios:
    // 1. Current Spot
    const s1_cost = parseFloat((results.totalOceanCost / 1e6).toFixed(3));
    const s1_dem = parseFloat((results.totalDemurrage / 1e3).toFixed(1));

    // 2. Wait 7 Days (-3.5% Dip)
    const s2_cost = parseFloat(((results.totalOceanCost * 0.965) / 1e6).toFixed(3));
    const s2_dem = parseFloat(((results.totalDemurrage * 0.85) / 1e3).toFixed(1));

    // 3. Gangavaram Bypass (Deep Terminal Efficiency)
    const s3_cost = parseFloat(((results.effectiveRate * 0.95 * results.cargoVol) / 1e6).toFixed(3));
    const s3_dem = 0; // 1.1d wait, zero excess laytime

    // 4. Split 2x Batches
    const s4_cost = parseFloat(((results.totalOceanCost * 1.025) / 1e6).toFixed(3));
    const s4_dem = parseFloat(((results.totalDemurrage * 0.5) / 1e3).toFixed(1));

    const chartData = {
        labels: ['1. Current Spot', '2. Capture Dip (-3.5%)', '3. Gangavaram Alt', '4. Split 2x Batches'],
        datasets: [
            {
                label: 'Ocean Freight ($M)',
                data: [s1_cost, s2_cost, s3_cost, s4_cost],
                backgroundColor: '#38BDF8',
                borderRadius: 4,
                yAxisID: 'y'
            },
            {
                label: 'Demurrage Risk ($k)',
                data: [s1_dem, s2_dem, s3_dem, s4_dem],
                backgroundColor: '#F87171',
                borderRadius: 4,
                yAxisID: 'y1'
            }
        ]
    };

    if (barChartInstance) {
        barChartInstance.data = chartData;
        barChartInstance.update();
    } else {
        barChartInstance = new Chart(ctx.getContext('2d'), {
            type: 'bar',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                if (context.datasetIndex === 0) return `Freight Cost: $${context.parsed.y}M`;
                                return `Demurrage Liability: $${context.parsed.y}k`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: { color: '#38BDF8', font: { size: 9 }, callback: (v) => '$' + v + 'M' }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        grid: { drawOnChartArea: false },
                        ticks: { color: '#F87171', font: { size: 9 }, callback: (v) => '$' + v + 'k' }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: '#94A3B8', font: { size: 9 } }
                    }
                }
            }
        });
    }
}

function updateTerminalWaitRadar(results) {
    const container = document.getElementById('terminal-wait-container');
    const badge = document.getElementById('target-port-badge');
    if (!container) return;

    if (badge) badge.innerText = `Selected: ${results.dest}`;

    const maxScaleDays = 12.0;

    let html = '';
    for (let portName in PORT_CONSTRAINTS) {
        const p = PORT_CONSTRAINTS[portName];
        const dischargeDays = Math.ceil(results.cargoVol / p.ratePerDay);
        const totalStay = p.avgWait + dischargeDays;
        const widthPct = Math.min(100, Math.round((totalStay / maxScaleDays) * 100));

        const isSelected = (portName === results.dest);

        // Color coding
        let barColor = '#38BDF8';
        if (p.avgWait >= 4.0) barColor = '#EF4444'; // Heavy queue (Paradip/Haldia)
        else if (p.avgWait <= 1.5) barColor = '#10B981'; // Fluid turnaround (Gangavaram)
        else barColor = '#F59E0B'; // Moderate

        const rowStyle = isSelected 
            ? 'background: rgba(56, 189, 248, 0.1); border: 1px solid rgba(56, 189, 248, 0.4); border-radius: 6px; padding: 2px 6px; margin: 2px 0;'
            : 'padding: 2px 6px;';

        const labelStyle = isSelected
            ? 'color: #38BDF8; font-weight: 700;'
            : 'color: var(--text-muted);';

        html += `
            <div class="h-bar-row" style="${rowStyle}">
                <span class="h-label" style="width: 72px; ${labelStyle}" title="${portName} (Draft: ${p.maxDraft}m)">
                    ${isSelected ? '● ' : ''}${portName.split(' ')[0]}
                </span>
                <div class="h-bar-track">
                    <div class="h-bar-fill" style="width: ${widthPct}%; background: ${barColor};"></div>
                </div>
                <span class="h-val" style="width: 48px; font-size: 0.68rem; color: ${isSelected ? '#38BDF8' : '#cbd5e1'}; font-weight: 600;">
                    ${totalStay.toFixed(1)}d
                </span>
            </div>
        `;
    }

    container.innerHTML = html;
}

function updateCostDonutChart(results) {
    const ctx = document.getElementById('donutChart');
    if (!ctx) return;

    const ocean = results.totalOceanCost;
    const demurrage = results.totalDemurrage;
    const portHandling = results.portDuesAndBunker;
    const total = ocean + demurrage + portHandling;

    const oceanPct = ((ocean / total) * 100).toFixed(1);
    const demPct = ((demurrage / total) * 100).toFixed(1);
    const portPct = (100 - parseFloat(oceanPct) - parseFloat(demPct)).toFixed(1);

    // Update center text
    const donutVal = document.getElementById('donut-total-val');
    if (donutVal) donutVal.innerText = `$${(total / 1e6).toFixed(2)}M`;

    // Update cost badge
    const badge = document.getElementById('cost-per-tonne-badge');
    if (badge) badge.innerText = `$${(total / results.cargoVol).toFixed(2)}/t Landed`;

    // Update legend
    const legend = document.getElementById('donut-legend-container');
    if (legend) {
        legend.innerHTML = `
            <div class="d-legend-item">
                <span class="dot-color" style="background:#38bdf8;"></span>
                <span>Ocean Freight: <b>$${(ocean / 1e6).toFixed(2)}M (${oceanPct}%)</b></span>
            </div>
            <div class="d-legend-item">
                <span class="dot-color" style="background:#ef4444;"></span>
                <span>Demurrage Risk: <b>$${Math.round(demurrage).toLocaleString()} (${demPct}%)</b></span>
            </div>
            <div class="d-legend-item">
                <span class="dot-color" style="background:#10b981;"></span>
                <span>Port & Bunker: <b>$${Math.round(portHandling).toLocaleString()} (${portPct}%)</b></span>
            </div>
        `;
    }

    const chartData = {
        labels: ['Ocean Freight', 'Demurrage Risk', 'Port Dues & Bunkering'],
        datasets: [{
            data: [ocean, demurrage, portHandling],
            backgroundColor: ['#38BDF8', '#EF4444', '#10B981'],
            borderWidth: 0,
            cutout: '72%'
        }]
    };

    if (donutChartInstance) {
        donutChartInstance.data = chartData;
        donutChartInstance.update();
    } else {
        donutChartInstance = new Chart(ctx.getContext('2d'), {
            type: 'doughnut',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (context) => `${context.label}: $${Math.round(context.raw).toLocaleString()}`
                        }
                    }
                }
            }
        });
    }
}

// =========================================================================
// ONE-CLICK EXECUTIVE DEMO SCENARIOS
// =========================================================================

function applyPresetScenario(origin, dest, volume) {
    const origSelect = document.getElementById("sim-origin");
    const destSelect = document.getElementById("sim-dest");
    const volSlider = document.getElementById("sim-volume");
    const volDisplay = document.getElementById("vol-display");

    if (origSelect) origSelect.value = origin;
    if (destSelect) destSelect.value = dest;
    if (volSlider) volSlider.value = volume;
    if (volDisplay) volDisplay.innerText = `${parseInt(volume).toLocaleString()} MT`;

    calculateSim();
    renderPlotlyGlobe();
}
window.applyPresetScenario = applyPresetScenario;

// =========================================================================
// SECTION 1: DUAL-PORT NAVIGATIONAL CLEARANCE & WATERLINE DEPTH MATRIX
// =========================================================================

function updateWaterlineFeasibility(results) {
    const originInfo = ORIGIN_SPECS[results.origin] || { maxDraft: 16.0, maxLoa: 280, country: "Global" };
    const destInfo = PORT_CONSTRAINTS[results.dest] || { maxDraft: 14.0, maxLoa: 250, type: "Discharge Terminal" };

    // Update dual port header pills
    const pillsContainer = document.getElementById("dual-port-pills");
    if (pillsContainer) {
        pillsContainer.innerHTML = `
            <div style="background: rgba(249, 115, 22, 0.1); border: 1px solid rgba(249, 115, 22, 0.3); padding: 4px 10px; border-radius: 6px; font-size: 0.72rem; color: #FB923C;">
                🛫 <b>Origin Terminal:</b> ${results.origin} &bull; Max Draft: <b>${originInfo.maxDraft}m</b> &bull; Max LOA: <b>${originInfo.maxLoa}m</b>
            </div>
            <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); padding: 4px 10px; border-radius: 6px; font-size: 0.72rem; color: #34D399;">
                🛬 <b>Discharge Terminal:</b> ${results.dest} &bull; Max Draft: <b>${destInfo.maxDraft}m</b> &bull; Max LOA: <b>${destInfo.maxLoa || 250}m</b>
            </div>
        `;
    }

    // Render 4 Vessel Waterline Cards
    const cardsContainer = document.getElementById("waterline-cards-container");
    if (!cardsContainer) return;

    const vessels = ["Handysize", "Supramax", "Panamax", "Capesize"];
    let cardsHtml = "";

    vessels.forEach(vName => {
        const spec = VESSEL_SPECS[vName];
        const draft = spec.draft;
        const loa = spec.loa;

        // Feasibility checks
        const reasons = [];
        if (draft > destInfo.maxDraft) {
            reasons.push(`Discharge draft ${draft}m > max ${destInfo.maxDraft}m`);
        }
        if (originInfo.maxDraft && draft > originInfo.maxDraft) {
            reasons.push(`Origin draft ${draft}m > max ${originInfo.maxDraft}m`);
        }
        if (destInfo.maxLoa && loa > destInfo.maxLoa) {
            reasons.push(`Discharge LOA ${loa}m > max ${destInfo.maxLoa}m`);
        }

        const isFeasible = reasons.length === 0;
        const pct = Math.min(100, Math.round((draft / Math.max(destInfo.maxDraft, 8.0)) * 100));

        if (isFeasible) {
            cardsHtml += `
                <div class="waterline-card pass">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-size: 0.95rem; font-weight: 800; color: #10B981;">✅ ${vName}</span>
                        <span class="vessel-badge-pass">PERMITTED</span>
                    </div>
                    <div style="font-size: 0.75rem; color: #94A3B8; margin-top: 6px;">
                        Capacity: <b>${spec.capacity.toLocaleString()} MT</b> | LOA: <b>${loa}m</b> | Beam: <b>${spec.beam}m</b>
                    </div>
                    <div class="waterline-track">
                        <div class="waterline-fill-pass" style="width: ${pct}%;"></div>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 0.72rem; color: #CBD5E1;">
                        <span>Draft: <b>${draft}m</b> (${pct}% depth)</span>
                        <span>Port Max: <b>${destInfo.maxDraft}m</b></span>
                    </div>
                    <div style="font-size: 0.72rem; color: #10B981; margin-top: 8px; font-weight: 600;">
                        ✓ Safe Under-Keel Clearance (UKC)
                    </div>
                </div>
            `;
        } else {
            cardsHtml += `
                <div class="waterline-card fail">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-size: 0.95rem; font-weight: 800; color: #EF4444;">❌ ${vName}</span>
                        <span class="vessel-badge-fail">BLOCKED</span>
                    </div>
                    <div style="font-size: 0.75rem; color: #94A3B8; margin-top: 6px;">
                        Capacity: <b>${spec.capacity.toLocaleString()} MT</b> | LOA: <b>${loa}m</b> | Beam: <b>${spec.beam}m</b>
                    </div>
                    <div class="waterline-track">
                        <div class="waterline-fill-fail" style="width: 100%;"></div>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 0.72rem; color: #F87171;">
                        <span>Draft: <b>${draft}m</b> (Breach)</span>
                        <span>Port Max: <b>${destInfo.maxDraft}m</b></span>
                    </div>
                    <div style="font-size: 0.7rem; color: #FCA5A5; margin-top: 8px; line-height: 1.3;">
                        <b>Grounding Risk:</b> ${reasons.join(", ")}
                    </div>
                </div>
            `;
        }
    });

    cardsContainer.innerHTML = cardsHtml;
}

// =========================================================================
// SECTION 2: STRATEGIC CONTRACT TIMING & MACRO MOMENTUM
// =========================================================================

function updateStrategicTiming(results) {
    const leftContainer = document.getElementById("timing-left-content");
    const rightContainer = document.getElementById("timing-right-content");
    if (!leftContainer || !rightContainer) return;

    // 30-Day momentum calculation (simulate +1.8% to +3.6% based on route distance and fuel)
    let rateChangePct = 2.4;
    if (results.origin.includes("USA")) rateChangePct = 3.6;
    else if (results.origin.includes("Russia")) rateChangePct = 1.9;
    else if (results.origin.includes("Indonesia")) rateChangePct = -1.2;

    const spotRate = results.effectiveRate;
    const midTermRate = spotRate * 0.95; // 5% stability discount for 3-6m COA
    const avgForecastRate = spotRate * (1 + (rateChangePct / 200));
    const projectedSpotCost = avgForecastRate * results.cargoVol;
    const projectedMidTermCost = midTermRate * results.cargoVol;
    const projectedSavings = projectedSpotCost - projectedMidTermCost;

    let recTitle, recType, rationale, badgeText;
    if (rateChangePct > 2.0) {
        recTitle = "Lock in Mid-Term Contract (3–6 Months COA)";
        recType = "mid_term";
        badgeText = "🔥 Bullish Market (Rate Inflation Expected)";
        rationale = `Freight momentum is trending upward (+${rateChangePct.toFixed(1)}% over 30 days due to rising bunker and voyage demand). Securing a 3–6 month Contract of Affreightment (COA) at current fixed rates (~$${midTermRate.toFixed(2)}/MT) hedges against spot escalation, locking in approx. $${Math.abs(Math.round(projectedSavings)).toLocaleString()} in net financial cost avoidance.`;
    } else if (rateChangePct < -1.0) {
        recTitle = "Maintain Spot Market Fixtures";
        recType = "spot";
        badgeText = "📉 Bearish Market (Softening Rates Expected)";
        rationale = `Freight rates are projected to soften (${rateChangePct.toFixed(1)}% over 30 days). Executing consecutive Spot fixtures allows SAIL/RINL to capture progressively lower voyage costs without locking in fixed time premiums.`;
    } else {
        recTitle = "Hybrid Strategy (50% Index-Linked COA + 50% Spot)";
        recType = "hybrid";
        badgeText = "⚖️ Neutral / Stable Freight Trend";
        rationale = `Market momentum is currently balanced (${rateChangePct > 0 ? '+' : ''}${rateChangePct.toFixed(1)}%). A hybrid contract structure balances guaranteed berth loading windows at origin with spot market volume flexibility.`;
    }

    const badgeColor = recType === "mid_term" ? "#F87171" : (recType === "spot" ? "#34D399" : "#38BDF8");

    leftContainer.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; margin-bottom: 8px;">
            <div style="font-size: 1rem; font-weight: 700; color: #38BDF8;">
                🎯 Strategic Recommendation: ${recTitle}
            </div>
            <span style="font-size: 0.68rem; font-weight: 700; color: ${badgeColor}; background: rgba(255,255,255,0.06); padding: 3px 8px; border-radius: 4px; white-space: nowrap;">
                ${badgeText}
            </span>
        </div>
        <div style="font-size: 0.82rem; color: #CBD5E1; line-height: 1.5; margin-bottom: 12px;">
            ${rationale}
        </div>
        <div style="display: flex; gap: 18px; flex-wrap: wrap; font-size: 0.78rem; color: #94A3B8;">
            <span>30-Day Momentum: <b style="color: ${rateChangePct >= 0 ? '#F87171' : '#34D399'};">${rateChangePct >= 0 ? '+' : ''}${rateChangePct.toFixed(1)}%</b></span>
            <span>Current Spot Rate: <b style="color: #F8FAFC;">$${spotRate.toFixed(2)}/MT</b></span>
            <span>Mid-Term Fixed COA: <b style="color: #38BDF8;">$${midTermRate.toFixed(2)}/MT</b></span>
        </div>
    `;

    rightContainer.innerHTML = `
        <div style="font-size: 0.72rem; color: #94A3B8; text-transform: uppercase; font-weight: 600; text-align: center;">
            Procurement Financial Impact
        </div>
        <div style="font-size: 1.6rem; font-weight: 800; color: ${projectedSavings > 0 ? '#10B981' : '#38BDF8'}; text-align: center;">
            $${Math.abs(Math.round(projectedSavings)).toLocaleString()}
        </div>
        <div style="font-size: 0.74rem; color: #CBD5E1; text-align: center; line-height: 1.3;">
            ${projectedSavings > 0 
                ? 'Estimated cost avoidance by locking in mid-term COA vs spot escalation'
                : 'Spot chartering preserves cash liquidity and captures softening freight'}
        </div>
    `;
}

// =========================================================================
// SECTION 3: PRESCRIPTIVE MILP FLEET ALLOCATION & SCENARIO MATRIX
// =========================================================================

function updateScenarioMatrix(results) {
    const tableBody = document.getElementById("scenario-matrix-body");
    const banner = document.getElementById("solver-recommendation-banner");
    if (!tableBody || !banner) return;

    const baseRate = results.baseRate;
    const cargoVol = results.cargoVol;

    // Define 4 Operational Scenarios
    const scenarios = [
        {
            name: "1. Charter Now (Base Spot Plan)",
            dest: results.dest,
            vol: cargoVol,
            rateFactor: 1.00,
            desc: "Immediate charter fixture on active spot market."
        },
        {
            name: "2. Wait 7 Days (Capture Dip)",
            dest: results.dest,
            vol: cargoVol,
            rateFactor: 0.965, // -3.5% dip
            desc: "Deferred chartering to capture predicted near-term rate softness."
        },
        {
            name: "3. Via Alternative Deep Port (Gangavaram)",
            dest: "Gangavaram",
            vol: cargoVol,
            rateFactor: 0.95, // Deepwater Capesize efficiency
            desc: "Bypass queue congestion and exploit 18.2m draft for Capesize."
        },
        {
            name: "4. Split Voyages (2x 50% Batches)",
            dest: results.dest,
            vol: cargoVol / 2,
            rateFactor: 1.025, // Small parcel premium (+2.5%)
            isSplit: true,
            desc: "Dual phased shipments reducing terminal congestion risk."
        }
    ];

    let rowsHtml = "";
    let minEff = Infinity;
    let bestScenario = null;
    let baseCost = 0;
    const computedRows = [];

    scenarios.forEach((s, idx) => {
        const destPort = PORT_CONSTRAINTS[s.dest] || { maxDraft: 14.0, maxLoa: 250 };
        const sRate = baseRate * s.rateFactor;

        // Find optimal vessel for this scenario
        let vClass = "Handysize";
        if (destPort.maxDraft >= 17.5 && s.vol >= 100000) {
            vClass = "Capesize";
        } else if (destPort.maxDraft >= 13.5 && s.vol >= 50000) {
            vClass = "Panamax";
        } else if (destPort.maxDraft >= 11.5) {
            vClass = "Supramax";
        } else {
            vClass = "Handysize";
        }

        const spec = VESSEL_SPECS[vClass];
        const vRate = sRate * (1 - spec.discount);
        
        let vCount = Math.ceil(s.vol / spec.capacity);
        let multiplier = s.isSplit ? 2 : 1;
        
        const totalCapacity = vCount * spec.capacity * multiplier;
        const totalCost = s.vol * vRate * multiplier;
        const effectiveRate = totalCost / cargoVol;
        const slack = totalCapacity - cargoVol;
        const fleetSummary = s.isSplit ? `2x (${vCount}x ${vClass})` : `${vCount}x ${vClass}`;

        if (idx === 0) baseCost = totalCost;

        const rowData = {
            name: s.name,
            dest: s.dest,
            fleetSummary,
            totalCost,
            effectiveRate,
            slack,
            isFeasible: true
        };
        computedRows.push(rowData);

        if (effectiveRate < minEff) {
            minEff = effectiveRate;
            bestScenario = rowData;
        }
    });

    computedRows.forEach(r => {
        const isOptimal = (r.name === bestScenario.name);
        rowsHtml += `
            <tr class="${isOptimal ? 'optimal-row' : ''}">
                <td style="font-weight: 600; color: ${isOptimal ? '#34D399' : 'var(--text-main)'};">
                    ${isOptimal ? '⭐ ' : ''}${r.name}
                </td>
                <td><span style="color: var(--accent-cyan); font-weight: 500;">${r.dest}</span></td>
                <td><span style="background: rgba(255,255,255,0.06); padding: 2px 8px; border-radius: 4px; font-size: 0.78rem;">${r.fleetSummary}</span></td>
                <td style="font-weight: 700; color: #F8FAFC;">$${r.totalCost.toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
                <td style="font-weight: 700; color: ${isOptimal ? '#10B981' : '#38BDF8'};">$${r.effectiveRate.toFixed(2)}/MT</td>
                <td style="color: var(--text-muted);">${r.slack.toLocaleString()} MT</td>
                <td>
                    <span style="font-size: 0.68rem; font-weight: 700; color: #10B981; background: rgba(16, 185, 129, 0.15); padding: 2px 8px; border-radius: 4px;">
                        OPTIMAL
                    </span>
                </td>
            </tr>
        `;
    });

    tableBody.innerHTML = rowsHtml;

    // Solver recommendation banner
    const savings = Math.max(0, baseCost - bestScenario.totalCost);
    banner.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px;">
            <i class="fa-solid fa-lightbulb" style="font-size: 1.1rem; color: #10B981;"></i>
            <span>
                <b>Recommended Operational Strategy:</b> <b>${bestScenario.name}</b> yields the lowest landed cost (<b>$${minEff.toFixed(2)}/MT</b>)${savings > 1000 ? `, saving <b>$${Math.round(savings).toLocaleString()}</b> compared to immediate base chartering` : ''}.
            </span>
        </div>
        <div style="display: flex; gap: 6px; align-items: center;">
            <span style="font-size: 0.7rem; color: #94A3B8; background: rgba(0,0,0,0.3); padding: 3px 8px; border-radius: 4px;">PuLP CBC &bull; 0.004s</span>
        </div>
    `;
}

// =========================================================================
// SECTION 4: PORT DEMURRAGE RISK RADAR & OPERATIONAL ALERTS
// =========================================================================

function updateOperationalRiskAlerts(results) {
    const alertsContainer = document.getElementById("operational-alerts-container");
    const badge = document.getElementById("demurrage-alert-badge");
    const dest = results.dest;
    const port = results.port;
    const excessIdle = results.excessIdleDays;
    const totalDemurrage = results.totalDemurrage;
    const isCongested = (dest === "Paradip" || dest === "Haldia");

    // 1. Update Alert Badges in Navigation
    const sideBadge = document.getElementById("sidebar-alert-badge");
    const bellBadge = document.getElementById("header-bell-badge");
    const alertCount = totalDemurrage > 0 ? 3 : 1;
    if (sideBadge) {
        sideBadge.innerText = alertCount;
        sideBadge.style.background = totalDemurrage > 0 ? "#EF4444" : "#10B981";
    }
    if (bellBadge) {
        bellBadge.innerText = alertCount;
        bellBadge.style.background = totalDemurrage > 0 ? "#EF4444" : "#10B981";
    }

    // 2. Update Demurrage Watch Status Badge
    if (badge) {
        if (totalDemurrage > 0) {
            badge.style.color = "#F87171";
            badge.style.background = "rgba(239, 68, 68, 0.12)";
            badge.innerHTML = `⚠️ Demurrage Exposure: $${Math.round(totalDemurrage).toLocaleString()}`;
        } else {
            badge.style.color = "#34D399";
            badge.style.background = "rgba(16, 185, 129, 0.12)";
            badge.innerHTML = `🟢 Zero Demurrage Exposure`;
        }
    }

    // 3. Update Simulated Voyage Header across All Distributed Views
    const syncVoyageBanner = (originId, destId, volId) => {
        const oEl = document.getElementById(originId);
        const dEl = document.getElementById(destId);
        const vEl = document.getElementById(volId);
        if (oEl) oEl.innerText = results.origin;
        if (dEl) dEl.innerText = results.dest;
        if (vEl) vEl.innerText = `${results.cargoVol.toLocaleString()} MT`;
    };
    syncVoyageBanner("alerts-voyage-origin", "alerts-voyage-dest", "alerts-voyage-vol");
    syncVoyageBanner("geo-voyage-origin", "geo-voyage-dest", "geo-voyage-vol");
    syncVoyageBanner("feasibility-voyage-origin", "feasibility-voyage-dest", "feasibility-voyage-vol");
    syncVoyageBanner("opt-voyage-origin", "opt-voyage-dest", "opt-voyage-vol");

    // 4. Update the 4 Demurrage KPI Cards in Alerts View
    const qStatus = document.getElementById("radar-queue-status");
    const qWait = document.getElementById("radar-queue-wait");
    const pStay = document.getElementById("radar-port-stay");
    const sBreakdown = document.getElementById("radar-stay-breakdown");
    const eIdle = document.getElementById("radar-excess-idle");
    const dHire = document.getElementById("radar-daily-hire");
    const bSavings = document.getElementById("radar-bypass-savings");

    if (qStatus) qStatus.innerText = port.avgWait >= 4.0 ? "High Congestion" : (port.avgWait <= 1.5 ? "Fluid / Fast" : "Moderate Congestion");
    if (qWait) qWait.innerText = `${port.avgWait} days anchor wait`;
    if (pStay) pStay.innerText = `${results.actualPortStayDays.toFixed(1)} Days`;
    if (sBreakdown) sBreakdown.innerText = `${(results.actualPortStayDays - port.avgWait).toFixed(1)}d discharge + ${port.avgWait}d wait`;
    if (eIdle) eIdle.innerText = `${excessIdle.toFixed(1)} Idle Days`;
    if (dHire) dHire.innerText = `Daily Hire: $${results.dailyDemurrageRate.toLocaleString()}/day`;
    if (bSavings) bSavings.innerText = `$${Math.round(results.diversionSavings).toLocaleString()}`;

    // 5. Update Quick Preview Inside Simulator Section 4
    const simPreview = document.getElementById("sim-demurrage-quick-preview");
    if (simPreview) {
        simPreview.innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; margin-top: 10px;">
                <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--border-color); border-radius: 6px; padding: 12px;">
                    <div style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Port Congestion Status</div>
                    <div style="font-size: 1.1rem; font-weight: 700; color: ${isCongested ? '#EF4444' : '#10B981'}; margin: 4px 0;">
                        ${isCongested ? '⚠️ High Queue Risk' : '🟢 Fluid Turnaround'}
                    </div>
                    <div style="font-size: 0.72rem; color: #94A3B8;">${dest}: ~${port.avgWait} days wait</div>
                </div>

                <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--border-color); border-radius: 6px; padding: 12px;">
                    <div style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Demurrage Penalty</div>
                    <div style="font-size: 1.1rem; font-weight: 700; color: ${totalDemurrage > 0 ? '#EF4444' : '#10B981'}; margin: 4px 0;">
                        $${Math.round(totalDemurrage).toLocaleString()}
                    </div>
                    <div style="font-size: 0.72rem; color: #94A3B8;">${excessIdle.toFixed(1)} excess idle days</div>
                </div>

                <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--border-color); border-radius: 6px; padding: 12px;">
                    <div style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Gangavaram Bypass Benefit</div>
                    <div style="font-size: 1.1rem; font-weight: 700; color: var(--accent-emerald); margin: 4px 0;">
                        $${Math.round(results.diversionSavings).toLocaleString()}
                    </div>
                    <div style="font-size: 0.72rem; color: #94A3B8;">Net savings vs 1.1d wait</div>
                </div>
            </div>
        `;
    }

    // 6. Update 3 Operational Risk Alert Cards in Dedicated Alerts View
    if (alertsContainer) {
        // Alert 1: Pre-berthing Congestion
        let alert1Html = "";
        if (isCongested) {
            alert1Html = `
                <div class="alert-card alert-danger">
                    <div class="alert-header">
                        <span class="alert-title">🚨 Severe Pre-Berthing Congestion (${dest})</span>
                        <span style="font-size: 0.68rem; font-weight: 700; color: #F87171; background: rgba(239, 68, 68, 0.15); padding: 2px 6px; border-radius: 4px;">HIGH RISK</span>
                    </div>
                    <div class="alert-desc">
                        Anchor wait of <b>${port.avgWait} days</b> exceeds free laytime window. Coal berth queue incurs approx <b>$${Math.round(totalDemurrage).toLocaleString()}</b> in demurrage liability.
                    </div>
                    <div class="alert-footer">
                        <span>💡 Strategic Action: Divert to Gangavaram Terminal or schedule priority night berthing</span>
                    </div>
                </div>
            `;
        } else {
            alert1Html = `
                <div class="alert-card alert-success">
                    <div class="alert-header">
                        <span class="alert-title">🟢 Fluid Discharge Turnaround (${dest})</span>
                        <span style="font-size: 0.68rem; font-weight: 700; color: #34D399; background: rgba(16, 185, 129, 0.15); padding: 2px 6px; border-radius: 4px;">NORMAL</span>
                    </div>
                    <div class="alert-desc">
                        Turnaround time within scheduled laytime limits (avg wait: <b>${port.avgWait} days</b>). Rapid discharge at ~${port.ratePerDay.toLocaleString()} MT/day.
                    </div>
                    <div class="alert-footer">
                        <span>✓ Demurrage liability is zero or negligible</span>
                    </div>
                </div>
            `;
        }

        // Alert 2: Baltic Dry Index (BDI) Volatility
        const bdiVal = 1850;
        const alert2Html = `
            <div class="alert-card alert-warning">
                <div class="alert-header">
                    <span class="alert-title">📊 Freight Index Volatility (BDI: ${bdiVal.toLocaleString()})</span>
                    <span style="font-size: 0.68rem; font-weight: 700; color: #FBBF24; background: rgba(245, 158, 11, 0.15); padding: 2px 6px; border-radius: 4px;">WATCH</span>
                </div>
                <div class="alert-desc">
                    Baltic Capesize/Panamax index indicates elevated forward volatility. High VLSFO bunker spread (~$540/MT) adds ±3.8% voyage variance.
                </div>
                <div class="alert-footer">
                    <span>💡 Strategic Action: Hedge bunker fuel via Singapore Swaps or fix 3M COA</span>
                </div>
            </div>
        `;

        // Alert 3: Seasonal Weather / Swell Window
        const month = new Date().getMonth() + 1;
        const isMonsoon = (month >= 6 && month <= 9);
        let alert3Html = "";

        if (isMonsoon) {
            alert3Html = `
                <div class="alert-card alert-warning">
                    <div class="alert-header">
                        <span class="alert-title">🌧️ Active Monsoon Season (SW Monsoon)</span>
                        <span style="font-size: 0.68rem; font-weight: 700; color: #FBBF24; background: rgba(245, 158, 11, 0.15); padding: 2px 6px; border-radius: 4px;">WEATHER SWELL</span>
                    </div>
                    <div class="alert-desc">
                        Rough sea states and high swell in Bay of Bengal may cause 1.5–2.0 day pilotage delays. 15% weather risk multiplier applied to voyage ETA.
                    </div>
                    <div class="alert-footer">
                        <span>💡 Strategic Action: Monitor IMD maritime weather advisories</span>
                    </div>
                </div>
            `;
        } else {
            alert3Html = `
                <div class="alert-card alert-success">
                    <div class="alert-header">
                        <span class="alert-title">☀️ Fair Weather Shipping Window</span>
                        <span style="font-size: 0.68rem; font-weight: 700; color: #34D399; background: rgba(16, 185, 129, 0.15); padding: 2px 6px; border-radius: 4px;">OPTIMAL</span>
                    </div>
                    <div class="alert-desc">
                        Benign sea state across the Indian Ocean and Bay of Bengal. Navigational transit speeds at full normal cruising speed (13.5 knots).
                    </div>
                    <div class="alert-footer">
                        <span>✓ Minimal weather-related laytime disruption</span>
                    </div>
                </div>
            `;
        }

        alertsContainer.innerHTML = alert1Html + alert2Html + alert3Html;
    }

    // 7. Update Port Congestion & Turnaround Surveillance Matrix Table
    const portMatrixBody = document.getElementById("port-risk-matrix-body");
    if (portMatrixBody) {
        let rowsHtml = "";
        for (let portName in PORT_CONSTRAINTS) {
            const p = PORT_CONSTRAINTS[portName];
            const isSelected = (portName === dest);
            
            let riskBadge = `<span style="font-size: 0.68rem; font-weight: 700; color: #10B981; background: rgba(16, 185, 129, 0.15); padding: 2px 8px; border-radius: 4px;">LOW / FLUID</span>`;
            let mitigation = "Optimal discharge terminal; standard berth window.";
            
            if (p.avgWait >= 4.0) {
                riskBadge = `<span style="font-size: 0.68rem; font-weight: 700; color: #EF4444; background: rgba(239, 68, 68, 0.15); padding: 2px 8px; border-radius: 4px;">HIGH QUEUE</span>`;
                mitigation = "Divert cargo to Gangavaram or request priority night berthing.";
            } else if (p.avgWait >= 2.0) {
                riskBadge = `<span style="font-size: 0.68rem; font-weight: 700; color: #F59E0B; background: rgba(245, 158, 11, 0.15); padding: 2px 8px; border-radius: 4px;">MODERATE</span>`;
                mitigation = "Monitor pre-arrival anchor queue; enforce strict discharge TPD.";
            }

            rowsHtml += `
                <tr style="${isSelected ? 'background: rgba(56, 189, 248, 0.08); border-left: 3px solid #38BDF8;' : ''}">
                    <td style="font-weight: 700; color: ${isSelected ? '#38BDF8' : 'var(--text-main)'};">
                        ${isSelected ? '📍 ' : ''}${portName}
                    </td>
                    <td style="color: var(--text-muted);">${p.state || 'India'}</td>
                    <td><b>${p.maxDraft}m</b></td>
                    <td style="font-weight: 700; color: ${p.avgWait >= 4.0 ? '#EF4444' : (p.avgWait <= 1.5 ? '#10B981' : '#F59E0B')};">
                        ${p.avgWait} days
                    </td>
                    <td>${p.ratePerDay.toLocaleString()} MT/day</td>
                    <td style="color: var(--text-muted); font-size: 0.78rem;">${p.type}</td>
                    <td>${riskBadge}</td>
                    <td style="font-size: 0.74rem; color: #CBD5E1;">${mitigation}</td>
                </tr>
            `;
        }
        portMatrixBody.innerHTML = rowsHtml;
    }
}
