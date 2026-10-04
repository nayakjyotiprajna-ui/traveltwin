import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { TravelStyle, AccessibilityPreference } from '../types';
import { User, Mail, Sparkles, Check, RotateCcw, ShieldCheck, Heart, Camera } from 'lucide-react';

const TRAVEL_STYLES: TravelStyle[] = [
  'Peaceful',
  'Cultural',
  'Nature',
  'Adventure',
  'Photography',
  'Family',
  'Luxury',
  'Budget'
];

const ACCESSIBILITY_OPTIONS: AccessibilityPreference[] = [
  'Low Motion',
  'Audio Guide',
  'Text Guide',
  'Mobility Friendly',
  'Senior Friendly',
  'Large Text',
  'High Contrast'
];

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
];

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || 'Aria Vance');
  const [email, setEmail] = useState(user?.email || 'aria.vance@example.com');
  const [avatar, setAvatar] = useState(user?.avatar || AVATAR_OPTIONS[0]);
  const [travelStyle, setTravelStyle] = useState<TravelStyle>(user?.travelStyle || 'Peaceful');
  const [accessibility, setAccessibility] = useState<AccessibilityPreference[]>(
    user?.accessibilityPreferences || ['Low Motion', 'Text Guide']
  );
  const [feedback, setFeedback] = useState<string | null>(null);

  const toggleAcc = (item: AccessibilityPreference) => {
    setAccessibility((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      name,
      email,
      avatar,
      travelStyle,
      accessibilityPreferences: accessibility
    });

    setFeedback('Profile and Travel Twin preferences updated successfully!');
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleResetTwin = () => {
    setName('Aria Vance');
    setTravelStyle('Peaceful');
    setAccessibility(['Low Motion', 'Text Guide']);
    setFeedback('Travel Twin settings reset to default baseline.');
    setTimeout(() => setFeedback(null), 3500);
  };

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Traveler Profile & Twin</h1>
        <p className="text-xs text-slate-400">
          Configure your personal details, AI Travel Twin persona, and accessibility requirements.
        </p>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-2xl bg-teal-500/20 border border-teal-500/30 text-teal-300 text-xs flex items-center gap-2 animate-fade-in">
          <Sparkles className="w-4 h-4 text-teal-400" />
          <span>{feedback}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="glass-card rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl space-y-8">
        {/* Avatar Selection */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-slate-300">Choose Explorer Avatar</label>
          <div className="flex items-center gap-4">
            <img src={avatar} alt="Current Avatar" className="w-16 h-16 rounded-2xl object-cover ring-2 ring-brand-400" />
            <div className="flex gap-2">
              {AVATAR_OPTIONS.map((av, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setAvatar(av)}
                  className={`w-10 h-10 rounded-xl overflow-hidden border-2 transition-all ${
                    avatar === av ? 'border-brand-400 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={av} alt="Option" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Basic Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-900 border border-white/10 text-white text-xs focus:outline-none focus:border-brand-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-900 border border-white/10 text-white text-xs focus:outline-none focus:border-brand-400"
              />
            </div>
          </div>
        </div>

        {/* Travel Style */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-300">Active Travel Style Persona</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {TRAVEL_STYLES.map((style) => (
              <button
                key={style}
                type="button"
                onClick={() => setTravelStyle(style)}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                  travelStyle === style
                    ? 'bg-brand-500/20 border-brand-400 text-white'
                    : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        {/* Accessibility Preferences */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-300">Accessibility & Comfort Accommodations</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {ACCESSIBILITY_OPTIONS.map((item) => {
              const checked = accessibility.includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleAcc(item)}
                  className={`p-3 rounded-xl border text-left text-xs flex items-center justify-between transition-all ${
                    checked
                      ? 'bg-teal-500/20 border-teal-400 text-white'
                      : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>{item}</span>
                  {checked && <Check className="w-3.5 h-3.5 text-teal-400" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={handleResetTwin}
            className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Travel Twin</span>
          </button>

          <button
            type="submit"
            className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-brand-500 to-teal-400 hover:opacity-95 text-white font-semibold text-xs shadow-glow-sky"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};
