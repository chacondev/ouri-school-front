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
import { DonoService } from '../../../core/services/dono.service';
import { AulaAgendaItem } from '../../../core/models/aula.model';
import { InscritosDialogComponent } from '../aulas/inscritos-dialog';

const PROFESSOR_COLORS = [
  '#1976d2', '#388e3c', '#f57c00', '#7b1fa2',
  '#0097a7', '#c62828', '#5d4037', '#455a64',
];

@Component({
  selector: 'app-calendario-dono',
  standalone: true,
  imports: [CommonModule, FullCalendarModule, MatDialogModule],
  templateUrl: './calendario.html',
})
export class CalendarioDonoComponent {
  private svc = inject(DonoService);
  private dialog = inject(MatDialog);
  private cdr = inject(ChangeDetectorRef);

  professoresLegenda = signal<{ nome: string; cor: string }[]>([]);

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
    this.svc.calendarioAulas(dataInicio, dataFim).subscribe(r => {
      const colorMap = new Map<string, string>();
      let idx = 0;

      const events: EventInput[] = r.aulas.map(a => {
        if (!colorMap.has(a.professor)) {
          colorMap.set(a.professor, PROFESSOR_COLORS[idx % PROFESSOR_COLORS.length]);
          idx++;
        }
        const cor = colorMap.get(a.professor)!;
        return {
          id: String(a.idAula),
          title: `${a.modalidade} — ${a.professor}`,
          start: a.inicio,
          end: a.fim,
          backgroundColor: cor,
          borderColor: cor,
          extendedProps: { aula: a },
        };
      });

      setTimeout(() => {
        this.professoresLegenda.set(
          Array.from(colorMap.entries()).map(([nome, cor]) => ({ nome, cor }))
        );
        this.calendarOptions = { ...this.calendarOptions, events };
        this.cdr.detectChanges();
      }, 0);
    });
  }

  onEventClick(info: EventClickArg) {
    const aula = info.event.extendedProps['aula'] as AulaAgendaItem;
    this.dialog.open(InscritosDialogComponent, { data: aula, width: '500px' });
  }
}
