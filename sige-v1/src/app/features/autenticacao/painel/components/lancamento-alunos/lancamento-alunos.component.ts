import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AcademicoAlunoResumo } from '../../painel.model';

@Component({
  selector: 'app-painel-lancamento-alunos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lancamento-alunos.component.html',
  styleUrls: ['./lancamento-alunos.component.css']
})
export class PainelLancamentoAlunosComponent {
  @Input({ required: true }) visible = false;
  @Input({ required: true }) alunos: AcademicoAlunoResumo[] = [];
  @Input() selecionado: AcademicoAlunoResumo | null = null;

  @Output() selecionarAluno = new EventEmitter<string>();

  selectAluno(id: string): void {
    this.selecionarAluno.emit(id);
  }

  mediaGeral(aluno: AcademicoAlunoResumo | null): number {
    if (!aluno || !aluno.boletim.length) {
      return 0;
    }
    const soma = aluno.boletim.reduce((acc, disc) => acc + disc.media, 0);
    return Math.round((soma / aluno.boletim.length) * 10) / 10;
  }
}
