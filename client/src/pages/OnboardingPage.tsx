import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGamification } from '../context/GamificationContext';
import { TravelStyle, AccessibilityPreference } from '../types';
import { Sparkles, ArrowRight, Check, Heart, Shield, Compass, Mountain, Feather, Camera, DollarSign } from 'lucide-react';

const TRAVEL_STYLES: { id: TravelStyle; label: string; desc: string }[] = [
  { id: 'Peaceful', label: 'Peaceful & Serene', desc: 'Tranquil lakes, calm vistas, minimal noise, and rejuvenating rhythm.' },
  { id: 'Cultural', label: 'Cultural & Historic', desc: 'Ancient architecture, sacred monuments, folklore, and local heritage.' },
  { id: 'Nature', label: 'Nature & Wildlife', desc: 'Lush tea plantations, wildlife sanctuaries, and serene water canals.' },
  { id: 'Adventure', label: 'Alpine & High Altitude', desc: 'Passes, mountain ridges, and rugged geological landscapes.' },
  { id: 'Photography', label: 'Photography & Vistas', desc: 'Golden hour vantage points, sweeping horizons, and vibrant colors.' },
  { id: 'Family', label: 'Family & Gentle', desc: 'Low stress, plenty of resting points, and multigenerational appeal.' },
  { id: 'Luxury', label: 'Luxury & Wellness', desc: 'Premium palace stays, Ayurvedic spas, and exclusive retreats.' },
  { id: 'Budget', label: 'Authentic & Budget', desc: 'Local homestays, public ferries, street food stalls, and value travel.' },
];

