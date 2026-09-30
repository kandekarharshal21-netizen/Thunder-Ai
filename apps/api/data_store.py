from typing import Dict, Any, List, Optional
from datetime import datetime, timezone
import uuid

# Initial deterministic seed data adhering strictly to THANDER AI Master Specification

INITIAL_STORMS = []

INITIAL_LIGHTNING_STRIKES = []

INITIAL_ALERTS = []

INITIAL_SAVED_LOCATIONS = [
    {
        "id": "LOC-01",
        "name": "Central Farm & Solar Array",
        "category": "Farm",
        "lat": 19.14,
        "lon": 73.22,
        "radius_km": 15.0,
        "notification_threshold": "MODERATE_PLUS",
        "quiet_hours_enabled": False,
        "quiet_hours_start": "22:00",
        "quiet_hours_end": "06:00",
        "channels": ["In-App", "Browser Push"],
        "active": True,
        "created_at": "2026-09-20T10:00:00Z"
    },
    {
        "id": "LOC-02",
        "name": "Tech Institute Campus Geofence",
        "category": "Campus",
        "lat": 18.66,
        "lon": 73.65,
        "radius_km": 10.0,
        "notification_threshold": "HIGH_ONLY",
        "quiet_hours_enabled": True,
        "quiet_hours_start": "23:00",
        "quiet_hours_end": "06:30",
        "channels": ["In-App"],
        "active": True,
        "created_at": "2026-09-22T14:30:00Z"
    },
    {
        "id": "LOC-03",
        "name": "District General Hospital",
        "category": "Custom",
        "lat": 19.05,
        "lon": 73.02,
        "radius_km": 8.0,
        "notification_threshold": "ALL",
        "quiet_hours_enabled": False,
        "quiet_hours_start": "00:00",
        "quiet_hours_end": "00:00",
        "channels": ["In-App", "Browser Push", "SMS Adapter"],
        "active": True,
        "created_at": "2026-09-25T08:15:00Z"
    }
]

INITIAL_AUDIT_LOGS = []

