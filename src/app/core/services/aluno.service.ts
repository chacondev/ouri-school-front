import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Aluno, CadastraAlunoRequest, AtualizarAlunoRequest } from '../models/aluno.model';
import { DashboardAlunoResponse } from '../models/dashboard.model';
import { Aula } from '../models/aula.model';

const API = 'http://localhost:8080';

@Injectable({ providedIn: 'root' })
export class AlunoService {
  private http = inject(HttpClient);

  listarAlunos() {
    return this.http.get<{ alunos: Aluno[] }>(`${API}/aluno/lista-alunos`);
  }

  dadosAluno(id: number) {
    return this.http.get<Aluno>(`${API}/aluno/dados-aluno/${id}`);
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

  historico() {
    return this.http.get<{ aulas: Aula[] }>(`${API}/aluno/historico`);
  }
}
