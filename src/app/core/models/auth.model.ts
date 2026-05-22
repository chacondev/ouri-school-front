export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  tipo: string;
  role: 'DONO' | 'PROFESSOR' | 'ALUNO';
  nome: string;
  email: string;
}

export type UserRole = 'DONO' | 'PROFESSOR' | 'ALUNO';
