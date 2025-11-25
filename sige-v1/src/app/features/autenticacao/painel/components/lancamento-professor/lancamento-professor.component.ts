import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LancamentoProfessorDisciplina, LancamentoProfessorTurma } from '../../painel.model';

type FrequenciaValor = 'presente' | 'ausente' | 'atraso' | null;

type FrequenciaOption = {
  value: FrequenciaValor;
  label: string;
  badge: string;
};

@Component({
  selector: 'app-painel-lancamento-professor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lancamento-professor.component.html',
  styleUrls: ['./lancamento-professor.component.css']
})
export class PainelLancamentoProfessorComponent {
  @Input({ required: true }) visible = false;
  @Input({ required: true }) disciplinas: LancamentoProfessorDisciplina[] = [];
  @Input() disciplinaSelecionada: LancamentoProfessorDisciplina | null = null;
  @Input() turmaSelecionada: LancamentoProfessorTurma | null = null;
  @Input({ required: true }) frequenciaOptions: FrequenciaOption[] = [];

  @Output() disciplinaChange = new EventEmitter<string>();
  @Output() turmaChange = new EventEmitter<string>();
  @Output() notaChange = new EventEmitter<{ alunoId: string; nota: number | null }>();
  @Output() frequenciaChange = new EventEmitter<{ alunoId: string; frequencia: FrequenciaValor }>();

  selectDisciplina(id: string): void {
    this.disciplinaChange.emit(id);
  }

  selectTurma(id: string): void {
    this.turmaChange.emit(id);
  }

  atualizarNota(alunoId: string, valor: string | number): void {
    const parsed = valor === '' ? null : Number(valor);
    if (parsed !== null && (Number.isNaN(parsed) || parsed < 0 || parsed > 10)) {
      return;
    }
    this.notaChange.emit({ alunoId, nota: parsed });
  }

  atualizarFrequencia(alunoId: string, frequencia: string | FrequenciaValor): void {
    const valor = frequencia === '' ? null : (frequencia as FrequenciaValor);
    this.frequenciaChange.emit({ alunoId, frequencia: valor });
  }

  getPendentes(disciplina: LancamentoProfessorDisciplina): number {
    return disciplina.pendencias ?? 0;
  }

  totalLancados(turma: LancamentoProfessorTurma | null): number {
    if (!turma) {
      return 0;
    }
    return turma.alunos.filter(aluno => aluno.nota != null && aluno.frequencia).length;
  }

  turmaPendencias(turma: LancamentoProfessorTurma | null): number {
    if (!turma) {
      return 0;
    }
    return turma.alunos.filter(aluno => aluno.nota == null || !aluno.frequencia).length;
  }
}
