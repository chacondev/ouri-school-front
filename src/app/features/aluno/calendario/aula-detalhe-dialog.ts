import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HistoricoAulaAlunoItem } from '../../../core/models/historico.model';

@Component({
  selector: 'app-aula-detalhe-aluno-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <h2 mat-dialog-title style="text-align:center">{{ aula.modalidade }}</h2>
    <mat-dialog-content>
      <div style="display:flex;flex-direction:column;gap:12px;padding:4px 0">
        <div style="display:flex;align-items:center;gap:10px">
          <mat-icon style="color:var(--blue)">person</mat-icon>
          <span>{{ aula.professor }}</span>
        </div>
        <div style="display:flex;align-items:center;gap:10px">
          <mat-icon style="color:var(--blue)">schedule</mat-icon>
          <span>{{ aula.inicio | date:'dd/MM/yyyy HH:mm' }} — {{ aula.fim | date:'HH:mm' }}</span>
        </div>
        <div style="display:flex;align-items:center;gap:10px">
          <mat-icon style="color:var(--blue)">info</mat-icon>
          <span class="badge {{ statusClass(aula.statusAula) }}">{{ aula.statusAula }}</span>
        </div>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-stroked-button (click)="fechar()">Fechar</button>
    </mat-dialog-actions>
  `,
})
export class AulaDetalheAlunoDialogComponent {
  aula = inject<HistoricoAulaAlunoItem>(MAT_DIALOG_DATA);
  private ref = inject(MatDialogRef);

  fechar() { this.ref.close(); }

  statusClass(status: string) {
    const map: Record<string, string> = { AGENDADA: 'badge-blue', REALIZADA: 'badge-green', CANCELADA: 'badge-red' };
    return map[status] ?? 'badge-gray';
  }
}
