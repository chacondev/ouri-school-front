import { Aula } from './aula.model';

export interface DashboardDonoResponse {
  totalProfessores: number;
  totalAlunos: number;
  totalAulasHoje: number;
  totalAulasAgendadas: number;
  proximasAulas: Aula[];
}

export interface DashboardProfessorResponse {
  totalAlunosInscritos: number;
  totalAulasAgendadas: number;
  proximasAulas: Aula[];
}

export interface DashboardAlunoResponse {
  totalInscricoesAtivas: number;
  proximasAulas: Aula[];
}
