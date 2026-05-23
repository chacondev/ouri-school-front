import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-shell-dono',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatIconModule, MatMenuModule, MatButtonModule],
  templateUrl: './shell-dono.html',
})
export class ShellDonoComponent {
  auth = inject(AuthService);
  nome = this.auth.getNome();
  hoje = this.formatarHoje();
  sidebarAberta = signal(false);

  fechar() { this.sidebarAberta.set(false); }
  alternar() { this.sidebarAberta.update(v => !v); }

  private formatarHoje(): string {
    const d = new Date();
    const dia = d.toLocaleDateString('pt-BR', { weekday: 'long' });
    const data = d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
    return `${dia.charAt(0).toUpperCase() + dia.slice(1)}, ${data}`;
  }
}
