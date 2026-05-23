import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ProfessorService } from '../../../core/services/professor.service';
import { AulaService } from '../../../core/services/aula.service';
import { AlertService } from '../../../shared/alert-dialog/alert.service';
import { AulaAgendaItem } from '../../../core/models/aula.model';
import { InscritosDialogComponent } from '../../dono/aulas/inscritos-dialog';

@Component({
  selector: 'app-agenda-professor',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule, MatPaginatorModule, MatProgressBarModule],
  templateUrl: './agenda.html',
})
export class AgendaProfessorComponent implements OnInit {
  private svc = inject(ProfessorService);
  private aulaSvc = inject(AulaService);
  private alert = inject(AlertService);
  private dialog = inject(MatDialog);

  aulas = signal<AulaAgendaItem[]>([]);
  colunas = ['modalidade', 'quadra', 'inicio', 'fim', 'limiteAlunos', 'status', 'acoes'];
  pagina = signal(0);
  tamanhoPagina = signal(10);
  total = signal(0);
  carregando = signal(false);

  ngOnInit() { this.carregar(); }

  carregar() {
    this.carregando.set(true);
    this.svc.agenda(this.pagina(), this.tamanhoPagina()).subscribe({
      next: r => { this.aulas.set(r.aulas); this.total.set(r.totalElements); this.carregando.set(false); },
      error: () => this.carregando.set(false),
    });
  }

  onPage(e: PageEvent) {
    this.pagina.set(e.pageIndex);
    this.tamanhoPagina.set(e.pageSize);
    this.carregar();
  }

  realizarAula(a: AulaAgendaItem) {
    this.alert.confirmar(`Confirmar que a aula de ${a.modalidade} foi realizada?`, 'Marcar como Realizada')
      .subscribe(ok => {
        if (!ok) return;
        this.aulaSvc.realizarAula(a.idAula).subscribe({
          next: () => { this.alert.notificar('Aula marcada como realizada!'); this.carregar(); },
          error: (e: any) => this.alert.erro(e?.error?.message ?? 'Não foi possível realizar a aula.'),
        });
      });
  }

  cancelarAula(a: AulaAgendaItem) {
    this.alert.confirmar(`Cancelar a aula de ${a.modalidade}? Todos os inscritos serão afetados.`, 'Cancelar Aula')
      .subscribe(ok => {
        if (!ok) return;
        this.aulaSvc.cancelarAula(a.idAula).subscribe({
          next: () => { this.alert.notificar('Aula cancelada com sucesso!'); this.carregar(); },
          error: (e: any) => this.alert.erro(e?.error?.message ?? 'Não foi possível cancelar a aula.'),
        });
      });
  }

  verInscritos(aula: AulaAgendaItem) {
    this.dialog.open(InscritosDialogComponent, { data: aula, width: '500px' });
  }

  statusClass(status: string) {
    const map: Record<string, string> = { AGENDADA: 'badge-blue', REALIZADA: 'badge-green', CANCELADA: 'badge-red' };
    return 'badge ' + (map[status] ?? 'badge-gray');
  }
}
