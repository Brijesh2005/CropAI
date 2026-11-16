import React from 'react';
import { Satellite, ShieldCheck, Compass, Globe } from 'lucide-react';

export default function AboutView({ onStartAnalyze }) {
  return (
    <div className="w-full max-w-5xl mx-auto py-24 px-4 sm:px-6 lg:px-8 flex flex-col gap-12 text-left">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 border border-emerald-300 text-xs font-semibold text-emerald-800 mb-4 shadow-sm">
          <Satellite className="w-4 h-4 text-emerald-700" />
          <span>TerraVision Farm AI Mission</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-['Space_Grotesk'] tracking-tight mb-4">
          Satellite Intelligence for Dakshina Kannada Farmers
        </h2>
        <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
          TerraVision Farm AI combines high-resolution Sentinel-2 satellite observation with machine learning models specialized for the coastal and plantation microclimates of Dakshina Kannada, Karnataka.
        </p>
      </div>

      {/* Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-7 hover:border-emerald-300 transition-all">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center mb-4 text-emerald-700">
            <Globe className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 font-['Space_Grotesk'] mb-2">
            10-Meter Earth Observation
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Bottom-of-Atmosphere spectral bands provide high-fidelity canopy health data, reading chlorophyll and moisture directly over your farm.
          </p>
        </div>

        <div className="card p-7 hover:border-emerald-300 transition-all">
          <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center mb-4 text-amber-700">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 font-['Space_Grotesk'] mb-2">
            Regional Geofencing
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Engineered exclusively for Dakshina Kannada's 7 taluks—accounting for heavy monsoon rainfall, lateritic soils, and plantation canopies.
          </p>
        </div>

        <div className="card p-7 hover:border-emerald-300 transition-all">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center mb-4 text-emerald-700">
            <Compass className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 font-['Space_Grotesk'] mb-2">
            Actionable Agronomy
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Transforms raw satellite data into field-level guidance for planting, drainage, fertilizer timing, and harvest yield expectations.
          </p>
        </div>
      </div>

      {/* CTA Box */}
      <div className="card p-8 sm:p-10 text-center flex flex-col items-center bg-gradient-to-br from-white via-emerald-50/50 to-emerald-100/30 border border-emerald-300">
        <h3 className="text-2xl font-bold text-slate-900 font-['Space_Grotesk'] mb-3">
          Ready to check your farm land?
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 max-w-lg mb-6">
          Access the interactive satellite map to pinpoint your acreage and generate real-time AI crop forecasts.
        </p>
        <button
          onClick={onStartAnalyze}
          className="btn-primary"
        >
          Check my farm
        </button>
      </div>
    </div>
  );
}
