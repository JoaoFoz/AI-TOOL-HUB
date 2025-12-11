export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  role: 'Admin' | 'Member' | 'Viewer';
  initials: string;
}

export interface Tool {
  id: string;
  name: string;
  color: string; // Hex code or HSL
  description?: string;
  price?: string;
  billingCycle?: 'Monthly' | 'Yearly';
  icon?: string; // Lucide icon name
  startDate?: string; // ISO Date YYYY-MM-DD
  endDate?: string; // ISO Date YYYY-MM-DD
  nature?: string; // e.g. 'Text-to-Speech', 'Image Generation'
}

export interface Reservation {
  id: string;
  toolId: string;
  userId: string;
  startTime: string; // ISO String
  endTime: string; // ISO String
  notes?: string;
}

export interface Review {
  id: string;
  toolId: string;
  userId: string;
  rating: number; // 1 to 5
  comment: string;
  timestamp: string; // ISO String
}

export type ViewMode = 'day' | 'week' | 'month';
export type PageView = 'dashboard' | 'team' | 'tools' | 'settings' | 'reviews';

export interface CalendarSlot {
  timeLabel: string;
  date: Date;
}