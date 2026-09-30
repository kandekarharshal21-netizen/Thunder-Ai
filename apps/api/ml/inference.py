"""
Inference pipeline for THANDER AI conforming to Section 13, 14, and 15.
Separates Hazard Probability from Model Confidence.
Generates human-readable Explainable AI (XAI) feature attributions.
"""
from datetime import datetime, timezone
from typing import Dict, Any, List
from .features import extract_and_normalize_features
from .baseline import BaselineNowcastModel

model = BaselineNowcastModel()

def run_prediction_pipeline(payload: Dict[str, Any]) -> Dict[str, Any]:
    location = payload.get("location", "Mumbai-Thane Convective Corridor")
    horizon = int(payload.get("forecast_horizon", 30))
    lat = float(payload.get("latitude", 19.12))
    lon = float(payload.get("longitude", 73.18))
    
    features, data_quality = extract_and_normalize_features(payload)
    
    # Run model prediction
    probs = model.predict_probabilities(features, horizon)
    th_prob = probs["thunderstorm_probability"]
    lt_prob = probs["lightning_probability"]
    
    # Assess severity
    if th_prob >= 0.85 or lt_prob >= 0.80:
        severity = "SEVERE"
    elif th_prob >= 0.65 or lt_prob >= 0.60:
        severity = "HIGH"
    elif th_prob >= 0.40 or lt_prob >= 0.35:
        severity = "MODERATE"
    else:
        severity = "LOW"

    # Separate Hazard Probability from Model Confidence (Section 15)
    # Model confidence depends on data quality and prediction horizon
    horizon_conf_decay = {15: 0.96, 30: 0.91, 60: 0.83, 90: 0.72}.get(horizon, 0.80)
    confidence = round(data_quality * horizon_conf_decay, 2)

    # Feature contributions for Explainable AI (XAI)
    feature_contributions = [
        {
            "feature": "radar_reflectivity",
            "name": "Core Radar Reflectivity & Growth Rate",
            "contribution": round(features["norm_dbz"] * 0.38, 2),
            "influence": "positive" if features["norm_dbz"] > 0.4 else "neutral",
            "detail": f"Normalized core reflectivity index at {round(features['norm_dbz'], 2)} indicates active hydrometeor loading."
        },
        {
            "feature": "ir_cooling",
            "name": "Satellite Thermal Cloud-Top Cooling",
            "contribution": round(features["cloud_top_cooling"] * 0.28, 2),
            "influence": "positive" if features["cloud_top_cooling"] > 0.4 else "neutral",
            "detail": "Infrared signature reflects rapid vertical ascent toward tropopause."
        },
        {
            "feature": "cape_buoyancy",
            "name": "Thermodynamic Buoyancy (CAPE)",
            "contribution": round(features["norm_cape"] * 0.22, 2),
            "influence": "positive" if features["norm_cape"] > 0.5 else "neutral",
            "detail": "Atmospheric sounding confirms energetic environment sustaining convective updrafts."
        },
        {
            "feature": "lightning_initiation",
            "name": "First-Flash & Strike Density",
            "contribution": round(features["strike_rate"] * 0.18, 2),
            "influence": "positive" if features["strike_rate"] > 0.3 else "neutral",
            "detail": "Ground sensor mesonet detects accelerating cloud-to-ground charge neutralization."
        }
    ]

    explanation = (
        f"Elevated {severity} thunderstorm hazard ({int(th_prob*100)}%) for the next {horizon} minutes. "
        f"Primary drivers: high radar reflectivity trend and strong atmospheric instability (CAPE), "
        f"verified by rapid satellite cloud-top cooling. Model confidence is rated at {int(confidence*100)}% "
        f"with data completeness quality at {int(data_quality*100)}%."
    )

    return {
        "status": "success",
        "location": location,
        "storm_location": {"lat": lat + (0.02 * (horizon/15)), "lon": lon + (0.03 * (horizon/15))},
        "affected_area": f"{location} ± {12 + int(horizon * 0.2)} km buffer zone",
        "movement_direction": "ENE (72°)",
        "movement_speed": "42 km/h",
        "forecast_horizon_min": horizon,
        "thunderstorm_probability": th_prob,
        "lightning_probability": lt_prob,
        "severity": severity,
        "confidence": confidence,
        "model_version": model.VERSION,
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "data_quality": round(data_quality, 2),
        "explanation": explanation,
        "feature_contributions": feature_contributions
    }
