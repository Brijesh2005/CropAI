import React, { useState, useEffect } from 'react';
import { CROP_PROFILES, getCropProfile } from '../data/agriculturalData';
import { 
  BookOpen, 
  Coins, 
  AlertTriangle, 
  Sparkles, 
  Info, 
  PhoneCall, 
  ShieldCheck 
} from 'lucide-react';
import { useLang } from '../i18n/LanguageContext';
import StepTimeline from './guide/StepTimeline';
import SeasonCalendar from './guide/SeasonCalendar';

export default function CultivationGuide({ initialCrop = 'Arecanut' }) {
  const { lang } = useLang();
  const isKn = lang === 'kn';

  // Normalize initial crop to match profile key
  const resolvedInitial = getCropProfile(initialCrop)?.name?.split('/')[0]?.trim() || 'Arecanut';
  const matchedKey = Object.keys(CROP_PROFILES).find(
    (k) => k.toLowerCase() === resolvedInitial.toLowerCase() || k.toLowerCase() === (initialCrop || '').toLowerCase()
  ) || 'Arecanut';

  const [selectedCropKey, setSelectedCropKey] = useState(matchedKey);

  useEffect(() => {
    if (initialCrop) {
      const found = getCropProfile(initialCrop)?.name?.split('/')[0]?.trim() || initialCrop;
      const key = Object.keys(CROP_PROFILES).find(
        (k) => k.toLowerCase() === found.toLowerCase() || k.toLowerCase() === initialCrop.toLowerCase()
      );
      if (key && key !== 'Rice') {
        queueMicrotask(() => {
          setSelectedCropKey(key);
        });
      }
    }
  }, [initialCrop]);

  const crop = CROP_PROFILES[selectedCropKey] || CROP_PROFILES['Arecanut'];
  // Remove duplicate "Rice" entry (aliased to Paddy)
  const cropKeys = Object.keys(CROP_PROFILES).filter((k) => k !== 'Rice');

  const isInitialRecommended = (key) => {
    const normKey = key.toLowerCase();
    const normInit = (initialCrop || '').toLowerCase();
    return normKey === normInit || normKey === matchedKey.toLowerCase();
  };

  const isShortGuide = (crop.cultivation_steps || []).length < 4;

  return (
    <div className="w-full flex flex-col gap-8 text-left">
      {/* 1. Header Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-emerald-500/20 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-emerald-800 mb-1">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>{isKn ? 'ಸಂಪೂರ್ಣ ಕೃಷಿ ಕೈಪಿಡಿ' : 'Complete Crop Cultivation Guide'}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-['Space_Grotesk']">
            {isKn ? `${crop.kannada_name} ಬೆಳೆಯುವ ವಿಧಾನ` : `How to Cultivate ${crop.name}`}
          </h3>
          <p className="text-sm text-slate-600 mt-1">
            {isKn 
              ? 'ದಕ್ಷಿಣ ಕನ್ನಡದ ಹವಾಮಾನಕ್ಕೆ ಸೂಕ್ತವಾದ ಹಂತ-ಹಂತದ ವೈಜ್ಞಾನಿಕ ಮಾರ್ಗದರ್ಶಿ' 
              : 'Step-by-step agronomic guide tailored to Dakshina Kannada soil & monsoon'}
          </p>
        </div>

        {/* Quick RSK Helpline Badge */}
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-sm flex items-center gap-3">
          <PhoneCall className="w-5 h-5 text-emerald-700 shrink-0" />
          <div>
            <span className="text-xs text-slate-600 block">
              {isKn ? 'ರೈತ ಸಂಪರ್ಕ ಕೇಂದ್ರ ಸಹಾಯವಾಣಿ:' : 'RSK Farmer Helpline:'}
            </span>
            <a href="tel:18001801551" className="font-extrabold text-emerald-800 hover:underline">
              1800-180-1551 (Toll-Free)
            </a>
          </div>
        </div>
      </div>

      {/* 2. Crop Selector Chips (with Recommended for You badge) */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-thin">
        {cropKeys.map((key) => {
          const c = CROP_PROFILES[key];
          const isSelected = selectedCropKey === key;
          const isRec = isInitialRecommended(key);

          return (
            <button
              key={key}
              type="button"
              onClick={() => setSelectedCropKey(key)}
              className={`min-h-[44px] px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                isSelected
                  ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-600/30'
                  : 'bg-white text-slate-700 hover:bg-emerald-50 border border-slate-200'
              }`}
            >
              <span>{isKn ? c.kannada_name : c.name}</span>
              {isRec && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-extrabold flex items-center gap-1 ${
                  isSelected ? 'bg-amber-300 text-amber-950' : 'bg-amber-100 text-amber-900 border border-amber-300'
                }`}>
                  <Sparkles className="w-3 h-3" />
                  <span>{isKn ? 'ನಿಮಗಾಗಿ ಶಿಫಾರಸು' : 'Recommended'}</span>
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 3. Main Photographic Agronomy Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Crop Identity Photo & Key Metrics */}
        <div className="lg:col-span-5 rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between">
          <div className="relative h-60 sm:h-68 overflow-hidden group">
            <img
              src={crop.primary_image}
              alt={`${crop.name} plantation`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => { e.currentTarget.src = '/images/crops/arecanut_primary.jpg'; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-5 text-white">
              <span className="text-xs font-semibold text-emerald-300">
                {crop.scientific_name}
              </span>
              <h4 className="text-xl sm:text-2xl font-bold mt-0.5">
                {isKn ? crop.kannada_name : crop.name}
              </h4>
            </div>
          </div>

          <div className="p-5 flex flex-col gap-3.5 text-sm">
            <div className="flex items-start justify-between pb-2.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">
                {isKn ? 'ಶಿಫಾರಸು ಮಾಡಿದ ತಳಿಗಳು:' : 'Recommended Varieties:'}
              </span>
              <span className="font-bold text-slate-800 text-right max-w-[60%]">
                {isKn ? crop.kannada_variety : crop.variety}
              </span>
            </div>

            <div className="flex items-start justify-between pb-2.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">
                {isKn ? 'ಬೆಳೆ ಅವಧಿ / ಜೀವಿತಾವಧಿ:' : 'Maturity / Economic Life:'}
              </span>
              <span className="font-bold text-emerald-700 text-right">
                {crop.maturity_days}
              </span>
            </div>

            <div className="flex items-start justify-between pb-2.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">
                {isKn ? 'ನಿರೀಕ್ಷಿತ ಇಳುವರಿ (ಎಕರೆಗೆ):' : 'Expected Yield (per acre):'}
              </span>
              <span className="font-bold text-slate-900 text-right">
                {isKn ? crop.kannada_yield : crop.yield_benchmark}
              </span>
            </div>

            {/* Price Line with priceAsOf & priceSource */}
            {crop.priceAsOf && crop.priceSource ? (
              <div className="p-3.5 rounded-xl bg-amber-50/90 border border-amber-200/80 text-amber-950 flex flex-col gap-1">
                <div className="font-bold text-sm">
                  {isKn ? '💰 ಮಾರುಕಟ್ಟೆ ಆದಾಯ ಮೌಲ್ಯ: ' : '💰 Market Realization: '}
                  <span className="font-normal">{crop.economic_value}</span>
                </div>
                <div className="text-xs text-amber-800">
                  {isKn
                    ? `ದರಗಳು ${crop.priceAsOf} ದಂತೆ (ಆಧಾರ: ${crop.priceSource})`
                    : `Prices as of ${crop.priceAsOf}, source: ${crop.priceSource}`}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Right Column: Mini Photo Gallery with Crop-Specific Captions */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm flex flex-col">
            <div className="h-36 sm:h-44 overflow-hidden">
              <img
                src={crop.farm_image}
                alt={`${crop.name} Field in Dakshina Kannada`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                onError={(e) => { e.currentTarget.src = crop.primary_image || '/images/crops/arecanut_primary.jpg'; }}
              />
            </div>
            <div className="p-3.5 text-center">
              <p className="text-sm font-bold text-slate-800">
                {isKn ? `${crop.kannada_name} ತೋಟ` : `${crop.name} Field`}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                {isKn ? 'ದಕ್ಷಿಣ ಕನ್ನಡದ ಫಲವತ್ತಾದ ಕಣಿವೆ' : 'Dakshina Kannada Valley'}
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm flex flex-col">
            <div className="h-36 sm:h-44 overflow-hidden">
              <img
                src={crop.nursery_image}
                alt={`${crop.name} Nursery Saplings`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                onError={(e) => { e.currentTarget.src = crop.primary_image || '/images/crops/arecanut_primary.jpg'; }}
              />
            </div>
            <div className="p-3.5 text-center">
              <p className="text-sm font-bold text-slate-800">
                {isKn ? `${crop.kannada_name} ಸಸಿಗಳು` : `${crop.name} Saplings`}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                {isKn ? 'ಪ್ರಮಾಣೀಕೃತ ಕೃಷಿ ಸಸಿಗಳು' : 'Certified Rootstock'}
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm flex flex-col">
            <div className="h-36 sm:h-44 overflow-hidden">
              <img
                src={crop.harvest_image}
                alt={`${crop.name} Harvest and Market`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                onError={(e) => { e.currentTarget.src = crop.primary_image || '/images/crops/arecanut_primary.jpg'; }}
              />
            </div>
            <div className="p-3.5 text-center">
              <p className="text-sm font-bold text-slate-800">
                {isKn ? `${crop.kannada_name} ಕಟಾವು` : `${crop.name} Harvest`}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                {isKn ? 'ಉತ್ತಮ ಗುಣಮಟ್ಟದ ಚಾಲಿ/ಬೆಳೆ' : 'APMC Grade-1 Produce'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. 12-Month Season Calendar Strip */}
      <SeasonCalendar calendar={crop.calendar} isKn={isKn} />

      {/* 5. Cost & Inputs Summary (Show only when present) */}
      {crop.inputs && (
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-emerald-500/20 shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Coins className="w-5 h-5 text-amber-600" />
            <h4 className="text-base sm:text-lg font-bold text-slate-900 font-['Space_Grotesk']">
              {isKn ? '💵 ಖರ್ಚು ಮತ್ತು ಪರಿಕರಗಳ ಅಂದಾಜು (ಎಕರೆಗೆ)' : '💵 Cost & Inputs Summary (per acre)'}
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200">
              <span className="text-xs font-semibold text-emerald-800 block mb-1">
                {isKn ? 'ಅಂದಾಜು ವಾರ್ಷಿಕ ವೆಚ್ಚ' : 'Estimated Annual Cost'}
              </span>
              <span className="text-base font-extrabold text-emerald-950">
                {isKn ? crop.inputs.kannada_cost : crop.inputs.estimated_cost_per_acre}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-semibold text-slate-600 block mb-1">
                {isKn ? 'ಸಸಿಗಳು / ಬೀಜದ ಪ್ರಮಾಣ' : 'Saplings / Seed Requirement'}
              </span>
              <span className="text-sm font-bold text-slate-900">
                {isKn ? crop.inputs.kannada_saplings : crop.inputs.saplings_seeds}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-semibold text-slate-600 block mb-1">
                {isKn ? 'ಗೊಬ್ಬರದ ಪ್ರಮಾಣ' : 'Fertilizer Dose'}
              </span>
              <span className="text-sm font-bold text-slate-900">
                {isKn ? crop.inputs.kannada_fertilizer : crop.inputs.fertilizer_dose}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-semibold text-slate-600 block mb-1">
                {isKn ? 'ನೀರಾವರಿ ವೇಳಾಪಟ್ಟಿ' : 'Irrigation Scheduling'}
              </span>
              <span className="text-sm font-bold text-slate-900">
                {isKn ? crop.inputs.kannada_irrigation : crop.inputs.irrigation}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 6. Common Problems & Fixes (Show only when present) */}
      {crop.problems && crop.problems.length > 0 && (
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-emerald-500/20 shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h4 className="text-base sm:text-lg font-bold text-slate-900 font-['Space_Grotesk']">
              {isKn ? '🛡️ ಸಾಮಾನ್ಯ ರೋಗಗಳು ಮತ್ತು ಪರಿಹಾರಗಳು' : '🛡️ Common Problems & Fixes'}
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {crop.problems.map((prob, pIdx) => (
              <div
                key={pIdx}
                className="p-4 sm:p-5 rounded-2xl bg-red-50/40 border border-red-200/80 flex flex-col gap-2"
              >
                <div className="flex items-start gap-2 text-red-900 font-bold text-sm">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{isKn ? prob.kannada_problem : prob.problem}</span>
                </div>
                <div className="mt-1 pt-2 border-t border-red-100 text-sm text-slate-700 leading-relaxed">
                  <span className="font-bold text-emerald-800">
                    {isKn ? 'ಪರಿಹಾರ: ' : 'Fix: '}
                  </span>
                  <span>{isKn ? prob.kannada_solution : prob.solution}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. Notice for crops with fewer than 4 steps */}
      {isShortGuide && (
        <div className="p-5 rounded-2xl bg-amber-50/90 border border-amber-300 flex items-start gap-3.5 text-sm text-amber-950">
          <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">
              {isKn
                ? 'ಸಂಪೂರ್ಣ ಕೃಷಿ ಕೈಪಿಡಿ ಶೀಘ್ರದಲ್ಲೇ ಬರಲಿದೆ'
                : 'Detailed agronomy guide coming soon'}
            </p>
            <p className="text-slate-700 leading-relaxed">
              {isKn
                ? `${crop.kannada_name} ಬೆಳೆಯ ಪೂರ್ಣ ವಿವರವಾದ ಹಂತಗಳ ಕೈಪಿಡಿಯನ್ನು ಶೀಘ್ರದಲ್ಲೇ ಅಪ್‌ಡೇಟ್ ಮಾಡಲಾಗುವುದು. ತಕ್ಷಣದ ವೈಜ್ಞಾನಿಕ ಸಲಹೆಗಾಗಿ ನಿಮ್ಮ ಸ್ಥಳೀಯ ರೈತ ಸಂಪರ್ಕ ಕೇಂದ್ರವನ್ನು (RSK) ಸಂಪರ್ಕಿಸಿ.`
                : `A full 6-phase guide for ${crop.name} is currently being prepared. For immediate scientific advice and subsidized inputs, please contact your local Raitha Samparka Kendra.`}
            </p>
          </div>
        </div>
      )}

      {/* 8. Step-by-Step Cultivation Process via StepTimeline */}
      <StepTimeline
        steps={crop.cultivation_steps || []}
        storageKey={`crop_${selectedCropKey}`}
        lang={lang}
        title={isKn ? `🌱 ${crop.kannada_name} ಹಂತ-ಹಂತದ ಕೃಷಿ ವಿಧಾನ` : `🌱 Step-by-Step Farming Process for ${crop.name}`}
      />
    </div>
  );
}
