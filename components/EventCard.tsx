import React, { useState } from 'react';
import { Calendar, MapPin as PinIcon, DollarSign, Info, ArrowRight, Sparkles, CalendarCheck, Link as LinkIcon, MessageCircle, Instagram, Zap, ChevronUp, ChevronDown } from 'lucide-react';
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
    <div className="bg-white rounded-[2rem] p-6 border border-slate-100 hover:border-slate-300 hover:shadow-2xl hover:shadow-slate-200/60 transition-all duration-500 flex flex-col h-full relative overflow-hidden group shadow-xl shadow-slate-100/50">
      {toastMessage && (
        <div className="absolute top-4 right-4 z-20 animate-in fade-in slide-in-from-top-2 duration-300 pointer-events-none">
          <div className="bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest py-2.5 px-4 rounded-2xl shadow-2xl flex items-center gap-2">
            <CalendarCheck className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      <div className="flex justify-between items-start mb-6">
        <h3 className="font-black text-slate-900 text-xl leading-tight p-0 line-clamp-2 group-hover:text-slate-700 transition-colors tracking-tight">{event.name}</h3>
        <span className={`text-[11px] font-black uppercase tracking-[0.15em] px-4 py-2 rounded-2xl whitespace-nowrap border shadow-sm ${
          event.price.toLowerCase().includes('free') 
            ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
            : 'bg-slate-50 text-slate-700 border-slate-100'
        }`}>
          {event.price}
        </span>
      </div>
      
      <div className="space-y-4 mb-8 flex-1">
        <div className="flex flex-wrap items-center gap-3 text-[11px] font-black uppercase tracking-widest text-slate-400">
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl text-slate-600 border border-slate-100 transition-colors group-hover:bg-slate-100">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl text-slate-600 border border-slate-100 transition-colors group-hover:bg-slate-100">
            <PinIcon className="w-4 h-4 text-slate-400" />
            <span className="truncate max-w-[140px]">{event.location}</span>
          </div>
        </div>
        
        <div className={`text-[15px] text-slate-600 mt-6 leading-relaxed font-medium prose prose-slate max-w-none ${!isExpanded && 'line-clamp-2'}`}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {event.description}
          </ReactMarkdown>
        </div>
      </div>

      {event.suggestedBundle && (
        <div className="mb-8 bg-indigo-50/30 border border-indigo-100 rounded-[2rem] p-6 relative shadow-sm group/bundle overflow-hidden">
          <div className="absolute -top-3 -right-3 bg-indigo-600 text-white p-2 rounded-2xl shadow-lg transition-transform group-hover/bundle:scale-110">
            <Sparkles className="w-4 h-4" />
          </div>
          <p className="text-[11px] font-black text-indigo-900 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
            <Zap className="w-3.5 h-3.5" />
            Smart Bundle
          </p>
          <div className="text-[14px] text-indigo-800 leading-relaxed font-medium mb-6">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
              p: ({children}) => <p className="m-0 inline">{children}</p>,
              strong: ({children}) => <span className="font-black text-indigo-900">{children}</span>
            }}>
              {`**${event.suggestedBundle.vendorName}**: ${event.suggestedBundle.reason} *(${event.suggestedBundle.priceRange})*`}
            </ReactMarkdown>
          </div>
          
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => onPairWithVendor(event.name, event.suggestedBundle?.vendorName)}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white text-[12px] font-black uppercase tracking-[0.15em] rounded-2xl transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 active:scale-95"
            >
              <CalendarCheck className="w-5 h-5" />
              Book This Bundle
            </button>
            
            {bundleVendor && (
              <VendorActionButtons 
                vendor={bundleVendor} 
                context={{
                  event: event.name,
                  service: event.suggestedBundle.reason.split(' ')[0],
                  date: event.date,
                  budget: event.suggestedBundle.priceRange
                }}
              />
            )}
          </div>
        </div>
      )}

      <div className="flex gap-3 mt-auto pt-8 border-t border-slate-50">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex-1 py-4 px-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 bg-slate-50 hover:bg-slate-900 hover:text-white rounded-2xl transition-all border border-slate-100 group/btn"
          aria-expanded={isExpanded}
        >
          <span className="flex items-center justify-center gap-2">
            {isExpanded ? (
              <>Less <ChevronUp className="w-4 h-4 group-hover/btn:-translate-y-0.5 transition-transform" /></>
            ) : (
              <>Details <ChevronDown className="w-4 h-4 group-hover/btn:translate-y-0.5 transition-transform" /></>
            )}
          </span>
        </button>
        {!event.suggestedBundle && (
          <button 
            onClick={() => onPairWithVendor(event.name)}
            className="flex-[1.5] py-4 px-6 text-[12px] font-black uppercase tracking-[0.2em] text-white bg-slate-900 hover:bg-black rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95 group/pair"
          >
            <span>Pair Vendor</span>
            <ArrowRight className="w-5 h-5 group-hover/pair:translate-x-1 transition-transform" aria-hidden="true" />
          </button>
        )}
      </div>
      
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-slate-50 animate-in fade-in slide-in-from-top-2 duration-400">
          <button 
            onClick={() => onPairWithVendor(event.name, "Plan My Weekend")}
            className="w-full py-4 px-6 text-[11px] font-black uppercase tracking-[0.2em] text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-2xl transition-all flex items-center justify-center gap-3 border border-blue-100 active:scale-95"
          >
            <CalendarCheck className="w-5 h-5" aria-hidden="true" />
            Add to My Weekend
          </button>
        </div>
      )}
    </div>
  );
};
