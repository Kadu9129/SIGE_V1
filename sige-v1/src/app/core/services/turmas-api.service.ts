import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, PaginatedResponse } from '../models/api-response.model';
import { TurmaStatus, TurmaTurno } from '../../features/autenticacao/painel/painel.model';

export interface TurmaAlunoApi {
  matriculaId: number;
  alunoId: number;
  nomeAluno: string;
  numeroMatricula: string;
  status: string;
}

export interface TurmaApi {
  id: number;
  codigo: string;
  nome: string;
  anoLetivo: number;
  serie?: string;
  turno: TurmaTurno;
  capacidadeMaxima: number;
  cursoId: number;
  nomeCurso: string;
  professorCoordenadorId?: number;
  nomeProfessorCoordenador?: string;
  sala?: string;
  status: TurmaStatus;
  alunos?: TurmaAlunoApi[];
}

export interface TurmaCatalogosApi {
  cursos: { id: number; nome: string; codigo: string; nivel?: string }[];
  professores: { id: number; nome: string; especialidade?: string }[];
  alunos: { id: number; nome: string; serie?: string; matricula?: string }[];
}

export interface CreateTurmaRequest {
  codigo: string;
  nome: string;
  anoLetivo: number;
  serie?: string;
  turno: TurmaTurno;
  capacidadeMaxima: number;
  cursoId: number;
  professorCoordenadorId?: number;
  sala?: string;
  status: TurmaStatus;
  alunoIds: number[];
}

export type UpdateTurmaRequest = CreateTurmaRequest;

export interface TurmaListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  cursoId?: number;
  anoLetivo?: number;
  status?: TurmaStatus;
}

@Injectable({ providedIn: 'root' })
export class TurmasApiService {
  private readonly baseUrl = `${environment.apiBaseUrl}/Turmas`;

  constructor(private http: HttpClient) {}

  list(params: TurmaListParams = {}): Observable<TurmaApi[]> {
    let httpParams = new HttpParams()
      .set('page', params.page ?? 1)
      .set('pageSize', params.pageSize ?? 20);

    if (params.search) httpParams = httpParams.set('search', params.search);
    if (params.cursoId) httpParams = httpParams.set('cursoId', params.cursoId);
    if (params.anoLetivo) httpParams = httpParams.set('anoLetivo', params.anoLetivo);
    if (params.status) httpParams = httpParams.set('status', params.status);

    return this.http
      .get<ApiResponse<PaginatedResponse<TurmaApi>>>(this.baseUrl, { params: httpParams })
      .pipe(map(response => response.data?.items ?? []));
  }

  get(id: number): Observable<TurmaApi | null> {
    return this.http
      .get<ApiResponse<TurmaApi>>(`${this.baseUrl}/${id}`)
      .pipe(map(response => response.data ?? null));
  }

  create(payload: CreateTurmaRequest): Observable<TurmaApi | null> {
    return this.http
      .post<ApiResponse<TurmaApi>>(this.baseUrl, payload)
      .pipe(map(response => response.data ?? null));
  }

  update(id: number, payload: UpdateTurmaRequest): Observable<TurmaApi | null> {
    return this.http
      .put<ApiResponse<TurmaApi>>(`${this.baseUrl}/${id}`, payload)
      .pipe(map(response => response.data ?? null));
  }

  delete(id: number): Observable<boolean> {
    return this.http
      .delete<ApiResponse<boolean>>(`${this.baseUrl}/${id}`)
      .pipe(map(response => response.data ?? false));
  }

  changeStatus(id: number, status: TurmaStatus): Observable<boolean> {
    return this.http
      .patch<ApiResponse<boolean>>(`${this.baseUrl}/${id}/status`, status)
      .pipe(map(response => response.data ?? false));
  }

  catalogos(): Observable<TurmaCatalogosApi> {
    return this.http
      .get<ApiResponse<TurmaCatalogosApi>>(`${this.baseUrl}/catalogos`)
      .pipe(map(response => response.data ?? { cursos: [], professores: [], alunos: [] }));
  }
}
