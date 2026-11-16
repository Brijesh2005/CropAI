import React, { useState, useEffect } from 'react';
import { X, BarChart3, CheckCircle2, Image, Layers, Loader2 } from 'lucide-react';

export default function MetricsModal({ isOpen, onClose }) {
  const [metrics, setMetrics] = useState(null);
  const [selectedPlot, setSelectedPlot] = useState('confusion_matrix.png');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    queueMicrotask(() => {
      if (isMounted) setIsLoading(true);
    });

    fetch('/api/metrics')
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        setMetrics(data);
        if (data.available_plots && data.available_plots.length > 0) {
          setSelectedPlot(data.available_plots[0]);
        }
      })
      .catch((err) => console.error("Metrics load failed:", err))
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 lg:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto text-left">
      <div className="relative w-full max-w-5xl rounded-2xl bg-white border border-emerald-200 p-6 sm:p-8 shadow-2xl flex flex-col gap-6 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-11 h-11 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 shadow-xs">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-['Space_Grotesk']">
              Model Performance &amp; Evaluation Hub
            </h2>
            <p className="text-xs text-slate-500">
              Dakshina Kannada Hybrid Architecture Verification &amp; Training Analytics
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="py-16 text-center text-emerald-700 text-sm flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
            <span>Loading validation analytics...</span>
          </div>
        ) : metrics ? (
          <>
            {/* Top Key Metrics Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-xs font-medium">Model Architecture</span>
                <span className="text-sm font-bold text-slate-800">{metrics.best_model_name}</span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300">
                <span className="text-emerald-800 block text-xs font-semibold">Test Accuracy</span>
                <span className="text-lg font-black text-emerald-800">{(metrics.test_accuracy * 100).toFixed(2)}%</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-xs font-medium">Weighted F1</span>
                <span className="text-base font-bold text-emerald-700">{(metrics.f1_weighted * 100).toFixed(2)}%</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-xs font-medium">Precision</span>
                <span className="text-base font-bold text-slate-800">{(metrics.precision * 100).toFixed(2)}%</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-xs font-medium">Recall</span>
                <span className="text-base font-bold text-slate-800">{(metrics.recall * 100).toFixed(2)}%</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-xs font-medium">Supported Crops</span>
                <span className="text-base font-bold text-amber-700">{metrics.supported_crops.length} Varieties</span>
              </div>
            </div>

            {/* Three-Phase Comparison Table */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>Multi-Modal Progression</span>
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="pb-2 font-semibold">Modality / Phase</th>
                      <th className="pb-2 font-semibold">Test Accuracy</th>
                      <th className="pb-2 font-semibold">Input Features</th>
                      <th className="pb-2 font-semibold">Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr>
                      <td className="py-2.5 font-bold text-slate-900">Phase 1: Tabular (XGBoost)</td>
                      <td className="py-2.5 text-emerald-700 font-bold">89.08%</td>
                      <td className="py-2.5 text-slate-500">13 Climate &amp; Soil Features</td>
                      <td className="py-2.5">Macro-environmental envelope</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-bold text-slate-900">Phase 2: Satellite (RandomForest)</td>
                      <td className="py-2.5 text-slate-600 font-bold">45.89%</td>
                      <td className="py-2.5 text-slate-500">7 Spectral Indices (NDVI, EVI, etc.)</td>
                      <td className="py-2.5">Micro-spatial surface signature</td>
                    </tr>
                    <tr className="bg-emerald-50/70 font-semibold">
                      <td className="py-2.5 text-emerald-900 font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Phase 3: Meta-Fusion (ExtraTrees)</span>
                      </td>
                      <td className="py-2.5 text-emerald-800 font-black text-sm">88.29%</td>
                      <td className="py-2.5 text-emerald-900">29 Fused Multimodal Features</td>
                      <td className="py-2.5 text-emerald-900">Optimal balanced generalization</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Authentic Evaluation Plots Gallery */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Image className="w-4 h-4 text-emerald-600" />
                <span>Training Plots &amp; Visualizations</span>
              </h4>

              {/* Plot Select Tabs */}
              <div className="flex flex-wrap gap-2 mb-4 text-xs">
                {metrics.available_plots.map((plot) => {
                  const label = plot.replace('.png', '').replace(/_/g, ' ');
                  const isSelected = selectedPlot === plot;
                  return (
                    <button
                      key={plot}
                      onClick={() => setSelectedPlot(plot)}
                      className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer font-medium capitalize ${
                        isSelected
                          ? 'bg-emerald-600 text-white font-bold border-emerald-600 shadow-2xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              {/* Display Image */}
              {selectedPlot && (
                <div className="w-full flex items-center justify-center p-3 rounded-xl bg-slate-50 border border-slate-200 overflow-hidden">
                  <img
                    src={`/api/plots/${selectedPlot}`}
                    alt={selectedPlot}
                    className="max-h-[420px] w-auto object-contain rounded-lg shadow-xs"
                  />
                </div>
              )}
            </div>

            {/* Supported Crops Tags */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <span className="text-slate-600 font-bold block mb-2">
                13 Trained Agricultural Varieties:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {metrics.supported_crops.map((crop) => (
                  <span
                    key={crop}
                    className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium"
                  >
                    {crop}
                  </span>
                ))}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
