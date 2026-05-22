import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { AlertDialogComponent, AlertDialogData } from './alert-dialog';
import { ConfirmDialogComponent, ConfirmDialogData } from './confirm-dialog';

@Injectable({ providedIn: 'root' })
export class AlertService {
  private dialog = inject(MatDialog);

  erro(mensagem: string, titulo?: string) {
    this.dialog.open(AlertDialogComponent, {
      data: { mensagem, titulo, tipo: 'erro' } as AlertDialogData,
      disableClose: false,
    });
  }

  aviso(mensagem: string, titulo?: string) {
    this.dialog.open(AlertDialogComponent, {
      data: { mensagem, titulo, tipo: 'aviso' } as AlertDialogData,
    });
  }

  sucesso(mensagem: string, titulo?: string) {
    this.dialog.open(AlertDialogComponent, {
      data: { mensagem, titulo, tipo: 'sucesso' } as AlertDialogData,
    });
  }

  confirmar(mensagem: string, titulo?: string): Observable<boolean> {
    return this.dialog.open(ConfirmDialogComponent, {
      data: { mensagem, titulo } as ConfirmDialogData,
    }).afterClosed();
  }
}
