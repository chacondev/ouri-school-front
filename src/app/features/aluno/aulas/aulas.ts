import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AulaService } from '../../../core/services/aula.service';
import { InscricaoService } from '../../../core/services/inscricao.service';
import { AulaDisponivel } from '../../../core/models/aula.model';

@Component({
  selector: 'app-aulas-aluno',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule],
  templateUrl: './aulas.html',
})
export class AulasAlunoComponent implements OnInit {
  private aulaSvc = inject(AulaService);
  private inscricaoSvc = inject(InscricaoService);

  aulas = signal<AulaDisponivel[]>([]);
  colunas = ['modalidade', 'professor', 'quadra', 'inicio', 'vagasDisponiveis', 'acoes'];
  inscrevendo = signal<number | null>(null);

  ngOnInit() { this.carregar(); }

  carregar() {
    this.aulaSvc.listarDisponiveis().subscribe(r => this.aulas.set(r.aulas));
  }

  inscrever(a: AulaDisponivel) {
    this.inscrevendo.set(a.idAula);
    this.inscricaoSvc.inscrever(a.idAula).subscribe({
      next: () => { this.inscrevendo.set(null); this.carregar(); },
      error: () => this.inscrevendo.set(null),
    });
  }
}
