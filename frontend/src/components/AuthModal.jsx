import React, { useState } from 'react';
import { X, User, Lock, Mail, MapPin, CheckCircle2, AlertCircle, Loader2, ArrowRight, Sprout, Eye, EyeOff } from 'lucide-react';

const TALUKS = [
  "Mangaluru",
  "Bantwal",
  "Belthangady",
  "Puttur",
  "Sullia",
  "Moodbidri",
  "Kadaba"
];

export default function AuthModal({ isOpen, onClose, initialMode = 'login', onAuthSuccess }) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [taluk, setTaluk] = useState('Puttur');

  // Inline field validation errors
  const [fieldErrors, setFieldErrors] = useState({});

  if (!isOpen) return null;

  const validate = () => {
    const errors = {};
    if (!email.trim()) {
      errors.email = 'Please enter your email or username.';
    }
    if (!password) {
      errors.password = 'Please enter your password.';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    }
    if (mode === 'register' && !fullName.trim()) {
      errors.fullName = 'Please enter your full name.';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const endpoint = mode === 'register' ? '/api/v1/auth/register' : '/api/v1/auth/login';
      const payload = mode === 'register'
        ? { email: email.trim(), password, full_name: fullName.trim(), taluk, role: 'farmer' }
        : { email: email.trim(), password };

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
      }, 600);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in text-left">
      <div 
        className="relative w-full max-w-md bg-white border border-emerald-200 rounded-2xl shadow-xl p-6 sm:p-8 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Sprout className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-emerald-800">
              TerraVision Farm
            </span>
          </div>
          <h2 className="text-2xl font-bold font-['Space_Grotesk'] text-slate-900">
            {mode === 'register' ? 'Create farmer account' : 'Welcome back'}
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            {mode === 'register'
              ? 'Join Dakshina Kannada precision farming'
              : 'Sign in to access your farm analyses and history'}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-2 p-1 mb-6 rounded-xl bg-slate-100 border border-slate-200 text-xs font-medium">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(null); setFieldErrors({}); }}
            className={`py-2 rounded-lg transition-all cursor-pointer font-semibold ${
              mode === 'login'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(null); setFieldErrors({}); }}
            className={`py-2 rounded-lg transition-all cursor-pointer font-semibold ${
              mode === 'register'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Alert Messages */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-xs text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label htmlFor="auth-fullname" className="block text-slate-700 mb-1.5 text-xs font-semibold">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  id="auth-fullname"
                  type="text"
                  autoComplete="name"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (fieldErrors.fullName) setFieldErrors(prev => ({ ...prev, fullName: null }));
                  }}
                  placeholder="e.g. Ramesh Gowda"
                  className={`input pl-10 pr-3 ${fieldErrors.fullName ? 'border-red-400 focus:border-red-500' : ''}`}
                />
              </div>
              {fieldErrors.fullName && (
                <p className="text-xs text-red-600 mt-1">{fieldErrors.fullName}</p>
              )}
            </div>
          )}

          <div>
            <label htmlFor="auth-username" className="block text-slate-700 mb-1.5 text-xs font-semibold">
              Email or Username
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <input
                id="auth-username"
                type="text"
                autoComplete="username"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: null }));
                }}
                placeholder="farmer@dakshina.in"
                className={`input pl-10 pr-3 ${fieldErrors.email ? 'border-red-400 focus:border-red-500' : ''}`}
              />
            </div>
            {fieldErrors.email && (
              <p className="text-xs text-red-600 mt-1">{fieldErrors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="auth-password" className="block text-slate-700 mb-1.5 text-xs font-semibold">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <input
                id="auth-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) setFieldErrors(prev => ({ ...prev, password: null }));
                }}
                placeholder="••••••••"
                className={`input pl-10 pr-11 ${fieldErrors.password ? 'border-red-400 focus:border-red-500' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-3 p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="text-xs text-red-600 mt-1">{fieldErrors.password}</p>
            )}
          </div>

          {mode === 'register' && (
            <div>
              <label htmlFor="auth-taluk" className="block text-slate-700 mb-1.5 text-xs font-semibold">
                Taluk Sector
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <select
                  id="auth-taluk"
                  value={taluk}
                  onChange={(e) => setTaluk(e.target.value)}
                  className="input pl-10 pr-8"
                >
                  {TALUKS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>{mode === 'register' ? 'Create farmer account' : 'Sign in'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Note */}
        <div className="mt-5 text-center text-xs text-slate-500">
          <span>Protected by Dakshina Kannada Geofence &amp; Security</span>
        </div>
      </div>
    </div>
  );
}
