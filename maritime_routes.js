/**
 * OceanIQ DSS - High-Precision Maritime Navigation & Multi-Route Engine
 * Strictly follows oceanic waterways, international shipping lanes, and nautical straits.
 * Zero continent/land cutting.
 */

const MARITIME_ROUTES_DB = {
    // -------------------------------------------------------------------------
    // 1. HAY POINT (AUSTRALIA)
    // -------------------------------------------------------------------------
    "Hay Point (Australia)": {
        primary: {
            name: "Cape Leeuwin Deepwater Route (Recommended for Capesize)",
            description: "100% deep ocean navigation via Great Australian Bight and Cape Leeuwin. Zero shallow strait draft restrictions.",
            color: "#00F2FE", // Glowing Cyan
            dash: "solid",
            stops: [
                { name: "Hay Point Terminal", country: "Queensland, Australia", lat: -21.28, lon: 149.30, type: "Origin Loading Terminal", icon: "🛫" },
                { name: "Port Kembla / Sydney", country: "New South Wales, Australia", lat: -34.50, lon: 152.00, type: "Coastal Support & Bunkering", icon: "⛽" },
                { name: "Bass Strait Maritime Corridor", country: "Victoria / Tasmania, Australia", lat: -39.30, lon: 144.50, type: "Navigational Chokepoint", icon: "⚓" },
                { name: "Cape Leeuwin Deepwater Gate", country: "Western Australia", lat: -35.20, lon: 114.50, type: "Ocean Transition Point", icon: "🧭" },
                { name: "Fremantle / Perth Anchorage", country: "Western Australia", lat: -32.10, lon: 114.80, type: "Major Bunkering & Crew Relief", icon: "⛽" },
                { name: "Cocos (Keeling) Islands", country: "Australian Indian Ocean Territory", lat: -12.15, lon: 96.85, type: "Mid-Ocean Waypoint", icon: "📍" },
                { name: "Bay of Bengal Deep Entrance", country: "International Waters", lat: 8.00, lon: 86.00, type: "Discharge Approach Gate", icon: "🌊" }
            ],
            waypoints: [
                { lat: -21.28, lon: 149.30 }, // Hay Point
                { lat: -24.50, lon: 153.50 }, // Off Fraser Island
                { lat: -29.00, lon: 154.20 }, // Coral Sea South
                { lat: -34.50, lon: 152.00 }, // Off Sydney / Port Kembla
                { lat: -37.50, lon: 150.50 }, // Cape Howe
                { lat: -39.20, lon: 147.00 }, // Bass Strait East
                { lat: -39.50, lon: 144.50 }, // Bass Strait Mid
                { lat: -38.50, lon: 140.50 }, // Off Victoria
                { lat: -36.50, lon: 134.00 }, // Great Australian Bight East
                { lat: -35.50, lon: 124.00 }, // Great Australian Bight West
                { lat: -35.20, lon: 114.50 }, // South of Cape Leeuwin
                { lat: -32.10, lon: 114.80 }, // Off Fremantle / Perth
                { lat: -25.00, lon: 106.00 }, // Open Southeast Indian Ocean
                { lat: -18.00, lon: 100.00 }, // Open Indian Ocean
                { lat: -12.15, lon: 96.85 },  // Cocos Islands
                { lat: -4.00, lon: 91.00 },   // Approaching Equator
                { lat: 4.00, lon: 86.50 },    // North Indian Ocean
                { lat: 8.00, lon: 86.00 },    // Bay of Bengal Entrance
                { lat: 14.00, lon: 85.50 }    // Central Bay of Bengal
            ]
        },
        alternative: {
            name: "Lombok Strait & Singapore Malacca Route",
            description: "Transit via Lombok Strait and Singapore Bunkering Hub into Andaman Sea. Supramax/Panamax profile.",
            color: "#A855F7", // Glowing Violet/Purple
            dash: "dash",
            stops: [
                { name: "Hay Point Terminal", country: "Queensland, Australia", lat: -21.28, lon: 149.30, type: "Origin Loading Terminal", icon: "🛫" },
                { name: "Port Darwin", country: "Northern Territory, Australia", lat: -12.45, lon: 130.80, type: "Northern Bunker & Staging Hub", icon: "⛽" },
                { name: "Lombok Strait Deep Corridor", country: "Bali / Lombok, Indonesia", lat: -8.70, lon: 115.75, type: "International Deepwater Strait", icon: "⚓" },
                { name: "Port of Singapore", country: "Singapore", lat: 1.28, lon: 103.85, type: "World Premier Bunker & Provision Hub", icon: "⛽" },
                { name: "Port Klang / Malacca Strait", country: "Selangor, Malaysia", lat: 3.00, lon: 101.30, type: "Maritime Chokepoint & Pilot Station", icon: "⚓" },
                { name: "Sabang Port (Weh Island)", country: "Aceh, Indonesia", lat: 5.89, lon: 95.32, type: "Andaman Sea Transit Gate", icon: "📍" }
            ],
            waypoints: [
                { lat: -21.28, lon: 149.30 }, // Hay Point
                { lat: -18.00, lon: 148.50 }, // Great Barrier Reef Trench
                { lat: -13.00, lon: 146.50 }, // Coral Sea North
                { lat: -11.50, lon: 153.00 }, // East of Papua New Guinea
                { lat: -10.50, lon: 148.00 }, // South of Port Moresby
                { lat: -10.20, lon: 143.50 }, // Torres Strait Approach
                { lat: -10.50, lon: 142.15 }, // Prince of Wales Channel
                { lat: -10.00, lon: 137.00 }, // Arafura Sea
                { lat: -12.45, lon: 130.80 }, // Off Port Darwin
                { lat: -10.50, lon: 126.00 }, // Timor Sea
                { lat: -9.50, lon: 120.00 },  // Savu Sea
                { lat: -8.70, lon: 115.75 },  // Lombok Strait
                { lat: -5.50, lon: 110.00 },  // Java Sea
                { lat: -1.50, lon: 107.00 },  // Karimata Strait
                { lat: 1.25, lon: 104.00 },   // Singapore Strait East
                { lat: 1.28, lon: 103.85 },   // Port of Singapore
                { lat: 2.80, lon: 101.20 },   // Malacca Strait Mid
                { lat: 4.50, lon: 99.00 },    // Malacca Strait North
                { lat: 5.89, lon: 95.32 },    // Off Sabang (Weh Island)
                { lat: 8.50, lon: 92.50 },    // Andaman Sea
                { lat: 13.00, lon: 88.00 }    // Bay of Bengal
            ]
        }
    },

    // -------------------------------------------------------------------------
    // 2. NEWCASTLE (AUSTRALIA)
    // -------------------------------------------------------------------------
    "Newcastle (Australia)": {
        primary: {
            name: "Cape Leeuwin Open Ocean Route (Heavy Bulk Standard)",
            description: "Direct deepwater voyage south of Australia via Bass Strait and across open Indian Ocean. Free of reef hazards.",
            color: "#00F2FE",
            dash: "solid",
            stops: [
                { name: "Port of Newcastle", country: "New South Wales, Australia", lat: -32.92, lon: 151.78, type: "Origin Loading Hub (PWCS/NCIG)", icon: "🛫" },
                { name: "Port Kembla", country: "New South Wales, Australia", lat: -34.48, lon: 151.50, type: "Bunker & Support Station", icon: "⛽" },
                { name: "Bass Strait", country: "Victoria, Australia", lat: -39.30, lon: 144.50, type: "Navigational Chokepoint", icon: "⚓" },
                { name: "Fremantle / Perth", country: "Western Australia", lat: -32.10, lon: 114.80, type: "Primary Bunker Hub", icon: "⛽" },
                { name: "Cocos Islands", country: "Australian Indian Ocean", lat: -12.15, lon: 96.85, type: "Mid-Ocean Checkpoint", icon: "📍" }
            ],
            waypoints: [
                { lat: -32.92, lon: 151.78 }, // Newcastle
                { lat: -34.50, lon: 152.00 }, // Off Sydney
                { lat: -37.50, lon: 150.50 }, // Off Cape Howe
                { lat: -39.20, lon: 147.00 }, // Bass Strait East
                { lat: -39.50, lon: 144.50 }, // Bass Strait Mid
                { lat: -38.50, lon: 140.50 }, // Off Portland, Victoria
                { lat: -36.50, lon: 134.00 }, // Great Australian Bight East
                { lat: -35.50, lon: 124.00 }, // Great Australian Bight West
                { lat: -35.20, lon: 114.50 }, // South of Cape Leeuwin
                { lat: -32.10, lon: 114.80 }, // Off Fremantle / Perth
                { lat: -25.00, lon: 106.00 }, // Open Southeast Indian Ocean
                { lat: -18.00, lon: 100.00 }, // Open Indian Ocean
                { lat: -12.15, lon: 96.85 },  // Cocos Islands
                { lat: -4.00, lon: 91.00 },   // Equator
                { lat: 4.00, lon: 86.50 },    // North Indian Ocean
                { lat: 8.00, lon: 86.00 },    // Bay of Bengal Entrance
                { lat: 14.00, lon: 85.50 }    // Central Bay of Bengal
            ]
        },
        alternative: {
            name: "East Coast & Lombok Strait Corridor",
            description: "Coastal passage north along Queensland coast through Lombok Strait and Singapore.",
            color: "#A855F7",
            dash: "dash",
            stops: [
                { name: "Port of Newcastle", country: "New South Wales, Australia", lat: -32.92, lon: 151.78, type: "Origin Loading Hub", icon: "🛫" },
                { name: "Brisbane Coastal Passage", country: "Queensland, Australia", lat: -27.20, lon: 153.50, type: "Coastal Transit Checkpoint", icon: "⚓" },
                { name: "Lombok Strait", country: "Indonesia", lat: -8.70, lon: 115.75, type: "Deepwater Transit Corridor", icon: "⚓" },
                { name: "Port of Singapore", country: "Singapore", lat: 1.28, lon: 103.85, type: "Bunkering & Provisioning", icon: "⛽" },
                { name: "Malacca Strait", country: "Malaysia", lat: 3.50, lon: 100.50, type: "Chokepoint", icon: "⚓" }
            ],
            waypoints: [
                { lat: -32.92, lon: 151.78 }, // Newcastle
                { lat: -27.20, lon: 153.50 }, // Off Brisbane
                { lat: -22.00, lon: 152.00 }, // Coral Sea South
                { lat: -15.00, lon: 149.00 }, // Coral Sea Central
                { lat: -11.50, lon: 153.00 }, // Louisiade Archipelago
                { lat: -10.50, lon: 148.00 }, // South PNG
                { lat: -10.50, lon: 142.15 }, // Torres Strait
                { lat: -10.00, lon: 137.00 }, // Arafura Sea
                { lat: -10.50, lon: 126.00 }, // Timor Sea
                { lat: -8.70, lon: 115.75 },  // Lombok Strait
                { lat: -5.50, lon: 110.00 },  // Java Sea
                { lat: -1.50, lon: 107.00 },  // Karimata Strait
                { lat: 1.28, lon: 103.85 },   // Singapore
                { lat: 3.50, lon: 100.50 },   // Malacca Strait
                { lat: 5.89, lon: 95.32 },    // Weh Island
                { lat: 12.00, lon: 88.00 }    // Bay of Bengal
            ]
        }
    },

    // -------------------------------------------------------------------------
    // 3. BALTIMORE (USA)
    // -------------------------------------------------------------------------
    "Baltimore (USA)": {
        primary: {
            name: "Transatlantic Mediterranean & Suez Canal Route",
            description: "Direct Atlantic crossing, transit through Strait of Gibraltar, Mediterranean Sea, Suez Canal and Bab-el-Mandeb.",
            color: "#00F2FE",
            dash: "solid",
            stops: [
                { name: "Baltimore Marine Terminal", country: "Maryland, USA", lat: 39.29, lon: -76.61, type: "Origin Loading Terminal", icon: "🛫" },
                { name: "Norfolk / Chesapeake Entrance", country: "Virginia, USA", lat: 36.95, lon: -75.70, type: "Atlantic Departure Gate", icon: "⚓" },
                { name: "Gibraltar / Algeciras", country: "UK / Spain", lat: 36.14, lon: -5.35, type: "Atlantic-Med Bunkering Hub", icon: "⛽" },
                { name: "Malta Freeport (Marsaxlokk)", country: "Malta", lat: 35.82, lon: 14.53, type: "Central Med Maritime Hub", icon: "⛽" },
                { name: "Port Said / Suez Canal North", country: "Egypt", lat: 31.26, lon: 32.30, type: "Canal Convoy Staging Gate", icon: "🏛️" },
                { name: "Port of Suez / Canal South", country: "Egypt", lat: 29.95, lon: 32.55, type: "Red Sea Exit Checkpoint", icon: "🏛️" },
                { name: "Bab-el-Mandeb Strait", country: "Djibouti / Yemen", lat: 12.60, lon: 43.35, type: "Strategic Chokepoint & Pilot Station", icon: "⚓" },
                { name: "Port of Colombo / Galle", country: "Western Province, Sri Lanka", lat: 6.93, lon: 79.84, type: "Indian Ocean Transshipment Hub", icon: "⛽" }
            ],
            waypoints: [
                { lat: 39.29, lon: -76.61 }, // Baltimore
                { lat: 38.50, lon: -76.30 }, // Chesapeake Bay Mid
                { lat: 37.00, lon: -75.80 }, // Chesapeake Bay South
                { lat: 36.95, lon: -75.70 }, // Off Norfolk / Atlantic Exit
                { lat: 36.50, lon: -70.00 }, // Open North Atlantic
                { lat: 36.00, lon: -50.00 }, // Mid North Atlantic
                { lat: 36.00, lon: -30.00 }, // Central Atlantic
                { lat: 36.00, lon: -15.00 }, // Approach to Europe
                { lat: 35.95, lon: -6.50 },  // Gulf of Cadiz
                { lat: 35.95, lon: -5.35 },  // Strait of Gibraltar
                { lat: 36.30, lon: -3.00 },  // Alboran Sea
                { lat: 37.50, lon: 3.00 },   // South of Balearics
                { lat: 38.00, lon: 8.50 },   // South of Sardinia
                { lat: 36.80, lon: 12.00 },  // Strait of Sicily
                { lat: 35.82, lon: 14.53 },  // Off Malta
                { lat: 33.50, lon: 23.00 },  // Ionian Sea
                { lat: 32.50, lon: 29.00 },  // Levantine Basin
                { lat: 31.26, lon: 32.30 },  // Port Said (Suez North)
                { lat: 30.50, lon: 32.35 },  // Great Bitter Lake
                { lat: 29.95, lon: 32.55 },  // Suez South
                { lat: 28.50, lon: 33.20 },  // Gulf of Suez
                { lat: 27.60, lon: 33.70 },  // Strait of Gubal
                { lat: 26.00, lon: 35.00 },  // Red Sea North
                { lat: 22.00, lon: 38.00 },  // Red Sea Central
                { lat: 16.00, lon: 41.50 },  // Red Sea South
                { lat: 12.60, lon: 43.35 },  // Bab-el-Mandeb Strait
                { lat: 12.20, lon: 47.00 },  // Gulf of Aden
                { lat: 12.50, lon: 55.00 },  // Off Socotra Island
                { lat: 12.00, lon: 65.00 },  // Central Arabian Sea
                { lat: 8.00, lon: 74.00 },   // Laccadive Sea
                { lat: 5.70, lon: 80.60 },   // South of Sri Lanka (Dondra Head)
                { lat: 6.50, lon: 82.20 },   // East of Sri Lanka
                { lat: 10.00, lon: 83.50 }   // South Bay of Bengal
            ]
        },
        alternative: {
            name: "Cape of Good Hope Deepwater Voyage",
            description: "Bypasses Mediterranean and Suez Canal via South Atlantic and Southern Africa. Standard route during canal congestion.",
            color: "#A855F7",
            dash: "dash",
            stops: [
                { name: "Baltimore Marine Terminal", country: "Maryland, USA", lat: 39.29, lon: -76.61, type: "Origin Loading Terminal", icon: "🛫" },
                { name: "St. Helena Anchorage", country: "British Overseas Territory", lat: -15.90, lon: -5.70, type: "South Atlantic Mid-Ocean Waypoint", icon: "📍" },
                { name: "Port of Cape Town", country: "Western Cape, South Africa", lat: -33.90, lon: 18.42, type: "Major Bunkering & Transition Hub", icon: "⛽" },
                { name: "Port Elizabeth / Coega", country: "Eastern Cape, South Africa", lat: -33.95, lon: 25.60, type: "Agulhas Current Support Station", icon: "⚓" },
                { name: "Port Louis", country: "Mauritius", lat: -20.15, lon: 57.50, type: "Southwest Indian Ocean Fuel Hub", icon: "⛽" },
                { name: "Hambantota International Port", country: "Southern Province, Sri Lanka", lat: 6.12, lon: 81.12, type: "Deepwater Port of Call", icon: "📍" }
            ],
            waypoints: [
                { lat: 39.29, lon: -76.61 }, // Baltimore
                { lat: 36.95, lon: -75.70 }, // Chesapeake Exit
                { lat: 30.00, lon: -65.00 }, // Bermuda Triangle Open Sea
                { lat: 20.00, lon: -50.00 }, // Tropical Atlantic
                { lat: 10.00, lon: -38.00 }, // Central Atlantic
                { lat: 0.00, lon: -26.00 },  // Atlantic Equator
                { lat: -10.00, lon: -15.00 }, // South Atlantic
                { lat: -15.90, lon: -5.70 },  // St. Helena
                { lat: -25.00, lon: 5.00 },   // Benguela Current Approach
                { lat: -32.00, lon: 14.00 },  // South Africa Approach
                { lat: -34.80, lon: 18.20 },  // Cape of Good Hope
                { lat: -35.20, lon: 20.20 },  // Cape Agulhas
                { lat: -33.95, lon: 25.60 },  // Off Port Elizabeth
                { lat: -32.00, lon: 33.00 },  // Natal Basin
                { lat: -27.00, lon: 48.00 },  // South of Madagascar
                { lat: -20.15, lon: 57.50 },  // Mauritius
                { lat: -10.00, lon: 68.00 },  // Chagos Basin
                { lat: 0.00, lon: 76.00 },   // Indian Ocean Equator
                { lat: 5.70, lon: 80.60 },   // South of Sri Lanka
                { lat: 6.50, lon: 82.20 },   // East of Sri Lanka
                { lat: 10.00, lon: 83.50 }   // Bay of Bengal
            ]
        }
    },

    // -------------------------------------------------------------------------
    // 4. TAMAN (RUSSIA)
    // -------------------------------------------------------------------------
    "Taman (Russia)": {
        primary: {
            name: "Black Sea, Bosphorus & Suez Maritime Route",
            description: "Direct transit through Turkish Straits, Eastern Mediterranean, Suez Canal, and Bab-el-Mandeb Strait.",
            color: "#00F2FE",
            dash: "solid",
            stops: [
                { name: "Taman Bulk Terminal", country: "Krasnodar Krai, Russia", lat: 45.13, lon: 36.68, type: "Black Sea Deepwater Loading Terminal", icon: "🛫" },
                { name: "Istanbul / Bosphorus Strait", country: "Marmara, Turkey", lat: 41.05, lon: 29.02, type: "Turkish Straits Pilot & Transit Hub", icon: "⚓" },
                { name: "Canakkale / Dardanelles", country: "Aegean, Turkey", lat: 40.15, lon: 26.40, type: "Strait Transit Checkpoint", icon: "⚓" },
                { name: "Port Said / Suez Canal", country: "Port Said, Egypt", lat: 31.26, lon: 32.30, type: "Suez Canal Transit Staging Gate", icon: "🏛️" },
                { name: "Djibouti Port / Bab-el-Mandeb", country: "Djibouti", lat: 11.60, lon: 43.15, type: "Red Sea Exit Chokepoint & Bunkering", icon: "⛽" },
                { name: "Galle / Hambantota Anchorage", country: "Southern Province, Sri Lanka", lat: 5.95, lon: 80.55, type: "Mid-Voyage Bunkering Station", icon: "📍" }
            ],
            waypoints: [
                { lat: 45.13, lon: 36.68 }, // Taman
                { lat: 45.05, lon: 36.55 }, // Kerch Strait South
                { lat: 43.50, lon: 33.00 }, // Black Sea Central
                { lat: 42.00, lon: 30.50 }, // Black Sea West
                { lat: 41.35, lon: 29.15 }, // Bosphorus North Entrance
                { lat: 41.05, lon: 29.02 }, // Bosphorus Strait (Istanbul)
                { lat: 40.70, lon: 28.00 }, // Sea of Marmara
                { lat: 40.15, lon: 26.40 }, // Dardanelles Strait (Canakkale)
                { lat: 39.80, lon: 25.80 }, // North Aegean Sea
                { lat: 37.50, lon: 25.50 }, // Central Aegean
                { lat: 35.00, lon: 28.50 }, // South of Rhodes
                { lat: 32.50, lon: 31.00 }, // Southeast Med
                { lat: 31.26, lon: 32.30 }, // Port Said (Suez)
                { lat: 30.50, lon: 32.35 }, // Great Bitter Lake
                { lat: 29.95, lon: 32.55 }, // Suez South
                { lat: 28.50, lon: 33.20 }, // Gulf of Suez
                { lat: 27.60, lon: 33.70 }, // Red Sea Entrance
                { lat: 24.00, lon: 36.50 }, // Red Sea Central
                { lat: 18.00, lon: 40.50 }, // Red Sea South
                { lat: 12.60, lon: 43.35 }, // Bab-el-Mandeb Strait
                { lat: 12.20, lon: 47.00 }, // Gulf of Aden
                { lat: 12.50, lon: 55.00 }, // Off Socotra
                { lat: 11.50, lon: 65.00 }, // Arabian Sea
                { lat: 7.50, lon: 74.00 },  // Laccadive Sea
                { lat: 5.70, lon: 80.60 },  // South of Sri Lanka
                { lat: 6.50, lon: 82.20 },  // East of Sri Lanka
                { lat: 10.00, lon: 83.50 }  // Bay of Bengal
            ]
        },
        alternative: {
            name: "Middle East Red Sea & Arabian Gulf Transit Corridor",
            description: "Route via Jeddah Islamic Port and Gulf of Oman maritime security corridor.",
            color: "#A855F7",
            dash: "dash",
            stops: [
                { name: "Taman Bulk Terminal", country: "Russia", lat: 45.13, lon: 36.68, type: "Origin Loading Terminal", icon: "🛫" },
                { name: "Istanbul / Bosphorus", country: "Turkey", lat: 41.05, lon: 29.02, type: "Strait Chokepoint", icon: "⚓" },
                { name: "Port Said", country: "Egypt", lat: 31.26, lon: 32.30, type: "Canal Transit", icon: "🏛️" },
                { name: "Jeddah Islamic Port", country: "Makkah, Saudi Arabia", lat: 21.48, lon: 39.18, type: "Red Sea Major Bunkering Hub", icon: "⛽" },
                { name: "Port of Salalah", country: "Dhofar, Oman", lat: 16.95, lon: 54.00, type: "Arabian Sea Transshipment Hub", icon: "⛽" },
                { name: "Kochi / Cochin Anchorage", country: "Kerala, India", lat: 9.93, lon: 76.26, type: "Indian Coast Waystation", icon: "📍" }
            ],
            waypoints: [
                { lat: 45.13, lon: 36.68 }, // Taman
                { lat: 41.05, lon: 29.02 }, // Bosphorus
                { lat: 40.15, lon: 26.40 }, // Dardanelles
                { lat: 35.00, lon: 28.50 }, // Med
                { lat: 31.26, lon: 32.30 }, // Suez
                { lat: 27.60, lon: 33.70 }, // Red Sea Entrance
                { lat: 21.48, lon: 38.50 }, // Off Jeddah (Water)
                { lat: 14.00, lon: 42.50 }, // Red Sea South
                { lat: 12.60, lon: 43.35 }, // Bab-el-Mandeb
                { lat: 13.50, lon: 50.00 }, // Gulf of Aden
                { lat: 16.50, lon: 54.50 }, // Off Salalah (Water)
                { lat: 15.00, lon: 62.00 }, // Central Arabian Sea
                { lat: 9.93, lon: 75.50 },  // Off Cochin (Water)
                { lat: 5.70, lon: 80.60 },  // South of Sri Lanka
                { lat: 6.50, lon: 82.20 },  // East of Sri Lanka
                { lat: 10.00, lon: 83.50 }  // Bay of Bengal
            ]
        }
    },

    // -------------------------------------------------------------------------
    // 5. KALIMANTAN (INDONESIA)
    // -------------------------------------------------------------------------
    "Kalimantan (Indonesia)": {
        primary: {
            name: "Singapore & Malacca Strait Corridor",
            description: "Direct westbound route through Karimata Strait, Singapore Bunkering Hub, and Malacca Strait into Bay of Bengal.",
            color: "#00F2FE",
            dash: "solid",
            stops: [
                { name: "Tanjung Bara / Kalimantan", country: "East/South Kalimantan, Indonesia", lat: -3.32, lon: 114.59, type: "Origin Coal Anchorage", icon: "🛫" },
                { name: "Batam Island Anchorage", country: "Riau Islands, Indonesia", lat: 1.13, lon: 104.05, type: "Maritime Holding & Bunkering", icon: "⛽" },
                { name: "Port of Singapore", country: "Singapore", lat: 1.28, lon: 103.85, type: "Global Bunkering Capital", icon: "⛽" },
                { name: "Port Klang", country: "Selangor, Malaysia", lat: 3.00, lon: 101.30, type: "Malacca Strait Traffic Control", icon: "⚓" },
                { name: "Sabang Port (Weh Island)", country: "Aceh, Indonesia", lat: 5.89, lon: 95.32, type: "Gateway to Bay of Bengal", icon: "📍" }
            ],
            waypoints: [
                { lat: -3.32, lon: 114.59 }, // Kalimantan (Tanjung Bara/Taboneo)
                { lat: -3.00, lon: 110.00 }, // Central Java Sea
                { lat: -1.50, lon: 107.00 }, // Karimata Strait
                { lat: 0.00, lon: 105.00 },  // Riau Archipelago Water Passage
                { lat: 1.13, lon: 104.05 },  // Off Batam Island
                { lat: 1.28, lon: 103.85 },  // Singapore Strait
                { lat: 2.80, lon: 101.20 },  // Malacca Strait Mid
                { lat: 4.50, lon: 99.00 },   // Malacca Strait North
                { lat: 5.89, lon: 95.32 },   // Off Sabang Island
                { lat: 8.50, lon: 92.00 },   // Andaman Sea Deep
                { lat: 13.00, lon: 88.00 }   // Bay of Bengal
            ]
        },
        alternative: {
            name: "Sunda Strait & Great Nicobar Deepwater Bypass",
            description: "Avoids high-density traffic in Malacca Strait by routing through Sunda Strait and west of Sumatra into Bay of Bengal.",
            color: "#A855F7",
            dash: "dash",
            stops: [
                { name: "Tanjung Bara / Kalimantan", country: "Kalimantan, Indonesia", lat: -3.32, lon: 114.59, type: "Origin Coal Anchorage", icon: "🛫" },
                { name: "Ciwandan / Sunda Strait", country: "Banten / Java, Indonesia", lat: -5.95, lon: 105.90, type: "Deepwater Strait Pilot Gate", icon: "⚓" },
                { name: "Teluk Bayur / Padang", country: "West Sumatra, Indonesia", lat: -0.99, lon: 100.37, type: "Indian Ocean Coastal Waystation", icon: "⛽" },
                { name: "Great Nicobar (Indira Point)", country: "Andaman & Nicobar Islands, India", lat: 6.90, lon: 93.85, type: "Indian Strategic Maritime Sentinel", icon: "📍" }
            ],
            waypoints: [
                { lat: -3.32, lon: 114.59 }, // Kalimantan
                { lat: -4.50, lon: 110.00 }, // Southwest Java Sea
                { lat: -5.50, lon: 107.50 }, // Approach to Sunda Strait
                { lat: -5.95, lon: 105.90 }, // Mid Sunda Strait (Between Java & Sumatra)
                { lat: -6.50, lon: 104.80 }, // Sunda Strait Exit into Indian Ocean
                { lat: -4.00, lon: 100.00 }, // Off West Sumatra (Deep Ocean)
                { lat: -0.99, lon: 97.50 },  // West of Nias Island
                { lat: 3.00, lon: 94.00 },   // West of Simeulue
                { lat: 6.90, lon: 93.85 },   // Great Nicobar Channel
                { lat: 10.00, lon: 90.00 },  // Bay of Bengal South
                { lat: 14.00, lon: 86.50 }   // Bay of Bengal North
            ]
        }
    }
};

