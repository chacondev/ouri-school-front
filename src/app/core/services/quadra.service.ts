import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Quadra, CadastraQuadraRequest, AtualizaQuadraRequest } from './../models/quadra.model';



import { API_URL } from '../api-url.token';
@Injectable({ providedIn: 'root' })
export class QuadraService {
  private http = inject(HttpClient);
  private api = inject(API_URL);

  listar() {
    return this.http.get<{ quadras: Quadra[] }>(`${this.api}/quadra/lista-quadras`);
  }

  dados(id: number) {
    return this.http.get<Quadra>(`${this.api}/quadra/dados-quadra/${id}`);
  }

  cadastrar(data: CadastraQuadraRequest) {
    return this.http.post<any>(`${this.api}/quadra/cadastra-quadra`, data);
  }

  atualizar(data: AtualizaQuadraRequest) {
    return this.http.put<any>(`${this.api}/quadra/atualiza-quadra`, data);
  }

  deletar(id: number) {
    return this.http.delete<void>(`${this.api}/quadra/deleta-quadra/${id}`);
  }

  alterarStatus(id: number, ativo: boolean) {
    return this.http.patch<any>(`${this.api}/quadra/${id}/status`, null, { params: { ativo } });
  }
}
