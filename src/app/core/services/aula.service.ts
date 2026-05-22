import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  CriarAulaRequest,
  DadosCriacaoAula,
  ListaAulasDisponiveisResponse,
} from '../models/aula.model';
import { ListaInscritosResponse } from '../models/inscricao.model';

const API = 'http://localhost:8080';

@Injectable({ providedIn: 'root' })
export class AulaService {
  private http = inject(HttpClient);

  criarAula(data: CriarAulaRequest) {
    return this.http.post<any>(`${API}/aulas`, data);
  }

  obterDadosCriacao() {
    return this.http.get<DadosCriacaoAula>(`${API}/aulas/obter-dados-criacao`);
  }

  listarDisponiveis() {
    return this.http.get<ListaAulasDisponiveisResponse>(`${API}/aulas/disponiveis`);
  }

  listarInscritos(idAula: number) {
    return this.http.get<ListaInscritosResponse>(`${API}/aulas/${idAula}/inscritos`);
  }

  realizarAula(idAula: number) {
    return this.http.patch<any>(`${API}/aulas/${idAula}/realizar`, null);
  }

  cancelarAula(idAula: number) {
    return this.http.patch<any>(`${API}/aulas/${idAula}/cancelar`, null);
  }
}
