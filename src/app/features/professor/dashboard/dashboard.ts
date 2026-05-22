import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ProfessorService } from '../../../core/services/professor.service';
import { DashboardProfessorResponse } from '../../../core/models/dashboard.model';

@Component({
  selector: 'app-dashboard-professor',
  standalone: true,
  imports: [CommonModule, RouterLink, MatTableModule, MatIconModule, MatButtonModule],
  templateUrl: './dashboard.html',
})
export class DashboardProfessorComponent implements OnInit {
  private svc = inject(ProfessorService);
  dashboard = signal<DashboardProfessorResponse | null>(null);
  colunas = ['modalidade', 'quadra', 'inicio', 'status'];

  ngOnInit() {
    this.svc.dashboard().subscribe(d => this.dashboard.set(d));
  }

  statusClass(status: string) {
    const map: Record<string, string> = { AGENDADA: 'badge-blue', REALIZADA: 'badge-green', CANCELADA: 'badge-red' };
    return 'badge ' + (map[status] ?? 'badge-gray');
  }
}
