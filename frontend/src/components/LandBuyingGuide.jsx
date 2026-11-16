import React from 'react';
import { BUYING_WORKFLOW, OFFICIAL_CONTACTS_DIRECTORY, REGIONAL_DATA } from '../data/agriculturalData';
import { ShoppingCart, PhoneCall, Building2, Users, CheckCircle2, ExternalLink } from 'lucide-react';

export default function LandBuyingGuide({ selectedTaluk = 'Puttur', language = 'kn' }) {
  // Normalize taluk name
  let matchedKey = 'Puttur';
  const cleanTaluk = (selectedTaluk || '').toLowerCase();
  for (const k of Object.keys(REGIONAL_DATA)) {
    if (cleanTaluk.includes(k.toLowerCase()) || k.toLowerCase().includes(cleanTaluk)) {
      matchedKey = k;
      break;
    }
  }

  const region = REGIONAL_DATA[matchedKey] || REGIONAL_DATA['Puttur'];

  return (
    <div className="w-full flex flex-col gap-8 text-left">
      {/* 1. Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-green-50 border border-emerald-300 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
            <ShoppingCart className="w-4 h-4 text-emerald-700" />
            <span>{language === 'kn' ? 'ಜಮೀನು ಖರೀದಿ ಮಾರ್ಗದರ್ಶಿ' : 'Agricultural Land Purchase Protocol'}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-['Space_Grotesk']">
            {language === 'kn'
              ? `${region.kannada_name} ಪ್ರದೇಶದಲ್ಲಿ ಜಮೀನು ಖರೀದಿಸುವುದು ಹೇಗೆ?`
              : `How to Buy Land in ${region.name} Sector`}
          </h3>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            {language === 'kn'
              ? 'ಕಾನೂನುಬದ್ಧವಾಗಿ ಕೃಷಿ ಭೂಮಿಯನ್ನು ಖರೀದಿಸುವ ಹಂತಗಳು ಹಾಗೂ ಸಂಪರ್ಕಿಸಬೇಕಾದ ಸ್ಥಳೀಯ ಅಧಿಕಾರಿಗಳ ಪೂರ್ಣ ವಿವರ.'
              : 'Complete 5-stage legal acquisition workflow and official authority contacts in Dakshina Kannada.'}
          </p>
        </div>

        {/* Quick Help Pill */}
        <div className="p-3 rounded-xl bg-white border border-emerald-300/80 shadow-2xs self-start sm:self-auto text-xs">
          <p className="text-slate-500 font-medium">
            {language === 'kn' ? 'ಕಿಸಾನ್ ಕಾಲ್ ಸೆಂಟರ್ (ಉಚಿತ ಸಹಾಯವಾಣಿ):' : 'Kisan Call Center Helpline:'}
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

      {/* 2. Step-by-Step Purchase Workflow */}
      <div className="flex flex-col gap-4">
        <h4 className="text-lg font-bold text-slate-900 font-['Space_Grotesk'] flex items-center gap-2">
          <span>{language === 'kn' ? '📋 ೫ ಹಂತಗಳ ಖರೀದಿ ಪ್ರಕ್ರಿಯೆ' : '📋 5-Stage Step-by-Step Buying Process'}</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {BUYING_WORKFLOW.map((wf, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500/50 shadow-sm flex flex-col justify-between"
            >
              <div>
                <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 mb-2">
                  {wf.badge}
                </span>
                <h5 className="text-xs sm:text-sm font-bold text-slate-900 mb-1.5 leading-snug">
                  {language === 'kn' ? wf.kannada_title : wf.title}
                </h5>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {language === 'kn' ? wf.kannada_desc : wf.desc}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center text-[10px] font-semibold text-emerald-700">
                <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                <span>{language === 'kn' ? 'ಕಡ್ಡಾಯ ಹಂತ' : 'Required Step'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Selected Taluk Dedicated Authority Contacts */}
      <div className="rounded-2xl bg-white border border-emerald-500/20 p-6 shadow-sm flex flex-col gap-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h4 className="text-base sm:text-lg font-bold text-slate-900 font-['Space_Grotesk'] flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-600" />
              <span>
                {language === 'kn'
                  ? `${region.kannada_name} ತಾಲೂಕಿನ ಅಧಿಕೃತ ಕಚೇರಿಗಳ ನೇರ ಸಂಪರ್ಕ`
                  : `Direct Official Authority Contacts in ${region.name} Taluk`}
              </span>
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              {language === 'kn'
                ? 'ಈ ಜಮೀನಿನ ನೋಂದಣಿ, ಪಹಣಿ ಬದಲಾವಣೆ ಹಾಗೂ ಕೃಷಿ ಸಹಾಯಧನಕ್ಕಾಗಿ ಸಂಪರ್ಕಿಸಬೇಕಾದ ಕಚೇರಿಗಳು'
                : 'Key government administrative offices for land deeds, mutation, and agricultural subsidy support'}
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-800">
            {region.name} Sector
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          {/* Tahsildar */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <p className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-emerald-600" />
              <span>{language === 'kn' ? 'ತಹಶೀಲ್ದಾರ್ ಕಚೇರಿ (ಭೂ ಕಂದಾಯ):' : 'Tahsildar & Taluk Office:'}</span>
            </p>
            <p className="text-slate-600">{region.tahsildar_office}</p>
            <a
              href={`tel:${region.tahsildar_phone}`}
              className="inline-flex items-center gap-1.5 mt-2 font-bold text-emerald-700 hover:underline"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>{region.tahsildar_phone}</span>
            </a>
          </div>

          {/* Sub-Registrar */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <p className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>{language === 'kn' ? 'ಉಪ ನೋಂದಣಾಧಿಕಾರಿ ಕಚೇರಿ (ದಾಖಲೆ ನೋಂದಣಿ):' : 'Sub-Registrar (Deed Registration):'}</span>
            </p>
            <p className="text-slate-600">{region.sub_registrar}</p>
            <a
              href="https://kaverionline.karnataka.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-2 font-semibold text-blue-700 hover:underline text-[11px]"
            >
              <span>Kaveri 2.0 e-Registration</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* RSK Center */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <p className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-amber-600" />
              <span>{language === 'kn' ? 'ರೈತ ಸಂಪರ್ಕ ಕೇಂದ್ರ (RSK - ಕೃಷಿ ಇಲಾಖೆ):' : 'Raitha Samparka Kendra (Agri Dept):'}</span>
            </p>
            <p className="text-slate-600">{region.rsk_center}</p>
            <p className="text-[11px] text-emerald-700 font-semibold mt-2">
              {language === 'kn' ? 'ಉಚಿತ ಮಣ್ಣು ಪರೀಕ್ಷೆ & ಸಬ್ಸಿಡಿ ಸಸಿಗಳು' : 'Free soil testing & subsidized seeds'}
            </p>
          </div>
        </div>
      </div>

      {/* 4. General District-Wide Authority Directory */}
      <div className="flex flex-col gap-4">
        <h4 className="text-base font-bold text-slate-900 font-['Space_Grotesk']">
          {language === 'kn' ? '🏛️ ದಕ್ಷಿಣ ಕನ್ನಡ ಜಿಲ್ಲಾ ಮಟ್ಟದ ಸಂಪರ್ಕ ನಿರ್ದೇಶಿಕೆ' : '🏛️ District-Wide Authority Directory'}
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {OFFICIAL_CONTACTS_DIRECTORY.map((c, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-white border border-slate-200 text-xs flex flex-col justify-between"
            >
              <div>
                <p className="font-bold text-slate-900 text-sm mb-1">{c.role}</p>
                <p className="text-slate-600 mb-3">{language === 'kn' ? c.kannada_desc : c.desc}</p>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
                {c.office_pills.map((pill, pIdx) => (
                  <span
                    key={pIdx}
                    className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[10px] font-mono text-slate-700"
                  >
                    {pill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

