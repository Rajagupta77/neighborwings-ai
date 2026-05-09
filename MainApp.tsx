
import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Sparkles, HelpCircle, Menu } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Message, ChatSession } from './types';
import { INITIAL_MESSAGE } from './constants';
import ChatMessage from './components/ChatMessage';
import { getGeminiResponse } from './services/geminiService';
import { VendorModal } from './components/VendorModal';
import { EventsTab } from './components/EventsTab';
import { Sidebar } from './components/Sidebar';

export const MainApp: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'events'>('chat');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Handle direct vendor landing and persistence
  useEffect(() => {
    if (queryParams.get('mode') === 'vendor') {
      setIsVendorModalOpen(true);
      sessionStorage.setItem('nw_mode', 'vendor');
    }
  }, [location.search]);

  // Load sessions from localStorage on mount
  useEffect(() => {
    const savedSessions = localStorage.getItem('nw_chat_sessions');
    if (savedSessions) {
      try {
        const parsed = JSON.parse(savedSessions);
        setSessions(parsed);
      } catch (e) {
        console.error("Failed to load sessions", e);
      }
    }
  }, []);

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('nw_chat_sessions', JSON.stringify(sessions));
  }, [sessions]);

  // Update current session's messages
  useEffect(() => {
    if (currentSessionId && messages.length > 0) {
      setSessions(prev => prev.map(s => 
        s.id === currentSessionId 
          ? { ...s, messages, updatedAt: new Date().toISOString() } 
          : s
      ));
    }
  }, [messages, currentSessionId]);

  const handleCloseVendorModal = () => {
    setIsVendorModalOpen(false);
  };

  const handleNewChat = () => {
    setMessages([]);
    setCurrentSessionId(null);
    setInput('');
    setError(null);
    setActiveTab('chat');
  };

  const handleSelectSession = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      setMessages(session.messages);
      setCurrentSessionId(sessionId);
      setActiveTab('chat');
    }
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim() || isLoading) return;

    let sessionId = currentSessionId;
    if (!sessionId) {
      sessionId = Date.now().toString();
      const newSession: ChatSession = {
        id: sessionId,
        title: textToSend.trim().substring(0, 40) + (textToSend.length > 40 ? '...' : ''),
        messages: [],
        updatedAt: new Date().toISOString()
      };
      setSessions(prev => [newSession, ...prev]);
      setCurrentSessionId(sessionId);
    }

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const chatHistory = [...messages, userMsg];
      const aiText = await getGeminiResponse(chatHistory);
      
      if (!aiText || aiText.trim().length === 0) {
        setError("No matches yet — try a different date or category?");
        return;
      }
      
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiText,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error("Chat processing failed:", err instanceof Error ? err.message : "Unknown error");
      setError("NeighborWings is currently experiencing high demand. Please try again in a moment.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handlePairWithVendor = (eventName: string, bundleVendor?: string) => {
    setActiveTab('chat');
    if (bundleVendor) {
      handleSend(`I want to book ${bundleVendor} for ${eventName}. Can you help?`);
    } else {
      handleSend(`Tell me vendors for ${eventName}`);
    }
  };

  return (
    <div className="flex h-screen bg-white text-slate-900 overflow-hidden font-sans">
      <VendorModal isOpen={isVendorModalOpen} onClose={handleCloseVendorModal} />
      
      {/* Sidebar Section */}
      <div className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 fixed lg:static z-40 h-full`}>
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          onNewChat={handleNewChat}
          onOpenVendorModal={() => setIsVendorModalOpen(true)}
          sessions={sessions}
          currentSessionId={currentSessionId}
          onSelectSession={handleSelectSession}
        />
      </div>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 bg-white relative">
        {/* Header */}
        <header className="h-14 flex items-center justify-between px-4 lg:px-6 border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-30 shrink-0">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5 text-slate-500" />
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-900">
              <HelpCircle className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-hidden relative flex flex-col bg-white">
          {activeTab === 'chat' ? (
            <div className="flex-1 overflow-y-auto chat-scroll scroll-smooth flex flex-col items-center">
              {messages.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center px-6 max-w-3xl w-full text-center animate-in fade-in zoom-in duration-1000 pb-10">
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
                    {INITIAL_MESSAGE}
                  </h1>
                  
                  {/* Integrated Input for Empty State */}
                  <div className="w-full mb-8">
                    <div className="relative flex items-center border border-slate-200 bg-white rounded-[2rem] p-2 pl-6 focus-within:border-slate-400 focus-within:ring-4 focus-within:ring-slate-100/50 transition-all shadow-2xl shadow-slate-200/40 overflow-hidden">
                      <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Message NeighborWings AI..."
                        className="flex-1 bg-transparent border-none py-3.5 text-base text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-0 transition-all resize-none min-h-[56px] max-h-[200px] leading-relaxed"
                        rows={1}
                        aria-label="Chat input"
                        style={{ height: '56px' }}
                      />
                      <button
                        onClick={() => handleSend()}
                        disabled={!input.trim() || isLoading}
                        className="h-11 w-11 bg-slate-900 hover:bg-black disabled:bg-slate-100 disabled:text-slate-300 text-white rounded-[1.25rem] flex items-center justify-center transition-all duration-300 shadow-lg active:scale-95 shrink-0"
                        aria-label="Send message"
                      >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
                    {[
                      "Local events this weekend",
                      "Budget decor vendors",
                      "Family activity ideas",
                      "Book event catering"
                    ].map((suggestion, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(suggestion)}
                        className="p-4 bg-white border border-slate-100 rounded-2xl text-left hover:border-slate-300 hover:bg-slate-50 transition-all group active:scale-[0.98] shadow-sm"
                      >
                        <p className="text-sm font-semibold text-slate-600 flex items-center justify-between group-hover:text-slate-900 transition-colors">
                          {suggestion}
                          <Send className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-4px] group-hover:translate-x-0" />
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="w-full max-w-4xl px-4 py-8 space-y-8 flex flex-col">
                  {messages.map((msg) => (
                    <ChatMessage 
                      key={msg.id}
                      message={msg} 
                      onSendMessage={(text) => handleSend(text)}
                    />
                  ))}
                  
                  {isLoading && (
                    <div className="flex flex-col items-center justify-center py-12 animate-in fade-in zoom-in duration-500">
                      <div className="relative">
                        <div className="w-12 h-12 border-[3px] border-slate-100 border-t-slate-900 rounded-full animate-spin"></div>
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="mx-auto max-w-2xl bg-red-50 border border-red-100 rounded-3xl p-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <p className="text-red-600 font-bold mb-6 text-lg">{error}</p>
                      <button 
                        onClick={() => handleSend(messages[messages.length - 1]?.content)}
                        className="px-8 py-3 bg-red-600 text-white rounded-2xl font-bold uppercase tracking-wider text-xs hover:bg-red-700 transition-all shadow-xl active:scale-95"
                      >
                        Retry Search
                      </button>
                    </div>
                  )}
                  <div ref={messagesEndRef} className="h-40 shrink-0" />
                </div>
              )}
            </div>
          ) : (
            <div className="h-full overflow-y-auto">
              <div className="max-w-5xl mx-auto w-full px-6 py-10">
                <EventsTab onPairWithVendor={handlePairWithVendor} />
              </div>
            </div>
          )}
        </main>

        {/* Sticky Input Area (Only visible in Chat tab when there are messages) */}
        {activeTab === 'chat' && messages.length > 0 && (
          <div className="w-full bg-white px-4 pb-6 pt-2 sticky bottom-0">
            <div className="max-w-3xl mx-auto relative">
              <div className="relative flex items-center border border-slate-200 bg-white rounded-[2rem] p-2 pl-6 focus-within:border-slate-400 focus-within:ring-4 focus-within:ring-slate-100/50 transition-all shadow-2xl shadow-slate-200/40 overflow-hidden">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Message NeighborWings AI..."
                  className="flex-1 bg-transparent border-none py-3.5 text-base text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-0 transition-all resize-none min-h-[56px] max-h-[200px] leading-relaxed"
                  rows={1}
                  aria-label="Chat input"
                  style={{ height: '56px' }}
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isLoading}
                  className="h-11 w-11 bg-slate-900 hover:bg-black disabled:bg-slate-100 disabled:text-slate-300 text-white rounded-[1.25rem] flex items-center justify-center transition-all duration-300 shadow-lg active:scale-95 shrink-0"
                  aria-label="Send message"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-[10px] text-slate-400 text-center mt-3 font-semibold uppercase tracking-[0.2em] opacity-60">
                NeighborWings AI helps you plan and book easier.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
