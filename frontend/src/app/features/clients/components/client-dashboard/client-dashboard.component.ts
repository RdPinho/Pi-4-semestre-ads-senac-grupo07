import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../../../core/services/auth.service';
import { AppointmentService } from '../../../../core/services/appointment.service';
import { ServiceService } from '../../../../core/services/service.service';
import { UserService } from '../../../../core/services/user.service';
import { User, Appointment, Service, AppointmentStatus, ServiceCategory, DashboardStats } from '../../../../models';
import { AppointmentBookingComponent } from '../../../appointments/components/appointment-booking/appointment-booking.component';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    AppointmentBookingComponent
  ],
  templateUrl: './client-dashboard.component.html',
  styleUrls: ['./client-dashboard.component.css']
})
export class ClientDashboardComponent implements OnInit {
  readonly AppointmentStatus = AppointmentStatus;
  currentUser: User | null = null;
  today = new Date();

  // Dados do cliente
  clientStats = {
    upcomingAppointments: 0,
    totalAppointments: 0,
    favoriteServices: 0,
    loyaltyPoints: 0
  };

  // Propriedades do componente
  totalSpent = 0;
  showSummary = true;
  showAllAppointments = false;
  showBookingModal = false;
  showCancelModal = false;
  selectedServiceForBooking?: Service;
  apppointmentToCancel?: Appointment;

  // Serviços preferenciais - será calculado com base nos agendamentos
  preferredServices: (Service & { usageCount?: number })[] = [];

  // Próximos agendamentos - será carregado do backend
  upcomingAppointments: Appointment[] = [];

  // Agendamentos completados - será carregado do backend
  private completedAppointmentsData: Appointment[] = [];

  // Todos os agendamentos combinados
  get allAppointments(): Appointment[] {
    return [...this.upcomingAppointments, ...this.completedAppointmentsData]
      .sort((a, b) => {
        // Ordenar por data: futuros primeiro (ascendente), depois passados (descendente)
        const dateA = a.scheduledDate?.getTime() || 0;
        const dateB = b.scheduledDate?.getTime() || 0;
        const now = Date.now();
        
        const aIsFuture = dateA >= now;
        const bIsFuture = dateB >= now;
        
        if (aIsFuture && bIsFuture) return dateA - dateB; // Futuros: mais próximo primeiro
        if (!aIsFuture && !bIsFuture) return dateB - dateA; // Passados: mais recente primeiro
        return aIsFuture ? -1 : 1; // Futuros antes dos passados
      });
  }

  get completedAppointments(): Appointment[] {
    return this.completedAppointmentsData;
  }

  constructor(
    private authService: AuthService,
    private appointmentService: AppointmentService,
    private serviceService: ServiceService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    if (!this.currentUser) return;

    let upcomingLoaded = false;
    let completedLoaded = false;

    const checkAndCalculate = () => {
      if (upcomingLoaded && completedLoaded) {
        console.log('Ambos os arrays carregados, calculando serviços preferenciais...');
        this.calculatePreferredServices();
      }
    };

    // Carregar próximos agendamentos (status: SCHEDULED, CONFIRMED, PENDENTE)
    this.appointmentService.getAppointments({
      clientId: this.currentUser.id,
      status: 'SCHEDULED,CONFIRMED,PENDENTE'
    }).subscribe({
      next: (response) => {
        if (response.success) {
          this.upcomingAppointments = response.data
            .map(apt => this.transformAppointment(apt))
            .sort((a, b) => {
              const dateA = a.scheduledDate?.getTime() || 0;
              const dateB = b.scheduledDate?.getTime() || 0;
              return dateA - dateB; // Ordenar do mais próximo para o mais distante
            });
          this.clientStats.upcomingAppointments = this.upcomingAppointments.length;
          console.log('Upcoming appointments carregados:', this.upcomingAppointments.length);
        }
        upcomingLoaded = true;
        checkAndCalculate();
      },
      error: (error) => {
        console.error('Erro ao carregar próximos agendamentos:', error);
        upcomingLoaded = true;
        checkAndCalculate();
      }
    });

    // Carregar agendamentos completados
    this.appointmentService.getAppointments({
      clientId: this.currentUser.id,
      status: 'COMPLETED,CONCLUIDO'
    }).subscribe({
      next: (response) => {
        if (response.success) {
          this.completedAppointmentsData = response.data
            .map(apt => this.transformAppointment(apt))
            .sort((a, b) => {
              const dateA = a.scheduledDate?.getTime() || 0;
              const dateB = b.scheduledDate?.getTime() || 0;
              return dateB - dateA; // Ordenar do mais recente para o mais antigo
            });
          this.clientStats.totalAppointments = this.completedAppointmentsData.length + this.upcomingAppointments.length;
          this.calculateTotalSpent();
          console.log('Completed appointments carregados:', this.completedAppointmentsData.length);
        }
        completedLoaded = true;
        checkAndCalculate();
      },
      error: (error) => {
        console.error('Erro ao carregar histórico:', error);
        completedLoaded = true;
        checkAndCalculate();
      }
    });
  }

