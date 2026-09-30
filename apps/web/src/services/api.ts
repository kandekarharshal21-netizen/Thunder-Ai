import {
  StormCell, AIPrediction, WeatherAlert, SavedLocation,
  SystemHealthReport, ReplayEvent, AuditLogEntry, DataSourceHealth
} from '../types/weather';

const API_BASE = '/api/v1';

// Self-Healing Cache & Retry Wrapper (Rule 18)
const CACHE: Record<string, { data: any; timestamp: number }> = {};
const CACHE_TTL = 10000; // 10 seconds

async function fetchWithRetry(url: string, options: RequestInit = {}, retries = 2, backoff = 500) {
  const isGet = !options.method || options.method === 'GET';
  if (isGet && CACHE[url] && Date.now() - CACHE[url].timestamp < CACHE_TTL) {
    return { ...CACHE[url].data, _cached: true, _data_age_ms: Date.now() - CACHE[url].timestamp };
  }

  for (let i = 0; i <= retries; i++) {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 4000);
      const res = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(id);
      
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      
      if (isGet) {
        CACHE[url] = { data, timestamp: Date.now() };
      }
      return data;
    } catch (err) {
      if (i === retries) throw err;
      await new Promise(r => setTimeout(r, backoff * Math.pow(2, i))); // Exponential backoff
    }
  }
}


