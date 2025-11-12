import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { 
  User, 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest, 
  ApiResponse,
  RefreshTokenRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest
} from '../../models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = environment.tokenKey;
  private readonly USER_KEY = 'barber7_user';
  private readonly REFRESH_TOKEN_KEY = environment.refreshTokenKey;
  
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private jwtHelper = new JwtHelperService();
  
  constructor(private http: HttpClient) {
    this.loadStoredUser();
    this.setupAutoLogout();
  }
  
  login(credentials: LoginRequest): Observable<ApiResponse<LoginResponse>> {
    return this.http.post<ApiResponse<LoginResponse>>(`${environment.apiUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this.setSession(response.data);
          }
        })
      );
  }
  
  register(userData: RegisterRequest): Observable<ApiResponse<LoginResponse>> {
    return this.http.post<ApiResponse<LoginResponse>>(`${environment.apiUrl}/auth/register`, userData)
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this.setSession(response.data);
          }
        })
      );
  }

  refreshToken(): Observable<ApiResponse<LoginResponse>> {
    const refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);
    const request: RefreshTokenRequest = { refreshToken: refreshToken || '' };
    
    return this.http.post<ApiResponse<LoginResponse>>(`${environment.apiUrl}/auth/refresh`, request)
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this.setSession(response.data);
          }
        })
      );
  }

  forgotPassword(email: string): Observable<ApiResponse<any>> {
    const request: ForgotPasswordRequest = { email };
    return this.http.post<ApiResponse<any>>(`${environment.apiUrl}/auth/forgot-password`, request);
  }

  resetPassword(token: string, newPassword: string): Observable<ApiResponse<any>> {
    const request: ResetPasswordRequest = { token, newPassword };
    return this.http.post<ApiResponse<any>>(`${environment.apiUrl}/auth/reset-password`, request);
  }
  
  logout(): void {
    const refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);
    if (refreshToken) {
      const request: RefreshTokenRequest = { refreshToken };
      this.http.post(`${environment.apiUrl}/auth/logout`, request).subscribe();
    }
    
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    this.currentUserSubject.next(null);
  }
  
  isAuthenticated(): boolean {
    const token = this.getToken();
    return token != null && !this.jwtHelper.isTokenExpired(token);
  }
  
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
  
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
  
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user ? (user.role === role || user.tipo === role) : false;
  }
  
  private setSession(authResult: LoginResponse): void {
    localStorage.setItem(this.TOKEN_KEY, authResult.token);
    
    // Suporta tanto 'usuario' (backend) quanto 'user' (compatibilidade)
    const user = authResult.usuario || authResult.user || null;
    if (user) {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      this.currentUserSubject.next(user);
    }
    
    // Se houver refresh token, salvar também
    if (authResult.refreshToken) {
      localStorage.setItem(this.REFRESH_TOKEN_KEY, authResult.refreshToken);
    }
  }
  
  private loadStoredUser(): void {
    const token = this.getToken();
    const userJson = localStorage.getItem(this.USER_KEY);
    
    if (token && userJson && !this.jwtHelper.isTokenExpired(token)) {
      const user: User = JSON.parse(userJson);
      this.currentUserSubject.next(user);
    }
  }

  private setupAutoLogout(): void {
    sessionStorage.setItem('page_loaded', 'true');
    const isPageClosing = !sessionStorage.getItem('page_loaded');
    if(isPageClosing) {
      window.addEventListener('beforeunload', () => {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
        localStorage.removeItem(this.REFRESH_TOKEN_KEY);
        this.currentUserSubject.next(null);
      });
    }
  }
}