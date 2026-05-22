export interface Aluno {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  cpf?: string;
  dataNascimento?: string;
  ativo: boolean;
}

export interface CadastraAlunoRequest {
  nome: string;
  email: string;
  senha: string;
  telefone?: string;
  cpf?: string;
  dataNascimento?: string;
}

export interface AtualizarAlunoRequest {
  id: number;
  nome?: string;
  email?: string;
  telefone?: string;
  senha?: string;
}
