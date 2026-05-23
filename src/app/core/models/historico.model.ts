export interface HistoricoAulaAlunoItem {
  idAula: number;
  modalidade: string;
  professor: string;
  inicio: string;
  fim: string;
  statusInscricao: string;
  statusAula: string;
}

export interface HistoricoAlunoResponseDTO {
  historico: HistoricoAulaAlunoItem[];
  totalAulas: number;
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface HistoricoAulaProfessorItem {
  idAula: number;
  modalidade: string;
  quadra: string;
  inicio: string;
  fim: string;
  totalAlunos: number;
  statusAula: string;
}

export interface HistoricoProfessorResponseDTO {
  historico: HistoricoAulaProfessorItem[];
  totalAulas: number;
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
