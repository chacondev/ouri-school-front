import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', Validators.required],
  });

  loading = signal(false);
  errorMsg = signal('');
  showPassword = signal(false);

  onSubmit() {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.errorMsg.set('');

    const { email, senha } = this.form.value;

    this.auth.login(email!, senha!).subscribe({
      next: () => {
        this.loading.set(false);
        const role = this.auth.getRole();
        if (role === 'DONO') this.router.navigate(['/dono/home']);
        else if (role === 'PROFESSOR') this.router.navigate(['/professor/dashboard']);
        else this.router.navigate(['/aluno/dashboard']);
      },
      error: () => {
        this.loading.set(false);
        this.errorMsg.set('Email ou senha inválidos. Tente novamente.');
      },
    });
  }
}
