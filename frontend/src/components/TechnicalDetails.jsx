import React from 'react';
import { ChevronDown, Satellite } from 'lucide-react';

export default function TechnicalDetails({ environmental = {}, satellite = {}, t }) {
  const ndvi = Number(satellite.ndvi || satellite.ndvi_vegetation_index || 0.72);
  const ndwi = Number(satellite.ndwi || satellite.water_index_ndwi || 0.58);
  const soilMoisture = Number(satellite.soil_moisture_index || 42);

  const getHealthRating = (val) => {
    if (val >= 0.6) return { text: t('res.good', 'Good'), color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (val >= 0.4) return { text: t('res.medium', 'Medium'), color: 'text-amber-700 bg-amber-50 border-amber-200' };
    return { text: t('res.low', 'Low'), color: 'text-red-700 bg-red-50 border-red-200' };
  };

  const getWaterRating = (val) => {
    if (val >= 0.4) return { text: t('res.good', 'Good'), color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (val >= 0.2) return { text: t('res.medium', 'Medium'), color: 'text-amber-700 bg-amber-50 border-amber-200' };
    return { text: t('res.low', 'Low'), color: 'text-red-700 bg-red-50 border-red-200' };
  };

  const getMoistureRating = (val) => {
    if (val >= 40) return { text: t('res.good', 'Good'), color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (val >= 25) return { text: t('res.medium', 'Medium'), color: 'text-amber-700 bg-amber-50 border-amber-200' };
    return { text: t('res.low', 'Low'), color: 'text-red-700 bg-red-50 border-red-200' };
  };

  const ndviRating = getHealthRating(ndvi);
  const ndwiRating = getWaterRating(ndwi);
  const soilRating = getMoistureRating(soilMoisture);

  return (
    <details className="group rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden text-left">
      <summary className="p-4 sm:p-5 flex items-center justify-between cursor-pointer select-none font-bold text-slate-800 hover:bg-slate-50 transition-colors">
        <div className="flex items-center gap-2">
          <Satellite className="w-4 h-4 text-emerald-700" />
          <span className="text-sm font-['Space_Grotesk']">
            {t('res.technical_title', 'Technical details (Satellite indices & climate telemetry)')}
          </span>
        </div>
        <ChevronDown className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform duration-200" />
      </summary>

      <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50/50 flex flex-col gap-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* NDVI */}
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-slate-600">
                {t('res.crop_health', 'Crop health (from satellite)')}
              </span>
              <span className={`px-2 py-0.5 rounded-full border text-xs font-bold ${ndviRating.color}`}>
                {ndviRating.text}
              </span>
            </div>
            <div className="text-lg font-bold text-slate-900 font-mono">
              {ndvi.toFixed(2)}
            </div>
            <p className="text-slate-400 text-xs mt-0.5">Vegetation index (NDVI)</p>
          </div>

          {/* NDWI */}
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-slate-600">
                {t('res.water_index', 'Water in the land / crops')}
              </span>
              <span className={`px-2 py-0.5 rounded-full border text-xs font-bold ${ndwiRating.color}`}>
                {ndwiRating.text}
              </span>
            </div>
            <div className="text-lg font-bold text-slate-900 font-mono">
              {ndwi.toFixed(2)}
            </div>
            <p className="text-slate-400 text-xs mt-0.5">Water index (NDWI)</p>
          </div>

          {/* Soil Wetness */}
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-slate-600">
                {t('res.soil_wetness', 'Soil wetness')}
              </span>
              <span className={`px-2 py-0.5 rounded-full border text-xs font-bold ${soilRating.color}`}>
                {soilRating.text}
              </span>
            </div>
            <div className="text-lg font-bold text-slate-900 font-mono">
              {soilMoisture}%
            </div>
            <p className="text-slate-400 text-xs mt-0.5">Volumetric moisture proxy</p>
          </div>
        </div>

        {/* Climate readings */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-white border border-slate-200">
            <span className="text-slate-500 font-medium block">Rainfall</span>
            <span className="text-sm font-bold text-slate-800">
              {Math.round(environmental.rainfall_mm || 3900)} mm/year
            </span>
          </div>
          <div className="p-3 rounded-xl bg-white border border-slate-200">
            <span className="text-slate-500 font-medium block">Temperature</span>
            <span className="text-sm font-bold text-slate-800">
              {Number(environmental.temperature_c || 28.5).toFixed(1)}°C
            </span>
          </div>
          <div className="p-3 rounded-xl bg-white border border-slate-200">
            <span className="text-slate-500 font-medium block">Soil pH</span>
            <span className="text-sm font-bold text-slate-800">
              {Number(environmental.soil_ph || 5.8).toFixed(1)}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-white border border-slate-200">
            <span className="text-slate-500 font-medium block">Soil Texture</span>
            <span className="text-sm font-bold text-slate-800 truncate">
              {environmental.soil_type || 'Laterite'}
            </span>
          </div>
        </div>
      </div>
    </details>
  );
}
