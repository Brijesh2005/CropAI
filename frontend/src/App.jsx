import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DashboardView from './components/DashboardView';
import HighPrecisionFarmPicker from './components/HighPrecisionFarmPicker';
import AnalysisScanner from './components/AnalysisScanner';
import ResultsView from './components/ResultsView';
import HistoryView from './components/HistoryView';
import ModelsView from './components/ModelsView';
import AboutView from './components/AboutView';
import GeofenceModal from './components/GeofenceModal';
import MetricsModal from './components/MetricsModal';
import AuthModal from './components/AuthModal';
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('tab') || 'dashboard';
  }); // 'dashboard' | 'analyze' | 'history' | 'models' | 'about'
  const [analyzeStep, setAnalyzeStep] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('step') || 'map';
  }); // 'map' | 'scanning' | 'results'

  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('terravision_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('auth') === '1';
  });
  const [authMode, setAuthMode] = useState('login');

  const [selectedCoords, setSelectedCoords] = useState({
    lat: 12.7667,
    lon: 75.2000,
    place_name: 'Puttur Agricultural Sector',
    taluk: 'Puttur'
  });
  const [farmArea, setFarmArea] = useState(2.34);
  const [prediction, setPrediction] = useState(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [geofenceError, setGeofenceError] = useState(null);
  const [isMetricsOpen, setIsMetricsOpen] = useState(false);
  const [taluks, setTaluks] = useState(null);
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('terravision_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Load Taluk coordinates and initial prediction
  useEffect(() => {
    fetch('/api/taluks')
      .then((res) => res.json())
      .then((data) => {
        if (data.taluks) setTaluks(data.taluks);
      })
      .catch((err) => console.error("Error loading taluks:", err));

    // Run initial prediction for default location
    const params = new URLSearchParams(window.location.search);
    const autoResults = params.get('step') === 'results';
    executePrediction(12.7667, 75.2000, 'Puttur Agricultural Sector', 'Puttur', 2.34, autoResults);
  }, []);

  const executePrediction = async (lat, lon, place_name, taluk, area, shouldTransitionToResults = false) => {
    setIsPredicting(true);
    setGeofenceError(null);

    try {
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lat,
          lon,
          place_name,
          taluk,
          area_acres: area
        })
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.detail && data.detail.error === 'OUTSIDE_DAKSHINA_KANNADA') {
          setGeofenceError(data.detail);
        } else {
          setGeofenceError({
            message: data.detail?.message || 'Selected location cannot be predicted.',
            lat,
            lon
          });
        }
        setAnalyzeStep('map');
        return;
      }

      setPrediction(data);
      setSelectedCoords({
        lat,
        lon,
        place_name: data.location_summary.place_name,
        taluk: data.location_summary.taluk
      });

      // Save to history
      const newHistoryItem = {
        id: `dk-${Date.now()}`,
        place_name: data.location_summary.place_name,
        taluk: data.location_summary.taluk,
        lat,
        lon,
        area_acres: area,
        crop: data.recommended_crop,
        yield_forecast: `${(data.yield_forecast?.expected_yield_per_acre * 2.47105 || 4.82).toFixed(2)} T/Ha`,
        date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setHistory((prev) => {
        const updated = [newHistoryItem, ...prev.slice(0, 19)];
        try {
          localStorage.setItem('terravision_history', JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });

      if (shouldTransitionToResults) {
        const queryParams = new URLSearchParams(window.location.search);
        if (queryParams.get('step') === 'results') {
          setAnalyzeStep('results');
        } else {
          // Show scanning animation briefly, then transition to results
          setAnalyzeStep('scanning');
        }
      }
    } catch (err) {
      console.error("Prediction failed:", err);
      setGeofenceError({
        message: 'Network error or backend connection failed. Ensure FastAPI is running on port 8000.',
        lat,
        lon
      });
      setAnalyzeStep('map');
    } finally {
      setIsPredicting(false);
    }
  };

  const handleLocationPicked = (lat, lon, place_name, taluk) => {
    setSelectedCoords({
      lat,
      lon,
      place_name: place_name || 'Selected Sector',
      taluk: taluk || selectedCoords.taluk
    });
  };

  const handleConfirmField = (confirmedArea) => {
    setFarmArea(confirmedArea);
    setAnalyzeStep('scanning');
    executePrediction(
      selectedCoords.lat,
      selectedCoords.lon,
      selectedCoords.place_name,
      selectedCoords.taluk,
      confirmedArea,
      true
    );
  };

  const handleScanComplete = () => {
    setAnalyzeStep('results');
  };

  const handleOpenAuth = (mode = 'login') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = (authenticatedUser) => {
    setUser(authenticatedUser);
    if (authenticatedUser?.taluk && taluks && taluks[authenticatedUser.taluk]) {
      const talukInfo = taluks[authenticatedUser.taluk];
      setSelectedCoords({
        lat: talukInfo.lat,
        lon: talukInfo.lon,
        place_name: `${authenticatedUser.taluk} Sector (${authenticatedUser.full_name || authenticatedUser.username}'s Farm)`,
        taluk: authenticatedUser.taluk
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('terravision_user');
    localStorage.removeItem('terravision_token');
    setUser(null);
  };

  return (
    <div className="min-h-screen farm-bg text-slate-800 flex flex-col selection:bg-emerald-600 selection:text-white">
      {/* Floating Glass Navbar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab === 'analyze' && analyzeStep === 'scanning') {
            setAnalyzeStep('map');
          }
        }}
        onOpenMetrics={() => setIsMetricsOpen(true)}
        activeTaluk={selectedCoords?.taluk}
        user={user}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
      />

      {/* Main View Switcher */}
      <main className="flex-1 w-full pt-16 flex flex-col">
        {activeTab === 'dashboard' && (
          <DashboardView
            onStartAnalyze={() => {
              setActiveTab('analyze');
              setAnalyzeStep('map');
            }}
            onExploreSystem={() => setActiveTab('models')}
            onSelectTaluk={(t) => {
              setSelectedCoords({
                lat: t.lat,
                lon: t.lon,
                place_name: `${t.name} Agro Sector`,
                taluk: t.name
              });
              setActiveTab('analyze');
              setAnalyzeStep('map');
            }}
            taluks={taluks}
          />
        )}

        {activeTab === 'analyze' && (
          <div className="w-full flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col text-left">
            {/* Header sub-bar for Analyze Command Center */}
            {analyzeStep === 'map' && (
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-700 mb-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-ping" />
                    <span>ದಕ್ಷಿಣ ಕನ್ನಡ ಜಿಯೋಸ್ಪೇಷಿಯಲ್ ಕೃಷಿ ನಕ್ಷೆ // SATELLITE ENGINE</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Space_Grotesk'] tracking-tight">
                    Select Your Land or Search Village
                  </h2>
                </div>
                <div className="text-xs font-semibold text-slate-500 flex items-center gap-2">
                  <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    Dakshina Kannada Geofenced
                  </span>
                  <span>•</span>
                  <span>Zoom in to view fields, trees, and survey plots</span>
                </div>
              </div>
            )}

            {/* Step 1: High-Precision Interactive Satellite Map & Custom Parcel Drawing */}
            {analyzeStep === 'map' && (
              <HighPrecisionFarmPicker
                selectedCoords={selectedCoords}
                onLocationPicked={handleLocationPicked}
                onFieldConfirmed={handleConfirmField}
                onGeofenceError={(err) => setGeofenceError(err)}
                farmArea={farmArea}
                onAreaChange={(newArea) => setFarmArea(newArea)}
                isAnalyzing={isPredicting}
              />
            )}

            {/* Step 2: AI Scanning Screen */}
            {analyzeStep === 'scanning' && (
              <div className="my-auto py-12">
                <AnalysisScanner
                  locationInfo={selectedCoords}
                  onScanComplete={handleScanComplete}
                />
              </div>
            )}

            {/* Step 3: High-End Farmer-Friendly AI Results Showcase */}
            {analyzeStep === 'results' && (
              <ResultsView
                prediction={prediction}
                currentArea={farmArea}
                onReset={() => setAnalyzeStep('map')}
              />
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <HistoryView
            history={history}
            onSelectRecord={(rec) => {
              setSelectedCoords({
                lat: rec.lat,
                lon: rec.lon,
                place_name: rec.place_name,
                taluk: rec.taluk
              });
              setFarmArea(rec.area_acres);
              setActiveTab('analyze');
              setAnalyzeStep('map');
            }}
            onClearHistory={() => {
              setHistory([]);
              try {
                localStorage.removeItem('terravision_history');
              } catch (e) {}
            }}
          />
        )}

        {activeTab === 'models' && (
          <ModelsView onOpenMetricsModal={() => setIsMetricsOpen(true)} />
        )}

        {activeTab === 'about' && (
          <AboutView
            onStartAnalyze={() => {
              setActiveTab('analyze');
              setAnalyzeStep('map');
            }}
          />
        )}
      </main>

      {/* Farmer-Friendly Clean White Footer */}
      <footer className="w-full bg-white border-t border-emerald-500/20 py-8 px-4 sm:px-6 lg:px-8 font-mono text-xs text-slate-600 shadow-sm mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            <span className="text-slate-900 font-bold">TERRAVISION FARM AI</span>
            <span className="text-slate-400">|</span>
            <span>Satellite Precision Agriculture for Dakshina Kannada, Karnataka</span>
          </div>
          <div className="text-slate-500">
            Sentinel-2 L2A BOA • Bhoomi RTC Integration • ExtraTrees Meta-Fusion v2.0 (88.3% Accuracy)
          </div>
        </div>
      </footer>

      {/* Geofence Rejection Error Modal */}
      <GeofenceModal
        errorData={geofenceError}
        onClose={() => setGeofenceError(null)}
        onSelectTaluk={(t) => {
          setSelectedCoords({
            lat: t.lat,
            lon: t.lon,
            place_name: t.place_name,
            taluk: t.taluk
          });
          setGeofenceError(null);
        }}
      />

      {/* Model Evaluation & Training Metrics Modal */}
      <MetricsModal
        isOpen={isMetricsOpen}
        onClose={() => setIsMetricsOpen(false)}
      />

      {/* User Authentication Modal (Sign In / Register) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}
