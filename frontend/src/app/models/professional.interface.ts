export interface Professional {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  specialties: string[];
  bio?: string;
  profileImage?: string;
  schedule: WorkSchedule;
  services: ProfessionalService[];
  rating?: number;
  reviewsCount: number;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface WorkSchedule {
  monday?: DaySchedule;
  tuesday?: DaySchedule;
  wednesday?: DaySchedule;
  thursday?: DaySchedule;
  friday?: DaySchedule;
  saturday?: DaySchedule;
  sunday?: DaySchedule;
}

export interface DaySchedule {
  isWorking: boolean;
  startTime: string; // formato HH:mm
  endTime: string; // formato HH:mm
  breakStart?: string;
  breakEnd?: string;
}

export interface ProfessionalService {
  serviceId: string;
  price: number;
  duration: number; // em minutos
  isActive: boolean;
}