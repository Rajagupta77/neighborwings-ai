
import React, { useState, useRef, useEffect } from 'react';
import { Send, MapPin, Loader2, Info, PlusCircle, MessageSquare, Calendar, Sparkles, UserPlus, CalendarDays } from 'lucide-react';
import { Message } from './types';
import { APP_NAME, TAGLINE, INITIAL_MESSAGE } from './constants';
import ChatMessage from './components/ChatMessage';
import { getGeminiResponse } from './services/geminiService';
import { VendorModal } from './components/VendorModal';
import { EventsTab } from './components/EventsTab';
import { EVENTS, VENDORS } from './data';

const App: React.FC = () => {
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

    try {
      const chatHistory = [...messages, userMsg];
      const aiText = await getGeminiResponse(chatHistory);
      
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiText,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      console.error("Error sending message:", error);
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
      <header className="px-5 py-4 sm:px-8 sm:py-6 border-b border-slate-50 bg-white/95 backdrop-blur-xl sticky top-0 z-20 flex flex-col gap-4 shadow-sm shrink-0">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full gap-4 md:gap-0">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="bg-gradient-to-br from-teal-400 to-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-100 transform rotate-3 flex-shrink-0">
              <MapPin className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500 break-words">
                NeighborWings AI
              </h1>
              <p className="text-xs font-medium text-slate-500 mt-0.5 flex items-center gap-1 truncate">
                Your Tampa Bay Local Life Companion
              </p>
              <p className="text-[10px] sm:text-xs font-bold italic text-slate-300 uppercase tracking-widest mt-0.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 flex-shrink-0"></span>
                <span className="truncate">TAMPA'S LOCAL MATCHMAKER 📍</span>
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
            <button 
              onClick={handleSurpriseMe}
              className="flex items-center gap-2 p-2.5 sm:px-3 sm:py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all shadow-md active:scale-95 group flex-shrink-0"
              title="Surprise Me!"
              aria-label="Surprise Me"
            >
              <Sparkles className="w-5 h-5 sm:w-4 sm:h-4 group-hover:animate-spin-slow" />
              <span className="text-xs font-bold uppercase tracking-wide hidden sm:inline">Surprise Me</span>
            </button>

            <button 
              onClick={() => handleSend("Plan my weekend")}
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-200 transition-all shadow-sm active:scale-95 group flex-shrink-0"
              aria-label="Plan My Weekend"
            >
              <CalendarDays className="w-4 h-4 text-slate-500 group-hover:text-slate-700" />
              <span className="text-xs font-bold uppercase tracking-wide">Plan My Weekend</span>
            </button>

            <button 
              onClick={() => setIsVendorModalOpen(true)}
              className="flex items-center gap-2 p-2.5 sm:px-4 sm:py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md active:scale-95 group flex-shrink-0"
              aria-label="Join as Vendor"
            >
              <UserPlus className="w-5 h-5 sm:w-4 sm:h-4 text-white/90" />
              <span className="text-xs font-bold uppercase tracking-wide hidden sm:inline">Join as Vendor</span>
              <span className="text-xs font-bold uppercase tracking-wide sm:hidden">Join</span>
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
            className="h-full overflow-y-auto px-5 py-6 sm:px-12 sm:py-10 chat-scroll scroll-smooth"
          >
            <div className="max-w-2xl mx-auto w-full space-y-6 pb-20">
              {messages.map((msg) => (
                <ChatMessage 
              key={msg.id} 
              message={msg} 
              onSendMessage={(text) => handleSend(text)}
            />
              ))}
              {isLoading && (
                <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex max-w-[90%] md:max-w-[80%] flex-row items-end gap-3">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-md mb-1">
                      <Loader2 className="w-4 h-4 text-white animate-spin" />
                    </div>
                    <div className="bg-white border border-slate-100 px-5 py-4 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-3">
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></span>
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.15s]"></span>
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.3s]"></span>
                      </div>
                      <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Finding Tampa matches...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} className="h-4" />
            </div>
          </div>
        ) : (
          <EventsTab onPairWithVendor={handlePairWithVendor} />
        )}
      </main>

      {/* Input Area (Only visible in Chat tab) */}
      {activeTab === 'chat' && (
        <footer className="px-3 py-2 sm:px-6 sm:py-4 border-t border-slate-50 bg-white/95 backdrop-blur z-20 w-full shrink-0 safe-area-bottom">
          <div className="max-w-2xl mx-auto w-full">
            <div className="relative flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-[24px] p-1.5 pl-2 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-50/50 transition-all shadow-sm">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about events, vendors, or plans in Tampa Bay..."
                className="flex-1 bg-transparent border-none py-2.5 pl-3 pr-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-0 transition-all resize-none min-h-[44px] max-h-[120px]"
                rows={1}
                aria-label="Chat input"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                className="h-9 w-9 bg-slate-900 hover:bg-black disabled:bg-slate-200 disabled:cursor-not-allowed text-white rounded-full flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 mb-[1px] mr-[1px] shrink-0"
                aria-label="Send message"
              >
                <Send className="w-4 h-4 ml-0.5" aria-hidden="true" />
              </button>
            </div>
            
            <div className="mt-2 text-center space-y-1 hidden sm:block">
              <p className="flex items-center justify-center gap-1.5 text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                <Info className="w-2.5 h-2.5 text-blue-400" aria-hidden="true" /> 
                Prototype: Vendor sign-ups & email quotes are simulated
              </p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;
