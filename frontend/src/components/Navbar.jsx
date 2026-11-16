import React, { useState } from 'react';
import { Sprout, Satellite, Shield, BarChart3, Menu, X, Cpu, User, LogOut, LogIn, MapPin } from 'lucide-react';

export default function Navbar({ activeTab, onTabChange, onOpenMetrics, activeTaluk, user, onOpenAuth, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'analyze', label: 'GIS Farm Map' },
    { id: 'history', label: 'History' },
    { id: 'models', label: 'AI Models' },
    { id: 'about', label: 'About' }
  ];

  return (
    <nav className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left">
      <div className="bg-white/95 border border-emerald-500/30 px-5 py-3 rounded-2xl shadow-md flex items-center justify-between transition-all backdrop-blur-xl">
        {/* Brand */}
        <button
          onClick={() => onTabChange('dashboard')}
          className="flex items-center gap-3 group text-left cursor-pointer focus:outline-none"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/30 group-hover:bg-emerald-700 transition-all">
            <Sprout className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full animate-ping" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full" />
          </div>
          <div>
            <div className="text-base font-extrabold tracking-wider text-slate-900 font-['Space_Grotesk'] uppercase flex items-center gap-1.5">
              TERRAVISION <span className="text-emerald-600 font-black">FARM</span>
            </div>
            <div className="text-[10px] font-mono text-emerald-800 font-semibold tracking-wider">
              DAKSHINA KANNADA SMART AGRI
            </div>
          </div>
        </button>

        {/* Desktop Nav Items */}
        <div className="hidden md:flex items-center gap-1 lg:gap-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`relative px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'text-emerald-700 bg-emerald-50 shadow-2xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {item.label}
                {isActive && (
                  <div className="absolute bottom-1 left-4 right-4 h-[2.5px] bg-emerald-600 rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Right Side Controls & Status */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Geofence Status Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-300 text-xs font-mono font-bold text-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
            <span>DK: {activeTaluk ? activeTaluk.toUpperCase() : 'ACTIVE'}</span>
          </div>

          {/* Model Hub / Metrics */}
          <button
            onClick={onOpenMetrics}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-emerald-50 border border-slate-200 text-slate-700 hover:text-emerald-800 text-xs font-mono font-semibold transition-all cursor-pointer"
          >
            <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
            <span>AI ACCURACY: 88.3%</span>
          </button>

          {/* User Auth Section */}
          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100/70 border border-emerald-300 text-xs text-slate-800 font-bold">
                <div className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">
                  {user.full_name ? user.full_name[0].toUpperCase() : 'U'}
                </div>
                <span className="max-w-[100px] truncate">{user.full_name || user.username}</span>
                <span className="text-[10px] text-emerald-800 font-mono">({user.taluk})</span>
              </div>
              <button
                onClick={onLogout}
                title="Sign Out"
                className="p-1.5 rounded-full hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onOpenAuth('login')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/30 cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 p-4 rounded-2xl bg-white border border-slate-200 shadow-xl flex flex-col gap-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onTabChange(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-2 rounded-lg text-sm font-bold ${
                activeTab === item.id
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-xs">
            {user ? (
              <div className="flex items-center justify-between w-full">
                <span className="font-bold text-slate-800">{user.full_name || user.username} ({user.taluk})</span>
                <button onClick={onLogout} className="text-red-600 font-bold">Sign Out</button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onOpenAuth('login');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 bg-emerald-600 text-white font-bold rounded-lg text-center"
              >
                Sign In / Register
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
