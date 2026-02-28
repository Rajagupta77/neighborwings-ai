
import React from 'react';
import { MessageCircle, Instagram } from 'lucide-react';
import { Vendor } from '../types';

interface VendorActionButtonsProps {
  vendor: Vendor;
  context?: {
    event?: string;
    service?: string;
    date?: string;
    budget?: string;
  };
}

export const VendorActionButtons: React.FC<VendorActionButtonsProps> = ({ vendor, context }) => {
  const handleWhatsApp = () => {
    // Use real phone or mock phone
    const phone = vendor.phone || "+18135550000";
    
    const event = context?.event || "[event]";
    const service = context?.service || vendor.services[0] || "[service]";
    const budget = context?.budget || vendor.priceRange || "[budget]";
    
    // Exact text requested: Hi [Vendor Name]! Interested in [service] for [event]. Budget $[budget]. Available? – via NeighborWings AI
    // Note: budget might already have $ in it from data, so we handle that
    const displayBudget = budget.startsWith('$') ? budget : `$${budget}`;
    const text = `Hi ${vendor.name}! Interested in ${service} for ${event}. Budget ${displayBudget}. Available? – via NeighborWings AI`;
    
    const url = `https://wa.me/${phone.replace(/\+/g, '')}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleInstagram = () => {
    // Use real instagram or mock handle
    const handle = vendor.instagram || "neighborwings_tampa";
    const url = `https://instagram.com/${handle.replace('@', '')}`;
    window.open(url, '_blank');
  };

  return (
    <div className="flex flex-row gap-2 w-full mt-3">
      <button
        onClick={handleWhatsApp}
        className="flex-1 flex items-center justify-center gap-2 px-2 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl text-[9px] font-bold uppercase tracking-wider transition-all shadow-md hover:scale-[1.05] active:scale-95 border border-[#1eb354]"
        title="Message on WhatsApp"
      >
        <MessageCircle className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Message on WhatsApp</span>
        <span className="sm:hidden">WhatsApp</span>
      </button>

      <button
        onClick={handleInstagram}
        className="flex-1 flex items-center justify-center gap-2 px-2 py-2.5 bg-[#E1306C] hover:bg-[#c92b60] text-white rounded-xl text-[9px] font-bold uppercase tracking-wider transition-all shadow-md hover:scale-[1.05] active:scale-95 border border-[#c92b60]"
        title="View on Instagram"
      >
        <Instagram className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">View on Instagram</span>
        <span className="sm:hidden">Instagram</span>
      </button>
    </div>
  );
};
