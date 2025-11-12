import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Service, ServiceCategory, ApiResponse } from '../../models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private readonly baseUrl = `${environment.apiUrl}/servicos`;
  private readonly categoryUrl = `${environment.apiUrl}/service-categories`;

  constructor(private http: HttpClient) {}

  // === SERVIÇOS ===

  // Listar serviços
  getServices(params?: {
    categoryId?: string;
    professionalId?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
  }): Observable<ApiResponse<Service[]>> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.keys(params).forEach(key => {
        const value = params[key as keyof typeof params];
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }

    return this.http.get<ApiResponse<Service[]>>(this.baseUrl, { params: httpParams });
  }

  // Obter serviço por ID
  getServiceById(id: string): Observable<ApiResponse<Service>> {
    return this.http.get<ApiResponse<Service>>(`${this.baseUrl}/${id}`);
  }

  // Criar novo serviço
  createService(service: Partial<Service>): Observable<ApiResponse<Service>> {
    return this.http.post<ApiResponse<Service>>(this.baseUrl, service);
  }

  // Atualizar serviço
  updateService(id: string, updates: Partial<Service>): Observable<ApiResponse<Service>> {
    return this.http.patch<ApiResponse<Service>>(`${this.baseUrl}/${id}`, updates);
  }

  // Alternar disponibilidade do serviço
  toggleServiceAvailability(id: string): Observable<ApiResponse<Service>> {
    return this.http.patch<ApiResponse<Service>>(`${this.baseUrl}/${id}/disponibilidade`, {});
  }

  // Deletar serviço
  deleteService(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
  }

  // Obter serviços por profissional
  getServicesByProfessional(professionalId: string): Observable<ApiResponse<Service[]>> {
    return this.http.get<ApiResponse<Service[]>>(`${this.baseUrl}/profissional/${professionalId}`);
  }

  // Obter serviços populares
  getPopularServices(): Observable<ApiResponse<Service[]>> {
    return this.http.get<ApiResponse<Service[]>>(`${this.baseUrl}/popular`);
  }

  // === CATEGORIAS DE SERVIÇOS ===

  // Listar categorias
  getCategories(): Observable<ApiResponse<ServiceCategory[]>> {
    return this.http.get<ApiResponse<ServiceCategory[]>>(this.categoryUrl);
  }

  // Obter categoria por ID
  getCategoryById(id: string): Observable<ApiResponse<ServiceCategory>> {
    return this.http.get<ApiResponse<ServiceCategory>>(`${this.categoryUrl}/${id}`);
  }

  // Criar nova categoria
  createCategory(category: Partial<ServiceCategory>): Observable<ApiResponse<ServiceCategory>> {
    return this.http.post<ApiResponse<ServiceCategory>>(this.categoryUrl, category);
  }

  // Atualizar categoria
  updateCategory(id: string, updates: Partial<ServiceCategory>): Observable<ApiResponse<ServiceCategory>> {
    return this.http.patch<ApiResponse<ServiceCategory>>(`${this.categoryUrl}/${id}`, updates);
  }

  // Desativar/ativar categoria
  toggleCategoryStatus(id: string): Observable<ApiResponse<ServiceCategory>> {
    return this.http.patch<ApiResponse<ServiceCategory>>(`${this.categoryUrl}/${id}/toggle-status`, {});
  }

  // Deletar categoria
  deleteCategory(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.categoryUrl}/${id}`);
  }
}