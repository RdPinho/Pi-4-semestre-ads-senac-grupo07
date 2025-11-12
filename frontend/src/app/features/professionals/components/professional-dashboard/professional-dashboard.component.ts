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
import { User, Appointment, Service, AppointmentStatus, ServiceCategory } from '../../../../models';
import { AddServiceModalComponent } from '../add-service-modal/add-service-modal.component';

@Component({
  selector: 'app-professional-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    AddServiceModalComponent
  ],
  templateUrl: './professional-dashboard.component.html',
  styleUrls: ['./professional-dashboard.component.css']
})
export class ProfessionalDashboardComponent implements OnInit {
  currentUser: User | null = null;
  today = new Date();
  
  // Expor enum para o template
  readonly AppointmentStatus = AppointmentStatus;

  // Estatísticas do profissional
  professionalStats = {
    todayAppointments: 5,
    weekAppointments: 23,
    monthRevenue: 2850,
    completionRate: 95,
    averageRating: 4.8,
    totalClients: 156
  };

  // Propriedades do componente
  totalRevenue = 0;
  showAllSchedule = false;
  showSummary = true;
  showServiceModal = false;
  showAddServiceModal = false; // Modal para adicionar novo serviço
  selectedTimeSlot: string | null = null;

  // Agendamentos de hoje - será carregado do backend
  todayAppointments: Appointment[] = [];

  // Próximos agendamentos (próximos dias) - será carregado do backend
  upcomingAppointments: Appointment[] = [];

  // Serviços oferecidos pelo profissional - será carregado do backend
  myServices: Service[] = [];

  // Serviços ordenados por uso
  get myServicesSorted(): Service[] {
    return [...this.myServices].sort((a, b) => {
      const countA = a.usageCount || 0;
      const countB = b.usageCount || 0;
      return countB - countA; // Mais usado primeiro
    });
  }

  // Agendamentos completados - será carregado do backend
  private completedAppointmentsData: Appointment[] = [];

  // Horários disponíveis para hoje
  availableTimeSlots: string[] = [
    '11:30', '12:00', '13:00', '15:30', '16:00', '17:00', '18:00'
  ];

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

    // Carregar agendamentos de hoje
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    // Buscar agendamentos ativos (incluir versões em português e inglês dos status)
    this.appointmentService.getAppointments({
      professionalId: this.currentUser.id,
      status: 'SCHEDULED,CONFIRMED,PENDENTE,IN_PROGRESS,AGENDADO,CONFIRMADO,EM_ANDAMENTO'
    }).subscribe({
      next: (response) => {
        if (response.success) {
          const allAppointments = response.data
            .map(apt => this.transformAppointment(apt))
            .sort((a, b) => {
              const dateA = a.scheduledDate?.getTime() || 0;
              const dateB = b.scheduledDate?.getTime() || 0;
              return dateA - dateB; // Ordenar do mais próximo para o mais distante
            });
          
          // Filtrar agendamentos de hoje
          const todayDate = new Date();
          todayDate.setHours(0, 0, 0, 0);
          
          this.todayAppointments = allAppointments.filter(apt => {
            const aptDate = apt.scheduledDate || new Date();
            aptDate.setHours(0, 0, 0, 0);
            return aptDate.getTime() === todayDate.getTime();
          });

          // Agendamentos futuros (não hoje)
          this.upcomingAppointments = allAppointments.filter(apt => {
            const aptDate = apt.scheduledDate || new Date();
            aptDate.setHours(0, 0, 0, 0);
            return aptDate.getTime() > todayDate.getTime();
          });

          // Calcular agendamentos da semana (hoje + próximos 7 dias)
          const nextWeekDate = new Date(todayDate);
          nextWeekDate.setDate(nextWeekDate.getDate() + 7);
          
          const weekAppointments = allAppointments.filter(apt => {
            const aptDate = apt.scheduledDate || new Date();
            aptDate.setHours(0, 0, 0, 0);
            return aptDate.getTime() >= todayDate.getTime() && aptDate.getTime() <= nextWeekDate.getTime();
          });

          this.professionalStats.todayAppointments = this.todayAppointments.length;
          this.professionalStats.weekAppointments = weekAppointments.length;
        }
      },
      error: (error) => console.error('Erro ao carregar agendamentos:', error)
    });

