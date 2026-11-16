import React, { useState } from 'react';
import { LEGAL_INSTRUCTIONS } from '../data/agriculturalData';
import { 
  Scale, 
  ExternalLink, 
  AlertOctagon, 
  BookOpen, 
  CheckCircle2, 
  Search, 
  ShieldCheck, 
  FileCheck2 
} from 'lucide-react';
import { useLang } from '../i18n/LanguageContext';
import ChecklistItem from './guide/ChecklistItem';
import GlossaryModal from './guide/GlossaryModal';

// TODO verify: Karnataka stamp duty is 5% + 1% registration fee + cess or updated 2026 rates
// TODO verify: whether 11E sketch is mandatory for all agricultural registrations or only for sub-divisions/parts of survey numbers
// TODO verify: agricultural land uses RTC/Pahani via Bhoomi mutation, whereas e-Khata typically applies to gramathana/non-agricultural properties via e-Swathu
// TODO verify: Karnataka Land Reforms Section 79 A/B repeal status and current eligibility rules for purchasing agricultural land

export default function LandLegalGuide() {
  const { lang } = useLang();
  const isKn = lang === 'kn';

  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);

  // Bhoomi quick lookup form state
  const [surveyNo, setSurveyNo] = useState('');
  const [hissaNo, setHissaNo] = useState('*');
  const [villageName, setVillageName] = useState('');

  // Persist legal verification checklist in localStorage
  const [checkedPoints, setCheckedPoints] = useState(() => {
    try {
      const saved = localStorage.getItem('terravision_legal_checks');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Persist already-own checklist in localStorage
  const [checkedOwnItems, setCheckedOwnItems] = useState(() => {
    try {
      const saved = localStorage.getItem('terravision_already_own_checks');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const togglePoint = (id) => {
    setCheckedPoints((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem('terravision_legal_checks', JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to save legal check state:', e);
      }
      return updated;
    });
  };

  const toggleOwnItem = (id) => {
    setCheckedOwnItems((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem('terravision_already_own_checks', JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to save already-own check state:', e);
      }
      return updated;
    });
  };

  const sectionsList = Object.values(LEGAL_INSTRUCTIONS.sections);
  const allPoints = sectionsList.flatMap((s) => s.points);
  const verifiedCount = allPoints.filter((pt) => !!checkedPoints[pt.id]).length;
  const verifiedPercent = allPoints.length > 0 ? Math.round((verifiedCount / allPoints.length) * 100) : 0;

  const handleOpenBhoomi = (e) => {
    e.preventDefault();
    window.open('https://landrecords.karnataka.gov.in', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full flex flex-col gap-8 text-left">
      {/* 1. Prominent Top Legal Disclaimer */}
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 flex items-start gap-3.5 shadow-sm">
        <Scale className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-sm sm:text-base">
            {isKn ? 'ಕಾನೂನು ಹಕ್ಕುತ್ಯಾಗ (Legal Disclaimer):' : 'Legal Disclaimer:'}
          </p>
          <p className="text-sm text-slate-800 leading-relaxed">
            {isKn ? LEGAL_INSTRUCTIONS.disclaimer.kn : LEGAL_INSTRUCTIONS.disclaimer.en}
          </p>
        </div>
      </div>

      {/* 2. Red "Stop if you see..." Summary */}
      <div className="p-5 sm:p-6 rounded-2xl bg-red-50/70 border-2 border-red-400 shadow-sm flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0">
            <AlertOctagon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base sm:text-lg font-extrabold text-red-950 font-['Space_Grotesk']">
              {isKn ? '🛑 ಇವುಗಳು ಕಂಡುಬಂದರೆ ಜಮೀನು ಖರೀದಿ ತಕ್ಷಣ ನಿಲ್ಲಿಸಿ!' : '🛑 STOP Immediately If You See Any of These!'}
            </h4>
            <p className="text-xs sm:text-sm text-red-800">
              {isKn ? 'ದಕ್ಷಿಣ ಕನ್ನಡದಲ್ಲಿ ಈ ೪ ಗಂಭೀರ ಕಾನೂನು ಸಮಸ್ಯೆಗಳಿದ್ದಾಗ ಮುಂಗಡ ಹಣ ನೀಡಬೇಡಿ' : 'Do not pay advance or proceed without resolving these critical issues'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-1">
          {LEGAL_INSTRUCTIONS.red_flags.map((flag) => (
            <div
              key={flag.id}
              className="p-4 rounded-xl bg-white border border-red-200 shadow-2xs flex flex-col gap-1.5"
            >
              <span className="font-extrabold text-sm text-red-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-600" />
                {isKn ? flag.kannada_title : flag.title}
              </span>
              <p className="text-sm text-slate-700 leading-relaxed">
                {isKn ? flag.kannada_desc : flag.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Header & Bhoomi Search + Glossary Actions */}
      <div className="p-6 rounded-2xl bg-white border border-emerald-500/20 shadow-sm flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-800 mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{isKn ? 'ಕಂದಾಯ ಮತ್ತು ಪಹಣಿ ಪರಿಶೀಲನೆ' : 'Land Records Due Diligence'}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-['Space_Grotesk']">
              {isKn ? 'ಜಮೀನು ಖರೀದಿಸುವ ಮುನ್ನ ಮಾಡಬೇಕಾದ ಪರಿಶೀಲನೆಗಳು' : 'If You Are Buying Land — Statutory Checklist'}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {isKn
                ? 'ದಕ್ಷಿಣ ಕನ್ನಡದ ೭ ತಾಲೂಕುಗಳಲ್ಲಿ ಕೃಷಿ ಜಮೀನಿನ ಮಾಲೀಕತ್ವ ಹಾಗೂ ಋಣಭಾರ ಪರಿಶೀಲಿಸುವ ಅಧಿಕೃತ ಮಾರ್ಗದರ್ಶಿ.'
                : 'Mandatory statutory due diligence checks before acquiring agricultural land across Dakshina Kannada.'}
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            {/* Glossary Button */}
            <button
              type="button"
              onClick={() => setIsGlossaryOpen(true)}
              className="btn-secondary min-h-[44px] px-4 text-sm font-bold flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-emerald-700" />
              <span>{isKn ? 'ಕಂದಾಯ ಪದಕೋಶ (Glossary)' : 'Revenue Glossary'}</span>
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-xs">
                {LEGAL_INSTRUCTIONS.glossary.length}
              </span>
            </button>
          </div>
        </div>

        {/* Survey Number + Village Bhoomi Portal Helper */}
        <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <Search className="w-4 h-4 text-emerald-600" />
            <span>{isKn ? 'ಭೂಮಿ ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ನಿಮ್ಮ ಸರ್ವೇ ನಂಬರ್ ಪರಿಶೀಲಿಸಿ' : 'Direct Bhoomi Portal RTC Lookup Helper'}</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600">
            {isKn
              ? 'ಸರ್ವೇ ನಂಬರ್ ಹಾಗೂ ಗ್ರಾಮದ ಹೆಸರು ನಮೂದಿಸಿ ನೇರವಾಗಿ ಕರ್ನಾಟಕ ಸರ್ಕಾರದ ಭೂಮಿ ಪೋರ್ಟಲ್ ತೆರೆಯಿರಿ.'
              : 'Enter survey details to inspect the authentic government RTC on the Bhoomi portal.'}
          </p>

          <form onSubmit={handleOpenBhoomi} className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-1">
            <div>
              <label htmlFor="bhoomi_village" className="text-xs font-semibold text-slate-600 block mb-1">
                {isKn ? 'ಗ್ರಾಮದ ಹೆಸರು' : 'Village Name'}
              </label>
              <input
                id="bhoomi_village"
                type="text"
                placeholder={isKn ? 'ಉದಾ: ಪುತ್ತೂರು / ಉಜಿರೆ' : 'e.g., Puttur / Ujire'}
                value={villageName}
                onChange={(e) => setVillageName(e.target.value)}
                className="input text-sm w-full"
              />
            </div>

            <div>
              <label htmlFor="bhoomi_survey" className="text-xs font-semibold text-slate-600 block mb-1">
                {isKn ? 'ಸರ್ವೇ ನಂಬರ್' : 'Survey Number'}
              </label>
              <input
                id="bhoomi_survey"
                type="text"
                placeholder="e.g., 142"
                value={surveyNo}
                onChange={(e) => setSurveyNo(e.target.value)}
                className="input text-sm w-full font-sans"
              />
            </div>

            <div>
              <label htmlFor="bhoomi_hissa" className="text-xs font-semibold text-slate-600 block mb-1">
                {isKn ? 'ಹಿಸ್ಸಾ / ಪೋಡಿ' : 'Hissa / Podi'}
              </label>
              <input
                id="bhoomi_hissa"
                type="text"
                placeholder="* or 1A"
                value={hissaNo}
                onChange={(e) => setHissaNo(e.target.value)}
                className="input text-sm w-full font-sans"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="btn-primary min-h-[44px] w-full text-sm font-bold flex items-center justify-center gap-2"
              >
                <span>{isKn ? 'ಭೂಮಿ ತೆರೆಯಿರಿ' : 'Open Bhoomi'}</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </form>

          <div className="text-xs text-slate-500 pt-2 border-t border-slate-200/60 flex items-center gap-1.5">
            <span className="font-semibold">{isKn ? 'ಹಂತಗಳು:' : 'Quick steps:'}</span>
            <span>{isKn ? 'ಜಿಲ್ಲೆ: ದಕ್ಷಿಣ ಕನ್ನಡ ➔ ತಾಲೂಕು ➔ ಹೋಬಳಿ ➔ ಗ್ರಾಮ ➔ ಸರ್ವೇ ನಂಬರ್ ಆಯ್ಕೆಮಾಡಿ.' : 'Select Dakshina Kannada ➔ Taluk ➔ Hobli ➔ Village ➔ Survey Number.'}</span>
          </div>
        </div>

        {/* Global Progress Indicator */}
        <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 flex flex-col gap-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-bold text-emerald-950 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              {isKn ? 'ಖರೀದಿ ಪೂರ್ವ ಕಾನೂನು ಪರಿಶೀಲನಾ ಪ್ರಗತಿ' : 'Pre-Purchase Due Diligence Progress'}
            </span>
            <span className="font-extrabold text-emerald-900">
              {isKn
                ? `${allPoints.length} ರಲ್ಲಿ ${verifiedCount} ದಾಖಲೆಗಳು ಪರಿಶೀಲಿಸಲಾಗಿದೆ`
                : `${verifiedCount} of ${allPoints.length} points verified`}
            </span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-emerald-100 overflow-hidden">
            <div
              className="h-full bg-emerald-600 rounded-full transition-all duration-300"
              style={{ width: `${verifiedPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 4. The 4 Main Statutory Verification Sections with ChecklistItems */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {sectionsList.map((sec, sIdx) => (
          <div
            key={sec.id}
            className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between"
          >
            <div>
              {/* Section Header */}
              <div className="pb-3 border-b border-slate-100 mb-4 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
                    {sIdx + 1}
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-bold text-slate-900 font-['Space_Grotesk']">
                      {isKn ? sec.kannada_title : sec.title}
                    </h4>
                    <span className="text-xs text-emerald-800 font-semibold mt-0.5 block">
                      {sec.statute}
                    </span>
                  </div>
                </div>
              </div>

              {/* Checklist Items for this section */}
              <div className="space-y-3.5">
                {sec.points.map((pt) => {
                  const isChecked = !!checkedPoints[pt.id];
                  return (
                    <ChecklistItem
                      key={pt.id}
                      id={pt.id}
                      title={isKn ? pt.kannada_head : pt.head}
                      desc={isKn ? pt.kannada_text : pt.text}
                      whereToGet={pt.whereToGet}
                      costOrTime={pt.costOrTime}
                      isChecked={isChecked}
                      onToggle={() => togglePoint(pt.id)}
                      lang={lang}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 5. "Already Own Land?" Section Checklist */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-emerald-500/20 shadow-sm flex flex-col gap-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-emerald-600" />
            <h4 className="text-base sm:text-lg font-bold text-slate-900 font-['Space_Grotesk']">
              {isKn ? '🏡 ಈಗಾಗಲೇ ಜಮೀನು ಹೊಂದಿದ್ದೀರಾ? (Already Own Land?)' : '🏡 Already Own Land? Essential Farmer Checklist'}
            </h4>
          </div>
          <span className="text-xs text-slate-500">
            {isKn ? 'ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು ಮತ್ತು ದಾಖಲೆಗಳು' : 'Govt Schemes & Welfare'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {LEGAL_INSTRUCTIONS.already_own_checklist.map((item) => {
            const isChecked = !!checkedOwnItems[item.id];
            return (
              <ChecklistItem
                key={item.id}
                id={item.id}
                title={isKn ? item.kannada_title : item.title}
                desc={isKn ? item.kannada_desc : item.desc}
                whereToGet={{ label: item.label, kannada_label: item.label, url: item.url }}
                isChecked={isChecked}
                onToggle={() => toggleOwnItem(item.id)}
                lang={lang}
              />
            );
          })}
        </div>
      </div>

      {/* 6. Caution Alert Callout with Parity Fix */}
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-300 flex items-start gap-3.5 text-sm text-amber-950">
        <AlertOctagon className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-extrabold text-base block text-amber-900">
            {isKn ? 'ರೈತರಿಗೆ ಅತಿ ಪ್ರಮುಖ ಶಾಸನಬದ್ಧ ಎಚ್ಚರಿಕೆ:' : 'Critical Statutory Advisory for Land Buyers:'}
          </span>
          <p className="text-slate-800 leading-relaxed">
            {isKn ? LEGAL_INSTRUCTIONS.final_warning.kn : LEGAL_INSTRUCTIONS.final_warning.en}
          </p>
        </div>
      </div>

      {/* 7. Interactive Glossary Modal */}
      <GlossaryModal
        isOpen={isGlossaryOpen}
        onClose={() => setIsGlossaryOpen(false)}
        isKn={isKn}
      />
    </div>
  );
}
