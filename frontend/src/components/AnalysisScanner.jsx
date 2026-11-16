import React, { useState, useEffect } from 'react';
import { CheckCircle2, Loader2, MapPin } from 'lucide-react';

const FRIENDLY_STEPS = [
  { id: 'loc', title: 'Finding your location', knTitle: 'ನಿಮ್ಮ ಸ್ಥಳವನ್ನು ಗುರುತಿಸಲಾಗುತ್ತಿದೆ' },
  { id: 'sat', title: 'Reading satellite images', knTitle: 'ಉಪಗ್ರಹ ಚಿತ್ರಗಳನ್ನು ಓದಲಾಗುತ್ತಿದೆ' },
  { id: 'env', title: 'Checking soil and weather', knTitle: 'ಮಣ್ಣು ಮತ್ತು ಹವಾಮಾನ ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ' },
  { id: 'crp', title: 'Choosing the best crop', knTitle: 'ಅತ್ಯುತ್ತಮ ಬೆಳೆಯನ್ನು ಆರಿಸಲಾಗುತ್ತಿದೆ' },
  { id: 'yld', title: 'Calculating your yield', knTitle: 'ನಿರೀಕ್ಷಿತ ಇಳುವರಿಯನ್ನು ಲೆಕ್ಕಹಾಕಲಾಗುತ್ತಿದೆ' }
];

export default function AnalysisScanner({ locationInfo, onScanComplete }) {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    // Step progression timer
    const stepInterval = setInterval(() => {
      setCurrentStepIdx((prev) => {
        if (prev < FRIENDLY_STEPS.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 550);

    // Continuous progress bar
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => {
            if (onScanComplete) onScanComplete();
          }, 350);
          return 100;
        }
        return prev + 5;
      });
    }, 140);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, [onScanComplete]);

  return (
    <div className="w-full max-w-xl mx-auto py-8 px-4 text-left">
      <div className="card p-6 sm:p-8 border-emerald-200 shadow-md bg-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              <span>Analyzing your farm</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-['Space_Grotesk']">
              Checking farm conditions
            </h3>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-emerald-700 font-['Space_Grotesk']">
              {progress}%
            </span>
          </div>
        </div>

        {/* Selected Location Pill */}
        {locationInfo?.place_name && (
          <div className="mt-4 flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
            <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="truncate font-medium">{locationInfo.place_name}</span>
            {locationInfo.taluk && (
              <span className="ml-auto text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0">
                {locationInfo.taluk}
              </span>
            )}
          </div>
        )}

        {/* Horizontal Progress Bar */}
        <div className="mt-6 mb-6">
          <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden p-0.5 border border-slate-200">
            <div
              className="h-full rounded-full bg-emerald-600 transition-all duration-200 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Vertical Checklist of 5 Friendly Steps */}
        <div className="space-y-3">
          {FRIENDLY_STEPS.map((step, idx) => {
            const isCompleted = idx < currentStepIdx || progress === 100;
            const isCurrent = idx === currentStepIdx && progress < 100;

            return (
              <div
                key={step.id}
                className={`p-3.5 rounded-xl border transition-all flex items-center gap-3.5 ${
                  isCurrent
                    ? 'bg-emerald-50/80 border-emerald-300 shadow-xs'
                    : isCompleted
                    ? 'bg-white border-slate-100 text-slate-700'
                    : 'bg-slate-50/50 border-slate-100 text-slate-400 opacity-60'
                }`}
              >
                <div className="shrink-0">
                  {isCompleted ? (
                    <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    </div>
                  ) : isCurrent ? (
                    <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className={`text-sm font-bold ${isCurrent ? 'text-emerald-900' : isCompleted ? 'text-slate-800' : 'text-slate-500'}`}>
                    {step.title}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {step.knTitle}
                  </div>
                </div>

                {isCurrent && (
                  <span className="text-xs font-bold text-emerald-800 bg-white px-2 py-0.5 rounded-full border border-emerald-200 shadow-2xs">
                    In progress
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
