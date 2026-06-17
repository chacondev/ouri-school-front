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
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { DonoService } from '../../../core/services/dono.service';
import { AulaService } from '../../../core/services/aula.service';
import { AlertService } from '../../../shared/alert-dialog/alert.service';
import { AulaAgendaItem, DadosCriacaoAula } from '../../../core/models/aula.model';
import { InscritosDialogComponent } from './inscritos-dialog';

@Component({
  selector: 'app-aulas-dono',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatTableModule, MatButtonModule, MatIconModule, MatMenuModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatDialogModule,
    MatPaginatorModule, MatButtonToggleModule, MatProgressBarModule,
    MatDatepickerModule, MatTimepickerModule,
  ],
  templateUrl: './aulas.html',
})
export class AulasDonoComponent implements OnInit {
  private donoSvc = inject(DonoService);
  private aulaSvc = inject(AulaService);
  private alert = inject(AlertService);
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);

  aulas = signal<AulaAgendaItem[]>([]);
  dadosCriacao = signal<DadosCriacaoAula | null>(null);
  colunas = ['modalidade', 'professor', 'quadra', 'inicio', 'fim', 'limiteAlunos', 'status', 'acoes'];
  modoForm = signal(false);
  salvando = signal(false);
  carregando = signal(false);
  pagina = signal(0);
  tamanhoPagina = signal(10);
  total = signal(0);
  filtroStatus = signal<string>('');
  hoje = new Date();

  form = this.fb.group({
    idModalidade: [null as number | null, Validators.required],
    idQuadra:     [null as number | null, Validators.required],
    idProfessor:  [null as number | null, Validators.required],
    data:         [null as Date | null, Validators.required],
    horaInicio:   [null as Date | null, Validators.required],
    horaFim:      [null as Date | null, Validators.required],
    limiteAlunos: [null as number | null, [Validators.required, Validators.min(1)]],
  });

  ngOnInit() {
    this.carregar();
    this.aulaSvc.obterDadosCriacao().subscribe(d => this.dadosCriacao.set(d));
  }

  carregar() {
    this.carregando.set(true);
    this.donoSvc.listarAulas(this.pagina(), this.tamanhoPagina(), this.filtroStatus() || undefined).subscribe({
      next: r => { this.aulas.set(r.aulas); this.total.set(r.totalElements); this.carregando.set(false); },
      error: () => this.carregando.set(false),
    });
  }

  onPage(e: PageEvent) {
    this.pagina.set(e.pageIndex);
    this.tamanhoPagina.set(e.pageSize);
    this.carregar();
  }

  onFiltroStatus(status: string) {
    this.filtroStatus.set(status);
    this.pagina.set(0);
    this.carregar();
  }

  abrirNovo() { this.form.reset(); this.modoForm.set(true); }
  fechar() { this.modoForm.set(false); }

  private combinarDataHora(data: Date, hora: Date): string {
    const d = new Date(data);
    d.setHours(hora.getHours(), hora.getMinutes(), 0, 0);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:00`;
  }

  salvar() {
    if (this.form.invalid) return;
    this.salvando.set(true);
    const v = this.form.value;
    this.aulaSvc.criarAula({
      idModalidade: v.idModalidade!,
      idQuadra: v.idQuadra!,
      idProfessor: v.idProfessor ?? undefined,
      inicio: this.combinarDataHora(v.data!, v.horaInicio!),
      fim: this.combinarDataHora(v.data!, v.horaFim!),
      limiteAlunos: v.limiteAlunos!,
    }).subscribe({
      next: () => {
        this.salvando.set(false);
        this.alert.notificar('Aula criada com sucesso!');
        this.fechar();
        this.carregar();
      },
      error: () => this.salvando.set(false),
    });
  }

  verInscritos(aula: AulaAgendaItem) {
    this.dialog.open(InscritosDialogComponent, { data: aula, width: '500px' });
  }

  aulaTerminou(a: AulaAgendaItem): boolean {
    return new Date() > new Date(a.fim);
  }

  realizarAula(aula: AulaAgendaItem) {
    if (!this.aulaTerminou(aula)) {
      this.alert.erro('A aula só pode ser marcada como realizada após o horário de término.');
      return;
    }
    this.alert.confirmar(`Confirmar que a aula de ${aula.modalidade} foi realizada?`, 'Marcar como Realizada')
      .subscribe(ok => {
        if (!ok) return;
        this.aulaSvc.realizarAulaDono(aula.idAula).subscribe({
          next: () => { this.alert.notificar('Aula marcada como realizada!'); this.carregar(); },
          error: (e: any) => this.alert.erro(e?.error?.message ?? 'Não foi possível realizar a aula.'),
        });
      });
  }

  cancelarAula(aula: AulaAgendaItem) {
    this.alert.confirmar(`Cancelar a aula de ${aula.modalidade}? Todas as inscrições ativas serão canceladas.`, 'Cancelar Aula')
      .subscribe(ok => {
        if (!ok) return;
        this.aulaSvc.cancelarAulaDono(aula.idAula).subscribe({
          next: () => { this.alert.notificar('Aula cancelada com sucesso!'); this.carregar(); },
          error: (e: any) => this.alert.erro(e?.error?.message ?? 'Não foi possível cancelar a aula.'),
        });
      });
  }

  statusClass(status: string) {
    const map: Record<string, string> = { AGENDADA: 'badge-blue', REALIZADA: 'badge-green', CANCELADA: 'badge-red' };
    return 'badge ' + (map[status] ?? 'badge-gray');
  }

  avatarClass(status: string) {
    const map: Record<string, string> = { AGENDADA: 'avatar-agendada', REALIZADA: 'avatar-realizada', CANCELADA: 'avatar-cancelada' };
    return 'pessoa-avatar ' + (map[status] ?? 'avatar-agendada');
  }
}
