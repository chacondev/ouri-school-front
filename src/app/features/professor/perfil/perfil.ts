import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UsuarioService } from '../../../core/services/usuario.service';
import { DadosUsuario } from '../../../core/models/usuario.model';

@Component({
  selector: 'app-perfil-professor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './perfil.html',
})
export class PerfilProfessorComponent implements OnInit {
  private svc = inject(UsuarioService);
  private fb = inject(FormBuilder);

  usuario = signal<DadosUsuario | null>(null);
  modoEdicao = signal(false);
  salvando = signal(false);
  sucesso = signal(false);

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

  salvar() {
    if (this.form.invalid) return;
    this.salvando.set(true);
    const v = this.form.value;
    this.svc.atualizar({ nome: v.nome!, email: v.email!, telefone: v.telefone ?? undefined, senha: v.senha || undefined }).subscribe({
      next: () => { this.salvando.set(false); this.modoEdicao.set(false); this.sucesso.set(true); setTimeout(() => this.sucesso.set(false), 3000); this.ngOnInit(); },
      error: () => this.salvando.set(false),
    });
  }
}
