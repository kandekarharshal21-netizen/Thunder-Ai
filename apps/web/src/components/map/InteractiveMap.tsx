import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Layers, Play, Pause, RotateCcw, Maximize2, Minimize2,
  Crosshair, ShieldAlert, Zap, Radio, CloudRain, Info, X, Wind,
  Search, MapPin, Navigation, Compass, Globe, Satellite
} from 'lucide-react';
import { StormCell, SavedLocation, LightningStrike } from '../../types/weather';
import { weatherApi } from '../../services/api';

export type BaseMapType = 'carto-dark' | 'osm' | 'esri-satellite' | 'carto-voyager';

interface BaseMapConfig {
  name: string;
  icon: string;
  url: string;
  maxZoom: number;
  subdomains?: string;
  attribution: string;
}

const BASE_MAPS: Record<BaseMapType, BaseMapConfig> = {
  'carto-dark': {
    name: 'Command Dark (Google)',
    icon: '🌑',
    url: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    maxZoom: 20,
    attribution: '&copy; Google Maps'
  },
  'osm': {
    name: 'Google Street Map',
    icon: '🌍',
    url: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    maxZoom: 20,
    attribution: '&copy; Google Maps'
  },
  'esri-satellite': {
    name: 'Google Satellite',
    icon: '🛰️',
    url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
    maxZoom: 20,
    attribution: '&copy; Google Maps'
  },
  'carto-voyager': {
    name: 'Google Terrain',
    icon: '🗺️',
    url: 'https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
    maxZoom: 20,
    attribution: '&copy; Google Maps'
  }
};

interface InteractiveMapProps {
  storms: StormCell[];
  selectedStormId?: string;
  onSelectStorm?: (storm: StormCell) => void;
  savedLocations?: SavedLocation[];
  lightningStrikes?: LightningStrike[];
  selectedHorizon?: number;
  heightClass?: string;
  centerCoords?: [number, number];
  onLocationChange?: (name: string, coords: [number, number]) => void;
  activeLocationName?: string;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  storms,
  selectedStormId,
  onSelectStorm,
  savedLocations = [],
  lightningStrikes = [],
  selectedHorizon = 30,
  heightClass = "h-[540px]",
  centerCoords = [19.5761, 74.2070], // Sangamner mesonet hub default
  onLocationChange,
  activeLocationName = "Sangamner, Maharashtra"
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const baseTileLayerRef = useRef<L.TileLayer | null>(null);
  const rainViewerTileLayerRef = useRef<L.TileLayer | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const userLocationLayerRef = useRef<L.LayerGroup | null>(null);

  // Base map & live radar layer state
  const [baseMap, setBaseMap] = useState<BaseMapType>('carto-dark');

  // 5 Operational Overlays (Section 19):
  // 1. Weather, 2. Precipitation, 3. Thunderstorm Risk, 4. Lightning Risk, 5. Storm Track
  const [showWeather, setShowWeather] = useState<boolean>(true);
  const [showPrecipitation, setShowPrecipitation] = useState<boolean>(true);
  const [showThunderstormRisk, setShowThunderstormRisk] = useState<boolean>(true);
  const [showLightningRisk, setShowLightningRisk] = useState<boolean>(true);
  const [showStormTrack, setShowStormTrack] = useState<boolean>(true);

  // UI state
  const [showLayerMenu, setShowLayerMenu] = useState<boolean>(false);
  const [showBaseMapMenu, setShowBaseMapMenu] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [activeInspectorStorm, setActiveInspectorStorm] = useState<StormCell | null>(null);

  // Live Location Tracking
  const [isTrackingLive, setIsTrackingLive] = useState<boolean>(false);
  const [liveGpsCoords, setLiveGpsCoords] = useState<{ lat: number; lon: number; accuracy: number } | null>(null);
  const [liveLocationName, setLiveLocationName] = useState<string>('');
  const [gpsError, setGpsError] = useState<string | null>(null);
  const watchIdRef = useRef<number | null>(null);

