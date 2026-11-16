import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const showToast = (message, type = 'info') => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('app-toast', {
        detail: { id: Date.now() + Math.random(), message, type }
      })
    );
  }
};

export const toast = {
  success: (msg) => showToast(msg, 'success'),
  error: (msg) => showToast(msg, 'error'),
  info: (msg) => showToast(msg, 'info'),
  warning: (msg) => showToast(msg, 'warning')
};

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleToastEvent = (e) => {
      const newToast = e.detail;
      setToasts((prev) => [...prev, newToast]);

      // Auto dismiss after 4 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, 4000);
    };

    window.addEventListener('app-toast', handleToastEvent);
    return () => window.removeEventListener('app-toast', handleToastEvent);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => {
        const isError = t.type === 'error';
        const isSuccess = t.type === 'success';
        const isWarning = t.type === 'warning';

        return (
          <div
            key={t.id}
            role="status"
            className={`pointer-events-auto flex items-start gap-2.5 p-3.5 rounded-xl border shadow-lg backdrop-blur-md transition-all text-xs text-left animate-fade-in ${
              isError
                ? 'bg-red-50 border-red-200 text-red-800'
                : isSuccess
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : isWarning
                ? 'bg-amber-50 border-amber-200 text-amber-800'
                : 'bg-white border-slate-200 text-slate-800'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {isError ? (
                <AlertCircle className="w-4 h-4 text-red-600" />
              ) : isSuccess ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : isWarning ? (
                <AlertCircle className="w-4 h-4 text-amber-600" />
              ) : (
                <Info className="w-4 h-4 text-emerald-600" />
              )}
            </div>
            <div className="flex-1 font-medium leading-relaxed">
              {t.message}
            </div>
            <button
              onClick={() => setToasts((prev) => prev.filter((item) => item.id !== t.id))}
              aria-label="Dismiss notification"
              className="p-1 text-slate-400 hover:text-slate-700 transition-colors shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
