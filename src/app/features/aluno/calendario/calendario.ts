import { Component, inject, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventClickArg, DatesSetArg, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AlunoService } from '../../../core/services/aluno.service';
import { HistoricoAulaAlunoItem } from '../../../core/models/historico.model';
import { AulaDetalheAlunoDialogComponent } from './aula-detalhe-dialog';

const STATUS_COLORS: Record<string, string> = {
  AGENDADA: '#1976d2',
  REALIZADA: '#388e3c',
  CANCELADA: '#d32f2f',
};

@Component({
  selector: 'app-calendario-aluno',
  standalone: true,
  imports: [CommonModule, FullCalendarModule, MatDialogModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './calendario.html',
})
export class CalendarioAlunoComponent {
  private svc = inject(AlunoService);
  private dialog = inject(MatDialog);
  private cdr = inject(ChangeDetectorRef);

  loading = signal(false);

  private readonly mobile = typeof window !== 'undefined' && window.innerWidth <= 768;

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
    locale: ptBrLocale,
    initialView: this.mobile ? 'listWeek' : 'timeGridWeek',
    headerToolbar: this.mobile ? {
      left: 'prev,next',
      center: 'title',
      right: 'today',
    } : {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay',
    },
    slotMinTime: '06:00:00',
    slotMaxTime: '23:00:00',
    allDaySlot: false,
    height: 'auto',
    eventClick: (info: EventClickArg) => this.onEventClick(info),
    datesSet: (info: DatesSetArg) => this.carregarPeriodo(info),
    events: [],
    eventTimeFormat: { hour: '2-digit', minute: '2-digit', hour12: false },
    slotLabelFormat: { hour: '2-digit', minute: '2-digit', hour12: false },
    buttonText: { today: 'Hoje', month: 'Mês', week: 'Semana', day: 'Dia', list: 'Lista' },
  };

  carregarPeriodo(info: DatesSetArg) {
    const dataInicio = info.start.toISOString().split('T')[0];
    const dataFim = info.end.toISOString().split('T')[0];

    this.loading.set(true);
    this.svc.calendario(dataInicio, dataFim).subscribe(r => {
      const events: EventInput[] = r.historico.map(a => ({
        id: String(a.idAula),
        title: `${a.modalidade} — ${a.professor}`,
        start: a.inicio,
        end: a.fim,
        backgroundColor: STATUS_COLORS[a.statusAula] ?? '#607d8b',
        borderColor: STATUS_COLORS[a.statusAula] ?? '#607d8b',
        extendedProps: { aula: a },
      }));

      setTimeout(() => {
        this.calendarOptions = { ...this.calendarOptions, events };
        this.loading.set(false);
        this.cdr.detectChanges();
      }, 0);
    });
  }

  onEventClick(info: EventClickArg) {
    const aula = info.event.extendedProps['aula'] as HistoricoAulaAlunoItem;
    this.dialog.open(AulaDetalheAlunoDialogComponent, { data: aula, width: '420px' });
  }
}
