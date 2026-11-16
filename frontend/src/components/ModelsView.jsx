import React, { useState, useEffect } from 'react';
import { Cpu, ShieldCheck, Activity, Layers, Database, ArrowRight, CheckCircle2, Award, Zap, BarChart3 } from 'lucide-react';

export default function ModelsView({ onOpenMetricsModal }) {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    fetch('/api/metrics')
      .then((res) => res.json())
      .then((data) => setMetrics(data))
      .catch((err) => console.error("Error loading metrics:", err));
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 flex flex-col gap-10 text-left animate-fade-in">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-800 mb-2">
          <span className="p-1 rounded bg-emerald-100 text-emerald-800 flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5 text-emerald-600" />
            <span>PHASE 3 ARCHITECTURE</span>
          </span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-600">PRODUCTION INFERENCE ENGINE</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Space_Grotesk'] tracking-tight">
          Hybrid Multi-Modal Meta-Fusion Model
        </h2>
        <p className="text-slate-600 text-sm mt-2 max-w-3xl leading-relaxed">
          Dual-stream deep ensemble integrating Sentinel-2 Level-2A multi-spectral satellite imagery and high-density atmospheric & edaphic telemetry via ExtraTrees meta-learning, calibrated specifically for coastal Dakshina Kannada.
        </p>
      </div>

      {/* Accuracy Showcase Banner */}
      <div className="rounded-2xl bg-white border-2 border-emerald-500 p-8 relative overflow-hidden shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
          <div className="p-2">
            <div className="text-5xl font-black text-emerald-800 font-['Space_Grotesk'] tracking-tight">
              88.29%
            </div>
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mt-1.5 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Meta-Fusion Accuracy</span>
            </div>
          </div>

          <div className="p-2">
            <div className="text-3xl font-bold text-slate-900 font-['Space_Grotesk']">
              +5.7%
            </div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
              Gain Over Single-Modal
            </div>
          </div>

          <div className="p-2">
            <div className="text-3xl font-bold text-slate-900 font-['Space_Grotesk']">
              0.881
            </div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
              Weighted F1-Score
            </div>
          </div>

          <div>
            <button
              onClick={onOpenMetricsModal}
              className="btn-emerald-primary text-xs font-bold w-full py-3.5 cursor-pointer shadow-md shadow-emerald-600/20"
            >
              <span>EXPLORE TRAINING HUB</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Dual Stream Architecture Diagram */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Stream 1: Numerical */}
        <div className="rounded-2xl bg-white border border-slate-200 p-7 flex flex-col justify-between shadow-sm hover:border-emerald-300 transition-all">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono text-slate-500 uppercase font-bold">STREAM A</span>
              <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                TABULAR
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-['Space_Grotesk'] mb-2">
              Atmospheric & Edaphic Pipeline
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Ingests 11 continuous features including precipitation curves, min/max temperatures, relative humidity, soil pH, and N-P-K nutrient profiles across Dakshina Kannada.
            </p>
          </div>

          <div className="space-y-2.5 border-t border-slate-100 pt-4 text-xs font-mono text-slate-600">
            <div className="flex justify-between">
              <span>Primary Classifier:</span>
              <span className="text-slate-900 font-bold">CatBoost + XGBoost</span>
            </div>
            <div className="flex justify-between">
              <span>Single Stream Acc:</span>
              <span className="text-blue-600 font-bold">82.6%</span>
            </div>
          </div>
        </div>

        {/* Stream 2: Satellite */}
        <div className="rounded-2xl bg-white border border-slate-200 p-7 flex flex-col justify-between shadow-sm hover:border-emerald-300 transition-all">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono text-slate-500 uppercase font-bold">STREAM B</span>
              <span className="text-[10px] font-mono font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                SPECTRAL
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-['Space_Grotesk'] mb-2">
              Sentinel-2 Multi-Spectral
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Extracts 10-meter Level-2A surface reflectances in Blue, Green, Red, and NIR bands to calculate normalized vegetative indices (NDVI, NDRE, EVI).
            </p>
          </div>

          <div className="space-y-2.5 border-t border-slate-100 pt-4 text-xs font-mono text-slate-600">
            <div className="flex justify-between">
              <span>Spectral Backing:</span>
              <span className="text-slate-900 font-bold">Sentinel-2B BOA</span>
            </div>
            <div className="flex justify-between">
              <span>Single Stream Acc:</span>
              <span className="text-purple-600 font-bold">79.8%</span>
            </div>
          </div>
        </div>

        {/* Fusion Layer */}
        <div className="rounded-2xl bg-white border-2 border-emerald-500 p-7 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono text-emerald-800 uppercase font-bold">SYNTHESIS</span>
              <span className="text-[10px] font-mono text-white bg-emerald-600 px-2.5 py-0.5 rounded-full font-bold">
                META-LEARNER
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-['Space_Grotesk'] mb-2">
              ExtraTrees Fusion v2.0
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Stochastic decision forest concatenates probability distributions from Stream A and Stream B, weighting cross-modal interactions to resolve edge cases.
            </p>
          </div>

          <div className="space-y-2.5 border-t border-slate-100 pt-4 text-xs font-mono text-slate-600">
            <div className="flex justify-between">
              <span>Final Accuracy:</span>
              <span className="text-emerald-700 font-bold text-sm">88.29%</span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>SERVING LIVE</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
