import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { DESTINATIONS } from '../data/destinations';
import { Hotspot } from '../types';
import { VirtualExperienceScene } from '../three/VirtualExperienceScene';
import { AIGuidePanel } from '../components/AIGuidePanel';
import { useGamification } from '../context/GamificationContext';
import {
  Compass,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Bot,
  MapPin,
  Camera,
  CheckCircle2,
  X,
  Sparkles,
  Award,
  ChevronRight,
  Info,
  Layers,
  ArrowLeft
} from 'lucide-react';

export const ExperiencePage: React.FC = () => {
  const { destinationId } = useParams<{ destinationId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addXp, unlockStamp, addMemory } = useGamification();

  const containerRef = useRef<HTMLDivElement>(null);

  const destination = DESTINATIONS.find((d) => d.id === destinationId) || DESTINATIONS[0];

  const experienceType = searchParams.get('experience') || 'Peaceful';
  const comfortMode = searchParams.get('comfort') || 'Normal';

  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);
  const [isAIGuideOpen, setIsAIGuideOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [audioNarration, setAudioNarration] = useState(true);
  const [completedActivities, setCompletedActivities] = useState<string[]>([]);
  const [journeyCompleted, setJourneyCompleted] = useState(false);
  const [memoryModalOpen, setMemoryModalOpen] = useState(false);
  const [memoryCaption, setMemoryCaption] = useState('');
  const [activeTab, setActiveTab] = useState<'view' | 'hotspots' | 'activities'>('view');

  // Trigger speech narration when hotspot is selected
  useEffect(() => {
    if (activeHotspot?.audioNarration && audioNarration && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(activeHotspot.audioNarration);
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  }, [activeHotspot, audioNarration]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  const handleActivityClick = (act: string) => {
    if (completedActivities.includes(act)) return;

    const updated = [...completedActivities, act];
    setCompletedActivities(updated);
    addXp(120, `Completed Activity: ${act}`);

    if (updated.length >= 2 && !journeyCompleted) {
      setJourneyCompleted(true);
      unlockStamp(destination.id, 'Virtual Visit');
    }
  };

  const handleSaveMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memoryCaption.trim()) return;

    addMemory({
      destinationId: destination.id,
      destinationName: destination.name,
      caption: memoryCaption,
      image: destination.image,
      date: new Date().toISOString().split('T')[0],
      tags: [destination.name, 'Virtual Visit', experienceType],
      userId: 'user-demo-1'
    });

    setMemoryModalOpen(false);
    setMemoryCaption('');
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden rounded-3xl border border-brand-500/20 shadow-2xl bg-navy-950 flex flex-col ${
        isFullscreen ? 'h-screen rounded-none' : 'h-[85vh] min-h-[640px]'
      }`}
    >
      {/* 3D WebGL Canvas Layer */}
      <div className="absolute inset-0 z-0">
        <VirtualExperienceScene
          destination={destination}
          activeHotspot={activeHotspot}
          onSelectHotspot={(h) => setActiveHotspot(h)}
          onActivityComplete={(act) => handleActivityClick(act)}
          completedActivities={completedActivities}
        />
      </div>

      {/* Top HUD Bar */}
      <div className="relative z-10 p-4 sm:p-6 flex items-center justify-between pointer-events-none">
        {/* Destination & Mode Badge */}
        <div className="glass-panel px-4 py-2.5 rounded-2xl border border-white/10 flex items-center space-x-3 pointer-events-auto backdrop-blur-xl">
          <button
            type="button"
            onClick={() => navigate('/virtual-visit')}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
            title="Exit Experience"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white leading-none">{destination.name}</span>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 font-semibold border border-brand-500/30">
                {experienceType}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Simulated 3D Environment • Comfort: {comfortMode}
            </p>
          </div>
        </div>

        {/* Top Right Controls */}
        <div className="flex items-center space-x-2 pointer-events-auto">
          {/* Audio toggle */}
          <button
            type="button"
            onClick={() => {
              setAudioNarration(!audioNarration);
              if (audioNarration && 'speechSynthesis' in window) {
                window.speechSynthesis.cancel();
              }
            }}
            className="p-2.5 rounded-xl glass-panel border border-white/10 text-slate-300 hover:text-white transition-colors"
            title={audioNarration ? 'Mute Spatial Audio Narration' : 'Enable Spatial Audio Narration'}
          >
            {audioNarration ? <Volume2 className="w-4 h-4 text-brand-400" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* AI Guide Button */}
          <button
            type="button"
            onClick={() => setIsAIGuideOpen(!isAIGuideOpen)}
            className={`p-2.5 rounded-xl border flex items-center gap-1.5 text-xs font-semibold transition-all ${
              isAIGuideOpen
                ? 'bg-brand-500 text-white shadow-glow-sky border-brand-400'
                : 'glass-panel border-white/10 text-slate-200 hover:text-white'
            }`}
          >
            <Bot className="w-4 h-4 text-brand-400" />
            <span className="hidden sm:inline">AI Guide</span>
          </button>

          {/* Fullscreen Button */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2.5 rounded-xl glass-panel border border-white/10 text-slate-300 hover:text-white transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Floating Center Notification when Milestone/Activity completed */}
      {journeyCompleted && (
        <div className="relative z-20 mx-auto mt-2 max-w-md w-[90%] glass-card p-3 rounded-2xl border border-teal-500/40 text-center animate-bounce-subtle pointer-events-auto">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-teal-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-teal-400" />
              Journey Milestone Unlocked!
            </span>
            <button
              onClick={() => navigate('/passport')}
              className="text-[10px] text-brand-400 hover:underline font-semibold"
            >
              View Passport Stamp →
            </button>
          </div>
        </div>
      )}

      {/* Middle Interactive Zone */}
      <div className="flex-1 relative z-10 pointer-events-none p-4 sm:p-6 flex items-end justify-between">
        {/* Left Side: Minimap HUD & Hotspots Quick Access */}
        <div className="pointer-events-auto max-w-xs w-full space-y-2">
          {/* Active Hotspot Modal Card */}
          {activeHotspot && (
            <div className="glass-card rounded-2xl p-4 border border-brand-400/40 shadow-2xl space-y-2 backdrop-blur-xl animate-fade-in text-xs">
              <div className="flex items-center justify-between pb-1 border-b border-white/10">
                <span className="text-[10px] uppercase font-bold text-brand-400 tracking-wider flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {activeHotspot.category} Hotspot
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setActiveHotspot(null);
                    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                  }}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <h4 className="font-bold text-white text-sm">{activeHotspot.title}</h4>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {activeHotspot.description}
              </p>

              {activeHotspot.audioNarration && (
                <div className="p-2 rounded-xl bg-white/5 border border-white/5 text-[10px] text-slate-400 italic">
                  "{activeHotspot.audioNarration}"
                </div>
              )}

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleActivityClick(`Explore ${activeHotspot.title}`)}
                  className="flex-1 py-1.5 rounded-lg bg-brand-500 hover:bg-brand-400 text-white font-semibold text-[11px] shadow-glow-sky"
                >
                  Complete Exploration (+120 XP)
                </button>
              </div>
            </div>
          )}

          {/* Minimap HUD Box */}
          <div className="glass-panel p-3 rounded-2xl border border-white/10 space-y-2 backdrop-blur-md">
            <div className="flex items-center justify-between text-[11px] text-slate-300">
              <span className="font-semibold flex items-center gap-1">
                <Compass className="w-3 h-3 text-brand-400" />
                Minimap HUD
              </span>
              <span className="text-[10px] text-teal-400">
                {destination.hotspots.length} Hotspots
              </span>
            </div>
            {/* Visual radar area */}
            <div className="relative h-20 w-full rounded-xl bg-navy-950/80 border border-white/5 overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.15)_0%,transparent_70%)]" />
              <div className="w-12 h-12 rounded-full border border-brand-400/20" />
              <div className="w-4 h-4 rounded-full bg-brand-400/30 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-ping" />
              </div>

              {/* Hotspot blips on radar */}
              {destination.hotspots.map((h, i) => (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => setActiveHotspot(h)}
                  title={h.title}
                  className={`absolute w-2 h-2 rounded-full ${
                    activeHotspot?.id === h.id ? 'bg-teal-400 ring-2 ring-teal-200' : 'bg-brand-400'
                  }`}
                  style={{
                    left: `${50 + h.position[0] * 7}%`,
                    top: `${50 + h.position[2] * 5}%`
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: AI Guide Drawer / Panel */}
        <div className="pointer-events-auto">
          <AIGuidePanel
            destination={destination}
            isOpen={isAIGuideOpen}
            onClose={() => setIsAIGuideOpen(false)}
          />
        </div>
      </div>

      {/* Bottom Floating Control Bar */}
      <div className="relative z-10 p-4 border-t border-white/10 glass-panel flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        {/* Navigation & Controls instructions */}
        <div className="flex items-center space-x-2 text-slate-300">
          <span className="text-[10px] uppercase font-bold text-slate-400">Controls:</span>
          <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[10px]">
            Left Click & Drag: Look Around
          </span>
          <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[10px]">
            Scroll: Zoom
          </span>
          <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[10px]">
            Click Gems: Hotspots
          </span>
        </div>

        {/* Action Buttons: Activity, Memory, Complete */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setMemoryModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium flex items-center space-x-1.5 transition-colors"
          >
            <Camera className="w-3.5 h-3.5 text-teal-400" />
            <span>Take Photo Memory</span>
          </button>

          <button
            type="button"
            onClick={() => {
              unlockStamp(destination.id, 'Virtual Visit');
              navigate('/passport');
            }}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-brand-500 to-teal-400 hover:opacity-95 text-white font-semibold shadow-glow-sky flex items-center space-x-1.5 transition-all"
          >
            <Award className="w-3.5 h-3.5" />
            <span>End Journey & Claim XP</span>
          </button>
        </div>
      </div>

      {/* Memory Capture Modal */}
      {memoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-fade-in pointer-events-auto">
          <div className="glass-card max-w-md w-full rounded-2xl p-6 border border-white/15 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <Camera className="w-5 h-5 text-teal-400" />
                <h3 className="font-bold text-white text-base">Capture Virtual Memory</h3>
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
                  {destination.name} (Virtual Vista)
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Journal Note / Caption</label>
                <textarea
                  rows={3}
                  value={memoryCaption}
                  onChange={(e) => setMemoryCaption(e.target.value)}
                  placeholder="What feelings or sights stood out during your virtual exploration?"
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
                  <span>Save Memory (+150 XP)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
