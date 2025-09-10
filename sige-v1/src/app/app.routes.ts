import { Routes } from '@angular/router';

export const routes: Routes = [
	{ path: '', loadComponent: () => import('./features/navegacao/inicio/inicio.component').then(m => m.InicioComponent) },
	{ path: 'login', loadComponent: () => import('./features/navegacao/login/login.component').then(m => m.LoginComponent) },
	{ path: 'menu', loadComponent: () => import('./features/navegacao/menu/menu.component').then(m => m.MenuComponent) },
	{ path: 'navegacao', loadComponent: () => import('./features/navegacao/navegacao/navegacao.component').then(m => m.NavegacaoComponent) },
	{ path: 'autenticacao', loadComponent: () => import('./features/autenticacao/autenticacao.component').then(m => m.AutenticacaoComponent) },
	{ path: 'painel', loadComponent: () => import('./features/autenticacao/painel/painel.component').then(m => m.PainelComponent) },
];
