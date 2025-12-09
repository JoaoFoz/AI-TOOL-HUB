export interface User {
  id: string;
  name: string;
  avatarUrl: string;
}

export interface Tool {
  id: string;
  name: string;
  color: string; // Hex code
  description?: string;
}

export interface Reservation {
  id: string;
  toolId: string;
  userId: string;
  startTime: string; // ISO String
  endTime: string; // ISO String
  notes?: string;
}

export type ViewMode = 'day' | 'week' | 'month';

export interface CalendarSlot {
  timeLabel: string;
  date: Date;
}
