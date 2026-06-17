import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import {
  CriarAulaRequest,
  DadosCriacaoAula,
  ListaAulasDisponiveisResponse,
} from '../models/aula.model';
import { ListaInscritosResponse } from './../models/inscricao.model';



import { API_URL } from '../api-url.token';
@Injectable({ providedIn: 'root' })
export class AulaService {
  private http = inject(HttpClient);
  private api = inject(API_URL);
  private dadosCriacao$: Observable<DadosCriacaoAula> | null = null;

  criarAula(data: CriarAulaRequest) {
    return this.http.post<any>(`${this.api}/aulas`, data);
  }

  obterDadosCriacao() {
    if (!this.dadosCriacao$) {
      this.dadosCriacao$ = this.http.get<DadosCriacaoAula>(`${this.api}/aulas/obter-dados-criacao`).pipe(shareReplay(1));
    }
    return this.dadosCriacao$;
  }

  listarDisponiveis(page = 0, size = 10, modalidade?: string) {
    const params: Record<string, any> = { page, size };
    if (modalidade) params['modalidade'] = modalidade;
    return this.http.get<ListaAulasDisponiveisResponse>(`${this.api}/aulas/disponiveis`, { params });
  }

  listarModalidadesDisponiveis() {
    return this.http.get<string[]>(`${this.api}/aulas/modalidades-disponiveis`);
  }

  listarInscritos(idAula: number) {
    return this.http.get<ListaInscritosResponse>(`${this.api}/aulas/${idAula}/inscritos`);
  }

  realizarAula(idAula: number) {
    return this.http.patch<any>(`${this.api}/aulas/${idAula}/realizar`, null);
  }

  cancelarAula(idAula: number) {
    return this.http.patch<any>(`${this.api}/aulas/${idAula}/cancelar`, null);
  }

  realizarAulaDono(idAula: number) {
    return this.http.patch<any>(`${this.api}/dono/aulas/${idAula}/realizar`, null);
  }

  cancelarAulaDono(idAula: number) {
    return this.http.patch<any>(`${this.api}/dono/aulas/${idAula}/cancelar`, null);
  }
}
