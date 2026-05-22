import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AulaService } from '../../../core/services/aula.service';
import { InscricaoService } from '../../../core/services/inscricao.service';
import { Aula } from '../../../core/models/aula.model';

@Component({
  selector: 'app-aulas-aluno',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule],
  templateUrl: './aulas.html',
})
export class AulasAlunoComponent implements OnInit {
  private aulaSvc = inject(AulaService);
  private inscricaoSvc = inject(InscricaoService);

  aulas = signal<Aula[]>([]);
  colunas = ['modalidade', 'professor', 'quadra', 'dataHoraInicio', 'vagasDisponiveis', 'acoes'];
  inscrevendo = signal<number | null>(null);

  ngOnInit() { this.carregar(); }

  carregar() {
    this.aulaSvc.listarDisponiveis().subscribe(r => this.aulas.set(r.aulas));
  }

  inscrever(a: Aula) {
    this.inscrevendo.set(a.id);
    this.inscricaoSvc.inscrever(a.id).subscribe({
      next: () => { this.inscrevendo.set(null); this.carregar(); },
      error: () => this.inscrevendo.set(null),
    });
  }
}
