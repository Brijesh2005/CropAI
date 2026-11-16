import React, { useState } from 'react';
import { Sprout, Menu, X, LogOut, LogIn, Globe } from 'lucide-react';
import { useLang } from '../i18n/LanguageContext';

export default function Navbar({ activeTab, onTabChange, user, onOpenAuth, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { lang, setLang, t } = useLang();

  const navItems = [
    { id: 'dashboard', label: t('nav.home', 'Home') },
    { id: 'analyze', label: t('nav.check_farm', 'Check my farm') },
    { id: 'history', label: t('nav.history', 'History') },
    { id: 'models', label: t('nav.how_it_works', 'How it works') },
    { id: 'about', label: t('nav.about', 'About') }
  ];

  return (
    <nav aria-label="Main navigation" className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left">
      <div className="bg-white/95 border border-emerald-500/30 px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl shadow-md flex items-center justify-between transition-all backdrop-blur-xl">
        {/* Brand */}
        <button
          onClick={() => onTabChange('dashboard')}
          aria-label="Go to home"
          className="flex items-center gap-2.5 sm:gap-3 group text-left cursor-pointer focus:outline-none"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-600 text-white shadow-sm shadow-emerald-600/30 group-hover:bg-emerald-700 transition-all">
            <Sprout className="w-5 h-5 text-white group-hover:scale-105 transition-transform" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full" />
          </div>
          <div>
            <div className="text-base font-extrabold text-slate-900 font-['Space_Grotesk'] flex items-center gap-1.5">
              <span>{t('nav.brand', 'TerraVision')}</span>
              <span className="text-emerald-600 font-black">Farm</span>
            </div>
            <div className="text-xs text-emerald-800 font-medium truncate max-w-[150px] sm:max-w-none">
              {t('nav.brand_sub', 'Dakshina Kannada Smart Agri')}
            </div>
          </div>
        </button>

        {/* Desktop Nav Items */}
        <div className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`relative px-3.5 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'text-emerald-800 bg-emerald-50 shadow-2xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {item.label}
                {isActive && (
                  <div className="absolute bottom-1 left-3.5 right-3.5 h-[2px] bg-emerald-600 rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Right Side: Language Toggle & User Auth */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Prominent Global Kannada | English Toggle */}
          <div className="flex items-center p-0.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold" role="group" aria-label="Language selection">
            <button
              type="button"
              onClick={() => setLang('kn')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                lang === 'kn'
                  ? 'bg-emerald-600 text-white shadow-2xs font-extrabold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ಕನ್ನಡ
            </button>
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                lang === 'en'
                  ? 'bg-emerald-600 text-white shadow-2xs font-extrabold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              English
            </button>
          </div>

          {/* User Auth Section */}
          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-300 text-xs text-slate-800 font-bold">
                <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                  {user.full_name ? user.full_name[0].toUpperCase() : 'U'}
                </div>
                <span className="max-w-[100px] truncate">{user.full_name || user.username}</span>
                {user.taluk && (
                  <span className="text-xs text-emerald-800 font-medium">({user.taluk})</span>
                )}
              </div>
              <button
                onClick={onLogout}
                aria-label="Sign out"
                title={t('nav.sign_out', 'Sign Out')}
                className="p-2 rounded-full hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onOpenAuth('login')}
              aria-label="Sign in"
              className="btn-secondary min-h-[38px] px-3.5 py-1.5 text-xs text-slate-700 hover:text-emerald-800"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{t('nav.sign_in', 'Sign In')}</span>
            </button>
          )}
        </div>

        {/* Mobile: Lang Toggle & Hamburger */}
        <div className="flex sm:hidden items-center gap-2">
          {/* Quick Mobile Language Switch */}
          <button
            type="button"
            onClick={() => setLang(lang === 'kn' ? 'en' : 'kn')}
            aria-label="Switch language"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-300 text-xs font-bold text-emerald-800"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{lang === 'kn' ? 'English' : 'ಕನ್ನಡ'}</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden mt-2 p-4 rounded-2xl bg-white border border-slate-200 shadow-xl flex flex-col gap-2">
          {/* Prominent Language Switch in Mobile Menu */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-semibold text-slate-600">ಭಾಷೆ / Language:</span>
            <div className="flex items-center p-0.5 rounded-lg bg-slate-100 border border-slate-200 text-xs font-bold">
              <button
                type="button"
                onClick={() => setLang('kn')}
                className={`px-3 py-1 rounded-md transition-all ${
                  lang === 'kn' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-600'
                }`}
              >
                ಕನ್ನಡ
              </button>
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-3 py-1 rounded-md transition-all ${
                  lang === 'en' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-600'
                }`}
              >
                English
              </button>
            </div>
          </div>

          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onTabChange(item.id);
                setMobileMenuOpen(false);
              }}
              aria-current={activeTab === item.id ? 'page' : undefined}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold min-h-[44px] flex items-center ${
                activeTab === item.id
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              {item.label}
            </button>
          ))}

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {user ? (
              <div className="flex items-center justify-between w-full">
                <span className="font-bold text-slate-800 text-xs truncate max-w-[200px]">
                  {user.full_name || user.username} {user.taluk && `(${user.taluk})`}
                </span>
                <button
                  onClick={onLogout}
                  className="text-red-600 font-bold text-xs p-2 hover:bg-red-50 rounded-lg cursor-pointer"
                >
                  {t('nav.sign_out', 'Sign Out')}
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onOpenAuth('login');
                  setMobileMenuOpen(false);
                }}
                className="btn-primary w-full min-h-[44px]"
              >
                <LogIn className="w-4 h-4" />
                <span>{t('nav.sign_in', 'Sign In')}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
