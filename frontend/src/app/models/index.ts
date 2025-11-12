// Re-export all interfaces
export * from './user.interface';
export * from './client.interface';
export * from './professional.interface';
export * from './service.interface';
export * from './appointment.interface';

// Common types
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ErrorResponse {
  message: string;
  error: string;
  statusCode: number;
  timestamp: string;
}

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

export interface ApiError {
  message: string;
  errors?: ValidationError[];
  statusCode: number;
}

export interface TimeSlot {
  time: string;
  available: boolean;
  appointmentId?: string;
}

export interface AvailableSlots {
  date: string;
  slots: TimeSlot[];
}

export interface DashboardStats {
  totalAppointments: number;
  todayAppointments: number;
  weekRevenue: number;
  monthRevenue: number;
  completionRate: number;
  averageRating: number;
  totalClients: number;
}