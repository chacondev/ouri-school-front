import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Professor, CadastraProfessorRequest, AtualizarProfessorRequest, PagedResponse } from '../models/professor.model';
import { DashboardDonoResponse } from '../models/dashboard.model';
import { AgendaAulasResponse } from '../models/aula.model';

const API = 'http://localhost:8080';

@Injectable({ providedIn: 'root' })
export class DonoService {
  private http = inject(HttpClient);

  listarProfessores(page = 0, size = 10, busca?: string) {
    const params: Record<string, any> = { page, size };
    if (busca) params['busca'] = busca;
    return this.http.get<{ professores: Professor[] } & PagedResponse>(`${API}/dono/lista-professores`, { params });
  }

  dadosProfessor(id: number) {
    return this.http.get<Professor>(`${API}/dono/dados-professor/${id}`);
  }

  cadastrarProfessor(data: CadastraProfessorRequest) {
    return this.http.post<any>(`${API}/dono/cadastra-professor`, data);
  }

  atualizarProfessor(data: AtualizarProfessorRequest) {
    return this.http.put<any>(`${API}/dono/atualiza-professor`, data);
  }

  deletarProfessor(id: number) {
    return this.http.delete<void>(`${API}/dono/deleta-professor/${id}`);
  }

  alterarStatusProfessor(id: number, ativo: boolean) {
    return this.http.patch<any>(`${API}/dono/professor/${id}/status`, null, { params: { ativo } });
  }

  dashboard() {
    return this.http.get<DashboardDonoResponse>(`${API}/dono/dashboard`);
  }

  listarAulas(page = 0, size = 10, status?: string) {
    const params: Record<string, any> = { page, size };
    if (status) params['status'] = status;
    return this.http.get<AgendaAulasResponse>(`${API}/dono/aulas`, { params });
  }
}
