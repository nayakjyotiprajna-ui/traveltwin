import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { DESTINATIONS } from '../data/destinations';
import { DestinationCategory } from '../types';
import {
  Search,
  SlidersHorizontal,
  Compass,
  ArrowRight,
  Accessibility,
  DollarSign,
  Mountain,
  Sun,
  ShieldCheck,
  Check
} from 'lucide-react';

export const ExplorePage: React.FC = () => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedBudget, setSelectedBudget] = useState<string>('All');
  const [onlyAccessible, setOnlyAccessible] = useState<boolean>(false);

  const categories: (DestinationCategory | 'All')[] = [
    'All',
    'Adventure',
    'Culture',
    'Nature',
    'Beach',
    'Mountain',
    'Heritage'
  ];

  const filteredDestinations = useMemo(() => {
    return DESTINATIONS.filter((d) => {
      // Search text
      const matchesSearch =
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Category
      const matchesCategory =
        selectedCategory === 'All' || d.categories.includes(selectedCategory as any);

      // Budget
      const matchesBudget =
        selectedBudget === 'All' || d.budget.level === selectedBudget;

      // Accessibility
      const matchesAccessibility =
        !onlyAccessible || d.accessibility.wheelchairAccessible || d.accessibility.audioGuidesAvailable;

      return matchesSearch && matchesCategory && matchesBudget && matchesAccessibility;
    });
  }, [searchQuery, selectedCategory, selectedBudget, onlyAccessible]);

  return (
    <div className="space-y-10 py-6">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-semibold">
          <Compass className="w-3.5 h-3.5 text-brand-400" />
          <span>Curated Global Sanctuaries</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Explore Destinations
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
          Discover places tailored for both immersive 3D virtual visits and comprehensive pre-travel trip simulations.
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="glass-panel p-4 sm:p-6 rounded-2xl border border-white/10 space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by destination name, region, or landscape features..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-900 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-brand-400"
            />
          </div>

          {/* Budget Dropdown */}
          <div className="flex items-center gap-2">
            <select
              value={selectedBudget}
              onChange={(e) => setSelectedBudget(e.target.value)}
              className="py-2.5 px-3 rounded-xl bg-navy-900 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-brand-400"
            >
              <option value="All">All Budgets</option>
              <option value="Budget">Budget Friendly ($)</option>
              <option value="Moderate">Moderate ($$)</option>
              <option value="Luxury">Luxury / Wellness ($$$)</option>
            </select>

            {/* Accessibility Filter Button */}
            <button
              type="button"
              onClick={() => setOnlyAccessible(!onlyAccessible)}
              className={`flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                onlyAccessible
                  ? 'bg-teal-500/20 border-teal-400 text-teal-300 shadow-glow-teal'
                  : 'bg-navy-900 border-white/10 text-slate-300 hover:text-white'
              }`}
            >
              <Accessibility className="w-3.5 h-3.5" />
              <span>Step-Free / Verified</span>
            </button>
          </div>
        </div>

        {/* Categories Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
          <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider shrink-0 mr-1">
            Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-brand-500 text-white shadow-glow-sky'
                  : 'bg-white/5 text-slate-300 hover:text-white border border-white/5 hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Destinations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredDestinations.map((dest) => (
          <div
            key={dest.id}
            className="glass-card rounded-2xl overflow-hidden border border-white/10 group flex flex-col justify-between"
          >
            <div>
              {/* Image Banner */}
              <div className="relative h-52 overflow-hidden">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-transparent" />
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-navy-900/80 backdrop-blur-md text-[10px] font-semibold text-brand-300 border border-white/10">
                  {dest.region}, {dest.country}
                </div>
                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="text-xl font-bold text-white leading-tight drop-shadow-md">
                    {dest.name}
                  </h3>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-5 space-y-4">
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {dest.description}
                </p>

                {/* Categories */}
                <div className="flex flex-wrap gap-1.5">
                  {dest.categories.map((c) => (
                    <span
                      key={c}
                      className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] text-slate-300 border border-white/5"
                    >
                      {c}
                    </span>
                  ))}
                </div>

                {/* Accessibility Indicator */}
                <div className="p-2.5 rounded-xl bg-navy-900/80 border border-white/5 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-1.5 text-teal-300 font-medium">
                      <Accessibility className="w-3.5 h-3.5" />
                      {dest.accessibility.wheelchairAccessible
                        ? 'Step-Free / Ramp Audited'
                        : 'Sensory Virtual Audio Ready'}
                    </span>
                    <span className="text-slate-400">
                      Rest Score: {dest.accessibility.restAreasScore}/10
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 truncate">
                    {dest.accessibility.highlights[0]}
                  </p>
                </div>

                {/* Metadata details */}
                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-3 h-3 text-brand-400" />
                    {dest.budget.level} (${dest.budget.estimatedPerDay}/day)
                  </span>
                  <span>{dest.estimatedDuration}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-5 pt-0 grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => navigate(`/destination/${dest.id}`)}
                className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1"
              >
                <span>Explore</span>
                <ArrowRight className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => navigate(`/simulate?destination=${dest.id}`)}
                className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-brand-500 to-teal-400 hover:opacity-95 text-white text-xs font-semibold shadow-glow-sky transition-all flex items-center justify-center gap-1"
              >
                <span>Simulate Trip</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredDestinations.length === 0 && (
        <div className="glass-panel p-12 rounded-3xl text-center space-y-3">
          <p className="text-slate-300 font-semibold text-sm">No destinations matched your active filters.</p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSelectedBudget('All');
              setOnlyAccessible(false);
            }}
            className="px-4 py-2 rounded-xl bg-brand-500 text-white text-xs font-semibold shadow-glow-sky"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
