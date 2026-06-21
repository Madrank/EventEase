export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'USER' | 'ORGANIZER' | 'ADMIN';
  phone?: string;
  avatar?: string;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  category?: string;
  date: string;
  endDate?: string;
  location?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  capacity?: number;
  budget?: number;
  image?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED';
  organizerId: string;
  organizer?: Pick<User, 'id' | 'firstName' | 'lastName' | 'email'>;
  guests?: Guest[];
  contributions?: Contribution[];
  providers?: Booking[];
  _count?: {
    guests: number;
    contributions: number;
    providers: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Guest {
  id: string;
  eventId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'MAYBE';
  respondedAt?: string;
  createdAt: string;
}

export interface Provider {
  id: string;
  name: string;
  category: string;
  description?: string;
  email?: string;
  phone?: string;
  website?: string;
  city?: string;
  priceRange?: string;
  rating: number;
  image?: string;
  available: boolean;
}

export interface Booking {
  id: string;
  eventId: string;
  providerId: string;
  provider: Provider;
  status: string;
  price?: number;
  notes?: string;
  date?: string;
}

export interface Accommodation {
  id: string;
  name: string;
  type: string;
  description?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country: string;
  capacity: number;
  pricePerNight?: number;
  image?: string;
  amenities?: string;
  available: boolean;
}

export interface Contribution {
  id: string;
  eventId: string;
  userId: string;
  user?: Pick<User, 'id' | 'firstName' | 'lastName' | 'avatar'>;
  amount: number;
  message?: string;
  status: 'PENDING' | 'COMPLETED' | 'REFUNDED';
  anonymous: boolean;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  eventId?: string;
  title: string;
  message: string;
  read: boolean;
  type: string;
  createdAt: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}
