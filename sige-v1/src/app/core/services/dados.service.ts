import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Aluno } from '../models/aluno.model';
import { Professor } from '../models/professor.model';
import { Turma } from '../models/turma.model';
import { Matricula } from '../models/matricula.model';

@Injectable({ providedIn: 'root' })
export class DadosService {
  constructor(private http: HttpClient) {}

  getAlunos(): Observable<Aluno[]> {
    return environment.useMocks
      ? this.http.get<Aluno[]>('assets/mocks/alunos.json')
      : this.http.get<Aluno[]>(`${environment.apiBaseUrl}/Alunos`);
  }

  getMatriculas(): Observable<Matricula[]> {
    return environment.useMocks
      ? this.http.get<Matricula[]>('assets/mocks/matriculas.json')
      : this.http.get<Matricula[]>(`${environment.apiBaseUrl}/Alunos`); // Ajustar endpoint real quando existir específico
  }

  getProfessores(): Observable<Professor[]> {
    return environment.useMocks
      ? this.http.get<Professor[]>('assets/mocks/professores.json')
      : this.http.get<Professor[]>(`${environment.apiBaseUrl}/Professores`);
  }

  getTurmas(): Observable<Turma[]> {
    return environment.useMocks
      ? this.http.get<Turma[]>('assets/mocks/turmas.json')
      : this.http.get<Turma[]>(`${environment.apiBaseUrl}/Dashboard/geral`); // Substituir por endpoint de turmas quando criado
  }
}
 
