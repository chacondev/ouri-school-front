import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { ProfessorService } from '../../../core/services/professor.service';
import { Aula } from '../../../core/models/aula.model';

@Component({
  selector: 'app-historico-professor',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatIconModule],
  templateUrl: './historico.html',
})
export class HistoricoProfessorComponent implements OnInit {
  private svc = inject(ProfessorService);
  aulas = signal<Aula[]>([]);
  colunas = ['modalidade', 'quadra', 'dataHoraInicio', 'dataHoraFim', 'status'];

  ngOnInit() {
    this.svc.historico().subscribe(r => this.aulas.set(r.aulas));
  }

  statusClass(status: string) {
    const map: Record<string, string> = { AGENDADA: 'badge-blue', REALIZADA: 'badge-green', CANCELADA: 'badge-red' };
    return 'badge ' + (map[status] ?? 'badge-gray');
  }
}
