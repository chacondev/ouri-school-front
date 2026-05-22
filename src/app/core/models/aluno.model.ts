export interface Aluno {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  telefone?: string;
  dataNascimento?: string;
  sexo?: string;
  ativo: boolean;
}

export interface CadastraAlunoRequest {
  nome: string;
  cpf: string;
  email: string;
  senha: string;
  telefone?: string;
  dataNascimento?: string;
  sexo?: string;
  ativo: boolean;
}

export interface AtualizarAlunoRequest {
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
