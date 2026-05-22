export interface Professor {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  cpf?: string;
  ativo: boolean;
}

export interface CadastraProfessorRequest {
  nome: string;
  email: string;
  senha: string;
  telefone?: string;
  cpf?: string;
}

export interface AtualizarProfessorRequest {
  id: number;
  nome?: string;
  email?: string;
  telefone?: string;
  senha?: string;
}
