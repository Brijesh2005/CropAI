import React, { useState } from 'react';
import { Check, CheckCircle2, Clock, Volume2, VolumeX, FileText, IndianRupee, Calendar } from 'lucide-react';

export default function StepTimeline({
  steps = [],
  storageKey = 'default',
  lang = 'kn',
  title = null
}) {
  const isKn = lang === 'kn';

  // Persist completed steps in localStorage
  const storageId = `terravision_timeline_${storageKey}`;
  const [completedSteps, setCompletedSteps] = useState(() => {
    try {
      const saved = localStorage.getItem(storageId);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Track speech synthesis
  const [speakingIndex, setSpeakingIndex] = useState(null);
  const [speechSupported] = useState(() => typeof window !== 'undefined' && 'speechSynthesis' in window);

  // Save changes to localStorage
  const toggleStepDone = (idx) => {
    setCompletedSteps((prev) => {
      const updated = { ...prev, [idx]: !prev[idx] };
      try {
        localStorage.setItem(storageId, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to save step progress:', e);
      }
      return updated;
    });
  };

  // Speech synthesis play/stop
  const handleToggleSpeech = (step, idx) => {
    if (!speechSupported) return;

    if (speakingIndex === idx) {
      window.speechSynthesis.cancel();
      setSpeakingIndex(null);
      return;
    }

    window.speechSynthesis.cancel();

    const titleText = isKn ? (step.kannada_title || step.title) : step.title;
    const actionText = isKn ? (step.kannada_action || step.action || '') : (step.action || '');
    const descText = isKn ? (step.kannada_desc || step.desc) : step.desc;

    const fullUtterance = `${titleText}. ${actionText}. ${descText}`;
    const utterance = new SpeechSynthesisUtterance(fullUtterance);
    utterance.lang = isKn ? 'kn-IN' : 'en-IN';
    utterance.rate = 0.92;

    utterance.onend = () => setSpeakingIndex(null);
    utterance.onerror = () => setSpeakingIndex(null);

    window.speechSynthesis.speak(utterance);
    setSpeakingIndex(idx);
  };

  const totalSteps = steps.length;
  const completedCount = steps.filter((_, idx) => !!completedSteps[idx]).length;
  const progressPercent = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

  return (
    <div className="w-full flex flex-col gap-6 text-left">
      {/* Header & Progress Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-emerald-500/20 shadow-sm flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          {title && (
            <h4 className="text-base sm:text-lg font-bold text-slate-900 font-['Space_Grotesk']">
              {title}
            </h4>
          )}
          <div className="flex items-center gap-2 text-sm font-semibold text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>
              {isKn
                ? `${totalSteps} ರಲ್ಲಿ ${completedCount} ಹಂತಗಳು ಪೂರ್ಣಗೊಂಡಿವೆ`
                : `${completedCount} of ${totalSteps} steps completed`}
            </span>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full bg-emerald-600 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Vertical Stepper List */}
      <div className="relative flex flex-col gap-6 pl-2 sm:pl-4">
        {/* Continuous Left Vertical Line */}
        <div className="absolute left-6 sm:left-8 top-6 bottom-6 w-0.5 bg-emerald-200" />

        {steps.map((step, idx) => {
          const isDone = !!completedSteps[idx];
          const isSpeaking = speakingIndex === idx;
          const stepNum = step.step || idx + 1;
          const stepTitle = isKn ? (step.kannada_title || step.title) : step.title;
          const stepWhen = isKn ? (step.kannada_when || step.when) : step.when;
          const stepAction = isKn ? (step.kannada_action || step.action) : step.action;
          const stepDesc = isKn ? (step.kannada_desc || step.desc) : step.desc;

          return (
            <div key={idx} className="relative flex items-start gap-4 sm:gap-6 z-10">
              {/* Step Circle Marker */}
              <button
                type="button"
                onClick={() => toggleStepDone(idx)}
                aria-label={`Mark step ${stepNum} done`}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full shrink-0 flex items-center justify-center font-bold text-sm transition-all cursor-pointer shadow-sm min-h-[44px] min-w-[44px] ${
                  isDone
                    ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                    : 'bg-white text-emerald-700 border-2 border-emerald-500 hover:bg-emerald-50'
                }`}
              >
                {isDone ? <Check className="w-5 h-5 stroke-[2.5]" /> : stepNum}
              </button>

              {/* Step Card Content */}
              <div
                className={`flex-1 p-5 sm:p-6 rounded-2xl bg-white border transition-all shadow-sm ${
                  isDone
                    ? 'border-emerald-300/80 bg-emerald-50/20'
                    : 'border-slate-200 hover:border-emerald-300'
                }`}
              >
                {/* Header row: Title + When Tag + Listen Button */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-emerald-100/80 text-emerald-800">
                      {isKn ? `ಹಂತ ${stepNum}` : `Step ${stepNum}`}
                    </span>
                    <h5 className="text-base sm:text-lg font-bold text-slate-900 font-['Space_Grotesk']">
                      {stepTitle}
                    </h5>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* "When" / Timing Tag */}
                    {stepWhen && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold">
                        <Clock className="w-3.5 h-3.5 text-amber-700" />
                        <span>{stepWhen}</span>
                      </span>
                    )}

                    {/* Listen Button using speech synthesis */}
                    {speechSupported && (
                      <button
                        type="button"
                        onClick={() => handleToggleSpeech(step, idx)}
                        aria-label={isSpeaking ? 'Stop listening' : 'Listen to step instructions'}
                        title={isSpeaking ? (isKn ? 'ನಿಲ್ಲಿಸಿ' : 'Stop') : (isKn ? 'ಧ್ವನಿ ಮೂಲಕ ಆಲಿಸಿ' : 'Listen to audio')}
                        className={`min-h-[44px] px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
                          isSpeaking
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {isSpeaking ? (
                          <>
                            <VolumeX className="w-4 h-4" />
                            <span>{isKn ? 'ನಿಲ್ಲಿಸಿ' : 'Stop'}</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-4 h-4 text-emerald-600" />
                            <span>{isKn ? 'ಆಲಿಸಿ' : 'Listen'}</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Bold Action Line */}
                {stepAction && (
                  <div className="my-3 p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-emerald-950 font-bold text-sm sm:text-base leading-snug flex items-center gap-2">
                    <span className="text-emerald-700">➔</span>
                    <span>{stepAction}</span>
                  </div>
                )}

                {/* Step Description */}
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed mt-2.5">
                  {stepDesc}
                </p>

                {/* Optional Key-Facts Table (spacing, pit size, NPK, water, etc.) */}
                {step.key_facts && step.key_facts.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      {isKn ? 'ಪ್ರಮುಖ ಅಂಕಿಅಂಶಗಳು / ಅಳತೆಗಳು' : 'Key Specifications'}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                      {step.key_facts.map((fact, fIdx) => (
                        <div
                          key={fIdx}
                          className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-center"
                        >
                          <span className="text-xs text-slate-500 font-medium">
                            {isKn ? (fact.kannada_label || fact.label) : fact.label}
                          </span>
                          <span className="text-sm font-bold text-slate-900 mt-0.5">
                            {isKn ? (fact.kannada_value || fact.value) : fact.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Optional Buying Workflow Specific Facts (Duration, Cost, Documents) */}
                {(step.duration || step.cost || step.documents) && (
                  <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {step.duration && (
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2">
                        <Calendar className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-xs text-slate-500 block">
                            {isKn ? 'ಅಂದಾಜು ಅವಧಿ' : 'Est. Duration'}
                          </span>
                          <span className="text-sm font-bold text-slate-800">
                            {isKn ? (step.kannada_duration || step.duration) : step.duration}
                          </span>
                        </div>
                      </div>
                    )}

                    {step.cost && (
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2">
                        <IndianRupee className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-xs text-slate-500 block">
                            {isKn ? 'ಅಂದಾಜು ಶುಲ್ಕ/ವೆಚ್ಚ' : 'Est. Cost/Fee'}
                          </span>
                          <span className="text-sm font-bold text-slate-800">
                            {isKn ? (step.kannada_cost || step.cost) : step.cost}
                          </span>
                        </div>
                      </div>
                    )}

                    {step.documents && (
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2">
                        <FileText className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-xs text-slate-500 block">
                            {isKn ? 'ಕಡ್ಡಾಯ ದಾಖಲೆಗಳು' : 'Key Documents'}
                          </span>
                          <span className="text-sm font-bold text-slate-800">
                            {isKn ? (step.kannada_documents || step.documents) : step.documents}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Bottom Row: Done Checkbox Toggle */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <label className="flex items-center gap-3 cursor-pointer min-h-[44px] py-1 select-none">
                    <input
                      type="checkbox"
                      checked={isDone}
                      onChange={() => toggleStepDone(idx)}
                      className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 cursor-pointer"
                    />
                    <span className={`text-sm font-bold ${isDone ? 'text-emerald-800' : 'text-slate-700'}`}>
                      {isDone
                        ? (isKn ? '✓ ಈ ಹಂತ ಪೂರ್ಣಗೊಂಡಿದೆ' : '✓ Completed')
                        : (isKn ? 'ಈ ಹಂತ ಮುಗಿದಿದೆ ಎಂದು ಗುರುತಿಸಿ' : 'Mark as done')}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
