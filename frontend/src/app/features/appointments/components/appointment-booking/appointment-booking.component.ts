import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE, MAT_DATE_FORMATS, DateAdapter } from '@angular/material/core';
import { AppointmentService } from '../../../../core/services/appointment.service';
import { ServiceService } from '../../../../core/services/service.service';
import { UserService } from '../../../../core/services/user.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Service, CreateAppointmentRequest, User } from '../../../../models';

// Formato de data brasileiro
export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

interface BookingStep {
  number: number;
  title: string;
  completed: boolean;
}

@Component({
  selector: 'app-appointment-booking',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ],
  templateUrl: './appointment-booking.component.html',
  styleUrls: ['./appointment-booking.component.css']
})
export class AppointmentBookingComponent implements OnInit {
  @Input() preSelectedService?: Service;
  @Output() bookingCompleted = new EventEmitter<void>();
  @Output() bookingCanceled = new EventEmitter<void>();

  currentStep = 1;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  // Dados
  availableServices: Service[] = [];
  availableProfessionals: User[] = [];
  availableTimeSlots: string[] = [];
  selectedServices: Service[] = [];
  
  // Formulário
  bookingForm: FormGroup;
  
  // Etapas do agendamento
  steps: BookingStep[] = [
    { number: 1, title: 'Serviços', completed: false },
    { number: 2, title: 'Data e Hora', completed: false },
    { number: 3, title: 'Confirmação', completed: false }
  ];

