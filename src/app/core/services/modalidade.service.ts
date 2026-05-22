import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Modalidade, CadastraModalidadeRequest, AtualizaModalidadeRequest } from '../models/modalidade.model';

const API = 'http://localhost:8080';

@Injectable({ providedIn: 'root' })
export class ModalidadeService {
  private http = inject(HttpClient);

  listar() {
    return this.http.get<{ modalidades: Modalidade[] }>(`${API}/modalidade/lista-modalidades`);
  }

  dados(id: number) {
    return this.http.get<Modalidade>(`${API}/modalidade/dados-modalidade/${id}`);
  }

  cadastrar(data: CadastraModalidadeRequest) {
    return this.http.post<any>(`${API}/modalidade/cadastra-modalidade`, data);
  }

  atualizar(data: AtualizaModalidadeRequest) {
    return this.http.put<any>(`${API}/modalidade/atualiza-modalidade`, data);
  }

  deletar(id: number) {
    return this.http.delete<void>(`${API}/modalidade/deleta-modalidade/${id}`);
  }

  alterarStatus(id: number, ativo: boolean) {
    return this.http.patch<any>(`${API}/modalidade/${id}/status`, null, { params: { ativo } });
  }
}
