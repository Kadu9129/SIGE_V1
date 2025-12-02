import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  TurmaAluno,
  TurmaCadastro,
  TurmaCadastroPayload,
  TurmaCursoOption,
  TurmaProfessor,
  TurmaStatus,
  TurmaTurno
} from '../../painel.model';

@Component({
  selector: 'app-painel-gestao-turmas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestao-turmas.component.html',
  styleUrls: ['./gestao-turmas.component.css']
})
export class PainelGestaoTurmasComponent {
  @Input({ required: true }) visible = false;
  @Input({ required: true }) turmas: TurmaCadastro[] = [];
  @Input({ required: true }) professores: TurmaProfessor[] = [];
  @Input({ required: true }) alunosDisponiveis: TurmaAluno[] = [];
  private _cursos: TurmaCursoOption[] = [];
  @Input({ required: true })
  set cursos(value: TurmaCursoOption[]) {
    this._cursos = value ?? [];
    if (!this.form.cursoId && this._cursos.length) {
      this.form.cursoId = this._cursos[0].id;
    }
  }
  get cursos(): TurmaCursoOption[] {
    return this._cursos;
  }
  @Input() selecionada: TurmaCadastro | null = null;
  @Input() carregandoTurmas = false;
  @Input() carregandoCatalogos = false;
  @Input() salvando = false;

  @Output() criarTurma = new EventEmitter<TurmaCadastroPayload>();
  @Output() atualizarTurma = new EventEmitter<{ id: number; payload: TurmaCadastroPayload }>();
  @Output() excluirTurma = new EventEmitter<number>();
  @Output() selecionarTurma = new EventEmitter<number>();
  @Output() alterarStatusTurma = new EventEmitter<{ id: number; status: TurmaStatus }>();

  readonly turnos: TurmaTurno[] = ['Matutino', 'Vespertino', 'Noturno', 'Integral'];
  readonly statusOptions: TurmaStatus[] = ['Planejada', 'Ativa', 'Finalizada', 'Cancelada'];
  readonly statusLabels: Record<TurmaStatus, string> = {
    Planejada: 'Planejada',
    Ativa: 'Ativa',
    Finalizada: 'Finalizada',
    Cancelada: 'Cancelada'
  };
  readonly statusClasses: Record<TurmaStatus, string> = {
    Planejada: 'status planejada',
    Ativa: 'status ativa',
    Finalizada: 'status finalizada',
    Cancelada: 'status cancelada'
  };

  formMode: 'create' | 'edit' = 'create';
  editingTurmaId: number | null = null;
  form: TurmaCadastroPayload = this.buildDefaultForm();

  trackByTurma(_: number, turma: TurmaCadastro): number {
    return turma.id;
  }

  selectTurma(id: number): void {
    this.selecionarTurma.emit(id);
  }

  startCreate(): void {
    this.formMode = 'create';
    this.editingTurmaId = null;
    this.resetForm();
  }

  startEdit(turma: TurmaCadastro): void {
    this.formMode = 'edit';
    this.editingTurmaId = turma.id;
    this.form = {
      codigo: turma.codigo,
      nome: turma.nome,
      anoLetivo: turma.anoLetivo,
      serie: turma.serie ?? '',
      turno: turma.turno,
      capacidadeMaxima: turma.capacidadeMaxima,
      cursoId: turma.cursoId,
      professorCoordenadorId: turma.professorCoordenadorId,
      sala: turma.sala ?? '',
      status: turma.status,
      alunoIds: turma.alunos?.map(aluno => aluno.id) ?? []
    };
  }

  toggleAluno(id: number): void {
    if (this.form.alunoIds.includes(id)) {
      this.form.alunoIds = this.form.alunoIds.filter(alunoId => alunoId !== id);
    } else {
      this.form.alunoIds = [...this.form.alunoIds, id];
    }
  }

  isAlunoSelecionado(id: number): boolean {
    return this.form.alunoIds.includes(id);
  }

  submit(): void {
    if (!this.isFormValido) {
      return;
    }

    const payload: TurmaCadastroPayload = {
      ...this.form,
      anoLetivo: Number(this.form.anoLetivo),
      capacidadeMaxima: Number(this.form.capacidadeMaxima),
      cursoId: Number(this.form.cursoId),
      professorCoordenadorId: this.form.professorCoordenadorId || undefined,
      sala: this.form.sala?.trim() || undefined,
      serie: this.form.serie?.trim() || undefined,
      codigo: this.form.codigo.trim().toUpperCase(),
      nome: this.form.nome.trim(),
      alunoIds: [...new Set(this.form.alunoIds)]
    };

    if (this.formMode === 'create') {
      this.criarTurma.emit(payload);
      this.resetForm();
    } else if (this.formMode === 'edit' && this.editingTurmaId !== null) {
      this.atualizarTurma.emit({ id: this.editingTurmaId, payload });
    }
  }

  deleteTurma(): void {
    if (this.selecionada) {
      this.excluirTurma.emit(this.selecionada.id);
    }
  }

  changeStatus(status: TurmaStatus): void {
    if (this.selecionada) {
      this.alterarStatusTurma.emit({ id: this.selecionada.id, status });
    }
  }

  get isFormValido(): boolean {
    return Boolean(
      this.form.codigo?.trim() &&
      this.form.nome?.trim() &&
      this.form.anoLetivo &&
      this.form.cursoId &&
      this.form.turno &&
      this.form.status
    );
  }

  get formTitle(): string {
    return this.formMode === 'create' ? 'Criar nova turma' : 'Editar turma';
  }

  get submitLabel(): string {
    return this.formMode === 'create' ? 'Cadastrar turma' : 'Salvar alterações';
  }

  private resetForm(): void {
    this.form = this.buildDefaultForm();
  }

  private buildDefaultForm(): TurmaCadastroPayload {
    return {
      codigo: '',
      nome: '',
      anoLetivo: new Date().getFullYear(),
      serie: '',
      turno: 'Matutino',
      capacidadeMaxima: 30,
      cursoId: this._cursos[0]?.id ?? 0,
      professorCoordenadorId: undefined,
      sala: '',
      status: 'Planejada',
      alunoIds: []
    };
  }
}
