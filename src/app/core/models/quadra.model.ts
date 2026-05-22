export interface Quadra {
  id: number;
  nome: string;
  descricao?: string;
  ativo: boolean;
}

export interface CadastraQuadraRequest {
  nome: string;
  descricao?: string;
}

export interface AtualizaQuadraRequest {
  id: number;
  nome: string;
  descricao?: string;
}
