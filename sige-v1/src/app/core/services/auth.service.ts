import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, map, tap, catchError } from 'rxjs';
import { ConexoesService } from './conexoes.service';
import { LoggerService } from './logger.service';

export interface AuthUser {
	id: number;
	email: string;
	nome: string;
	role: string;
}

export interface LoginCredentials {
	email: string;
	senha: string;
	lembrarMe: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
	private readonly TOKEN_KEY = 'sige_token';
	private readonly USER_KEY = 'sige_user';
	private readonly REMEMBER_KEY = 'sige_remember_user';

	constructor(
		private conexoesService: ConexoesService,
		private router: Router,
		private logger: LoggerService
	) {}

	login(credentials: LoginCredentials): Observable<boolean> {
		// Enquanto a API real não estiver pronta, simulamos a resposta.
		// Quando integrar com backend, troque pelo uso de this.conexoesService.login.

		const { email, senha, lembrarMe } = credentials;
		this.logger.group('AuthService.login');
		this.logger.log('Credenciais recebidas', { email, lembrarMe });
		// Chamada real via ConexoesService (MVP sem validar token)
		return this.conexoesService.login({ email, senha }).pipe(
			map((res: any) => {
				// Suportar tanto PascalCase quanto camelCase
				const usuario = res?.Usuario ?? res?.usuario;
				const token = res?.Token ?? res?.token ?? '';
				const id = usuario?.Id ?? usuario?.id;
				const tipoUsuario = usuario?.TipoUsuario ?? usuario?.tipoUsuario;
				if (!usuario || !id || !tipoUsuario || !token) {
					this.logger.error('Login inválido: resposta incompleta', res);
					this.logger.groupEnd();
					throw new Error('Login inválido');
				}
				const nome = usuario.Nome ?? usuario.nome ?? email;
				const role = String(tipoUsuario);
				this.logger.log('Resposta backend', { id, nome, role });
				this.persistLogin({ token, nome, role, id }, email, lembrarMe);
				this.logger.groupEnd();
				return true;
			}),
			catchError((err) => { this.logger.error('Login erro', err); this.logger.groupEnd(); return of(false); })
		);
	}

	logout(): void {
		localStorage.removeItem(this.TOKEN_KEY);
		localStorage.removeItem(this.USER_KEY);
		this.router.navigate(['/login']);
	}

	isLoggedIn(): boolean {
		return !!localStorage.getItem(this.TOKEN_KEY);
	}

	getCurrentUser(): AuthUser | null {
		const raw = localStorage.getItem(this.USER_KEY);
		return raw ? (JSON.parse(raw) as AuthUser) : null;
	}

	rememberUser(email: string | null): void {
		if (email) {
			localStorage.setItem(this.REMEMBER_KEY, email);
		} else {
			localStorage.removeItem(this.REMEMBER_KEY);
		}
	}

	getRememberedUser(): string | null {
		return localStorage.getItem(this.REMEMBER_KEY);
	}

	private persistLogin(response: { token: string; nome: string; role: string; id: number }, email: string, lembrarMe: boolean): void {
		this.logger.group('AuthService.persistLogin');
		localStorage.setItem(this.TOKEN_KEY, response.token);
		const roleNorm = (response.role || '').toLowerCase().trim();
		localStorage.setItem(this.USER_KEY, JSON.stringify({
			id: response.id,
			email,
			nome: response.nome,
			role: roleNorm
		}));
		this.logger.log('Persistido usuario', { id: response.id, role: roleNorm });

		if (lembrarMe) {
			this.rememberUser(email);
		} else {
			this.rememberUser(null);
		}
		this.logger.groupEnd();
	}
}
