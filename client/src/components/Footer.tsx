import React from 'react';
import { Link } from 'react-router-dom';
import { Globe2, Heart, Shield, Sparkles, Accessibility } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full glass-panel border-t border-white/10 mt-20 pt-16 pb-12 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-white/10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-teal-400 p-[1px] shadow-glow-sky">
                <div className="w-full h-full bg-navy-950 rounded-[11px] flex items-center justify-center">
                  <Globe2 className="w-5 h-5 text-brand-400" />
                </div>
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Travel<span className="text-brand-400">Twin</span>
              </span>
            </Link>
            <p className="text-slate-300 text-sm max-w-sm leading-relaxed">
              "Your Journey Doesn't Need a Passport."
            </p>
            <p className="text-slate-400 text-xs max-w-md leading-relaxed">
              Empowering virtual tourism, sensory accessibility, and pre-travel simulation for every explorer worldwide.
            </p>
            <div className="flex items-center space-x-2 text-[11px] text-teal-400 bg-teal-500/10 border border-teal-500/20 px-3 py-1.5 rounded-lg w-fit">
              <Accessibility className="w-3.5 h-3.5" />
              <span>WCAG 2.1 AA Compliant & Vestibular-Friendly Architecture</span>
            </div>
          </div>

          {/* Travel Modes */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase">Travel Modes</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/virtual-visit" className="hover:text-brand-400 transition-colors">
                  Virtual Visit (No Passport)
                </Link>
              </li>
              <li>
                <Link to="/simulate" className="hover:text-brand-400 transition-colors">
                  Pre-Travel Simulation
                </Link>
              </li>
              <li>
                <Link to="/travel-twin" className="hover:text-brand-400 transition-colors">
                  AI Travel Director
                </Link>
              </li>
              <li>
                <Link to="/travel-together" className="hover:text-brand-400 transition-colors">
                  Travel Together (Co-op)
                </Link>
              </li>
              <li>
                <Link to="/passport" className="hover:text-brand-400 transition-colors">
                  Digital Travel Passport
                </Link>
              </li>
            </ul>
          </div>

          {/* Destinations */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase">Featured Sanctuaries</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/destination/kashmir" className="hover:text-brand-400 transition-colors">
                  Kashmir Valley
                </Link>
              </li>
              <li>
                <Link to="/destination/goa" className="hover:text-brand-400 transition-colors">
                  Goa Coastal Sanctuary
                </Link>
              </li>
              <li>
                <Link to="/destination/kerala" className="hover:text-brand-400 transition-colors">
                  Kerala Backwaters
                </Link>
              </li>
              <li>
                <Link to="/destination/rajasthan" className="hover:text-brand-400 transition-colors">
                  Rajasthan Royal Citadel
                </Link>
              </li>
              <li>
                <Link to="/destination/ladakh" className="hover:text-brand-400 transition-colors">
                  Ladakh High Plateau
                </Link>
              </li>
              <li>
                <Link to="/destination/konark" className="hover:text-brand-400 transition-colors">
                  Konark Sun Chariot
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase">Platform & Security</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/memories" className="hover:text-brand-400 transition-colors">
                  Traveler Memories
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-brand-400 transition-colors">
                  Personal Dashboard
                </Link>
              </li>
              <li>
                <Link to="/onboarding" className="hover:text-brand-400 transition-colors">
                  Twin Customization
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-brand-400 transition-colors">
                  Curator / Admin Portal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
          <p>
            © {new Date().getFullYear()} TravelTwin Platform Inc. All rights reserved. Powered by Three.js & AI.
          </p>
          <div className="flex items-center space-x-6">
            <span className="flex items-center gap-1 text-slate-400">
              <Shield className="w-3.5 h-3.5 text-brand-400" />
              Verified Safe Simulator
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              Zero Carbon Virtual Footprint
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
