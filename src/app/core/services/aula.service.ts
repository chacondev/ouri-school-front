import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
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
  private dadosCriacao$: Observable<DadosCriacaoAula> | null = null;

  criarAula(data: CriarAulaRequest) {
    return this.http.post<any>(`${API}/aulas`, data);
  }

  obterDadosCriacao() {
    if (!this.dadosCriacao$) {
      this.dadosCriacao$ = this.http.get<DadosCriacaoAula>(`${API}/aulas/obter-dados-criacao`).pipe(shareReplay(1));
    }
    return this.dadosCriacao$;
  }

  listarDisponiveis(page = 0, size = 10) {
    return this.http.get<ListaAulasDisponiveisResponse>(`${API}/aulas/disponiveis`, { params: { page, size } });
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

  realizarAulaDono(idAula: number) {
    return this.http.patch<any>(`${API}/dono/aulas/${idAula}/realizar`, null);
  }

  cancelarAulaDono(idAula: number) {
    return this.http.patch<any>(`${API}/dono/aulas/${idAula}/cancelar`, null);
  }
}
