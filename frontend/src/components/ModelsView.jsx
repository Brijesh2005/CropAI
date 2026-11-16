import React, { useState, useEffect } from 'react';
import { Cpu, CheckCircle2, ArrowRight } from 'lucide-react';

export default function ModelsView({ onOpenMetricsModal }) {
  const [, setMetrics] = useState(null);

  useEffect(() => {
    fetch('/api/metrics')
      .then((res) => res.json())
      .then((data) => setMetrics(data))
      .catch((err) => console.error("Error loading metrics:", err));
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 flex flex-col gap-10 text-left">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 mb-2">
          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-emerald-700" />
            <span>AI Architecture</span>
          </span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-600">How the prediction works</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Space_Grotesk'] tracking-tight">
          Hybrid Multi-Modal Meta-Fusion Model
        </h2>
        <p className="text-slate-600 text-sm mt-2 max-w-3xl leading-relaxed">
          Dual-stream deep ensemble integrating Sentinel-2 Level-2A multi-spectral satellite imagery and high-density atmospheric &amp; soil telemetry via ExtraTrees meta-learning, calibrated specifically for coastal Dakshina Kannada.
        </p>
      </div>

      {/* Accuracy Showcase Banner */}
      <div className="card border-2 border-emerald-500 p-8 relative overflow-hidden shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
          <div className="p-2">
            <div className="text-5xl font-black text-emerald-800 font-['Space_Grotesk'] tracking-tight">
              88.29%
            </div>
            <div className="text-xs font-bold text-slate-700 mt-1.5 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Model accuracy</span>
            </div>
          </div>

          <div className="p-2">
            <div className="text-3xl font-bold text-slate-900 font-['Space_Grotesk']">
              +5.7%
            </div>
            <div className="text-xs font-semibold text-slate-500 mt-1">
              Gain over single-modal
            </div>
          </div>

          <div className="p-2">
            <div className="text-3xl font-bold text-slate-900 font-['Space_Grotesk']">
              0.881
            </div>
            <div className="text-xs font-semibold text-slate-500 mt-1">
              Weighted F1-score
            </div>
          </div>

          <div>
            <button
              onClick={onOpenMetricsModal}
              className="btn-primary w-full"
            >
              <span>Explore training details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Dual Stream Architecture Diagram */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Stream 1: Numerical */}
        <div className="card p-7 flex flex-col justify-between shadow-sm hover:border-emerald-300 transition-all">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-slate-500 font-bold">Stream A</span>
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Weather &amp; Soil
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-['Space_Grotesk'] mb-2">
              Atmospheric &amp; Edaphic Pipeline
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Ingests 11 continuous features including precipitation curves, min/max temperatures, relative humidity, soil pH, and N-P-K nutrient profiles across Dakshina Kannada.
            </p>
          </div>

          <div className="space-y-2.5 border-t border-slate-100 pt-4 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Primary classifier:</span>
              <span className="text-slate-900 font-bold">CatBoost + XGBoost</span>
            </div>
            <div className="flex justify-between">
              <span>Single stream accuracy:</span>
              <span className="text-emerald-700 font-bold">82.6%</span>
            </div>
          </div>
        </div>

        {/* Stream 2: Satellite */}
        <div className="card p-7 flex flex-col justify-between shadow-sm hover:border-emerald-300 transition-all">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-slate-500 font-bold">Stream B</span>
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Satellite Imagery
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-['Space_Grotesk'] mb-2">
              Sentinel-2 Multi-Spectral
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Extracts 10-meter Level-2A surface reflectances in Blue, Green, Red, and NIR bands to calculate vegetative health indices (NDVI, NDRE, EVI).
            </p>
          </div>

          <div className="space-y-2.5 border-t border-slate-100 pt-4 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Satellite source:</span>
              <span className="text-slate-900 font-bold">Sentinel-2 L2A</span>
            </div>
            <div className="flex justify-between">
              <span>Single stream accuracy:</span>
              <span className="text-emerald-700 font-bold">79.8%</span>
            </div>
          </div>
        </div>

        {/* Fusion Layer */}
        <div className="card border-2 border-emerald-500 p-7 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-emerald-800 font-bold">Synthesis</span>
              <span className="text-xs font-bold text-white bg-emerald-600 px-2.5 py-0.5 rounded-full">
                Meta-Learner
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-['Space_Grotesk'] mb-2">
              ExtraTrees Fusion v2.0
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Stochastic decision forest combines predictions from Stream A and Stream B, weighting cross-modal interactions to select the highest-confidence crop and yield.
            </p>
          </div>

          <div className="space-y-2.5 border-t border-slate-100 pt-4 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Final accuracy:</span>
              <span className="text-emerald-700 font-bold text-sm">88.29%</span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                <span>Active &amp; Ready</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
