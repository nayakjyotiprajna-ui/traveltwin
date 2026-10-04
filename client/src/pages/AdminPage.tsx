import React, { useState } from 'react';
import { DESTINATIONS } from '../data/destinations';
import {
  ShieldCheck,
  Compass,
  Users,
  SlidersHorizontal,
  Server,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const [destinationsList, setDestinationsList] = useState(DESTINATIONS);
  const [activeTab, setActiveTab] = useState<'destinations' | 'users' | 'simulations'>('destinations');

  const usersMock = [
    { id: 'u1', name: 'Aria Vance', email: 'aria.vance@example.com', role: 'admin', xp: 1450, level: 4, status: 'Active' },
    { id: 'u2', name: 'Rohan Sharma', email: 'rohan.s@example.com', role: 'user', xp: 820, level: 2, status: 'Active' },
    { id: 'u3', name: 'Elena Rostova', email: 'elena.r@example.com', role: 'user', xp: 2100, level: 5, status: 'Active' },
  ];

  const simulationsMock = [
    { id: 'sim-1', user: 'Aria Vance', dest: 'Kashmir Valley', days: 5, budget: '$475', status: 'Completed', date: '2026-10-02' },
    { id: 'sim-2', user: 'Rohan Sharma', dest: 'Goa Coastal Sanctuary', days: 4, budget: '$280', status: 'Completed', date: '2026-10-03' },
  ];

  const handleDeleteDest = (id: string) => {
    setDestinationsList(prev => prev.filter(d => d.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Platform Administration & Curation</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">TravelTwin Admin Console</h1>
          <p className="text-xs text-slate-400">
            Monitor telemetry, curate destinations, inspect simulations, and manage user roles.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-2xl border border-white/10 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
            <Users className="w-3 h-3 text-brand-400" />
            Active Explorers
          </span>
          <div className="text-2xl font-extrabold text-white">1,482</div>
          <div className="text-[10px] text-teal-400">+12% this week</div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-white/10 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
            <Compass className="w-3 h-3 text-teal-400" />
            Curated Sanctuaries
          </span>
          <div className="text-2xl font-extrabold text-teal-300">{destinationsList.length}</div>
          <div className="text-[10px] text-slate-400">All 3D assets verified</div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-white/10 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
            <SlidersHorizontal className="w-3 h-3 text-sky-400" />
            Simulations Generated
          </span>
          <div className="text-2xl font-extrabold text-sky-300">3,920</div>
          <div className="text-[10px] text-slate-400">99.4% accuracy rating</div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-white/10 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
            <Server className="w-3 h-3 text-purple-400" />
            Platform Status
          </span>
          <div className="text-xl font-extrabold text-emerald-400">Healthy</div>
          <div className="text-[10px] text-slate-400">Uptime: 99.98%</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 space-x-4 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('destinations')}
          className={`pb-3 transition-colors ${
            activeTab === 'destinations' ? 'border-b-2 border-brand-400 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Manage Destinations ({destinationsList.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('users')}
          className={`pb-3 transition-colors ${
            activeTab === 'users' ? 'border-b-2 border-brand-400 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Manage Users ({usersMock.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('simulations')}
          className={`pb-3 transition-colors ${
            activeTab === 'simulations' ? 'border-b-2 border-brand-400 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          View Simulation Logs ({simulationsMock.length})
        </button>
      </div>

      {/* TAB 1: Destinations Table */}
      {activeTab === 'destinations' && (
        <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
          <div className="p-4 border-b border-white/10 flex items-center justify-between text-xs">
            <span className="font-bold text-white">Active Destinations</span>
            <span className="text-[11px] text-slate-400">Total: {destinationsList.length}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-white/5 text-[11px] uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="p-3 pl-4">Destination</th>
                  <th className="p-3">Region & Country</th>
                  <th className="p-3">3D Type</th>
                  <th className="p-3">Accessibility</th>
                  <th className="p-3">Budget Level</th>
                  <th className="p-3 text-right pr-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {destinationsList.map((dest) => (
                  <tr key={dest.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-3 pl-4 font-semibold text-white flex items-center gap-2">
                      <img src={dest.image} alt={dest.name} className="w-7 h-7 rounded-lg object-cover" />
                      <span>{dest.name}</span>
                    </td>
                    <td className="p-3 text-slate-400">{dest.region}, {dest.country}</td>
                    <td className="p-3 font-mono text-[11px] text-brand-300">{dest.threeDType}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] ${
                        dest.accessibility.wheelchairAccessible
                          ? 'bg-teal-500/20 text-teal-300'
                          : 'bg-white/5 text-slate-400'
                      }`}>
                        Rest Score {dest.accessibility.restAreasScore}/10
                      </span>
                    </td>
                    <td className="p-3 text-slate-400">${dest.budget.estimatedPerDay}/day ({dest.budget.level})</td>
                    <td className="p-3 text-right pr-4">
                      <button
                        type="button"
                        onClick={() => handleDeleteDest(dest.id)}
                        className="p-1 rounded text-slate-400 hover:text-rose-400"
                        title="Delete Destination"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Users Table */}
      {activeTab === 'users' && (
        <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-white/5 text-[11px] uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="p-3 pl-4">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Explorer XP</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {usersMock.map((u) => (
                  <tr key={u.id} className="hover:bg-white/5">
                    <td className="p-3 pl-4 font-semibold text-white">{u.name}</td>
                    <td className="p-3 text-slate-400">{u.email}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        u.role === 'admin' ? 'bg-amber-500/20 text-amber-300' : 'bg-brand-500/20 text-brand-300'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3 text-slate-200">{u.xp} XP (Lvl {u.level})</td>
                    <td className="p-3 text-teal-400 font-semibold">{u.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Simulations Logs */}
      {activeTab === 'simulations' && (
        <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-white/5 text-[11px] uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="p-3 pl-4">User</th>
                  <th className="p-3">Destination</th>
                  <th className="p-3">Duration</th>
                  <th className="p-3">Est. Budget</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {simulationsMock.map((s) => (
                  <tr key={s.id} className="hover:bg-white/5">
                    <td className="p-3 pl-4 font-semibold text-white">{s.user}</td>
                    <td className="p-3 text-slate-200">{s.dest}</td>
                    <td className="p-3 text-slate-400">{s.days} Days</td>
                    <td className="p-3 font-mono text-teal-300">{s.budget}</td>
                    <td className="p-3 text-slate-400">{s.date}</td>
                    <td className="p-3 text-teal-400 font-semibold">{s.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
