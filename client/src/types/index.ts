export type EventCategory =
  | 'Technical'
  | 'Cultural'
  | 'Sports'
  | 'Workshop'
  | 'Hackathon'
  | 'Seminar'
  | 'Social';

export type AcademicYear =
  | '1st Year'
  | '2nd Year'
  | '3rd Year'
  | '4th Year'
  | 'Post Graduate'
  | 'Other';

export interface ClubSocialLinks {
  instagram?: string;
  linkedin?: string;
  github?: string;
  website?: string;
}

export interface Club {
  _id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  logoUrl: string;
  bannerUrl: string;
  leadName: string;
  leadEmail: string;
  memberCount: number;
  isFeatured: boolean;
  socialLinks: ClubSocialLinks;
  eventCount?: number;
  events?: Event[];
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  _id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  club: Club | string;
  category: EventCategory;
  date: string; // YYYY-MM-DD
  startTime: string;
  endTime: string;
  venue: string;
  locationType: 'In-Person' | 'Virtual' | 'Hybrid';
  bannerUrl: string;
  capacity: number;
  registeredCount: number;
  status: 'published' | 'draft' | 'completed' | 'cancelled';
  featured: boolean;
  tags: string[];
  requirements: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Registration {
  _id: string;
  registrationId: string;
  event: Event | { _id: string; title: string; category: string; date: string; startTime: string; venue: string };
  fullName: string;
  email: string;
  college: string;
  academicYear: AcademicYear;
  phone: string;
  status: 'Confirmed' | 'Waitlisted' | 'Cancelled';
  notes?: string;
  registeredAt: string;
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  name: string;
  role: 'admin' | 'superadmin';
}

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DashboardStats {
  totalEvents: number;
  upcomingEvents: number;
  totalRegistrations: number;
  activeClubs: number;
  recentRegistrations: any[];
  categoryBreakdown: Record<string, number>;
  database?: {
    isConnected: boolean;
    readyState: number;
    host: string;
  };
}
