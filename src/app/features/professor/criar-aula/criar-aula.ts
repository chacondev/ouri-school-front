import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { AulaService } from '../../../core/services/aula.service';
import { DadosCriacaoAula } from '../../../core/models/aula.model';

@Component({
  selector: 'app-criar-aula-professor',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatIconModule,
    MatDatepickerModule, MatTimepickerModule,
  ],
  templateUrl: './criar-aula.html',
})
export class CriarAulaProfessorComponent implements OnInit {
  private aulaSvc = inject(AulaService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  dados = signal<DadosCriacaoAula | null>(null);
  salvando = signal(false);
  erro = signal('');
  hoje = new Date();

  form = this.fb.group({
    idModalidade: [null as number | null, Validators.required],
    idQuadra: [null as number | null, Validators.required],
    data: [null as Date | null, Validators.required],
    horaInicio: [null as Date | null, Validators.required],
    horaFim: [null as Date | null, Validators.required],
    limiteAlunos: [null as number | null, [Validators.required, Validators.min(1)]],
    descricao: [''],
  });

  ngOnInit() {
    this.aulaSvc.obterDadosCriacao().subscribe(d => this.dados.set(d));
  }

  private combinarDataHora(data: Date, hora: Date): string {
    const d = new Date(data);
    d.setHours(hora.getHours(), hora.getMinutes(), 0, 0);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:00`;
  }

  salvar() {
    if (this.form.invalid) return;
    this.salvando.set(true);
    this.erro.set('');
    const v = this.form.value;

    const inicio = this.combinarDataHora(v.data!, v.horaInicio!);
    const fim = this.combinarDataHora(v.data!, v.horaFim!);

    this.aulaSvc.criarAula({
      idModalidade: v.idModalidade!,
      idQuadra: v.idQuadra!,
      inicio,
      fim,
      limiteAlunos: v.limiteAlunos!,
      descricao: v.descricao || undefined,
    }).subscribe({
      next: () => this.router.navigate(['/professor/agenda']),
      error: (err) => {
        this.salvando.set(false);
        this.erro.set(err?.error?.message ?? 'Erro ao criar aula.');
      },
    });
  }
}
