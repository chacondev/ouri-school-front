import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface AlertDialogData {
  titulo?: string;
  mensagem: string;
  tipo?: 'erro' | 'aviso' | 'sucesso';
}

@Component({
  selector: 'app-alert-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="alert-dialog">
      <div class="alert-dialog-header" [class]="'alert-' + (data.tipo ?? 'erro')">
        <mat-icon>{{ icone }}</mat-icon>
        <h3>{{ data.titulo ?? titulo }}</h3>
      </div>
      <mat-dialog-content>
        <p>{{ data.mensagem }}</p>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-flat-button (click)="fechar()" [class]="'btn-' + (data.tipo ?? 'erro')">OK</button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .alert-dialog { min-width: 320px; max-width: 480px; }
    .alert-dialog-header { display: flex; align-items: center; gap: 12px; padding: 20px 24px 12px; border-radius: 4px 4px 0 0; }
    .alert-dialog-header h3 { margin: 0; font-size: 1.1rem; }
    .alert-erro { color: var(--red, #d32f2f); }
    .alert-aviso { color: #f57c00; }
    .alert-sucesso { color: var(--green, #388e3c); }
    mat-dialog-content p { margin: 0; font-size: 0.95rem; color: #444; line-height: 1.5; }
    mat-dialog-actions { padding: 8px 24px 16px; }
    .btn-erro { background: var(--red, #d32f2f) !important; color: #fff !important; }
    .btn-aviso { background: #f57c00 !important; color: #fff !important; }
    .btn-sucesso { background: var(--green, #388e3c) !important; color: #fff !important; }
  `],
})
export class AlertDialogComponent {
  data = inject<AlertDialogData>(MAT_DIALOG_DATA);
  private ref = inject(MatDialogRef<AlertDialogComponent>);

  get icone() {
    return this.data.tipo === 'sucesso' ? 'check_circle' : this.data.tipo === 'aviso' ? 'warning' : 'error';
  }

  get titulo() {
    return this.data.tipo === 'sucesso' ? 'Sucesso' : this.data.tipo === 'aviso' ? 'Atenção' : 'Erro';
  }

  fechar() { this.ref.close(); }
}
