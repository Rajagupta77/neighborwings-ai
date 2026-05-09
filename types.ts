
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
  email?: string;
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

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: string;
}

export interface BookingRequest {
  id?: string;
  vendor_name: string;
  vendor_email?: string;
  customer_name: string;
  customer_email: string;
  event_date: string;
  requirements: string;
  status: 'new' | 'contacted' | 'completed' | 'cancelled';
  created_at?: string;
}
