import React from 'react';
import { REGIONAL_DATA } from '../data/agriculturalData';
import { MapPin, CloudRain, Mountain, Compass, Waves, CheckCircle2 } from 'lucide-react';

export default function RegionalLandscapeCard({ talukName = 'Puttur', language = 'kn' }) {
  // Normalize taluk name
  let matchedKey = 'Puttur';
  const cleanTaluk = (talukName || '').toLowerCase();
  for (const k of Object.keys(REGIONAL_DATA)) {
    if (cleanTaluk.includes(k.toLowerCase()) || k.toLowerCase().includes(cleanTaluk)) {
      matchedKey = k;
      break;
    }
  }

  const region = REGIONAL_DATA[matchedKey] || REGIONAL_DATA['Puttur'];

  return (
    <div className="w-full rounded-2xl bg-white border border-emerald-500/20 overflow-hidden shadow-sm text-left">
      {/* Real-Life Landscape Photo Banner */}
      <div className="relative h-64 sm:h-72 w-full overflow-hidden">
        <img
          src={region.landscape_image}
          alt={`${region.name} Landscape`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-6 text-white">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-600/90 text-white uppercase tracking-wider">
              {language === 'kn' ? 'ನೈಜ ಸ್ಥಳೀಯ ಭೂಪ್ರದೇಶ' : 'Real-Life Region Landscape'}
            </span>
            <span className="text-slate-300 text-xs">• Dakshina Kannada</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-['Space_Grotesk'] text-white">
            {language === 'kn' ? `${region.kannada_name} ಕೃಷಿ ವಲಯ` : region.title}
          </h3>

          <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-2xl leading-relaxed">
            {language === 'kn' ? region.kannada_desc : region.description}
          </p>
        </div>
      </div>

      {/* Regional Agronomic Matrix */}
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-50/60 border-t border-slate-100">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <Compass className="w-4 h-4 text-emerald-600" />
            <span>{language === 'kn' ? 'ಕೃಷಿ ಹವಾಮಾನ ವಲಯ' : 'Agro-Climatic Zone'}</span>
          </div>
          <p className="text-sm font-bold text-slate-900">
            {language === 'kn' ? region.kannada_zone : region.zone}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <Mountain className="w-4 h-4 text-amber-600" />
            <span>{language === 'kn' ? 'ಮಣ್ಣಿನ ವಿಧ & ಆಮ್ಲೀಯತೆ' : 'Soil Profile & pH'}</span>
          </div>
          <p className="text-sm font-bold text-slate-900">
            {language === 'kn' ? region.kannada_soil : region.soil}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <CloudRain className="w-4 h-4 text-blue-600" />
            <span>{language === 'kn' ? 'ವಾರ್ಷಿಕ ಮಳೆ ಪ್ರಮಾಣ' : 'Annual Rainfall'}</span>
          </div>
          <p className="text-sm font-bold text-slate-900">
            {region.rainfall}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <Waves className="w-4 h-4 text-cyan-600" />
            <span>{language === 'kn' ? 'ನೀರಿನ ಮೂಲಗಳು' : 'Water Sources'}</span>
          </div>
          <p className="text-sm font-bold text-slate-900">
            {region.water_source}
          </p>
        </div>
      </div>

      {/* Prominent Crops in this region */}
      <div className="px-6 py-4 bg-emerald-50/60 border-t border-emerald-100 flex flex-wrap items-center justify-between gap-3 text-xs">
        <span className="font-bold text-emerald-900">
          {language === 'kn' ? '🌾 ಈ ಪ್ರದೇಶದ ಪ್ರಮುಖ ಯಶಸ್ವಿ ಬೆಳೆಗಳು:' : '🌾 Proven Crops for this Taluk:'}
        </span>
        <div className="flex flex-wrap gap-1.5">
          {region.key_crops.map((cr, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 rounded-lg bg-white border border-emerald-300 font-semibold text-emerald-800 shadow-2xs"
            >
              {cr}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

