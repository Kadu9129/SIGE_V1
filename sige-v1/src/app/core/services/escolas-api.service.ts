import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Escola { id: number; nome: string; cnpj: string; status: string; }
export interface CreateEscola { nome: string; cnpj: string; }
export interface UpdateEscola { nome?: string; cnpj?: string; }

@Injectable({ providedIn: 'root' })
export class EscolasApiService {
  private base = `${environment.apiBaseUrl}/Escolas`;
  constructor(private http: HttpClient) {}

  list(page = 1, pageSize = 15, search?: string): Observable<Escola[]> {
    let params = new HttpParams().set('page', page).set('pageSize', pageSize);
    if (search) params = params.set('search', search);
    return this.http.get<Escola[]>(this.base, { params });
  }

  get(id: number): Observable<Escola> {
    return this.http.get<Escola>(`${this.base}/${id}`);
  }

  create(dto: CreateEscola): Observable<Escola> {
    return this.http.post<Escola>(this.base, dto);
  }

  update(id: number, dto: UpdateEscola): Observable<Escola> {
    return this.http.put<Escola>(`${this.base}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
