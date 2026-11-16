import React from 'react';
import { Sprout, TrendingUp, IndianRupee } from 'lucide-react';

export default function AnswerCard({
  cropName,
  cropProfile,
  primaryRec,
  farmArea,
  confidence,
  lang = 'kn',
  t
}) {
  // Suitability label based on confidence
  const confValue = typeof confidence === 'number' ? confidence : 0.8;
  let suitabilityLabel = t('res.suitability_high', 'Very suitable 🟢');
  let suitabilityBg = 'bg-emerald-50 text-emerald-800 border-emerald-300';

  if (confValue < 0.5) {
    suitabilityLabel = t('res.suitability_low', 'Not recommended 🔴');
    suitabilityBg = 'bg-red-50 text-red-800 border-red-300';
  } else if (confValue < 0.75) {
    suitabilityLabel = t('res.suitability_med', 'Suitable 🟡');
    suitabilityBg = 'bg-amber-50 text-amber-800 border-amber-300';
  }

  // Yield in Quintals per acre and Total Quintals
  const yieldPerAcre = primaryRec?.yield_quintals_per_acre 
    || (primaryRec?.yield_t_per_ha ? Math.round(primaryRec.yield_t_per_ha * 4.047 * 10) / 10 : 12.5);
  
  const totalQuintals = primaryRec?.total_yield_quintals 
    || Math.round(yieldPerAcre * (farmArea || 1) * 10) / 10;

  // Estimated Gross Revenue in INR
  const pricePerQ = primaryRec?.market_price_per_quintal_inr || 4200;
  const estimatedRevenue = primaryRec?.gross_revenue_inr 
    || Math.round(totalQuintals * pricePerQ);

  const knCropName = cropProfile?.kannada_name || cropName;
  const enCropName = cropProfile?.name || cropName;

  return (
    <div className="card p-6 sm:p-8 bg-white border border-emerald-300 shadow-md flex flex-col gap-6 text-left">
      {/* Top Banner: Suitability & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <Sprout className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-slate-700">
            {t('res.top_crop_badge', 'Recommended for your land')}
          </span>
        </div>

        <div className={`px-3 py-1 rounded-full border text-xs font-bold self-start sm:self-auto ${suitabilityBg}`}>
          {suitabilityLabel}
        </div>
      </div>

      {/* Main Crop Identity & Photo */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
        <div className="sm:col-span-5 h-56 rounded-2xl overflow-hidden border border-emerald-200 shadow-sm relative group bg-emerald-50">
          <img
            src={cropProfile?.primary_image || '/images/crops/arecanut_primary.jpg'}
            alt={enCropName}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => { e.currentTarget.src = '/images/crops/arecanut_primary.jpg'; }}
          />
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-3 text-center text-xs text-white font-medium">
            {cropProfile?.scientific_name || enCropName}
          </div>
        </div>

        <div className="sm:col-span-7 flex flex-col justify-center gap-2">
          <div className="text-xs font-bold text-emerald-800">
            {lang === 'kn' ? 'ಪ್ರಮುಖ ಬೆಳೆ ಆಯ್ಕೆ' : 'Primary Crop Selection'}
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Space_Grotesk'] leading-tight">
            {lang === 'kn' ? knCropName : enCropName}
            <span className="text-lg sm:text-xl font-normal text-slate-500 ml-2">
              ({lang === 'kn' ? enCropName : knCropName})
            </span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {lang === 'kn'
              ? 'ದಕ್ಷಿಣ ಕನ್ನಡದ ಮಣ್ಣು, ವಾರ್ಷಿಕ ಮಳೆ ಮತ್ತು ಸೂರ್ಯನ ಬೆಳಕಿಗೆ ಈ ಬೆಳೆ ಅತ್ಯಂತ ಯಶಸ್ವಿಯಾಗಿದೆ.'
              : 'Proven match for Dakshina Kannada soil profile, annual monsoon precipitation, and solar radiation.'}
          </p>

          {/* Quick Economics Tag */}
          <div className="mt-2 text-xs font-semibold text-slate-700">
            <span className="text-slate-500">APMC Rate: </span>
            <span className="text-emerald-800 font-bold">₹{pricePerQ.toLocaleString('en-IN')} / Quintal</span>
          </div>
        </div>
      </div>

      {/* 3 Core Farmer Answer Numbers: Yield / Total / Revenue */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
        {/* Metric 1: Expected Yield in Quintals / Acre */}
        <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
          <div className="text-xs font-semibold text-slate-600 flex items-center gap-1.5 mb-1">
            <TrendingUp className="w-4 h-4 text-emerald-700" />
            <span>{t('res.expected_yield', 'Expected Yield')}</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-900 font-['Space_Grotesk']">
            {yieldPerAcre}
          </div>
          <div className="text-xs font-bold text-emerald-700 mt-0.5">
            {t('res.quintals_per_acre', 'Quintals / acre')}
          </div>
        </div>

        {/* Metric 2: Total Farm Output */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="text-xs font-semibold text-slate-600 flex items-center gap-1.5 mb-1">
            <Sprout className="w-4 h-4 text-emerald-600" />
            <span>{t('res.total_harvest', 'Total Farm Harvest')}</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 font-['Space_Grotesk']">
            {totalQuintals}
          </div>
          <div className="text-xs font-medium text-slate-500 mt-0.5">
            {t('res.total_quintals', 'Total quintals')} ({farmArea} {t('map.acres', 'Acres')})
          </div>
        </div>

        {/* Metric 3: Estimated Revenue in ₹ */}
        <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200">
          <div className="text-xs font-semibold text-slate-600 flex items-center gap-1.5 mb-1">
            <IndianRupee className="w-4 h-4 text-amber-700" />
            <span>{t('res.estimated_income', 'Estimated Gross Income')}</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-900 font-['Space_Grotesk']">
            ₹{estimatedRevenue.toLocaleString('en-IN')}
          </div>
          <div className="text-xs font-medium text-amber-800 mt-0.5">
            {t('res.cycle_days', 'Growth Cycle')}: {cropProfile?.maturity_days || '150-180 days'}
          </div>
        </div>
      </div>
    </div>
  );
}
