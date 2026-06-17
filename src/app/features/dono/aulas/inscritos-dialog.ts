import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AulaService } from '../../../core/services/aula.service';
import { AulaAgendaItem } from '../../../core/models/aula.model';
import { Inscrito } from '../../../core/models/inscricao.model';

@Component({
  selector: 'app-inscritos-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, MatProgressBarModule],
  styles: [`
    .dialog-header-info {
      display: flex;
      flex-direction: column;
      gap: 6px;
      background: var(--light-gray);
      border-radius: 8px;
      padding: 14px 16px;
      margin-bottom: 16px;
    }
    .header-info-row {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.875rem;
      color: var(--text-secondary);
    }
    .header-info-row mat-icon {
      font-size: 17px;
      width: 17px;
      height: 17px;
      line-height: 17px;
      flex-shrink: 0;
    }
    .ocupacao-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 2px;
    }
    .ocupacao-label {
      font-size: 0.78rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      color: var(--text-secondary);
    }
    .ocupacao-count {
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--text-primary);
    }
    mat-progress-bar { margin-top: 6px; border-radius: 4px; }

    .aluno-list { display: flex; flex-direction: column; gap: 2px; }
    .aluno-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 8px;
      border-radius: 8px;
      transition: background 0.15s;
    }
    .aluno-item:hover { background: var(--light-gray); }
    .aluno-item + .aluno-item { border-top: 1px solid var(--border-color); }

    .aluno-avatar {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: var(--navy-dark);
      color: #fff;
      font-weight: 700;
      font-size: 0.95rem;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      letter-spacing: 0.5px;
    }
    .aluno-info { flex: 1; min-width: 0; }
    .aluno-nome {
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .aluno-email {
      font-size: 0.78rem;
      color: var(--text-secondary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .aluno-data {
      font-size: 0.75rem;
      color: var(--text-secondary);
      white-space: nowrap;
      flex-shrink: 0;
    }
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 32px 16px;
      color: var(--text-secondary);
      gap: 8px;
    }
    .empty-state mat-icon { font-size: 40px; width: 40px; height: 40px; opacity: 0.4; }
    .empty-state p { font-size: 0.9rem; margin: 0; }
  `],
  template: `
    <h2 mat-dialog-title>
      <div style="display:flex;align-items:center;gap:8px">
        <mat-icon style="color:var(--navy-dark)">groups</mat-icon>
        Inscritos — {{ aula.modalidade }}
      </div>
    </h2>

    <mat-dialog-content style="min-width:420px;max-width:520px">

      <!-- Info da aula -->
      <div class="dialog-header-info">
        <div class="header-info-row">
          <mat-icon>calendar_today</mat-icon>
          <span>{{ aula.inicio | date:'dd/MM/yyyy' }} &nbsp;·&nbsp; {{ aula.inicio | date:'HH:mm' }} – {{ aula.fim | date:'HH:mm' }}</span>
        </div>
        <div class="header-info-row">
          <mat-icon>location_on</mat-icon>
          <span>{{ aula.quadra }}</span>
        </div>
        <div class="header-info-row">
          <mat-icon>person</mat-icon>
          <span>{{ aula.professor }}</span>
        </div>

        <!-- Ocupação -->
        <div style="margin-top:6px">
          <div class="ocupacao-row">
            <span class="ocupacao-label">Ocupação</span>
            <span class="ocupacao-count">{{ inscritos().length }} / {{ aula.limiteAlunos }}</span>
          </div>
          <mat-progress-bar
            mode="determinate"
            [value]="(inscritos().length / aula.limiteAlunos) * 100">
          </mat-progress-bar>
        </div>
      </div>

      <!-- Lista de alunos -->
      @if (inscritos().length > 0) {
        <div class="aluno-list">
          @for (a of inscritos(); track a.idAluno) {
            <div class="aluno-item">
              <div class="aluno-avatar">{{ iniciais(a.nome) }}</div>
              <div class="aluno-info">
                <div class="aluno-nome">{{ a.nome }}</div>
                <div class="aluno-email">{{ a.email }}</div>
              </div>
              <div class="aluno-data">
                <mat-icon style="font-size:13px;width:13px;height:13px;vertical-align:middle;margin-right:2px">event</mat-icon>
                {{ a.dataInscricao | date:'dd/MM/yy' }}
              </div>
            </div>
          }
        </div>
      } @else {
        <div class="empty-state">
          <mat-icon>person_off</mat-icon>
          <p>Nenhum aluno inscrito nesta aula.</p>
        </div>
      }

    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-stroked-button mat-dialog-close>Fechar</button>
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

  iniciais(nome: string): string {
    return nome.trim().split(/\s+/).slice(0, 2).map(p => p[0]).join('').toUpperCase();
  }
}
