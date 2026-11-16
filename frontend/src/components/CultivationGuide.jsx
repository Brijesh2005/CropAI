import React, { useState } from 'react';
import { CROP_PROFILES } from '../data/agriculturalData';
import { BookOpen, CheckCircle2 } from 'lucide-react';
import { useLang } from '../i18n/LanguageContext';

export default function CultivationGuide({ initialCrop = 'Arecanut' }) {
  const [selectedCropKey, setSelectedCropKey] = useState(initialCrop);
  const { lang } = useLang();

  const crop = CROP_PROFILES[selectedCropKey] || CROP_PROFILES['Arecanut'];
  const cropKeys = Object.keys(CROP_PROFILES);

  return (
    <div className="w-full flex flex-col gap-6 text-left">
      {/* Top Header */}
      <div className="p-5 rounded-2xl bg-white border border-emerald-500/20 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 mb-1">
          <BookOpen className="w-4 h-4 text-emerald-600" />
          <span>{lang === 'kn' ? 'ಸಂಪೂರ್ಣ ಕೃಷಿ ಕೈಪಿಡಿ' : 'Complete Crop Cultivation Guide'}</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-['Space_Grotesk']">
          {lang === 'kn' ? `${crop.kannada_name} ಬೆಳೆಯುವ ವಿಧಾನ` : `How to Cultivate ${crop.name}`}
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          {lang === 'kn' 
            ? 'ದಕ್ಷಿಣ ಕನ್ನಡದ ಹವಾಮಾನಕ್ಕೆ ಸೂಕ್ತವಾದ ಹಂತ-ಹಂತದ ವೈಜ್ಞಾನಿಕ ಮಾರ್ಗದರ್ಶಿ' 
            : 'Step-by-step agronomic guide tailored to Dakshina Kannada soil & monsoon'}
        </p>
      </div>

      {/* Crop Selector Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {cropKeys.map((key) => {
          const c = CROP_PROFILES[key];
          const isSelected = selectedCropKey === key;
          return (
            <button
              key={key}
              onClick={() => setSelectedCropKey(key)}
              className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                isSelected
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-emerald-50 border border-slate-200'
              }`}
            >
              <span>{c.icon}</span>
              <span>{lang === 'kn' ? c.kannada_name : c.name}</span>
            </button>
          );
        })}
      </div>

      {/* Main Photographic Agronomy Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Crop Identity Photo & Key Metrics */}
        <div className="lg:col-span-5 rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between">
          <div className="relative h-56 sm:h-64 overflow-hidden group">
            <img
              src={crop.primary_image}
              alt={crop.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 text-white">
              <span className="text-xs font-semibold text-emerald-300">
                {crop.scientific_name}
              </span>
              <h4 className="text-xl font-bold">
                {lang === 'kn' ? crop.kannada_name : crop.name}
              </h4>
            </div>
          </div>

          <div className="p-4 flex flex-col gap-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-slate-500">{lang === 'kn' ? 'ಶಿಫಾರಸು ಮಾಡಿದ ತಳಿಗಳು:' : 'Recommended Varieties:'}</span>
              <span className="font-semibold text-slate-800 text-right max-w-[60%]">
                {lang === 'kn' ? crop.kannada_variety : crop.variety}
              </span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-slate-500">{lang === 'kn' ? 'ಬೆಳೆ ಅವಧಿ / ಜೀವಿತಾವಧಿ:' : 'Maturity / Economic Life:'}</span>
              <span className="font-semibold text-emerald-700">
                {crop.maturity_days}
              </span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-slate-500">{lang === 'kn' ? 'ನಿರೀಕ್ಷಿತ ಸರಾಸರಿ ಇಳುವರಿ:' : 'Expected Benchmark Yield:'}</span>
              <span className="font-semibold text-slate-800">
                {lang === 'kn' ? crop.kannada_yield : crop.yield_benchmark}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200/60 text-amber-900 font-medium">
              <span className="font-bold">{lang === 'kn' ? '💰 ಮಾರುಕಟ್ಟೆ ಆದಾಯ ಮೌಲ್ಯ: ' : '💰 Market Value Realization: '}</span>
              <span>{crop.economic_value}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Mini Photo Gallery */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm flex flex-col">
            <div className="h-32 sm:h-40 overflow-hidden">
              <img
                src={crop.farm_image}
                alt="Farming in Dakshina Kannada"
                className="w-full h-full object-cover hover:scale-105 transition-transform"
              />
            </div>
            <div className="p-3 text-center">
              <p className="text-xs font-bold text-slate-800">
                {lang === 'kn' ? 'ಹಸಿರು ತೋಟ' : 'Field Plantation'}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                {lang === 'kn' ? 'ದಕ್ಷಿಣ ಕನ್ನಡದ ಫಲವತ್ತಾದ ಕಣಿವೆ' : 'Dakshina Kannada Valley'}
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm flex flex-col">
            <div className="h-32 sm:h-40 overflow-hidden">
              <img
                src={crop.nursery_image}
                alt="Nursery Saplings"
                className="w-full h-full object-cover hover:scale-105 transition-transform"
              />
            </div>
            <div className="p-3 text-center">
              <p className="text-xs font-bold text-slate-800">
                {lang === 'kn' ? 'ಆರೋಗ್ಯಕರ ಸಸಿಗಳು' : 'Nursery Saplings'}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                {lang === 'kn' ? 'ಪ್ರಮಾಣೀಕೃತ ಕೃಷಿ ಸಸಿಗಳು' : 'Certified Rootstock'}
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm flex flex-col">
            <div className="h-32 sm:h-40 overflow-hidden">
              <img
                src={crop.harvest_image}
                alt="Harvest & Market"
                className="w-full h-full object-cover hover:scale-105 transition-transform"
              />
            </div>
            <div className="p-3 text-center">
              <p className="text-xs font-bold text-slate-800">
                {lang === 'kn' ? 'ಕಟಾವು & ಒಣಗಿಸುವಿಕೆ' : 'Harvest & Curing'}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                {lang === 'kn' ? 'ಉತ್ತಮ ಗುಣಮಟ್ಟದ ಚಾಲಿ/ಬೆಳೆ' : 'APMC Grade-1 Quality'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Step-by-Step Cultivation Process Cards */}
      <div className="flex flex-col gap-4">
        <h4 className="text-lg font-bold text-slate-900 font-['Space_Grotesk'] flex items-center gap-2">
          <span>{lang === 'kn' ? '🌱 ಹಂತ-ಹಂತದ ಕೃಷಿ ಮಾರ್ಗದರ್ಶಿ' : '🌱 Step-by-Step Farming Instructions'}</span>
          <span className="text-xs font-normal text-slate-500">
            ({crop.cultivation_steps.length} {lang === 'kn' ? 'ಪ್ರಮುಖ ಹಂತಗಳು' : 'Key Phases'})
          </span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {crop.cultivation_steps.map((st) => (
            <div
              key={st.step}
              className="p-5 rounded-2xl bg-white border border-emerald-500/15 hover:border-emerald-500/40 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100/70 border border-emerald-300 text-lg flex items-center justify-center">
                    {st.icon}
                  </div>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    {lang === 'kn' ? `ಹಂತ ${st.step}` : `Step ${st.step}`}
                  </span>
                </div>

                <h5 className="text-sm font-bold text-slate-900 mb-2">
                  {lang === 'kn' ? st.kannada_title : st.title}
                </h5>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {lang === 'kn' ? st.kannada_desc : st.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                <span>{lang === 'kn' ? 'ಶಿಫಾರಸು ಮಾಡಿದ ಪದ್ಧತಿ' : 'Recommended Protocol'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