  // Horários disponíveis de exemplo (8h às 18h)
  timeSlots: string[] = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00'
  ];

  minDate: Date = new Date();
  maxDate: Date = new Date(new Date().setMonth(new Date().getMonth() + 3));
  currentUser: User | null = null;

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private serviceService: ServiceService,
    private userService: UserService,
    private authService: AuthService
  ) {
    const today = new Date();
    this.minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    this.bookingForm = this.fb.group({
      serviceIds: [[], [Validators.required, Validators.minLength(1)]],
      // professionalId: ['', Validators.required],
      scheduledDate: ['', Validators.required],
      startTime: ['', Validators.required],
      notes: ['', Validators.maxLength(500)]
    });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadServices();
    
    // Inicializar horários disponíveis
    this.availableTimeSlots = [...this.timeSlots];
    
    // Debug: verificar datas
    console.log('Min Date:', this.minDate);
    console.log('Max Date:', this.maxDate);
    console.log('Form Initial Value:', this.bookingForm.value);
    
    if (this.preSelectedService) {
      this.selectService(this.preSelectedService);
      this.nextStep();
    }
  }

  private loadServices(): void {
    this.isLoading = true;
    this.serviceService.getServices().subscribe({
      next: (response: any) => {
        if (response.success) {
          // Filtrar apenas serviços disponíveis
          this.availableServices = response.data.filter((service: any) => service.disponivel !== false);
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Erro ao carregar serviços:', error);
        this.errorMessage = 'Erro ao carregar serviços disponíveis';
        this.isLoading = false;
      }
    });
  }

  private loadAvailableTimeSlots(): void {
    const selectedDate = this.bookingForm.get('scheduledDate')?.value;

    if (!selectedDate) {
      this.availableTimeSlots = this.timeSlots;
      return;
    }

    // Por enquanto, usar horários fixos
    // TODO: Implementar busca de horários disponíveis no backend
    // this.availableTimeSlots = this.timeSlots;
    const today = new Date();
    const isToday = selectedDate.toDateString() === today.getMinutes();
    if(isToday) {
      const currentTime = today.getHours() * 60 + today.getMinutes();
      this.availableTimeSlots = this.timeSlots.filter(time => {
        const [hours, minutes] = time.split(':').map(Number);
        const slotTime = hours * 60 + minutes;
        return slotTime > currentTime;
      });
    }
  }

  selectService(service: Service): void {
    // const index = this.selectedServices.findIndex(s => s.id === service.id);
    
    // if (index > -1) {
    //   // Remover se já estava selecionado
    //   this.selectedServices.splice(index, 1);
    // } else {
    //   // Adicionar se não estava selecionado
    //   this.selectedServices.push(service);
    // }

    // Permitir apenas 1 serviço por agendamento
  this.selectedServices = [service];

    // Atualizar formulário
    const serviceIds = this.selectedServices.map(s => s.id);
    this.bookingForm.patchValue({ serviceIds });
  }

  isServiceSelected(service: Service): boolean {
    return this.selectedServices.some(s => s.id === service.id);
  }

  selectProfessional(professional: User): void {
    this.bookingForm.patchValue({ professionalId: professional.id });
  }

  isProfessionalSelected(professional: User): boolean {
    return this.bookingForm.get('professionalId')?.value === professional.id;
  }

  selectTimeSlot(time: string): void {
    this.bookingForm.patchValue({ startTime: time });
  }

  isTimeSlotSelected(time: string): boolean {
    return this.bookingForm.get('startTime')?.value === time;
  }

  onDateChange(): void {
    this.loadAvailableTimeSlots();
  }

  nextStep(): void {
    if (this.currentStep === 1 && this.selectedServices.length === 0) {
      this.errorMessage = 'Selecione um serviço';
      return;
    }

    // if (this.currentStep === 2 && !this.bookingForm.get('professionalId')?.value) {
    //   this.errorMessage = 'Selecione um profissional';
    //   return;
    // }

    if (this.currentStep === 2) {
      if (!this.bookingForm.get('scheduledDate')?.value) {
        this.errorMessage = 'Selecione uma data';
        return;
      }
      if (!this.bookingForm.get('startTime')?.value) {
        this.errorMessage = 'Selecione um horário';
        return;
      }
    }

    this.errorMessage = '';
    this.steps[this.currentStep - 1].completed = true;
    this.currentStep++;

    // Carregar dados para próxima etapa
    if (this.currentStep === 2) {
    //   this.loadProfessionals();
    // } else if (this.currentStep === 3) {
      this.loadAvailableTimeSlots();
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.errorMessage = '';
    }
  }

  goToStep(step: number): void {
    if (step < this.currentStep) {
      this.currentStep = step;
      this.errorMessage = '';
    }
  }

  getTotalDuration(): number {
    return this.selectedServices.reduce((total, service) => total + (service.duracaoMinutos || 0), 0);
  }

  getTotalPrice(): number {
    return this.selectedServices.reduce((total, service) => total + (service.preco || 0), 0);
  }

  getEndTime(): string {
    const startTime = this.bookingForm.get('startTime')?.value;
    if (!startTime) return '';

    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + this.getTotalDuration();
    const endHours = Math.floor(totalMinutes / 60);
    const endMinutes = totalMinutes % 60;

    return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  confirmBooking(): void {
    if (!this.bookingForm.valid || !this.currentUser) {
      this.errorMessage = 'Preencha todos os campos obrigatórios';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const formValue = this.bookingForm.value;
    const scheduledDate = new Date(formValue.scheduledDate);
    const dateString = scheduledDate.toISOString().split('T')[0];

    let professionalId = '';
    if(this.selectedServices.length > 0 && this.selectedServices[0].profissionalId) {
      professionalId = this.selectedServices[0].profissionalId;
    } else {
      this.errorMessage = 'Não foi possível identificar o profissional do serviço.';
      this.isLoading = false;
      return;
    }

    const appointmentRequest: CreateAppointmentRequest = {
      clientId: this.currentUser.id,
      professionalId: professionalId,
      serviceIds: formValue.serviceIds,
      scheduledDate: dateString,
      startTime: formValue.startTime,
      notes: formValue.notes || undefined
    };

    this.appointmentService.createAppointment(appointmentRequest).subscribe({
      next: (response) => {
        if (response.success) {
          this.successMessage = 'Agendamento realizado com sucesso!';
          this.isLoading = false;
          
          setTimeout(() => {
            this.bookingCompleted.emit();
          }, 2000);
        }
      },
      error: (error) => {
        console.error('Erro ao criar agendamento:', error);
        this.errorMessage = error.error?.message || 'Erro ao realizar agendamento. Tente novamente.';
        this.isLoading = false;
      }
    });
  }

  cancel(): void {
    if (confirm('Deseja realmente cancelar este agendamento?')) {
      this.bookingCanceled.emit();
    }
  }
  
  closeWithoutConfirm(): void {
    this.bookingCanceled.emit();
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

  getSelectedProfessionalName(): string {
    // const professionalId = this.bookingForm.get('professionalId')?.value;
    // const professional = this.availableProfessionals.find(p => p.id === professionalId);
    // return professional?.nome || '';
    if(this.selectedServices.length > 0 && this.selectedServices[0].profissionalNome) {
      return this.selectedServices[0].profissionalNome;
    }
    return '';
  }

  getScheduledDate(): Date | null {
    return this.bookingForm.get('scheduledDate')?.value;
  }

  getStartTime(): string {
    return this.bookingForm.get('startTime')?.value || '';
  }

  getNotes(): string {
    return this.bookingForm.get('notes')?.value || '';
  }

  hasNotes(): boolean {
    const notes = this.bookingForm.get('notes')?.value;
    return !!notes && notes.trim().length > 0;
  }
}
