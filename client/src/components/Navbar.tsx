import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Compass,
  Globe2,
  Sparkles,
  Headphones,
  SlidersHorizontal,
  Users,
  Award,
  LayoutDashboard,
  Menu,
  X,
  Bell,
  User as UserIcon,
  LogOut,
  Accessibility,
  Eye,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useGamification } from '../context/GamificationContext';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { xp, level, progressPercent } = useGamification();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [accessibilityModalOpen, setAccessibilityModalOpen] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const toggleAccessibility = (type: 'contrast' | 'text' | 'motion') => {
    if (type === 'contrast') {
      const next = !highContrast;
      setHighContrast(next);
      document.documentElement.classList.toggle('high-contrast', next);
    } else if (type === 'text') {
      const next = !largeText;
      setLargeText(next);
      document.documentElement.classList.toggle('text-lg', next);
    } else if (type === 'motion') {
      const next = !reducedMotion;
      setReducedMotion(next);
      document.documentElement.classList.toggle('motion-reduce', next);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: Globe2 },
    { name: 'Explore', path: '/explore', icon: Compass },
    { name: 'AI Travel Twin', path: '/travel-twin', icon: Sparkles },
    { name: 'Virtual Visit', path: '/virtual-visit', icon: Headphones },
    { name: 'Pre-Travel Simulation', path: '/simulate', icon: SlidersHorizontal },
    { name: 'Travel Together', path: '/travel-together', icon: Users },
    { name: 'Passport', path: '/passport', icon: Award },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full glass-panel border-b border-white/10 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-400 to-teal-400 p-[1.5px] shadow-glow-sky">
                <div className="w-full h-full bg-navy-950 rounded-[10px] flex items-center justify-center">
                  <Globe2 className="w-5 h-5 text-brand-400 group-hover:rotate-12 transition-transform duration-300" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                  Travel<span className="text-brand-400">Twin</span>
                  <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20">
                    AI
                  </span>
                </span>
                <span className="text-[10px] text-slate-400 tracking-wide hidden sm:block">
                  No Passport Needed
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden xl:flex items-center space-x-1" aria-label="Main Navigation">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 flex items-center space-x-1.5 ${
                      active
                        ? 'bg-brand-500/15 text-brand-300 border border-brand-500/30 shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${active ? 'text-brand-400' : 'text-slate-400'}`} />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Icons & Auth */}
            <div className="hidden md:flex items-center space-x-3">
              {/* Accessibility Quick Settings */}
              <button
                type="button"
                onClick={() => setAccessibilityModalOpen(!accessibilityModalOpen)}
                aria-label="Accessibility Settings"
                title="Accessibility Preferences"
                className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors border border-white/5 relative"
              >
                <Accessibility className="w-4 h-4 text-brand-400" />
              </button>

              {/* Gamification Badge */}
              <Link
                to="/passport"
                title={`Level ${level} Explorer • ${xp} XP`}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-brand-500/20 hover:border-brand-400/50 transition-colors shadow-inner"
              >
                <div className="w-5 h-5 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-400 text-xs font-bold">
                  ★
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[11px] font-semibold text-slate-200 leading-tight">
                    Lvl {level}
                  </span>
                  <div className="w-14 h-1 bg-slate-800 rounded-full overflow-hidden mt-0.5">
                    <div
                      className="h-full bg-gradient-to-r from-brand-400 to-teal-400"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </Link>

              {/* Notification Bell */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  aria-label="View notifications"
                  className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors border border-white/5 relative"
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-teal-400 ring-2 ring-navy-950" />
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 glass-card rounded-xl shadow-2xl p-4 z-50 text-xs border border-white/10">
                    <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2">
                      <span className="font-semibold text-white">Notifications</span>
                      <span className="text-[10px] text-brand-400">2 unread</span>
                    </div>
                    <div className="space-y-2.5">
                      <div className="p-2 rounded-lg bg-brand-500/10 border border-brand-500/20">
                        <p className="text-slate-200 font-medium">Kashmir Virtual Experience Ready</p>
                        <p className="text-slate-400 text-[11px] mt-0.5">Dal Lake sunrise audio guide has been unlocked.</p>
                      </div>
                      <div className="p-2 rounded-lg bg-teal-500/10 border border-teal-500/20">
                        <p className="text-slate-200 font-medium">Passport Stamp Unlocked!</p>
                        <p className="text-slate-400 text-[11px] mt-0.5">+300 XP added to your digital traveler profile.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile or Login */}
              {isAuthenticated && user ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center space-x-2 p-1.5 pr-2.5 rounded-full bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-7 h-7 rounded-full object-cover ring-1 ring-brand-400"
                    />
                    <span className="text-xs font-medium text-slate-200 max-w-[90px] truncate">
                      {user.name}
                    </span>
                  </button>

                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 glass-card rounded-xl shadow-2xl py-2 z-50 text-xs border border-white/10">
                      <div className="px-4 py-2 border-b border-white/10">
                        <p className="font-semibold text-white truncate">{user.name}</p>
                        <p className="text-slate-400 text-[11px] truncate">{user.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 bg-brand-500/20 text-brand-300 text-[10px] rounded-full">
                          {user.travelStyle} Explorer
                        </span>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center px-4 py-2.5 hover:bg-white/5 text-slate-200"
                      >
                        <UserIcon className="w-3.5 h-3.5 mr-2 text-brand-400" />
                        Edit Profile & Twin
                      </Link>
                      <Link
                        to="/dashboard"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center px-4 py-2.5 hover:bg-white/5 text-slate-200"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5 mr-2 text-teal-400" />
                        Traveler Dashboard
                      </Link>
                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center px-4 py-2.5 hover:bg-white/5 text-amber-300 font-semibold"
                        >
                          <SlidersHorizontal className="w-3.5 h-3.5 mr-2" />
                          Admin Console
                        </Link>
                      )}
                      <div className="border-t border-white/10 my-1" />
                      <button
                        type="button"
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center px-4 py-2.5 text-rose-400 hover:bg-rose-500/10 text-left"
                      >
                        <LogOut className="w-3.5 h-3.5 mr-2" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-brand-500 to-teal-500 text-white hover:opacity-95 shadow-glow-sky transition-all"
                  >
                    Join Free
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex xl:hidden items-center space-x-2">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5"
                aria-label="Toggle Mobile Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Slide-down Menu */}
        {mobileMenuOpen && (
          <div className="xl:hidden glass-panel border-b border-white/10 px-4 pt-2 pb-6 space-y-2">
            <div className="grid grid-cols-2 gap-2 pt-2 pb-4">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-2 px-3 py-2.5 rounded-lg text-xs font-medium ${
                      active
                        ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                        : 'text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-brand-400" />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              {isAuthenticated && user ? (
                <div className="flex items-center justify-between w-full">
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2"
                  >
                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                    <div>
                      <div className="text-xs font-semibold text-white">{user.name}</div>
                      <div className="text-[10px] text-slate-400">Level {level} Explorer</div>
                    </div>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-xs text-rose-400 px-3 py-1 rounded bg-rose-500/10"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex space-x-2 w-full">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center py-2 rounded-lg bg-white/5 text-xs text-white"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center py-2 rounded-lg bg-brand-500 text-xs text-white font-medium shadow-glow-sky"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Accessibility Preferences Modal */}
      {accessibilityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-fade-in">
          <div className="glass-card max-w-md w-full rounded-2xl p-6 border border-white/15 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <Accessibility className="w-5 h-5 text-brand-400" />
                <h3 className="font-bold text-white text-base">Accessibility & Sensory Modes</h3>
              </div>
              <button
                onClick={() => setAccessibilityModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              TravelTwin was designed to make the world accessible to everyone. Choose comfort settings below:
            </p>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => toggleAccessibility('contrast')}
                className={`w-full flex items-center justify-between p-3 rounded-xl border text-left text-xs transition-colors ${
                  highContrast ? 'bg-brand-500/20 border-brand-400 text-white' : 'bg-white/5 border-white/10 text-slate-300'
                }`}
              >
                <div>
                  <div className="font-semibold text-slate-100 flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-brand-400" />
                    High Contrast Display
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Increases UI contrast and border vibrancy</div>
                </div>
                {highContrast && <Check className="w-4 h-4 text-brand-400" />}
              </button>

              <button
                type="button"
                onClick={() => toggleAccessibility('text')}
                className={`w-full flex items-center justify-between p-3 rounded-xl border text-left text-xs transition-colors ${
                  largeText ? 'bg-brand-500/20 border-brand-400 text-white' : 'bg-white/5 border-white/10 text-slate-300'
                }`}
              >
                <div>
                  <div className="font-semibold text-slate-100">Large Text & Readability</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Scales typography for enhanced legibility</div>
                </div>
                {largeText && <Check className="w-4 h-4 text-brand-400" />}
              </button>

              <button
                type="button"
                onClick={() => toggleAccessibility('motion')}
                className={`w-full flex items-center justify-between p-3 rounded-xl border text-left text-xs transition-colors ${
                  reducedMotion ? 'bg-brand-500/20 border-brand-400 text-white' : 'bg-white/5 border-white/10 text-slate-300'
                }`}
              >
                <div>
                  <div className="font-semibold text-slate-100">Low Motion & Vestibular Comfort</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Disables fast camera pans and heavy 3D spins</div>
                </div>
                {reducedMotion && <Check className="w-4 h-4 text-brand-400" />}
              </button>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setAccessibilityModalOpen(false)}
                className="w-full py-2.5 rounded-xl bg-brand-500 text-white text-xs font-semibold hover:bg-brand-400 transition-colors shadow-glow-sky"
              >
                Apply & Return to Experience
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
