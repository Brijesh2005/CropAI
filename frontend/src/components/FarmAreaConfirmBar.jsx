import React from 'react';
import { ChevronRight, Loader2 } from 'lucide-react';

export default function FarmAreaConfirmBar({
  calculatedAreaAcres,
  calculatedAreaSqm,
  isAnalyzing,
  onConfirm,
  t
}) {
  return (
    <>
      {/* 1. Desktop Floating Confirm & Area Card */}
      <div className="hidden sm:block absolute bottom-4 right-4 z-[1000] w-72">
        <div className="card p-4 bg-white/95 border border-emerald-300 shadow-xl backdrop-blur-md flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t('map.selected_farm', 'Selected Farm Land')}
            </span>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Live
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-['Space_Grotesk']">
              {calculatedAreaAcres}
            </span>
            <span className="text-sm font-bold text-emerald-700">
              {t('map.acres', 'Acres')}
            </span>
            <span className="text-xs text-slate-400 ml-auto">
              ({calculatedAreaSqm.toLocaleString()} m²)
            </span>
          </div>

          <button
            onClick={() => onConfirm(calculatedAreaAcres)}
            disabled={isAnalyzing}
            className="btn-primary w-full py-3"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Checking...</span>
              </>
            ) : (
              <>
                <span>{t('map.check_farm_btn', 'Check my farm')}</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Mobile Sticky Bottom Confirm Bar */}
      <div className="sm:hidden absolute bottom-0 inset-x-0 z-[1200] bg-white border-t border-emerald-200 p-3.5 shadow-2xl flex items-center justify-between gap-3">
        <div>
          <div className="text-xs text-slate-500 font-medium">
            {t('map.selected_farm', 'Selected Farm Land')}:
          </div>
          <div className="text-lg font-extrabold text-slate-900">
            {calculatedAreaAcres} <span className="text-xs font-semibold text-emerald-700">{t('map.acres', 'Acres')}</span>
          </div>
        </div>

        <button
          onClick={() => onConfirm(calculatedAreaAcres)}
          disabled={isAnalyzing}
          className="btn-primary flex-1 py-3"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <span>{t('map.check_farm_btn', 'Check my farm')}</span>
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </>
  );
}
