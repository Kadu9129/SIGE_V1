import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse, PaginatedResponse } from '../models/api-response.model';

export interface Usuario { id: number; nome: string; email: string; status: string; tipo?: string; ultimoAcesso?: Date; }
export interface CreateUsuario { nome: string; email: string; senha: string; tipoUsuario: string; status?: string; telefone?: string; cpf?: string; }
export interface UpdateUsuario { nome?: string; email?: string; }

@Injectable({ providedIn: 'root' })
export class UsuariosApiService {
  private base = `${environment.apiBaseUrl}/Usuarios`;
  constructor(private http: HttpClient) {}

  list(page = 1, pageSize = 15, search?: string): Observable<Usuario[]> {
    let params = new HttpParams().set('page', page).set('pageSize', pageSize);
    if (search) params = params.set('search', search);
    return this.http.get<any[]>(this.base, { params }).pipe(
      map((items: any[]) => {
        return items.map((r: any) => {
          return {
            id: r.id ?? r.Id,
            nome: r.nome ?? r.Nome,
            email: r.email ?? r.Email,
            status: (r.status ?? r.Status ?? '').toLowerCase(),
            tipo: (r.tipoUsuario ?? r.TipoUsuario ?? '').toLowerCase(),
            ultimoAcesso: new Date(r.dataCriacao ?? r.DataCriacao ?? Date.now())
          } as Usuario;
        });
      })
    );
  }

  get(id: number): Observable<Usuario> {
    return this.http.get<any>(`${this.base}/${id}`).pipe(
      map((r: any) => {
        return {
          id: r.id ?? r.Id,
          nome: r.nome ?? r.Nome,
          email: r.email ?? r.Email,
          status: (r.status ?? r.Status ?? '').toLowerCase(),
          tipo: (r.tipoUsuario ?? r.TipoUsuario ?? '').toLowerCase(),
          ultimoAcesso: new Date(r.dataCriacao ?? r.DataCriacao ?? Date.now())
        } as Usuario;
      })
    );
  }

  create(dto: CreateUsuario): Observable<Usuario> {
    // Enviar payload adaptado ao backend (case-insensitive, mas manter clareza)
    const payload = {
      nome: dto.nome,
      email: dto.email,
      senha: dto.senha,
      tipoUsuario: dto.tipoUsuario,
      status: dto.status || 'Ativo',
      telefone: dto.telefone,
      cpf: dto.cpf
    };
    return this.http.post<any>(this.base, payload).pipe(
      map((r: any) => ({
        id: r.id ?? r.Id,
        nome: r.nome ?? r.Nome,
        email: r.email ?? r.Email,
        status: (r.status ?? r.Status ?? '').toLowerCase(),
        tipo: (r.tipoUsuario ?? r.TipoUsuario ?? '').toLowerCase(),
        ultimoAcesso: new Date(r.dataCriacao ?? r.DataCriacao ?? Date.now())
      }))
    );
  }

  update(id: number, dto: UpdateUsuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.base}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
