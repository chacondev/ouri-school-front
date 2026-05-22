import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then(m => m.LoginComponent),
  },

  // ---- DONO ----
  {
    path: 'dono',
    canActivate: [authGuard, roleGuard(['DONO'])],
    loadComponent: () => import('./features/dono/shell/shell-dono').then(m => m.ShellDonoComponent),
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', loadComponent: () => import('./features/dono/home/home').then(m => m.HomeDonoComponent) },
      { path: 'professores', loadComponent: () => import('./features/dono/professores/professores').then(m => m.ProfessoresComponent) },
      { path: 'alunos', loadComponent: () => import('./features/dono/alunos/alunos').then(m => m.AlunosComponent) },
      { path: 'modalidades', loadComponent: () => import('./features/dono/modalidades/modalidades').then(m => m.ModalidadesComponent) },
      { path: 'quadras', loadComponent: () => import('./features/dono/quadras/quadras').then(m => m.QuadrasComponent) },
      { path: 'aulas', loadComponent: () => import('./features/dono/aulas/aulas').then(m => m.AulasDonoComponent) },
    ],
  },

  // ---- PROFESSOR ----
  {
    path: 'professor',
    canActivate: [authGuard, roleGuard(['PROFESSOR'])],
    loadComponent: () => import('./features/professor/shell/shell-professor').then(m => m.ShellProfessorComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./features/professor/dashboard/dashboard').then(m => m.DashboardProfessorComponent) },
      { path: 'agenda', loadComponent: () => import('./features/professor/agenda/agenda').then(m => m.AgendaProfessorComponent) },
      { path: 'historico', loadComponent: () => import('./features/professor/historico/historico').then(m => m.HistoricoProfessorComponent) },
      { path: 'perfil', loadComponent: () => import('./features/professor/perfil/perfil').then(m => m.PerfilProfessorComponent) },
    ],
  },

  // ---- ALUNO ----
  {
    path: 'aluno',
    canActivate: [authGuard, roleGuard(['ALUNO'])],
    loadComponent: () => import('./features/aluno/shell/shell-aluno').then(m => m.ShellAlunoComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./features/aluno/dashboard/dashboard').then(m => m.DashboardAlunoComponent) },
      { path: 'aulas', loadComponent: () => import('./features/aluno/aulas/aulas').then(m => m.AulasAlunoComponent) },
      { path: 'historico', loadComponent: () => import('./features/aluno/historico/historico').then(m => m.HistoricoAlunoComponent) },
      { path: 'perfil', loadComponent: () => import('./features/aluno/perfil/perfil').then(m => m.PerfilAlunoComponent) },
    ],
  },

  { path: '**', redirectTo: 'login' },
];
