import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Modalidade, CadastraModalidadeRequest, AtualizaModalidadeRequest } from './../models/modalidade.model';



import { API_URL } from '../api-url.token';
@Injectable({ providedIn: 'root' })
export class ModalidadeService {
  private http = inject(HttpClient);
  private api = inject(API_URL);

  listar() {
    return this.http.get<{ modalidades: Modalidade[] }>(`${this.api}/modalidade/lista-modalidades`);
  }

  dados(id: number) {
    return this.http.get<Modalidade>(`${this.api}/modalidade/dados-modalidade/${id}`);
  }

  cadastrar(data: CadastraModalidadeRequest) {
    return this.http.post<any>(`${this.api}/modalidade/cadastra-modalidade`, data);
  }

  atualizar(data: AtualizaModalidadeRequest) {
    return this.http.put<any>(`${this.api}/modalidade/atualiza-modalidade`, data);
  }

  deletar(id: number) {
    return this.http.delete<void>(`${this.api}/modalidade/deleta-modalidade/${id}`);
  }

  alterarStatus(id: number, ativo: boolean) {
    return this.http.patch<any>(`${this.api}/modalidade/${id}/status`, null, { params: { ativo } });
  }
}
