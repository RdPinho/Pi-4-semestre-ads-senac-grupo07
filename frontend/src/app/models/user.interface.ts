export interface User {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  role: 'CLIENTE' | 'PROFISSIONAL';
  tipo: 'CLIENTE' | 'PROFISSIONAL'; // Alias para compatibilidade
  createdAt?: Date;
  updatedAt?: Date;
  
  // Campos específicos de Cliente
  preferenciasPagamento?: string[];
  pontosFidelidade?: number;
  
  // Campos específicos de Profissional
  especialidade?: string[];
  ativo?: boolean;
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  refreshToken?: string;
  usuario: User;
  user?: User; // Alias para compatibilidade
}

export interface RegisterRequest {
  nome: string;
  email: string;
  telefone: string;
  senha: string;
  role: 'CLIENTE' | 'PROFISSIONAL';
  
  // Campos opcionais para Cliente
  preferenciasPagamento?: string[];
  pontosFidelidade?: number;
  
  // Campos opcionais para Profissional
  especialidade?: string[];
  ativo?: boolean;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}