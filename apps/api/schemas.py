from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime

# Common
class Geometry(BaseModel):
    type: str = "Point"
    coordinates: List[float]  # [lon, lat] or [[lon, lat], ...] for Polygon

class PolygonGeometry(BaseModel):
    type: str = "Polygon"
    coordinates: List[List[List[float]]]

# Storm & Digital Twin
class StormVector(BaseModel):
    direction_deg: float
    speed_kmh: float

class StormTrackPoint(BaseModel):
    timestamp: str
    lat: float
    lon: float
    intensity_dbz: float
    is_forecast: bool = False
    horizon_min: int = 0

class StormCell(BaseModel):
    id: str  # e.g., "ST-2026-001"
    name: str
    status: str  # "Active", "Intensifying", "Weakening", "Split", "Merged"
    severity: str  # "LOW", "MODERATE", "HIGH", "SEVERE"
    lat: float
    lon: float
    intensity_dbz: float
    vert_extent_km: float
    speed_kmh: float
    direction_deg: float
    growth_rate_dbz_hr: float
    affected_area_sqkm: float
    first_seen: str
    last_seen: str
    track: List[StormTrackPoint]
    affected_polygon: PolygonGeometry
    forecast_positions: List[Dict[str, Any]]
    split_merge_event: Optional[str] = None

# AI Prediction
class FeatureContribution(BaseModel):
    feature: str
    display_name: str
    contribution: float  # -1.0 to 1.0 (SHAP value style)
    description: str
    influence: str  # "positive" (increases risk) or "negative" (dampens risk)

class HorizonPrediction(BaseModel):
    horizon_min: int  # 15, 30, 60, 90
    thunderstorm_prob: float
    lightning_prob: float
    hail_prob: float
    wind_gust_kmh: float
    severity: str
    confidence: float
    uncertainty_lower: float
    uncertainty_upper: float

class AIPrediction(BaseModel):
    id: str
    model_version: str
    generated_at: str
    target_area: str
    current_severity: str
    overall_confidence: float
    primary_explanation: str
    horizons: List[HorizonPrediction]
    contributions: List[FeatureContribution]
    is_prototype: bool = True

# Lightning
class LightningStrike(BaseModel):
    id: str
    timestamp: str
    lat: float
    lon: float
    polarity: str  # "Negative (-CG)" or "Positive (+CG)" or "Intra-Cloud (IC)"
    peak_current_ka: float
    distance_km: float

class LightningCluster(BaseModel):
    id: str
    center_lat: float
    center_lon: float
    radius_km: float
    strike_count: int
    activity_level: str  # "High", "Moderate", "Isolated"

class LightningFeed(BaseModel):
    strikes_last_10m: int
    strike_rate_per_min: float
    positive_percentage: float
    negative_percentage: float
    intra_cloud_percentage: float
    first_flash_detected: bool
    first_flash_time: Optional[str] = None
    recent_strikes: List[LightningStrike]
    clusters: List[LightningCluster]
    trend_history: List[Dict[str, Any]]

# Radar & Satellite
class RadarStation(BaseModel):
    code: str
    name: str
    lat: float
    lon: float
    status: str
    range_km: int
    wavelength: str

class RadarFrame(BaseModel):
    id: str
    timestamp: str
    mode: str  # "reflectivity" or "velocity"
    composite: bool
    station_code: Optional[str] = None
    data_quality_score: float
    freshness_sec: int
    storm_overlays: List[Dict[str, Any]]

class SatelliteProduct(BaseModel):
    product_type: str  # "Infrared 10.8µm" or "Visible 0.6µm" or "Water Vapor"
    timestamp: str
    satellite_name: str  # "INSAT-3D" / "GOES-16"
    min_cloud_temp_c: float
    rapid_cooling_detected: bool
    overshooting_tops: int
    freshness_sec: int

# Atmosphere / Sounding
class AtmosphereProfile(BaseModel):
    station: str
    timestamp: str
    cape_j_kg: float
    cin_j_kg: float
    lifted_index: float
    k_index: float
    precipitable_water_mm: float
    bulk_shear_0_6km_kts: float
    freezing_level_m: int
    risk_interpretation: str
    levels: List[Dict[str, Any]]

# Alerts
class WeatherAlert(BaseModel):
    id: str
    title: str
    severity: str  # "MODERATE", "HIGH", "SEVERE", "EXTREME"
    status: str  # "active", "acknowledged", "expired"
    target_area: str
    coordinates: List[float]
    created_at: str
    expires_at: str
    probability: float
    reason: str
    recommended_action: str
    official_source_disclaimer: str
    data_timestamp: str

# Saved Geofenced Locations
class SavedLocation(BaseModel):
    id: str
    name: str
    category: str  # "Home", "Farm", "Campus", "School", "Airport", "Custom"
    lat: float
    lon: float
    radius_km: float
    notification_threshold: str  # "ALL", "MODERATE_PLUS", "HIGH_ONLY", "SEVERE_ONLY"
    quiet_hours_enabled: bool
    quiet_hours_start: str
    quiet_hours_end: str
    channels: List[str]
    active: bool = True
    created_at: str

# Data Health & Diagnostics
class DataSourceHealth(BaseModel):
    name: str
    type: str  # "Radar", "Satellite", "Lightning", "Atmosphere", "Weather"
    status: str  # "Online", "Delayed", "Offline", "Degraded"
    freshness_min: float
    quality_pct: float
    action: str  # "Normal", "Use with warning", "Fallback to synthetic/reduced"
    endpoint_latency_ms: int
    is_synthetic: bool = False

class SystemHealthReport(BaseModel):
    overall_status: str  # "All systems operational", "Partial data outage", "Prediction degraded", "Prediction unavailable"
    system_quality_score: float
    sources: List[DataSourceHealth]
    missing_sources: List[str]
    active_pathway: str  # "Full Multimodal Fusion", "Reduced Input (Radar + Sat)", "Atmospheric Fallback"
    confidence_penalty_applied: float

# Analytics & Verification
class ModelMetrics(BaseModel):
    pod: float  # Probability of Detection (Hit rate)
    far: float  # False Alarm Ratio
    csi: float  # Critical Success Index (Threat Score)
    brier_score: float
    average_lead_time_min: float
    inference_latency_ms: int
    sample_size: int

class ModelVersionInfo(BaseModel):
    version: str
    name: str
    dataset_version: str
    trained_date: str
    evaluation_period: str
    state: str  # "production", "staging", "draft"
    metrics: ModelMetrics

class CalibrationPoint(BaseModel):
    forecast_probability: float
    observed_frequency: float
    sample_count: int

# Replay
class ReplayEvent(BaseModel):
    id: str
    name: str
    date: str
    region: str
    description: str
    total_frames: int
    frame_interval_min: int
    lead_time_achieved_min: int
    metrics: ModelMetrics
    frames: List[Dict[str, Any]]

# Admin & Audit
class AuditLogEntry(BaseModel):
    id: str
    timestamp: str
    user_id: str
    user_role: str
    action: str
    target_resource: str
    details: str
    ip_address: str
