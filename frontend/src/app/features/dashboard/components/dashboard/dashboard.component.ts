import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { User } from '../../../../models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    RouterModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  today = new Date();
  
  // Mock data para demonstração
  stats = {
    todayAppointments: 8,
    totalClients: 156,
    totalProfessionals: 4,
    monthlyRevenue: 12500
  };
  
  recentAppointments = [
    {
      id: '1',
      clientName: 'João Silva',
      professionalName: 'Carlos Barbeiro',
      service: 'Corte + Barba',
      time: '14:00',
      status: 'Agendado'
    },
    {
      id: '2',
      clientName: 'Pedro Santos',
      professionalName: 'Ana Silva',
      service: 'Corte Infantil',
      time: '15:30',
      status: 'Em Andamento'
    },
    {
      id: '3',
      clientName: 'Maria Costa',
      professionalName: 'Carlos Barbeiro',
      service: 'Corte Feminino',
      time: '16:00',
      status: 'Agendado'
    }
  ];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
  }

  logout(): void {
    this.authService.logout();
  }
}