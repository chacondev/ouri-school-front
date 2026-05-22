export interface Modalidade {
  id: number;
  nome: string;
  descricao?: string;
  ativo: boolean;
}

export interface CadastraModalidadeRequest {
  nome: string;
  descricao?: string;
}

export interface AtualizaModalidadeRequest {
  id: number;
  nome: string;
  descricao?: string;
}
