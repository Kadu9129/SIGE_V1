import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface DashboardGeral { totalEscolas: number; totalAlunos: number; totalProfessores: number; totalTurmas: number; totalUsuarios: number; percentualFrequencia: number; mediaGeralNotas: number; }

@Injectable({ providedIn: 'root' })
export class DashboardApiService {
  private base = `${environment.apiBaseUrl}/Dashboard`;
  constructor(private http: HttpClient) {}

  geral(): Observable<DashboardGeral> {
    return this.http.get<DashboardGeral>(`${this.base}/geral`);
  }
}
