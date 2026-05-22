import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { InscricaoRequest, MinhasInscricoesResponse } from '../models/inscricao.model';

const API = 'http://localhost:8080';

@Injectable({ providedIn: 'root' })
export class InscricaoService {
  private http = inject(HttpClient);

  minhasInscricoes() {
    return this.http.get<MinhasInscricoesResponse>(`${API}/inscricao/minhas`);
  }

  inscrever(idAula: number) {
    const body: InscricaoRequest = { idAula };
    return this.http.post<any>(`${API}/inscricao/inscrever`, body);
  }

  cancelar(idInscricao: number) {
    return this.http.delete<any>(`${API}/inscricao/cancelar/${idInscricao}`);
  }
}