const ACCESSIBILITY_OPTIONS: { id: AccessibilityPreference; label: string; desc: string }[] = [
  { id: 'Low Motion', label: 'Low Motion / Vestibular Safe', desc: 'Limits sudden 3D spins and fast camera pans.' },
  { id: 'Audio Guide', label: 'Descriptive Audio Guide', desc: 'Spatial spoken descriptions for non-visual explorers.' },
  { id: 'Text Guide', label: 'Descriptive Text Guide', desc: 'Full textual explanations with rich transcripts.' },
  { id: 'Mobility Friendly', label: 'Step-Free & Wheelchair Data', desc: 'Prioritizes ramps, elevators, and flat paved pathways.' },
  { id: 'Senior Friendly', label: 'Senior Friendly Rest Stops', desc: 'Frequent seating intervals and gentle pacing.' },
  { id: 'Large Text', label: 'High Legibility Text Scaling', desc: 'Increased font sizing and elevated line spacing.' },
  { id: 'High Contrast', label: 'High Contrast Colorway', desc: 'Sharper edge definitions and enhanced readability.' },
];

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { addXp } = useGamification();

  const [step, setStep] = useState<number>(1);
  const [twinName, setTwinName] = useState(user?.name ? `${user.name}'s Twin` : 'Aria Twin');
  const [selectedStyle, setSelectedStyle] = useState<TravelStyle>(user?.travelStyle || 'Peaceful');
  const [selectedAccessibility, setSelectedAccessibility] = useState<AccessibilityPreference[]>(
    user?.accessibilityPreferences || ['Low Motion', 'Text Guide']
  );
  const [budgetPref, setBudgetPref] = useState(user?.budgetPreference || 'Moderate');
  const [preferredEnv, setPreferredEnv] = useState(user?.preferredEnvironment || 'Mountains & Lakeside');
  const [favoriteDests, setFavoriteDests] = useState<string[]>(['Kashmir Valley', 'Kerala Backwaters']);

  const toggleAccessibility = (item: AccessibilityPreference) => {
    setSelectedAccessibility(prev =>
      prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item]
    );
  };

  const handleFinish = () => {
    updateUser({
      name: user?.name || twinName,
      travelStyle: selectedStyle,
      accessibilityPreferences: selectedAccessibility,
      budgetPreference: budgetPref,
      preferredEnvironment: preferredEnv
    });

    addXp(250, 'Travel Twin Personality Calibrated');
    navigate('/explore');
  };

  return (
    <div className="max-w-3xl mx-auto py-8 sm:py-12 px-4">
      {/* Header */}
      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-brand-400" />
          <span>Step {step} of 3 • AI Persona Calibration</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Meet Your Travel Twin
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Your Travel Twin is your digital tourism companion. It helps tailor virtual visit environments, pre-trip simulation challenges, and personalized itineraries.
        </p>

        {/* Progress bar */}
        <div className="w-full max-w-xs mx-auto bg-slate-800 h-1.5 rounded-full overflow-hidden mt-4">
          <div
            className="h-full bg-gradient-to-r from-brand-400 to-teal-400 transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      <div className="glass-card rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl relative">
        {/* STEP 1: Name, Style, & Environment */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-lg font-bold text-white mb-1">Name & Travel Style</h2>
              <p className="text-xs text-slate-400">Choose how your twin approaches new places and experiences.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Travel Twin Name</label>
              <input
                type="text"
                value={twinName}
                onChange={(e) => setTwinName(e.target.value)}
                placeholder="Give your twin a moniker..."
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-brand-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Primary Travel Style</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {TRAVEL_STYLES.map((style) => (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => setSelectedStyle(style.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      selectedStyle === style.id
                        ? 'bg-brand-500/20 border-brand-400 text-white shadow-glow-sky'
                        : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between font-semibold text-xs text-slate-100">
                      <span>{style.label}</span>
                      {selectedStyle === style.id && <Check className="w-3.5 h-3.5 text-brand-400" />}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-snug">{style.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-semibold text-xs flex items-center space-x-2 shadow-glow-sky"
              >
                <span>Next: Accessibility Needs</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Accessibility & Comfort Modes */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-lg font-bold text-white mb-1">Accessibility & Sensory Comfort</h2>
              <p className="text-xs text-slate-400">
                Select any mobility or sensory accommodations you need. TravelTwin calibrates 3D camera speeds and audio tools accordingly.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ACCESSIBILITY_OPTIONS.map((item) => {
                const checked = selectedAccessibility.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleAccessibility(item.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      checked
                        ? 'bg-teal-500/20 border-teal-400 text-white shadow-glow-teal'
                        : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between font-semibold text-xs text-slate-100">
                      <span>{item.label}</span>
                      {checked && <Check className="w-3.5 h-3.5 text-teal-400" />}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-snug">{item.desc}</p>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-between pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-white font-semibold text-xs flex items-center space-x-2 shadow-glow-teal"
              >
                <span>Next: Environment & Budget</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Environment, Budget & Confirmation */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-lg font-bold text-white mb-1">Environment & Budget Calibration</h2>
              <p className="text-xs text-slate-400">Final touches to synchronize your AI Travel Director suggestions.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Preferred Environment</label>
                <select
                  value={preferredEnv}
                  onChange={(e) => setPreferredEnv(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-navy-900 border border-white/10 text-white text-xs focus:outline-none focus:border-brand-400"
                >
                  <option value="Mountains & Lakeside">Mountains & Lakeside (e.g. Kashmir)</option>
                  <option value="Tropical Coastlines">Tropical Coastlines & Palms (e.g. Goa, Kerala)</option>
                  <option value="Desert Citadel & Palaces">Desert Citadel & Palaces (e.g. Rajasthan)</option>
                  <option value="High Alpine Plateau">High Alpine Plateau (e.g. Ladakh)</option>
                  <option value="Coastal Heritage Temples">Coastal Heritage Temples (e.g. Konark)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Budget Preference</label>
                <select
                  value={budgetPref}
                  onChange={(e) => setBudgetPref(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-navy-900 border border-white/10 text-white text-xs focus:outline-none focus:border-brand-400"
                >
                  <option value="Budget">Budget Conscious ($50 - $75/day)</option>
                  <option value="Moderate">Moderate Comfort ($75 - $120/day)</option>
                  <option value="Luxury">Luxury & Wellness ($150+/day)</option>
                </select>
              </div>
            </div>

            {/* Calibration Summary Box */}
            <div className="p-4 rounded-2xl bg-white/5 border border-brand-500/30 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-brand-300">Ready to Activate: {twinName}</span>
                <span className="text-teal-400 text-[11px] font-semibold">+250 Welcome XP</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Your twin is calibrated for <strong>{selectedStyle}</strong> journeys with <strong>{selectedAccessibility.length}</strong> active sensory accommodations.
              </p>
            </div>

            <div className="flex justify-between pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleFinish}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-brand-500 to-teal-400 hover:opacity-95 text-white font-semibold text-xs flex items-center space-x-2 shadow-glow-sky"
              >
                <Sparkles className="w-4 h-4" />
                <span>Activate Travel Twin & Explore</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
