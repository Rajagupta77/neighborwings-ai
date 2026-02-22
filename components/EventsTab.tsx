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
        // Simple string comparison for now, ideally parse dates
        return a.date.localeCompare(b.date);
      }
      if (sortBy === "price") {
        const priceA = a.price.toLowerCase().includes("free") ? 0 : 1;
        const priceB = b.price.toLowerCase().includes("free") ? 0 : 1;
        return priceA - priceB;
      }
      // Popularity mock (random deterministic for demo)
      return a.name.length - b.name.length;
    });
  }, [activeFilter, searchQuery, sortBy]);

  return (
    <div className="h-full flex flex-col bg-[#f8fafc]">
      {/* Search & Filter Header */}
      <div className="px-5 py-4 bg-white border-b border-slate-100 sticky top-0 z-10 space-y-3 shadow-sm">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden="true" />
            <input 
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              aria-label="Search events"
            />
          </div>
          <div className="relative">
            <button 
              onClick={() => setIsSortOpen(!isSortOpen)}
              className={`h-full px-3 flex items-center gap-2 border rounded-xl text-sm font-medium transition-colors ${
                isSortOpen ? 'bg-slate-100 border-slate-300 text-slate-900' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
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
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-20 animate-in fade-in zoom-in-95 duration-200">
                  {SORT_OPTIONS.map(option => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSortBy(option.value);
                        setIsSortOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 text-sm hover:bg-slate-50 transition-colors flex items-center justify-between ${
                        sortBy === option.value ? 'text-blue-600 font-medium bg-blue-50/50' : 'text-slate-600'
                      }`}
                    >
                      {option.label}
                      {sortBy === option.value && <Plus className="w-3 h-3 rotate-45" aria-hidden="true" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-5 px-5 sm:mx-0 sm:px-0">
          {FILTERS.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition-all border ${
                activeFilter === filter
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md transform scale-105'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      <div className="flex-1 overflow-y-auto p-5 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto pb-20">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event, index) => (
              <EventCard 
                key={index} 
                event={event} 
                onPairWithVendor={onPairWithVendor}
              />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center opacity-60">
              <Search className="w-12 h-12 text-slate-300 mb-4" />
              <p className="text-slate-900 font-bold text-lg">No events found</p>
              <p className="text-slate-500 text-sm">Try adjusting your search or filters</p>
              <button 
                onClick={() => {
                  setSearchQuery("");
                  setActiveFilter("All");
                }}
                className="mt-4 text-blue-600 text-sm font-bold hover:underline"
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
