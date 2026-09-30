export type SeverityLevel = "LOW" | "MODERATE" | "HIGH" | "SEVERE" | "EXTREME";

export type ForecastHorizon = 15 | 30 | 60 | 90;

export interface StormTrackPoint {
  timestamp: string;
  lat: number;
  lon: number;
  intensity_dbz: number;
  is_forecast: boolean;
  horizon_min: number;
}

export interface StormCell {
  id: string;
  name: string;
  status: "Active" | "Developing" | "Intensifying" | "Decaying" | "Split" | "Merged";
  severity: SeverityLevel;
  lat: number;
  lon: number;
  intensity_dbz: number;
  vert_extent_km: number;
  speed_kmh: number;
  direction_deg: number;
  growth_rate_dbz_hr: number;
  affected_area_sqkm: number;
  first_seen: string;
  last_seen: string;
  split_merge_event?: string;
  track: StormTrackPoint[];
  forecast_positions: {
    horizon_min: number;
    lat: number;
    lon: number;
    prob: number;
    severity: SeverityLevel;
  }[];
  affected_polygon?: {
    type: string;
    coordinates: number[][][];
  };
}

export interface FeatureContribution {
  feature: string;
  display_name: string;
  contribution: number; // e.g. 0.38
  description: string;
  influence: "positive" | "negative";
}

export interface HorizonPrediction {
  horizon_min: ForecastHorizon;
  thunderstorm_prob: number;
  lightning_prob: number;
  hail_prob: number;
  wind_gust_kmh: number;
  severity: SeverityLevel;
  confidence: number;
  uncertainty_lower: number;
  uncertainty_upper: number;
}

export interface AIPrediction {
  id: string;
  model_version: string;
  is_prototype: boolean;
  prototype_label: string;
  generated_at: string;
  target_area: string;
  current_severity: SeverityLevel;
  overall_confidence: number;
  primary_explanation: string;
  horizons: HorizonPrediction[];
  contributions: FeatureContribution[];
}

export interface LightningStrike {
  id: string;
  timestamp: string;
  lat: number;
  lon: number;
  polarity: string;
  peak_current_ka: number;
  distance_km: number;
}

export interface LightningCluster {
  id: string;
  center_lat: number;
  center_lon: number;
  radius_km: number;
  strike_count: number;
  activity_level: string;
}

export interface WeatherAlert {
  id: string;
  title: string;
  severity: SeverityLevel;
  status: "active" | "acknowledged" | "expired";
  target_area: string;
  coordinates: [number, number];
  created_at: string;
  expires_at: string;
  probability: number;
  reason: string;
  recommended_action: string;
  official_source_disclaimer: string;
  data_timestamp: string;
}

export interface SavedLocation {
  id: string;
  name: string;
  category: "Home" | "Farm" | "Campus" | "School" | "Airport" | "Custom";
  lat: number;
  lon: number;
  radius_km: number;
  notification_threshold: "ALL" | "MODERATE_PLUS" | "HIGH_ONLY" | "SEVERE_ONLY";
  quiet_hours_enabled: boolean;
  quiet_hours_start: string;
  quiet_hours_end: string;
  channels: string[];
  active: boolean;
  created_at: string;
}

export interface DataSourceHealth {
  name: string;
  type: string;
  status: "Online" | "Delayed" | "Offline" | "Degraded";
  freshness_min: number;
  quality_pct: number;
  action: string;
  endpoint_latency_ms: number;
  is_synthetic: boolean;
}

export interface SystemHealthReport {
  overall_status: string;
  system_quality_score: number;
  active_pathway: string;
  confidence_penalty: number;
  missing_sources: string[];
  adapters: DataSourceHealth[];
}

export interface ReplayEventFrame {
  frame_index: number;
  time_label: string;
  observed_dbz: number;
  predicted_dbz: number;
  observed_strikes: number;
  predicted_prob: number;
  event_notes: string;
}

export interface ReplayEvent {
  id: string;
  name: string;
  date: string;
  region: string;
  description: string;
  total_frames: number;
  frame_interval_min: number;
  lead_time_achieved_min: number;
  metrics: {
    pod: number;
    far: number;
    csi: number;
    brier_score: number;
    average_lead_time_min: number;
    inference_latency_ms: number;
    sample_size: number;
  };
  frames: ReplayEventFrame[];
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user_id: string;
  user_role: string;
  action: string;
  target_resource: string;
  details: string;
  ip_address: string;
}
