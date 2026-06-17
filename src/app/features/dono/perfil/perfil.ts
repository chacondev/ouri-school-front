import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UsuarioService } from '../../../core/services/usuario.service';
import { UsuarioDTO } from '../../../core/models/usuario.model';
import { AlertService } from '../../../shared/alert-dialog/alert.service';

@Component({
  selector: 'app-perfil-dono',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './perfil.html',
})
export class PerfilDonoComponent implements OnInit {
  private svc = inject(UsuarioService);
  private fb = inject(FormBuilder);
  private alert = inject(AlertService);

  usuario = signal<UsuarioDTO | null>(null);
  modoEdicao = signal(false);
  salvando = signal(false);

  form = this.fb.group({
    nome: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    telefone: [''],
    senha: [''],
  });

  ngOnInit() {
    this.svc.obterDados().subscribe(u => {
      this.usuario.set(u);
      this.form.patchValue({ nome: u.nome, email: u.email, telefone: u.telefone ?? '' });
    });
  }

  iniciais(nome: string): string {
    return nome.split(' ').filter(Boolean).slice(0, 2).map(p => p[0].toUpperCase()).join('');
  }

  salvar() {
    if (this.form.invalid) return;
    this.salvando.set(true);
    const v = this.form.value;
    this.svc.atualizar({ nome: v.nome!, email: v.email!, telefone: v.telefone ?? undefined, senha: v.senha || undefined }).subscribe({
      next: () => { this.salvando.set(false); this.modoEdicao.set(false); this.alert.notificar('Perfil atualizado com sucesso!'); this.ngOnInit(); },
      error: () => this.salvando.set(false),
    });
  }
}
