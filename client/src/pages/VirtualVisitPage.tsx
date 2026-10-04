import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DESTINATIONS } from '../data/destinations';
import { Headphones, Sparkles, ArrowRight, ShieldCheck, Accessibility, Eye, Volume2, Check } from 'lucide-react';

const EXPERIENCE_TYPES = [
  { id: 'Peaceful', label: 'Peaceful Sanctuary', desc: 'Tranquil water ripples, gentle breeze sounds, and serene rhythm.' },
  { id: 'Adventure', label: 'Alpine Excursion', desc: 'High elevation vantage points, snowy crags, and ridge outlooks.' },
  { id: 'Culture', label: 'Heritage & Traditions', desc: 'Architectural arches, classical temple history, and local arts.' },
  { id: 'Nature', label: 'Botanical & Wildlife', desc: 'Lush tropical backwaters, tea terraces, and bird songscapes.' },
  { id: 'Photography', label: 'Golden Hour Vista', desc: 'Unobstructed scenic overlooks, sunrise hues, and sunset panoramas.' },
  { id: 'Family', label: 'Gentle Exploration', desc: 'Step-by-step paced exploration with informative historical insights.' }
];

const COMFORT_MODES = [
  { id: 'Normal', label: 'Normal Interactive 3D', icon: Sparkles, desc: 'Full 3D scene controls with standard orbit navigation.' },
  { id: 'Low Motion', label: 'Low Motion Mode', icon: Eye, desc: 'Gentle camera transitions to safeguard vestibular comfort.' },
  { id: 'Audio Guide', label: 'Descriptive Audio Mode', icon: Volume2, desc: 'Prioritizes spoken spatial audio landscape narrations.' },
  { id: 'Text Guide', label: 'High Readability Text Mode', icon: ShieldCheck, desc: 'Expands transcription cards and high-contrast captions.' },
  { id: 'Accessibility Mode', label: 'Full Inclusive Mode', icon: Accessibility, desc: 'Combines low motion, voice guidance, and large text.' }
];

export const VirtualVisitPage: React.FC = () => {
  const navigate = useNavigate();

  const [selectedDestination, setSelectedDestination] = useState<string>('kashmir');
  const [selectedExperience, setSelectedExperience] = useState<string>('Peaceful');
  const [selectedComfort, setSelectedComfort] = useState<string>('Normal');

  const destination = DESTINATIONS.find((d) => d.id === selectedDestination) || DESTINATIONS[0];

  const handleLaunch = () => {
    navigate(`/experience/${selectedDestination}?experience=${selectedExperience}&comfort=${selectedComfort}`);
  };

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-10 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-semibold">
          <Headphones className="w-3.5 h-3.5 text-brand-400" />
          <span>No Passport or Physical Travel Needed</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Configure Your Virtual Visit
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Immerse yourself into real-time interactive 3D travel environments tailored for your physical comfort, cognitive preferences, and mood.
        </p>
      </div>

      <div className="glass-card rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl space-y-8">
        {/* 1. Destination Selection */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-brand-500/20 text-brand-400 flex items-center justify-center text-xs">
                1
              </span>
              Select Destination
            </h2>
            <span className="text-xs text-slate-400">{DESTINATIONS.length} available</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {DESTINATIONS.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setSelectedDestination(d.id)}
                className={`relative rounded-xl overflow-hidden border p-2.5 text-left transition-all group ${
                  selectedDestination === d.id
                    ? 'border-brand-400 ring-2 ring-brand-500/30 bg-brand-500/10'
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
              >
                <div className="h-20 rounded-lg overflow-hidden mb-2 relative">
                  <img src={d.image} alt={d.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 to-transparent" />
                </div>
                <div className="text-xs font-bold text-white truncate">{d.name}</div>
                <div className="text-[10px] text-slate-400">{d.region}</div>
                {selectedDestination === d.id && (
                  <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-brand-400 text-navy-950 flex items-center justify-center text-[10px] font-bold">
                    ✓
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Experience Type */}
        <div className="space-y-4 pt-4 border-t border-white/10">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center text-xs">
              2
            </span>
            Choose Experience Type
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {EXPERIENCE_TYPES.map((exp) => (
              <button
                key={exp.id}
                type="button"
                onClick={() => setSelectedExperience(exp.id)}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  selectedExperience === exp.id
                    ? 'bg-teal-500/20 border-teal-400 text-white shadow-glow-teal'
                    : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between font-semibold text-xs text-white">
                  <span>{exp.label}</span>
                  {selectedExperience === exp.id && <Check className="w-3.5 h-3.5 text-teal-400" />}
                </div>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">{exp.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* 3. Comfort Mode */}
        <div className="space-y-4 pt-4 border-t border-white/10">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center text-xs">
              3
            </span>
            Select Comfort & Sensory Mode
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {COMFORT_MODES.map((mode) => {
              const Icon = mode.icon;
              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setSelectedComfort(mode.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    selectedComfort === mode.id
                      ? 'bg-brand-500/20 border-brand-400 text-white shadow-glow-sky'
                      : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between font-semibold text-xs text-white">
                    <span className="flex items-center gap-1.5">
                      <Icon className="w-3.5 h-3.5 text-brand-400" />
                      {mode.label}
                    </span>
                    {selectedComfort === mode.id && <Check className="w-3.5 h-3.5 text-brand-400" />}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug">{mode.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Launch Summary Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-brand-500/10 via-teal-500/10 to-transparent border border-brand-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-white">
              Ready to visit: {destination.name}
            </div>
            <div className="text-[11px] text-slate-300 mt-0.5">
              Mode: {selectedExperience} • Comfort: {selectedComfort}
            </div>
          </div>

          <button
            type="button"
            onClick={handleLaunch}
            className="w-full sm:w-auto py-3 px-8 rounded-xl bg-gradient-to-r from-brand-500 to-teal-400 hover:opacity-95 text-white font-semibold text-xs shadow-glow-sky flex items-center justify-center space-x-2 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Launch Virtual Experience</span>
          </button>
        </div>
      </div>
    </div>
  );
};
