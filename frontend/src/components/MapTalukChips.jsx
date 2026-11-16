import React from 'react';
import { Compass } from 'lucide-react';

export default function MapTalukChips({
  taluks = [],
  selectedTaluk = '',
  onSelectTaluk = () => {},
  showHowToBanner = true,
  t = (k, f) => f
}) {
  return (
    <div className={`hidden lg:flex absolute left-4 z-[900] items-center gap-1.5 p-1 rounded-xl bg-white/95 border border-slate-200 shadow-sm backdrop-blur-md transition-all ${
      showHowToBanner ? 'top-32' : 'top-20'
    }`}>
      <span className="text-xs font-bold text-slate-500 px-2 flex items-center gap-1">
        <Compass className="w-3.5 h-3.5 text-emerald-700" />
        <span>{t('map.taluk_select', 'Taluk:')}</span>
      </span>
      {taluks.map((tItem) => (
        <button
          key={tItem.name}
          type="button"
          onClick={() => onSelectTaluk(tItem)}
          className={`min-h-[36px] px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            selectedTaluk === tItem.name
              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          {tItem.knName} ({tItem.name})
        </button>
      ))}
    </div>
  );
}
