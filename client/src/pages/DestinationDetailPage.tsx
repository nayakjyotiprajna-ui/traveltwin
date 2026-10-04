import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { DESTINATIONS } from '../data/destinations';
import { useGamification } from '../context/GamificationContext';
import {
  Compass,
  ArrowRight,
  Headphones,
  SlidersHorizontal,
  Award,
  Camera,
  Calendar,
  DollarSign,
  Clock,
  Accessibility,
  CheckCircle2,
  Utensils,
  MapPin,
  Sparkles,
  Heart,
  Share2,
  X
} from 'lucide-react';

export const DestinationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { unlockStamp, addMemory, stamps } = useGamification();

  const destination = DESTINATIONS.find((d) => d.id === id);

  const [memoryModalOpen, setMemoryModalOpen] = useState(false);
  const [caption, setCaption] = useState('');
  const [stampFeedback, setStampFeedback] = useState<string | null>(null);

  if (!destination) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Destination Not Found</h2>
        <p className="text-xs text-slate-400">The destination you requested does not exist or has moved.</p>
        <Link to="/explore" className="inline-block px-4 py-2 rounded-xl bg-brand-500 text-white text-xs">
          Return to Explore
        </Link>
      </div>
    );
  }

  const isStamped = stamps.some((s) => s.destinationId === destination.id);

  const handleUnlockStamp = () => {
    const success = unlockStamp(destination.id, 'Virtual Visit');
    if (success) {
      setStampFeedback('Passport Stamp Added! +300 XP');
    } else {
      setStampFeedback('Already collected in your Digital Passport.');
    }
    setTimeout(() => setStampFeedback(null), 4000);
  };

  const handleSaveMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim()) return;

    addMemory({
      destinationId: destination.id,
      destinationName: destination.name,
      caption,
      image: destination.image,
      date: new Date().toISOString().split('T')[0],
      tags: [destination.region, destination.categories[0]],
      userId: 'user-demo-1'
    });

    setCaption('');
    setMemoryModalOpen(false);
  };

  return (
    <div className="space-y-12 py-6">
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden h-[380px] sm:h-[460px] border border-white/10 shadow-2xl">
        <img
          src={destination.image}
          alt={destination.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/50 to-transparent" />

        {/* Floating Top Controls */}
        <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
          <Link
            to="/explore"
            className="px-3.5 py-1.5 rounded-full bg-navy-900/80 backdrop-blur-md text-xs text-slate-300 hover:text-white border border-white/10 transition-colors flex items-center gap-1.5"
          >
            <Compass className="w-3.5 h-3.5 text-brand-400" />
            <span>All Destinations</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs font-semibold backdrop-blur-md">
              {destination.region}, {destination.country}
            </span>
          </div>
        </div>

        {/* Hero Title & Primary CTAs */}
        <div className="absolute bottom-6 left-6 right-6 space-y-4">
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight drop-shadow-lg">
              {destination.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed drop-shadow">
              {destination.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate(`/experience/${destination.id}`)}
              className="py-3 px-6 rounded-xl bg-gradient-to-r from-brand-500 to-teal-400 hover:opacity-95 text-white font-semibold text-xs flex items-center space-x-2 shadow-glow-sky transition-all"
            >
              <Headphones className="w-4 h-4" />
              <span>Start Virtual Visit</span>
            </button>

            <button
              type="button"
              onClick={() => navigate(`/simulate?destination=${destination.id}`)}
              className="py-3 px-6 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs flex items-center space-x-2 border border-white/15 transition-all"
            >
              <SlidersHorizontal className="w-4 h-4 text-teal-400" />
              <span>Simulate This Trip</span>
            </button>

            <button
              type="button"
              onClick={handleUnlockStamp}
              className={`py-3 px-4 rounded-xl text-xs font-semibold flex items-center space-x-1.5 border transition-all ${
                isStamped
                  ? 'bg-brand-500/20 text-brand-300 border-brand-500/40'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
              }`}
            >
              <Award className="w-4 h-4 text-brand-400" />
              <span>{isStamped ? 'Passport Stamped' : 'Add To Passport'}</span>
            </button>

            <button
              type="button"
              onClick={() => setMemoryModalOpen(true)}
              className="py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-xs font-semibold flex items-center space-x-1.5 transition-all"
            >
              <Camera className="w-4 h-4 text-teal-400" />
              <span>Save Memory</span>
            </button>
          </div>

          {stampFeedback && (
            <div className="inline-block px-3 py-1 rounded-lg bg-teal-500/20 text-teal-300 text-xs border border-teal-500/30 animate-fade-in">
              {stampFeedback}
            </div>
          )}
        </div>
      </div>

      {/* Grid: Details & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (8 cols): Culture, Food, Attractions, Activities */}
        <div className="lg:col-span-8 space-y-8">
          {/* Culture & Heritage */}
          <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-400" />
              Culture & Heritage
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">{destination.culture}</p>
          </div>

          {/* Famous Cuisine */}
          <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Utensils className="w-4 h-4 text-teal-400" />
              Local Culinary Delicacies
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {destination.food.map((dish, i) => (
                <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/5 text-xs text-slate-200 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                  <span>{dish}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Attractions */}
          <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-sky-400" />
              Signature Landmarks & Attractions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {destination.attractions.map((attr, i) => (
                <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/5 text-xs text-slate-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" />
                  <span>{attr}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Activities */}
          <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-brand-400" />
              Simulated & Live Activities
            </h2>
            <div className="space-y-2 pt-1">
              {destination.activities.map((act, i) => (
                <div key={i} className="p-3 rounded-xl bg-navy-900/60 border border-white/5 text-xs text-slate-300 flex items-center justify-between">
                  <span>{act}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-brand-500/20 text-brand-300">
                    Interactive
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Meta Info, Accessibility, Timing & Budget */}
        <div className="lg:col-span-4 space-y-6">
          {/* Practical Trip Parameters */}
          <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Travel Parameters
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-200">Best Time to Visit</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">{destination.bestTime}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <DollarSign className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-200">Estimated Budget</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    {destination.budget.level} • approx ${destination.budget.estimatedPerDay} {destination.budget.currency}/day
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-200">Suggested Duration</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">{destination.estimatedDuration}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Accessibility Assessment Card */}
          <div className="glass-card rounded-2xl p-6 border border-teal-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Accessibility className="w-4 h-4 text-teal-400" />
                Accessibility Audit
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-500/20 text-teal-300">
                SCORE {destination.accessibility.restAreasScore}/10
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span>Step-Free Ramp Access:</span>
                <span className={destination.accessibility.wheelchairAccessible ? 'text-teal-400 font-semibold' : 'text-slate-400'}>
                  {destination.accessibility.wheelchairAccessible ? 'Verified Yes' : 'Partial / Stepped'}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Audio Guides Available:</span>
                <span className="text-teal-400 font-semibold">Yes (Spatial Audio)</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Physical Demand:</span>
                <span className="text-slate-300">
                  {destination.accessibility.lowPhysicalDemand ? 'Gentle / Relaxed' : 'Moderate Incline'}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-white/10 space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-300 block">Accessibility Highlights:</span>
              <ul className="space-y-1 text-[11px] text-slate-400">
                {destination.accessibility.highlights.map((h, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-teal-400 mt-1">•</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Save Memory Modal */}
      {memoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-fade-in">
          <div className="glass-card max-w-md w-full rounded-2xl p-6 border border-white/15 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <Camera className="w-5 h-5 text-teal-400" />
                <h3 className="font-bold text-white text-base">Capture Destination Memory</h3>
              </div>
              <button
                type="button"
                onClick={() => setMemoryModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMemory} className="space-y-4">
              <div className="rounded-xl overflow-hidden h-32 relative">
                <img src={destination.image} alt={destination.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 to-transparent" />
                <span className="absolute bottom-2 left-2 text-xs font-bold text-white">
                  {destination.name}
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Journal Note / Caption</label>
                <textarea
                  rows={3}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Record your thoughts, sensory reflections, or moments of wonder..."
                  required
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-brand-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setMemoryModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-white text-xs font-semibold shadow-glow-teal flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Save to Memories (+150 XP)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
