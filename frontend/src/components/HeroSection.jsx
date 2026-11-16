import React from 'react';
import { ArrowRight, Compass, Sprout, ShieldCheck, Sun, CheckCircle2, MapPin, Sparkles } from 'lucide-react';

export default function HeroSection({ onStartAnalyze, onExploreSystem }) {
  return (
    <section className="relative w-full pt-32 pb-16 lg:pt-36 lg:pb-20 overflow-hidden text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Hero Column: Typography & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start z-10">
            {/* Announcement Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 border border-emerald-300 text-xs font-mono font-bold text-emerald-800 shadow-sm mb-6">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-ping" />
              <span>ರೈತ ಮಿತ್ರ • FARMER INTELLIGENCE PLATFORM</span>
              <span className="text-emerald-400">|</span>
              <span className="text-emerald-900 font-extrabold">DAKSHINA KANNADA</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12] font-['Space_Grotesk'] mb-6">
              SMART AGRICULTURE <br />
              &amp; <span className="text-emerald-600 underline decoration-emerald-400 decoration-wavy">LAND INTELLIGENCE</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 font-normal max-w-xl mb-8 leading-relaxed">
              AI-powered crop yield forecasting, step-by-step farming instructions in Kannada &amp; English, real-life land imagery, and Bhoomi legal verification across all 7 taluks of Dakshina Kannada.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <button
                onClick={onStartAnalyze}
                className="btn-emerald-primary text-sm font-bold tracking-wide cursor-pointer shadow-lg shadow-emerald-600/30"
              >
                <span>🌾 ANALYZE YOUR FARM LAND</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreSystem}
                className="btn-glass-secondary text-sm font-semibold cursor-pointer"
              >
                <Compass className="w-4 h-4 text-emerald-600" />
                <span>EXPLORE 7 TALUKS</span>
              </button>
            </div>

            {/* Minimalist Trust & Specs Strip */}
            <div className="pt-6 border-t border-slate-200 w-full grid grid-cols-3 gap-4">
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold font-['Space_Grotesk'] text-slate-900 flex items-center gap-1">
                  88.3<span className="text-emerald-600 text-lg">%</span>
                </div>
                <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider mt-0.5">
                  Fusion Accuracy
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold font-['Space_Grotesk'] text-slate-900 flex items-center gap-1">
                  7<span className="text-emerald-600 text-lg">TALUKS</span>
                </div>
                <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider mt-0.5">
                  Puttur to Mangaluru
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold font-['Space_Grotesk'] text-slate-900 flex items-center gap-1">
                  100<span className="text-emerald-600 text-lg">%</span>
                </div>
                <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider mt-0.5">
                  Free Satellite Data
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
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-300 mb-1">
                    <MapPin className="w-3.5 h-3.5 text-red-400" />
                    <span>PUTTUR PLANTATION BELT</span>
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
                    <span className="font-bold text-slate-900 block">Sentinel-2 Orbit Active</span>
                    <span className="text-[10px] text-emerald-700">Real-time spectral moisture indexing</span>
                  </div>
                </div>
                <span className="px-2 py-1 rounded bg-white font-mono text-[10px] font-bold text-emerald-800 border border-emerald-300 shadow-2xs">
                  READY
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
