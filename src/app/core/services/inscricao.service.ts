import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { InscricaoRequest, MinhasInscricoesResponse } from './../models/inscricao.model';



import { API_URL } from '../api-url.token';
@Injectable({ providedIn: 'root' })
export class InscricaoService {
  private http = inject(HttpClient);
  private api = inject(API_URL);

  minhasInscricoes() {
    return this.http.get<MinhasInscricoesResponse>(`${this.api}/inscricao/minhas`);
  }

  inscrever(idAula: number) {
    const body: InscricaoRequest = { idAula };
    return this.http.post<any>(`${this.api}/inscricao/inscrever`, body);
  }

  cancelar(idInscricao: number) {
    return this.http.delete<any>(`${this.api}/inscricao/cancelar/${idInscricao}`);
  }
}
