import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AlunoService } from '../../../core/services/aluno.service';
import { InscricaoService } from '../../../core/services/inscricao.service';
import { DashboardAlunoResponse } from '../../../core/models/dashboard.model';
import { Inscricao } from '../../../core/models/inscricao.model';

@Component({
  selector: 'app-dashboard-aluno',
  standalone: true,
  imports: [CommonModule, RouterLink, MatTableModule, MatButtonModule, MatIconModule],
  templateUrl: './dashboard.html',
})
export class DashboardAlunoComponent implements OnInit {
  private alunoSvc = inject(AlunoService);
  private inscricaoSvc = inject(InscricaoService);

  dashboard = signal<DashboardAlunoResponse | null>(null);
  inscricoes = signal<Inscricao[]>([]);
  colunas = ['modalidade', 'professor', 'dataHoraInicio', 'acoes'];

  ngOnInit() {
    this.alunoSvc.dashboard().subscribe(d => this.dashboard.set(d));
    this.inscricaoSvc.minhasInscricoes().subscribe(r => this.inscricoes.set(r.inscricoes));
  }

  cancelarInscricao(i: Inscricao) {
    if (!confirm(`Cancelar inscrição na aula de ${i.modalidade}?`)) return;
    this.inscricaoSvc.cancelar(i.id).subscribe(() => {
      this.inscricaoSvc.minhasInscricoes().subscribe(r => this.inscricoes.set(r.inscricoes));
      this.alunoSvc.dashboard().subscribe(d => this.dashboard.set(d));
    });
  }
}
