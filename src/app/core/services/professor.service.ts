import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DashboardProfessorResponse } from '../models/dashboard.model';
import { AgendaAulasResponse } from '../models/aula.model';
import { HistoricoProfessorResponseDTO } from '../models/historico.model';

const API = 'http://localhost:8080';

@Injectable({ providedIn: 'root' })
export class ProfessorService {
  private http = inject(HttpClient);

  dashboard() {
    return this.http.get<DashboardProfessorResponse>(`${API}/professor/dashboard`);
  }

  agenda(page = 0, size = 10) {
    return this.http.get<AgendaAulasResponse>(`${API}/professor/agenda`, { params: { page, size } });
  }

  historico(page = 0, size = 10, modalidade?: string, dataInicio?: string, dataFim?: string) {
    const params: Record<string, any> = { page, size };
    if (modalidade) params['modalidade'] = modalidade;
    if (dataInicio) params['dataInicio'] = dataInicio;
    if (dataFim) params['dataFim'] = dataFim;
    return this.http.get<HistoricoProfessorResponseDTO>(`${API}/professor/historico`, { params });
  }
}
