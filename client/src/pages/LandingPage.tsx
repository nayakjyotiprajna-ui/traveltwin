import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Globe2,
  Sparkles,
  Compass,
  ArrowRight,
  Headphones,
  SlidersHorizontal,
  Users,
  Award,
  ShieldCheck,
  Accessibility,
  HeartHandshake,
  CheckCircle2,
  Calendar,
  Layers,
  MapPin
} from 'lucide-react';
import { EarthGlobe } from '../three/EarthGlobe';
import { DESTINATIONS } from '../data/destinations';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-24 sm:space-y-32">
      {/* 1. HERO SECTION */}
      <section className="relative pt-6 sm:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 space-y-6"
          >
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
              <span>Next-Gen Virtual Tourism & Simulation</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
              Your Journey Doesn't Need a{' '}
              <span className="text-gradient">Passport.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
              Experience the world virtually, plan your real journey confidently, and create lifelong memories wherever you are. Powered by AI and sensory-inclusive 3D technology.
            </p>

            {/* Hero Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Link
                to="/onboarding"
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-brand-500 via-sky-500 to-teal-400 text-white font-semibold text-sm flex items-center justify-center space-x-2 shadow-glow-sky hover:opacity-95 transition-all group"
              >
                <span>Start My Journey</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/explore"
                className="px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold text-sm flex items-center justify-center space-x-2 border border-white/15 transition-all"
              >
                <Compass className="w-4 h-4 text-brand-400" />
                <span>Explore Destinations</span>
              </Link>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
              <div>
                <div className="text-2xl font-bold text-white">6+</div>
                <div className="text-xs text-slate-400">Curated Sanctuaries</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-teal-400">100%</div>
                <div className="text-xs text-slate-400">Sensory Accessible</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-brand-400">Zero</div>
                <div className="text-xs text-slate-400">Travel Restrictions</div>
              </div>
            </div>
          </motion.div>

          {/* Hero Right: 3D Earth Globe */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:col-span-6"
          >
            <EarthGlobe />
          </motion.div>
        </div>
      </section>

      {/* 2. CHOOSE HOW YOU WANT TO TRAVEL */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Choose How You Want To Travel
          </h2>
          <p className="text-sm text-slate-400">
            Tailored journeys for both virtual explorers seeking access and real-world planners seeking confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Virtual Visit */}
          <motion.div
            whileHover={{ y: -4 }}
            className="glass-card rounded-2xl p-8 border border-brand-500/20 shadow-2xl relative overflow-hidden group flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="space-y-5">
              <div className="w-12 h-12 rounded-xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400">
                <Headphones className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-400">
                  Mode 01 • Inclusive Tourism
                </span>
                <h3 className="text-2xl font-bold text-white mt-1">
                  "I Can't Travel Right Now"
                </h3>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                Explore destinations virtually and experience places from wherever you are. Built specifically for users with health or mobility limitations, financial or age barriers, or tight schedules.
              </p>
              <ul className="space-y-2 text-xs text-slate-300 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Interactive 3D hotspots with spatial narration</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Vestibular-safe low-motion and audio modes</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Real-time AI Cultural Guide answers questions</span>
                </li>
              </ul>
            </div>
            <div className="pt-8">
              <button
                type="button"
                onClick={() => navigate('/virtual-visit')}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-brand-400 hover:from-brand-500 hover:to-brand-300 text-white font-semibold text-xs flex items-center justify-center space-x-2 shadow-glow-sky transition-all"
              >
                <span>Start Virtual Visit</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

          {/* Card 2: Pre-Travel Simulation */}
          <motion.div
            whileHover={{ y: -4 }}
            className="glass-card rounded-2xl p-8 border border-teal-500/20 shadow-2xl relative overflow-hidden group flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="space-y-5">
              <div className="w-12 h-12 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
                <SlidersHorizontal className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400">
                  Mode 02 • Trip Confidence
                </span>
                <h3 className="text-2xl font-bold text-white mt-1">
                  "I'm Planning A Real Trip"
                </h3>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                Simulate your journey before travelling. Test hotel, transportation, road difficulty, crowd density, weather conditions, accessibility constraints, and estimated budget.
              </p>
              <ul className="space-y-2 text-xs text-slate-300 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" />
                  <span>Multi-stage route simulation (Hotel → Crowd → Weather)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" />
                  <span>Full accessibility & mobility challenge forecasting</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" />
                  <span>1-Click AI Day-by-Day Itinerary Generation</span>
                </li>
              </ul>
            </div>
            <div className="pt-8">
              <button
                type="button"
                onClick={() => navigate('/simulate')}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-teal-600 to-teal-400 hover:from-teal-500 hover:to-teal-300 text-white font-semibold text-xs flex items-center justify-center space-x-2 shadow-glow-teal transition-all"
              >
                <span>Plan My Trip</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. HOW TRAVELTWIN WORKS */}
      <section className="space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-400">
            Frictionless Flow
          </span>
          <h2 className="text-3xl font-bold text-white tracking-tight">
            How TravelTwin Works
          </h2>
          <p className="text-sm text-slate-400">
            A seamless bridge between intelligent AI matching, interactive 3D simulation, and gamified memories.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold text-base">
              01
            </div>
            <h3 className="text-lg font-bold text-white">Create Your Travel Twin</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Define your travel personality, sensory comfort needs, accessibility parameters, and dream destinations in a 60-second onboarding wizard.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-base">
              02
            </div>
            <h3 className="text-lg font-bold text-white">Visit or Simulate</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Dive into peaceful 3D virtual landscapes with ambient spatial audio, or run a high-precision multi-stage journey simulation before boarding.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-base">
              03
            </div>
            <h3 className="text-lg font-bold text-white">Stamp Passport & Earn XP</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Collect digital destination passport stamps, capture journal memories, invite friends into co-op rooms, and level up your global explorer profile.
            </p>
          </div>
        </div>
      </section>

      {/* 4. FEATURED DESTINATIONS */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
              Interactive Sanctuaries
            </span>
            <h2 className="text-3xl font-bold text-white tracking-tight">
              Featured Destinations
            </h2>
            <p className="text-sm text-slate-400">
              Curated locations optimized for 3D exploration and pre-trip simulation.
            </p>
          </div>
          <Link
            to="/explore"
            className="text-xs text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1.5"
          >
            <span>View All Destinations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DESTINATIONS.map((dest) => (
            <motion.div
              key={dest.id}
              whileHover={{ y: -4 }}
              className="glass-card rounded-2xl overflow-hidden border border-white/10 group flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-transparent" />
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-navy-900/80 backdrop-blur-md text-[10px] font-semibold text-brand-300 border border-white/10">
                    {dest.region}
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
                    <span className="text-white font-bold text-base drop-shadow-md">{dest.name}</span>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {dest.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {dest.categories.map((c) => (
                      <span
                        key={c}
                        className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] text-slate-300 border border-white/5"
                      >
                        {c}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 text-teal-300">
                      <Accessibility className="w-3.5 h-3.5" />
                      {dest.accessibility.wheelchairAccessible ? 'Step-Free / Accessible' : 'Sensory Virtual Ready'}
                    </span>
                    <span>{dest.budget.level} • {dest.estimatedDuration}</span>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => navigate(`/destination/${dest.id}`)}
                  className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-medium transition-colors"
                >
                  Explore Details
                </button>
                <button
                  type="button"
                  onClick={() => navigate(`/experience/${dest.id}`)}
                  className="py-2 px-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-white text-xs font-semibold shadow-glow-sky transition-colors"
                >
                  Virtual 3D
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. AI TRAVEL TWIN & DIRECTOR SHOWCASE */}
      <section className="glass-panel rounded-3xl p-8 sm:p-12 border border-brand-500/20 relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              Not Just A Chatbot
            </span>
            <h2 className="text-3xl font-bold text-white tracking-tight">
              Meet Your AI Travel Director
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Express your feelings naturally: <em>"My mood is peaceful and I love mountains."</em> TravelTwin synthesizes your mood, mobility, budget, and travel personality to generate structured recommendations, custom itineraries, and immersive sensory routes.
            </p>
            <div className="pt-2">
              <Link
                to="/travel-twin"
                className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-gradient-to-r from-brand-500 to-teal-400 text-white text-xs font-semibold shadow-glow-sky"
              >
                <span>Consult Travel Director</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="glass-card rounded-2xl p-5 border border-brand-400/30 shadow-2xl space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="text-slate-400">Structured AI Schema Output</span>
                <span className="text-teal-400 font-mono text-[10px]">JSON VALIDATED</span>
              </div>
              <pre className="p-3 bg-navy-950/80 rounded-xl text-brand-300 text-[11px] font-mono overflow-x-auto leading-relaxed border border-white/5">
{`{
  "destination": "Kashmir Valley",
  "mood": "Peaceful & Rejuvenating",
  "experience": "Dal Lake Morning Shikara",
  "activities": ["Saffron Tea Tasting", "Alpine Audio Stroll"],
  "accessibility": ["Low Motion Mode", "Ramp Access"]
}`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TRAVEL TOGETHER (CO-OP) SHOWCASE */}
      <section className="space-y-6">
        <div className="glass-card rounded-3xl p-8 sm:p-12 border border-teal-500/20 relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-bold text-white">Travel Together in Real-Time</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Distance shouldn't keep loved ones apart. Create a private travel room, share room codes, and explore destinations synchronized across screens with real-time avatars and shared milestones.
              </p>
              <div className="pt-2">
                <Link
                  to="/travel-together"
                  className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-white font-semibold text-xs shadow-glow-teal transition-all"
                >
                  <span>Create or Join Room</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-white/10">
                <span>Active Room: #TWIN-7782</span>
                <span className="text-teal-400 font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                  Live Sync
                </span>
              </div>
              <div className="flex -space-x-2 overflow-hidden py-2">
                <img className="inline-block h-9 w-9 rounded-full ring-2 ring-brand-400" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="Explorer 1" />
                <img className="inline-block h-9 w-9 rounded-full ring-2 ring-teal-400" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="Explorer 2" />
                <div className="h-9 w-9 rounded-full bg-navy-900 border border-white/20 flex items-center justify-center text-[10px] text-white font-bold">
                  +3
                </div>
              </div>
              <p className="text-[11px] text-slate-300">
                Currently exploring: <strong>Kashmir Floating Pavilion</strong> • Hotspot synchronized.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. DIGITAL TRAVEL PASSPORT & GAMIFICATION */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-400">
            Gamified Milestones
          </span>
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Digital Travel Passport
          </h2>
          <p className="text-sm text-slate-400">
            Every virtual exploration and simulated journey earns permanent passport stamps, unlockable badges, and XP.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {DESTINATIONS.map((d) => (
            <div
              key={d.id}
              className="glass-card rounded-2xl p-4 text-center border border-white/10 flex flex-col items-center space-y-2 hover:border-brand-400/40 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-brand-500/20 to-teal-500/20 border border-brand-400/30 flex items-center justify-center text-brand-400 text-lg font-bold">
                ✓
              </div>
              <div className="text-xs font-bold text-white truncate w-full">{d.name.split(' ')[0]}</div>
              <span className="text-[10px] text-slate-400">{d.country}</span>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 font-semibold">
                +300 XP
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 8. ACCESSIBILITY & SENSORY EXCELLENCE */}
      <section className="glass-panel rounded-3xl p-8 sm:p-12 border border-teal-500/20 space-y-6">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-teal-400 uppercase tracking-wider">
            <Accessibility className="w-4 h-4" />
            <span>Inclusive First Architecture</span>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Designed for Every Ability, Age, and Sensory Need
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Travel is a fundamental human joy. TravelTwin ensures anyone can travel regardless of wheelchair accessibility, cognitive needs, visual impairments, or vestibular sensitivities.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          <div className="glass-card p-4 rounded-xl border border-white/10 space-y-1.5">
            <div className="text-white font-semibold text-xs">Low Motion Mode</div>
            <p className="text-[11px] text-slate-400">Eliminates disorienting 3D camera sweeps for vestibular comfort.</p>
          </div>
          <div className="glass-card p-4 rounded-xl border border-white/10 space-y-1.5">
            <div className="text-white font-semibold text-xs">Descriptive Audio Guide</div>
            <p className="text-[11px] text-slate-400">Integrated Web Speech narration brings visual vistas to life for low-vision users.</p>
          </div>
          <div className="glass-card p-4 rounded-xl border border-white/10 space-y-1.5">
            <div className="text-white font-semibold text-xs">Verified Step-Free Audits</div>
            <p className="text-[11px] text-slate-400">Ramps, accessible restrooms, and elevator telemetry on real-world simulators.</p>
          </div>
          <div className="glass-card p-4 rounded-xl border border-white/10 space-y-1.5">
            <div className="text-white font-semibold text-xs">High Contrast & Scaling</div>
            <p className="text-[11px] text-slate-400">Compliant with WCAG 2.1 AA readability standards across all viewports.</p>
          </div>
        </div>
      </section>

      {/* 9. FINAL CALL TO ACTION */}
      <section className="text-center py-12 space-y-6 glass-panel rounded-3xl p-8 border border-brand-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-500/10 via-teal-500/10 to-transparent pointer-events-none" />
        <div className="max-w-2xl mx-auto space-y-4 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            The Entire World is Waiting For You.
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Begin your virtual adventure or simulate your upcoming journey with the AI Travel Twin platform today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-brand-500 to-teal-400 text-white font-semibold text-sm shadow-glow-sky hover:opacity-95 transition-all"
            >
              Create Free Account
            </Link>
            <Link
              to="/virtual-visit"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm border border-white/15 transition-all"
            >
              Launch Instant Visit
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
