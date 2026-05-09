
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Star, MapPin as PinIcon, DollarSign, CalendarCheck } from 'lucide-react';
import { VENDORS } from '../data';
import { VendorActionButtons } from './VendorActionButtons';

interface VendorCardProps {
  vendorName: string;
  children: React.ReactNode;
  onSendMessage?: (text: string) => void;
  context?: {
    event?: string;
    service?: string;
    date?: string;
    budget?: string;
  };
}

export const VendorCard: React.FC<VendorCardProps> = ({ vendorName, children, onSendMessage, context }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const vendor = VENDORS.find(v => v.name === vendorName);

  if (!vendor) return <div className="mb-4">{children}</div>;

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xl shadow-slate-200/40 mb-8 hover:border-slate-300 hover:shadow-2xl transition-all duration-500 group overflow-hidden">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-black text-slate-900 group-hover:text-slate-700 transition-colors tracking-tight">{vendor.name}</h3>
        <div className="flex items-center gap-1.5 bg-yellow-50 px-3 py-1.5 rounded-2xl text-yellow-700 text-[11px] font-black border border-yellow-100 shadow-sm transition-transform group-hover:scale-110">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          {vendor.rating}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 mb-6 font-bold uppercase tracking-[0.15em]">
        <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100 transition-colors group-hover:bg-slate-100">
          <PinIcon className="w-4 h-4 text-slate-400" />
          {vendor.distance}
        </div>
        <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100 transition-colors group-hover:bg-slate-100">
          <DollarSign className="w-4 h-4 text-slate-400" />
          {vendor.priceRange}
        </div>
      </div>

      <div className={`text-slate-600 text-[15px] leading-relaxed mb-6 font-medium ${isExpanded ? '' : 'line-clamp-2'}`}>
        {children}
      </div>

      <div className="flex flex-col gap-4 pt-6 border-t border-slate-50">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 flex items-center gap-2 transition-all group/btn"
          >
            {isExpanded ? (
              <><ChevronUp className="w-4 h-4 group-hover/btn:-translate-y-0.5 transition-transform" /> Less Details</>
            ) : (
              <><ChevronDown className="w-4 h-4 group-hover/btn:translate-y-0.5 transition-transform" /> More Details</>
            )}
          </button>

          {onSendMessage && (
            <button
              onClick={() => onSendMessage(`I want to book ${vendor.name}. Can you help?`)}
              className="px-6 py-3 bg-slate-900 hover:bg-black text-white text-[11px] font-black uppercase tracking-[0.15em] rounded-2xl transition-all shadow-xl hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <CalendarCheck className="w-4 h-4" />
              Book Now
            </button>
          )}
        </div>

        <VendorActionButtons vendor={vendor} context={context} />
      </div>
    </div>
  );
};
