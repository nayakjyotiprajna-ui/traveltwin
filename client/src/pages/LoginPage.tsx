import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Globe2, Lock, Mail, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

// Google "G" SVG icon
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
    <g fill="none" fillRule="evenodd">
      <path
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z"
        fill="#EA4335"
      />
    </g>
  </svg>
);

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  // ── Email / password sign-in ───────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    if (!password) {
      setError('Please provide your password.');
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  // ── Google Sign-In ─────────────────────────────────────────────────────
  const handleGoogleSignIn = async () => {
    setError('');
    try {
      setGoogleLoading(true);
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err: any) {
      // User closed popup — don't show error
      if (err?.code !== 'auth/popup-closed-by-user' && err?.code !== 'auth/cancelled-popup-request') {
        setError(err?.message || 'Google sign-in failed. Please try again.');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleForgotPassword = () => {
    if (!email) {
      setError('Enter your email to receive recovery instructions.');
      return;
    }
    setForgotSent(true);
    setTimeout(() => setForgotSent(false), 5000);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full glass-card rounded-3xl p-8 border border-brand-500/20 shadow-2xl relative overflow-hidden space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-brand-500/20 text-brand-400 mb-1">
            <Globe2 className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Welcome Back Explorer</h2>
          <p className="text-xs text-slate-400">
            Sign in to access your digital passport, saved trips, and travel twin.
          </p>
        </div>

        {/* Error banner */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-2 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {forgotSent && (
          <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center gap-2 text-teal-300 text-xs">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>Password reset instructions sent to {email}.</span>
          </div>
        )}

        {/* ── Google Sign-In button ── */}
        <button
          id="btn-google-signin"
          type="button"
          onClick={handleGoogleSignIn}
          disabled={googleLoading || loading}
          className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl bg-white text-gray-700 font-semibold text-xs shadow-md hover:bg-gray-50 active:scale-[0.98] transition-all disabled:opacity-60"
        >
          <GoogleIcon />
          <span>{googleLoading ? 'Connecting to Google…' : 'Continue with Google'}</span>
        </button>

        {/* ── Divider ── */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-[11px] text-slate-500">or sign in with email</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* ── Email / password form ── */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                id="input-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-brand-400 transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-300">Password</label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-[11px] text-brand-400 hover:text-brand-300 transition-colors"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                id="input-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-brand-400 transition-colors"
              />
            </div>
          </div>

          <button
            id="btn-email-signin"
            type="submit"
            disabled={loading || googleLoading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-brand-500 to-teal-400 text-white font-semibold text-xs shadow-glow-sky hover:opacity-95 transition-all flex items-center justify-center space-x-2 disabled:opacity-60"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to TravelTwin'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-400 pt-2 border-t border-white/10">
          New to TravelTwin?{' '}
          <Link to="/register" className="text-brand-400 hover:text-brand-300 font-semibold">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};
