export interface Appointment {
  id: string;
  usuarioId: string; // ID do cliente (backend usa usuarioId)
  clientId?: string; // Alias para compatibilidade
  profissionalId: string;
  servicoId: string; // Backend usa apenas um serviço por agendamento
  services?: AppointmentService[]; // Manter para compatibilidade com componentes
  dataHora: string | Date; // Backend usa LocalDateTime
  scheduledDate?: Date; // Calculado a partir de dataHora
  startTime?: string; // formato HH:mm - Calculado a partir de dataHora
  endTime?: string; // formato HH:mm
  status: AppointmentStatus | string;
  totalPrice?: number;
  totalDuration?: number; // em minutos
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
  canceledAt?: Date;
  cancelReason?: string;
  // Dados expandidos do backend
  professionalName?: string; // Nome do profissional
  clientName?: string; // Nome do cliente
}

export interface AppointmentService {
  serviceId: string;
  serviceName: string;
  price: number;
  duration: number;
}

export enum AppointmentStatus {
  SCHEDULED = 'SCHEDULED',
  CONFIRMED = 'CONFIRMED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
  NO_SHOW = 'NO_SHOW'
}

export interface CreateAppointmentRequest {
  clientId: string;
  professionalId: string;
  serviceIds: string[];
  scheduledDate: string; // formato YYYY-MM-DD
  startTime: string; // formato HH:mm
  notes?: string;
}

export interface UpdateAppointmentRequest {
  scheduledDate?: string;
  startTime?: string;
  serviceIds?: string[];
  notes?: string;
  status?: AppointmentStatus;
}