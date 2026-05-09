import React, { useState, useMemo } from 'react';
import { CommunityEvent } from '../types';
import { EventCard } from './EventCard';
import { Search, SlidersHorizontal, Plus } from 'lucide-react';

import { EVENTS } from '../data';

interface EventsTabProps {
  onPairWithVendor: (eventName: string, bundleVendor?: string) => void;
}

const FILTERS = ["All", "Free", "This Weekend", "Outdoor", "Music", "Volunteer"];
const SORT_OPTIONS = [
  { label: "Date (Soonest)", value: "date" },
  { label: "Popularity", value: "popularity" },
  { label: "Price (Low to High)", value: "price" }
];

export const EventsTab: React.FC<EventsTabProps> = ({ onPairWithVendor }) => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [isSortOpen, setIsSortOpen] = useState(false);

  const filteredEvents = useMemo(() => {
    let filtered = EVENTS.filter(event => {
      // Search filter
      const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          event.location.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (!matchesSearch) return false;

      // Category filter
      if (activeFilter === "All") return true;
      if (activeFilter === "Free") return event.price.toLowerCase().includes("free");
      if (activeFilter === "This Weekend") return ["Feb 28", "Mar 1", "Feb 27"].some(d => event.date.includes(d));
      if (activeFilter === "Outdoor") return !event.location.includes("Indoor");
      if (activeFilter === "Music") return event.description.toLowerCase().includes("music");
      if (activeFilter === "Volunteer") return event.description.toLowerCase().includes("volunteer");
      
      return true;
    });

    // Sorting
    return filtered.sort((a, b) => {
      if (sortBy === "date") {
        return a.date.localeCompare(b.date);
      }
      if (sortBy === "price") {
        const priceA = a.price.toLowerCase().includes("free") ? 0 : 1;
        const priceB = b.price.toLowerCase().includes("free") ? 0 : 1;
        return priceA - priceB;
      }
      return a.name.length - b.name.length;
    });
  }, [activeFilter, searchQuery, sortBy]);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Search & Filter Header */}
      <div className="px-6 py-8 bg-white space-y-8">
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Discover Tampa Bay</h2>
          <p className="text-slate-500 font-medium tracking-wide">Find the best local events happening around you.</p>
        </div>

        <div className="flex gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-slate-900 transition-colors" aria-hidden="true" />
            <input 
              type="text"
              placeholder="Search events, locations, or vibes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-slate-100 transition-all shadow-sm"
              aria-label="Search events"
            />
          </div>
          <div className="relative">
            <button 
              onClick={() => setIsSortOpen(!isSortOpen)}
              className={`h-full px-6 flex items-center gap-2 border rounded-2xl text-sm font-black uppercase tracking-widest transition-all ${
                isSortOpen ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-400'
              }`}
              aria-label="Sort events"
              aria-expanded={isSortOpen}
            >
              <SlidersHorizontal className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">Sort</span>
            </button>
            
            {isSortOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsSortOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-20 animate-in fade-in zoom-in-95 duration-200">
                  {SORT_OPTIONS.map(option => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSortBy(option.value);
                        setIsSortOpen(false);
                      }}
                      className={`w-full text-left px-5 py-4 text-[11px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-colors flex items-center justify-between ${
                        sortBy === option.value ? 'text-slate-900 bg-slate-50/50' : 'text-slate-400'
                      }`}
                    >
                      {option.label}
                      {sortBy === option.value && <div className="w-1.5 h-1.5 bg-slate-900 rounded-full" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-6 px-6 sm:mx-0 sm:px-0">
          {FILTERS.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`whitespace-nowrap px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-[0.15em] transition-all border shadow-sm ${
                activeFilter === filter
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-200'
                  : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300 hover:text-slate-900'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      <div className="flex-1 overflow-y-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-24">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event, index) => (
              <EventCard 
                key={index} 
                event={event} 
                onPairWithVendor={onPairWithVendor}
              />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-32 text-center animate-in fade-in zoom-in duration-500">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <Search className="w-10 h-10 text-slate-300" />
              </div>
              <p className="text-slate-900 font-black text-xl tracking-tight mb-2">No events found</p>
              <p className="text-slate-500 font-medium">Try adjusting your search or filters to explore more.</p>
              <button 
                onClick={() => {
                  setSearchQuery("");
                  setActiveFilter("All");
                }}
                className="mt-8 px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
