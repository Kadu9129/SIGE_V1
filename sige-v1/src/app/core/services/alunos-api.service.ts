import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, PaginatedResponse } from '../models/api-response.model';
import { Aluno } from '../models/aluno.model';

export interface CreateAluno { nomeCompleto: string; cpf: string; matricula?: string; }
export interface UpdateAluno { nomeCompleto?: string; cpf?: string; }

@Injectable({ providedIn: 'root' })
export class AlunosApiService {
  private base = `${environment.apiBaseUrl}/Alunos`;
  constructor(private http: HttpClient) {}

  list(page = 1, pageSize = 10, search?: string): Observable<ApiResponse<PaginatedResponse<Aluno>>> {
    let params = new HttpParams().set('page', page).set('pageSize', pageSize);
    if (search) params = params.set('search', search);
    return this.http.get<ApiResponse<PaginatedResponse<Aluno>>>(this.base, { params });
  }

  get(id: number): Observable<ApiResponse<Aluno>> {
    return this.http.get<ApiResponse<Aluno>>(`${this.base}/${id}`);
  }

  getByUsuarioId(usuarioId: number): Observable<ApiResponse<Aluno>> {
    return this.http.get<ApiResponse<Aluno>>(`${this.base}/por-usuario/${usuarioId}`);
  }

  create(dto: CreateAluno): Observable<ApiResponse<Aluno>> {
    return this.http.post<ApiResponse<Aluno>>(this.base, dto);
  }

  update(id: number, dto: UpdateAluno): Observable<ApiResponse<Aluno>> {
    return this.http.put<ApiResponse<Aluno>>(`${this.base}/${id}`, dto);
  }

  delete(id: number): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${this.base}/${id}`);
  }

  uploadFoto(id: number, file: File): Observable<ApiResponse<string>> {
    const form = new FormData();
    form.append('foto', file);
    return this.http.post<ApiResponse<string>>(`${this.base}/${id}/foto`, form);
  }
}
