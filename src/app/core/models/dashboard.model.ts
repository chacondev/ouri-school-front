import { AulaResumo } from './aula.model';

export interface DashboardDonoResponse {
  totalAlunos: number;
  totalProfessores: number;
  totalModalidades: number;
  totalQuadras: number;
  proximasAulas: AulaResumo[];
}

export interface DashboardProfessorResponse {
  aulasHoje: number;
  totalAlunosInscritos: number;
  aulasLotadas: number;
  aulasBaixaOcupacao: number;
  proximasAulas: AulaResumo[];
}

export interface DashboardAlunoResponse {
  totalInscricoesAtivas: number;
  totalModalidadesPraticadas: number;
  totalHorasEmAula: number;
  proximasAulas: AulaResumo[];
}