    // Carregar agendamentos completados
    this.appointmentService.getAppointments({
      professionalId: this.currentUser.id,
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
          this.calculateTotalRevenue();
        }
      },
      error: (error) => console.error('Erro ao carregar histórico:', error)
    });

    // Carregar serviços do profissional
    this.loadMyServices();
  }

  // Carregar serviços do profissional
  private loadMyServices(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || !currentUser.id) {
      console.error('Usuário não autenticado');
      return;
    }

    this.serviceService.getServicesByProfessional(currentUser.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.myServices = response.data;
          this.calculateServiceUsage();
        }
      },
      error: (error) => console.error('Erro ao carregar serviços:', error)
    });
  }

  // Calcular uso dos serviços baseado nos agendamentos
  private calculateServiceUsage(): void {
    const serviceUsage = new Map<string, number>();
    
    // Contar quantas vezes cada serviço foi usado
    const allAppointments = [...this.todayAppointments, ...this.upcomingAppointments, ...this.completedAppointmentsData];
    allAppointments.forEach(appointment => {
      appointment.services?.forEach(service => {
        const key = service.serviceId || service.serviceName;
        serviceUsage.set(key, (serviceUsage.get(key) || 0) + 1);
      });
    });
    
    // Adicionar contagem aos serviços
    this.myServices = this.myServices.map(service => ({
      ...service,
      usageCount: serviceUsage.get(service.id) || 0
    }));
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
    
    // Informações do cliente (se disponível)
    let clientName = undefined;
    if (apt.cliente && apt.cliente.nome) {
      clientName = apt.cliente.nome;
    }
    
    const normalizedStatus = this.normalizeStatus(apt.status);
    
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
      status: normalizedStatus,
      totalPrice: apt.servico?.preco || apt.totalPrice || 0,
      totalDuration: duration,
      notes: apt.notes,
      clientName: clientName,
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

  private calculateTotalRevenue(): void {
    const completed = this.completedAppointments;
    this.totalRevenue = completed.reduce((total, appointment) => 
      total + (appointment.totalPrice || 0), 0
    );
  }

  formatAppointmentDate(appointment: Appointment): string {
    const date = appointment.scheduledDate || (appointment.dataHora ? new Date(appointment.dataHora) : new Date());
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit',
      month: 'short'
    }) + ' às ' + (appointment.startTime || '00:00');
  }

  formatAppointmentTime(appointment: Appointment): string {
    return appointment.startTime + ' - ' + appointment.endTime;
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

  getClientName(clientId: string | undefined): string {
    if (!clientId) return 'Cliente';
    
    // Mock de nomes de clientes
    const clients: Record<string, string> = {
      'client1': 'João Silva',
      'client2': 'Pedro Santos',
      'client3': 'Carlos Oliveira',
      'client4': 'André Costa',
      'client5': 'Rafael Lima',
      'client6': 'Lucas Pereira',
      'client7': 'Bruno Alves'
    };
    return clients[clientId] || 'Cliente';
  }

  // Ações de agendamento
  startAppointment(appointment: Appointment): void {
    this.appointmentService.startAppointment(appointment.id).subscribe({
      next: (response) => {
        if (response.success) {
          console.log('Atendimento iniciado');
          this.loadDashboardData();
        }
      },
      error: (error) => {
        console.error('Erro ao iniciar atendimento:', error);
        alert('Erro ao iniciar atendimento. Tente novamente.');
      }
    });
  }

  completeAppointment(appointment: Appointment): void {
    this.appointmentService.completeAppointment(appointment.id).subscribe({
      next: (response) => {
        if (response.success) {
          console.log('Atendimento finalizado');
          this.loadDashboardData();
        }
      },
      error: (error) => {
        console.error('Erro ao finalizar atendimento:', error);
        alert('Erro ao finalizar atendimento. Tente novamente.');
      }
    });
  }

  confirmAppointment(appointment: Appointment): void {
    console.log('🟢 CONFIRMAR CLICKED - ID:', appointment.id);
    this.appointmentService.confirmAppointment(appointment.id).subscribe({
      next: (response) => {
        if (response.success) {
          console.log('Agendamento confirmado com sucesso');
          this.loadDashboardData();
        }
      },
      error: (error) => {
        console.error('Erro ao confirmar agendamento:', error);
        alert('Erro ao confirmar agendamento. Tente novamente.');
      }
    });
  }

  rescheduleAppointment(appointment: Appointment): void {
    // TODO: Implementar modal de reagendamento
    console.log('Reagendar:', appointment);
  }

  cancelAppointment(appointment: Appointment): void {
    console.log('🔴 RECUSAR/CANCELAR CLICKED - ID:', appointment.id);
    if (confirm('Tem certeza que deseja cancelar este agendamento?')) {
      this.appointmentService.cancelAppointment(appointment.id, 'Cancelado pelo profissional').subscribe({
        next: (response) => {
          if (response.success) {
            console.log('Agendamento cancelado com sucesso');
            this.loadDashboardData();
          }
        },
        error: (error) => {
          console.error('Erro ao cancelar agendamento:', error);
          alert('Erro ao cancelar agendamento. Tente novamente.');
        }
      });
    }
  }

  // Gerenciamento de serviços
  toggleServiceStatus(service: Service): void {
    if (!service.id) {
      console.error('Serviço sem ID');
      return;
    }

    this.serviceService.toggleServiceAvailability(service.id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          // Atualizar o serviço local com os dados do backend
          service.disponivel = response.data.disponivel;
          console.log('Status alterado com sucesso:', service.nome, '- Disponível:', service.disponivel);
        }
      },
      error: (error) => {
        console.error('Erro ao alterar status do serviço:', error);
        alert('Erro ao alterar disponibilidade do serviço. Tente novamente.');
      }
    });
  }

  editService(service: Service): void {
    // TODO: Implementar modal de edição de serviço
    console.log('Editar serviço:', service);
    alert('Funcionalidade de edição será implementada em breve.');
  }

  // Horários disponíveis
  blockTimeSlot(timeSlot: string): void {
    console.log('Bloquear horário:', timeSlot);
    // TODO: Implementar bloqueio de horário
  }

  openTimeSlot(timeSlot: string): void {
    console.log('Liberar horário:', timeSlot);
    // TODO: Implementar liberação de horário
  }

  // Modais
  openServiceModal(): void {
    this.showServiceModal = true;
  }

  closeServiceModal(): void {
    this.showServiceModal = false;
  }

  openAddServiceModal(): void {
    this.showAddServiceModal = true;
  }

  closeAddServiceModal(): void {
    this.showAddServiceModal = false;
  }

  onServiceAdded(): void {
    this.closeAddServiceModal();
    this.loadMyServices(); // Recarregar lista de serviços
  }

  // Navegação
  logout(): void {
    this.authService.logout();
  }
}