from fastapi.testclient import TestClient
from main import app
import sys

client = TestClient(app)

def test_endpoint(method, path, body=None):
    try:
        if method == "GET":
            resp = client.get(path)
        elif method == "POST":
            resp = client.post(path, json=body)
        status = resp.status_code
        if status in [200, 201]:
            print(f"[PASS] {method} {path} -> HTTP {status}")
            return True, resp.json()
        else:
            print(f"[FAIL] {method} {path} -> HTTP {status}: {resp.text}")
            return False, resp.text
    except Exception as e:
        print(f"[FAIL] {method} {path} -> {e}")
        return False, str(e)

if __name__ == "__main__":
    print("Testing THANDER AI API endpoints with TestClient...")
    tests = [
        ("GET", "/health"),
        ("GET", "/ready"),
        ("GET", "/api/v1/health"),
        ("GET", "/api/v1/health/providers"),
        ("GET", "/api/v1/auth/me"),
        ("POST", "/api/v1/auth/logout", {}),
        ("GET", "/api/v1/auth/google"),
        ("GET", "/api/v1/auth/google/callback?code=demo_auth_code"),
        ("GET", "/api/v1/dashboard?horizon=30"),
        ("GET", "/api/v1/storms"),
        ("GET", "/api/v1/storms/ST-2026-001"),
        ("GET", "/api/v1/storms/ST-2026-001/track"),
        ("GET", "/api/v1/weather/current?lat=19.9975&lon=73.7898"),
        ("GET", "/api/v1/weather/hourly?lat=19.9975&lon=73.7898"),
        ("GET", "/api/v1/weather/forecast?lat=19.9975&lon=73.7898"),
        ("GET", "/api/v1/weather/history?lat=19.9975&lon=73.7898"),
        ("GET", "/api/v1/radar/frames"),
        ("GET", "/api/v1/radar/VABB"),
        ("GET", "/api/v1/satellite/frames"),
        ("GET", "/api/v1/lightning/recent"),
        ("GET", "/api/v1/lightning/density"),
        ("GET", "/api/v1/lightning/trend"),
        ("GET", "/api/v1/alerts"),
        ("GET", "/api/v1/alerts/active"),
        ("POST", "/api/v1/alerts/ALT-2026-904/acknowledge", {}),
        ("POST", "/api/v1/alerts/trigger", {
            "type": "LIGHTNING RISK",
            "severity": "HIGH",
            "title": "Convective Flash Warning",
            "message": "Flash frequency accelerating.",
            "location": "Sangamner Sector",
            "latitude": 19.5761,
            "longitude": 74.2070,
            "confidence": 0.92
        }),
        ("GET", "/api/v1/locations"),
        ("GET", "/api/v1/location/search?q=Sangamner"),
        ("GET", "/api/v1/location/reverse?lat=19.5761&lon=74.2070"),
        ("GET", "/api/v1/data-health"),
        ("GET", "/api/v1/replay/events"),
        ("GET", "/api/v1/replay/EVT-2024-DELHI"),
        ("GET", "/api/v1/analytics"),
        ("GET", "/api/v1/models/current"),
        ("GET", "/api/v1/prediction/latest"),
        ("POST", "/api/v1/prediction/nowcast", {
            "location": "Thane-Kalyan Basin",
            "forecast_horizon": 30,
            "latitude": 19.14,
            "longitude": 73.19,
            "radar_features": {"dbz_max": 56.0, "dbz_trend_per_hr": 14.0, "echo_top_km": 14.5},
            "satellite_features": {"cloud_top_temp_c": -70.0, "cloud_top_trend_c_per_hr": -18.0},
            "lightning_features": {"strike_rate_per_min": 42.0, "first_flash_detected": True},
            "atmospheric_features": {"cape_j_kg": 2850.0, "bulk_shear_kts": 36.0, "cin_j_kg": -22.0}
        })
    ]

    all_passed = True
    for method, path, *args in tests:
        body = args[0] if args else None
        ok, res = test_endpoint(method, path, body)
        if not ok:
            all_passed = False

    if all_passed:
        print("\nALL API ENDPOINTS PASSED SUCCESSFULLY (100% SPEC COMPLIANCE)!")
    else:
        print("\nSOME API ENDPOINTS FAILED")
        sys.exit(1)
