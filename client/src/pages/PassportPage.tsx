import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useGamification } from '../context/GamificationContext';
import { DESTINATIONS } from '../data/destinations';
import {
  Award,
  Sparkles,
  Compass,
  CheckCircle2,
  Lock,
  Mountain,
  Palmtree,
  Landmark,
  Shield,
  Star,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const PassportPage: React.FC = () => {
  const { user } = useAuth();
  const { xp, level, stamps, achievements, progressPercent, xpToNextLevel, unlockStamp } = useGamification();

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-semibold">
          <Award className="w-3.5 h-3.5 text-brand-400" />
          <span>Universal Traveler Credentials</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Digital Travel Passport
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Every journey, sensory virtual visit, and completed simulation stamps your immutable digital credentials with XP and milestones.
        </p>
      </div>

      {/* Passport Book Document Presentation Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-10 border border-brand-500/30 shadow-2xl relative overflow-hidden space-y-8 bg-gradient-to-br from-navy-900/90 via-navy-950 to-navy-900">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Passport Top Cover Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                alt={user?.name}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-brand-400/50 shadow-lg"
              />
              <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded bg-teal-500 text-navy-950 text-[9px] font-extrabold">
                LVL {level}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">{user?.name || 'Aria Vance'}</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
                  {user?.travelStyle || 'Peaceful'} Twin
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Passport ID: <span className="font-mono text-brand-300 font-bold">TT-PASS-{user?.id?.slice(-4) || '8839'}</span>
              </p>
              <div className="text-[11px] text-teal-400 mt-1">
                Issued by TravelTwin Global Accessibility Council
              </div>
            </div>
          </div>

          {/* XP & Progress Gauge */}
          <div className="text-left sm:text-right space-y-1.5 sm:border-l sm:border-white/10 sm:pl-6">
            <div className="text-xs text-slate-400">Total Experience Points</div>
            <div className="text-2xl font-extrabold text-white flex items-center sm:justify-end gap-1.5">
              <Sparkles className="w-5 h-5 text-brand-400" />
              <span>{xp} XP</span>
            </div>
            <div className="w-48 bg-slate-800 h-2 rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-gradient-to-r from-brand-400 to-teal-400 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="text-[10px] text-slate-400">{xpToNextLevel} XP until Level {level + 1}</div>
          </div>
        </div>

        {/* DESTINATION STAMPS GRID */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-brand-400" />
              Official Destination Stamps ({stamps.length}/{DESTINATIONS.length})
            </h3>
            <span className="text-xs text-slate-400">300 XP per unlocked stamp</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {DESTINATIONS.map((d) => {
              const stamp = stamps.find((s) => s.destinationId === d.id);
              const isUnlocked = !!stamp;

              return (
                <div
                  key={d.id}
                  className={`p-4 rounded-2xl border text-center transition-all relative group flex flex-col justify-between ${
                    isUnlocked
                      ? 'bg-brand-500/10 border-brand-400/50 shadow-glow-sky'
                      : 'bg-white/5 border-white/10 opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="space-y-2">
                    {/* Stamp Circular Emblem */}
                    <div
                      className={`w-14 h-14 mx-auto rounded-full border-2 border-dashed flex items-center justify-center transition-transform group-hover:rotate-6 ${
                        isUnlocked
                          ? 'border-brand-400 text-brand-300 bg-brand-500/20'
                          : 'border-slate-600 text-slate-500 bg-slate-900/50'
                      }`}
                    >
                      {isUnlocked ? (
                        <div className="text-center">
                          <span className="text-xs font-black uppercase tracking-tighter block leading-none">
                            {d.id.slice(0, 3)}
                          </span>
                          <span className="text-[8px] text-teal-300 font-bold uppercase">VISA</span>
                        </div>
                      ) : (
                        <Lock className="w-4 h-4" />
                      )}
                    </div>

                    <div>
                      <div className="text-xs font-bold text-white truncate">{d.name.split(' ')[0]}</div>
                      <div className="text-[10px] text-slate-400">{d.region}</div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-white/5">
                    {isUnlocked ? (
                      <span className="text-[9px] text-teal-300 font-bold block">
                        STAMPED {stamp?.unlockedAt}
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => unlockStamp(d.id, 'Virtual Visit')}
                        className="w-full py-1 rounded-md bg-white/10 hover:bg-brand-500 hover:text-white text-[10px] font-semibold text-slate-300 transition-colors"
                      >
                        Claim Stamp
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ACHIEVEMENTS & BADGES */}
        <div className="space-y-4 pt-6 border-t border-white/10">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Star className="w-4 h-4 text-teal-400" />
              Explorer Achievements
            </h3>
            <span className="text-xs text-slate-400">
              {achievements.filter((a) => a.unlocked).length} of {achievements.length} Unlocked
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((ach) => (
              <div
                key={ach.id}
                className={`p-4 rounded-2xl border transition-all flex items-start space-x-3 ${
                  ach.unlocked
                    ? 'bg-teal-500/10 border-teal-400/40'
                    : 'bg-white/5 border-white/5 opacity-60'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    ach.unlocked ? 'bg-teal-500/20 text-teal-300' : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-white">{ach.title}</span>
                    {ach.unlocked && <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />}
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug">{ach.description}</p>
                  <div className="text-[10px] text-slate-500 pt-0.5">
                    Progress: {ach.progress}/{ach.maxProgress}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
