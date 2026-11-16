import React from 'react';
import { getCropProfile } from '../data/agriculturalData';

export default function AlternativeCrops({ recommendations = [], lang = 'kn', t }) {
  if (!recommendations || recommendations.length <= 1) return null;

  // Take the next 3 or 4 alternatives (excluding index 0 if it's already in the main AnswerCard)
  const alternatives = recommendations.slice(1, 5);

  const getSuitability = (score) => {
    if (score >= 0.75) {
      return {
        label: t('res.suitability_high', 'Very suitable 🟢'),
        badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        barClass: 'bg-emerald-600'
      };
    }
    if (score >= 0.45) {
      return {
        label: t('res.suitability_med', 'Suitable 🟡'),
        badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
        barClass: 'bg-amber-500'
      };
    }
    return {
      label: t('res.suitability_low', 'Not recommended 🔴'),
      badgeClass: 'bg-red-50 text-red-800 border-red-200',
      barClass: 'bg-red-400'
    };
  };

  return (
    <div className="card p-6 bg-white border border-slate-200 shadow-sm flex flex-col gap-4 text-left">
      <h3 className="text-base sm:text-lg font-bold text-slate-900 font-['Space_Grotesk']">
        {t('res.alt_crops_title', 'Other Suitable Crops for this Land')}
      </h3>

      <div className="space-y-3">
        {alternatives.map((item, idx) => {
          const profile = getCropProfile(item.crop);
          const score = item.confidence_score || item.confidence || 0.5;
          const pct = Math.round(score * 100);
          const suitability = getSuitability(score);
          const cropTitle = lang === 'kn' ? (profile?.kannada_name || item.crop) : (profile?.name || item.crop);

          return (
            <div
              key={item.crop || idx}
              className="p-3.5 rounded-xl border border-slate-200 hover:border-emerald-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-200 shrink-0 bg-slate-50">
                  <img
                    src={profile?.primary_image || '/images/crops/coconut_primary.jpg'}
                    alt={item.crop}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.src = '/images/crops/coconut_primary.jpg'; }}
                  />
                </div>

                <div>
                  <div className="text-sm font-bold text-slate-900">
                    {cropTitle}
                  </div>
                  <div className="text-xs text-slate-500">
                    {profile?.variety || 'Local Dakshina Kannada Variety'}
                  </div>
                </div>
              </div>

              {/* Progress Bar & Suitability Label */}
              <div className="flex items-center gap-3 sm:w-64">
                <div className="flex-1">
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${suitability.barClass}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                <span className={`px-2.5 py-0.5 rounded-full border text-xs font-bold whitespace-nowrap ${suitability.badgeClass}`}>
                  {suitability.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
