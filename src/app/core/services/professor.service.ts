import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DashboardProfessorResponse } from '../models/dashboard.model';
import { AgendaAulasResponse } from '../models/aula.model';
import { Aula } from '../models/aula.model';

const API = 'http://localhost:8080';

@Injectable({ providedIn: 'root' })
export class ProfessorService {
  private http = inject(HttpClient);

  dashboard() {
    return this.http.get<DashboardProfessorResponse>(`${API}/professor/dashboard`);
  }

  agenda() {
    return this.http.get<AgendaAulasResponse>(`${API}/professor/agenda`);
  }

  historico() {
    return this.http.get<{ aulas: Aula[] }>(`${API}/professor/historico`);
  }
}
