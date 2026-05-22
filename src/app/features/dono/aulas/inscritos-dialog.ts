import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { AulaService } from '../../../core/services/aula.service';
import { AulaAgendaItem } from '../../../core/models/aula.model';
import { Inscrito } from '../../../core/models/inscricao.model';

@Component({
  selector: 'app-inscritos-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatTableModule, MatIconModule],
  template: `
    <h2 mat-dialog-title>Inscritos — {{ aula.modalidade }}</h2>
    <mat-dialog-content>
      <p style="margin-bottom:12px;color:#666;font-size:0.85rem">
        {{ aula.inicio | date:'dd/MM/yyyy HH:mm' }} · {{ aula.quadra }}
      </p>
      @if (inscritos().length > 0) {
        <table mat-table [dataSource]="inscritos()" style="width:100%">
          <ng-container matColumnDef="nome">
            <th mat-header-cell *matHeaderCellDef>Nome</th>
            <td mat-cell *matCellDef="let i">{{ i.nome }}</td>
          </ng-container>
          <ng-container matColumnDef="email">
            <th mat-header-cell *matHeaderCellDef>Email</th>
            <td mat-cell *matCellDef="let i">{{ i.email }}</td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="['nome','email']"></tr>
          <tr mat-row *matRowDef="let row; columns: ['nome','email'];"></tr>
        </table>
      } @else {
        <p style="text-align:center;color:#999;padding:20px">Nenhum inscrito.</p>
      }
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Fechar</button>
    </mat-dialog-actions>
  `,
})
export class InscritosDialogComponent implements OnInit {
  aula: AulaAgendaItem = inject(MAT_DIALOG_DATA);
  private aulaSvc = inject(AulaService);
  inscritos = signal<Inscrito[]>([]);

  ngOnInit() {
    this.aulaSvc.listarInscritos(this.aula.idAula).subscribe(r => this.inscritos.set(r.inscritos));
  }
}