HISTORICAL_REPLAY_EVENTS = [
    {
        "id": "EVT-2024-DELHI",
        "name": "Delhi Severe Squall Line & Dust-Thunderstorm",
        "date": "May 10, 2024",
        "region": "NCR & Northern Plains",
        "description": "Intense convective squall line with surface wind gusts of 82 km/h, over 1,200 lightning strikes in 45 minutes, and heavy rainfall.",
        "total_frames": 8,
        "frame_interval_min": 10,
        "lead_time_achieved_min": 52,
        "metrics": {
            "pod": 0.91,
            "far": 0.14,
            "csi": 0.79,
            "brier_score": 0.088,
            "average_lead_time_min": 48.5,
            "inference_latency_ms": 78,
            "sample_size": 240
        },
        "frames": [
            {"frame_index": 0, "time_label": "T-60m", "observed_dbz": 24, "predicted_dbz": 22, "observed_strikes": 12, "predicted_prob": 0.28, "event_notes": "Boundary layer convergence detected; cumulus cloud top cooling."},
            {"frame_index": 1, "time_label": "T-50m", "observed_dbz": 35, "predicted_dbz": 38, "observed_strikes": 48, "predicted_prob": 0.54, "event_notes": "Rapid vertical development, updraft velocity exceeds 18 m/s."},
            {"frame_index": 2, "time_label": "T-40m", "observed_dbz": 46, "predicted_dbz": 48, "observed_strikes": 180, "predicted_prob": 0.78, "event_notes": "First flash event recorded. AI nowcast elevated to High."},
            {"frame_index": 3, "time_label": "T-30m", "observed_dbz": 54, "predicted_dbz": 55, "observed_strikes": 420, "predicted_prob": 0.93, "event_notes": "Severe warning issued. Core reflectivity reaches 55 dBZ."},
            {"frame_index": 4, "time_label": "T-20m", "observed_dbz": 59, "predicted_dbz": 58, "observed_strikes": 640, "predicted_prob": 0.96, "event_notes": "Peak intensity. Gust front outflow initiates secondary squalls."},
            {"frame_index": 5, "time_label": "T-10m", "observed_dbz": 56, "predicted_dbz": 54, "observed_strikes": 510, "predicted_prob": 0.91, "event_notes": "Squall line moving east-southeast at 48 km/h."},
            {"frame_index": 6, "time_label": "T+0m (Event)", "observed_dbz": 52, "predicted_dbz": 50, "observed_strikes": 340, "predicted_prob": 0.84, "event_notes": "Impact on target metropolitan area matches forecast polygon within 1.8km."},
            {"frame_index": 7, "time_label": "T+15m", "observed_dbz": 41, "predicted_dbz": 39, "observed_strikes": 120, "predicted_prob": 0.45, "event_notes": "System entering dissipating stratiform stage."}
        ]
    },
    {
        "id": "EVT-2023-BIPARJOY",
        "name": "Cyclone Biparjoy Convective Spiral Bands",
        "date": "June 14, 2023",
        "region": "Gujarat & Western Coast",
        "description": "Outer rainband thunderstorm clusters with localized tornadic shear and extreme lightning density.",
        "total_frames": 6,
        "frame_interval_min": 15,
        "lead_time_achieved_min": 64,
        "metrics": {
            "pod": 0.88,
            "far": 0.18,
            "csi": 0.74,
            "brier_score": 0.104,
            "average_lead_time_min": 58.0,
            "inference_latency_ms": 92,
            "sample_size": 380
        },
        "frames": [
            {"frame_index": 0, "time_label": "T-60m", "observed_dbz": 32, "predicted_dbz": 30, "observed_strikes": 35, "predicted_prob": 0.42, "event_notes": "Spiral band approaching coastline."},
            {"frame_index": 1, "time_label": "T-45m", "observed_dbz": 44, "predicted_dbz": 46, "observed_strikes": 140, "predicted_prob": 0.68, "event_notes": "Embedded convection strengthening."},
            {"frame_index": 2, "time_label": "T-30m", "observed_dbz": 52, "predicted_dbz": 54, "observed_strikes": 310, "predicted_prob": 0.89, "event_notes": "Severe microburst signature on Doppler velocity."},
            {"frame_index": 3, "time_label": "T-15m", "observed_dbz": 56, "predicted_dbz": 57, "observed_strikes": 520, "predicted_prob": 0.94, "event_notes": "Peak lightning activity."},
            {"frame_index": 4, "time_label": "T+0m", "observed_dbz": 54, "predicted_dbz": 53, "observed_strikes": 480, "predicted_prob": 0.90, "event_notes": "Coastal landfall of convective core."},
            {"frame_index": 5, "time_label": "T+15m", "observed_dbz": 47, "predicted_dbz": 46, "observed_strikes": 260, "predicted_prob": 0.72, "event_notes": "Interaction with coastal terrain."}
        ]
    }
]

