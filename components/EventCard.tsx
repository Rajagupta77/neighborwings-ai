import React, { useState } from 'react';
import { Calendar, MapPin, DollarSign, Info, ArrowRight, Sparkles, CalendarCheck, Link as LinkIcon, MessageCircle, Instagram, Zap } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CommunityEvent } from '../types';
import { VENDORS } from '../data';

import { VendorActionButtons } from './VendorActionButtons';

interface EventCardProps {
  event: CommunityEvent;
  onPairWithVendor: (eventName: string, bundleVendor?: string) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onPairWithVendor }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const bundleVendor = event.suggestedBundle ? VENDORS.find(v => v.name === event.suggestedBundle!.vendorName) : null;

  return (
    <div className="bg-white rounded-[12px] p-4 shadow-md border border-slate-200 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 flex flex-col h-full relative overflow-hidden group">
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

      <div className="flex justify-between items-start mb-3">
        <h3 className="font-bold text-slate-900 text-lg leading-tight pr-2 line-clamp-2 group-hover:text-blue-600 transition-colors">{event.name}</h3>
        <span className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full whitespace-nowrap border ${
          event.price.toLowerCase().includes('free') 
            ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
            : 'bg-slate-50 text-slate-700 border-slate-100'
        }`}>
          {event.price}
        </span>
      </div>
      
      <div className="space-y-2.5 mb-4 flex-1">
        <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold text-slate-500">
          <div className="flex items-center gap-1.5 bg-blue-50 px-2 py-0.5 rounded-md text-blue-700 border border-blue-100">
            <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-red-50 px-2 py-0.5 rounded-md text-red-700 border border-red-100">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate max-w-[120px]">{event.location}</span>
          </div>
        </div>
        
        <div className={`text-[13px] text-slate-600 mt-3 leading-relaxed prose prose-sm max-w-none ${!isExpanded && 'line-clamp-2'}`}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {event.description}
          </ReactMarkdown>
        </div>
      </div>

      {event.suggestedBundle && (
        <div className="mb-4 bg-indigo-50 border border-indigo-100 rounded-xl p-3 relative shadow-sm">
          <div className="absolute -top-2 -right-2 bg-indigo-600 text-white p-1 rounded-full shadow-md">
            <Sparkles className="w-3 h-3" />
          </div>
          <p className="text-[10px] font-black text-indigo-900 uppercase tracking-widest mb-1.5 flex items-center gap-1">
            <Zap className="w-3 h-3 fill-indigo-600" /> Smart Bundle
          </p>
          <div className="text-[11px] text-indigo-800 leading-relaxed prose prose-indigo prose-sm max-w-none mb-3">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
              p: ({children}) => <p className="m-0 inline">{children}</p>
            }}>
              {`**${event.suggestedBundle.vendorName}**: ${event.suggestedBundle.reason} *(${event.suggestedBundle.priceRange})*`}
            </ReactMarkdown>
          </div>
          
          <div className="flex flex-col gap-2">
            <button 
              onClick={() => onPairWithVendor(event.name, event.suggestedBundle?.vendorName)}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all shadow-md flex items-center justify-center gap-2 active:scale-95"
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              Book Bundle
            </button>
            
            {bundleVendor && (
              <VendorActionButtons 
                vendor={bundleVendor} 
                context={{
                  event: event.name,
                  service: event.suggestedBundle.reason.split(' ')[0], // Simple heuristic
                  date: event.date,
                  budget: event.suggestedBundle.priceRange
                }}
              />
            )}
          </div>
        </div>
      )}

      <div className="flex gap-2 mt-auto pt-4 border-t border-slate-50">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex-1 py-2.5 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-slate-50 hover:bg-slate-100 hover:text-slate-900 rounded-xl transition-all min-h-[40px] border border-slate-100"
          aria-expanded={isExpanded}
        >
          {isExpanded ? 'Less' : 'Details'}
        </button>
        {!event.suggestedBundle && (
          <button 
            onClick={() => onPairWithVendor(event.name)}
            className="flex-[1.5] py-2.5 px-3 text-[10px] font-bold uppercase tracking-widest text-white bg-slate-900 hover:bg-black rounded-xl transition-all flex items-center justify-center gap-2 shadow-md min-h-[40px] active:scale-95"
          >
            <span>Pair Vendor</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        )}
      </div>
      
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-slate-50 animate-in fade-in slide-in-from-top-2 duration-300">
          <button 
            onClick={() => onPairWithVendor(event.name, "Plan My Weekend")}
            className="w-full py-2.5 px-3 text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all flex items-center justify-center gap-2 border border-blue-100 min-h-[40px] active:scale-95"
          >
            <CalendarCheck className="w-3.5 h-3.5" aria-hidden="true" />
            Add to My Weekend
          </button>
        </div>
      )}
    </div>
  );
};
