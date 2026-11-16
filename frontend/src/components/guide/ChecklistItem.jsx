import React, { useState } from 'react';
import { ExternalLink, CheckCircle2, Clock, IndianRupee } from 'lucide-react';

export function ChecklistGroup({
  items = [],
  storageKey = 'default',
  lang = 'kn',
  title = null,
  children
}) {
  const isKn = lang === 'kn';
  const storageId = `terravision_checklist_${storageKey}`;

  const [checkedMap, setCheckedMap] = useState(() => {
    try {
      const saved = localStorage.getItem(storageId);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const toggleItem = (id) => {
    setCheckedMap((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem(storageId, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to save checklist state:', e);
      }
      return updated;
    });
  };

  const total = items.length;
  const doneCount = items.filter((it) => !!checkedMap[it.id]).length;
  const progressPercent = total > 0 ? Math.round((doneCount / total) * 100) : 0;

  return (
    <div className="w-full flex flex-col gap-4 text-left">
      {/* Progress Strip */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col gap-2.5">
        <div className="flex items-center justify-between gap-2">
          {title && (
            <h4 className="text-base font-bold text-slate-900 font-['Space_Grotesk']">
              {title}
            </h4>
          )}
          <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-800 ml-auto">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>
              {isKn
                ? `${total} ರಲ್ಲಿ ${doneCount} ಪರಿಶೀಲಿಸಲಾಗಿದೆ`
                : `${doneCount} of ${total} verified`}
            </span>
          </div>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full bg-emerald-600 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Render children or passed items */}
      <div className="space-y-3">
        {typeof children === 'function'
          ? children({ checkedMap, toggleItem })
          : items.map((item) => (
              <ChecklistItem
                key={item.id}
                id={item.id}
                title={isKn ? (item.kannada_title || item.title) : item.title}
                desc={isKn ? (item.kannada_desc || item.desc) : item.desc}
                whereToGet={item.whereToGet}
                costOrTime={item.costOrTime}
                isChecked={!!checkedMap[item.id]}
                onToggle={() => toggleItem(item.id)}
                lang={lang}
              />
            ))}
      </div>
    </div>
  );
}

export default function ChecklistItem({
  id,
  title,
  desc,
  whereToGet = null,
  costOrTime = null,
  isChecked = false,
  onToggle = () => {},
  lang = 'kn'
}) {
  const isKn = lang === 'kn';

  return (
    <div
      className={`p-4 sm:p-5 rounded-2xl bg-white border transition-all shadow-sm ${
        isChecked
          ? 'border-emerald-300/80 bg-emerald-50/20'
          : 'border-slate-200 hover:border-emerald-300'
      }`}
    >
      <div className="flex items-start gap-3.5">
        {/* Large Accessible Checkbox Target */}
        <label
          htmlFor={`check_${id}`}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center -ml-2 -mt-2 cursor-pointer shrink-0"
        >
          <input
            id={`check_${id}`}
            type="checkbox"
            checked={isChecked}
            onChange={onToggle}
            className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 cursor-pointer"
          />
        </label>

        {/* Text and Actions */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h5 className={`text-base font-bold leading-snug ${isChecked ? 'text-emerald-950 line-through opacity-85' : 'text-slate-900'}`}>
              {title}
            </h5>

            {costOrTime && (
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                {costOrTime.time && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-900">
                    <Clock className="w-3 h-3 text-amber-600" />
                    <span>{costOrTime.time}</span>
                  </span>
                )}
                {costOrTime.cost && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-800">
                    <IndianRupee className="w-3 h-3 text-slate-600" />
                    <span>{costOrTime.cost}</span>
                  </span>
                )}
              </div>
            )}
          </div>

          <p className="text-sm sm:text-base text-slate-700 leading-relaxed mt-2">
            {desc}
          </p>

          {/* Where-To-Get Link */}
          {whereToGet && whereToGet.url && (
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">
                {isKn ? 'ದಾಖಲೆ ಪಡೆಯುವ ಸ್ಥಳ:' : 'Where to obtain:'}
              </span>
              <a
                href={whereToGet.url}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold inline-flex items-center gap-1.5 transition-colors border border-emerald-200"
              >
                <span>{isKn ? (whereToGet.kannada_label || whereToGet.label) : whereToGet.label}</span>
                <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