// Seed Fallback Data (Adhering to Page 18: Developing, Intensifying, Decaying scenarios)
const SEED_STORMS: StormCell[] = [
  {
    id: "ST-2026-001",
    name: "Supercell Alpha (Squall Line Leading Edge)",
    status: "Intensifying",
    severity: "SEVERE",
    lat: 19.12,
    lon: 73.18,
    intensity_dbz: 58.5,
    vert_extent_km: 15.2,
    speed_kmh: 46.0,
    direction_deg: 65.0,
    growth_rate_dbz_hr: 14.2,
    affected_area_sqkm: 820.0,
    first_seen: "2026-09-29T16:15:00Z",
    last_seen: "2026-09-29T17:45:00Z",
    split_merge_event: "Cell Merged with feeder band at +15m",
    track: [
      { timestamp: "17:00", lat: 18.82, lon: 72.88, intensity_dbz: 44.0, is_forecast: false, horizon_min: 0 },
      { timestamp: "17:15", lat: 18.92, lon: 72.98, intensity_dbz: 49.5, is_forecast: false, horizon_min: 0 },
      { timestamp: "17:30", lat: 19.02, lon: 73.08, intensity_dbz: 54.0, is_forecast: false, horizon_min: 0 },
      { timestamp: "17:45", lat: 19.12, lon: 73.18, intensity_dbz: 58.5, is_forecast: false, horizon_min: 0 },
      { timestamp: "18:00", lat: 19.22, lon: 73.30, intensity_dbz: 60.0, is_forecast: true, horizon_min: 15 },
      { timestamp: "18:15", lat: 19.33, lon: 73.43, intensity_dbz: 57.0, is_forecast: true, horizon_min: 30 },
      { timestamp: "18:45", lat: 19.52, lon: 73.68, intensity_dbz: 51.0, is_forecast: true, horizon_min: 60 },
      { timestamp: "19:15", lat: 19.70, lon: 73.92, intensity_dbz: 43.0, is_forecast: true, horizon_min: 90 }
    ],
    forecast_positions: [
      { horizon_min: 15, lat: 19.22, lon: 73.30, prob: 0.94, severity: "SEVERE" },
      { horizon_min: 30, lat: 19.33, lon: 73.43, prob: 0.89, severity: "SEVERE" },
      { horizon_min: 60, lat: 19.52, lon: 73.68, prob: 0.76, severity: "HIGH" },
      { horizon_min: 90, lat: 19.70, lon: 73.92, prob: 0.58, severity: "MODERATE" }
    ],
    affected_polygon: {
      type: "Polygon",
      coordinates: [[
        [73.02, 19.05], [73.35, 19.10], [73.42, 19.32], [73.15, 19.38], [72.95, 19.20], [73.02, 19.05]
      ]]
    }
  },
  {
    id: "ST-2026-002",
    name: "Convective Cell Bravo (Developing Cluster)",
    status: "Developing",
    severity: "HIGH",
    lat: 18.65,
    lon: 73.62,
    intensity_dbz: 48.0,
    vert_extent_km: 11.5,
    speed_kmh: 32.0,
    direction_deg: 50.0,
    growth_rate_dbz_hr: 22.0,
    affected_area_sqkm: 390.0,
    first_seen: "2026-09-29T17:10:00Z",
    last_seen: "2026-09-29T17:45:00Z",
    split_merge_event: "Rapid updraft intensification detected",
    track: [
      { timestamp: "17:15", lat: 18.52, lon: 73.48, intensity_dbz: 32.0, is_forecast: false, horizon_min: 0 },
      { timestamp: "17:30", lat: 18.58, lon: 73.55, intensity_dbz: 41.0, is_forecast: false, horizon_min: 0 },
      { timestamp: "17:45", lat: 18.65, lon: 73.62, intensity_dbz: 48.0, is_forecast: false, horizon_min: 0 },
      { timestamp: "18:00", lat: 18.73, lon: 73.71, intensity_dbz: 53.0, is_forecast: true, horizon_min: 15 },
      { timestamp: "18:15", lat: 18.81, lon: 73.80, intensity_dbz: 54.0, is_forecast: true, horizon_min: 30 },
      { timestamp: "18:45", lat: 18.96, lon: 73.97, intensity_dbz: 49.0, is_forecast: true, horizon_min: 60 },
      { timestamp: "19:15", lat: 19.10, lon: 74.12, intensity_dbz: 38.0, is_forecast: true, horizon_min: 90 }
    ],
    forecast_positions: [
      { horizon_min: 15, lat: 18.73, lon: 73.71, prob: 0.88, severity: "HIGH" },
      { horizon_min: 30, lat: 18.81, lon: 73.80, prob: 0.84, severity: "HIGH" },
      { horizon_min: 60, lat: 18.96, lon: 73.97, prob: 0.70, severity: "HIGH" },
      { horizon_min: 90, lat: 19.10, lon: 74.12, prob: 0.45, severity: "LOW" }
    ],
    affected_polygon: {
      type: "Polygon",
      coordinates: [[
        [73.50, 18.55], [73.75, 18.58], [73.78, 18.78], [73.55, 18.75], [73.50, 18.55]
      ]]
    }
  },
  {
    id: "ST-2026-003",
    name: "Cell Charlie (Decaying Anvil Outflow)",
    status: "Decaying",
    severity: "MODERATE",
    lat: 19.55,
    lon: 72.95,
    intensity_dbz: 38.0,
    vert_extent_km: 7.8,
    speed_kmh: 22.0,
    direction_deg: 80.0,
    growth_rate_dbz_hr: -18.5,
    affected_area_sqkm: 540.0,
    first_seen: "2026-09-29T15:30:00Z",
    last_seen: "2026-09-29T17:45:00Z",
    split_merge_event: "Dissipating into stratiform rain shield",
    track: [
      { timestamp: "17:15", lat: 19.50, lon: 72.80, intensity_dbz: 46.0, is_forecast: false, horizon_min: 0 },
      { timestamp: "17:30", lat: 19.52, lon: 72.88, intensity_dbz: 42.0, is_forecast: false, horizon_min: 0 },
      { timestamp: "17:45", lat: 19.55, lon: 72.95, intensity_dbz: 38.0, is_forecast: false, horizon_min: 0 },
      { timestamp: "18:00", lat: 19.58, lon: 73.04, intensity_dbz: 32.0, is_forecast: true, horizon_min: 15 },
      { timestamp: "18:15", lat: 19.60, lon: 73.12, intensity_dbz: 26.0, is_forecast: true, horizon_min: 30 },
      { timestamp: "18:45", lat: 19.64, lon: 73.28, intensity_dbz: 18.0, is_forecast: true, horizon_min: 60 },
      { timestamp: "19:15", lat: 19.68, lon: 73.40, intensity_dbz: 12.0, is_forecast: true, horizon_min: 90 }
    ],
    forecast_positions: [
      { horizon_min: 15, lat: 19.58, lon: 73.04, prob: 0.52, severity: "MODERATE" },
      { horizon_min: 30, lat: 19.60, lon: 73.12, prob: 0.35, severity: "LOW" },
      { horizon_min: 60, lat: 19.64, lon: 73.28, prob: 0.15, severity: "LOW" },
      { horizon_min: 90, lat: 19.68, lon: 73.40, prob: 0.05, severity: "LOW" }
    ],
    affected_polygon: {
      type: "Polygon",
      coordinates: [[
        [72.82, 19.46], [73.08, 19.48], [73.10, 19.65], [72.85, 19.62], [72.82, 19.46]
      ]]
    }
  }
];

