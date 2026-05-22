import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { ProfessorService } from '../../../core/services/professor.service';
import { AulaService } from '../../../core/services/aula.service';
import { AulaAgendaItem } from '../../../core/models/aula.model';
import { InscritosDialogComponent } from '../../dono/aulas/inscritos-dialog';

@Component({
  selector: 'app-agenda-professor',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule],
  templateUrl: './agenda.html',
})
export class AgendaProfessorComponent implements OnInit {
  private svc = inject(ProfessorService);
  private aulaSvc = inject(AulaService);
  private dialog = inject(MatDialog);

  aulas = signal<AulaAgendaItem[]>([]);
  colunas = ['modalidade', 'quadra', 'inicio', 'fim', 'limiteAlunos', 'status', 'acoes'];

  ngOnInit() { this.carregar(); }

  carregar() {
    this.svc.agenda().subscribe(r => this.aulas.set(r.aulas));
  }

  realizarAula(a: AulaAgendaItem) {
    if (!confirm(`Confirmar que a aula de ${a.modalidade} foi realizada?`)) return;
    this.aulaSvc.realizarAula(a.idAula).subscribe(() => this.carregar());
  }

  cancelarAula(a: AulaAgendaItem) {
    if (!confirm(`Cancelar a aula de ${a.modalidade}? Todos os inscritos serão notificados.`)) return;
    this.aulaSvc.cancelarAula(a.idAula).subscribe(() => this.carregar());
  }

  verInscritos(aula: AulaAgendaItem) {
    this.dialog.open(InscritosDialogComponent, { data: aula, width: '500px' });
  }

  statusClass(status: string) {
    const map: Record<string, string> = { AGENDADA: 'badge-blue', REALIZADA: 'badge-green', CANCELADA: 'badge-red' };
    return 'badge ' + (map[status] ?? 'badge-gray');
  }
}
