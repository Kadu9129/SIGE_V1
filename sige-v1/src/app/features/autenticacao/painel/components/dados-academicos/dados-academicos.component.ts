import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DadosAcademicosAluno } from '../../painel.model';

@Component({
  selector: 'app-painel-dados-academicos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dados-academicos.component.html',
  styleUrls: ['./dados-academicos.component.css']
})
export class PainelDadosAcademicosComponent {
  @Input({ required: true }) visible = false;
  @Input({ required: true }) alunos: DadosAcademicosAluno[] = [];
  @Input() selecionado: DadosAcademicosAluno | null = null;

  @Output() selecionarAluno = new EventEmitter<string>();

  selectAluno(id: string): void {
    this.selecionarAluno.emit(id);
  }
}