/**
 * Build the exact marine approach coordinates into Indian Ports
 */
function getPortApproach(dest) {
    switch (dest) {
        case "Visakhapatnam (Vizag)":
            return [
                { lat: 14.50, lon: 84.50 },
                { lat: 16.50, lon: 83.80 },
                { lat: 17.68, lon: 83.21 } // Vizag Port
            ];
        case "Gangavaram":
            return [
                { lat: 14.50, lon: 84.50 },
                { lat: 16.50, lon: 83.70 },
                { lat: 17.62, lon: 83.23 } // Gangavaram Ultra-Deep
            ];
        case "Paradip":
            return [
                { lat: 15.00, lon: 85.50 },
                { lat: 18.00, lon: 86.80 },
                { lat: 19.50, lon: 86.80 },
                { lat: 20.31, lon: 86.61 } // Paradip Port
            ];
        case "Haldia":
            return [
                { lat: 16.00, lon: 86.50 },
                { lat: 19.00, lon: 88.00 },
                { lat: 21.00, lon: 88.20 }, // Sandheads Pilot Anchorage
                { lat: 21.60, lon: 88.10 }, // Hooghly Estuary Entrance
                { lat: 22.02, lon: 88.06 }  // Haldia Dock Complex
            ];
        case "Dhamra":
            return [
                { lat: 15.00, lon: 85.50 },
                { lat: 18.50, lon: 87.00 },
                { lat: 20.20, lon: 87.20 },
                { lat: 20.80, lon: 86.97 } // Dhamra Port
            ];
        case "Gopalpur":
            return [
                { lat: 15.00, lon: 85.00 },
                { lat: 18.00, lon: 85.50 },
                { lat: 19.31, lon: 84.97 } // Gopalpur Port
            ];
        default:
            return [
                { lat: 15.00, lon: 85.50 },
                { lat: 18.00, lon: 86.50 },
                { lat: 20.31, lon: 86.61 }
            ];
    }
}

