export interface Quadra {
  id: number;
  nome: string;
  tipo: string;
  descricao?: string;
  ativa: boolean;
}

export interface CadastraQuadraRequest {
  nome: string;
  tipo: string;
  descricao?: string;
  ativa: boolean;
}

export interface AtualizaQuadraRequest {
  id: number;
  nome: string;
  tipo: string;
  descricao?: string;
  ativa: boolean;
}
