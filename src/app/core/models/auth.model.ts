export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  idUsuario: number;
  nome: string;
  email: string;
  idEscola: number;
}

export type UserRole = 'DONO' | 'PROFESSOR' | 'ALUNO';
