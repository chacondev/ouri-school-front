import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmDialogData {
  titulo?: string;
  mensagem: string;
  textoCancelar?: string;
  textoConfirmar?: string;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="alert-dialog">
      <div class="alert-dialog-header" style="color:#1565c0">
        <mat-icon>help_outline</mat-icon>
        <h3>{{ data.titulo ?? 'Confirmação' }}</h3>
      </div>
      <mat-dialog-content>
        <p>{{ data.mensagem }}</p>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-stroked-button (click)="responder(false)">{{ data.textoCancelar ?? 'Cancelar' }}</button>
        <button mat-flat-button style="background:#1565c0;color:#fff;margin-left:8px" (click)="responder(true)">
          {{ data.textoConfirmar ?? 'Confirmar' }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .alert-dialog { min-width: 320px; max-width: 480px; }
    .alert-dialog-header { display: flex; align-items: center; gap: 12px; padding: 20px 24px 12px; }
    .alert-dialog-header h3 { margin: 0; font-size: 1.1rem; }
    mat-dialog-content p { margin: 0; font-size: 0.95rem; color: #444; line-height: 1.5; }
    mat-dialog-actions { padding: 8px 24px 16px; }
  `],
})
export class ConfirmDialogComponent {
  data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);
  private ref = inject(MatDialogRef<ConfirmDialogComponent>);
  responder(ok: boolean) { this.ref.close(ok); }
}
