import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Aluno, CadastraAlunoRequest, AtualizarAlunoRequest } from './../models/aluno.model';
import { DashboardAlunoResponse } from './../models/dashboard.model';
import { HistoricoAlunoResponseDTO } from './../models/historico.model';
import { PagedResponse } from './../models/professor.model';



import { API_URL } from '../api-url.token';
@Injectable({ providedIn: 'root' })
export class AlunoService {
  private http = inject(HttpClient);
  private api = inject(API_URL);

  listarAlunos(page = 0, size = 10, busca?: string) {
    const params: Record<string, any> = { page, size };
    if (busca) params['busca'] = busca;
    return this.http.get<{ alunos: Aluno[] } & PagedResponse>(`${this.api}/aluno/lista-alunos`, { params });
  }

  dadosAluno(id: number) {
    return this.http.get<{ aluno: Aluno }>(`${this.api}/aluno/dados-aluno/${id}`);
  }

  cadastrarAluno(data: CadastraAlunoRequest) {
    return this.http.post<any>(`${this.api}/aluno/cadastra-aluno`, data);
  }

  atualizarAluno(data: AtualizarAlunoRequest) {
    return this.http.put<any>(`${this.api}/aluno/atualizar-aluno/${data.id}`, data);
  }

  deletarAluno(id: number) {
    return this.http.delete<void>(`${this.api}/aluno/deleta-aluno/${id}`);
  }

  alterarStatus(id: number, ativo: boolean) {
    return this.http.patch<any>(`${this.api}/aluno/${id}/status`, null, { params: { ativo } });
  }

  dashboard() {
    return this.http.get<DashboardAlunoResponse>(`${this.api}/aluno/dashboard`);
  }

  calendario(dataInicio: string, dataFim: string) {
    return this.http.get<HistoricoAlunoResponseDTO>(`${this.api}/aluno/calendario`, { params: { dataInicio, dataFim } });
  }

  historico(page = 0, size = 10, modalidade?: string, dataInicio?: string, dataFim?: string) {
    const params: Record<string, any> = { page, size };
    if (modalidade) params['modalidade'] = modalidade;
    if (dataInicio) params['dataInicio'] = dataInicio;
    if (dataFim) params['dataFim'] = dataFim;
    return this.http.get<HistoricoAlunoResponseDTO>(`${this.api}/aluno/historico`, { params });
  }
}
