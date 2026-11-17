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
import ToastContainer from './components/Toast';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { useLang } from './i18n/LanguageContext';

export default function App() {
  const { lang, t } = useLang();

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
  const [backendError, setBackendError] = useState(null);
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

  const executePrediction = async (lat, lon, place_name, taluk, area, shouldTransitionToResults = false) => {
    setIsPredicting(true);
    setGeofenceError(null);
    setBackendError(null);

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
          setBackendError(data.detail?.message || data.message || 'Selected location could not be predicted. Please try again.');
        }
        setAnalyzeStep('map');
        return;
      }

      setPrediction(data);
      setSelectedCoords({
        lat,
        lon,
        place_name: data.location_summary?.place_name || place_name,
        taluk: data.location_summary?.taluk || taluk
      });

      // Phase 6: Store full ISO date and quintals/acre in History
      const primaryRec = data.top_recommendations?.[0] || {};
      const yieldPerAcreQ = primaryRec.yield_quintals_per_acre 
        || (data.yield_forecast?.expected_yield_per_acre ? (data.yield_forecast.expected_yield_per_acre * 4.047).toFixed(1) : '12.5');

      const newHistoryItem = {
        id: `dk-${Date.now()}`,
        place_name: data.location_summary?.place_name || place_name,
        taluk: data.location_summary?.taluk || taluk,
        lat,
        lon,
        area_acres: area,
        crop: data.recommended_crop,
        yield_forecast: `${yieldPerAcreQ} Q/acre`,
        date: new Date().toISOString()
      };

      setHistory((prev) => {
        const updated = [newHistoryItem, ...prev.slice(0, 19)];
        try {
          localStorage.setItem('terravision_history', JSON.stringify(updated));
        } catch (e) {
          console.warn('Could not save history to localStorage', e);
        }
        return updated;
      });

      if (shouldTransitionToResults) {
        const queryParams = new URLSearchParams(window.location.search);
        if (queryParams.get('step') === 'results') {
          setAnalyzeStep('results');
        } else {
          setAnalyzeStep('scanning');
        }
      }
    } catch (err) {
      console.error("Prediction failed:", err);
      setBackendError('Network error or server connection failed. Please ensure the backend is running and try again.');
      setAnalyzeStep('map');
    } finally {
      setIsPredicting(false);
    }
  };

  // Load Taluk coordinates
  useEffect(() => {
    fetch('/api/taluks')
      .then((res) => res.json())
      .then((data) => {
        if (data.taluks) setTaluks(data.taluks);
      })
      .catch((err) => console.error("Error loading taluks:", err));

    // Phase 6: Run on-mount prediction ONLY if ?step=results is explicitly in the URL
    const params = new URLSearchParams(window.location.search);
    if (params.get('step') === 'results') {
      setTimeout(() => {
        executePrediction(12.7667, 75.2000, 'Puttur Agricultural Sector', 'Puttur', 2.34, true);
      }, 0);
    }
  }, []);

  const handleLocationPicked = (lat, lon, place_name, taluk) => {
    setSelectedCoords({
      lat,
      lon,
      place_name: place_name || 'Selected Farm Plot',
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

  const handleDeleteHistoryItem = (id) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem('terravision_history', JSON.stringify(updated));
      } catch (e) {
        console.warn('Could not update history:', e);
      }
      return updated;
    });
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

  // Determine current high-definition farming background per page & step
  const getPageBackground = () => {
    if (activeTab === 'dashboard') return '/images/backgrounds/bg-dashboard.jpg';
    if (activeTab === 'analyze') {
      if (analyzeStep === 'scanning') return '/images/backgrounds/bg-scanning.jpg';
      if (analyzeStep === 'results') return '/images/backgrounds/bg-results.jpg';
      return '/images/backgrounds/bg-map.jpg';
    }
    if (activeTab === 'history') return '/images/backgrounds/bg-history.jpg';
    if (activeTab === 'models') return '/images/backgrounds/bg-models.jpg';
    if (activeTab === 'about') return '/images/backgrounds/bg-about.jpg';
    return '/images/backgrounds/bg-dashboard.jpg';
  };

  const currentBg = getPageBackground();

  return (
    <div className="min-h-screen relative text-slate-800 flex flex-col selection:bg-emerald-600 selection:text-white">
      {/* Full-bleed Fixed HD Agricultural Background - Dynamic per page */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-slate-50"
        aria-hidden="true"
      >
        <img
          key={currentBg}
          src={currentBg}
          alt=""
          className="w-full h-full object-cover object-center transition-all duration-700 ease-in-out opacity-85"
        />
        {/* Soft atmospheric translucent veil ensuring WCAG AA contrast & readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/92 via-emerald-50/85 to-white/94 backdrop-blur-[1px]" />
      </div>

      {/* Floating Glass Navbar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab === 'analyze' && analyzeStep === 'scanning') {
            setAnalyzeStep('map');
          }
        }}
        user={user}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
      />

      {/* Main View Switcher */}
      <main className="relative z-10 flex-1 w-full pt-16 flex flex-col">
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
            {/* Phase 5: 3-Step Progress Indicator (1 Pick land -> 2 Analyzing -> 3 Results) */}
            <div className="mb-6 flex items-center justify-center max-w-md mx-auto w-full">
              <div className="flex items-center w-full justify-between">
                {/* Step 1 */}
                <button
                  onClick={() => setAnalyzeStep('map')}
                  className={`flex items-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                    analyzeStep === 'map' ? 'text-emerald-800' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    analyzeStep === 'map' ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-800'
                  }`}>1</span>
                  <span>{lang === 'kn' ? '೧. ಭೂಮಿ ಆಯ್ಕೆ' : '1. Pick land'}</span>
                </button>

                <div className={`flex-1 h-0.5 mx-3 transition-colors ${
                  analyzeStep !== 'map' ? 'bg-emerald-600' : 'bg-slate-200'
                }`} />

                {/* Step 2 */}
                <div className={`flex items-center gap-2 text-xs font-bold ${
                  analyzeStep === 'scanning' ? 'text-emerald-800' : analyzeStep === 'results' ? 'text-emerald-700' : 'text-slate-400'
                }`}>
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    analyzeStep === 'scanning' ? 'bg-emerald-600 text-white' : analyzeStep === 'results' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-400'
                  }`}>2</span>
                  <span>{lang === 'kn' ? '೨. ಪರಿಶೀಲನೆ' : '2. Analyzing'}</span>
                </div>

                <div className={`flex-1 h-0.5 mx-3 transition-colors ${
                  analyzeStep === 'results' ? 'bg-emerald-600' : 'bg-slate-200'
                }`} />

                {/* Step 3 */}
                <div className={`flex items-center gap-2 text-xs font-bold ${
                  analyzeStep === 'results' ? 'text-emerald-800 font-extrabold' : 'text-slate-400'
                }`}>
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    analyzeStep === 'results' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'
                  }`}>3</span>
                  <span>{lang === 'kn' ? '೩. ಫಲಿತಾಂಶ' : '3. Results'}</span>
                </div>
              </div>
            </div>

            {/* Inline Error Notice with Retry Button */}
            {backendError && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-red-800">
                <div className="flex items-center gap-2.5">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                  <span>{backendError}</span>
                </div>
                <button
                  onClick={() => {
                    setBackendError(null);
                    executePrediction(selectedCoords.lat, selectedCoords.lon, selectedCoords.place_name, selectedCoords.taluk, farmArea, true);
                  }}
                  className="btn-primary min-h-[38px] px-3.5 py-1.5 text-xs bg-red-600 hover:bg-red-700 self-start sm:self-auto"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{t('res.retry_btn', 'Try again')}</span>
                </button>
              </div>
            )}

            {/* Header sub-bar for Map Step */}
            {analyzeStep === 'map' && (
              <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 mb-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    <span>{t('map.header_sub', 'Dakshina Kannada Farm Map')}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Space_Grotesk'] tracking-tight">
                    {t('map.header_title', 'Select your land or search village')}
                  </h2>
                </div>
                <div className="text-xs font-medium text-slate-600 flex items-center gap-2">
                  <span className="text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 font-medium">
                    {t('map.header_badge', 'Dakshina Kannada')}
                  </span>
                  <span>•</span>
                  <span>{t('map.header_tip', 'Zoom in to view fields, trees, and survey plots')}</span>
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
              } catch (e) {
                console.warn('Could not clear history:', e);
              }
            }}
            onDeleteRecord={handleDeleteHistoryItem}
            onStartAnalyze={() => {
              setActiveTab('analyze');
              setAnalyzeStep('map');
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
      <footer className="relative z-10 w-full bg-white/95 backdrop-blur-md border-t border-emerald-500/20 py-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-600 shadow-sm mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            <span className="text-slate-900 font-bold">{t('footer.brand', 'TerraVision Farm AI')}</span>
            <span className="text-slate-300">|</span>
            <span>{t('footer.sub', 'Satellite Precision Agriculture for Dakshina Kannada, Karnataka')}</span>
          </div>
          <div className="text-slate-500">
            {t('footer.tech', 'Bhoomi RTC • Kaveri EC • Dakshina Kannada Agro-Climatic Intelligence')}
          </div>
        </div>
      </footer>

      {/* Geofence Rejection Error Modal */}
      <GeofenceModal
        errorData={geofenceError}
        onClose={() => setGeofenceError(null)}
        onSelectTaluk={(tItem) => {
          setSelectedCoords({
            lat: tItem.lat,
            lon: tItem.lon,
            place_name: tItem.place_name,
            taluk: tItem.taluk
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

      {/* Global Notifications Toast Container */}
      <ToastContainer />
    </div>
  );
}
