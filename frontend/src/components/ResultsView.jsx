import React, { useState } from 'react';
import { 
  Sprout, 
  BookOpen, 
  Compass, 
  Scale, 
  ShoppingCart, 
  Printer, 
  RefreshCw, 
  MapPin, 
  AlertCircle
} from 'lucide-react';
import AnswerCard from './AnswerCard';
import AlternativeCrops from './AlternativeCrops';
import TechnicalDetails from './TechnicalDetails';
import CultivationGuide from './CultivationGuide';
import RegionalLandscapeCard from './RegionalLandscapeCard';
import LandLegalGuide from './LandLegalGuide';
import LandBuyingGuide from './LandBuyingGuide';
import { getCropProfile } from '../data/agriculturalData';
import { useLang } from '../i18n/LanguageContext';

export default function ResultsView({ prediction, currentArea = 2.0, onReset }) {
  const [activeTab, setActiveTab] = useState('crop'); // 'crop' | 'guide' | 'region' | 'legal' | 'buying'
  const { lang, t } = useLang();

  // If no prediction or missing critical crop data, show friendly retry state
  if (!prediction || !prediction.recommended_crop) {
    return (
      <div className="w-full max-w-xl mx-auto py-16 px-4 text-left">
        <div className="card p-8 bg-white border border-amber-200 shadow-md text-center flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 font-['Space_Grotesk']">
            {t('res.error_title', "We couldn't calculate this.")}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md">
            {t('res.error_desc', 'Please try selecting your land again or try another taluk in Dakshina Kannada.')}
          </p>
          <button
            onClick={onReset}
            className="btn-primary mt-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>{t('res.retry_btn', 'Try again')}</span>
          </button>
        </div>
      </div>
    );
  }

  const loc = prediction.location_summary || prediction.location || {};
  const env = prediction.environmental || prediction.agricultural_info || {};
  const sat = prediction.satellite || prediction.agricultural_info || {};
  const recommendations = prediction.top_recommendations || [];
  const primaryRec = recommendations[0] || {};
  const cropName = prediction.recommended_crop;
  const cropProfile = getCropProfile(cropName);

  const tabs = [
    { id: 'crop', icon: Sprout, label: t('res.tab_crop', 'Best Crop') },
    { id: 'guide', icon: BookOpen, label: t('res.tab_guide', 'How to grow') },
    { id: 'region', icon: Compass, label: t('res.tab_region', 'Region & Soil') },
    { id: 'legal', icon: Scale, label: t('res.tab_legal', 'Land papers') },
    { id: 'buying', icon: ShoppingCart, label: t('res.tab_buying', 'Buying & Contacts') }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex flex-col gap-6 text-left">
      {/* 1. Header Toolbar: Place Summary & Action Buttons */}
      <div className="p-5 rounded-2xl bg-white border border-emerald-500/20 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span>{t('res.badge_results', 'Farm Analysis Results')}</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-['Space_Grotesk'] tracking-tight">
            {loc.place_name || `${loc.taluk || 'Dakshina Kannada'} Farm Plot`}
          </h1>

          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 mt-1">
            {loc.taluk && (
              <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {loc.taluk} Taluk
              </span>
            )}
            <span>•</span>
            <span className="font-semibold text-slate-800 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-red-500" />
              {loc.latitude ? `${loc.latitude.toFixed(4)}° N, ${loc.longitude?.toFixed(4)}° E` : ''}
            </span>
            <span>•</span>
            <span className="font-bold text-slate-900">
              {currentArea} {t('map.acres', 'Acres')}
            </span>
          </div>
        </div>

        {/* Buttons: Print and Change Land */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={() => window.print()}
            aria-label="Print report"
            className="btn-secondary text-xs min-h-[42px] px-3.5"
            title="Print or save as PDF"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>{t('res.print', 'Print report')}</span>
          </button>

          <button
            onClick={onReset}
            className="btn-primary text-xs min-h-[42px] px-4"
          >
            <RefreshCw className="w-4 h-4" />
            <span>{t('res.change_land', 'Change land')}</span>
          </button>
        </div>
      </div>

      {/* 2. Mobile-Friendly 5-Tab Navigation Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200 scrollbar-thin">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`min-h-[44px] px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-sm font-extrabold'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Tab Contents */}

      {/* TAB 1: CROP & ANSWER CARD */}
      {activeTab === 'crop' && (
        <div className="flex flex-col gap-6">
          {/* Top Single Answer Card */}
          <AnswerCard
            cropName={cropName}
            cropProfile={cropProfile}
            primaryRec={primaryRec}
            farmArea={currentArea}
            confidence={prediction.confidence || primaryRec.confidence_score}
            lang={lang}
            t={t}
          />

          {/* Visible Disclaimer under the Answer Card */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
            <span className="text-base shrink-0">ℹ️</span>
            <span>{t('res.disclaimer', 'This is an estimate based on satellite and weather data. It is not a guarantee.')}</span>
          </div>

          {/* Alternative Crops */}
          <AlternativeCrops
            recommendations={recommendations}
            lang={lang}
            t={t}
          />

          {/* Collapsed Technical Details (<details>) */}
          <TechnicalDetails
            environmental={env}
            satellite={sat}
            lang={lang}
            t={t}
          />
        </div>
      )}

      {/* TAB 2: STEP-BY-STEP CULTIVATION GUIDE */}
      {activeTab === 'guide' && (
        <CultivationGuide
          initialCrop={cropName}
        />
      )}

      {/* TAB 3: REGIONAL LANDSCAPE & SOIL */}
      {activeTab === 'region' && (
        <RegionalLandscapeCard
          talukName={loc.taluk || 'Puttur'}
          language={lang}
        />
      )}

      {/* TAB 4: LAND LEGAL & BHOOMI RTC PAPERS */}
      {activeTab === 'legal' && (
        <LandLegalGuide language={lang} />
      )}

      {/* TAB 5: BUYING LAND & CONTACTS */}
      {activeTab === 'buying' && (
        <LandBuyingGuide
          selectedTaluk={loc.taluk || 'Puttur'}
          language={lang}
        />
      )}
    </div>
  );
}
