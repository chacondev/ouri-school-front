export interface DadosUsuario {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  cpf?: string;
  dataNascimento?: string;
  ativo: boolean;
}

export interface AtualizarUsuarioRequest {
  nome?: string;
  email?: string;
  telefone?: string;
  senha?: string;
}
