
export type Role = 'user' | 'assistant';

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: Date;
}

export interface Vendor {
  name: string;
  services: string[];
  priceRange: string;
  location: string;
  distance: string;
  rating: number;
  tags: string[];
  description: string;
  phone?: string;
  instagram?: string;
}

export interface CommunityEvent {
  name: string;
  date: string;
  location: string;
  price: string;
  organizer: string;
  description: string;
  suggestedBundle?: {
    vendorName: string;
    reason: string;
    priceRange: string;
  };
}
