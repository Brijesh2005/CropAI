import React from 'react';
import { Navigation, Square, Trash2, Layers } from 'lucide-react';

export default function MapToolbar({
  activeLayerKey,
  onLayerChange,
  onUseLiveLocation,
  isLiveLocationActive,
  onStartDraw,
  drawMode,
  onClearBoundary,
  hasPolygon
}) {
  const layerOptions = [
    { id: 'hybrid', label: 'Satellite' },
    { id: 'street', label: 'Street' },
    { id: 'terrain', label: 'Terrain' }
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* 1. Large 44px+ Map Action Buttons (with icons + clear text labels) */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-white/95 border border-slate-300 shadow-md backdrop-blur-md">
        {/* My Location */}
        <button
          onClick={onUseLiveLocation}
          className={`min-h-[44px] px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            isLiveLocationActive
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
          title="Locate my farm using GPS"
        >
          <Navigation className={`w-4 h-4 ${isLiveLocationActive ? 'text-white' : 'text-emerald-700'}`} />
          <span>My location</span>
        </button>

        {/* Draw Field */}
        <button
          onClick={onStartDraw}
          className={`min-h-[44px] px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            drawMode === 'drawing'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
          title="Draw your farm boundary"
        >
          <Square className={`w-4 h-4 ${drawMode === 'drawing' ? 'text-white' : 'text-emerald-700'}`} />
          <span>Draw field</span>
        </button>

        {/* Clear Boundary */}
        {hasPolygon && (
          <button
            onClick={onClearBoundary}
            className="min-h-[44px] px-3 py-2 rounded-lg text-xs font-bold text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Clear farm boundary"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* 2. Layer Switcher (Satellite, Street, Terrain) */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-white/95 border border-slate-300 shadow-md backdrop-blur-md">
        <span className="hidden sm:flex items-center gap-1 px-2 text-xs font-bold text-slate-500">
          <Layers className="w-3.5 h-3.5 text-emerald-700" />
          <span>Layer:</span>
        </span>
        {layerOptions.map((opt) => {
          const isSelected = activeLayerKey === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => onLayerChange(opt.id)}
              className={`min-h-[44px] px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
