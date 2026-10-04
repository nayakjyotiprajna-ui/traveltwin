import React, { useState } from 'react';
import { useGamification } from '../context/GamificationContext';
import { DESTINATIONS } from '../data/destinations';
import { Memory } from '../types';
import {
  Camera,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  Sparkles,
  X,
  Check,
  MapPin,
  Image as ImageIcon
} from 'lucide-react';

export const MemoriesPage: React.FC = () => {
  const { memories, addMemory, deleteMemory, updateMemoryCaption } = useGamification();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedDestId, setSelectedDestId] = useState('kashmir');
  const [captionInput, setCaptionInput] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCaptionText, setEditCaptionText] = useState('');
  const [viewingMemory, setViewingMemory] = useState<Memory | null>(null);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!captionInput.trim()) return;

    const dest = DESTINATIONS.find((d) => d.id === selectedDestId) || DESTINATIONS[0];

    addMemory({
      destinationId: dest.id,
      destinationName: dest.name,
      caption: captionInput,
      image: dest.image,
      date: new Date().toISOString().split('T')[0],
      tags: [dest.region, 'Journal'],
      userId: 'user-demo-1'
    });

    setCaptionInput('');
    setAddModalOpen(false);
  };

  const handleSaveEdit = (id: string) => {
    if (!editCaptionText.trim()) return;
    updateMemoryCaption(id, editCaptionText);
    setEditingId(null);
  };

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold">
            <Camera className="w-3.5 h-3.5 text-teal-400" />
            <span>Digital Journal & Visual Keepsakes</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Traveler Memories
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
            Reflections, virtual vistas, and memories gathered across your journeys.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setAddModalOpen(true)}
          className="py-3 px-5 rounded-xl bg-gradient-to-r from-brand-500 to-teal-400 hover:opacity-95 text-white font-semibold text-xs shadow-glow-sky flex items-center gap-1.5 shrink-0 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Travel Memory (+150 XP)</span>
        </button>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {memories.map((mem) => (
          <div
            key={mem.id}
            className="glass-card rounded-2xl overflow-hidden border border-white/10 group flex flex-col justify-between transition-all hover:border-brand-500/30"
          >
            <div>
              <div
                className="relative h-48 overflow-hidden cursor-pointer"
                onClick={() => setViewingMemory(mem)}
              >
                <img
                  src={mem.image}
                  alt={mem.destinationName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/30 to-transparent" />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-navy-900/80 backdrop-blur-md text-[10px] font-semibold text-brand-300 border border-white/10 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-brand-400" />
                  <span>{mem.destinationName}</span>
                </div>
                <div className="absolute bottom-3 right-3 text-[10px] text-slate-300 font-mono flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-teal-400" />
                  <span>{mem.date}</span>
                </div>
              </div>

              <div className="p-4 space-y-3">
                {editingId === mem.id ? (
                  <div className="space-y-2">
                    <textarea
                      rows={2}
                      value={editCaptionText}
                      onChange={(e) => setEditCaptionText(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-navy-900 border border-brand-400 text-white text-xs focus:outline-none"
                    />
                    <div className="flex justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="px-2.5 py-1 rounded-lg bg-white/5 text-slate-400 text-[11px]"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveEdit(mem.id)}
                        className="px-3 py-1 rounded-lg bg-teal-500 text-white text-[11px] font-semibold"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-200 leading-relaxed italic">
                    "{mem.caption}"
                  </p>
                )}

                <div className="flex flex-wrap gap-1">
                  {mem.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-white/5 text-[9px] text-slate-400"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 pt-0 flex items-center justify-between border-t border-white/5 text-xs text-slate-400">
              <button
                type="button"
                onClick={() => setViewingMemory(mem)}
                className="text-[11px] text-brand-400 hover:text-brand-300 font-semibold"
              >
                Expand View
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(mem.id);
                    setEditCaptionText(mem.caption);
                  }}
                  className="p-1 rounded text-slate-400 hover:text-white"
                  title="Edit Caption"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => deleteMemory(mem.id)}
                  className="p-1 rounded text-slate-400 hover:text-rose-400"
                  title="Delete Memory"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {memories.length === 0 && (
        <div className="glass-panel p-12 rounded-3xl text-center space-y-3">
          <Camera className="w-8 h-8 text-slate-500 mx-auto" />
          <p className="text-slate-300 text-sm font-semibold">No travel memories logged yet.</p>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Explore a destination virtually or in simulation to capture your first reflection memory!
          </p>
        </div>
      )}

      {/* Add Memory Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-fade-in">
          <div className="glass-card max-w-md w-full rounded-2xl p-6 border border-white/15 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <Camera className="w-5 h-5 text-teal-400" />
                <h3 className="font-bold text-white text-base">New Travel Memory</h3>
              </div>
              <button
                type="button"
                onClick={() => setAddModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Destination Sanctuary</label>
                <select
                  value={selectedDestId}
                  onChange={(e) => setSelectedDestId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-white/10 text-white text-xs focus:outline-none focus:border-brand-400"
                >
                  {DESTINATIONS.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.region})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Caption / Sensory Reflection</label>
                <textarea
                  rows={3}
                  value={captionInput}
                  onChange={(e) => setCaptionInput(e.target.value)}
                  placeholder="Record what touched you — the morning mist, temple bells, or mountain stillness..."
                  required
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-brand-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-brand-500 to-teal-400 text-white text-xs font-semibold shadow-glow-sky flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Save Memory (+150 XP)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Memory Fullscreen Modal */}
      {viewingMemory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/90 backdrop-blur-md animate-fade-in">
          <div className="glass-card max-w-2xl w-full rounded-3xl overflow-hidden border border-white/20 shadow-2xl space-y-4">
            <div className="relative h-72 sm:h-96">
              <img
                src={viewingMemory.image}
                alt={viewingMemory.destinationName}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setViewingMemory(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-navy-900/80 text-white hover:bg-navy-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 pt-2 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-bold text-white text-sm">{viewingMemory.destinationName}</span>
                <span>{viewingMemory.date}</span>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed italic">
                "{viewingMemory.caption}"
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
