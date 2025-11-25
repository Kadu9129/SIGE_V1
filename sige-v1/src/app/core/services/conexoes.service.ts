import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { LoggerService } from './logger.service';

interface LoginRequest {
  email: string;
  senha: string;
}

// Backend shape (C# PascalCase): Token, Expiracao, Usuario{ Nome, Email, TipoUsuario, Status }
// API usa camelCase por padrão (System.Text.Json)
interface BackendLoginResponse {
  token: string;
  expiracao: string;
  usuario: {
    id: number;
    nome: string;
    email: string;
    tipoUsuario: string;
    status: string;
  };
}

@Injectable({ providedIn: 'root' })
export class ConexoesService {
  private readonly apiBaseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient, private logger: LoggerService) {}

  login(data: LoginRequest): Observable<BackendLoginResponse> {
    return this.http.post<BackendLoginResponse>(`${this.apiBaseUrl}/Auth/login`, data).pipe(
      tap(res => this.logger.info('Backend login bruto', res))
    );
  }
}

