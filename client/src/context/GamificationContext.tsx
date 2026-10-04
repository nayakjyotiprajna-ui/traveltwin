import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { PassportStamp, Achievement, Memory, SimulationResult, Itinerary } from '../types';
import { SAMPLE_ACHIEVEMENTS, DESTINATIONS } from '../data/destinations';

interface GamificationContextType {
  xp: number;
  level: number;
  xpToNextLevel: number;
  progressPercent: number;
  stamps: PassportStamp[];
  achievements: Achievement[];
  memories: Memory[];
  simulations: SimulationResult[];
  itineraries: Itinerary[];
  addXp: (amount: number, reason: string) => void;
  unlockStamp: (destinationId: string, experienceType: 'Virtual Visit' | 'Simulation' | 'Shared Journey') => boolean;
  addMemory: (memory: Omit<Memory, 'id'>) => void;
  deleteMemory: (id: string) => void;
  updateMemoryCaption: (id: string, caption: string) => void;
  saveSimulation: (result: SimulationResult) => void;
  saveItinerary: (itinerary: Itinerary) => void;
  lastAward: { amount: number; reason: string } | null;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

const INITIAL_STAMPS: PassportStamp[] = [
  {
    id: 'stamp-1',
    destinationId: 'kashmir',
    destinationName: 'Kashmir Valley',
    country: 'India',
    unlockedAt: '2026-10-01',
    icon: 'Mountain',
    color: '#38bdf8',
    experienceType: 'Virtual Visit',
    xpEarned: 250
  },
  {
    id: 'stamp-2',
    destinationId: 'goa',
    destinationName: 'Goa Coastal Sanctuary',
    country: 'India',
    unlockedAt: '2026-10-02',
    icon: 'Palmtree',
    color: '#2dd4bf',
    experienceType: 'Simulation',
    xpEarned: 200
  }
];

const INITIAL_MEMORIES: Memory[] = [
  {
    id: 'mem-1',
    destinationId: 'kashmir',
    destinationName: 'Kashmir Valley',
    caption: 'Sunset over Dal Lake with gentle waves touching the cedar wood shikara.',
    image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80',
    date: '2026-10-01',
    tags: ['Sunset', 'Peaceful', 'Shikara'],
    userId: 'user-demo-1'
  },
  {
    id: 'mem-2',
    destinationId: 'goa',
    destinationName: 'Goa Coastal Sanctuary',
    caption: 'Quiet pastel alleys of Fontainhas Latin Quarter during gentle morning breeze.',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    date: '2026-10-02',
    tags: ['Architecture', 'Heritage', 'Colors'],
    userId: 'user-demo-1'
  }
];

export const GamificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [xp, setXp] = useState<number>(() => {
    const saved = localStorage.getItem('traveltwin_xp');
    return saved ? parseInt(saved, 10) : 1450;
  });