  // Calcular serviços preferenciais baseado nos agendamentos
  private calculatePreferredServices(): void {
    const serviceUsage = new Map<string, { service: Service & { usageCount?: number }, count: number }>();
    
    // Contar quantas vezes cada serviço foi usado
    const allAppointments = [...this.upcomingAppointments, ...this.completedAppointmentsData];
    
    console.log('=== DEBUG SERVIÇOS PREFERENCIAIS ===');
    console.log('Total de agendamentos:', allAppointments.length);
    console.log('Agendamentos:', allAppointments);
    
    allAppointments.forEach(appointment => {
      console.log('Processando appointment:', appointment);
      console.log('Services do appointment:', appointment.services);
      
      // Verificar se o appointment tem services array
      if (appointment.services && appointment.services.length > 0) {
        appointment.services.forEach(service => {
          console.log('Processando service:', service);
          const key = service.serviceId || service.serviceName;
          console.log('Key do service:', key);
          
          if (key) {
            if (serviceUsage.has(key)) {
              serviceUsage.get(key)!.count++;
            } else {
              serviceUsage.set(key, {
                service: {
                  id: service.serviceId || '',
                  nome: service.serviceName || 'Serviço',
                  descricao: '',
                  preco: service.price || 0,
                  duracaoMinutos: service.duration || 60,
                  disponivel: true // Adicionar campo disponível
                },
                count: 1
              });
            }
          }
        });
      }
    });
    
    console.log('Total de serviços únicos encontrados:', serviceUsage.size);
    console.log('Map de serviceUsage:', serviceUsage);
    
    // Ordenar por mais usado e pegar os top serviços
    this.preferredServices = Array.from(serviceUsage.values())
      .sort((a, b) => b.count - a.count)
      .map(item => ({
        ...item.service,
        usageCount: item.count
      }))
      .slice(0, 8); // Limitar a 8 serviços
      
    console.log('Serviços preferenciais finais:', this.preferredServices);
    console.log('=== FIM DEBUG ===');
  }

  // Transformar dados do backend para formato usado no frontend
  private transformAppointment(apt: any): Appointment {
    // Converter dataHora (string ISO ou Date) para Date
    const dataHora = new Date(apt.dataHora);
    
    // Extrair data e hora
    const scheduledDate = dataHora;
    const startTime = dataHora.toTimeString().substring(0, 5); // HH:mm
    
    // Calcular endTime
    let duration = 60; // padrão
    
    // Se veio servico expandido do backend, usar sua duração
    if (apt.servico && apt.servico.duracaoMinutos) {
      duration = apt.servico.duracaoMinutos;
    }
    
    const endDate = new Date(dataHora.getTime() + duration * 60000);
    const endTime = endDate.toTimeString().substring(0, 5);
    
    // Montar array de services
    let services = apt.services || [];
    
    // Se não tem services mas tem servico expandido, usar ele
    if ((!services || services.length === 0) && apt.servico) {
      services = [{
        serviceId: apt.servico.id || apt.servicoId,
        serviceName: apt.servico.nome || 'Serviço',
        price: apt.servico.preco || 0,
        duration: apt.servico.duracaoMinutos || 60
      }];
    }
    
    // Se não tem nada, criar um padrão
    if (!services || services.length === 0) {
      services = [{
        serviceId: apt.servicoId,
        serviceName: 'Serviço',
        price: 0,
        duration: 60
      }];
    }
    
    // Informações do profissional (se disponível)
    let professionalName = undefined;
    if (apt.profissional && apt.profissional.nome) {
      professionalName = apt.profissional.nome;
    }
    
    return {
      id: apt.id,
      clientId: apt.usuarioId,
      usuarioId: apt.usuarioId,
      profissionalId: apt.profissionalId,
      servicoId: apt.servicoId,
      services: services,
      dataHora: apt.dataHora,
      scheduledDate: scheduledDate,
      startTime: startTime,
      endTime: endTime,
      status: this.normalizeStatus(apt.status),
      totalPrice: apt.servico?.preco || apt.totalPrice || 0,
      totalDuration: duration,
      notes: apt.notes,
      professionalName: professionalName,
      createdAt: apt.createdAt ? new Date(apt.createdAt) : new Date(),
      updatedAt: apt.updatedAt ? new Date(apt.updatedAt) : new Date()
    };
  }

