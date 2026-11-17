import React from 'react';
import { History, MapPin, Calendar, ArrowRight, Trash2, Sprout } from 'lucide-react';
import { getCropProfile } from '../data/agriculturalData';
import { useLang } from '../i18n/LanguageContext';

export default function HistoryView({
  history = [],
  onSelectRecord,
  onClearHistory,
  onDeleteRecord,
  onStartAnalyze
}) {
  const { lang, t } = useLang();

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString(lang === 'kn' ? 'kn-IN' : 'en-IN', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-left">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white/90 backdrop-blur-md border border-emerald-500/20 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 mb-1">
            <History className="w-4 h-4 text-emerald-600" />
            <span>{t('hist.title', 'Saved Farm Analyses')}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Space_Grotesk'] tracking-tight">
            {t('hist.title', 'Saved Farm Analyses')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t('hist.subtitle', 'Your previously checked farm lands in Dakshina Kannada.')}
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-red-700 bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-200 transition-all cursor-pointer self-start sm:self-auto"
          >
            <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-500" />
            <span>{t('hist.clear_btn', 'Clear all')}</span>
          </button>
        )}
      </div>

      {/* Empty State */}
      {history.length === 0 ? (
        <div className="card p-10 sm:p-12 text-center max-w-md mx-auto bg-white border border-slate-200 shadow-sm flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Sprout className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 font-['Space_Grotesk']">
            {t('hist.empty_title', 'No saved farm analyses yet')}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600">
            {t('hist.empty_desc', 'Check your farm land on the satellite map to save forecasts here.')}
          </p>
          <button
            onClick={onStartAnalyze}
            className="btn-primary mt-2"
          >
            <span>{t('hist.check_btn', 'Check a farm now')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* History Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.map((item) => {
            const profile = getCropProfile(item.crop);
            const cropTitle = lang === 'kn' ? (profile?.kannada_name || item.crop) : (profile?.name || item.crop);

            return (
              <div
                key={item.id}
                className="card p-5 bg-white border border-slate-200 hover:border-emerald-300 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Top metadata strip */}
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-3 pb-2 border-b border-slate-100">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formatDate(item.date)}</span>
                    </span>

                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 text-xs">
                        {item.area_acres} {t('map.acres', 'Acres')}
                      </span>

                      {/* Per-record delete button */}
                      {onDeleteRecord && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteRecord(item.id);
                          }}
                          aria-label={t('hist.delete_record', 'Delete')}
                          title={t('hist.delete_record', 'Delete')}
                          className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Crop Photo Thumbnail & Details */}
                  <div className="flex items-center gap-3.5 mb-3">
                    <div className="w-14 h-14 rounded-xl overflow-hidden border border-slate-200 shrink-0 bg-slate-50">
                      <img
                        src={profile?.primary_image || '/images/crops/arecanut_primary.jpg'}
                        alt={item.crop}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.src = '/images/crops/arecanut_primary.jpg'; }}
                      />
                    </div>
                    <div>
                      <div className="text-base font-bold text-slate-900 font-['Space_Grotesk']">
                        {cropTitle}
                      </div>
                      <div className="text-xs font-semibold text-emerald-700">
                        {item.yield_forecast || `${item.yield_q_per_acre || 11.2} Q/acre`}
                      </div>
                    </div>
                  </div>

                  {/* Location name and taluk */}
                  <div className="text-sm font-semibold text-slate-800">
                    {item.place_name}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    <span>{item.taluk} Taluk</span>
                    {item.lat && (
                      <span className="text-slate-400">
                        ({item.lat.toFixed(3)}°N, {item.lon.toFixed(3)}°E)
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Action Button */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => onSelectRecord(item)}
                    className="btn-secondary w-full py-2 text-xs flex items-center justify-center gap-1.5"
                  >
                    <span>{t('hist.recheck_btn', 'Open analysis')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
