import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DashboardProfessorResponse } from './../models/dashboard.model';
import { AgendaAulasResponse, AulaAgendaItem } from './../models/aula.model';
import { HistoricoProfessorResponseDTO } from './../models/historico.model';



import { API_URL } from '../api-url.token';
@Injectable({ providedIn: 'root' })
export class ProfessorService {
  private http = inject(HttpClient);
  private api = inject(API_URL);

  dashboard() {
    return this.http.get<DashboardProfessorResponse>(`${this.api}/professor/dashboard`);
  }

  agenda(page = 0, size = 10) {
    return this.http.get<AgendaAulasResponse>(`${this.api}/professor/agenda`, { params: { page, size } });
  }

  historico(page = 0, size = 10, modalidade?: string, dataInicio?: string, dataFim?: string) {
    const params: Record<string, any> = { page, size };
    if (modalidade) params['modalidade'] = modalidade;
    if (dataInicio) params['dataInicio'] = dataInicio;
    if (dataFim) params['dataFim'] = dataFim;
    return this.http.get<HistoricoProfessorResponseDTO>(`${this.api}/professor/historico`, { params });
  }

  calendario(dataInicio: string, dataFim: string) {
    return this.http.get<AgendaAulasResponse>(`${this.api}/professor/calendario`, { params: { dataInicio, dataFim } });
  }
}
