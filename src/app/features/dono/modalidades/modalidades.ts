import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ModalidadeService } from '../../../core/services/modalidade.service';
import { Modalidade } from '../../../core/models/modalidade.model';
import { AlertService } from '../../../shared/alert-dialog/alert.service';

@Component({
  selector: 'app-modalidades',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatTableModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatPaginatorModule, MatProgressBarModule],
  templateUrl: './modalidades.html',
})
export class ModalidadesComponent implements OnInit {
  private svc = inject(ModalidadeService);
  private fb = inject(FormBuilder);
  private alert = inject(AlertService);

  modalidades = signal<Modalidade[]>([]);
  colunas = ['nome', 'descricao', 'ativo', 'acoes'];
  modoForm = signal<'fechado' | 'novo' | 'editar'>('fechado');
  salvando = signal(false);
  pagina = signal(0);
  tamanhoPagina = signal(10);
  carregando = signal(false);
  termoBusca = signal('');
  filtradas = computed(() => {
    const t = this.termoBusca().toLowerCase();
    return t ? this.modalidades().filter(m => m.nome.toLowerCase().includes(t)) : this.modalidades();
  });
  paginadas = computed(() => {
    const start = this.pagina() * this.tamanhoPagina();
    return this.filtradas().slice(start, start + this.tamanhoPagina());
  });

  form = this.fb.group({
    id: [null as number | null],
    nome: ['', Validators.required],
    descricao: [''],
  });

  ngOnInit() { this.carregar(); }

  carregar() {
    this.carregando.set(true);
    this.svc.listar().subscribe({
      next: r => { this.modalidades.set(r.modalidades); this.carregando.set(false); },
      error: () => this.carregando.set(false),
    });
  }

  onBusca(termo: string) { this.termoBusca.set(termo); this.pagina.set(0); }

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

    req$.subscribe({
      next: () => {
        this.salvando.set(false);
        this.alert.notificar(this.modoForm() === 'novo' ? 'Modalidade cadastrada com sucesso!' : 'Modalidade atualizada com sucesso!');
        this.fechar();
        this.carregar();
      },
      error: () => this.salvando.set(false),
    });
  }

  alterarStatus(m: Modalidade) {
    this.svc.alterarStatus(m.id, !m.ativo).subscribe(() => {
      this.alert.notificar(`Modalidade ${m.ativo ? 'desativada' : 'ativada'} com sucesso!`);
      this.carregar();
    });
  }

  excluir(m: Modalidade) {
    this.alert.confirmar(`Excluir modalidade ${m.nome}? Esta ação não pode ser desfeita.`, 'Excluir Modalidade')
      .subscribe(ok => {
        if (ok) this.svc.deletar(m.id).subscribe(() => {
          this.alert.notificar('Modalidade excluída com sucesso!');
          this.carregar();
        });
      });
  }
}
