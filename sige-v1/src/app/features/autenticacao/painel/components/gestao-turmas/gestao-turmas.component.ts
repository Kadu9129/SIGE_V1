import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TurmaAluno, TurmaCadastro, TurmaCadastroPayload, TurmaProfessor } from '../../painel.model';

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
  @Input() selecionada: TurmaCadastro | null = null;

  @Output() criarTurma = new EventEmitter<TurmaCadastroPayload>();
  @Output() selecionarTurma = new EventEmitter<string>();

  form: TurmaCadastroPayload = {
    nome: '',
    etapa: '',
    turno: 'Manhã',
    capacidade: 30,
    professorId: '',
    alunoIds: []
  };

  selectTurma(id: string): void {
    this.selecionarTurma.emit(id);
  }

  toggleAluno(id: string): void {
    if (this.form.alunoIds.includes(id)) {
      this.form.alunoIds = this.form.alunoIds.filter(alunoId => alunoId !== id);
    } else {
      this.form.alunoIds = [...this.form.alunoIds, id];
    }
  }

  isAlunoSelecionado(id: string): boolean {
    return this.form.alunoIds.includes(id);
  }

  submit(): void {
    if (!this.isFormValido) {
      return;
    }
    this.criarTurma.emit({ ...this.form });
    this.resetForm();
  }

  private resetForm(): void {
    this.form = {
      nome: '',
      etapa: '',
      turno: 'Manhã',
      capacidade: 30,
      professorId: '',
      alunoIds: []
    };
  }

  get isFormValido(): boolean {
    return Boolean(
      this.form.nome.trim() &&
        this.form.etapa.trim() &&
        this.form.professorId &&
        this.form.alunoIds.length
    );
  }
}
