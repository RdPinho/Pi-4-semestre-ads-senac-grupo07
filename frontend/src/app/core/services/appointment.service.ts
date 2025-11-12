import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appointment, CreateAppointmentRequest, UpdateAppointmentRequest, ApiResponse } from '../../models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private readonly baseUrl = `${environment.apiUrl}/agendamentos`;

  constructor(private http: HttpClient) {}

  // Listar agendamentos
  getAppointments(params?: {
    status?: string;
    date?: string;
    clientId?: string;
    professionalId?: string;
    page?: number;
    limit?: number;
  }): Observable<ApiResponse<Appointment[]>> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.keys(params).forEach(key => {
        const value = params[key as keyof typeof params];
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }

    return this.http.get<ApiResponse<Appointment[]>>(this.baseUrl, { params: httpParams });
  }

  // Obter agendamento por ID
  getAppointmentById(id: string): Observable<ApiResponse<Appointment>> {
    return this.http.get<ApiResponse<Appointment>>(`${this.baseUrl}/${id}`);
  }

  // Criar novo agendamento
  createAppointment(appointment: CreateAppointmentRequest): Observable<ApiResponse<Appointment>> {
    return this.http.post<ApiResponse<Appointment>>(this.baseUrl, appointment);
  }

  // Atualizar agendamento
  updateAppointment(id: string, updates: UpdateAppointmentRequest): Observable<ApiResponse<Appointment>> {
    return this.http.patch<ApiResponse<Appointment>>(`${this.baseUrl}/${id}`, updates);
  }

  // Cancelar agendamento
  cancelAppointment(id: string, reason?: string): Observable<ApiResponse<Appointment>> {
    return this.http.patch<ApiResponse<Appointment>>(`${this.baseUrl}/${id}/cancelar`, { reason });
  }

  // Confirmar agendamento
  confirmAppointment(id: string): Observable<ApiResponse<Appointment>> {
    return this.http.patch<ApiResponse<Appointment>>(`${this.baseUrl}/${id}/confirmar`, {});
  }

  // Iniciar atendimento
  startAppointment(id: string): Observable<ApiResponse<Appointment>> {
    return this.http.patch<ApiResponse<Appointment>>(`${this.baseUrl}/${id}/start`, {});
  }

  // Finalizar atendimento
  completeAppointment(id: string, notes?: string): Observable<ApiResponse<Appointment>> {
    return this.http.patch<ApiResponse<Appointment>>(`${this.baseUrl}/${id}/concluir`, { notes });
  }

  // Reagendar agendamento
  rescheduleAppointment(id: string, newDate: string, newTime: string): Observable<ApiResponse<Appointment>> {
    return this.http.patch<ApiResponse<Appointment>>(`${this.baseUrl}/${id}/reschedule`, {
      scheduledDate: newDate,
      startTime: newTime
    });
  }

  // Obter agendamentos do dia atual para profissional
  getTodayAppointments(professionalId: string): Observable<ApiResponse<Appointment[]>> {
    const today = new Date().toISOString().split('T')[0];
    return this.getAppointments({ 
      professionalId, 
      date: today 
    });
  }

  // Obter próximos agendamentos para cliente
  getUpcomingAppointments(clientId: string): Observable<ApiResponse<Appointment[]>> {
    return this.getAppointments({ 
      clientId, 
      status: 'SCHEDULED,CONFIRMED' 
    });
  }

  // Obter histórico de agendamentos
  getAppointmentHistory(userId: string, userType: 'client' | 'professional'): Observable<ApiResponse<Appointment[]>> {
    const params = userType === 'client' 
      ? { clientId: userId, status: 'COMPLETED,CANCELED' }
      : { professionalId: userId, status: 'COMPLETED,CANCELED' };
    
    return this.getAppointments(params);
  }
}