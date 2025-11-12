export interface Service {
  id: string;
  nome: string; // Backend usa português
  descricao: string; // Backend usa português
  preco: number; // Backend usa português
  duracaoMinutos: number; // Backend usa português
  horariosDisponiveis?: string[]; // Backend usa português
  profissionalId?: string; // ID do profissional que oferece o serviço
  profissionalNome?: string; // Nome do profissional que oferece o serviço
  disponivel?: boolean; // Disponibilidade do serviço para agendamento
  usageCount?: number; // Contador de uso (calculado no frontend)
  // Aliases para compatibilidade
  name?: string;
  description?: string;
  basePrice?: number;
  baseDuration?: number;
}

export interface ServiceCategory {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
}

export enum ServiceCategoryEnum {
  HAIR_CUT = 'HAIR_CUT',
  BEARD = 'BEARD',
  HAIR_WASH = 'HAIR_WASH',
  HAIR_TREATMENT = 'HAIR_TREATMENT',
  STYLING = 'STYLING',
  COLORING = 'COLORING',
  OTHER = 'OTHER'
}