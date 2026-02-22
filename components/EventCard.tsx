import React, { useState } from 'react';
import { Calendar, MapPin, DollarSign, Info, ArrowRight, Sparkles, CalendarCheck, Link as LinkIcon, MessageCircle, Instagram } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CommunityEvent } from '../types';
import { VENDORS } from '../data';

interface EventCardProps {
  event: CommunityEvent;
  onPairWithVendor: (eventName: string, bundleVendor?: string) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onPairWithVendor }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleWhatsApp = (vendorName: string, phone: string) => {
    const text = `Hi ${vendorName}! Interested in your services for ${event.name} via NeighborWings AI.`;
    const url = `https://wa.me/${phone.replace(/\+/g, '')}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    setToastMessage("Opening WhatsApp...");
    setTimeout(() => setToastMessage(null), 2000);
  };

  const handleInstagram = (username: string) => {
    const url = `https://instagram.com/${username.replace('@', '')}`;
    window.open(url, '_blank');
    setToastMessage("Opening Instagram...");
    setTimeout(() => setToastMessage(null), 2000);
  };

  const bundleVendor = event.suggestedBundle ? VENDORS.find(v => v.name === event.suggestedBundle!.vendorName) : null;

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200 flex flex-col h-full relative overflow-hidden group">
      {toastMessage && (
        <div className="absolute top-2 right-2 z-20 animate-in fade-in slide-in-from-top-2 duration-300 pointer-events-none">
          <div className="bg-slate-900 text-white text-[9px] font-bold py-1.5 px-2.5 rounded-lg shadow-xl flex items-center gap-1.5">
            <div className="bg-green-500 rounded-full p-0.5">
              <CalendarCheck className="w-2 h-2 text-white" />
            </div>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-slate-900 text-base leading-tight pr-2 line-clamp-2 group-hover:text-blue-600 transition-colors">{event.name}</h3>
        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-full whitespace-nowrap border ${
          event.price.toLowerCase().includes('free') 
            ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
            : 'bg-slate-50 text-slate-700 border-slate-100'
        }`}>
          {event.price}
        </span>
      </div>
      
      <div className="space-y-2 mb-3 flex-1">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
          <Calendar className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
          <span>{event.date}</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
          <MapPin className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
          <span className="truncate">{event.location}</span>
        </div>
        
        <div className={`text-xs text-slate-600 mt-3 leading-7 prose prose-sm max-w-none ${!isExpanded && 'line-clamp-3'}`}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {event.description}
          </ReactMarkdown>
        </div>
      </div>

      {event.suggestedBundle && (
        <div className="mb-3 bg-indigo-50 border border-indigo-100 rounded-lg p-2.5 relative">
          <div className="absolute -top-1.5 -right-1.5 bg-indigo-600 text-white p-0.5 rounded-full shadow-sm">
            <Sparkles className="w-2.5 h-2.5" />
          </div>
          <p className="text-[10px] font-bold text-indigo-900 uppercase tracking-wide mb-0.5">Smart Bundle</p>
          <div className="text-[10px] text-indigo-800 leading-snug prose prose-indigo prose-sm max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
              p: ({children}) => <p className="m-0 inline">{children}</p>
            }}>
              {`**${event.suggestedBundle.vendorName}**: ${event.suggestedBundle.reason} *(${event.suggestedBundle.priceRange})*`}
            </ReactMarkdown>
          </div>
          
          <div className="flex flex-col gap-2 mt-2">
            <button 
              onClick={() => onPairWithVendor(event.name, event.suggestedBundle?.vendorName)}
              className="w-full py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-[9px] font-bold uppercase tracking-wider rounded-md transition-all shadow-sm flex items-center justify-center gap-1"
            >
              <CalendarCheck className="w-3 h-3" />
              Book Bundle?
            </button>
            
            {bundleVendor && (bundleVendor.phone || bundleVendor.instagram) && (
              <div className="flex gap-2">
                {bundleVendor.phone && (
                  <button
                    onClick={() => handleWhatsApp(bundleVendor.name, bundleVendor.phone!)}
                    className="flex-1 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 rounded-md text-[9px] font-bold uppercase tracking-wider transition-colors shadow-sm flex items-center justify-center gap-1"
                    title="Chat on WhatsApp"
                  >
                    <MessageCircle className="w-3 h-3" />
                    WhatsApp
                  </button>
                )}
                {bundleVendor.instagram && (
                  <button
                    onClick={() => handleInstagram(bundleVendor.instagram!)}
                    className="flex-1 py-1.5 bg-pink-50 text-pink-700 hover:bg-pink-100 border border-pink-200 rounded-md text-[9px] font-bold uppercase tracking-wider transition-colors shadow-sm flex items-center justify-center gap-1"
                    title="See portfolio on Instagram"
                  >
                    <Instagram className="w-3 h-3" />
                    Instagram
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex gap-2 mt-auto pt-3 border-t border-slate-50">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex-1 py-2 px-2 text-[10px] font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors min-h-[36px]"
          aria-expanded={isExpanded}
        >
          {isExpanded ? 'Less' : 'Details'}
        </button>
        {!event.suggestedBundle && (
          <button 
            onClick={() => onPairWithVendor(event.name)}
            className="flex-[1.5] py-2 px-2 text-[10px] font-bold text-white bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 rounded-lg transition-all flex items-center justify-center gap-1 shadow-sm min-h-[36px]"
          >
            <span>Pair Vendor</span>
            <LinkIcon className="w-3 h-3" aria-hidden="true" />
          </button>
        )}
      </div>
      
      {isExpanded && (
        <div className="mt-2 pt-2 border-t border-slate-50 animate-in fade-in slide-in-from-top-1 duration-200">
          <button 
            onClick={() => onPairWithVendor(event.name, "Plan My Weekend")}
            className="w-full py-2 px-2 text-[10px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center justify-center gap-1 border border-blue-100 min-h-[36px]"
          >
            <CalendarCheck className="w-3 h-3" aria-hidden="true" />
            Add to My Weekend
          </button>
        </div>
      )}
    </div>
  );
};
