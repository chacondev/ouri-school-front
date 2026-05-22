import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DadosUsuario, AtualizarUsuarioRequest } from '../models/usuario.model';

const API = 'http://localhost:8080';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private http = inject(HttpClient);

  obterDados() {
    return this.http.get<DadosUsuario>(`${API}/me`);
  }

  atualizar(data: AtualizarUsuarioRequest) {
    return this.http.put<any>(`${API}/me`, data);
  }
}
