import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
	{ path: '', loadComponent: () => import('./features/navegacao/inicio/inicio.component').then(m => m.InicioComponent) },
	{ path: 'login', loadComponent: () => import('./features/autenticacao/autenticacao.component').then(m => m.AutenticacaoComponent) },
	{
		path: '',
		loadComponent: () => import('./features/navegacao/navegacao/navegacao.component').then(m => m.NavegacaoComponent),
		canActivate: [authGuard],
		children: [
			{ path: '', loadComponent: () => import('./features/navegacao/redirect/redirect.component').then(m => m.RedirectComponent) },
			{ path: 'menu', loadComponent: () => import('./features/navegacao/menu/menu.component').then(m => m.MenuComponent) },
			{ path: 'painel', loadComponent: () => import('./features/autenticacao/painel/painel.component').then(m => m.PainelComponent) },
			{ path: 'professor', loadComponent: () => import('./features/perfis/professor/professor-area.component').then(m => m.ProfessorAreaComponent) },
			{ path: 'aluno', loadComponent: () => import('./features/perfis/aluno/aluno-area.component').then(m => m.AlunoAreaComponent) },
			{ path: 'responsavel', loadComponent: () => import('./features/perfis/responsavel/responsavel-area.component').then(m => m.ResponsavelAreaComponent) }
		]
	}
];
