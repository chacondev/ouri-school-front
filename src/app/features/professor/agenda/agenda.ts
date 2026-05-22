import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { ProfessorService } from '../../../core/services/professor.service';
import { AulaService } from '../../../core/services/aula.service';
import { Aula } from '../../../core/models/aula.model';
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

  aulas = signal<Aula[]>([]);
  colunas = ['modalidade', 'quadra', 'dataHoraInicio', 'dataHoraFim', 'capacidade', 'status', 'acoes'];

  ngOnInit() { this.carregar(); }

  carregar() {
    this.svc.agenda().subscribe(r => this.aulas.set(r.aulas));
  }

  realizarAula(a: Aula) {
    if (!confirm(`Confirmar que a aula de ${a.modalidade} foi realizada?`)) return;
    this.aulaSvc.realizarAula(a.id).subscribe(() => this.carregar());
  }

  cancelarAula(a: Aula) {
    if (!confirm(`Cancelar a aula de ${a.modalidade}? Todos os inscritos serão notificados.`)) return;
    this.aulaSvc.cancelarAula(a.id).subscribe(() => this.carregar());
  }

  verInscritos(aula: Aula) {
    this.dialog.open(InscritosDialogComponent, { data: aula, width: '500px' });
  }

  statusClass(status: string) {
    const map: Record<string, string> = { AGENDADA: 'badge-blue', REALIZADA: 'badge-green', CANCELADA: 'badge-red' };
    return 'badge ' + (map[status] ?? 'badge-gray');
  }
}
