import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServiceService } from '../../../../core/services/service.service';
import { AuthService } from '../../../../core/services/auth.service';

interface ServiceFormData {
  nome: string;
  descricao: string;
  preco: number;
  duracaoMinutos: number;
  horariosDisponiveis?: string[];
}

@Component({
  selector: 'app-add-service-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-service-modal.component.html',
  styleUrls: ['./add-service-modal.component.css']
})
export class AddServiceModalComponent {
  @Output() serviceAdded = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  serviceData: ServiceFormData = {
    nome: '',
    descricao: '',
    preco: 0,
    duracaoMinutos: 30,
    horariosDisponiveis: []
  };

  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private serviceService: ServiceService,
    private authService: AuthService
  ) {}

  onSubmit(): void {
    if (!this.isFormValid()) {
      this.errorMessage = 'Por favor, preencha todos os campos obrigatórios';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const currentUser = this.authService.getCurrentUser();
    
    if (!currentUser?.id) {
      this.errorMessage = 'Erro: Usuário não autenticado';
      this.isSubmitting = false;
      return;
    }

    const servicePayload = {
      ...this.serviceData,
      profissionalId: currentUser.id
    };

    this.serviceService.createService(servicePayload).subscribe({
      next: (response) => {
        this.successMessage = 'Serviço criado com sucesso!';
        setTimeout(() => {
          this.serviceAdded.emit();
        }, 1000);
      },
      error: (error) => {
        console.error('Erro ao criar serviço:', error);
        this.errorMessage = error.error?.message || 'Erro ao criar serviço. Tente novamente.';
        this.isSubmitting = false;
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }

  onCancel(): void {
    this.cancelled.emit();
  }

  isFormValid(): boolean {
    return !!(
      this.serviceData.nome?.trim() &&
      this.serviceData.descricao?.trim() &&
      this.serviceData.preco > 0 &&
      this.serviceData.duracaoMinutos > 0
    );
  }

  preventClose(event: MouseEvent): void {
    event.stopPropagation();
  }
}