  // Normalizar status do backend para enum do frontend
  private normalizeStatus(status: any): AppointmentStatus {
    // Se o status for null/undefined, retornar o padrão
    if (!status) {
      return AppointmentStatus.SCHEDULED;
    }
    
    // Converter para string e uppercase para comparação
    const statusStr = String(status).toUpperCase().trim();
    
    const statusMap: Record<string, AppointmentStatus> = {
      // Nomes dos enums (uppercase)
      'PENDENTE': AppointmentStatus.SCHEDULED,
      'AGENDADO': AppointmentStatus.SCHEDULED,
      'SCHEDULED': AppointmentStatus.SCHEDULED,
      'CONFIRMADO': AppointmentStatus.CONFIRMED,
      'CONFIRMED': AppointmentStatus.CONFIRMED,
      'EM_ANDAMENTO': AppointmentStatus.IN_PROGRESS,
      'EM ANDAMENTO': AppointmentStatus.IN_PROGRESS,
      'IN_PROGRESS': AppointmentStatus.IN_PROGRESS,
      'CONCLUIDO': AppointmentStatus.COMPLETED,
      'CONCLUÍDO': AppointmentStatus.COMPLETED,
      'COMPLETED': AppointmentStatus.COMPLETED,
      'CANCELADO': AppointmentStatus.CANCELED,
      'CANCELED': AppointmentStatus.CANCELED,
      'NAO_COMPARECEU': AppointmentStatus.NO_SHOW,
      'NÃO COMPARECEU': AppointmentStatus.NO_SHOW,
      'NO_SHOW': AppointmentStatus.NO_SHOW
    };
    
    return statusMap[statusStr] || AppointmentStatus.SCHEDULED;
  }

  private calculateTotalSpent(): void {
    this.totalSpent = this.completedAppointmentsData
      .filter(app => app.status === AppointmentStatus.COMPLETED)
      .reduce((total, appointment) => total + (appointment.totalPrice || 0), 0);
  }

  logout(): void {
    this.authService.logout();
    window.location.href = '/auth/login';
  }

  bookService(service: Service): void {
    // Navegar para agendamento com serviço pré-selecionado
    console.log('Agendar serviço:', service);
    // Implementar navegação para agendamento
  }

  viewAppointmentDetails(appointment: Appointment): void {
    console.log('Ver detalhes do agendamento:', appointment);
    // Implementar modal ou navegação para detalhes
  }



  rescheduleAppointment(appointment: Appointment): void {
    // TODO: Implementar modal de reagendamento
    console.log('Reagendar:', appointment);
  }

  getAppointmentStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'scheduled': 'Agendado',
      'confirmed': 'Confirmado',
      'in_progress': 'Em andamento',
      'completed': 'Concluído',
      'cancelled': 'Cancelado',
      'no_show': 'Faltou'
    };
    return statusMap[status] || status;
  }

  getAppointmentStatusClass(status: string): string {
    const classMap: { [key: string]: string } = {
      'scheduled': 'status-scheduled',
      'confirmed': 'status-confirmed',
      'in_progress': 'status-progress',
      'completed': 'status-completed',
      'cancelled': 'status-cancelled',
      'no_show': 'status-cancelled'
    };
    return classMap[status] || '';
  }

  formatAppointmentDate(appointment: Appointment): string {
    if (!appointment.scheduledDate) {
      // Fallback para dataHora se scheduledDate não estiver disponível
      const date = new Date(appointment.dataHora);
      return date.toLocaleDateString('pt-BR', { 
        day: '2-digit',
        month: 'short'
      }) + ' às ' + (appointment.startTime || '00:00');
    }
    
    return appointment.scheduledDate.toLocaleDateString('pt-BR', { 
      day: '2-digit',
      month: 'short'
    }) + ' às ' + (appointment.startTime || '00:00');
  }

  getStatusLabel(status: AppointmentStatus | string): string {
    const labels: Record<string, string> = {
      'SCHEDULED': 'Agendado',
      'CONFIRMED': 'Confirmado',
      'IN_PROGRESS': 'Em Andamento',
      'COMPLETED': 'Concluído',
      'CANCELED': 'Cancelado',
      'NO_SHOW': 'Não Compareceu',
      'AGENDADO': 'Agendado',
      'CONFIRMADO': 'Confirmado',
      'EM_ANDAMENTO': 'Em Andamento',
      'CONCLUIDO': 'Concluído',
      'CANCELADO': 'Cancelado'
    };
    return labels[status as string] || status;
  }

  getServiceIcon(serviceName: string): string {
    const name = serviceName?.toLowerCase() || '';
    const icons: Record<string, string> = {
      'corte': 'content_cut',
      'cabelo': 'content_cut',
      'barba': 'face_retouching_natural',
      'unha': 'pan_tool',
      'manicure': 'pan_tool',
      'pedicure': 'pan_tool',
      'estética': 'spa',
      'massagem': 'healing',
      'sobrancelha': 'visibility',
      'depilação': 'spa',
      'hidratação': 'water_drop'
    };
    
    // Busca por palavra-chave no nome
    for (const [key, icon] of Object.entries(icons)) {
      if (name.includes(key)) {
        return icon;
      }
    }
    
    return 'room_service';
  }

  editAppointment(appointment: Appointment): void {
    // Implementar reagendamento usando modal de booking
    alert('Funcionalidade de edição em desenvolvimento. Use o cancelamento e crie um novo agendamento.');
    console.log('Editar agendamento:', appointment);
  }

  cancelAppointment(appointment: Appointment): void {
    this.apppointmentToCancel = appointment;
    this.showCancelModal = true;
    // if (confirm('Deseja realmente cancelar este agendamento?')) {
    //   this.appointmentService.cancelAppointment(appointment.id, 'Cancelado pelo cliente').subscribe({
    //     next: (response) => {
    //       if (response.success) {
    //         console.log('Agendamento cancelado com sucesso');
    //         this.loadDashboardData();
    //       }
    //     },
    //     error: (error) => {
    //       console.error('Erro ao cancelar agendamento:', error);
    //       alert('Erro ao cancelar agendamento. Tente novamente.');
    //     }
    //   });
    // }
  }

  quickBookService(service: Service): void {
    this.selectedServiceForBooking = service;
    this.showBookingModal = true;
  }

  selectService(service: Service): void {
    this.selectedServiceForBooking = service;
    this.showBookingModal = true;
  }

  closeBookingModal(): void {
    this.showBookingModal = false;
    this.selectedServiceForBooking = undefined;
  }

  confirmCancelAppointment(): void {
    if(this.apppointmentToCancel) {
      this.appointmentService.cancelAppointment(this.apppointmentToCancel.id, 'Cancelado pelo cliente').subscribe({
        next: (response) => {
          if(response.success) {
            console.log('Agendamento cancelado com sucesso');
            this.loadDashboardData();
            this.closeBookingModal();
          }
        },
        error: (error) => {
          console.error('Erro ao cancelar agendamento: ', error);
          alert('Erro ao cancelar agendamento. Tente novamente.');
          this.closeCancelModal();
        }
      });
    }
  }

  closeCancelModal(): void {
    this.showCancelModal = false;
    this.apppointmentToCancel = undefined;
  }

  onBookingCompleted(): void {
    this.showBookingModal = false;
    this.selectedServiceForBooking = undefined;
    // Recarregar dados do dashboard
    this.loadDashboardData();
  }

  onBookingCanceled(): void {
    this.showBookingModal = false;
    this.selectedServiceForBooking = undefined;
  }

  rateAppointment(appointment: Appointment): void {
    // TODO: Implementar modal de avaliação
    console.log('Avaliar agendamento:', appointment);
  }

  leaveFeedback(appointment: Appointment): void {
    // TODO: Implementar modal de feedback
    console.log('Deixar feedback para:', appointment);
  }

  formatPrice(price: number): string {
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
  }
}