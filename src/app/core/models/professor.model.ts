export interface Professor {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  telefone?: string;
  dataNascimento?: string;
  sexo?: string;
  ativo: boolean;
}

export interface CadastraProfessorRequest {
  nome: string;
  cpf: string;
  email: string;
  senha: string;
  telefone?: string;
  dataNascimento?: string;
  sexo?: string;
  ativo: boolean;
}

export interface AtualizarProfessorRequest {
  id: number;
  nome?: string;
  cpf?: string;
  email?: string;
  telefone?: string;
  senha?: string;
  dataNascimento?: string;
  sexo?: string;
  ativo?: boolean;
}
