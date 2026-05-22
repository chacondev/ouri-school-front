export type StatusAula = 'AGENDADA' | 'REALIZADA' | 'CANCELADA';

export interface Aula {
  id: number;
  modalidade: string;
  quadra: string;
  professor: string;
  dataHoraInicio: string;
  dataHoraFim: string;
  capacidade: number;
  vagasDisponiveis?: number;
  status: StatusAula;
  jaInscrito?: boolean;
}

export interface CriarAulaRequest {
  idModalidade: number;
  idQuadra: number;
  idProfessor?: number;
  dataHoraInicio: string;
  dataHoraFim: string;
  capacidade: number;
}

export interface AgendaAulasResponse {
  aulas: Aula[];
}

export interface ListaAulasDisponiveisResponse {
  aulas: Aula[];
}

export interface DadosCriacaoAula {
  modalidades: { id: number; nome: string }[];
  quadras: { id: number; nome: string }[];
  professores?: { id: number; nome: string }[];
}
