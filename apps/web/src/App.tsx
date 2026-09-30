import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { ForecastHorizon } from './types/weather';

// 18 Core Screens + 404
import { LandingScreen } from './screens/LandingScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { StormMapScreen } from './screens/StormMapScreen';
import { PredictionScreen } from './screens/PredictionScreen';
import { StormDetailScreen } from './screens/StormDetailScreen';
import { LightningScreen } from './screens/LightningScreen';
import { RadarScreen } from './screens/RadarScreen';
import { SatelliteScreen } from './screens/SatelliteScreen';
import { AtmosphereScreen } from './screens/AtmosphereScreen';
import { AlertsScreen } from './screens/AlertsScreen';
import { ReplayScreen } from './screens/ReplayScreen';
import { AnalyticsScreen } from './screens/AnalyticsScreen';
import { DataHealthScreen } from './screens/DataHealthScreen';
import { ExplainabilityScreen } from './screens/ExplainabilityScreen';
import { SavedLocationsScreen } from './screens/SavedLocationsScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { AdminScreen } from './screens/AdminScreen';
import { AboutScreen } from './screens/AboutScreen';
import { NotFoundScreen } from './screens/NotFoundScreen';
import { LoginScreen } from './screens/LoginScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { Navigate } from 'react-router-dom';
import { authService } from './services/auth';
import { weatherApi } from './services/api';

import { ThemeProvider } from './context/ThemeContext';

const AuthCallbackHandler: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    if (code) {
      fetch(`/api/v1/auth/google/callback?code=${code}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.data) {
            authService.setUser(data.data);
            navigate('/dashboard', { replace: true });
          } else {
            navigate('/login', { replace: true });
          }
        })
        .catch(() => {
          // Fallback if backend is unresponsive
          authService.loginDemo('Operator');
          navigate('/dashboard', { replace: true });
        });
    } else {
      navigate('/login', { replace: true });
    }
  }, [location, navigate]);

  return (
    <div className="min-h-screen bg-[#060913] flex items-center justify-center">
      <div className="text-cyan-400 font-mono text-xs animate-pulse">Authenticating with Google...</div>
    </div>
  );
};

const MainLayout: React.FC = () => {
  const location = useLocation();
  const [horizon, setHorizon] = useState<ForecastHorizon>(30);
  const [activeLocation, setActiveLocation] = useState<string>("Sangamner, Maharashtra");
  const [activeCoords, setActiveCoords] = useState<[number, number]>([19.5761, 74.2070]);

  const handleLocationChange = (name: string, coords?: [number, number]) => {
    setActiveLocation(name);
    if (coords && coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
      setActiveCoords(coords);
    }
  };

  React.useEffect(() => {
    if (authService.isAuthenticated()) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;
            setActiveCoords([lat, lon]);
            try {
              const res = await weatherApi.reverseGeocode(lat, lon);
              if (res && res.name) {
                const locName = res.state ? `${res.name}, ${res.state}` : res.name;
                setActiveLocation(locName);
              }
            } catch (e) {
              console.error("Reverse geocoding error:", e);
            }
          },
          (err) => {
            console.warn("Geolocation permission denied or failed:", err);
          }
        );
      }
    }
  }, []);

  // Landing page has custom full-width hero layout
  if (location.pathname === '/') {
    return <LandingScreen />;
  }

  // Standalone Login screen
  if (location.pathname === '/login') {
    if (authService.isAuthenticated()) {
      return <Navigate to="/dashboard" replace />;
    }
    return <LoginScreen />;
  }

  // Logout handler
  if (location.pathname === '/logout') {
    authService.logout();
    return <Navigate to="/login" replace />;
  }

  // Auth callback handler
  if (location.pathname === '/auth/callback') {
    return <AuthCallbackHandler />;
  }

  // Protect all internal application routes (Section 6: Unauthenticated -> /login, Authenticated -> /dashboard)
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text)] flex flex-col font-sans transition-colors duration-200">
      {/* Top Command Center Bar */}
      <Header
        horizon={horizon}
        onHorizonChange={setHorizon}
        activeLocation={activeLocation}
        onLocationChange={handleLocationChange}
      />

      {/* Main Container: Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto pb-16 lg:pb-6">
          <ErrorBoundary>
            <Routes>
              <Route
                path="/dashboard"
                element={
                  <DashboardScreen
                    horizon={horizon}
                    onHorizonChange={setHorizon}
                    activeLocation={activeLocation}
                    activeCoords={activeCoords}
                    onLocationChange={handleLocationChange}
                  />
                }
              />
              <Route
                path="/map"
                element={
                  <StormMapScreen
                    horizon={horizon}
                    onHorizonChange={setHorizon}
                    activeLocation={activeLocation}
                    activeCoords={activeCoords}
                    onLocationChange={handleLocationChange}
                  />
                }
              />
              <Route
                path="/live-map"
                element={
                  <StormMapScreen
                    horizon={horizon}
                    onHorizonChange={setHorizon}
                    activeLocation={activeLocation}
                    activeCoords={activeCoords}
                    onLocationChange={handleLocationChange}
                  />
                }
              />
              <Route path="/prediction" element={<PredictionScreen />} />
              <Route path="/ai-nowcast" element={<PredictionScreen />} />
              <Route path="/storms" element={<StormDetailScreen />} />
              <Route path="/storms/:id" element={<StormDetailScreen />} />
              <Route path="/lightning" element={<LightningScreen />} />
              <Route path="/radar" element={<RadarScreen />} />
              <Route path="/satellite" element={<SatelliteScreen />} />
              <Route path="/atmosphere" element={<AtmosphereScreen />} />
              <Route path="/alerts" element={<AlertsScreen />} />
              <Route path="/replay" element={<ReplayScreen />} />
              <Route path="/analytics" element={<AnalyticsScreen />} />
              <Route path="/data-health" element={<DataHealthScreen />} />
              <Route path="/explainability" element={<ExplainabilityScreen />} />
              <Route path="/saved-locations" element={<SavedLocationsScreen />} />
              <Route path="/settings" element={<SettingsScreen />} />
              <Route path="/profile" element={<ProfileScreen />} />
              <Route path="/admin" element={<AdminScreen />} />
              <Route path="/about" element={<AboutScreen />} />
              <Route path="*" element={<NotFoundScreen />} />
            </Routes>
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <MainLayout />
      </BrowserRouter>
    </ThemeProvider>
  );
}
