import React from 'react';
import { Calendar, Info } from 'lucide-react';

const activityLabels = {
  plant: { en: 'Planting', kn: 'ನಾಟಿ', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  fertilize: { en: 'Fertilizer', kn: 'ಗೊಬ್ಬರ', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  irrigate: { en: 'Irrigation', kn: 'ನೀರಾವರಿ', color: 'bg-cyan-100 text-cyan-800 border-cyan-300' },
  harvest: { en: 'Harvest', kn: 'ಕಟಾವು', color: 'bg-amber-100 text-amber-800 border-amber-300' },
  bordeaux: { en: 'Bordeaux Spray', kn: 'ಬೋರ್ಡೋ ಸಿಂಪಡಣೆ', color: 'bg-purple-100 text-purple-800 border-purple-300' },
  drainage: { en: 'Drainage', kn: 'ಚರಂಡಿ', color: 'bg-teal-100 text-teal-800 border-teal-300' },
  pest_control: { en: 'Pest Control', kn: 'ಕೀಟ ನಿಯಂತ್ರಣ', color: 'bg-red-100 text-red-800 border-red-300' },
  tapping: { en: 'Tapping', kn: 'ಹಾಲು ಕೀಳುವುದು', color: 'bg-slate-200 text-slate-800 border-slate-300' },
  pruning: { en: 'Pruning', kn: 'ಕತ್ತರಿಸುವುದು', color: 'bg-orange-100 text-orange-800 border-orange-300' },
  propping: { en: 'Propping', kn: 'ಆಸರೆ', color: 'bg-lime-100 text-lime-800 border-lime-300' },
  bagging: { en: 'Bagging', kn: 'ಚೀಲ ತೊಡಿಸುವುದು', color: 'bg-pink-100 text-pink-800 border-pink-300' },
  nursery: { en: 'Nursery', kn: 'ಮಡಿ ತಯಾರಿಕೆ', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  plowing: { en: 'Plowing', kn: 'ಉಳುಮೆ', color: 'bg-amber-100 text-amber-800 border-amber-300' },
  weeding: { en: 'Weeding', kn: 'ಕಳೆ ಕೀಳುವುದು', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
  flowering: { en: 'Flowering', kn: 'ಹೂವು ಬಿಡುವುದು', color: 'bg-violet-100 text-violet-800 border-violet-300' },
  fruit_set: { en: 'Fruit Set', kn: 'ಕಾಯಿ ಕಟ್ಟುವುದು', color: 'bg-rose-100 text-rose-800 border-rose-300' },
  rain_guarding: { en: 'Rain Guard', kn: 'ಮಳೆ ರಕ್ಷಣೆ', color: 'bg-indigo-100 text-indigo-800 border-indigo-300' }
};

export default function SeasonCalendar({ calendar = null, isKn = true }) {
  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-white border border-emerald-500/20 shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-emerald-600" />
          <h4 className="text-base sm:text-lg font-bold text-slate-900 font-['Space_Grotesk']">
            {isKn ? '🗓️ ೧೨ ತಿಂಗಳ ಕೃಷಿ ಕ್ಯಾಲೆಂಡರ್' : '🗓️ 12-Month Farming Season Calendar'}
          </h4>
        </div>
        <span className="text-xs text-slate-500">
          {isKn ? 'ನಾಟಿ • ಗೊಬ್ಬರ • ನೀರಾವರಿ • ಕಟಾವು' : 'Plant • Fertilize • Irrigate • Harvest'}
        </span>
      </div>

      {calendar ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2.5">
          {calendar.map((m, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center text-center gap-1.5 min-h-[90px]"
            >
              <span className="text-xs font-bold text-slate-700 border-b border-slate-200 pb-1 w-full">
                {isKn ? m.kannada_month : m.month}
              </span>

              <div className="flex flex-col gap-1 w-full mt-auto">
                {m.activities && m.activities.length > 0 ? (
                  m.activities.map((act, aIdx) => {
                    const meta = activityLabels[act] || { en: act, kn: act, color: 'bg-slate-200 text-slate-800' };
                    return (
                      <span
                        key={aIdx}
                        className={`text-[11px] font-bold px-1.5 py-0.5 rounded border leading-tight ${meta.color}`}
                      >
                        {isKn ? meta.kn : meta.en}
                      </span>
                    );
                  })
                ) : (
                  <span className="text-[11px] text-slate-400 italic">
                    {isKn ? 'ವಿರಾಮ' : 'Rest'}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-600 flex items-center gap-2">
          <Info className="w-4 h-4 text-slate-500" />
          <span>
            {isKn
              ? 'ಈ ಬೆಳೆಗೆ ಅಧಿಕೃತ ೧೨ ತಿಂಗಳ ಕ್ಯಾಲೆಂಡರ್ ಇನ್ನೂ ಲಭ್ಯವಿಲ್ಲ. ದಯವಿಟ್ಟು ಸ್ಥಳೀಯ ರೈತ ಸಂಪರ್ಕ ಕೇಂದ್ರವನ್ನು ಸಂಪರ್ಕಿಸಿ.'
              : '12-month season calendar is not available yet for this crop. Contact your local Raitha Samparka Kendra.'}
          </span>
        </div>
      )}
    </div>
  );
}
