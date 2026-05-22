import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AlunoService } from '../../../core/services/aluno.service';
import { InscricaoService } from '../../../core/services/inscricao.service';
import { DashboardAlunoResponse } from '../../../core/models/dashboard.model';
import { MinhaInscricao } from '../../../core/models/inscricao.model';
import { AlertService } from '../../../shared/alert-dialog/alert.service';

@Component({
  selector: 'app-dashboard-aluno',
  standalone: true,
  imports: [CommonModule, RouterLink, MatTableModule, MatButtonModule, MatIconModule],
  templateUrl: './dashboard.html',
})
export class DashboardAlunoComponent implements OnInit {
  private alunoSvc = inject(AlunoService);
  private inscricaoSvc = inject(InscricaoService);
  private alert = inject(AlertService);

  dashboard = signal<DashboardAlunoResponse | null>(null);
  inscricoes = signal<MinhaInscricao[]>([]);
  colunas = ['modalidade', 'professor', 'inicio', 'acoes'];
  cancelando = signal<number | null>(null);

  ngOnInit() {
    this.alunoSvc.dashboard().subscribe(d => this.dashboard.set(d));
    this.inscricaoSvc.minhasInscricoes().subscribe(r => this.inscricoes.set(r.inscricoes));
  }

  recarregar() {
    this.inscricaoSvc.minhasInscricoes().subscribe(r => this.inscricoes.set(r.inscricoes));
    this.alunoSvc.dashboard().subscribe(d => this.dashboard.set(d));
  }

  cancelarInscricao(i: MinhaInscricao) {
    this.alert.confirmar(`Deseja cancelar sua inscrição na aula de ${i.modalidade}?`, 'Cancelar Inscrição')
      .subscribe(confirmado => {
        if (!confirmado) return;
        this.cancelando.set(i.idInscricao);
        this.inscricaoSvc.cancelar(i.idInscricao).subscribe({
          next: () => { this.cancelando.set(null); this.recarregar(); },
          error: (e: any) => {
            this.cancelando.set(null);
            this.alert.erro(e?.error?.message ?? 'Não foi possível cancelar a inscrição.');
          },
        });
      });
  }
}
