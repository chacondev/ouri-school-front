import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { DadosUsuarioResponse, UsuarioDTO, AtualizarUsuarioRequest } from './../models/usuario.model';



import { API_URL } from '../api-url.token';
@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private http = inject(HttpClient);
  private api = inject(API_URL);

  obterDados() {
    return this.http.get<DadosUsuarioResponse>(`${this.api}/me`).pipe(
      map(res => res.usuario)
    );
  }

  atualizar(data: AtualizarUsuarioRequest) {
    return this.http.put<any>(`${this.api}/me`, data);
  }
}
