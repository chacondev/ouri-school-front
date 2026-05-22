export interface UsuarioDTO {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  telefone?: string;
  dataNascimento?: string;
  sexo?: string;
  ativo: boolean;
  dataCadastro: string;
}

export interface DadosUsuarioResponse {
  usuario: UsuarioDTO;
}

export interface AtualizarUsuarioRequest {
  nome?: string;
  email?: string;
  telefone?: string;
  senha?: string;
}
