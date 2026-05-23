import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { AlertDialogComponent, AlertDialogData } from './alert-dialog';
import { ConfirmDialogComponent, ConfirmDialogData } from './confirm-dialog';

@Injectable({ providedIn: 'root' })
export class AlertService {
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

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

  notificar(mensagem: string, duracao = 3000) {
    this.snackBar.open(mensagem, 'Fechar', {
      duration: duracao,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
    });
  }
}
