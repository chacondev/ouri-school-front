import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { DonoService } from '../../../core/services/dono.service';
import { AulaService } from '../../../core/services/aula.service';
import { Aula, DadosCriacaoAula } from '../../../core/models/aula.model';
import { InscritosDialogComponent } from './inscritos-dialog';

@Component({
  selector: 'app-aulas-dono',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatTableModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatDialogModule,
  ],
  templateUrl: './aulas.html',
})
export class AulasDonoComponent implements OnInit {
  private donoSvc = inject(DonoService);
  private aulaSvc = inject(AulaService);
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);

  aulas = signal<Aula[]>([]);
  dadosCriacao = signal<DadosCriacaoAula | null>(null);
  colunas = ['modalidade', 'professor', 'quadra', 'dataHoraInicio', 'dataHoraFim', 'capacidade', 'status', 'acoes'];
  modoForm = signal(false);
  salvando = signal(false);

  form = this.fb.group({
    idModalidade: [null as number | null, Validators.required],
    idQuadra: [null as number | null, Validators.required],
    idProfessor: [null as number | null, Validators.required],
    dataHoraInicio: ['', Validators.required],
    dataHoraFim: ['', Validators.required],
    capacidade: [null as number | null, [Validators.required, Validators.min(1)]],
  });

  ngOnInit() {
    this.carregar();
    this.aulaSvc.obterDadosCriacao().subscribe(d => this.dadosCriacao.set(d));
  }

  carregar() {
    this.donoSvc.listarAulas().subscribe(r => this.aulas.set(r.aulas));
  }

  abrirNovo() { this.form.reset(); this.modoForm.set(true); }
  fechar() { this.modoForm.set(false); }

  salvar() {
    if (this.form.invalid) return;
    this.salvando.set(true);
    const v = this.form.value;
    this.aulaSvc.criarAula({
      idModalidade: v.idModalidade!,
      idQuadra: v.idQuadra!,
      idProfessor: v.idProfessor ?? undefined,
      dataHoraInicio: v.dataHoraInicio!,
      dataHoraFim: v.dataHoraFim!,
      capacidade: v.capacidade!,
    }).subscribe({
      next: () => { this.salvando.set(false); this.fechar(); this.carregar(); },
      error: () => this.salvando.set(false),
    });
  }

  verInscritos(aula: Aula) {
    this.dialog.open(InscritosDialogComponent, { data: aula, width: '500px' });
  }

  statusClass(status: string) {
    const map: Record<string, string> = { AGENDADA: 'badge-blue', REALIZADA: 'badge-green', CANCELADA: 'badge-red' };
    return 'badge ' + (map[status] ?? 'badge-gray');
  }
}
