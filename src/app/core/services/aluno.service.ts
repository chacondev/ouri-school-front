import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Aluno, CadastraAlunoRequest, AtualizarAlunoRequest } from '../models/aluno.model';
import { DashboardAlunoResponse } from '../models/dashboard.model';
import { HistoricoAlunoResponseDTO } from '../models/historico.model';
import { PagedResponse } from '../models/professor.model';

const API = 'http://localhost:8080';

@Injectable({ providedIn: 'root' })
export class AlunoService {
  private http = inject(HttpClient);

  listarAlunos(page = 0, size = 10, busca?: string) {
    const params: Record<string, any> = { page, size };
    if (busca) params['busca'] = busca;
    return this.http.get<{ alunos: Aluno[] } & PagedResponse>(`${API}/aluno/lista-alunos`, { params });
  }

  dadosAluno(id: number) {
    return this.http.get<{ aluno: Aluno }>(`${API}/aluno/dados-aluno/${id}`);
  }

  cadastrarAluno(data: CadastraAlunoRequest) {
    return this.http.post<any>(`${API}/aluno/cadastra-aluno`, data);
  }

  atualizarAluno(data: AtualizarAlunoRequest) {
    return this.http.put<any>(`${API}/aluno/atualizar-aluno/${data.id}`, data);
  }

  deletarAluno(id: number) {
    return this.http.delete<void>(`${API}/aluno/deleta-aluno/${id}`);
  }

  alterarStatus(id: number, ativo: boolean) {
    return this.http.patch<any>(`${API}/aluno/${id}/status`, null, { params: { ativo } });
  }

  dashboard() {
    return this.http.get<DashboardAlunoResponse>(`${API}/aluno/dashboard`);
  }

  historico(page = 0, size = 10, modalidade?: string, dataInicio?: string, dataFim?: string) {
    const params: Record<string, any> = { page, size };
    if (modalidade) params['modalidade'] = modalidade;
    if (dataInicio) params['dataInicio'] = dataInicio;
    if (dataFim) params['dataFim'] = dataFim;
    return this.http.get<HistoricoAlunoResponseDTO>(`${API}/aluno/historico`, { params });
  }
}
