import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useGamification } from '../context/GamificationContext';
import { Sparkles } from 'lucide-react';

export const RootLayout: React.FC = () => {
  const { lastAward } = useGamification();

  return (
    <div className="min-h-screen flex flex-col bg-navy-950 text-slate-100 relative">
      {/* Dynamic Global Toast Notification for Gamification / XP Awards */}
      {lastAward && (
        <div className="fixed top-24 right-4 z-50 glass-card px-4 py-3 rounded-2xl border border-teal-400/40 shadow-2xl flex items-center space-x-3 text-xs animate-bounce-subtle backdrop-blur-xl">
          <div className="w-7 h-7 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
            ★
          </div>
          <div>
            <div className="font-bold text-white flex items-center gap-1.5">
              +{lastAward.amount} XP Earned!
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            </div>
            <div className="text-[11px] text-slate-300">{lastAward.reason}</div>
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar />

      {/* Page Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};
