
import React from 'react';
import { Plus, MessageSquare, Calendar, Settings, HelpCircle, Sparkles, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Message, ChatSession } from '../types';

interface SidebarProps {
  activeTab: 'chat' | 'events';
  setActiveTab: (tab: 'chat' | 'events') => void;
  onNewChat: () => void;
  onOpenVendorModal: () => void;
  sessions: ChatSession[];
  currentSessionId: string | null;
  onSelectSession: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  onNewChat,
  onOpenVendorModal,
  sessions,
  currentSessionId,
  onSelectSession
}) => {

  return (
    <aside className="w-[280px] bg-slate-900 h-screen flex flex-col text-slate-300 transition-all duration-300 shrink-0 select-none border-r border-white/5">
      {/* Top Header */}
      <div className="p-4">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-slate-900" />
          </div>
          <span className="font-bold text-white text-lg tracking-tight">NeighborWings AI</span>
        </Link>
      </div>

      {/* New Chat Button */}
      <div className="px-4 py-2">
        <button 
          onClick={onNewChat}
          className="w-full flex items-center gap-3 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-200 border border-white/5 hover:border-white/20 active:scale-[0.98] group"
        >
          <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
          <span className="text-sm font-semibold tracking-wide">New Chat</span>
        </button>
      </div>

      {/* Main Navigation / Tabs */}
      <nav className="mt-4 px-2 space-y-1">
        <button
          onClick={() => setActiveTab('chat')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'chat' 
              ? 'bg-white/10 text-white' 
              : 'hover:bg-white/5 text-slate-400 hover:text-white'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          Chat
        </button>
        <button
          onClick={() => setActiveTab('events')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'events' 
              ? 'bg-white/10 text-white' 
              : 'hover:bg-white/5 text-slate-400 hover:text-white'
          }`}
        >
          <Calendar className="w-5 h-5" />
          Discover Events
        </button>
      </nav>

      {/* Chat History Section */}
      <div className="mt-8 flex-1 overflow-y-auto px-2">
        <div className="px-4 mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
          Recent History
        </div>
        <div className="space-y-1">
          {sessions.map((session) => (
            <button
              key={session.id}
              onClick={() => onSelectSession(session.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-medium transition-all text-left truncate group ${
                currentSessionId === session.id 
                  ? 'bg-white/10 text-white' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${currentSessionId === session.id ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'}`} />
              <span className="truncate">{session.title}</span>
            </button>
          ))}
          {sessions.length === 0 && (
            <div className="px-4 py-4 text-[10px] text-slate-600 font-medium italic">
              No chat history yet.
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="p-2 border-t border-white/5 space-y-1">
        <button 
          onClick={onOpenVendorModal}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-white transition-all"
        >
          <Plus className="w-5 h-5 shadow-inner" />
          Join as Vendor
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-white transition-all text-left">
          <Settings className="w-5 h-5" />
          Settings
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-white transition-all text-left">
          <HelpCircle className="w-5 h-5" />
          Help & Support
        </button>
      </div>
    </aside>
  );
};
