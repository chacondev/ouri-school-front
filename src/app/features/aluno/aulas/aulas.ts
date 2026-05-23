import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AulaService } from '../../../core/services/aula.service';
import { InscricaoService } from '../../../core/services/inscricao.service';
import { AulaDisponivel } from '../../../core/models/aula.model';
import { AlertService } from '../../../shared/alert-dialog/alert.service';

@Component({
  selector: 'app-aulas-aluno',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatPaginatorModule, MatProgressBarModule],
  templateUrl: './aulas.html',
})
export class AulasAlunoComponent implements OnInit {
  private aulaSvc = inject(AulaService);
  private inscricaoSvc = inject(InscricaoService);
  private alert = inject(AlertService);

  aulas = signal<AulaDisponivel[]>([]);
  colunas = ['modalidade', 'professor', 'quadra', 'inicio', 'vagasDisponiveis', 'acoes'];
  carregando = signal(false);
  inscrevendo = signal<number | null>(null);
  cancelando = signal<number | null>(null);
  pagina = signal(0);
  tamanhoPagina = signal(10);
  total = signal(0);

  ngOnInit() { this.carregar(); }

  carregar() {
    this.carregando.set(true);
    this.aulaSvc.listarDisponiveis(this.pagina(), this.tamanhoPagina()).subscribe({
      next: r => { this.aulas.set(r.aulas); this.total.set(r.totalElements); this.carregando.set(false); },
      error: () => this.carregando.set(false),
    });
  }

  onPage(e: PageEvent) {
    this.pagina.set(e.pageIndex);
    this.tamanhoPagina.set(e.pageSize);
    this.carregar();
  }

  inscrever(a: AulaDisponivel) {
    this.inscrevendo.set(a.idAula);
    this.inscricaoSvc.inscrever(a.idAula).subscribe({
      next: () => { this.inscrevendo.set(null); this.alert.notificar('Inscrição realizada com sucesso!'); this.carregar(); },
      error: (e: any) => {
        this.inscrevendo.set(null);
        this.alert.erro(e?.error?.message ?? 'Não foi possível realizar a inscrição.');
      },
    });
  }

  desinscriver(a: AulaDisponivel) {
    this.alert.confirmar(`Deseja cancelar sua inscrição na aula de ${a.modalidade}?`, 'Cancelar Inscrição')
      .subscribe(confirmado => {
        if (!confirmado) return;
        this.cancelando.set(a.idAula);
        this.inscricaoSvc.cancelar(a.idInscricao!).subscribe({
          next: () => { this.cancelando.set(null); this.alert.notificar('Inscrição cancelada!'); this.carregar(); },
          error: (e: any) => {
            this.cancelando.set(null);
            this.alert.erro(e?.error?.message ?? 'Não foi possível cancelar a inscrição.');
          },
        });
      });
  }
}
