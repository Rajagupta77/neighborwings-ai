
import React, { useState, useRef, useEffect } from 'react';
import { Send, MapPin, Loader2, Info, PlusCircle, MessageSquare, Calendar, Sparkles, UserPlus, CalendarDays, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Message } from './types';
import { APP_NAME, TAGLINE, INITIAL_MESSAGE } from './constants';
import ChatMessage from './components/ChatMessage';
import { getGeminiResponse } from './services/geminiService';
import { VendorModal } from './components/VendorModal';
import { EventsTab } from './components/EventsTab';
import { EVENTS, VENDORS } from './data';

export const MainApp: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: INITIAL_MESSAGE,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'events'>('chat');
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, activeTab]);

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim() || isLoading) return;

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
      // Log detailed error server-side (simulated)
      console.error("Chat processing failed:", err instanceof Error ? err.message : "Unknown error");
      // Show generic error to user
      setError("NeighborWings is currently experiencing high demand. Please try again in a moment.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSurpriseMe = () => {
    setActiveTab('chat');
    setIsLoading(true);

    // Simulate a short delay for "thinking"/excitement
    setTimeout(() => {
      const isEvent = Math.random() > 0.5;
      let surpriseContent = "";
      
      if (isEvent) {
        const event = EVENTS[Math.floor(Math.random() * EVENTS.length)];
        surpriseContent = `🎉 **SURPRISE!** How about **${event.name}**?\n\n` +
          `📅 ${event.date} @ ${event.location} (${event.price})\n\n` +
          `${event.description}\n\n` +
          `> 💡 **Why it's great:** Perfect for a relaxed outing! \n\n` +
          `[[Tell me more about ${event.name}]] [[Find vendors for ${event.name}]]`;
      } else {
        const vendor = VENDORS[Math.floor(Math.random() * VENDORS.length)];
        surpriseContent = `✨ **SURPRISE!** You should check out **${vendor.name}**!\n\n` +
          `📍 ${vendor.location} (${vendor.distance}) | ${vendor.priceRange} | ⭐ ${vendor.rating}/5\n\n` +
          `${vendor.description}\n\n` +
          `> 💡 **Why it's great:** Highly rated for ${vendor.tags[0]}!\n\n` +
          `[[Tell me more about ${vendor.name}]] [[Book ${vendor.name}]]`;
      }

      const assistantMsg: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: surpriseContent,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMsg]);
      setIsLoading(false);
    }, 800);
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
    <div className="flex flex-col h-[100dvh] bg-white md:max-w-4xl md:mx-auto md:shadow-2xl md:shadow-slate-200/50 md:border-x md:border-slate-100 relative overflow-hidden">
      <VendorModal isOpen={isVendorModalOpen} onClose={() => setIsVendorModalOpen(false)} />
      
      {/* Header */}
      <header className="px-4 py-3 sm:px-6 sm:py-4 border-b border-slate-50 bg-white/95 backdrop-blur-xl sticky top-0 z-20 flex flex-col gap-3 shadow-sm shrink-0 overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between w-full gap-3 lg:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 w-full lg:w-auto min-w-0">
            <Link 
              to="/" 
              className="flex items-center gap-1.5 px-2 py-1.5 sm:px-3 sm:py-2 bg-slate-50 text-slate-600 rounded-lg sm:rounded-xl hover:bg-slate-100 hover:text-slate-900 transition-all border border-slate-100 shadow-sm active:scale-95 group shrink-0"
              title="Back to Landing Page"
            >
              <Home className="w-3.5 h-3.5 sm:w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wide hidden xs:inline">Home</span>
            </Link>
            <div className="bg-gradient-to-br from-teal-400 to-blue-600 p-2 sm:p-2.5 rounded-lg sm:rounded-xl shadow-lg shadow-blue-100 transform rotate-3 flex-shrink-0">
              <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-white" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500 truncate">
                NeighborWings AI
              </h1>
              <p className="text-[10px] sm:text-xs font-medium text-slate-500 mt-0.5 flex items-center gap-1 truncate">
                Tampa Bay Local Life
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 sm:gap-2 w-full lg:w-auto flex-wrap sm:flex-nowrap">
            <button 
              onClick={handleSurpriseMe}
              className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg sm:rounded-xl hover:shadow-lg hover:scale-105 transition-all shadow-md active:scale-95 group flex-1 sm:flex-none justify-center"
              title="Surprise Me!"
              aria-label="Surprise Me"
            >
              <Sparkles className="w-4 h-4 sm:w-4 sm:h-4 group-hover:animate-spin-slow" />
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wide">Surprise</span>
            </button>

            <button 
              onClick={() => handleSend("Plan my weekend")}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-slate-100 text-slate-700 border border-slate-200 rounded-lg sm:rounded-xl hover:bg-slate-200 transition-all shadow-sm active:scale-95 group flex-shrink-0"
              aria-label="Plan My Weekend"
            >
              <CalendarDays className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500 group-hover:text-slate-700" />
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wide">Weekend</span>
            </button>

            <button 
              onClick={() => setIsVendorModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg sm:rounded-xl hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md active:scale-95 group flex-1 sm:flex-none justify-center"
              aria-label="Join as Vendor"
            >
              <UserPlus className="w-4 h-4 sm:w-4 sm:h-4 text-white/90" />
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wide">Join Vendor</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-6 border-b border-slate-100 -mb-6 pt-2 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setActiveTab('chat')}
            className={`pb-4 text-sm font-bold uppercase tracking-wide transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'chat' 
                ? 'text-slate-900 border-blue-500' 
                : 'text-slate-400 border-transparent hover:text-slate-600'
            }`}
          >
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" aria-hidden="true" />
              Chat
            </div>
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`pb-4 text-sm font-bold uppercase tracking-wide transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'events' 
                ? 'text-slate-900 border-blue-500' 
                : 'text-slate-400 border-transparent hover:text-slate-600'
            }`}
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" aria-hidden="true" />
              Discover Events
            </div>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative bg-[#f8fafc]">
        {activeTab === 'chat' ? (
          <div 
            ref={scrollRef}
            className="h-full overflow-y-auto px-2 py-4 sm:px-2 sm:py-4 chat-scroll scroll-smooth"
          >
            <div className="max-w-2xl mx-auto w-full space-y-2 pb-24">
              {messages.map((msg, idx) => (
                <React.Fragment key={msg.id}>
                  <ChatMessage 
                    message={msg} 
                    onSendMessage={(text) => handleSend(text)}
                  />
                </React.Fragment>
              ))}
              
              {isLoading && (
                <div className="flex flex-col items-center justify-center py-12 animate-in fade-in zoom-in duration-500">
                  <div className="relative">
                    <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
                    </div>
                  </div>
                  <p className="mt-4 text-sm font-bold text-slate-600 uppercase tracking-widest animate-pulse">
                    Finding your Tampa matches...
                  </p>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <p className="text-red-800 font-medium mb-4">{error}</p>
                  <button 
                    onClick={() => handleSend(messages[messages.length - 1]?.content)}
                    className="px-6 py-2.5 bg-red-600 text-white rounded-xl font-bold uppercase tracking-wider text-xs hover:bg-red-700 transition-all shadow-md active:scale-95"
                  >
                    Retry Search
                  </button>
                </div>
              )}
              <div ref={messagesEndRef} className="h-1" />
            </div>
          </div>
        ) : (
          <EventsTab onPairWithVendor={handlePairWithVendor} />
        )}
      </main>

      {/* Input Area (Only visible in Chat tab) */}
      {activeTab === 'chat' && (
        <footer className="px-3 py-1.5 sm:px-6 sm:py-3 border-t border-slate-50 bg-white/95 backdrop-blur z-20 w-full shrink-0 safe-area-bottom">
          <div className="max-w-2xl mx-auto w-full">
            <div className="relative flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-[20px] p-1 pl-2 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-50/50 transition-all shadow-sm">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about events, vendors, or plans..."
                className="flex-1 bg-transparent border-none py-1.5 pl-2 pr-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-0 transition-all resize-none min-h-[36px] max-h-[100px] leading-[1.4]"
                rows={1}
                aria-label="Chat input"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                className="h-8 w-8 bg-slate-900 hover:bg-black disabled:bg-slate-200 disabled:cursor-not-allowed text-white rounded-full flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 shrink-0"
                aria-label="Send message"
              >
                <Send className="w-3.5 h-3.5 ml-0.5" aria-hidden="true" />
              </button>
            </div>
            
            <div className="mt-2 text-center space-y-1">
              <p className="flex items-center justify-center gap-1.5 text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                <Info className="w-2.5 h-2.5 text-blue-400" aria-hidden="true" /> 
                Prototype: Vendor sign-ups & email quotes are simulated
              </p>
            </div>
          </div>
        </footer>
      )}

      {/* Global Footer (Visible in all tabs) */}
      <footer className="py-2 px-4 border-t border-slate-50 bg-white text-center shrink-0 z-10">
        <Link 
          to="/" 
          className="inline-flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-widest hover:text-blue-600 transition-colors"
        >
          <Home className="w-3 h-3" />
          Back to Landing Page
        </Link>
      </footer>
    </div>
  );
};
