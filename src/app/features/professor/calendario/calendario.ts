import { Component, inject, signal, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventClickArg, DatesSetArg, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { ProfessorService } from '../../../core/services/professor.service';
import { AulaAgendaItem } from '../../../core/models/aula.model';
import { InscritosDialogComponent } from '../../dono/aulas/inscritos-dialog';

const STATUS_COLORS: Record<string, string> = {
  AGENDADA: '#1976d2',
  REALIZADA: '#388e3c',
  CANCELADA: '#d32f2f',
};

@Component({
  selector: 'app-calendario-professor',
  standalone: true,
  imports: [CommonModule, FullCalendarModule, MatDialogModule],
  templateUrl: './calendario.html',
})
export class CalendarioProfessorComponent implements OnInit {
  private svc = inject(ProfessorService);
  private dialog = inject(MatDialog);
  private cdr = inject(ChangeDetectorRef);

  private aulasCache = signal<AulaAgendaItem[]>([]);

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    locale: ptBrLocale,
    initialView: 'timeGridWeek',
    headerToolbar: {
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
    buttonText: { today: 'Hoje', month: 'Mês', week: 'Semana', day: 'Dia' },
  };

  ngOnInit() {}

  carregarPeriodo(info: DatesSetArg) {
    const dataInicio = this.toDateStr(info.start);
    const dataFim = this.toDateStr(info.end);

    this.svc.calendario(dataInicio, dataFim).subscribe(r => {
      this.aulasCache.set(r.aulas);
      const events: EventInput[] = r.aulas.map(a => ({
        id: String(a.idAula),
        title: `${a.modalidade} — ${a.quadra}`,
        start: a.inicio,
        end: a.fim,
        backgroundColor: STATUS_COLORS[a.status] ?? '#607d8b',
        borderColor: STATUS_COLORS[a.status] ?? '#607d8b',
        extendedProps: { aula: a },
      }));
      this.calendarOptions = { ...this.calendarOptions, events };
      this.cdr.detectChanges();
    });
  }

  onEventClick(info: EventClickArg) {
    const aula = info.event.extendedProps['aula'] as AulaAgendaItem;
    this.dialog.open(InscritosDialogComponent, { data: aula, width: '500px' });
  }

  private toDateStr(d: Date): string {
    return d.toISOString().split('T')[0];
  }
}
