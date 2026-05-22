export interface Inscricao {
  id: number;
  idAula: number;
  modalidade: string;
  quadra: string;
  professor: string;
  dataHoraInicio: string;
  dataHoraFim: string;
  status: string;
}

export interface InscricaoRequest {
  idAula: number;
}

export interface MinhasInscricoesResponse {
  inscricoes: Inscricao[];
}

export interface Inscrito {
  id: number;
  nome: string;
  email: string;
}

export interface ListaInscritosResponse {
  inscritos: Inscrito[];
  totalInscritos: number;
}
