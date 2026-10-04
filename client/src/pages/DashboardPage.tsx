import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGamification } from '../context/GamificationContext';
import { DESTINATIONS } from '../data/destinations';
import {
  Sparkles,
  Award,
  Compass,
  Headphones,
  SlidersHorizontal,
  Camera,
  ArrowRight,
  TrendingUp,
  MapPin,
  Calendar,
  Layers,
  CheckCircle2
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    xp,
    level,
    progressPercent,
    xpToNextLevel,
    stamps,
    memories,
    simulations,
    itineraries
  } = useGamification();

  // Clean data structure for Recharts (ready for MongoDB telemetry)
  const xpGrowthData = [
    { date: 'Oct 01', xp: 450 },
    { date: 'Oct 02', xp: 750 },
    { date: 'Oct 03', xp: 1100 },
    { date: 'Oct 04', xp: xp }
  ];

  const travelCategoriesData = [
    { category: 'Mountain', journeys: 3 },
    { category: 'Coastal', journeys: 2 },
    { category: 'Heritage', journeys: 4 },
    { category: 'Nature', journeys: 2 }
  ];

  return (
    <div className="max-w-6xl mx-auto py-8 space-y-10">
      {/* Welcome & Continue Journey Hero */}
      <div className="glass-card rounded-3xl p-6 sm:p-10 border border-brand-500/20 shadow-2xl relative overflow-hidden space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
              <span>Personal Traveler Command Center</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Welcome back, {user?.name || 'Explorer'}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Your Travel Twin is calibrated for <strong>{user?.travelStyle || 'Peaceful'}</strong> exploration. You have earned <strong>{xp} XP</strong> across your journeys.
            </p>
          </div>

          {/* Continue Journey Callout */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 shrink-0 md:w-72">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white">Current Journey: Kashmir</span>
              <span className="text-teal-400 font-semibold text-[10px]">IN PROGRESS</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Dal Lake morning floating pavilion and saffron tea tasting ready.
            </p>
            <button
              type="button"
              onClick={() => navigate('/experience/kashmir')}
              className="w-full py-2 px-4 rounded-xl bg-gradient-to-r from-brand-500 to-teal-400 hover:opacity-95 text-white font-semibold text-xs shadow-glow-sky flex items-center justify-center gap-1.5 transition-all"
            >
              <Headphones className="w-3.5 h-3.5" />
              <span>Continue 3D Journey</span>
            </button>
          </div>
        </div>

        {/* Level Progression Progress Bar */}
        <div className="space-y-2 pt-2 border-t border-white/10">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-200">
              Travel Twin Level {level} Explorer
            </span>
            <span className="text-slate-400 text-[11px]">
              {xpToNextLevel} XP needed for Level {level + 1}
            </span>
          </div>
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5 border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-brand-400 via-sky-400 to-teal-400 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 4 Primary Metric Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-brand-400" />
            Destinations Explored
          </span>
          <div className="text-2xl font-extrabold text-white">{stamps.length}</div>
          <div className="text-[10px] text-slate-400">Across {DESTINATIONS.length} available sanctuaries</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
            <Headphones className="w-3.5 h-3.5 text-teal-400" />
            Virtual Journeys
          </span>
          <div className="text-2xl font-extrabold text-teal-300">
            {stamps.filter((s) => s.experienceType === 'Virtual Visit').length + 2}
          </div>
          <div className="text-[10px] text-slate-400">100% sensory inclusive</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-sky-400" />
            Simulations Run
          </span>
          <div className="text-2xl font-extrabold text-sky-300">
            {simulations.length > 0 ? simulations.length : 1}
          </div>
          <div className="text-[10px] text-slate-400">Full telemetry assessed</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
            <Camera className="w-3.5 h-3.5 text-purple-400" />
            Travel Memories
          </span>
          <div className="text-2xl font-extrabold text-purple-300">{memories.length}</div>
          <div className="text-[10px] text-slate-400">Captured reflections</div>
        </div>
      </div>

      {/* Recharts Visual Statistics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* XP Growth Chart */}
        <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-400" />
              XP Progression & Explorer Momentum
            </h3>
            <span className="text-xs text-brand-300 font-semibold">{xp} Total XP</span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={xpGrowthData}>
                <defs>
                  <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#070d1e',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    fontSize: '11px',
                    color: '#fff'
                  }}
                />
                <Area type="monotone" dataKey="xp" stroke="#38bdf8" strokeWidth={2} fillOpacity={1} fill="url(#colorXp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Travel Style Categories Breakdown */}
        <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-teal-400" />
              Landscape & Sanctuary Distribution
            </h3>
            <span className="text-xs text-slate-400">Virtual & Real Sessions</span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={travelCategoriesData}>
                <XAxis dataKey="category" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#070d1e',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    fontSize: '11px',
                    color: '#fff'
                  }}
                />
                <Bar dataKey="journeys" fill="#2dd4bf" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Saved Itineraries & Recent Memories Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Saved Trips */}
        <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Saved AI Travel Plans ({itineraries.length})</h3>
            <Link to="/explore" className="text-xs text-brand-400 hover:text-brand-300 font-semibold">
              New Plan +
            </Link>
          </div>

          {itineraries.length > 0 ? (
            <div className="space-y-3">
              {itineraries.map((it) => (
                <div key={it.id} className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{it.title}</span>
                    <span className="text-teal-400 text-[10px] font-mono">{it.totalEstimatedBudget}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{it.summary}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-slate-400 bg-white/5 rounded-xl space-y-2">
              <p>No saved itineraries yet.</p>
              <button
                type="button"
                onClick={() => navigate('/simulate')}
                className="px-4 py-1.5 rounded-lg bg-teal-500 text-white font-semibold text-xs"
              >
                Run Simulation & Plan
              </button>
            </div>
          )}
        </div>

        {/* Recent Memories */}
        <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Recent Memories ({memories.length})</h3>
            <Link to="/memories" className="text-xs text-brand-400 hover:text-brand-300 font-semibold">
              View Gallery →
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {memories.slice(0, 2).map((m) => (
              <div key={m.id} className="rounded-xl overflow-hidden bg-navy-900 border border-white/5">
                <img src={m.image} alt={m.destinationName} className="h-24 w-full object-cover" />
                <div className="p-2 space-y-0.5">
                  <div className="text-[11px] font-bold text-white truncate">{m.destinationName}</div>
                  <p className="text-[10px] text-slate-400 line-clamp-1 italic">"{m.caption}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
