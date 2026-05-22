import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { QuadraService } from '../../../core/services/quadra.service';
import { Quadra } from '../../../core/models/quadra.model';

@Component({
  selector: 'app-quadras',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatTableModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './quadras.html',
})
export class QuadrasComponent implements OnInit {
  private svc = inject(QuadraService);
  private fb = inject(FormBuilder);

  quadras = signal<Quadra[]>([]);
  colunas = ['nome', 'tipo', 'descricao', 'ativa', 'acoes'];
  modoForm = signal<'fechado' | 'novo' | 'editar'>('fechado');
  salvando = signal(false);
  erro = signal('');

  tipos = ['Society', 'Poliesportiva', 'Natação', 'Tênis', 'Basquete', 'Outro'];

  form = this.fb.group({
    id: [null as number | null],
    nome: ['', Validators.required],
    tipo: ['', Validators.required],
    descricao: [''],
  });

  ngOnInit() { this.carregar(); }

  carregar() {
    this.svc.listar().subscribe(r => this.quadras.set(r.quadras));
  }

  abrirNovo() { this.form.reset(); this.erro.set(''); this.modoForm.set('novo'); }

  abrirEditar(q: Quadra) {
    this.form.patchValue({ id: q.id, nome: q.nome, tipo: q.tipo, descricao: q.descricao ?? '' });
    this.erro.set('');
    this.modoForm.set('editar');
  }

  fechar() { this.modoForm.set('fechado'); this.erro.set(''); }

  salvar() {
    if (this.form.invalid) return;
    this.salvando.set(true);
    this.erro.set('');
    const v = this.form.value;

    const req$ = this.modoForm() === 'novo'
      ? this.svc.cadastrar({ nome: v.nome!, tipo: v.tipo!, descricao: v.descricao ?? undefined, ativa: true })
      : this.svc.atualizar({ id: v.id!, nome: v.nome!, tipo: v.tipo!, descricao: v.descricao ?? undefined, ativa: true });

    req$.subscribe({
      next: () => { this.salvando.set(false); this.fechar(); this.carregar(); },
      error: (e: any) => { this.salvando.set(false); this.erro.set(e?.error?.message ?? 'Erro ao salvar quadra.'); }
    });
  }

  alterarStatus(q: Quadra) {
    this.svc.alterarStatus(q.id, !q.ativa).subscribe(() => this.carregar());
  }

  excluir(q: Quadra) {
    if (!confirm(`Excluir quadra ${q.nome}?`)) return;
    this.svc.deletar(q.id).subscribe(() => this.carregar());
  }
}
