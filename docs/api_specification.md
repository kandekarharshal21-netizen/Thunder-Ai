# THANDER AI — REST API Contract (v1)

Base URL: `http://localhost:8000/api/v1`

### Endpoints Catalog

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Core service liveness and database connection status |
| `GET` | `/ready` | Ingest adapter initialization status |
| `GET` | `/metrics` | Active cell counts, quality scores, and latency metrics |
| `GET` | `/dashboard` | Command center summary with KPIs and active storms |
| `GET` | `/storms` | Digital twin list of all detected storm cells and polylines |
| `GET` | `/storms/{id}` | Detailed kinematic telemetry for a specific storm cell |
| `GET` | `/predictions` | Multi-horizon nowcast (15/30/60/90m) with SHAP attribution |
| `GET` | `/lightning` | Recent flash strikes, strike rates/min, and cluster centroids |
| `GET` | `/radar` | Doppler radar frame sequences, mode selector, and stations |
| `GET` | `/satellite` | INSAT-3D thermal infrared cloud top temperatures |
| `GET` | `/atmosphere` | CAPE, CIN, Lifted Index, and radiosonde pressure levels |
| `GET` | `/alerts` | Active and acknowledged weather warnings |
| `POST` | `/alerts/{id}/ack` | Acknowledge an alert and append to audit log |
| `GET` | `/locations` | List saved protected geofence zones |
| `POST` | `/locations` | Register a new village, farm, campus, or custom geofence |
| `DELETE` | `/locations/{id}` | Delete a saved geofence |
| `GET` | `/data-health` | Real-time ingest health status and active pathway |
| `POST` | `/data-health/toggle` | Simulate connector fault / self-healing recovery |
| `GET` | `/analytics` | Historical verification scores (POD, FAR, CSI, Brier) |
| `GET` | `/replay` | Catalog of historical storm events for backtesting |
| `GET` | `/replay/{id}` | Frame-by-frame historical ground truth vs AI prediction |
| `GET` | `/models/current` | Model registry and evaluation metadata |
| `GET` | `/admin/audit-logs` | Tamper-evident operational audit trail |
| `POST` | `/admin/switch-scenario` | Switch live demonstration scenario (Developing, Intensifying, Decaying) |
