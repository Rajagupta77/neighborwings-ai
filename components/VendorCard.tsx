
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
    <div className="bg-white border border-slate-200 rounded-[12px] p-4 shadow-md mb-4 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group overflow-hidden">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{vendor.name}</h3>
        <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg text-yellow-700 text-[10px] font-bold border border-yellow-100 shadow-sm">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          {vendor.rating}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 mb-4 font-semibold tracking-tight">
        <div className="flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
          <PinIcon className="w-3 h-3 text-slate-400" />
          {vendor.distance}
        </div>
        <div className="flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
          <DollarSign className="w-3 h-3 text-slate-400" />
          {vendor.priceRange}
        </div>
        <div className="flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
          {vendor.location}
        </div>
      </div>

      <div className={`text-slate-600 text-[13px] leading-relaxed mb-4 ${isExpanded ? '' : 'line-clamp-2'}`}>
        {children}
      </div>

      <div className="flex flex-col gap-3 pt-3 border-t border-slate-50">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-blue-600 flex items-center gap-1.5 transition-colors"
          >
            {isExpanded ? (
              <><ChevronUp className="w-3.5 h-3.5" /> Less Details</>
            ) : (
              <><ChevronDown className="w-3.5 h-3.5" /> More Details</>
            )}
          </button>

          {onSendMessage && (
            <button
              onClick={() => onSendMessage(`I want to book ${vendor.name}. Can you help?`)}
              className="px-4 py-2 bg-slate-900 hover:bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all shadow-md hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              Book
            </button>
          )}
        </div>

        <VendorActionButtons vendor={vendor} context={context} />
      </div>
    </div>
  );
};
