import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ProfessorService } from '../../../core/services/professor.service';
import { HistoricoAulaProfessorItem } from '../../../core/models/historico.model';

@Component({
  selector: 'app-historico-professor',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatIconModule, MatPaginatorModule],
  templateUrl: './historico.html',
})
export class HistoricoProfessorComponent implements OnInit {
  private svc = inject(ProfessorService);
  aulas = signal<HistoricoAulaProfessorItem[]>([]);
  colunas = ['modalidade', 'quadra', 'inicio', 'fim', 'totalAlunos', 'statusAula'];
  pagina = signal(0);
  tamanhoPagina = signal(10);
  total = signal(0);

  ngOnInit() { this.carregar(); }

  carregar() {
    this.svc.historico(this.pagina(), this.tamanhoPagina()).subscribe(r => {
      this.aulas.set(r.historico);
      this.total.set(r.totalElements);
    });
  }

  onPage(e: PageEvent) {
    this.pagina.set(e.pageIndex);
    this.tamanhoPagina.set(e.pageSize);
    this.carregar();
  }

  statusClass(status: string) {
    const map: Record<string, string> = { AGENDADA: 'badge-blue', REALIZADA: 'badge-green', CANCELADA: 'badge-red' };
    return 'badge ' + (map[status] ?? 'badge-gray');
  }
}
