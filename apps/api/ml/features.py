"""
Feature extraction, normalization, and quality masking for THANDER AI nowcasting.
"""
from typing import Dict, Any, Tuple

def extract_and_normalize_features(raw_inputs: Dict[str, Any]) -> Tuple[Dict[str, float], float]:
    """
    Extracts multimodal features, normalizes them, and produces a data quality mask score (0.0 to 1.0).
    """
    radar = raw_inputs.get("radar_features", {})
    sat = raw_inputs.get("satellite_features", {})
    ltg = raw_inputs.get("lightning_features", {})
    atmo = raw_inputs.get("atmospheric_features", {})

    # Quality scoring based on feature availability
    quality_checks = [
        radar.get("dbz_max") is not None,
        sat.get("cloud_top_temp_c") is not None,
        ltg.get("strike_rate_per_min") is not None,
        atmo.get("cape_j_kg") is not None
    ]
    data_quality = sum(1.0 for c in quality_checks if c) / len(quality_checks)

    normalized = {
        # Radar features
        "norm_dbz": min(1.0, max(0.0, float(radar.get("dbz_max", 45.0)) / 75.0)),
        "dbz_trend": min(1.0, max(-1.0, float(radar.get("dbz_trend_per_hr", 12.0)) / 30.0)),
        "vert_extent": min(1.0, max(0.0, float(radar.get("echo_top_km", 12.0)) / 18.0)),
        
        # Satellite features
        "cloud_top_cooling": min(1.0, max(0.0, abs(float(sat.get("cloud_top_trend_c_per_hr", -18.0))) / 35.0)),
        "cold_core_depth": min(1.0, max(0.0, (0.0 - float(sat.get("cloud_top_temp_c", -65.0))) / 85.0)),
        
        # Lightning features
        "strike_rate": min(1.0, max(0.0, float(ltg.get("strike_rate_per_min", 35.0)) / 100.0)),
        "first_flash_weight": 1.0 if ltg.get("first_flash_detected", True) else 0.3,
        
        # Atmospheric sounding
        "norm_cape": min(1.0, max(0.0, float(atmo.get("cape_j_kg", 2600.0)) / 4500.0)),
        "norm_shear": min(1.0, max(0.0, float(atmo.get("bulk_shear_kts", 35.0)) / 60.0)),
        "cin_suppression": min(1.0, max(0.0, abs(float(atmo.get("cin_j_kg", -25.0))) / 100.0))
    }
    
    return normalized, data_quality
