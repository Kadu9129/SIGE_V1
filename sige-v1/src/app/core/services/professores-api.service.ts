import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, PaginatedResponse } from '../models/api-response.model';
import { Professor } from '../models/professor.model';

export interface CreateProfessor { nomeCompleto: string; cpf: string; codigo?: string; }
export interface UpdateProfessor { nomeCompleto?: string; cpf?: string; }

@Injectable({ providedIn: 'root' })
export class ProfessoresApiService {
  private base = `${environment.apiBaseUrl}/Professores`;
  constructor(private http: HttpClient) {}

  list(page = 1, pageSize = 10, search?: string): Observable<ApiResponse<PaginatedResponse<Professor>>> {
    let params = new HttpParams().set('page', page).set('pageSize', pageSize);
    if (search) params = params.set('search', search);
    return this.http.get<ApiResponse<PaginatedResponse<Professor>>>(this.base, { params });
  }

  get(id: number): Observable<ApiResponse<Professor>> {
    return this.http.get<ApiResponse<Professor>>(`${this.base}/${id}`);
  }

  create(dto: CreateProfessor): Observable<ApiResponse<Professor>> {
    return this.http.post<ApiResponse<Professor>>(this.base, dto);
  }

  update(id: number, dto: UpdateProfessor): Observable<ApiResponse<Professor>> {
    return this.http.put<ApiResponse<Professor>>(`${this.base}/${id}`, dto);
  }

  delete(id: number): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${this.base}/${id}`);
  }
}
