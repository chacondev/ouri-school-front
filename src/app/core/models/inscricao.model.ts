export interface MinhaInscricao {
  idInscricao: number;
  idAula: number;
  modalidade: string;
  professor: string;
  quadra: string;
  inicio: string;
  fim: string;
  vagasDisponiveis: number;
  dataInscricao: string;
}

export interface InscricaoRequest {
  idAula: number;
}

export interface MinhasInscricoesResponse {
  inscricoes: MinhaInscricao[];
  total: number;
}

export interface Inscrito {
  idInscricao: number;
  idAluno: number;
  nome: string;
  email: string;
  dataInscricao: string;
}

export interface ListaInscritosResponse {
  idAula: number;
  modalidade: string;
  quadra: string;
  limiteAlunos: number;
  inscritos: Inscrito[];
  total: number;
}
