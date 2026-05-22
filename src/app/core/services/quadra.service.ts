import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Quadra, CadastraQuadraRequest, AtualizaQuadraRequest } from '../models/quadra.model';

const API = 'http://localhost:8080';

@Injectable({ providedIn: 'root' })
export class QuadraService {
  private http = inject(HttpClient);

  listar() {
    return this.http.get<{ quadras: Quadra[] }>(`${API}/quadra/lista-quadras`);
  }

  dados(id: number) {
    return this.http.get<Quadra>(`${API}/quadra/dados-quadra/${id}`);
  }

  cadastrar(data: CadastraQuadraRequest) {
    return this.http.post<any>(`${API}/quadra/cadastra-quadra`, data);
  }

  atualizar(data: AtualizaQuadraRequest) {
    return this.http.put<any>(`${API}/quadra/atualiza-quadra`, data);
  }

  deletar(id: number) {
    return this.http.delete<void>(`${API}/quadra/deleta-quadra/${id}`);
  }

  alterarStatus(id: number, ativo: boolean) {
    return this.http.patch<any>(`${API}/quadra/${id}/status`, null, { params: { ativo } });
  }
}
