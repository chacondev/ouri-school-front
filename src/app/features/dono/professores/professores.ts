import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { DonoService } from '../../../core/services/dono.service';
import { Professor } from '../../../core/models/professor.model';
import { CryptoService } from '../../../core/services/crypto.service';

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
    MatPaginatorModule,
  ],
  templateUrl: './professores.html',
})
export class ProfessoresComponent implements OnInit {
  private svc = inject(DonoService);
  private fb = inject(FormBuilder);
  private crypto = inject(CryptoService);

  professores = signal<Professor[]>([]);
  colunas = ['nome', 'email', 'telefone', 'ativo', 'acoes'];
  modoForm = signal<'fechado' | 'novo' | 'editar'>('fechado');
  salvando = signal(false);
  erro = signal('');
  pagina = signal(0);
  tamanhoPagina = signal(10);
  total = signal(0);

  form = this.fb.group({
    id: [null as number | null],
    nome: ['', Validators.required],
    cpf: [''],
    email: ['', [Validators.required, Validators.email]],
    telefone: [''],
    senha: [''],
  });

  ngOnInit() { this.carregar(); }

  carregar() {
    this.svc.listarProfessores(this.pagina(), this.tamanhoPagina()).subscribe(r => {
      this.professores.set(r.professores);
      this.total.set(r.totalElements);
    });
  }

  onPage(e: PageEvent) {
    this.pagina.set(e.pageIndex);
    this.tamanhoPagina.set(e.pageSize);
    this.carregar();
  }

  abrirNovo() {
    this.form.reset();
    this.erro.set('');
    this.form.get('cpf')?.setValidators(Validators.required);
    this.form.get('cpf')?.updateValueAndValidity();
    this.form.get('senha')?.setValidators(Validators.required);
    this.form.get('senha')?.updateValueAndValidity();
    this.modoForm.set('novo');
  }

  abrirEditar(p: Professor) {
    this.form.get('cpf')?.clearValidators();
    this.form.get('cpf')?.updateValueAndValidity();
    this.form.get('senha')?.clearValidators();
    this.form.get('senha')?.updateValueAndValidity();
    this.form.patchValue({ id: p.id, nome: p.nome, cpf: p.cpf, email: p.email, telefone: p.telefone ?? '', senha: '' });
    this.modoForm.set('editar');
  }

  fechar() { this.modoForm.set('fechado'); this.erro.set(''); }

  async salvar() {
    if (this.form.invalid) return;
    this.salvando.set(true);
    this.erro.set('');
    const v = this.form.value;

    let req$;
    if (this.modoForm() === 'novo') {
      const senhaCriptografada = await this.crypto.criptografar(v.senha!);
      req$ = this.svc.cadastrarProfessor({ nome: v.nome!, cpf: v.cpf!, email: v.email!, senha: senhaCriptografada, telefone: v.telefone ?? undefined, ativo: true });
    } else {
      const senhaCriptografada = v.senha ? await this.crypto.criptografar(v.senha) : undefined;
      req$ = this.svc.atualizarProfessor({ id: v.id!, nome: v.nome ?? undefined, email: v.email ?? undefined, telefone: v.telefone ?? undefined, senha: senhaCriptografada });
    }

    req$.subscribe({
      next: () => { this.salvando.set(false); this.fechar(); this.carregar(); },
      error: (e: any) => {
        this.salvando.set(false);
        this.erro.set(e?.error?.message ?? 'Erro ao salvar professor.');
      }
    });
  }

  alterarStatus(p: Professor) {
    this.svc.alterarStatusProfessor(p.id, !p.ativo).subscribe(() => this.carregar());
  }

  excluir(p: Professor) {
    if (!confirm(`Excluir professor ${p.nome}?`)) return;
    this.svc.deletarProfessor(p.id).subscribe(() => this.carregar());
  }
}
