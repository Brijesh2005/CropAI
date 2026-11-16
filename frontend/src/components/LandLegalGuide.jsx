import React from 'react';
import { LEGAL_INSTRUCTIONS } from '../data/agriculturalData';
import { Scale, ExternalLink, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function LandLegalGuide({ language = 'kn' }) {
  const sections = Object.values(LEGAL_INSTRUCTIONS);

  return (
    <div className="w-full flex flex-col gap-6 text-left">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-amber-50/70 border border-amber-300/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">
            <Scale className="w-4 h-4 text-amber-700" />
            <span>{language === 'kn' ? 'ಕರ್ನಾಟಕ ಕಂದಾಯ ಕಾಯ್ದೆ & ಭೂಮಿ ಪರಿಶೀಲನೆ' : 'Karnataka Land Revenue & Legal Verification'}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-['Space_Grotesk']">
            {language === 'kn' ? 'ಜಮೀನಿನ ಕಾನೂನು ಮತ್ತು ಪಹಣಿ (RTC) ಪರಿಶೀಲನಾ ಮಾರ್ಗದರ್ಶಿ' : 'Land Legal Verification & Bhoomi RTC Instructions'}
          </h3>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            {language === 'kn'
              ? 'ದಕ್ಷಿಣ ಕನ್ನಡದಲ್ಲಿ ಕೃಷಿ ಜಮೀನು ಖರೀದಿಸುವ ಮುನ್ನ ಅಥವಾ ಪರಿಶೀಲಿಸುವ ಮುನ್ನ ಪ್ರತಿಯೊಬ್ಬ ರೈತರೂ ತಿಳಿದುಕೊಳ್ಳಬೇಕಾದ ಕಡ್ಡಾಯ ಕಂದಾಯ ದಾಖಲೆಗಳು.'
              : 'Mandatory statutory due diligence checks before acquiring or investing in agricultural land across Dakshina Kannada.'}
          </p>
        </div>

        {/* Quick Portal Link */}
        <a
          href="https://landrecords.karnataka.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          <span>{language === 'kn' ? 'ಭೂಮಿ ಪೋರ್ಟಲ್ ತೆರೆಯಿರಿ' : 'Open Bhoomi Portal'}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* 4 Main Legal Verification Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {sections.map((sec, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500/40 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 mb-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                  {idx + 1}
                </div>
                <h4 className="text-base font-bold text-slate-900 font-['Space_Grotesk']">
                  {language === 'kn' ? sec.kannada_title : sec.title}
                </h4>
              </div>

              <div className="space-y-3.5 text-xs">
                {sec.points.map((pt, pIdx) => (
                  <div key={pIdx} className="space-y-1">
                    <p className="font-bold text-slate-800 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{language === 'kn' ? pt.kannada_head : pt.head}</span>
                    </p>
                    <p className="text-slate-600 pl-5 leading-relaxed">
                      {language === 'kn' ? pt.kannada_text : pt.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="font-mono text-emerald-700 font-semibold">
                {language === 'kn' ? 'ಕಡ್ಡಾಯ ನಿಯಮಾವಳಿ' : 'Statutory Compliance'}
              </span>
              <span>Karnataka Land Reforms Act</span>
            </div>
          </div>
        ))}
      </div>

      {/* Caution Alert Callout */}
      <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-300 flex items-start gap-3 text-xs text-amber-900">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">
            {language === 'kn' ? 'ರೈತರಿಗೆ ಪ್ರಮುಖ ಎಚ್ಚರಿಕೆ: ' : 'Critical Advisory for Land Buyers: '}
          </span>
          <span>
            {language === 'kn'
              ? 'ಬಿ-ಖರಾಬು (ಸರ್ಕಾರಿ ಜಮೀನು), ಅರಣ್ಯ ಗಡಿ ಅಥವಾ ಸಾರ್ವಜನಿಕ ಕಾಲುವೆ ಒಳಗೊಂಡ ಜಮೀನುಗಳನ್ನು ಯಾರೂ ಮಾರಾಟ ಮಾಡಲು ಬರುವುದಿಲ್ಲ. ನೋಂದಣಿಗೂ ಮುನ್ನ ತಾಲೂಕು ಸರ್ವೇಯರ್ ಮೂಲಕ ಗಡಿ ಕಲ್ಲುಗಳು ಸ್ಥಳದಲ್ಲಿ ಸರಿಯಾಗಿವೆಯೇ ಎಂದು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ.'
              : 'Never buy B-Kharab land (government public property) or lands subject to Form 7 Land Tribunal disputes. Always insist on a physical Mojini 11E on-site boundary survey.'}
          </span>
        </div>
      </div>
    </div>
  );
}

