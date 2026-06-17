import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DonoService } from '../../../core/services/dono.service';
import { DashboardDonoResponse } from '../../../core/models/dashboard.model';

@Component({
  selector: 'app-home-dono',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, MatTableModule, MatProgressSpinnerModule],
  templateUrl: './home.html',
})
export class HomeDonoComponent implements OnInit {
  private donoService = inject(DonoService);

  dashboard = signal<DashboardDonoResponse | null>(null);
  colunas = ['modalidade', 'professor', 'inicio', 'fim'];

  ngOnInit() {
    this.donoService.dashboard().subscribe({
      next: (d) => this.dashboard.set(d),
    });
  }


}
