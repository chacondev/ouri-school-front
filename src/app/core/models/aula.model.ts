export type StatusAula = 'AGENDADA' | 'REALIZADA' | 'CANCELADA';

export interface AulaResumo {
  idAula: number;
  modalidade: string;
  quadra: string;
  professor: string;
  inicio: string;
  fim: string;
  totalInscritos: number;
  limiteAlunos: number;
}

export interface AulaAgendaItem {
  idAula: number;
  modalidade: string;
  quadra: string;
  professor: string;
  inicio: string;
  fim: string;
  totalInscritos: number;
  limiteAlunos: number;
  status: StatusAula;
}

export interface AulaDisponivel {
  idAula: number;
  modalidade: string;
  professor: string;
  quadra: string;
  inicio: string;
  fim: string;
  vagasDisponiveis: number;
  limiteAlunos: number;
  jaInscrito: boolean;
}

export interface CriarAulaRequest {
  idModalidade: number;
  idQuadra: number;
  idProfessor?: number;
  inicio: string;
  fim: string;
  limiteAlunos: number;
  descricao?: string;
}

export interface AgendaAulasResponse {
  aulas: AulaAgendaItem[];
  total: number;
}

export interface ListaAulasDisponiveisResponse {
  aulas: AulaDisponivel[];
  total: number;
}

export interface DadosCriacaoAula {
  modalidades: { id: number; nome: string }[];
  quadras: { id: number; nome: string }[];
  professores: { id: number; nome: string }[];
  datasDisponiveis: string[];
  horariosDisponiveis: Record<string, string[]>;
}
