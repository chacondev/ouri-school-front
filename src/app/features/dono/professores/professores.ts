import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DonoService } from '../../../core/services/dono.service';
import { Professor } from '../../../core/models/professor.model';

@Component({
  selector: 'app-professores',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
  ],
  templateUrl: './professores.html',
})
export class ProfessoresComponent implements OnInit {
  private svc = inject(DonoService);
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);

  professores = signal<Professor[]>([]);
  colunas = ['nome', 'email', 'telefone', 'ativo', 'acoes'];
  modoForm = signal<'fechado' | 'novo' | 'editar'>('fechado');
  salvando = signal(false);

  form = this.fb.group({
    id: [null as number | null],
    nome: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    telefone: [''],
    senha: [''],
  });

  ngOnInit() { this.carregar(); }

  carregar() {
    this.svc.listarProfessores().subscribe(r => this.professores.set(r.professores));
  }

  abrirNovo() {
    this.form.reset();
    this.form.get('senha')?.setValidators(Validators.required);
    this.form.get('senha')?.updateValueAndValidity();
    this.modoForm.set('novo');
  }

  abrirEditar(p: Professor) {
    this.form.get('senha')?.clearValidators();
    this.form.get('senha')?.updateValueAndValidity();
    this.form.patchValue({ id: p.id, nome: p.nome, email: p.email, telefone: p.telefone ?? '', senha: '' });
    this.modoForm.set('editar');
  }

  fechar() { this.modoForm.set('fechado'); }

  salvar() {
    if (this.form.invalid) return;
    this.salvando.set(true);
    const v = this.form.value;

    const req$ = this.modoForm() === 'novo'
      ? this.svc.cadastrarProfessor({ nome: v.nome!, email: v.email!, senha: v.senha!, telefone: v.telefone ?? undefined })
      : this.svc.atualizarProfessor({ id: v.id!, nome: v.nome ?? undefined, email: v.email ?? undefined, telefone: v.telefone ?? undefined, senha: v.senha || undefined });

    req$.subscribe({ next: () => { this.salvando.set(false); this.fechar(); this.carregar(); }, error: () => this.salvando.set(false) });
  }

  alterarStatus(p: Professor) {
    this.svc.alterarStatusProfessor(p.id, !p.ativo).subscribe(() => this.carregar());
  }

  excluir(p: Professor) {
    if (!confirm(`Excluir professor ${p.nome}?`)) return;
    this.svc.deletarProfessor(p.id).subscribe(() => this.carregar());
  }
}
