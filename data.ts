import { CommunityEvent, Vendor } from './types';

export const EVENTS: CommunityEvent[] = [
  {
    name: "Gasparilla Festival of the Arts",
    date: "Feb 28–Mar 1, 2026",
    location: "Julian B. Lane Riverfront Park",
    price: "FREE",
    organizer: "Gasparilla Arts",
    description: "Premier outdoor art festival featuring hundreds of artists, live music, food vendors, and interactive experiences.",
    suggestedBundle: {
      vendorName: "Elegant Events Catering",
      reason: "Hosting a group? Skip the lines and cater a picnic.",
      priceRange: "$500–1200"
    }
  },
  {
    name: "Grand Prix of St. Petersburg",
    date: "Feb 27–Mar 1, 2026",
    location: "Downtown St. Pete",
    price: "Ticketed",
    organizer: "IndyCar",
    description: "High-speed IndyCar racing through the streets of downtown St. Pete, plus a waterfront festival atmosphere.",
    suggestedBundle: {
      vendorName: "Bay Area Balloons & More",
      reason: "Celebrate the win with a custom racing-themed balloon arch.",
      priceRange: "$180–420"
    }
  },
  {
    name: "Florida State Fair",
    date: "Feb 5–16, 2026",
    location: "Florida State Fairgrounds",
    price: "Ticketed",
    organizer: "Florida State Fair Authority",
    description: "Massive annual fair with thrilling rides, deep-fried food, agriculture exhibits, and live entertainment."
  },
  {
    name: "Tampa Bay Beach Cleanup",
    date: "Regular Weekends",
    location: "Various Beaches",
    price: "FREE",
    organizer: "Tampa Bay Watch",
    description: "Volunteer opportunity to keep our coast beautiful. Great for groups, families, and eco-conscious locals.",
    suggestedBundle: {
      vendorName: "Tampa Events Decor Pros",
      reason: "Eco-friendly decor for a post-cleanup celebration.",
      priceRange: "$250–550"
    }
  },
  {
    name: "Clearwater Sea-Blues Festival",
    date: "Late Feb/Early Mar",
    location: "Coachman Park",
    price: "Ticketed/Free",
    organizer: "City of Clearwater",
    description: "Fresh seafood and live blues music right on the water at the newly renovated Coachman Park.",
    suggestedBundle: {
      vendorName: "Sunset Photography Tampa",
      reason: "Capture the sunset and music vibes professionally.",
      priceRange: "$400–800"
    }
  },
  {
    name: "St. Pete CommUNITY Festival",
    date: "Early Mar",
    location: "Azalea Park",
    price: "FREE",
    organizer: "Local Community",
    description: "Family-friendly celebration with music, food trucks, local art, and community resources."
  },
  {
    name: "Pinellas Arts Walk",
    date: "Monthly (Second Saturday)",
    location: "Downtown St. Pete",
    price: "FREE",
    organizer: "St. Pete Arts Alliance",
    description: "Self-guided tour of galleries and studios. Meet artists, see live demos, and enjoy the vibrant art scene."
  }
];

export const VENDORS: Vendor[] = [
  {
    name: "Tampa Events Decor Pros",
    services: ["decor", "balloons"],
    priceRange: "$250–550",
    location: "South Tampa",
    distance: "6 mi downtown",
    rating: 4.9,
    tags: ["beach themes", "eco-friendly"],
    description: "Specializing in sustainable and beach-themed decor for local events.",
    phone: "+17275559876",
    instagram: "tampabeachdecor"
  },
  {
    name: "Sunset Photography Tampa",
    services: ["photography"],
    priceRange: "$400–800",
    location: "Ybor City",
    distance: "4 mi",
    rating: 4.7,
    tags: ["romantic", "gender reveal"],
    description: "Capturing golden hour moments and special celebrations with a romantic touch.",
    phone: "+18135551234",
    instagram: "sunsetphoto_tampa"
  },
  {
    name: "Bay Area Balloons & More",
    services: ["balloons", "setups"],
    priceRange: "$180–420",
    location: "St. Petersburg",
    distance: "22 mi",
    rating: 4.6,
    tags: ["gender reveal", "parties"],
    description: "Creative balloon arrangements for birthdays, reveals, and corporate events.",
    phone: "+17275556789",
    instagram: "bayareaballoons"
  },
  {
    name: "Elegant Events Catering",
    services: ["catering"],
    priceRange: "$500–1200",
    location: "Hyde Park",
    distance: "5 mi",
    rating: 4.8,
    tags: ["weddings", "corporate"],
    description: "Full-service catering with a focus on elegant presentation and local flavors.",
    phone: "+17275554321",
    instagram: "eleganteventscatering"
  }
];