const SEED_ALERTS: WeatherAlert[] = [
  {
    id: "ALT-2026-904",
    title: "Severe Lightning & Microburst Warning",
    severity: "SEVERE",
    status: "active",
    target_area: "Kalyan-Dombivli, Thane & Navi Mumbai Corridor",
    coordinates: [73.18, 19.12],
    created_at: "2026-09-29T17:35:00Z",
    expires_at: "2026-09-29T18:35:00Z",
    probability: 0.94,
    reason: "Multimodal fusion detected rapid reflectivity surge (58.5 dBZ) coincident with -72°C overshooting tops and intense CG lightning clusters.",
    recommended_action: "Seek immediate sturdy shelter indoors. Cease open-field agricultural activities, construction crane operations, and avoid tall isolated trees and metal fences.",
    official_source_disclaimer: "THANDER AI is an automated decision-support prototype. Confirm localized directives via official IMD/NDMA bulletins.",
    data_timestamp: "2026-09-29T17:45:00Z"
  },
  {
    id: "ALT-2026-905",
    title: "Developing Squall Line Thunderstorm Watch",
    severity: "HIGH",
    status: "active",
    target_area: "Pune North-West & Lonavala Ghats",
    coordinates: [73.62, 18.65],
    created_at: "2026-09-29T17:40:00Z",
    expires_at: "2026-09-29T19:00:00Z",
    probability: 0.88,
    reason: "Rapid updraft growth (+22 dBZ/hr) in high CAPE environment (2,840 J/kg) with first-flash lightning initiation.",
    recommended_action: "Secure outdoor loose items. Expect wind gusts up to 65 km/h and localized intense lightning.",
    official_source_disclaimer: "Experimental advisory generated by THANDER AI Nowcasting Engine.",
    data_timestamp: "2026-09-29T17:45:00Z"
  },
  {
    id: "ALT-2026-899",
    title: "Decaying Rain Cell Advisory",
    severity: "MODERATE",
    status: "acknowledged",
    target_area: "Palghar Coastal Belt",
    coordinates: [72.95, 19.55],
    created_at: "2026-09-29T16:50:00Z",
    expires_at: "2026-09-29T18:00:00Z",
    probability: 0.52,
    reason: "Convective downdrafts dominating; lightning activity decreasing steadily.",
    recommended_action: "Normal precautions for light-to-moderate showers.",
    official_source_disclaimer: "THANDER AI Prototype Advisory.",
    data_timestamp: "2026-09-29T17:45:00Z"
  }
];

let localAlerts = [...SEED_ALERTS];
let localStorms = [...SEED_STORMS];

let localLocations: SavedLocation[] = [
  {
    id: "LOC-01",
    name: "Central Farm & Solar Array",
    category: "Farm",
    lat: 19.14,
    lon: 73.22,
    radius_km: 15.0,
    notification_threshold: "MODERATE_PLUS",
    quiet_hours_enabled: false,
    quiet_hours_start: "22:00",
    quiet_hours_end: "06:00",
    channels: ["In-App", "Browser Push"],
    active: true,
    created_at: "2026-09-20T10:00:00Z"
  },
  {
    id: "LOC-02",
    name: "Tech Institute Campus Geofence",
    category: "Campus",
    lat: 18.66,
    lon: 73.65,
    radius_km: 10.0,
    notification_threshold: "HIGH_ONLY",
    quiet_hours_enabled: true,
    quiet_hours_start: "23:00",
    quiet_hours_end: "06:30",
    channels: ["In-App"],
    active: true,
    created_at: "2026-09-22T14:30:00Z"
  },
  {
    id: "LOC-03",
    name: "District General Hospital",
    category: "Custom",
    lat: 19.05,
    lon: 73.02,
    radius_km: 8.0,
    notification_threshold: "ALL",
    quiet_hours_enabled: false,
    quiet_hours_start: "00:00",
    quiet_hours_end: "00:00",
    channels: ["In-App", "Browser Push", "SMS Adapter"],
    active: true,
    created_at: "2026-09-25T08:15:00Z"
  }
];

let localHealthSources: DataSourceHealth[] = [
  { name: "IMD Doppler Radar Network (Composite)", type: "Radar", status: "Online" as const, freshness_min: 2.1, quality_pct: 96.0, action: "Normal", endpoint_latency_ms: 82, is_synthetic: true },
  { name: "INSAT-3D Convective RGB / Thermal IR", type: "Satellite", status: "Online" as const, freshness_min: 4.8, quality_pct: 91.5, action: "Normal", endpoint_latency_ms: 124, is_synthetic: true },
  { name: "Ground Precision Lightning Network (WWLLN / TLN)", type: "Lightning", status: "Online" as const, freshness_min: 0.8, quality_pct: 98.2, action: "Normal", endpoint_latency_ms: 45, is_synthetic: true },
  { name: "ECMWF / IMD GFS Radiosonde & NWP Model", type: "Atmosphere", status: "Online" as const, freshness_min: 18.2, quality_pct: 86.0, action: "Normal", endpoint_latency_ms: 210, is_synthetic: true },
  { name: "Automated Surface Weather Station Mesonet", type: "Weather", status: "Online" as const, freshness_min: 1.5, quality_pct: 94.0, action: "Normal", endpoint_latency_ms: 60, is_synthetic: true }
];

