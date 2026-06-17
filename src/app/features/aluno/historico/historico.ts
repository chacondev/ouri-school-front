import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AlunoService } from '../../../core/services/aluno.service';
import { HistoricoAulaAlunoItem } from '../../../core/models/historico.model';

@Component({
  selector: 'app-historico-aluno',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule, MatPaginatorModule, MatProgressBarModule, MatFormFieldModule, MatInputModule],
  templateUrl: './historico.html',
})
export class HistoricoAlunoComponent implements OnInit {
  private svc = inject(AlunoService);

  aulas = signal<HistoricoAulaAlunoItem[]>([]);
  pagina = signal(0);
  tamanhoPagina = signal(10);
  total = signal(0);
  carregando = signal(false);

  filtroModalidade = '';
  filtroDataInicio = '';
  filtroDataFim = '';

  ngOnInit() { this.carregar(); }

  carregar() {
    this.carregando.set(true);
    this.svc.historico(
      this.pagina(), this.tamanhoPagina(),
      this.filtroModalidade || undefined,
      this.filtroDataInicio || undefined,
      this.filtroDataFim || undefined,
    ).subscribe({
      next: r => { this.aulas.set(r.historico); this.total.set(r.totalElements); this.carregando.set(false); },
      error: () => this.carregando.set(false),
    });
  }

  filtrar() {
    this.pagina.set(0);
    this.carregar();
  }

  limpar() {
    this.filtroModalidade = '';
    this.filtroDataInicio = '';
    this.filtroDataFim = '';
    this.pagina.set(0);
    this.carregar();
  }

  onPage(e: PageEvent) {
    this.pagina.set(e.pageIndex);
    this.tamanhoPagina.set(e.pageSize);
    this.carregar();
  }

  statusClass(status: string): string {
    const map: Record<string, string> = { AGENDADA: 'badge-blue', REALIZADA: 'badge-green', CANCELADA: 'badge-red', CONFIRMADA: 'badge-green', CANCELADO: 'badge-red', INSCRITO: 'badge-blue' };
    return map[status] ?? 'badge-gray';
  }

  statusLabel(status: string): string {
    const map: Record<string, string> = { AGENDADA: 'Agendada', REALIZADA: 'Realizada', CANCELADA: 'Cancelada', CONFIRMADA: 'Confirmada', CANCELADO: 'Cancelado', INSCRITO: 'Inscrito' };
    return map[status] ?? status;
  }
}
