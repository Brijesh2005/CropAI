import React, { useState, useEffect } from 'react';
import { 
  BUYING_WORKFLOW, 
  OFFICIAL_CONTACTS_DIRECTORY, 
  REGIONAL_DATA 
} from '../data/agriculturalData';
import { 
  ShoppingCart, 
  PhoneCall, 
  Building2, 
  Copy, 
  Check, 
  Mail, 
  Clock 
} from 'lucide-react';
import { useLang } from '../i18n/LanguageContext';
import StepTimeline from './guide/StepTimeline';

export default function LandBuyingGuide({ selectedTaluk = 'Puttur' }) {
  const { lang } = useLang();
  const isKn = lang === 'kn';

  // Normalize initial taluk
  const talukKeys = Object.keys(REGIONAL_DATA);
  const findMatchingKey = (input) => {
    if (!input) return 'Puttur';
    const clean = input.toLowerCase();
    return talukKeys.find((k) => clean.includes(k.toLowerCase()) || k.toLowerCase().includes(clean)) || 'Puttur';
  };

  const [activeTaluk, setActiveTaluk] = useState(() => findMatchingKey(selectedTaluk));
  const [copiedPhone, setCopiedPhone] = useState(null);

  useEffect(() => {
    if (selectedTaluk) {
      queueMicrotask(() => {
        setActiveTaluk(findMatchingKey(selectedTaluk));
      });
    }
  }, [selectedTaluk]);

  const region = REGIONAL_DATA[activeTaluk] || REGIONAL_DATA['Puttur'];

  const handleCopyPhone = (phone) => {
    if (!phone) return;
    try {
      navigator.clipboard.writeText(phone);
      setCopiedPhone(phone);
      setTimeout(() => setCopiedPhone(null), 2500);
    } catch (e) {
      console.warn('Clipboard copy failed:', e);
    }
  };

  return (
    <div className="w-full flex flex-col gap-8 text-left">
      {/* 1. Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-green-50 border border-emerald-300 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-emerald-800 mb-1">
            <ShoppingCart className="w-4 h-4 text-emerald-700" />
            <span>{isKn ? 'ಜಮೀನು ಖರೀದಿ ಮಾರ್ಗದರ್ಶಿ' : 'Agricultural Land Purchase Protocol'}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-['Space_Grotesk']">
            {isKn
              ? `${region.kannada_name} ಪ್ರದೇಶದಲ್ಲಿ ಜಮೀನು ಖರೀದಿಸುವುದು ಹೇಗೆ?`
              : `How to Buy Land in ${region.name} Sector`}
          </h3>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            {isKn
              ? 'ಕಾನೂನುಬದ್ಧವಾಗಿ ಕೃಷಿ ಭೂಮಿಯನ್ನು ಖರೀದಿಸುವ ಹಂತಗಳು ಹಾಗೂ ಸಂಪರ್ಕಿಸಬೇಕಾದ ಸ್ಥಳೀಯ ಅಧಿಕಾರಿಗಳ ಪೂರ್ಣ ವಿವರ.'
              : 'Complete 5-stage legal acquisition workflow and official authority contacts in Dakshina Kannada.'}
          </p>
        </div>

        {/* Quick Kisan Call Center Helpline Pill */}
        <div className="p-3.5 rounded-xl bg-white border border-emerald-300 shadow-2xs self-start sm:self-auto text-sm">
          <p className="text-slate-500 font-medium text-xs">
            {isKn ? 'ಕಿಸಾನ್ ಕಾಲ್ ಸೆಂಟರ್ (ಉಚಿತ ಸಹಾಯವಾಣಿ):' : 'Kisan Call Center Helpline:'}
          </p>
          <a
            href="tel:18001801551"
            className="text-base font-extrabold text-emerald-700 hover:underline flex items-center gap-1.5 mt-0.5"
          >
            <PhoneCall className="w-4 h-4" />
            <span>1800-180-1551</span>
          </a>
        </div>
      </div>

      {/* 2. Step-by-Step Purchase Workflow using StepTimeline */}
      <div className="flex flex-col gap-4">
        <StepTimeline
          steps={BUYING_WORKFLOW}
          storageKey={`buying_${activeTaluk}`}
          lang={lang}
          title={isKn ? '📋 ೫ ಹಂತಗಳ ಕೃಷಿ ಜಮೀನು ಖರೀದಿ ಪ್ರಕ್ರಿಯೆ' : '📋 5-Stage Step-by-Step Land Buying Process'}
        />
      </div>

      {/* 3. Dedicated Taluk Authority Contacts Section with Dropdown */}
      <div className="rounded-2xl bg-white border border-emerald-500/20 p-6 shadow-sm flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-800 mb-1">
              <Building2 className="w-4 h-4 text-emerald-600" />
              <span>{isKn ? 'ತಾಲೂಕು ಕಚೇರಿಗಳ ನೇರ ಸಂಪರ್ಕ' : 'Local Taluk Authority Directory'}</span>
            </div>
            <h4 className="text-lg sm:text-xl font-bold text-slate-900 font-['Space_Grotesk']">
              {isKn
                ? `${region.kannada_name} ತಾಲೂಕಿನ ಅಧಿಕೃತ ಕಚೇರಿಗಳು`
                : `Official Authority Offices in ${region.name} Taluk`}
            </h4>
          </div>

          {/* Taluk Selector Dropdown */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <label htmlFor="taluk_select" className="text-xs font-bold text-slate-600">
              {isKn ? 'ತಾಲೂಕು ಬದಲಾಯಿಸಿ:' : 'Select Taluk:'}
            </label>
            <select
              id="taluk_select"
              value={activeTaluk}
              onChange={(e) => setActiveTaluk(e.target.value)}
              className="input text-sm min-h-[44px] px-3.5 py-1.5 font-bold text-emerald-900 bg-emerald-50/50 border-emerald-300"
            >
              {talukKeys.map((k) => (
                <option key={k} value={k}>
                  {isKn ? REGIONAL_DATA[k].kannada_name : REGIONAL_DATA[k].name} Taluk
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 3 Direct Local Offices Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Tahsildar */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-md inline-block mb-2">
                {isKn ? 'ಕಂದಾಯ & ಪಹಣಿ' : 'Land Revenue & RTC'}
              </span>
              <h5 className="text-base font-bold text-slate-900">
                {isKn ? 'ತಹಶೀಲ್ದಾರ್ ಕಚೇರಿ' : 'Tahsildar & Taluk Office'}
              </h5>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                {isKn ? (region.kannada_tahsildar_office || region.tahsildar_office) : region.tahsildar_office}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
              <a
                href={`tel:${region.tahsildar_phone}`}
                className="btn-primary min-h-[44px] px-3.5 text-xs font-bold flex items-center gap-1.5 flex-1 justify-center"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>{region.tahsildar_phone}</span>
              </a>

              <button
                type="button"
                onClick={() => handleCopyPhone(region.tahsildar_phone)}
                title="Copy phone"
                className="btn-secondary min-h-[44px] min-w-[44px] p-2 flex items-center justify-center cursor-pointer"
                aria-label="Copy phone"
              >
                {copiedPhone === region.tahsildar_phone ? (
                  <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                ) : (
                  <Copy className="w-4 h-4 text-slate-600" />
                )}
              </button>
            </div>
          </div>

          {/* Card 2: Sub-Registrar */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-blue-800 bg-blue-100/80 px-2.5 py-1 rounded-md inline-block mb-2">
                {isKn ? 'ನೋಂದಣಿ & ಇಸಿ' : 'Registration & EC'}
              </span>
              <h5 className="text-base font-bold text-slate-900">
                {isKn ? 'ಉಪ ನೋಂದಣಾಧಿಕಾರಿ ಕಚೇರಿ' : 'Sub-Registrar Office'}
              </h5>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                {isKn ? (region.kannada_sub_registrar_office || region.sub_registrar_office) : region.sub_registrar_office}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
              <a
                href={`tel:${region.sub_registrar_phone}`}
                className="btn-primary min-h-[44px] px-3.5 text-xs font-bold flex items-center gap-1.5 flex-1 justify-center"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>{region.sub_registrar_phone}</span>
              </a>

              <button
                type="button"
                onClick={() => handleCopyPhone(region.sub_registrar_phone)}
                title="Copy phone"
                className="btn-secondary min-h-[44px] min-w-[44px] p-2 flex items-center justify-center cursor-pointer"
                aria-label="Copy phone"
              >
                {copiedPhone === region.sub_registrar_phone ? (
                  <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                ) : (
                  <Copy className="w-4 h-4 text-slate-600" />
                )}
              </button>
            </div>
          </div>

          {/* Card 3: RSK */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-md inline-block mb-2">
                {isKn ? 'ಕೃಷಿ & ಸಸಿಗಳು' : 'Seeds & Agronomy'}
              </span>
              <h5 className="text-base font-bold text-slate-900">
                {isKn ? 'ರೈತ ಸಂಪರ್ಕ ಕೇಂದ್ರ (RSK)' : 'Raitha Samparka Kendra'}
              </h5>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                {isKn ? (region.kannada_rsk_office || region.rsk_office) : region.rsk_office}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
              <a
                href={`tel:${region.rsk_phone}`}
                className="btn-primary min-h-[44px] px-3.5 text-xs font-bold flex items-center gap-1.5 flex-1 justify-center"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>{region.rsk_phone}</span>
              </a>

              <button
                type="button"
                onClick={() => handleCopyPhone(region.rsk_phone)}
                title="Copy phone"
                className="btn-secondary min-h-[44px] min-w-[44px] p-2 flex items-center justify-center cursor-pointer"
                aria-label="Copy phone"
              >
                {copiedPhone === region.rsk_phone ? (
                  <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                ) : (
                  <Copy className="w-4 h-4 text-slate-600" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Verification and Report Wrong Number Strip */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-600" />
            <span>
              {isKn
                ? `ಕೊನೆಯದಾಗಿ ಪರಿಶೀಲಿಸಿದ್ದು: ${region.lastVerified || 'November 2026'}`
                : `Last verified: ${region.lastVerified || 'November 2026'}`}
            </span>
          </div>

          <a
            href={`mailto:support@cropai.org?subject=Report%20Wrong%20Phone%20Number%20-%20${region.name}%20Taluk`}
            className="inline-flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800 font-bold hover:underline"
          >
            <Mail className="w-4 h-4" />
            <span>{isKn ? 'ತಪ್ಪಾದ ಸಂಖ್ಯೆಯನ್ನು ವರದಿ ಮಾಡಿ' : 'Report a wrong number'}</span>
          </a>
        </div>
      </div>

      {/* 4. Statewide Helplines Directory */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col gap-4">
        <h4 className="text-base sm:text-lg font-bold text-slate-900 font-['Space_Grotesk'] flex items-center gap-2">
          <span>{isKn ? '📞 ಸರ್ಕಾರಿ ರೈತ ಸಹಾಯವಾಣಿಗಳು' : '📞 Statewide Agriculture Helplines'}</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {OFFICIAL_CONTACTS_DIRECTORY[3]?.offices?.map((off, oIdx) => (
            <div
              key={oIdx}
              className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-2.5"
            >
              <div>
                <span className="text-xs text-slate-500 block mb-0.5">
                  {isKn ? off.kannada_taluk : off.taluk}
                </span>
                <span className="text-sm font-bold text-slate-900 leading-snug block">
                  {isKn ? off.kannada_name : off.name}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200">
                <a
                  href={`tel:${off.phone}`}
                  className="font-extrabold text-xs text-emerald-700 hover:underline flex items-center gap-1.5"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>{off.phone}</span>
                </a>

                <button
                  type="button"
                  onClick={() => handleCopyPhone(off.phone)}
                  title="Copy phone"
                  className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                  aria-label="Copy phone"
                >
                  {copiedPhone === off.phone ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
