import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { DonoService } from '../../../core/services/dono.service';
import { DashboardDonoResponse } from '../../../core/models/dashboard.model';

@Component({
  selector: 'app-home-dono',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, MatTableModule],
  templateUrl: './home.html',
})
export class HomeDonoComponent implements OnInit {
  private donoService = inject(DonoService);

  dashboard = signal<DashboardDonoResponse | null>(null);
  colunas = ['modalidade', 'professor', 'inicio', 'status'];

  ngOnInit() {
    this.donoService.dashboard().subscribe({
      next: (d) => this.dashboard.set(d),
    });
  }

  statusClass(status: string) {
    const map: Record<string, string> = {
      AGENDADA: 'badge-blue',
      REALIZADA: 'badge-green',
      CANCELADA: 'badge-red',
    };
    return 'badge ' + (map[status] ?? 'badge-gray');
  }
}
