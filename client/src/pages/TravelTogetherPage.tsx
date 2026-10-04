import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DESTINATIONS } from '../data/destinations';
import { TravelRoom, Participant } from '../types';
import { roomsApi } from '../lib/api';
import {
  getSocket,
  joinRoom,
  leaveRoom,
  sendChatMessage,
  syncJourneyUpdate
} from '../lib/socket';
import {
  Users,
  Sparkles,
  Copy,
  Check,
  ArrowRight,
  MessageSquare,
  Compass,
  Headphones,
  Plus,
  Loader2
} from 'lucide-react';

export const TravelTogetherPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [activeRoom, setActiveRoom] = useState<TravelRoom | null>(null);
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [selectedDestId, setSelectedDestId] = useState('kashmir');
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<{ sender: string; text: string; time: string }[]>([
    { sender: 'TravelTwin Bot', text: 'Travel room initialized. Explore destinations together!', time: '12:00 PM' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Real-time Socket.IO Listeners for Active Room
  useEffect(() => {
    if (!activeRoom) return;

    const s = getSocket();

    const handleChatMessage = (msg: any) => {
      // Avoid duplicate self-rendering if socket echoes back
      if (msg.socketId && msg.socketId === s.id) return;
      setMessages((prev) => [
        ...prev,
        {
          sender: msg.sender,
          text: msg.text,
          time: msg.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    };

    const handleUserJoined = (data: any) => {
      const newUser = data.user;
      if (newUser && newUser.name) {
        setActiveRoom((prev) => {
          if (!prev) return prev;
          if (prev.participants.some((p) => p.name === newUser.name)) return prev;
          return {
            ...prev,
            participants: [
              ...prev.participants,
              {
                id: newUser.id || `user-${Date.now()}`,
                name: newUser.name,
                avatar: newUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
                isHost: false,
                status: 'exploring'
              }
            ]
          };
        });

        setMessages((prev) => [
          ...prev,
          {
            sender: 'TravelTwin Bot',
            text: `👋 ${newUser.name} connected to the travel room!`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
    };

    const handleUserLeft = (data: any) => {
      if (data.user?.name) {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'TravelTwin Bot',
            text: `Explorer ${data.user.name} departed the room.`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
    };

    const handleJourneyUpdated = (data: any) => {
      if (data.stage) {
        setActiveRoom((prev) => (prev ? { ...prev, currentStage: data.stage } : prev));
        setMessages((prev) => [
          ...prev,
          {
            sender: 'TravelTwin Bot',
            text: `📍 Milestone synchronized: "${data.stage}"`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
    };

    s.on('chat:message', handleChatMessage);
    s.on('room:userJoined', handleUserJoined);
    s.on('room:userLeft', handleUserLeft);
    s.on('journey:updated', handleJourneyUpdated);

    return () => {
      s.off('chat:message', handleChatMessage);
      s.off('room:userJoined', handleUserJoined);
      s.off('room:userLeft', handleUserLeft);
      s.off('journey:updated', handleJourneyUpdated);
    };
  }, [activeRoom?.roomCode]);

  const handleCreateRoom = async () => {
    setIsLoading(true);
    const dest = DESTINATIONS.find((d) => d.id === selectedDestId) || DESTINATIONS[0];

    const hostParticipant: Participant = {
      id: user?.id || 'host-1',
      name: user?.name || 'Aria Vance',
      avatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      isHost: true,
      status: 'exploring'
    };

    let roomCode = `TWIN-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      const res = await roomsApi.create(dest.name, dest.id);
      if (res.success && res.room) {
        roomCode = res.room.roomCode;
      }
    } catch (err) {
      console.warn('Backend room creation fallback to local state:', err);
    }

    const newRoom: TravelRoom = {
      roomCode,
      destinationId: dest.id,
      destinationName: dest.name,
      hostId: hostParticipant.id,
      participants: [hostParticipant],
      currentStage: `${dest.name} — Landmark Audio & Hotspot Sync`,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    setActiveRoom(newRoom);
    joinRoom(roomCode, { name: hostParticipant.name, avatar: hostParticipant.avatar });
    setIsLoading(false);
  };

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = joinCodeInput.trim().toUpperCase();
    if (!code) return;

    setIsLoading(true);
    let dest = DESTINATIONS[0];
    let participants: Participant[] = [];
    let currentStage = 'Co-op Virtual Exploration';

    try {
      const res = await roomsApi.join(code);
      if (res.success && res.room) {
        const matched = DESTINATIONS.find(
          (d) => d.id === res.room.destinationId || d.name.toLowerCase().includes(res.room.destination.toLowerCase())
        );
        if (matched) dest = matched;
        currentStage = res.room.currentStage || `${dest.name} — Co-op Virtual Exploration`;
        if (res.room.participants && res.room.participants.length > 0) {
          participants = res.room.participants.map((p: any, idx: number) => ({
            id: p.user || `p-${idx}`,
            name: p.name || 'Explorer',
            avatar: p.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
            isHost: idx === 0,
            status: (p.status as any) || 'exploring'
          }));
        }
      }
    } catch (err) {
      console.warn('Backend room join fallback to local state:', err);
    }

    const currentParticipant: Participant = {
      id: user?.id || 'curr-user',
      name: user?.name || 'Explorer',
      avatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      isHost: participants.length === 0,
      status: 'exploring'
    };

    if (!participants.some((p) => p.id === currentParticipant.id || p.name === currentParticipant.name)) {
      participants.push(currentParticipant);
    }

    const joinedRoom: TravelRoom = {
      roomCode: code,
      destinationId: dest.id,
      destinationName: dest.name,
      hostId: participants[0]?.id || currentParticipant.id,
      participants,
      currentStage: `${dest.name} — ${currentStage}`,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    setActiveRoom(joinedRoom);
    joinRoom(code, { name: currentParticipant.name, avatar: currentParticipant.avatar });
    setJoinCodeInput('');
    setIsLoading(false);
  };

  const copyCode = () => {
    if (!activeRoom) return;
    navigator.clipboard?.writeText(activeRoom.roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !activeRoom) return;

    const text = chatInput.trim();
    const sender = user?.name || 'You';
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    sendChatMessage(activeRoom.roomCode, { sender, text, time });
    setMessages((prev) => [...prev, { sender, text, time }]);
    setChatInput('');
  };

  const handleLeaveRoom = () => {
    if (activeRoom) {
      leaveRoom(activeRoom.roomCode, { name: user?.name || 'Explorer' });
      setActiveRoom(null);
    }
  };

  const handleSyncMilestone = (milestoneTitle: string) => {
    if (!activeRoom) return;
    const stageDesc = `${activeRoom.destinationName} — ${milestoneTitle}`;
    syncJourneyUpdate(activeRoom.roomCode, stageDesc);
    roomsApi.updateStage(activeRoom.roomCode, stageDesc).catch(() => {});
    setActiveRoom((prev) => (prev ? { ...prev, currentStage: stageDesc } : prev));
    setMessages((prev) => [
      ...prev,
      {
        sender: 'TravelTwin Bot',
        text: `${user?.name || 'Explorer'} synchronized the group camera view to ${milestoneTitle}!`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const currentDestinationData = activeRoom
    ? DESTINATIONS.find((d) => d.id === activeRoom.destinationId) || DESTINATIONS[0]
    : null;

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold">
          <Users className="w-3.5 h-3.5 text-teal-400" />
          <span>Real-Time Collaborative Tourism</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Travel Together (Co-op)
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Explore virtual destinations simultaneously with family, friends, or care partners. Synchronize vistas, share audio narrations, and chat in real-time.
        </p>
      </div>

      {!activeRoom ? (
        /* Create or Join Lobby View */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Create Room */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-brand-500/20 shadow-2xl space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/20 text-brand-400 flex items-center justify-center">
                <Plus className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-white">Create a Travel Room</h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Generate a private room and invite companions to wander through virtual 3D sanctuaries with synchronized hotspots and live chat.
              </p>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Choose Destination</label>
                <select
                  value={selectedDestId}
                  onChange={(e) => setSelectedDestId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-navy-900 border border-white/10 text-white text-xs focus:outline-none focus:border-brand-400"
                >
                  {DESTINATIONS.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.country})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCreateRoom}
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-semibold text-xs shadow-glow-sky flex items-center justify-center space-x-2 transition-all mt-4 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Room & Invite Link</span>
                </>
              )}
            </button>
          </div>

          {/* Card 2: Join Room */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-teal-500/20 shadow-2xl space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-white">Join an Existing Room</h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Enter an invitation code shared by a friend, family member, or accessibility travel buddy.
              </p>

              <form onSubmit={handleJoinRoom} className="space-y-3">
                <label className="block text-xs font-semibold text-slate-300">Room Code</label>
                <input
                  type="text"
                  value={joinCodeInput}
                  onChange={(e) => setJoinCodeInput(e.target.value)}
                  placeholder="e.g., TWIN-4892"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-navy-900 border border-white/10 text-white placeholder-slate-500 text-xs uppercase tracking-wider font-mono focus:outline-none focus:border-teal-400"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-white font-semibold text-xs shadow-glow-teal flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Connect to Travel Room</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className="text-[11px] text-slate-400 p-3 bg-white/5 rounded-xl">
              Socket.IO synchronization coordinates chat, milestone triggers, and audio narrations seamlessly across participants.
            </div>
          </div>
        </div>
      ) : (
        /* Active Co-op Room State */
        <div className="space-y-6 animate-fade-in">
          {/* Room Header Banner */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-teal-500/30 shadow-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
                  <span className="text-xs font-mono font-bold text-teal-300">
                    ROOM: {activeRoom.roomCode}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                    Live Co-op Active
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-white">{activeRoom.destinationName}</h2>
                <p className="text-xs text-slate-300">{activeRoom.currentStage}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={copyCode}
                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Code Copied!' : 'Copy Room Code'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate(`/experience/${activeRoom.destinationId || 'kashmir'}`)}
                  className="py-2 px-4 rounded-xl bg-gradient-to-r from-brand-500 to-teal-400 hover:opacity-95 text-white font-semibold text-xs shadow-glow-sky flex items-center gap-1.5"
                >
                  <Headphones className="w-3.5 h-3.5" />
                  <span>Enter 3D Scene</span>
                </button>
              </div>
            </div>

            {/* Participants Bar */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-300">
                Active Explorers in Room ({activeRoom.participants.length})
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeRoom.participants.map((p) => (
                  <div
                    key={p.id}
                    className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={p.avatar}
                        alt={p.name}
                        className="w-9 h-9 rounded-full object-cover ring-2 ring-brand-400/40"
                      />
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          {p.name}
                          {p.isHost && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-brand-500/20 text-brand-300 font-semibold">
                              HOST
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-teal-400">Status: {p.status}</div>
                      </div>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-teal-400" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Shared Journey Activity & Chat */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Shared Journey Milestone Tracker */}
            <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Compass className="w-4 h-4 text-brand-400" />
                Shared Journey Milestones
              </h3>
              <div className="space-y-2.5 text-xs">
                {currentDestinationData && currentDestinationData.hotspots && currentDestinationData.hotspots.length > 0 ? (
                  currentDestinationData.hotspots.map((h, i) => (
                    <div
                      key={h.id}
                      onClick={() => handleSyncMilestone(h.title)}
                      className="p-3 rounded-xl bg-white/5 hover:bg-brand-500/10 border border-white/5 hover:border-brand-500/30 flex items-center justify-between cursor-pointer transition-all"
                    >
                      <span className="text-slate-200">
                        {i + 1}. {h.title}
                      </span>
                      <span className="text-[10px] text-brand-300 font-semibold flex items-center gap-1">
                        <Check className="w-3 h-3 text-brand-400" />
                        Sync View
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-3 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-between">
                    <span className="text-slate-200">1. Virtual Exploration</span>
                    <span className="text-[10px] font-bold text-brand-300">Synchronized</span>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() =>
                  handleSyncMilestone(
                    currentDestinationData?.hotspots[0]?.title || 'Panoramic Landmark View'
                  )
                }
                className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-colors"
              >
                Trigger Group View Synchronization
              </button>
            </div>

            {/* Right: Companion Live Chat */}
            <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4 flex flex-col h-80">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-teal-400" />
                Companion Travel Chat
              </h3>

              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                {messages.map((m, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-white/5 text-xs space-y-0.5">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="font-semibold text-brand-300">{m.sender}</span>
                      <span>{m.time}</span>
                    </div>
                    <p className="text-slate-200">{m.text}</p>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="flex gap-2 pt-2 border-t border-white/10">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Share a thought with companions..."
                  className="flex-1 px-3 py-2 rounded-xl bg-navy-900 border border-white/10 text-white text-xs focus:outline-none focus:border-brand-400"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-teal-500 text-white font-semibold text-xs shadow-glow-teal hover:bg-teal-400 transition-colors"
                >
                  Send
                </button>
              </form>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleLeaveRoom}
              className="text-xs text-rose-400 hover:text-rose-300 px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition-colors"
            >
              Leave Room
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
