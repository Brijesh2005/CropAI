import React, { useState } from 'react';
import { X, User, Lock, Mail, MapPin, Briefcase, CheckCircle2, AlertCircle, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';

const TALUKS = [
  "Mangaluru",
  "Bantwal",
  "Belthangady",
  "Puttur",
  "Sullia",
  "Moodbidri",
  "Kadaba"
];

const ROLES = [
  { id: 'farmer', label: 'Farmer / Landholder' },
  { id: 'agronomist', label: 'Agricultural Officer / Agronomist' },
  { id: 'researcher', label: 'Data Analyst / Researcher' }
];

export default function AuthModal({ isOpen, onClose, initialMode = 'login', onAuthSuccess }) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [taluk, setTaluk] = useState('Puttur');
  const [role, setRole] = useState('farmer');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const endpoint = mode === 'register' ? '/api/v1/auth/register' : '/api/v1/auth/login';
      const payload = mode === 'register'
        ? { email, password, full_name: fullName, taluk, role }
        : { email, password };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || data.message || 'Authentication request failed.');
      }

      // Save token and user details to localStorage
      if (data.access_token) {
        localStorage.setItem('terravision_token', data.access_token);
      }
      if (data.user) {
        localStorage.setItem('terravision_user', JSON.stringify(data.user));
      }

      setSuccessMsg(mode === 'register' ? 'Account created successfully!' : 'Signed in successfully!');
      setTimeout(() => {
        onAuthSuccess(data.user);
        onClose();
      }, 700);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-md glass-card bg-[#030712]/95 border border-blue-500/40 rounded-2xl shadow-[0_0_50px_rgba(37,99,235,0.25)] p-6 sm:p-8 overflow-hidden text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent blur-sm" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-blue-950/60 border border-blue-500/40 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
            </div>
            <span className="text-xs font-mono text-blue-400 tracking-wider uppercase">
              TerraVision Access
            </span>
          </div>
          <h2 className="text-2xl font-bold font-['Space_Grotesk'] text-white">
            {mode === 'register' ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {mode === 'register'
              ? 'Join the Dakshina Kannada precision agriculture network'
              : 'Sign in to access your farm intelligence & satellite history'}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-2 p-1 mb-6 rounded-xl bg-blue-950/40 border border-blue-500/20 text-xs font-medium">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(null); }}
            className={`py-2 rounded-lg transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-blue-600 text-white shadow-md font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(null); }}
            className={`py-2 rounded-lg transition-all cursor-pointer ${
              mode === 'register'
                ? 'bg-blue-600 text-white shadow-md font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Alert Messages */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-950/50 border border-red-500/40 flex items-start gap-2.5 text-xs text-red-200">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-950/50 border border-emerald-500/40 flex items-center gap-2.5 text-xs text-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
          {mode === 'register' && (
            <div>
              <label className="block text-slate-300 mb-1.5 font-sans text-xs font-medium">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ramesh Gowda"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-black/60 border border-slate-700 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 text-white outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-slate-300 mb-1.5 font-sans text-xs font-medium">Email / Username</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="farmer@dakshina.in"
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-black/60 border border-slate-700 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 text-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 mb-1.5 font-sans text-xs font-medium">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-black/60 border border-slate-700 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 text-white outline-none"
              />
            </div>
          </div>

          {mode === 'register' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1.5 font-sans text-xs font-medium">Taluk Sector</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <select
                      value={taluk}
                      onChange={(e) => setTaluk(e.target.value)}
                      className="w-full pl-9 pr-2 py-2 rounded-lg bg-black/60 border border-slate-700 focus:border-blue-400 text-white outline-none"
                    >
                      {TALUKS.map((t) => (
                        <option key={t} value={t} className="bg-slate-900 text-white">{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1.5 font-sans text-xs font-medium">Role</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full pl-9 pr-2 py-2 rounded-lg bg-black/60 border border-slate-700 focus:border-blue-400 text-white outline-none"
                    >
                      {ROLES.map((r) => (
                        <option key={r.id} value={r.id} className="bg-slate-900 text-white">{r.label.split('/')[0]}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-sans font-semibold tracking-wide flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>{mode === 'register' ? 'Register Account' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Note */}
        <div className="mt-5 text-center text-[11px] text-slate-500">
          <span>Protected by TerraVision Geofence & Encryption</span>
        </div>
      </div>
    </div>
  );
}

