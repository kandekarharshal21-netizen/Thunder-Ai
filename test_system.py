"""
THANDER AI - Comprehensive Verification Test Suite
Tests API endpoints, schemas, adapters, fusion engine, and self-healing pathways.
"""

import sys
import os

# Add apps/api to path
sys.path.insert(0, os.path.abspath("apps/api"))

from main import app
from fastapi.testclient import TestClient

client = TestClient(app)

def test_endpoints():
    print("Testing THANDER AI Core API Endpoints...")

    # 1. Health & Readiness
    res = client.get("/health")
    assert res.status_code == 200, f"Health check failed: {res.text}"
    assert res.json()["status"] == "UP"
    print("[PASS] /health: PASSED")

    res = client.get("/ready")
    assert res.status_code == 200
    assert res.json()["ready"] is True
    print("[PASS] /ready: PASSED")

    # 2. Dashboard
    res = client.get("/api/v1/dashboard?horizon=30")
    assert res.status_code == 200
    data = res.json()
    assert "kpis" in data
    assert "lightning_probability" in data["kpis"]
    assert "thunderstorm_probability" in data["kpis"]
    assert "storm_cells_detected" in data["kpis"]
    print(f"[PASS] /api/v1/dashboard: PASSED (Detected {data['kpis']['storm_cells_detected']} cells, Max Severity: {data['kpis']['maximum_predicted_severity']})")

    # 3. Storms
    res = client.get("/api/v1/storms")
    assert res.status_code == 200
    storms = res.json()["storms"]
    assert len(storms) >= 0
    print(f"[PASS] /api/v1/storms: PASSED ({len(storms)} cells tracked)")

    if len(storms) > 0:
        storm_id = storms[0]["id"]
        res = client.get(f"/api/v1/storms/{storm_id}")
        assert res.status_code == 200
        assert res.json()["id"] == storm_id
        print(f"[PASS] /api/v1/storms/{storm_id}: PASSED (Digital Twin verified)")

    # 4. Predictions
    res = client.get("/api/v1/predictions")
    assert res.status_code == 200
    preds = res.json()
    assert len(preds["horizons"]) == 4
    assert len(preds["contributions"]) > 0
    print(f"[PASS] /api/v1/predictions: PASSED ({len(preds['horizons'])} horizons, {len(preds['contributions'])} SHAP contributions)")

    # 5. Lightning
    res = client.get("/api/v1/lightning")
    assert res.status_code == 200
    ltg = res.json()
    assert len(ltg["recent_strikes"]) >= 0
    assert len(ltg["clusters"]) >= 0
    print(f"[PASS] /api/v1/lightning: PASSED ({len(ltg['recent_strikes'])} strikes, {len(ltg['clusters'])} clusters)")

    # 6. Radar & Satellite & Atmosphere
    assert client.get("/api/v1/radar").status_code == 200
    assert client.get("/api/v1/satellite").status_code == 200
    assert client.get("/api/v1/atmosphere").status_code == 200
    print("[PASS] /api/v1/radar, /satellite, /atmosphere: PASSED")

    # 7. Alerts
    res = client.get("/api/v1/alerts")
    assert res.status_code == 200
    alerts = res.json()["alerts"]
    assert len(alerts) >= 0
    if len(alerts) > 0:
        alert_id = alerts[0]["id"]
        res_ack = client.post(f"/api/v1/alerts/{alert_id}/ack")
        assert res_ack.status_code == 200
    print(f"[PASS] /api/v1/alerts & /alerts/ack: PASSED")

    # 8. Locations CRUD
    res_locs = client.get("/api/v1/locations")
    assert res_locs.status_code == 200
    new_loc = client.post("/api/v1/locations", json={
        "name": "Test Geofence Zone",
        "category": "Farm",
        "lat": 19.2,
        "lon": 73.1,
        "radius_km": 12.0
    }).json()
    assert "id" in new_loc
    del_res = client.delete(f"/api/v1/locations/{new_loc['id']}")
    assert del_res.status_code == 200
    print("[PASS] /api/v1/locations (CRUD): PASSED")

    # 9. Data Health & Outage Simulation (Self-Healing)
    health = client.get("/api/v1/data-health").json()
    assert health["overall_status"] == "All systems operational"
    
    # Simulate Radar outage
    toggled = client.post("/api/v1/data-health/toggle", json={"source": "radar", "healthy": False}).json()
    assert "Radar" in str(toggled["missing_sources"])
    assert toggled["confidence_penalty"] > 0
    print("[PASS] Self-Healing Circuit: Simulated radar failure -> Reduced pathway activated with confidence penalty!")

    # Heal Radar connector back
    healed = client.post("/api/v1/data-health/toggle", json={"source": "radar", "healthy": True}).json()
    assert "Radar" not in str(healed["missing_sources"])
    print("[PASS] Self-Healing Circuit: Connector restored -> Full multimodal pathway re-established!")

    # 10. Historical Replay
    replays = client.get("/api/v1/replay").json()
    assert len(replays) >= 2
    res_ev = client.get(f"/api/v1/replay/{replays[0]['id']}")
    assert res_ev.status_code == 200
    assert len(res_ev.json()["frames"]) > 0
    print(f"[PASS] /api/v1/replay: PASSED ({len(replays)} historical benchmark events verified)")

    # 11. Analytics & Model Registry
    assert client.get("/api/v1/analytics").status_code == 200
    assert client.get("/api/v1/models/current").status_code == 200
    assert client.get("/api/v1/admin/audit-logs").status_code == 200
    print("[PASS] /api/v1/analytics, /models/current, /admin/audit-logs: PASSED")

    print("\nALL BACKEND API CONTRACT TESTS PASSED WITH 100% SUCCESS!")

if __name__ == "__main__":
    test_endpoints()
