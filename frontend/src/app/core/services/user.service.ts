import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, ApiResponse } from '../../models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly baseUrl = `${environment.apiUrl}/usuarios`; // Mudado de /users para /usuarios

  constructor(private http: HttpClient) {}

  // Obter perfil do usuário atual
  getProfile(): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.baseUrl}/profile`);
  }

  // Atualizar perfil do usuário
  updateProfile(updates: Partial<User>): Observable<ApiResponse<User>> {
    return this.http.patch<ApiResponse<User>>(`${this.baseUrl}/profile`, updates);
  }

  // Alterar senha
  changePassword(currentPassword: string, newPassword: string): Observable<ApiResponse<void>> {
    return this.http.patch<ApiResponse<void>>(`${this.baseUrl}/change-password`, {
      currentPassword,
      newPassword
    });
  }

  // Listar usuários (apenas admin)
  getUsers(params?: {
    tipo?: string; // Mudado de 'role' para 'tipo'
    isActive?: boolean;
    page?: number;
    limit?: number;
    search?: string;
  }): Observable<ApiResponse<User[]>> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.keys(params).forEach(key => {
        const value = params[key as keyof typeof params];
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }

    return this.http.get<ApiResponse<User[]>>(this.baseUrl, { params: httpParams });
  }

  // Obter usuário por ID
  getUserById(id: string): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.baseUrl}/${id}`);
  }

  // Listar profissionais
  getProfessionals(): Observable<ApiResponse<User[]>> {
    return this.getUsers({ tipo: 'PROFISSIONAL' }); // Mudado para usar 'tipo' com valor 'PROFISSIONAL'
  }

  // Listar profissionais que oferecem determinados serviços
  getProfessionalsByServices(serviceIds: string[]): Observable<ApiResponse<User[]>> {
    let httpParams = new HttpParams();
    serviceIds.forEach(id => {
      httpParams = httpParams.append('serviceIds', id);
    });
    return this.http.get<ApiResponse<User[]>>(`${this.baseUrl}/profissionais/por-servicos`, { params: httpParams });
  }

  // Listar clientes
  getClients(): Observable<ApiResponse<User[]>> {
    return this.getUsers({ tipo: 'CLIENTE' }); // Mudado para usar 'tipo' com valor 'CLIENTE'
  }

  // Desativar/ativar usuário (apenas admin)
  toggleUserStatus(id: string): Observable<ApiResponse<User>> {
    return this.http.patch<ApiResponse<User>>(`${this.baseUrl}/${id}/toggle-status`, {});
  }

  // Deletar usuário (apenas admin)
  deleteUser(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
  }

  // Atualizar papel do usuário (apenas admin)
  updateUserRole(id: string, role: string): Observable<ApiResponse<User>> {
    return this.http.patch<ApiResponse<User>>(`${this.baseUrl}/${id}/role`, { role });
  }

  // Upload de avatar
  uploadAvatar(file: File): Observable<ApiResponse<{ avatarUrl: string }>> {
    const formData = new FormData();
    formData.append('avatar', file);
    return this.http.post<ApiResponse<{ avatarUrl: string }>>(`${this.baseUrl}/avatar`, formData);
  }

  // Obter estatísticas do usuário
  getUserStats(userId?: string): Observable<ApiResponse<any>> {
    const url = userId ? `${this.baseUrl}/${userId}/stats` : `${this.baseUrl}/profile/stats`;
    return this.http.get<ApiResponse<any>>(url);
  }
}