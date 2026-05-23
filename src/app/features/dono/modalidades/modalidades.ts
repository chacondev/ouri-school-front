import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ModalidadeService } from '../../../core/services/modalidade.service';
import { Modalidade } from '../../../core/models/modalidade.model';

@Component({
  selector: 'app-modalidades',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatTableModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatPaginatorModule],
  templateUrl: './modalidades.html',
})
export class ModalidadesComponent implements OnInit {
  private svc = inject(ModalidadeService);
  private fb = inject(FormBuilder);

  modalidades = signal<Modalidade[]>([]);
  colunas = ['nome', 'descricao', 'ativo', 'acoes'];
  modoForm = signal<'fechado' | 'novo' | 'editar'>('fechado');
  salvando = signal(false);
  pagina = signal(0);
  tamanhoPagina = signal(10);
  paginadas = computed(() => {
    const start = this.pagina() * this.tamanhoPagina();
    return this.modalidades().slice(start, start + this.tamanhoPagina());
  });

  form = this.fb.group({
    id: [null as number | null],
    nome: ['', Validators.required],
    descricao: [''],
  });

  ngOnInit() { this.carregar(); }

  carregar() {
    this.svc.listar().subscribe(r => this.modalidades.set(r.modalidades));
  }

  onPage(e: PageEvent) { this.pagina.set(e.pageIndex); this.tamanhoPagina.set(e.pageSize); }

  abrirNovo() { this.form.reset(); this.modoForm.set('novo'); }

  abrirEditar(m: Modalidade) {
    this.form.patchValue({ id: m.id, nome: m.nome, descricao: m.descricao ?? '' });
    this.modoForm.set('editar');
  }

  fechar() { this.modoForm.set('fechado'); }

  salvar() {
    if (this.form.invalid) return;
    this.salvando.set(true);
    const v = this.form.value;

    const req$ = this.modoForm() === 'novo'
      ? this.svc.cadastrar({ nome: v.nome!, descricao: v.descricao ?? undefined })
      : this.svc.atualizar({ id: v.id!, nome: v.nome!, descricao: v.descricao ?? undefined });

    req$.subscribe({ next: () => { this.salvando.set(false); this.fechar(); this.carregar(); }, error: () => this.salvando.set(false) });
  }

  alterarStatus(m: Modalidade) {
    this.svc.alterarStatus(m.id, !m.ativo).subscribe(() => this.carregar());
  }

  excluir(m: Modalidade) {
    if (!confirm(`Excluir modalidade ${m.nome}?`)) return;
    this.svc.deletar(m.id).subscribe(() => this.carregar());
  }
}
