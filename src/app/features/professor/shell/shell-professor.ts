import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../core/services/auth.service';
import { AulaService } from '../../../core/services/aula.service';

@Component({
  selector: 'app-shell-professor',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatIconModule, MatMenuModule, MatButtonModule],
  templateUrl: './shell-professor.html',
})
export class ShellProfessorComponent implements OnInit {
  auth = inject(AuthService);
  private aulaSvc = inject(AulaService);
  nome = this.auth.getNome();

  ngOnInit() {
    this.aulaSvc.obterDadosCriacao().subscribe();
  }
}
