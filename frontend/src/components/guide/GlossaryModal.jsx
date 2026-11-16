import React from 'react';
import { BookOpen, X } from 'lucide-react';
import { LEGAL_INSTRUCTIONS } from '../../data/agriculturalData';

export default function GlossaryModal({ isOpen = false, onClose = () => {}, isKn = true }) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="w-full max-w-2xl bg-white rounded-2xl p-6 shadow-xl border border-slate-200 flex flex-col gap-4 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            <h3 className="text-lg font-bold text-slate-900 font-['Space_Grotesk']">
              {isKn ? 'ಕರ್ನಾಟಕ ಕಂದಾಯ ಪದಕೋಶ (Revenue Glossary)' : 'Karnataka Land Revenue Glossary'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors cursor-pointer min-h-[44px] min-w-[44px]"
            aria-label="Close glossary"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-slate-600">
          {isKn
            ? 'ದಕ್ಷಿಣ ಕನ್ನಡದ ಕಂದಾಯ ಕಚೇರಿಗಳು ಮತ್ತು ಪಹಣಿ (RTC) ಯಲ್ಲಿ ಬಳಸಲಾಗುವ ಪ್ರಮುಖ ಕಾನೂನು ಪದಗಳ ಸರಳ ವಿವರಣೆ.'
            : 'Plain-language explanations of essential statutory terms used in Bhoomi RTC and Sub-Registrar documents.'}
        </p>

        <div className="space-y-3 mt-1">
          {LEGAL_INSTRUCTIONS.glossary.map((item, gIdx) => (
            <div
              key={gIdx}
              className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm sm:text-base text-slate-900">
                  {isKn ? item.kannada_term : item.term}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  {isKn ? item.term : item.kannada_term}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mt-1">
                {isKn ? item.kannada_definition : item.definition}
              </p>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="btn-primary min-h-[44px] px-6 text-sm font-bold"
          >
            {isKn ? 'ಮುಚ್ಚಿ' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}