class MemoryDataStore:
    def __init__(self):
        self.storms = list(INITIAL_STORMS)
        self.lightning_strikes = list(INITIAL_LIGHTNING_STRIKES)
        self.alerts = list(INITIAL_ALERTS)
        self.saved_locations = list(INITIAL_SAVED_LOCATIONS)
        self.audit_logs = list(INITIAL_AUDIT_LOGS)
        self.replay_events = list(HISTORICAL_REPLAY_EVENTS)
        self._alert_dedup_cache: Dict[str, float] = {}

    def get_active_alerts(self) -> List[Dict[str, Any]]:
        return [a for a in self.alerts if a.get("status") == "active"]

    def trigger_smart_alert(
        self,
        alert_type: str,
        severity: str,
        title: str,
        message: str,
        target_area: str,
        lat: float,
        lon: float,
        storm_id: Optional[str] = None,
        confidence: float = 0.90,
        cooldown_sec: float = 900.0  # 15 minutes deduplication cooldown
    ) -> Optional[Dict[str, Any]]:
        """
        Deduplicates alerts based on location, alert_type, storm_id and a time window.
        Section 30 & 65 compliant.
        """
        now = datetime.now(timezone.utc)
        now_ts = now.timestamp()
        dedup_key = f"{target_area}:{alert_type}:{storm_id or 'none'}"

        if dedup_key in self._alert_dedup_cache:
            last_ts = self._alert_dedup_cache[dedup_key]
            if (now_ts - last_ts) < cooldown_sec:
                return None  # Suppress duplicate alert within cooldown window

        self._alert_dedup_cache[dedup_key] = now_ts

        new_alert = {
            "id": f"ALT-{uuid.uuid4().hex[:6].upper()}",
            "type": alert_type,
            "severity": severity,
            "title": title,
            "message": message,
            "target_area": target_area,
            "coordinates": [round(lon, 4), round(lat, 4)],
            "created_at": now.isoformat(),
            "expires_at": (now.replace(hour=(now.hour + 1) % 24)).isoformat(),
            "status": "active",
            "source": "THANDER AI Baseline Convective Engine",
            "confidence": confidence,
            "reason": message,
            "recommended_action": "Seek immediate sturdy shelter indoors. Cease open-field operations.",
            "official_source_disclaimer": "Automated advisory generated by THANDER AI Nowcasting Engine.",
            "data_timestamp": now.isoformat()
        }
        self.alerts.insert(0, new_alert)

        # Audit log entry
        self.audit_logs.insert(0, {
            "id": f"AUD-ALERT-{uuid.uuid4().hex[:6]}",
            "timestamp": now.isoformat(),
            "user_id": "system-alert-engine",
            "user_role": "Engine",
            "action": "ALERT_TRIGGER",
            "target_resource": new_alert["id"],
            "details": f"Generated {severity} {alert_type} for {target_area}.",
            "ip_address": "127.0.0.1"
        })

        return new_alert

    def acknowledge_alert(self, alert_id: str) -> bool:
        for alert in self.alerts:
            if alert["id"] == alert_id:
                alert["status"] = "acknowledged"
                self.audit_logs.insert(0, {
                    "id": f"AUD-{uuid.uuid4().hex[:6]}",
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                    "user_id": "operator-active",
                    "user_role": "Operator",
                    "action": "ALERT_ACKNOWLEDGE",
                    "target_resource": alert_id,
                    "details": f"Alert {alert_id} acknowledged by operator.",
                    "ip_address": "127.0.0.1"
                })
                return True
        return False

    def add_location(self, loc_data: dict) -> dict:
        new_loc = {
            "id": f"LOC-{uuid.uuid4().hex[:4].upper()}",
            "name": loc_data.get("name", "New Geofence"),
            "category": loc_data.get("category", "Custom"),
            "lat": float(loc_data.get("lat", 19.0)),
            "lon": float(loc_data.get("lon", 73.0)),
            "radius_km": float(loc_data.get("radius_km", 10.0)),
            "notification_threshold": loc_data.get("notification_threshold", "MODERATE_PLUS"),
            "quiet_hours_enabled": loc_data.get("quiet_hours_enabled", False),
            "quiet_hours_start": loc_data.get("quiet_hours_start", "22:00"),
            "quiet_hours_end": loc_data.get("quiet_hours_end", "06:00"),
            "channels": loc_data.get("channels", ["In-App"]),
            "active": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        self.saved_locations.insert(0, new_loc)
        return new_loc

    def delete_location(self, loc_id: str) -> bool:
        initial_len = len(self.saved_locations)
        self.saved_locations = [l for l in self.saved_locations if l["id"] != loc_id]
        return len(self.saved_locations) < initial_len

store = MemoryDataStore()