  const [stamps, setStamps] = useState<PassportStamp[]>(() => {
    const saved = localStorage.getItem('traveltwin_stamps');
    return saved ? JSON.parse(saved) : INITIAL_STAMPS;
  });

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem('traveltwin_achievements');
    return saved ? JSON.parse(saved) : SAMPLE_ACHIEVEMENTS;
  });

  const [memories, setMemories] = useState<Memory[]>(() => {
    const saved = localStorage.getItem('traveltwin_memories');
    return saved ? JSON.parse(saved) : INITIAL_MEMORIES;
  });

  const [simulations, setSimulations] = useState<SimulationResult[]>(() => {
    const saved = localStorage.getItem('traveltwin_simulations');
    return saved ? JSON.parse(saved) : [];
  });

  const [itineraries, setItineraries] = useState<Itinerary[]>(() => {
    const saved = localStorage.getItem('traveltwin_itineraries');
    return saved ? JSON.parse(saved) : [];
  });

  const [lastAward, setLastAward] = useState<{ amount: number; reason: string } | null>(null);

  // Calculate Level: 500 XP per level
  const level = Math.floor(xp / 500) + 1;
  const currentLevelBase = (level - 1) * 500;
  const nextLevelBase = level * 500;
  const xpInCurrentLevel = xp - currentLevelBase;
  const xpToNextLevel = nextLevelBase - xp;
  const progressPercent = Math.min(100, Math.round((xpInCurrentLevel / 500) * 100));

  useEffect(() => {
    localStorage.setItem('traveltwin_xp', xp.toString());
  }, [xp]);

  useEffect(() => {
    localStorage.setItem('traveltwin_stamps', JSON.stringify(stamps));
  }, [stamps]);

  useEffect(() => {
    localStorage.setItem('traveltwin_achievements', JSON.stringify(achievements));
  }, [achievements]);

  useEffect(() => {
    localStorage.setItem('traveltwin_memories', JSON.stringify(memories));
  }, [memories]);

  useEffect(() => {
    localStorage.setItem('traveltwin_simulations', JSON.stringify(simulations));
  }, [simulations]);

  useEffect(() => {
    localStorage.setItem('traveltwin_itineraries', JSON.stringify(itineraries));
  }, [itineraries]);

  const fireCelebration = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#38bdf8', '#2dd4bf', '#818cf8', '#ffffff']
      });
    } catch {
      // Fallback gracefully
    }
  };

  const addXp = (amount: number, reason: string) => {
    const oldLevel = Math.floor(xp / 500) + 1;
    const newXp = xp + amount;
    const newLevel = Math.floor(newXp / 500) + 1;

    setXp(newXp);
    setLastAward({ amount, reason });

    if (newLevel > oldLevel) {
      fireCelebration();
    }

    setTimeout(() => {
      setLastAward(prev => (prev?.reason === reason ? null : prev));
    }, 4000);
  };

  const unlockStamp = (destinationId: string, experienceType: 'Virtual Visit' | 'Simulation' | 'Shared Journey'): boolean => {
    const exists = stamps.some(s => s.destinationId === destinationId);
    if (exists) return false;

    const dest = DESTINATIONS.find(d => d.id === destinationId);
    if (!dest) return false;

    const newStamp: PassportStamp = {
      id: `stamp-${Date.now()}`,
      destinationId: dest.id,
      destinationName: dest.name,
      country: dest.country,
      unlockedAt: new Date().toISOString().split('T')[0],
      icon: dest.threeDType === 'mountain' ? 'Mountain' : dest.threeDType === 'coastal' ? 'Palmtree' : 'Landmark',
      color: '#38bdf8',
      experienceType,
      xpEarned: 300
    };

    setStamps(prev => [newStamp, ...prev]);
    addXp(300, `Passport Stamp Unlocked: ${dest.name}`);
    fireCelebration();
    return true;
  };

  const addMemory = (memoryData: Omit<Memory, 'id'>) => {
    const newMemory: Memory = {
      ...memoryData,
      id: `mem-${Date.now()}`
    };
    setMemories(prev => [newMemory, ...prev]);
    addXp(150, `Travel Memory Created for ${memoryData.destinationName}`);
  };

  const deleteMemory = (id: string) => {
    setMemories(prev => prev.filter(m => m.id !== id));
  };

  const updateMemoryCaption = (id: string, caption: string) => {
    setMemories(prev => prev.map(m => m.id === id ? { ...m, caption } : m));
  };

  const saveSimulation = (result: SimulationResult) => {
    setSimulations(prev => [result, ...prev]);
    addXp(200, `Pre-Travel Simulation Completed`);
  };

  const saveItinerary = (itinerary: Itinerary) => {
    setItineraries(prev => [itinerary, ...prev]);
    addXp(100, `AI Travel Plan Saved: ${itinerary.destination}`);
  };

  return (
    <GamificationContext.Provider
      value={{
        xp,
        level,
        xpToNextLevel,
        progressPercent,
        stamps,
        achievements,
        memories,
        simulations,
        itineraries,
        addXp,
        unlockStamp,
        addMemory,
        deleteMemory,
        updateMemoryCaption,
        saveSimulation,
        saveItinerary,
        lastAward
      }}
    >
      {children}
    </GamificationContext.Provider>
  );
};

export const useGamification = () => {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
};