export const weatherApi = {
  async getDashboard(horizon: number = 30) {
    try {
      const data = await fetchWithRetry(`${API_BASE}/dashboard?horizon=${horizon}`);
      return data;
    } catch {}
    
    // Deterministic fallback
    const horizonFactor = { 15: 1.05, 30: 1.0, 60: 0.85, 90: 0.65 }[horizon] || 1.0;
    return {
      timestamp: new Date().toISOString(),
      selected_horizon_min: horizon,
      kpis: {
        lightning_probability: Math.min(0.96, Math.round(0.89 * horizonFactor * 100) / 100),
        thunderstorm_probability: Math.min(0.98, Math.round(0.92 * horizonFactor * 100) / 100),
        storm_cells_detected: localStorms.length,
        maximum_predicted_severity: "SEVERE",
        ai_confidence: 0.94,
        data_freshness_sec: 120,
        data_quality_score: 93.1
      },
      system_status: "All systems operational",
      active_pathway: "Full Multimodal Deep Fusion (Phase 4)",
      active_alerts_count: localAlerts.filter(a => a.status === 'active').length,
      storms_summary: localStorms
    };
  },

  async getStorms(): Promise<{ count: number; timestamp: string; storms: StormCell[] }> {
    try {
      const data = await fetchWithRetry(`${API_BASE}/storms`);
      return data;
    } catch {}
    return {
      count: localStorms.length,
      timestamp: new Date().toISOString(),
      storms: localStorms
    };
  },

  async getStormDetail(id: string): Promise<StormCell | null> {
    try {
      const data = await fetchWithRetry(`${API_BASE}/storms/${id}`);
      return data;
    } catch {}
    const found = localStorms.find(s => s.id.toLowerCase() === id.toLowerCase());
    return found || localStorms[0] || null;
  },

  async getPredictions(): Promise<AIPrediction> {
    try {
      const data = await fetchWithRetry(`${API_BASE}/predictions`);
      return data;
    } catch {}
    return {
      id: "PRED-2026-X8",
      model_version: "THANDER-Nowcast-Phase4-v2.4.0",
      is_prototype: true,
      prototype_label: "Operational Prototype (Calibrated on Historical Radar/Lightning Mesonets)",
      generated_at: new Date().toISOString(),
      target_area: "Mumbai-Thane Convective Corridor",
      current_severity: "SEVERE",
      overall_confidence: 0.92,
      primary_explanation: "Multimodal fusion indicates high probability of severe lightning strikes and localized microburst gusts over the next 15–45 minutes driven by active supercell updrafts.",
      horizons: [
        { horizon_min: 15, thunderstorm_prob: 0.94, lightning_prob: 0.91, hail_prob: 0.35, wind_gust_kmh: 68.0, severity: "SEVERE", confidence: 0.95, uncertainty_lower: 0.86, uncertainty_upper: 0.97 },
        { horizon_min: 30, thunderstorm_prob: 0.89, lightning_prob: 0.85, hail_prob: 0.28, wind_gust_kmh: 62.0, severity: "SEVERE", confidence: 0.91, uncertainty_lower: 0.79, uncertainty_upper: 0.93 },
        { horizon_min: 60, thunderstorm_prob: 0.76, lightning_prob: 0.68, hail_prob: 0.15, wind_gust_kmh: 50.0, severity: "HIGH", confidence: 0.84, uncertainty_lower: 0.64, uncertainty_upper: 0.84 },
        { horizon_min: 90, thunderstorm_prob: 0.58, lightning_prob: 0.44, hail_prob: 0.05, wind_gust_kmh: 38.0, severity: "MODERATE", confidence: 0.74, uncertainty_lower: 0.42, uncertainty_upper: 0.69 }
      ],
      contributions: [
        { feature: "radar_reflectivity_trend", display_name: "Radar Vertical Reflectivity Growth (+14.2 dBZ/hr)", contribution: 0.38, description: "Rapid surge in core reflectivity exceeding 55 dBZ indicates intense updraft and hydrometeor suspension.", influence: "positive" },
        { feature: "cloud_top_cooling", display_name: "Satellite IR Cloud-Top Cooling (-18.5°C/hr)", contribution: 0.26, description: "Thermal infrared signatures show rapid tropospheric cloud expansion reaching -72°C overshooting tops.", influence: "positive" },
        { feature: "cape_instability", display_name: "Atmospheric Instability (CAPE: 2,840 J/kg)", contribution: 0.22, description: "High CAPE and modest CIN (-24 J/kg) provide abundant thermodynamic buoyancy for sustained convection.", influence: "positive" },
        { feature: "ground_lightning_density", display_name: "WWLLN First-Flash Rate (42.8 strikes/min)", contribution: 0.18, description: "High frequency of negative cloud-to-ground strikes confirms active charge separation in the mixed-phase zone.", influence: "positive" },
        { feature: "boundary_layer_inversion", display_name: "Mid-Level Dry Air Entrainment", contribution: -0.09, description: "700 hPa dry slot exerts slight negative drag on peripheral cell expansion.", influence: "negative" }
      ]
    };
  },

  async getLightning() {
    try {
      const data = await fetchWithRetry(`${API_BASE}/lightning`);
      return data;
    } catch {}
    return {
      timestamp: new Date().toISOString(),
      summary: {
        strikes_10m: 428,
        strike_rate_per_min: 42.8,
        positive_cg_pct: 14.2,
        negative_cg_pct: 68.5,
        intra_cloud_pct: 17.3,
        first_flash_detected: true,
        active_clusters: 3,
        status: "Online"
      },
      recent_strikes: [
        { id: "LS-101", timestamp: "17:44:52", lat: 19.14, lon: 73.20, polarity: "Negative (-CG)", peak_current_ka: -34.2, distance_km: 12.4 },
        { id: "LS-102", timestamp: "17:44:48", lat: 19.11, lon: 73.17, polarity: "Negative (-CG)", peak_current_ka: -28.6, distance_km: 9.8 },
        { id: "LS-103", timestamp: "17:44:31", lat: 19.16, lon: 73.22, polarity: "Positive (+CG)", peak_current_ka: +84.5, distance_km: 14.1 },
        { id: "LS-104", timestamp: "17:44:15", lat: 18.66, lon: 73.64, polarity: "Intra-Cloud (IC)", peak_current_ka: -14.0, distance_km: 42.0 },
        { id: "LS-105", timestamp: "17:43:58", lat: 18.64, lon: 73.61, polarity: "Negative (-CG)", peak_current_ka: -41.2, distance_km: 40.5 },
        { id: "LS-106", timestamp: "17:43:40", lat: 19.09, lon: 73.15, polarity: "Negative (-CG)", peak_current_ka: -22.1, distance_km: 8.5 }
      ],
      clusters: [
        { id: "CL-01", center_lat: 19.14, center_lon: 73.19, radius_km: 8.5, strike_count: 284, activity_level: "Severe" },
        { id: "CL-02", center_lat: 18.66, center_lon: 73.63, radius_km: 6.2, strike_count: 118, activity_level: "High" },
        { id: "CL-03", center_lat: 19.54, center_lon: 72.94, radius_km: 4.8, strike_count: 26, activity_level: "Isolated" }
      ],
      trend_history: [
        { time: "17:00", strikes_per_min: 6.2 },
        { time: "17:10", strikes_per_min: 14.5 },
        { time: "17:20", strikes_per_min: 28.1 },
        { time: "17:30", strikes_per_min: 39.4 },
        { time: "17:40", strikes_per_min: 44.8 },
        { time: "17:45", strikes_per_min: 42.8 }
      ]
    };
  },

  async getRadar() {
    try {
      const data = await fetchWithRetry(`${API_BASE}/radar`);
      return data;
    } catch {}
    return {
      timestamp: new Date().toISOString(),
      selected_mode: "reflectivity",
      stations: [
        { code: "VABB", name: "Mumbai Doppler Radar (S-Band)", lat: 18.91, lon: 72.81, status: "Active", range_km: 250, wavelength: "S-band (10cm)" },
        { code: "VIDP", name: "Delhi Doppler Radar (C-Band)", lat: 28.56, lon: 77.10, status: "Active", range_km: 250, wavelength: "C-band (5cm)" },
        { code: "VOMM", name: "Chennai Doppler Radar (S-Band)", lat: 13.08, lon: 80.28, status: "Active", range_km: 250, wavelength: "S-band (10cm)" },
        { code: "VECC", name: "Kolkata Doppler Radar (S-Band)", lat: 22.65, lon: 88.45, status: "Active", range_km: 250, wavelength: "S-band (10cm)" },
        { code: "VAPO", name: "Pune Doppler Radar (X-Band)", lat: 18.52, lon: 73.85, status: "Active", range_km: 150, wavelength: "X-band (3cm)" }
      ],
      composite_available: true,
      max_composite_dbz: 58.5,
      data_freshness_sec: 120
    };
  },

  async getSatellite() {
    try {
      const data = await fetchWithRetry(`${API_BASE}/satellite`);
      return data;
    } catch {}
    return {
      timestamp: new Date().toISOString(),
      product: {
        satellite_name: "INSAT-3D",
        channel: "10.8µm Thermal IR Clean Window",
        timestamp: new Date().toISOString(),
        min_cloud_temp_c: -72.4,
        rapid_cooling_detected: true,
        cloud_top_trend_c_per_hr: -18.5,
        overshooting_tops: 3,
        status: "Online"
      },
      layers: ["Thermal Infrared (10.8µm)", "Visible Cloud Reflectance", "Water Vapor (6.7µm)", "Convective Storm RGB Composite"],
      region: "South Asia / Indian Subcontinent & Coastal Waters"
    };
  },

  async getAtmosphere() {
    try {
      const data = await fetchWithRetry(`${API_BASE}/atmosphere`);
      return data;
    } catch {}
    return {
      timestamp: new Date().toISOString(),
      instability: {
        cape_j_kg: 2840.0,
        cin_j_kg: -24.0,
        lifted_index: -6.8,
        k_index: 38.5,
        bulk_shear_0_6km_kts: 36.0,
        precipitable_water_mm: 54.2,
        freezing_level_m: 4850,
        interpretation: "High convective instability; supportive of organized multicell/supercell storms",
        status: "Online"
      },
      surface: {
        surface_temp_c: 33.6,
        dew_point_c: 26.2,
        relative_humidity_pct: 74,
        pressure_hpa: 1004.2,
        wind_speed_kmh: 28,
        wind_gust_kmh: 62,
        wind_dir_deg: 240,
        status: "Online"
      },
      sounding_levels: [
        { pressure_hpa: 1000, height_m: 80, temp_c: 33.6, dew_point_c: 26.2, wind_speed_kts: 14, wind_dir_deg: 240 },
        { pressure_hpa: 850, height_m: 1520, temp_c: 22.4, dew_point_c: 19.8, wind_speed_kts: 22, wind_dir_deg: 250 },
        { pressure_hpa: 700, height_m: 3180, temp_c: 11.2, dew_point_c: 4.5, wind_speed_kts: 28, wind_dir_deg: 265 },
        { pressure_hpa: 500, height_m: 5880, temp_c: -6.4, dew_point_c: -12.1, wind_speed_kts: 36, wind_dir_deg: 280 },
        { pressure_hpa: 300, height_m: 9680, temp_c: -32.5, dew_point_c: -44.0, wind_speed_kts: 55, wind_dir_deg: 290 },
        { pressure_hpa: 200, height_m: 12420, temp_c: -54.0, dew_point_c: -68.0, wind_speed_kts: 68, wind_dir_deg: 295 }
      ]
    };
  },

  async getAlerts(): Promise<WeatherAlert[]> {
    try {
      const data = await fetchWithRetry(`${API_BASE}/alerts`);
      return data.alerts || data;
    } catch {}
    return localAlerts;
  },

  async acknowledgeAlert(id: string) {
    try {
      const data = await fetchWithRetry(`${API_BASE}/alerts/${id}/ack`, { method: 'POST' });
      return data;
    } catch {}
    localAlerts = localAlerts.map(a => a.id === id ? { ...a, status: 'acknowledged' as const } : a);
    return { status: "success", alert_id: id, state: "acknowledged" };
  },

  async getLocations(): Promise<SavedLocation[]> {
    try {
      const data = await fetchWithRetry(`${API_BASE}/locations`);
      return data;
    } catch {}
    return localLocations;
  },

  async addLocation(loc: Partial<SavedLocation>): Promise<SavedLocation> {
    try {
      const data = await fetchWithRetry(`${API_BASE}/locations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loc)
      });
      return data;
    } catch {}
    const newLoc: SavedLocation = {
      id: `LOC-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      name: loc.name || "Custom Geofence",
      category: (loc.category as any) || "Custom",
      lat: Number(loc.lat) || 19.0,
      lon: Number(loc.lon) || 73.0,
      radius_km: Number(loc.radius_km) || 10,
      notification_threshold: loc.notification_threshold || "MODERATE_PLUS",
      quiet_hours_enabled: !!loc.quiet_hours_enabled,
      quiet_hours_start: loc.quiet_hours_start || "22:00",
      quiet_hours_end: loc.quiet_hours_end || "06:00",
      channels: loc.channels || ["In-App"],
      active: true,
      created_at: new Date().toISOString()
    };
    localLocations = [newLoc, ...localLocations];
    return newLoc;
  },

  async deleteLocation(id: string) {
    try {
      const data = await fetchWithRetry(`${API_BASE}/locations/${id}`, { method: 'DELETE' });
      return data;
    } catch {}
    localLocations = localLocations.filter(l => l.id !== id);
    return { status: "deleted", id };
  },

  async getDataHealth(): Promise<SystemHealthReport> {
    try {
      const data = await fetchWithRetry(`${API_BASE}/data-health`);
      return data;
    } catch {}
    const missing = localHealthSources.filter(s => s.status !== 'Online').map(s => s.name);
    return {
      overall_status: missing.length === 0 ? "All systems operational" : "Partial data outage",
      system_quality_score: Math.round(localHealthSources.reduce((acc, s) => acc + s.quality_pct, 0) / localHealthSources.length),
      active_pathway: missing.length === 0 ? "Full Multimodal Deep Fusion (Phase 4)" : "Reduced Input Pathway",
      confidence_penalty: missing.length * 0.12,
      missing_sources: missing,
      adapters: localHealthSources
    };
  },

  async toggleSourceHealth(sourceName: string, healthy: boolean) {
    try {
      const data = await fetchWithRetry(`${API_BASE}/data-health/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: sourceName, healthy })
      });
      return data;
    } catch {}
    localHealthSources = localHealthSources.map(s => {
      if (s.name.toLowerCase().includes(sourceName.toLowerCase()) || s.type.toLowerCase().includes(sourceName.toLowerCase())) {
        return {
          ...s,
          status: healthy ? "Online" as const : "Offline" as const,
          quality_pct: healthy ? 95 : 0,
          action: healthy ? "Normal" : "Fallback to reduced pathway"
        };
      }
      return s;
    });
    return this.getDataHealth();
  },

  async getAnalytics() {
    try {
      const data = await fetchWithRetry(`${API_BASE}/analytics`);
      return data;
    } catch {}
    return {
      timestamp: new Date().toISOString(),
      headline_metrics: {
        pod: 0.892,
        far: 0.138,
        csi: 0.784,
        brier_score: 0.082,
        average_lead_time_min: 52.4,
        inference_latency_ms: 84,
        verification_events_evaluated: 1420
      },
      monthly_trend: [
        { month: "May", pod: 0.85, far: 0.17, csi: 0.73, lead_time_min: 44 },
        { month: "Jun", pod: 0.87, far: 0.15, csi: 0.76, lead_time_min: 48 },
        { month: "Jul", pod: 0.90, far: 0.14, csi: 0.79, lead_time_min: 54 },
        { month: "Aug", pod: 0.91, far: 0.13, csi: 0.80, lead_time_min: 55 },
        { month: "Sep", pod: 0.89, far: 0.14, csi: 0.78, lead_time_min: 52 }
      ],
      calibration_curve: [
        { forecast_prob: 0.1, observed_freq: 0.09, samples: 420 },
        { forecast_prob: 0.2, observed_freq: 0.21, samples: 380 },
        { forecast_prob: 0.3, observed_freq: 0.32, samples: 310 },
        { forecast_prob: 0.4, observed_freq: 0.39, samples: 290 },
        { forecast_prob: 0.5, observed_freq: 0.51, samples: 240 },
        { forecast_prob: 0.6, observed_freq: 0.62, samples: 210 },
        { forecast_prob: 0.7, observed_freq: 0.68, samples: 180 },
        { forecast_prob: 0.8, observed_freq: 0.79, samples: 150 },
        { forecast_prob: 0.9, observed_freq: 0.88, samples: 110 },
        { forecast_prob: 1.0, observed_freq: 0.94, samples: 85 }
      ],
      lead_time_distribution: [
        { lead_time_bucket: "15-30 min", csi: 0.88, accuracy: 0.92 },
        { lead_time_bucket: "30-45 min", csi: 0.82, accuracy: 0.87 },
        { lead_time_bucket: "45-60 min", csi: 0.76, accuracy: 0.81 },
        { lead_time_bucket: "60-75 min", csi: 0.69, accuracy: 0.74 },
        { lead_time_bucket: "75-90 min", csi: 0.58, accuracy: 0.65 }
      ]
    };
  },

  async getReplayEvents(): Promise<ReplayEvent[]> {
    try {
      const data = await fetchWithRetry(`${API_BASE}/replay`);
      return data;
    } catch {}
    return [
      {
        id: "EVT-2024-DELHI",
        name: "Delhi Severe Squall Line & Dust-Thunderstorm",
        date: "May 10, 2024",
        region: "NCR & Northern Plains",
        description: "Intense convective squall line with surface wind gusts of 82 km/h, over 1,200 lightning strikes in 45 minutes, and heavy rainfall.",
        total_frames: 8,
        frame_interval_min: 10,
        lead_time_achieved_min: 52,
        metrics: {
          pod: 0.91,
          far: 0.14,
          csi: 0.79,
          brier_score: 0.088,
          average_lead_time_min: 48.5,
          inference_latency_ms: 78,
          sample_size: 240
        },
        frames: [
          { frame_index: 0, time_label: "T-60m", observed_dbz: 24, predicted_dbz: 22, observed_strikes: 12, predicted_prob: 0.28, event_notes: "Boundary layer convergence detected; cumulus cloud top cooling." },
          { frame_index: 1, time_label: "T-50m", observed_dbz: 35, predicted_dbz: 38, observed_strikes: 48, predicted_prob: 0.54, event_notes: "Rapid vertical development, updraft velocity exceeds 18 m/s." },
          { frame_index: 2, time_label: "T-40m", observed_dbz: 46, predicted_dbz: 48, observed_strikes: 180, predicted_prob: 0.78, event_notes: "First flash event recorded. AI nowcast elevated to High." },
          { frame_index: 3, time_label: "T-30m", observed_dbz: 54, predicted_dbz: 55, observed_strikes: 420, predicted_prob: 0.93, event_notes: "Severe warning issued. Core reflectivity reaches 55 dBZ." },
          { frame_index: 4, time_label: "T-20m", observed_dbz: 59, predicted_dbz: 58, observed_strikes: 640, predicted_prob: 0.96, event_notes: "Peak intensity. Gust front outflow initiates secondary squalls." },
          { frame_index: 5, time_label: "T-10m", observed_dbz: 56, predicted_dbz: 54, observed_strikes: 510, predicted_prob: 0.91, event_notes: "Squall line moving east-southeast at 48 km/h." },
          { frame_index: 6, time_label: "T+0m (Event)", observed_dbz: 52, predicted_dbz: 50, observed_strikes: 340, predicted_prob: 0.84, event_notes: "Impact on target metropolitan area matches forecast polygon within 1.8km." },
          { frame_index: 7, time_label: "T+15m", observed_dbz: 41, predicted_dbz: 39, observed_strikes: 120, predicted_prob: 0.45, event_notes: "System entering dissipating stratiform stage." }
        ]
      },
      {
        id: "EVT-2023-BIPARJOY",
        name: "Cyclone Biparjoy Convective Spiral Bands",
        date: "June 14, 2023",
        region: "Gujarat & Western Coast",
        description: "Outer rainband thunderstorm clusters with localized tornadic shear and extreme lightning density.",
        total_frames: 6,
        frame_interval_min: 15,
        lead_time_achieved_min: 64,
        metrics: {
          pod: 0.88,
          far: 0.18,
          csi: 0.74,
          brier_score: 0.104,
          average_lead_time_min: 58.0,
          inference_latency_ms: 92,
          sample_size: 380
        },
        frames: [
          { frame_index: 0, time_label: "T-60m", observed_dbz: 32, predicted_dbz: 30, observed_strikes: 35, predicted_prob: 0.42, event_notes: "Spiral band approaching coastline." },
          { frame_index: 1, time_label: "T-45m", observed_dbz: 44, predicted_dbz: 46, observed_strikes: 140, predicted_prob: 0.68, event_notes: "Embedded convection strengthening." },
          { frame_index: 2, time_label: "T-30m", observed_dbz: 52, predicted_dbz: 54, observed_strikes: 310, predicted_prob: 0.89, event_notes: "Severe microburst signature on Doppler velocity." },
          { frame_index: 3, time_label: "T-15m", observed_dbz: 56, predicted_dbz: 57, observed_strikes: 520, predicted_prob: 0.94, event_notes: "Peak lightning activity." },
          { frame_index: 4, time_label: "T+0m", observed_dbz: 54, predicted_dbz: 53, observed_strikes: 480, predicted_prob: 0.90, event_notes: "Coastal landfall of convective core." },
          { frame_index: 5, time_label: "T+15m", observed_dbz: 47, predicted_dbz: 46, observed_strikes: 260, predicted_prob: 0.72, event_notes: "Interaction with coastal terrain." }
        ]
      }
    ];
  },

  async getAuditLogs(): Promise<AuditLogEntry[]> {
    try {
      const data = await fetchWithRetry(`${API_BASE}/admin/audit-logs`);
      return data;
    } catch {}
    return [
      { id: "AUD-501", timestamp: new Date(Date.now() - 60000).toISOString(), user_id: "usr-admin-01", user_role: "Admin", action: "CONNECTOR_SYNC", target_resource: "RadarAdapter:VABB", details: "Automatic 5-min radar ingest completed. 100% ray coverage.", ip_address: "127.0.0.1" },
      { id: "AUD-502", timestamp: new Date(Date.now() - 300000).toISOString(), user_id: "usr-operator-04", user_role: "Operator", action: "ALERT_DISPATCH", target_resource: "ALT-2026-905", details: "High-risk squall alert issued to Pune northwest polygon.", ip_address: "192.168.1.45" },
      { id: "AUD-503", timestamp: new Date(Date.now() - 600000).toISOString(), user_id: "usr-system", user_role: "System", action: "MODEL_INFERENCE", target_resource: "Nowcast_Phase4_v2.4", details: "Multimodal inference cycle completed in 84ms. 3 cells tracked.", ip_address: "localhost" },
      { id: "AUD-504", timestamp: new Date(Date.now() - 900000).toISOString(), user_id: "usr-analyst-02", user_role: "Analyst", action: "VERIFICATION_LOG", target_resource: "ST-2026-001", details: "Cell centroid aligned with ground radar at 98.2% correlation.", ip_address: "192.168.1.88" }
    ];
  },

  async switchScenario(scenario: "developing" | "intensifying" | "decaying") {
    try {
      const data = await fetchWithRetry(`${API_BASE}/admin/switch-scenario`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario })
      });
      return data;
    } catch {}
    if (scenario === 'developing') {
      localStorms = SEED_STORMS.filter(s => s.status === 'Developing');
    } else if (scenario === 'decaying') {
      localStorms = SEED_STORMS.filter(s => s.status === 'Decaying');
    } else {
      localStorms = [...SEED_STORMS];
    }
    return { status: "success", active_scenario: scenario, count: localStorms.length };
  },

  async getCurrentWeather(lat: number = 19.9975, lon: number = 73.7898) {
    try {
      const data = await fetchWithRetry(`${API_BASE}/weather/current?lat=${lat}&lon=${lon}`);
      return data;
    } catch (e) {
      console.error("Failed to fetch real weather data:", e);
      return {
        temperature_c: 33.6, humidity_pct: 74, pressure_hpa: 1004.2, wind_speed_kmh: 26, precipitation_mm: 8.5
      };
    }
  },

  async searchLocations(query: string) {
    try {
      const data = await fetchWithRetry(`${API_BASE}/location/search?q=${encodeURIComponent(query)}`);
      return data;
    } catch (e) {
      console.error("Location search failed:", e);
      return [];
    }
  },

  async reverseGeocode(lat: number, lon: number) {
    try {
      const data = await fetchWithRetry(`${API_BASE}/location/reverse?lat=${lat}&lon=${lon}`);
      return data;
    } catch (e) {
      console.error("Reverse geocode failed:", e);
      return {
        name: "Unknown Location",
        lat,
        lon,
        state: ""
      };
    }
  }
};
