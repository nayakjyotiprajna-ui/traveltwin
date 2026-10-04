import React, { useState } from 'react';
import { Bot, Send, Sparkles, X, MessageSquare, Volume2, VolumeX } from 'lucide-react';
import { Destination } from '../types';
import { aiApi } from '../lib/api';

interface AIGuidePanelProps {
  destination: Destination;
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

export const AIGuidePanel: React.FC<AIGuidePanelProps> = ({ destination, isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Greetings explorer! I am your AI Travel Twin Guide for ${destination.name}. Ask me anything about cultural traditions, cuisine, sensory accessibility, or recommended activities here.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(false);

  const quickPrompts = [
    'What should I see here?',
    'What food is famous here?',
    'Tell me about this culture.',
    'Is this destination suitable for seniors?',
    'How long should I stay?'
  ];

  const speakText = (text: string) => {
    if (!speechEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const generateAnswer = (query: string): string => {
    const q = query.toLowerCase();
    if (q.includes('see') || q.includes('attractions') || q.includes('visit')) {
      return `Key attractions at ${destination.name} include: ${destination.attractions.slice(0, 3).join(', ')}. In our 3D visit, explore the interactive hotspots marked on your screen!`;
    }
    if (q.includes('food') || q.includes('eat') || q.includes('cuisine') || q.includes('famous')) {
      return `Famous delicacies here include: ${destination.food.join(', ')}. Be sure to experience the local sensory spice markets!`;
    }
    if (q.includes('culture') || q.includes('tradition') || q.includes('history')) {
      return `${destination.culture} It is also noted for its rich heritage and warm community hospitality.`;
    }
    if (q.includes('senior') || q.includes('accessible') || q.includes('wheelchair') || q.includes('mobility')) {
      const rest = destination.accessibility.restAreasScore;
      const highlights = destination.accessibility.highlights.join('; ');
      return `Accessibility Assessment: Rest area score is ${rest}/10. ${highlights}. For virtual visits, sensory low-motion mode is activated.`;
    }
    if (q.includes('long') || q.includes('stay') || q.includes('duration') || q.includes('days')) {
      return `The recommended visit duration is ${destination.estimatedDuration}. For virtual exploration, 25-40 minutes lets you discover all interactive hotspots.`;
    }
    return `Regarding "${query}" at ${destination.name}: This sanctuary offers optimal visits during ${destination.bestTime}. Its budget level is ${destination.budget.level} (${destination.budget.estimatedPerDay} ${destination.budget.currency}/day). You can also simulate full transportation and hotel routes in our Pre-Travel Simulator.`;
  };

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    try {
      const res = await aiApi.destinationGuide(
        destination.name,
        query,
        `Culture: ${destination.culture}; Food: ${destination.food.join(', ')}; Accessibility: ${destination.accessibility.highlights.join(', ')}`
      );
      const replyText = (res && res.answer) ? res.answer : generateAnswer(query);
      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
      speakText(replyText);
    } catch {
      // Graceful local synthesis fallback
      setTimeout(() => {
        const replyText = generateAnswer(query);
        const aiMsg: Message = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, aiMsg]);
        setIsTyping(false);
        speakText(replyText);
      }, 400);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="w-80 sm:w-96 glass-card rounded-2xl border border-brand-500/30 shadow-2xl flex flex-col h-[520px] max-h-[85vh] overflow-hidden text-xs backdrop-blur-xl animate-fade-in">
      {/* Header */}
      <div className="p-3.5 bg-navy-900/90 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-brand-500 to-teal-400 p-[1px]">
            <div className="w-full h-full bg-navy-950 rounded-[7px] flex items-center justify-center">
              <Bot className="w-4 h-4 text-brand-400" />
            </div>
          </div>
          <div>
            <h3 className="font-bold text-white text-xs flex items-center gap-1">
              AI Destination Guide
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
            </h3>
            <p className="text-[10px] text-slate-400">{destination.name}</p>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <button
            type="button"
            onClick={() => {
              setSpeechEnabled(!speechEnabled);
              if (speechEnabled && 'speechSynthesis' in window) {
                window.speechSynthesis.cancel();
              }
            }}
            title={speechEnabled ? 'Mute AI voice' : 'Enable AI voice narration'}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
          >
            {speechEnabled ? <Volume2 className="w-4 h-4 text-brand-400" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Prompts Bar */}
      <div className="p-2 border-b border-white/5 bg-navy-950/40 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(p)}
            className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-brand-500/20 text-[10px] text-slate-300 hover:text-brand-300 whitespace-nowrap border border-white/5 transition-colors"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-xl p-2.5 leading-relaxed text-[11px] ${
                m.sender === 'user'
                  ? 'bg-brand-500 text-white shadow-glow-sky'
                  : 'bg-white/5 border border-white/10 text-slate-200'
              }`}
            >
              {m.text}
            </div>
            <span className="text-[9px] text-slate-500 mt-1 px-1">{m.timestamp}</span>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center space-x-1.5 text-slate-400 p-2 bg-white/5 rounded-xl w-fit">
            <Sparkles className="w-3 h-3 text-brand-400 animate-spin" />
            <span className="text-[10px]">AI Guide is thinking...</span>
          </div>
        )}
      </div>

      {/* Input Field */}
      <div className="p-3 border-t border-white/10 bg-navy-950/80">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask about ${destination.name}...`}
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-brand-400 text-xs"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="p-2 rounded-xl bg-brand-500 hover:bg-brand-400 disabled:opacity-40 text-white shadow-glow-sky transition-all"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
