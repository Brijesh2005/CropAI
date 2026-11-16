import React from 'react';
import { AlertCircle, X, MapPin, ArrowRight } from 'lucide-react';

const TALUKS = [
  { name: 'Puttur', knName: 'ಪುತ್ತೂರು', lat: 12.7663, lon: 75.2033 },
  { name: 'Mangaluru', knName: 'ಮಂಗಳೂರು', lat: 12.9141, lon: 74.8560 },
  { name: 'Bantwal', knName: 'ಬಂಟ್ವಾಳ', lat: 12.8903, lon: 75.0347 },
  { name: 'Belthangady', knName: 'ಬೆಳ್ತಂಗಡಿ', lat: 12.9983, lon: 75.2588 },
  { name: 'Sullia', knName: 'ಸುಳ್ಯ', lat: 12.5606, lon: 75.3892 },
  { name: 'Moodbidri', knName: 'ಮೂಡುಬಿದಿರೆ', lat: 13.0694, lon: 74.9961 },
  { name: 'Kadaba', knName: 'ಕಡಬ', lat: 12.7381, lon: 75.4522 }
];

export default function GeofenceModal({ errorData, onClose, onSelectTaluk }) {
  if (!errorData) return null;

  const nearestTalukObj = TALUKS.find(
    (t) => t.name.toLowerCase() === (errorData.nearest_taluk || '').toLowerCase()
  ) || TALUKS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in text-left">
      <div className="relative w-full max-w-lg rounded-2xl bg-white border border-amber-200 p-6 sm:p-7 shadow-2xl flex flex-col gap-5">
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Warning Header */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-amber-800 block">
              ಸ್ಥಳ ಪರಿಶೀಲನೆ • Location Notice
            </span>
            <h3 className="text-xl font-bold text-slate-900 font-['Space_Grotesk']">
              Outside Dakshina Kannada
            </h3>
          </div>
        </div>

        {/* Friendly explanation */}
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200/80 text-xs text-amber-900 leading-relaxed">
          <p className="font-medium">
            {errorData.message || 'The selected location is outside Dakshina Kannada district.'}
          </p>
          {errorData.nearest_taluk && (
            <p className="mt-1.5 font-bold text-amber-950">
              Nearest taluk: {errorData.nearest_taluk} ({errorData.distance_km || 0} km away)
            </p>
          )}
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Our AI models and satellite indices are calibrated specifically for the 7 taluks of Dakshina Kannada. Tap a taluk below to jump to that area:
        </p>

        {/* Quick Jump Main Action: Go to nearest taluk */}
        <button
          onClick={() => {
            onSelectTaluk({
              lat: nearestTalukObj.lat,
              lon: nearestTalukObj.lon,
              place_name: `${nearestTalukObj.name} Sector`,
              taluk: nearestTalukObj.name
            });
            onClose();
          }}
          className="btn-primary w-full"
        >
          <MapPin className="w-4 h-4" />
          <span>Go to nearest taluk ({nearestTalukObj.name} - {nearestTalukObj.knName})</span>
          <ArrowRight className="w-4 h-4 ml-auto" />
        </button>

        {/* 7 Taluk Chips */}
        <div>
          <div className="text-xs font-semibold text-slate-500 mb-2">
            Or choose another taluk:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {TALUKS.map((t) => (
              <button
                key={t.name}
                onClick={() => {
                  onSelectTaluk({
                    lat: t.lat,
                    lon: t.lon,
                    place_name: `${t.name} Sector`,
                    taluk: t.name
                  });
                  onClose();
                }}
                className="min-h-[44px] px-3 py-2 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-900 text-xs font-semibold text-left transition-colors flex items-center gap-2 cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">{t.knName} ({t.name})</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
