import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DadosService {
  constructor(private http: HttpClient) {}

  getAlunos(): Observable<any[]> {
    return this.http.get<any[]>('/assets/dados/dados_alunos.json');
  }

  getMatriculas(): Observable<any[]> {
    return this.http.get<any[]>('/assets/dados/dados_matriculas.json');
  }

  getProfessores(): Observable<any[]> {
    return this.http.get<any[]>('/assets/dados/dados_professores.json');
  }

  getTurmas(): Observable<any[]> {
    return this.http.get<any[]>('/assets/dados/dados_turmas.json');
  }
}
 