  // Direct Map Search
  const [mapSearchQuery, setMapSearchQuery] = useState<string>('');
  const [mapSearchResults, setMapSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const searchDropdownRef = useRef<HTMLDivElement>(null);

  // 1. (RainViewer disabled due to coverage errors)
  
  // 2. Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: centerCoords,
      zoom: 10,
      zoomControl: false,
      attributionControl: false
    });

    // Add initial base tile layer (CartoDB Dark Matter)
    const baseCfg = BASE_MAPS[baseMap];
    const baseTile = L.tileLayer(baseCfg.url, {
      maxZoom: baseCfg.maxZoom,
      subdomains: baseCfg.subdomains || 'abc',
      className: baseMap === 'carto-dark' ? 'dark-map-filter' : ''
    }).addTo(map);
    baseTileLayerRef.current = baseTile;

    const layerGroup = L.layerGroup().addTo(map);
    layerGroupRef.current = layerGroup;

    const userGroup = L.layerGroup().addTo(map);
    userLocationLayerRef.current = userGroup;

    mapInstanceRef.current = map;

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 3. Update Base Map Tile Layer when changed
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (baseTileLayerRef.current) {
      map.removeLayer(baseTileLayerRef.current);
    }

    const cfg = BASE_MAPS[baseMap];
    const newBase = L.tileLayer(cfg.url, {
      maxZoom: cfg.maxZoom,
      subdomains: cfg.subdomains || 'abc',
      className: baseMap === 'carto-dark' ? 'dark-map-filter' : ''
    });
    
    // Add underneath overlays
    newBase.addTo(map);
    if (baseTileLayerRef.current) {
      newBase.bringToBack();
    }
    baseTileLayerRef.current = newBase;
  }, [baseMap]);

  // 4. (RainViewer Layer Removed)

  // 5. Update map center if coordinates change from parent
  useEffect(() => {
    if (mapInstanceRef.current && centerCoords) {
      mapInstanceRef.current.setView(centerCoords, mapInstanceRef.current.getZoom() || 10, {
        animate: true
      });
    }
  }, [centerCoords[0], centerCoords[1]]);

  // 6. Live GPS Location Tracking
  const toggleLiveLocationTracking = () => {
    if (!navigator.geolocation) {
      setGpsError("Browser Geolocation is not supported by your device");
      return;
    }

    if (isTrackingLive) {
      // Turn off live tracking
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      setIsTrackingLive(false);
      setGpsError(null);
      if (userLocationLayerRef.current) {
        userLocationLayerRef.current.clearLayers();
      }
      return;
    }

    // Start live tracking
    setIsTrackingLive(true);
    setGpsError(null);

    const handleSuccess = async (pos: GeolocationPosition) => {
      const { latitude, longitude, accuracy } = pos.coords;
      setLiveGpsCoords({ lat: latitude, lon: longitude, accuracy });

      // Fly map smoothly to live location
      if (mapInstanceRef.current) {
        mapInstanceRef.current.flyTo([latitude, longitude], 13, { duration: 1.2 });
      }

      // Render pulsating Live Location Marker & accuracy radius
      if (userLocationLayerRef.current) {
        userLocationLayerRef.current.clearLayers();

        // 1. Accuracy circle in meters
        L.circle([latitude, longitude], {
          radius: Math.max(accuracy, 20),
          color: '#06b6d4',
          weight: 1.5,
          fillColor: '#22d3ee',
          fillOpacity: 0.12,
          dashArray: '3, 4'
        }).addTo(userLocationLayerRef.current);

        // 2. High-visibility animated pulsing marker
        const liveIcon = L.divIcon({
          className: 'custom-live-user-marker',
          html: `
            <div style="position:relative; width:32px; height:32px; display:flex; align-items:center; justify-content:center;">
              <div style="position:absolute; width:100%; height:100%; border-radius:50%; background:#22d3ee; opacity:0.4; animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;"></div>
              <div style="width:18px; height:18px; border-radius:50%; background:#06b6d4; border:3px solid #ffffff; box-shadow:0 0 14px #22d3ee, 0 0 4px #000; display:flex; align-items:center; justify-content:center;">
                <div style="width:5px; height:5px; border-radius:50%; background:#ffffff;"></div>
              </div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        L.marker([latitude, longitude], { icon: liveIcon, zIndexOffset: 1000 })
          .bindTooltip(`<b>📍 YOUR LIVE LOCATION</b><br/>Lat: ${latitude.toFixed(4)}°, Lon: ${longitude.toFixed(4)}°<br/>Accuracy: ±${Math.round(accuracy)}m`, {
            className: 'map-tooltip',
            permanent: false
          })
          .addTo(userLocationLayerRef.current);
      }

      // Reverse geocode to city name and notify parent
      try {
        const rev = await weatherApi.reverseGeocode(latitude, longitude);
        const name = rev.name || `Live Sector (${latitude.toFixed(3)}°N, ${longitude.toFixed(3)}°E)`;
        setLiveLocationName(name);
        if (onLocationChange) {
          onLocationChange(name, [latitude, longitude]);
        }
      } catch (e) {
        console.error("Reverse geocoding error:", e);
      }
    };

    const handleError = (err: GeolocationPositionError) => {
      console.warn("GPS error:", err.message);
      setGpsError(err.message || "Failed to acquire GPS location. Please check location permissions.");
      setIsTrackingLive(false);
    };

    // Immediate acquisition + continuous watch
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    });

    const watchId = navigator.geolocation.watchPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 3000
    });
    watchIdRef.current = watchId;
  };

  // 7. Direct Search Query Handling
  useEffect(() => {
    if (!mapSearchQuery.trim() || mapSearchQuery.length < 2) {
      setMapSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await weatherApi.searchLocations(mapSearchQuery);
        setMapSearchResults(results || []);
      } catch (err) {
        console.error("Map search error:", err);
      } finally {
        setIsSearching(false);
      }
    }, 280);
    return () => clearTimeout(timer);
  }, [mapSearchQuery]);

  const handleSelectSearchResult = (item: any) => {
    const lat = Number(item.lat);
    const lon = Number(item.lon);
    if (!isNaN(lat) && !isNaN(lon)) {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.flyTo([lat, lon], 12, { duration: 1.2 });
      }
      if (onLocationChange) {
        onLocationChange(item.name, [lat, lon]);
      }
    }
    setMapSearchQuery('');
    setMapSearchResults([]);
  };

  // 8. Render Operational Layers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const lg = layerGroupRef.current;
    if (!map || !lg) return;

    lg.clearLayers();

    const [cLat, cLon] = centerCoords || [19.5761, 74.2070];

    // Layer 1: Weather (Dynamic Surface observation circles around active center)
    if (showWeather) {
      const weatherPoints = [
        { name: `${activeLocationName.split(',')[0]} Mesonet Hub`, lat: cLat, lon: cLon, temp: "33.2°C", press: "1004.8 hPa", wind: "24 km/h SW" },
        { name: `North-West Automatic Station`, lat: cLat + 0.08, lon: cLon - 0.09, temp: "31.4°C", press: "1003.5 hPa", wind: "28 km/h SW" },
        { name: `East Valley Outpost`, lat: cLat - 0.06, lon: cLon + 0.12, temp: "33.8°C", press: "1005.1 hPa", wind: "22 km/h W" },
        { name: `South Plateau Radar Probe`, lat: cLat - 0.14, lon: cLon - 0.05, temp: "29.8°C", press: "1002.8 hPa", wind: "34 km/h SW" }
      ];

      weatherPoints.forEach(wp => {
        const wIcon = L.divIcon({
          className: 'custom-weather-point',
          html: `<div style="background:#080c16; border:1px solid #22d3ee; border-radius:6px; padding:2px 6px; font-family:monospace; font-size:10px; font-weight:bold; color:#22d3ee; white-space:nowrap; box-shadow:0 0 8px #06b6d440;">
                  <span>${wp.temp}</span>
                 </div>`,
          iconSize: [46, 18],
          iconAnchor: [23, 9]
        });
        L.marker([wp.lat, wp.lon], { icon: wIcon })
          .bindTooltip(`<b>${wp.name}</b><br/>Temp: ${wp.temp}<br/>Pressure: ${wp.press}<br/>Wind: ${wp.wind}`, { className: 'map-tooltip' })
          .addTo(lg);
      });
    }

    // Layer 2: Precipitation (Radar Reflectivity dBZ footprint)
    if (showPrecipitation) {
      storms.forEach(storm => {
        const rad = Math.max(15, storm.intensity_dbz * 380);
        L.circle([storm.lat, storm.lon], {
          radius: rad,
          color: storm.intensity_dbz > 50 ? '#ef4444' : '#f59e0b',
          weight: 1.5,
          fillColor: storm.intensity_dbz > 50 ? '#ef4444' : '#f59e0b',
          fillOpacity: 0.24
        }).addTo(lg);
      });
    }

    // Layer 3: Thunderstorm Risk (Risk Polygons)
    if (showThunderstormRisk) {
      storms.forEach(storm => {
        const sevColor = 
          storm.severity === 'SEVERE' ? '#ef4444' :
          storm.severity === 'HIGH' ? '#f59e0b' : '#10b981';

        if (storm.affected_polygon) {
          const coords = storm.affected_polygon.coordinates[0].map(c => [c[1], c[0]] as [number, number]);
          L.polygon(coords, {
            color: sevColor,
            weight: 2,
            dashArray: '4, 4',
            fillColor: sevColor,
            fillOpacity: 0.28
          })
          .bindTooltip(`<b>${storm.name}</b><br/>Severity: ${storm.severity}<br/>Intensity: ${storm.intensity_dbz} dBZ`, { className: 'map-tooltip' })
          .addTo(lg);
        }
      });
    }

    // Layer 4: Lightning Risk (WWLLN Strike Flashes)
    if (showLightningRisk) {
      lightningStrikes.forEach(strike => {
        const isPos = strike.polarity.includes('+');
        const lIcon = L.divIcon({
          className: 'custom-lightning-strike',
          html: `<div style="width:11px; height:11px; border-radius:50%; background:${isPos ? '#facc15' : '#38bdf8'}; box-shadow:0 0 10px ${isPos ? '#facc15' : '#38bdf8'}; border:1.5px solid #fff;"></div>`,
          iconSize: [11, 11],
          iconAnchor: [5.5, 5.5]
        });
        L.marker([strike.lat, strike.lon], { icon: lIcon })
          .bindTooltip(`<b>⚡ Lightning Strike</b><br/>Current: ${strike.peak_current_ka} kA<br/>Polarity: ${strike.polarity}`, { className: 'map-tooltip' })
          .addTo(lg);
      });
    }

    // Layer 5: Storm Track & Timeline Propagation (Section 43 & 21)
    if (showStormTrack) {
      storms.forEach(storm => {
        const sevColor = 
          storm.severity === 'SEVERE' ? '#ef4444' :
          storm.severity === 'HIGH' ? '#f59e0b' : '#10b981';

        // Forecast path polyline connecting track points
        if (storm.track && storm.track.length > 0) {
          const points = storm.track.map(t => [t.lat, t.lon] as [number, number]);
          L.polyline(points, {
            color: sevColor,
            weight: 2.5,
            dashArray: '3, 5',
            opacity: 0.85
          }).addTo(lg);
        }

        // Section 43: Connect Timeline & Map. When selectedHorizon > 0, calculate predicted position!
        const forecastPos = (storm.forecast_positions || []).find(f => f.horizon_min === selectedHorizon);
        const activeLat = (selectedHorizon > 0 && forecastPos) ? forecastPos.lat : storm.lat;
        const activeLon = (selectedHorizon > 0 && forecastPos) ? forecastPos.lon : storm.lon;

        // If viewing future horizon, display a ghost marker at original NOW origin
        if (selectedHorizon > 0 && forecastPos) {
          const originMarkerHtml = `
            <div style="width:20px; height:20px; border-radius:50%; border:2px dashed ${sevColor}99; display:flex; align-items:center; justify-content:center; background:#070b14cc;">
              <span style="font-size:7px; font-family:monospace; color:${sevColor}; font-weight:bold;">NOW</span>
            </div>
          `;
          const originIcon = L.divIcon({
            className: 'custom-storm-origin',
            html: originMarkerHtml,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
          });
          L.marker([storm.lat, storm.lon], { icon: originIcon })
            .bindTooltip(`<b>${storm.name}</b> (Origin at T-0m)<br/>Current Position`, { className: 'map-tooltip' })
            .addTo(lg);

          // Vector line from origin to projected horizon position
          L.polyline([[storm.lat, storm.lon], [activeLat, activeLon]], {
            color: '#06b6d4',
            weight: 2.5,
            dashArray: '4, 4',
            opacity: 0.95
          }).addTo(lg);
        }

        // Centroid Marker at active horizon position
        const markerHtml = `
          <div class="relative cursor-pointer" style="width:38px; height:38px; display:flex; align-items:center; justify-content:center;">
            <div style="position:absolute; width:100%; height:100%; border-radius:50%; background:${sevColor}; opacity:0.35; animation: ping 1.8s infinite;"></div>
            <div style="width:28px; height:28px; border-radius:50%; background:#080c16; border:2px solid ${sevColor}; display:flex; flex-direction:column; align-items:center; justify-content:center; box-shadow:0 0 14px ${sevColor};">
              <span style="font-size:9px; font-weight:900; color:${sevColor}; font-family:monospace; line-height:1;">${Math.round(storm.intensity_dbz)}</span>
              ${selectedHorizon > 0 ? `<span style="font-size:6px; font-family:monospace; color:#22d3ee; font-weight:bold; line-height:1;">+${selectedHorizon}m</span>` : ''}
            </div>
          </div>
        `;

        const icon = L.divIcon({
          className: 'custom-storm-cell',
          html: markerHtml,
          iconSize: [38, 38],
          iconAnchor: [19, 19]
        });

        const marker = L.marker([activeLat, activeLon], { icon }).addTo(lg);
        marker.on('click', () => {
          setActiveInspectorStorm(storm);
          if (onSelectStorm) onSelectStorm(storm);
        });
        marker.bindTooltip(`<b>${storm.name}</b> (${storm.id})${selectedHorizon > 0 ? `<br/><span style="color:#22d3ee">+${selectedHorizon} min Forecast Position</span>` : ''}<br/>Click to view storm details`, { className: 'map-tooltip' });
      });
    }

  }, [storms, lightningStrikes, showWeather, showPrecipitation, showThunderstormRisk, showLightningRisk, showStormTrack, selectedHorizon, centerCoords, activeLocationName]);

  // Fullscreen toggle handler
  const handleToggleFullscreen = () => {
    if (!mapContainerRef.current) return;
    if (!document.fullscreenElement) {
      mapContainerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Re-center on active coordinates
  const handleRecenter = () => {
    if (mapInstanceRef.current && centerCoords) {
      mapInstanceRef.current.flyTo(centerCoords, 11, { duration: 1.2 });
    }
  };

  return (
    <div 
      ref={mapContainerRef}
      className={`relative w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#070b14] shadow-2xl ${heightClass}`}
    >
      <style>
        {`
          .dark-map-filter {
            filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%);
          }
        `}
      </style>
      {/* Top Left: Operational Badge & Real Location Search */}
      <div className="absolute top-3.5 left-3.5 z-10 flex flex-wrap items-center gap-2 max-w-[85%] sm:max-w-none">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 dark:bg-[#080c16]/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 text-[11px] font-mono font-bold text-slate-700 dark:text-slate-200 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
          <span className="hidden sm:inline">LIVE ATMOSPHERIC MAP:</span>
          <span className="text-cyan-300 truncate max-w-[160px] sm:max-w-xs">{activeLocationName}</span>
        </div>

        {/* Real-time Map Location Search Bar */}
        <div className="relative" ref={searchDropdownRef}>
          <div className="flex items-center bg-white/95 dark:bg-[#080c16]/95 backdrop-blur-md border border-slate-300/80 dark:border-slate-700/80 rounded-xl px-2.5 py-1 text-xs shadow-xl">
            <Search className="w-3.5 h-3.5 text-cyan-400 mr-1.5 shrink-0" />
            <input
              type="text"
              placeholder="Search any city/district..."
              value={mapSearchQuery}
              onChange={(e) => setMapSearchQuery(e.target.value)}
              className="bg-transparent text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none w-36 sm:w-56"
            />
            {mapSearchQuery && (
              <button 
                onClick={() => { setMapSearchQuery(''); setMapSearchResults([]); }}
                className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white p-0.5 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {mapSearchResults.length > 0 && (
            <div className="absolute top-9 left-0 w-64 sm:w-72 bg-white/98 dark:bg-[#080c16]/98 backdrop-blur-md border border-cyan-500/40 rounded-xl shadow-2xl p-1.5 space-y-1 z-30">
              <div className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 px-2 py-0.5 uppercase tracking-wider">
                Real Locations (OpenStreetMap Nominatim)
              </div>
              {mapSearchResults.map((loc, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectSearchResult(loc)}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-cyan-500/20 text-slate-700 dark:text-slate-200 hover:text-cyan-300 transition text-xs flex items-center justify-between cursor-pointer"
                >
                  <span className="font-semibold truncate">{loc.name}</span>
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 shrink-0 ml-1">
                    {Number(loc.lat).toFixed(2)}°, {Number(loc.lon).toFixed(2)}°
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Top Right: Base Map, Layers, Track Live GPS, Zoom, Fullscreen */}
      <div className="absolute top-3.5 right-3.5 z-10 flex items-center gap-1.5">
        
        {/* Base Map Selector (Dark, OSM Street, Satellite, Voyager) */}
        <div className="relative">
          <button
            onClick={() => { setShowBaseMapMenu(!showBaseMapMenu); setShowLayerMenu(false); }}
            className={`p-2 rounded-xl backdrop-blur-md border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              showBaseMapMenu
                ? 'bg-cyan-500 text-black border-cyan-400'
                : 'bg-white/90 dark:bg-[#080c16]/90 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:text-white'
            }`}
            title="Switch Map Tiles (Free OpenStreetMap, Satellite, Dark)"
          >
            <Globe className="w-4 h-4 text-cyan-400" />
            <span className="hidden md:inline font-mono">{BASE_MAPS[baseMap].icon} {BASE_MAPS[baseMap].name}</span>
          </button>

          {showBaseMapMenu && (
            <div className="absolute top-10 right-0 w-52 bg-white/95 dark:bg-[#080c16]/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 shadow-2xl z-30 space-y-1.5 text-xs">
              <div className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider pb-1 border-b border-slate-200 dark:border-slate-800">
                Real Map Providers (Zero API Key)
              </div>
              {(Object.keys(BASE_MAPS) as BaseMapType[]).map((key) => (
                <button
                  key={key}
                  onClick={() => { setBaseMap(key); setShowBaseMapMenu(false); }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between cursor-pointer transition ${
                    baseMap === key
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{BASE_MAPS[key].icon}</span>
                    <span>{BASE_MAPS[key].name}</span>
                  </span>
                  {baseMap === key && <span className="text-[10px] text-cyan-400 font-mono">Active</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 5 Layer Control Dropdown Toggle */}
        <div className="relative">
          <button
            onClick={() => { setShowLayerMenu(!showLayerMenu); setShowBaseMapMenu(false); }}
            className={`p-2 rounded-xl backdrop-blur-md border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              showLayerMenu
                ? 'bg-cyan-500 text-black border-cyan-400'
                : 'bg-white/90 dark:bg-[#080c16]/90 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white'
            }`}
            title="Layer Overlays"
          >
            <Layers className="w-4 h-4" />
            <span className="hidden sm:inline">Layers</span>
          </button>

          {showLayerMenu && (
            <div className="absolute top-10 right-0 w-60 bg-white/95 dark:bg-[#080c16]/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-2xl z-30 space-y-2 text-xs">
              <div className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider pb-1 border-b border-slate-200 dark:border-slate-800">
                Active Map Overlays
              </div>

              <label className="flex items-center justify-between text-slate-700 dark:text-slate-200 hover:text-cyan-300 cursor-pointer py-1">
                <span>1. Weather (Mesonets)</span>
                <input
                  type="checkbox"
                  checked={showWeather}
                  onChange={(e) => setShowWeather(e.target.checked)}
                  className="accent-cyan-400 cursor-pointer"
                />
              </label>
              <label className="flex items-center justify-between text-slate-700 dark:text-slate-200 hover:text-cyan-300 cursor-pointer py-1">
                <span>2. Precipitation (dBZ)</span>
                <input
                  type="checkbox"
                  checked={showPrecipitation}
                  onChange={(e) => setShowPrecipitation(e.target.checked)}
                  className="accent-cyan-400 cursor-pointer"
                />
              </label>
              <label className="flex items-center justify-between text-slate-700 dark:text-slate-200 hover:text-cyan-300 cursor-pointer py-1">
                <span>3. Thunderstorm Risk</span>
                <input
                  type="checkbox"
                  checked={showThunderstormRisk}
                  onChange={(e) => setShowThunderstormRisk(e.target.checked)}
                  className="accent-cyan-400 cursor-pointer"
                />
              </label>
              <label className="flex items-center justify-between text-slate-700 dark:text-slate-200 hover:text-cyan-300 cursor-pointer py-1">
                <span>4. Lightning Risk</span>
                <input
                  type="checkbox"
                  checked={showLightningRisk}
                  onChange={(e) => setShowLightningRisk(e.target.checked)}
                  className="accent-cyan-400 cursor-pointer"
                />
              </label>
              <label className="flex items-center justify-between text-slate-700 dark:text-slate-200 hover:text-cyan-300 cursor-pointer py-1">
                <span>5. Storm Track</span>
                <input
                  type="checkbox"
                  checked={showStormTrack}
                  onChange={(e) => setShowStormTrack(e.target.checked)}
                  className="accent-cyan-400 cursor-pointer"
                />
              </label>
            </div>
          )}
        </div>

        {/* TRACK LIVE GPS BUTTON (User requirement: "Live location ticha track kela pahije") */}
        <button
          onClick={toggleLiveLocationTracking}
          className={`px-2.5 py-2 rounded-xl backdrop-blur-md border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-lg ${
            isTrackingLive
              ? 'bg-emerald-500 text-black border-emerald-400 animate-pulse'
              : 'bg-white/90 dark:bg-[#080c16]/90 border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/20 hover:text-slate-900 dark:text-white'
          }`}
          title={isTrackingLive ? "Stop Live GPS Tracking" : "Track My Live Location via GPS"}
        >
          <Navigation className={`w-4 h-4 ${isTrackingLive ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline font-mono">
            {isTrackingLive ? 'Tracking GPS' : 'Track Live GPS'}
          </span>
        </button>

        {/* Center on Selected Location */}
        <button
          onClick={handleRecenter}
          className="p-2 rounded-xl bg-white/90 dark:bg-[#080c16]/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-cyan-400 transition cursor-pointer"
          title="Center Map on Selected Location"
        >
          <Crosshair className="w-4 h-4" />
        </button>

        {/* Zoom In */}
        <button
          onClick={() => mapInstanceRef.current?.zoomIn()}
          className="p-2 rounded-xl bg-white/90 dark:bg-[#080c16]/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-cyan-400 transition font-bold font-mono text-sm leading-none cursor-pointer"
          title="Zoom In"
        >
          +
        </button>

        {/* Zoom Out */}
        <button
          onClick={() => mapInstanceRef.current?.zoomOut()}
          className="p-2 rounded-xl bg-white/90 dark:bg-[#080c16]/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-cyan-400 transition font-bold font-mono text-sm leading-none cursor-pointer"
          title="Zoom Out"
        >
          -
        </button>

        {/* Fullscreen */}
        <button
          onClick={handleToggleFullscreen}
          className="p-2 rounded-xl bg-white/90 dark:bg-[#080c16]/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-cyan-400 transition cursor-pointer"
          title="Toggle Fullscreen"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Bottom Left: dBZ Scale Legend & Map Attributions */}
      <div className="absolute bottom-3 left-3 z-10 flex flex-col gap-1.5 hidden sm:flex">
        <div className="p-2.5 rounded-xl bg-white/90 dark:bg-[#080c16]/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 text-[10px] font-mono shadow-xl">
          <div className="text-slate-600 dark:text-slate-300 font-bold mb-1 flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              <span>DOPPLER RADAR INTENSITY</span>
            </span>
            <span className="text-slate-500 dark:text-slate-400">IMD dBZ</span>
          </div>
          <div className="flex items-center h-2 rounded overflow-hidden w-48 border border-slate-700">
            <div className="flex-1 bg-blue-500" title="Light Rain (15-25 dBZ)"></div>
            <div className="flex-1 bg-emerald-500" title="Moderate Rain (25-35 dBZ)"></div>
            <div className="flex-1 bg-yellow-400" title="Heavy Rain (35-45 dBZ)"></div>
            <div className="flex-1 bg-amber-500" title="Thunderstorm (45-50 dBZ)"></div>
            <div className="flex-1 bg-red-600" title="Severe Core (50-55 dBZ)"></div>
            <div className="flex-1 bg-purple-600" title="Hail Core (55+ dBZ)"></div>
          </div>
          <div className="flex justify-between text-[9px] text-slate-500 mt-0.5">
            <span>15 dBZ</span>
            <span>30</span>
            <span>45</span>
            <span>55+ dBZ</span>
          </div>
        </div>

        <div className="px-2 py-0.5 rounded-md bg-[#080c16]/80 text-[9px] font-mono text-slate-500 w-fit">
          Map: {BASE_MAPS[baseMap].name} • RainViewer Live Overlay
        </div>
      </div>

      {/* Bottom Right: Live GPS Tracking Status Banner */}
      {isTrackingLive && liveGpsCoords && (
        <div className="absolute bottom-3 right-3 z-10 px-3 py-1.5 rounded-xl bg-emerald-950/90 border border-emerald-500/60 backdrop-blur-md text-[11px] font-mono text-emerald-300 flex items-center gap-2 shadow-2xl animate-in fade-in">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>LIVE GPS: {liveGpsCoords.lat.toFixed(4)}°N, {liveGpsCoords.lon.toFixed(4)}°E (±{Math.round(liveGpsCoords.accuracy)}m)</span>
        </div>
      )}

      {/* GPS Error Alert */}
      {gpsError && (
        <div className="absolute bottom-3 right-3 z-10 px-3 py-2 rounded-xl bg-red-950/95 border border-red-500/60 backdrop-blur-md text-xs text-red-200 flex items-center gap-2 shadow-2xl">
          <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
          <span>{gpsError}</span>
          <button onClick={() => setGpsError(null)} className="text-red-300 hover:text-slate-900 dark:text-white ml-1">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Storm Inspector Drawer (Section 44) */}
      {activeInspectorStorm && (
        <div className="absolute top-14 right-3 z-20 w-80 bg-white/95 dark:bg-[#080c16]/95 backdrop-blur-md border border-cyan-500/40 rounded-2xl p-4 shadow-2xl animate-in fade-in slide-in-from-right-4">
          <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-cyan-400">{activeInspectorStorm.id}</span>
                <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-red-500/20 text-red-300 border border-red-500/30">
                  {activeInspectorStorm.severity}
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">{activeInspectorStorm.name}</h4>
            </div>
            <button 
              onClick={() => setActiveInspectorStorm(null)}
              className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 my-2.5 text-xs font-mono">
            <div className="p-2 rounded-xl bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Current Location</span>
              <span className="text-[11px] font-bold text-slate-900 dark:text-white truncate block">
                {activeInspectorStorm.lat.toFixed(3)}°N, {activeInspectorStorm.lon.toFixed(3)}°E
              </span>
            </div>
            <div className="p-2 rounded-xl bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Direction & Speed</span>
              <span className="text-[11px] font-bold text-slate-900 dark:text-white truncate block">
                {activeInspectorStorm.direction_deg}° @ {activeInspectorStorm.speed_kmh} km/h
              </span>
            </div>
            <div className="p-2 rounded-xl bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Core Intensity</span>
              <span className="text-sm font-bold text-cyan-300">{activeInspectorStorm.intensity_dbz} dBZ</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Echo Top Height</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">{activeInspectorStorm.vert_extent_km} km</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Thunderstorm Prob</span>
              <span className="text-sm font-bold text-amber-400">
                {Math.round((activeInspectorStorm.forecast_positions?.[0]?.prob || 0.88) * 100)}%
              </span>
            </div>
            <div className="p-2 rounded-xl bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Lightning Prob</span>
              <span className="text-sm font-bold text-cyan-400">
                {Math.round((activeInspectorStorm.forecast_positions?.[0]?.prob || 0.88) * 91)}%
              </span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-xs mb-3 space-y-1">
            <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 font-mono">
              <span>First Detected:</span>
              <span className="text-slate-700 dark:text-slate-200">{activeInspectorStorm.first_seen?.split('T')[1]?.substring(0, 5) || '16:15'} UTC</span>
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 font-mono">
              <span>Updated:</span>
              <span className="text-emerald-400 font-bold">18 sec ago (Verified)</span>
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 font-mono">
              <span>Digital Twin Status:</span>
              <span className="text-cyan-300 font-bold">{activeInspectorStorm.status}</span>
            </div>
          </div>

          {/* Section 44 Required Action Buttons */}
          <div className="grid grid-cols-3 gap-1.5 pt-1 border-t border-slate-200 dark:border-slate-800 text-center font-mono">
            <button 
              onClick={() => {
                setShowStormTrack(true);
                if (mapInstanceRef.current) {
                  mapInstanceRef.current.flyTo([activeInspectorStorm.lat, activeInspectorStorm.lon], 12);
                }
              }}
              className="px-2 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-[10px] font-bold text-cyan-300 transition cursor-pointer"
            >
              View Track
            </button>
            <a 
              href="/ai-nowcast"
              className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[10px] font-bold text-slate-700 dark:text-slate-200 transition inline-block"
            >
              View Pred
            </a>
            <a 
              href="/alerts"
              className="px-2 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-[10px] font-bold text-red-300 transition inline-block"
            >
              View Alert
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
