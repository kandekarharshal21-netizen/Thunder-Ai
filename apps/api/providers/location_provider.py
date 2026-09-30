import json
import urllib.request
import urllib.parse
from typing import List, Dict, Any, Optional

# Curated fallback/fast lookup for primary Indian hubs & meteorological mesonets
KNOWN_LOCATIONS = [
    {"name": "Sangamner, Maharashtra", "lat": 19.5761, "lon": 74.2070, "state": "Maharashtra", "country": "India"},
    {"name": "Nashik, Maharashtra", "lat": 19.9975, "lon": 73.7898, "state": "Maharashtra", "country": "India"},
    {"name": "Mumbai, Maharashtra", "lat": 19.0760, "lon": 72.8777, "state": "Maharashtra", "country": "India"},
    {"name": "Thane, Maharashtra", "lat": 19.2183, "lon": 72.9781, "state": "Maharashtra", "country": "India"},
    {"name": "Kalyan-Dombivli, Maharashtra", "lat": 19.2437, "lon": 73.1355, "state": "Maharashtra", "country": "India"},
    {"name": "Pune, Maharashtra", "lat": 18.5204, "lon": 73.8567, "state": "Maharashtra", "country": "India"},
    {"name": "Nagpur, Maharashtra", "lat": 21.1458, "lon": 79.0882, "state": "Maharashtra", "country": "India"},
    {"name": "Aurangabad (Chhatrapati Sambhaji Nagar), Maharashtra", "lat": 19.8762, "lon": 75.3433, "state": "Maharashtra", "country": "India"},
    {"name": "New Delhi, Delhi NCR", "lat": 28.6139, "lon": 77.2090, "state": "Delhi", "country": "India"},
    {"name": "Bengaluru, Karnataka", "lat": 12.9716, "lon": 77.5946, "state": "Karnataka", "country": "India"},
    {"name": "Chennai, Tamil Nadu", "lat": 13.0827, "lon": 80.2707, "state": "Tamil Nadu", "country": "India"},
    {"name": "Kolkata, West Bengal", "lat": 22.5726, "lon": 88.3639, "state": "West Bengal", "country": "India"},
    {"name": "Hyderabad, Telangana", "lat": 17.3850, "lon": 78.4867, "state": "Telangana", "country": "India"},
    {"name": "Ahmedabad, Gujarat", "lat": 23.0225, "lon": 72.5714, "state": "Gujarat", "country": "India"}
]

class LocationProvider:
    def __init__(self):
        self.search_cache: Dict[str, List[Dict[str, Any]]] = {}
        self.reverse_cache: Dict[str, Dict[str, Any]] = {}

    def search(self, query: str) -> List[Dict[str, Any]]:
        clean_q = query.strip().lower()
        if not clean_q:
            return []

        if clean_q in self.search_cache:
            return self.search_cache[clean_q]

        # 1. Local fast search in KNOWN_LOCATIONS
        matches = [
            loc for loc in KNOWN_LOCATIONS
            if clean_q in loc["name"].lower() or clean_q in loc.get("state", "").lower()
        ]

        # 2. Try Nominatim Geocoding API if query is outside known set
        if len(matches) < 2:
            try:
                encoded_q = urllib.parse.quote(query)
                url = f"https://nominatim.openstreetmap.org/search?q={encoded_q}&format=json&addressdetails=1&limit=5&countrycodes=in"
                req = urllib.request.Request(
                    url,
                    headers={"User-Agent": "THANDER-AI-Atmospheric-Command/2.4 (Meteorological Intelligence)"}
                )
                with urllib.request.urlopen(req, timeout=3.0) as resp:
                    if resp.status == 200:
                        raw = json.loads(resp.read().decode('utf-8'))
                        api_results = []
                        for item in raw:
                            api_results.append({
                                "name": item.get("display_name", "").split(",")[0] + ", " + item.get("address", {}).get("state", "India"),
                                "full_address": item.get("display_name", ""),
                                "lat": float(item.get("lat")),
                                "lon": float(item.get("lon")),
                                "state": item.get("address", {}).get("state", ""),
                                "country": item.get("address", {}).get("country", "India")
                            })
                        if api_results:
                            matches.extend(api_results)
            except Exception:
                pass

        if not matches:
            # Fallback to Nashik default if nothing matched
            matches = [KNOWN_LOCATIONS[0]]

        self.search_cache[clean_q] = matches[:6]
        return self.search_cache[clean_q]

    def reverse(self, lat: float, lon: float) -> Dict[str, Any]:
        cache_key = f"{round(lat, 3)}:{round(lon, 3)}"
        if cache_key in self.reverse_cache:
            return self.reverse_cache[cache_key]

        # Check proximity to known hubs
        for loc in KNOWN_LOCATIONS:
            if abs(loc["lat"] - lat) < 0.35 and abs(loc["lon"] - lon) < 0.35:
                res = {
                    "name": loc["name"],
                    "lat": lat,
                    "lon": lon,
                    "state": loc["state"],
                    "country": loc["country"],
                    "source": "Local Spatial Index"
                }
                self.reverse_cache[cache_key] = res
                return res

        # Try Nominatim reverse
        try:
            url = f"https://nominatim.openstreetmap.org/reverse?lat={lat}&lon={lon}&format=json"
            req = urllib.request.Request(
                url,
                headers={"User-Agent": "THANDER-AI-Atmospheric-Command/2.4 (Meteorological Intelligence)"}
            )
            with urllib.request.urlopen(req, timeout=3.0) as resp:
                if resp.status == 200:
                    data = json.loads(resp.read().decode('utf-8'))
                    addr = data.get("address", {})
                    city = addr.get("city") or addr.get("town") or addr.get("county") or addr.get("district") or "Sector"
                    state = addr.get("state", "Maharashtra")
                    res = {
                        "name": f"{city}, {state}",
                        "lat": lat,
                        "lon": lon,
                        "state": state,
                        "country": addr.get("country", "India"),
                        "source": "OpenStreetMap Nominatim Reverse"
                    }
                    self.reverse_cache[cache_key] = res
                    return res
        except Exception:
            pass

        # Fallback default
        res = {
            "name": f"Lat {round(lat, 4)}°, Lon {round(lon, 4)}°",
            "lat": lat,
            "lon": lon,
            "state": "Maharashtra",
            "country": "India",
            "source": "Coordinates Fallback"
        }
        self.reverse_cache[cache_key] = res
        return res

location_provider = LocationProvider()
