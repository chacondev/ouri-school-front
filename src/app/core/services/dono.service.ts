import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Professor, CadastraProfessorRequest, AtualizarProfessorRequest, PagedResponse } from './../models/professor.model';
import { DashboardDonoResponse } from './../models/dashboard.model';
import { AgendaAulasResponse } from './../models/aula.model';



import { API_URL } from '../api-url.token';
@Injectable({ providedIn: 'root' })
export class DonoService {
  private http = inject(HttpClient);
  private api = inject(API_URL);

  listarProfessores(page = 0, size = 10, busca?: string) {
    const params: Record<string, any> = { page, size };
    if (busca) params['busca'] = busca;
    return this.http.get<{ professores: Professor[] } & PagedResponse>(`${this.api}/dono/lista-professores`, { params });
  }

  dadosProfessor(id: number) {
    return this.http.get<Professor>(`${this.api}/dono/dados-professor/${id}`);
  }

  cadastrarProfessor(data: CadastraProfessorRequest) {
    return this.http.post<any>(`${this.api}/dono/cadastra-professor`, data);
  }

  atualizarProfessor(data: AtualizarProfessorRequest) {
    return this.http.put<any>(`${this.api}/dono/atualiza-professor`, data);
  }

  deletarProfessor(id: number) {
    return this.http.delete<void>(`${this.api}/dono/deleta-professor/${id}`);
  }

  alterarStatusProfessor(id: number, ativo: boolean) {
    return this.http.patch<any>(`${this.api}/dono/professor/${id}/status`, null, { params: { ativo } });
  }

  dashboard() {
    return this.http.get<DashboardDonoResponse>(`${this.api}/dono/dashboard`);
  }

  listarAulas(page = 0, size = 10, status?: string) {
    const params: Record<string, any> = { page, size };
    if (status) params['status'] = status;
    return this.http.get<AgendaAulasResponse>(`${this.api}/dono/aulas`, { params });
  }

  historicoAluno(idAluno: number, page = 0, size = 10) {
    return this.http.get<any>(`${this.api}/dono/alunos/${idAluno}/historico`, { params: { page, size } });
  }

  calendarioAulas(dataInicio: string, dataFim: string) {
    return this.http.get<AgendaAulasResponse>(`${this.api}/dono/aulas/calendario`, { params: { dataInicio, dataFim } });
  }
}