/**
 * Returns complete route objects for both primary and alternative choices.
 */
function getMaritimeRoutes(origin, dest) {
    const routeData = MARITIME_ROUTES_DB[origin] || MARITIME_ROUTES_DB["Hay Point (Australia)"];
    const approach = getPortApproach(dest);
    
    // Add destination stop
    const destInfo = (typeof PORT_CONSTRAINTS !== "undefined" && PORT_CONSTRAINTS[dest]) ? PORT_CONSTRAINTS[dest] : { maxDraft: 16.5, type: "Discharge Port" };
    const destCoord = (typeof PORT_COORDS !== "undefined" && PORT_COORDS[dest]) ? PORT_COORDS[dest] : { lat: 20.31, lon: 86.61 };
    
    const destStop = {
        name: `${dest} Terminal`,
        country: dest.includes("Haldia") ? "West Bengal, India" : (dest.includes("Vizag") || dest.includes("Gangavaram")) ? "Andhra Pradesh, India" : "Odisha, India",
        lat: destCoord.lat,
        lon: destCoord.lon,
        type: `Final Discharge Terminal (Max Draft: ${destInfo.maxDraft}m)`,
        icon: "🛬"
    };

    // Build Primary
    const primaryWaypoints = [...routeData.primary.waypoints, ...approach];
    const primaryStops = [...routeData.primary.stops, destStop];

    // Build Alternative
    const altWaypoints = [...routeData.alternative.waypoints, ...approach];
    const altStops = [...routeData.alternative.stops, destStop];

    // Calculate base distance
    const baseDist = (typeof ROUTE_DISTANCES !== "undefined" && ROUTE_DISTANCES[origin] && ROUTE_DISTANCES[origin][dest])
        ? ROUTE_DISTANCES[origin][dest]
        : 5420;

    return {
        primary: {
            ...routeData.primary,
            dist: baseDist,
            waypoints: primaryWaypoints,
            stops: primaryStops
        },
        alternative: {
            ...routeData.alternative,
            dist: Math.round(baseDist * 1.075),
            waypoints: altWaypoints,
            stops: altStops
        }
    };
}

if (typeof window !== 'undefined') {
    window.MARITIME_ROUTES_DB = MARITIME_ROUTES_DB;
    window.getMaritimeRoutes = getMaritimeRoutes;
}
if (typeof global !== 'undefined') {
    global.MARITIME_ROUTES_DB = MARITIME_ROUTES_DB;
    global.getMaritimeRoutes = getMaritimeRoutes;
}
