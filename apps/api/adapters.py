import time
from typing import Dict, Any, List
from datetime import datetime, timezone

class BaseAdapter:
    def __init__(self, name: str, source_type: str):
        self.name = name
        self.source_type = source_type
        self.is_healthy = True
        self.is_synthetic = True
        self.last_sync = datetime.now(timezone.utc).isoformat()
        self.quality = 0.95

    def get_status(self) -> Dict[str, Any]:
        return {
            "name": self.name,
            "type": self.source_type,
            "status": "Online" if self.is_healthy else "Offline",
            "freshness_min": 2.5 if self.is_healthy else 45.0,
            "quality_pct": round(self.quality * 100, 1) if self.is_healthy else 0.0,
            "action": "Normal" if self.is_healthy else "Fallback to reduced pathway",
            "endpoint_latency_ms": 110 if self.is_healthy else 5000,
            "is_synthetic": self.is_synthetic
        }

class RadarAdapter(BaseAdapter):
    def __init__(self):
        super().__init__("IMD Doppler Radar Network (Composite)", "Radar")
        self.stations = [
            {"code": "VABB", "name": "Mumbai Doppler Radar (S-Band)", "lat": 18.91, "lon": 72.81, "status": "Active", "range_km": 250},
            {"code": "VIDP", "name": "Delhi Doppler Radar (C-Band)", "lat": 28.56, "lon": 77.10, "status": "Active", "range_km": 250},
            {"code": "VOMM", "name": "Chennai Doppler Radar (S-Band)", "lat": 13.08, "lon": 80.28, "status": "Active", "range_km": 250},
            {"code": "VECC", "name": "Kolkata Doppler Radar (S-Band)", "lat": 22.65, "lon": 88.45, "status": "Active", "range_km": 250},
            {"code": "VAPO", "name": "Pune Doppler Radar (X-Band)", "lat": 18.52, "lon": 73.85, "status": "Active", "range_km": 150}
        ]

    def fetch_frames(self) -> List[Dict[str, Any]]:
        now = datetime.now(timezone.utc).isoformat()
        return [
            {
                "id": f"RAD-F-{i}",
                "timestamp": now,
                "minute_offset": -i * 5,
                "mode": "reflectivity",
                "composite": True,
                "max_dbz": 54.5 - (i * 1.5),
                "echo_top_km": 14.8 - (i * 0.4),
                "data_quality_score": self.quality if self.is_healthy else 0.0
            }
            for i in range(6)
        ]

class SatelliteAdapter(BaseAdapter):
    def __init__(self):
        super().__init__("INSAT-3D Convective RGB / Thermal IR", "Satellite")
        self.channel = "10.8µm Clean IR"

    def fetch_latest(self) -> Dict[str, Any]:
        return {
            "satellite_name": "INSAT-3D",
            "channel": self.channel,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "min_cloud_temp_c": -72.4,
            "rapid_cooling_detected": True,
            "cloud_top_trend_c_per_hr": -18.5,
            "overshooting_tops": 3,
            "status": "Online" if self.is_healthy else "Offline"
        }

class LightningAdapter(BaseAdapter):
    def __init__(self):
        super().__init__("Ground Precision Lightning Network (WWLLN / TLN)", "Lightning")

    def fetch_strikes(self) -> Dict[str, Any]:
        return {
            "strikes_10m": 428,
            "strike_rate_per_min": 42.8,
            "positive_cg_pct": 14.2,
            "negative_cg_pct": 68.5,
            "intra_cloud_pct": 17.3,
            "first_flash_detected": True,
            "active_clusters": 3,
            "status": "Online" if self.is_healthy else "Offline"
        }

class AtmosphereAdapter(BaseAdapter):
    def __init__(self):
        super().__init__("ECMWF / IMD GFS Radiosonde & NWP Model", "Atmosphere")

    def fetch_instability(self) -> Dict[str, Any]:
        return {
            "cape_j_kg": 2840.0,
            "cin_j_kg": -24.0,
            "lifted_index": -6.8,
            "k_index": 38.5,
            "bulk_shear_0_6km_kts": 36.0,
            "precipitable_water_mm": 54.2,
            "freezing_level_m": 4850,
            "interpretation": "High convective instability; supportive of organized multicell/supercell storms",
            "status": "Online" if self.is_healthy else "Offline"
        }

class WeatherAdapter(BaseAdapter):
    def __init__(self):
        super().__init__("Automated Surface Weather Station Mesonet", "Weather")

    def fetch_surface(self) -> Dict[str, Any]:
        return {
            "surface_temp_c": 33.6,
            "dew_point_c": 26.2,
            "relative_humidity_pct": 74,
            "pressure_hpa": 1004.2,
            "wind_speed_kmh": 28,
            "wind_gust_kmh": 62,
            "wind_dir_deg": 240,
            "status": "Online" if self.is_healthy else "Offline"
        }

class DataFusionEngine:
    """
    Multimodal Data Fusion Engine conforming to Section 6 & 12 of THANDER AI spec.
    Fuses Radar, Satellite, Lightning, Atmospheric Sounding, and Weather.
    Implements self-healing fallbacks when sensors fail.
    """
    def __init__(self):
        self.radar = RadarAdapter()
        self.satellite = SatelliteAdapter()
        self.lightning = LightningAdapter()
        self.atmosphere = AtmosphereAdapter()
        self.weather = WeatherAdapter()

    def set_source_health(self, source_name: str, healthy: bool):
        source_map = {
            "radar": self.radar,
            "satellite": self.satellite,
            "lightning": self.lightning,
            "atmosphere": self.atmosphere,
            "weather": self.weather
        }
        src = source_map.get(source_name.lower())
        if src:
            src.is_healthy = healthy
            src.quality = 0.95 if healthy else 0.0

    def generate_fusion_object(self) -> Dict[str, Any]:
        sources = [self.radar, self.satellite, self.lightning, self.atmosphere, self.weather]
        missing = [s.name for s in sources if not s.is_healthy]
        
        # Self-healing logic
        if not missing:
            active_pathway = "Full Multimodal Deep Fusion (Phase 4)"
            overall_status = "All systems operational"
            conf_penalty = 0.0
        elif "Lightning" in str(missing) and len(missing) == 1:
            active_pathway = "Reduced Input Pathway (Radar + Satellite + Sounding)"
            overall_status = "Partial data outage (Lightning offline)"
            conf_penalty = 0.12
        elif "Radar" in str(missing):
            active_pathway = "Degraded Satellite-Atmospheric Nowcast Pathway"
            overall_status = "Prediction degraded (Radar offline)"
            conf_penalty = 0.28
        else:
            active_pathway = "Heuristic Contingency Model"
            overall_status = "Severe data outage"
            conf_penalty = 0.45

        total_quality = sum(s.quality for s in sources) / len(sources)

        return {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "overall_status": overall_status,
            "system_quality_score": round(total_quality * 100, 1),
            "active_pathway": active_pathway,
            "confidence_penalty": conf_penalty,
            "missing_sources": missing,
            "adapters": [s.get_status() for s in sources]
        }

fusion_engine = DataFusionEngine()
