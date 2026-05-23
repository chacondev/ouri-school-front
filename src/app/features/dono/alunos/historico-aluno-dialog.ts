import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DonoService } from '../../../core/services/dono.service';
import { Aluno } from '../../../core/models/aluno.model';

@Component({
  selector: 'app-historico-aluno-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatTableModule, MatButtonModule, MatIconModule, MatPaginatorModule, MatProgressBarModule],
  templateUrl: './historico-aluno-dialog.html',
})
export class HistoricoAlunoDialogComponent implements OnInit {
  private svc = inject(DonoService);
  private dialogRef = inject(MatDialogRef<HistoricoAlunoDialogComponent>);
  aluno: Aluno = inject(MAT_DIALOG_DATA);

  historico = signal<any[]>([]);
  colunas = ['modalidade', 'professor', 'inicio', 'fim', 'statusInscricao', 'statusAula'];
  carregando = signal(false);
  pagina = signal(0);
  tamanhoPagina = signal(10);
  total = signal(0);

  ngOnInit() { this.carregar(); }

  carregar() {
    this.carregando.set(true);
    this.svc.historicoAluno(this.aluno.id, this.pagina(), this.tamanhoPagina()).subscribe({
      next: r => { this.historico.set(r.historico); this.total.set(r.totalElements); this.carregando.set(false); },
      error: () => this.carregando.set(false),
    });
  }

  onPage(e: PageEvent) {
    this.pagina.set(e.pageIndex);
    this.tamanhoPagina.set(e.pageSize);
    this.carregar();
  }

  statusInscricaoClass(status: string) {
    const map: Record<string, string> = { INSCRITO: 'badge-green', CANCELADO: 'badge-red' };
    return 'badge ' + (map[status] ?? 'badge-gray');
  }

  statusAulaClass(status: string) {
    const map: Record<string, string> = { AGENDADA: 'badge-blue', REALIZADA: 'badge-green', CANCELADA: 'badge-red' };
    return 'badge ' + (map[status] ?? 'badge-gray');
  }
}
