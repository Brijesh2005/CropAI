import React from 'react';
import { ArrowRight, Compass, Sprout, MapPin } from 'lucide-react';
import { useLang } from '../i18n/LanguageContext';

export default function HeroSection({ onStartAnalyze, onExploreSystem }) {
  const { t } = useLang();

  return (
    <section className="relative w-full pt-32 pb-16 lg:pt-36 lg:pb-20 overflow-hidden text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Hero Column: Typography & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start z-10">
            {/* Announcement Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 border border-emerald-300 text-xs font-semibold text-emerald-800 shadow-sm mb-6">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              <span>{t('hero.pill', 'Farmer Friend • Dakshina Kannada')}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12] font-['Space_Grotesk'] mb-6">
              {t('hero.title', 'Smart agriculture & land intelligence')}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 font-normal max-w-xl mb-8 leading-relaxed">
              {t('hero.subtitle', 'AI-powered crop yield forecasting, step-by-step farming instructions in Kannada & English, real-life land imagery, and Bhoomi legal verification across all 7 taluks of Dakshina Kannada.')}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <button
                onClick={onStartAnalyze}
                className="btn-primary"
              >
                <span>🌾 {t('hero.cta_analyze', 'Check my farm')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreSystem}
                className="btn-secondary"
              >
                <Compass className="w-4 h-4 text-emerald-600" />
                <span>{t('hero.cta_explore', 'Explore 7 taluks')}</span>
              </button>
            </div>

            {/* Minimalist Trust & Specs Strip */}
            <div className="pt-6 border-t border-slate-200 w-full grid grid-cols-3 gap-4">
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold font-['Space_Grotesk'] text-slate-900 flex items-center gap-1">
                  88.3<span className="text-emerald-600 text-lg">%</span>
                </div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">
                  {t('hero.stat_accuracy', 'Fusion accuracy')}
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold font-['Space_Grotesk'] text-slate-900 flex items-center gap-1">
                  7<span className="text-emerald-600 text-base font-bold ml-1">{t('map.taluk_select', 'Taluks').split(' ')[0]}</span>
                </div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">
                  {t('hero.stat_taluks_sub', 'Puttur to Mangaluru')}
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold font-['Space_Grotesk'] text-slate-900 flex items-center gap-1">
                  100<span className="text-emerald-600 text-lg">%</span>
                </div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">
                  {t('hero.stat_free', '100% Free to use')}
                </div>
              </div>
            </div>
          </div>

          {/* Right Hero Column: Real Farming Photographic Showcase */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="w-full max-w-[480px] rounded-3xl bg-white p-3 border border-emerald-300 shadow-xl relative overflow-hidden">
              <div className="relative h-80 rounded-2xl overflow-hidden group">
                <img
                  src="/images/fields/dakshina_kannada_hero.jpg"
                  alt="Lush Dakshina Kannada Farm"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5 text-white">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300 mb-1">
                    <MapPin className="w-3.5 h-3.5 text-red-400" />
                    <span>Puttur plantation belt</span>
                  </div>
                  <h4 className="text-xl font-bold font-['Space_Grotesk'] text-white">
                    Arecanut, Coconut &amp; Pepper Agro-Forestry
                  </h4>
                  <p className="text-xs text-slate-200 mt-0.5">
                    Real multi-layer plantation canopy monitored by Sentinel-2 radiometric imagery.
                  </p>
                </div>
              </div>

              {/* Floating Live Badge */}
              <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                    <Sprout className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">{t('hero.badge_orbit', 'Sentinel-2 Orbit Active')}</span>
                    <span className="text-xs text-emerald-800">{t('hero.badge_sub', 'Real-time spectral moisture indexing')}</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded bg-white text-xs font-bold text-emerald-800 border border-emerald-300 shadow-2xs">
                  {t('hero.ready', 'Ready')}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
