import React from 'react';
import HeroSection from './HeroSection';
import { REGIONAL_DATA } from '../data/agriculturalData';
import { 
  BookOpen, 
  Scale, 
  ShoppingCart, 
  ArrowRight, 
  ChevronRight,
  CheckCircle2
} from 'lucide-react';
import { useLang } from '../i18n/LanguageContext';

export default function DashboardView({ onStartAnalyze, onExploreSystem, onSelectTaluk }) {
  const { lang, t } = useLang();
  const talukList = Object.values(REGIONAL_DATA);

  return (
    <div className="w-full flex flex-col gap-12 pb-20 text-left">
      {/* 1. Hero Section */}
      <HeroSection
        onStartAnalyze={onStartAnalyze}
        onExploreSystem={onExploreSystem}
      />

      {/* 2. Featured 7 Dakshina Kannada Agricultural Sectors (With Real Photos) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              <span>{t('dash.taluks_badge', '7 Farming Taluks of Dakshina Kannada')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Space_Grotesk'] tracking-tight">
              {t('dash.taluks_title', 'Dakshina Kannada Agro-Climatic Regions')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {t('dash.taluks_subtitle', 'Click any taluk to inspect real-life landscapes, soil profiles, and tailored crop predictions.')}
            </p>
          </div>

          <button
            onClick={onStartAnalyze}
            className="btn-secondary text-xs font-bold text-emerald-800 flex items-center gap-1.5 cursor-pointer bg-emerald-50 border-emerald-200"
          >
            <span>{t('dash.launch_map', 'Launch farm map')}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 7 Taluks Grid with Real Landscape Photos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {talukList.map((tItem) => (
            <div
              key={tItem.name}
              onClick={() => onSelectTaluk({
                name: tItem.name,
                lat: tItem.name === 'Puttur' ? 12.7663 : tItem.name === 'Mangaluru' ? 12.9141 : tItem.name === 'Bantwal' ? 12.8903 : tItem.name === 'Belthangady' ? 12.9983 : tItem.name === 'Sullia' ? 12.5606 : tItem.name === 'Moodbidri' ? 13.0694 : 12.7381,
                lon: tItem.name === 'Puttur' ? 75.2033 : tItem.name === 'Mangaluru' ? 74.8560 : tItem.name === 'Bantwal' ? 75.0347 : tItem.name === 'Belthangady' ? 75.2588 : tItem.name === 'Sullia' ? 75.3892 : tItem.name === 'Moodbidri' ? 74.9961 : 75.4522
              })}
              className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow-md hover:border-emerald-500/50 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                {/* Real Region Landscape Photo */}
                <div className="relative h-36 w-full overflow-hidden">
                  <img
                    src={tItem.landscape_image}
                    alt={tItem.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex items-end p-3">
                    <span className="text-xs font-bold text-white bg-black/60 px-2 py-0.5 rounded backdrop-blur-xs">
                      {lang === 'kn' ? `${tItem.kannada_name} ವಲಯ` : `${tItem.name} Sector`}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <h3 className="text-base font-bold font-['Space_Grotesk'] text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {lang === 'kn' ? tItem.kannada_name : tItem.name}
                    </h3>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      Dakshina Kannada
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mb-2 font-medium line-clamp-1">
                    {lang === 'kn' ? tItem.kannada_zone : tItem.zone}
                  </p>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {lang === 'kn' ? tItem.kannada_desc : tItem.description}
                  </p>
                </div>
              </div>

              <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">{t('dash.key_crops', 'Key crops:')}</span>
                <span className="font-bold text-emerald-800">{tItem.key_crops[0].split(' ')[0]}</span>
              </div>
            </div>
          ))}

          {/* Quick Custom Plot Card */}
          <div
            onClick={onStartAnalyze}
            className="rounded-2xl bg-emerald-50/70 border-2 border-dashed border-emerald-400 p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-emerald-100/60 transition-all group shadow-sm"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/30 mb-3 group-hover:scale-105 transition-transform">
              <ArrowRight className="w-5 h-5 text-white" />
            </div>
            <div className="text-sm font-bold text-slate-900 font-['Space_Grotesk']">
              {t('dash.custom_plot_title', 'Custom Land Coordinates')}
            </div>
            <p className="text-xs text-slate-600 mt-1">
              {t('dash.custom_plot_desc', 'Click anywhere on the satellite map or search your village to analyze any parcel.')}
            </p>
          </div>
        </div>
      </section>

      {/* 3. Farmer Service Pillars Section (Cultivation Guide, Legal & Buying Info) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="p-8 rounded-3xl bg-gradient-to-br from-white via-emerald-50/40 to-teal-50/30 border border-emerald-500/20 shadow-sm flex flex-col gap-8">
          <div>
            <span className="text-xs font-bold text-emerald-800">
              {t('dash.pillars_badge', 'Comprehensive Farmer Services')}
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Space_Grotesk'] mt-1">
              {t('dash.pillars_title', 'Everything You Need for Agricultural Land in Dakshina Kannada')}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pillar 1: Step-by-Step Cultivation Guide */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 font-bold">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-2">
                  {t('dash.pillar_guide_title', 'Complete Cultivation Guides')}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {t('dash.pillar_guide_desc', 'Full step-by-step instructions for Coconut, Arecanut, Paddy, Cashew, Pepper, Banana & Rubber with pit digging, NPK dosages, and Bordeaux spray guidelines.')}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center text-xs font-bold text-emerald-700">
                <span>ಕನ್ನಡ &amp; English</span>
                <CheckCircle2 className="w-4 h-4 ml-1.5" />
              </div>
            </div>

            {/* Pillar 2: Land Legal & Bhoomi Verification */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4 font-bold">
                  <Scale className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-2">
                  {t('dash.pillar_legal_title', 'Bhoomi RTC & Legal Verification')}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {t('dash.pillar_legal_desc', 'Learn how to inspect Column 9 owner names, Column 11 bank liabilities, Kaveri 30-year Encumbrance Certificates (EC), and Mojini 11E survey boundary sketches.')}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center text-xs font-bold text-amber-700">
                <span>Avoid Land Disputes</span>
                <CheckCircle2 className="w-4 h-4 ml-1.5" />
              </div>
            </div>

            {/* Pillar 3: Land Purchase & Authority Contacts */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4 font-bold">
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-2">
                  {t('dash.pillar_buy_title', 'How to Buy & Who to Contact')}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {t('dash.pillar_buy_desc', 'Direct official contacts for Tahsildar offices, Sub-Registrars, Village Accountants, and Raitha Samparka Kendras across all 7 taluks with registration steps.')}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center text-xs font-bold text-emerald-800">
                <span>Verified Official Directory</span>
                <CheckCircle2 className="w-4 h-4 ml-1.5" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
