import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DocumentoRequisito, PreMatricula } from '../../painel.model';

type Filtro = 'todas' | 'aguardando' | 'aprovado' | 'indeferido';

@Component({
  selector: 'app-painel-pre-matricula',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pre-matricula.component.html',
  styleUrls: ['./pre-matricula.component.css']
})
export class PainelPreMatriculaComponent {
  @Input({ required: true }) visible = false;
  @Input({ required: true }) preMatriculas: PreMatricula[] = [];
  @Input({ required: true }) statusLabels: Record<PreMatricula['status'], string> = {
    aguardando: 'Aguardando análise',
    aprovado: 'Aprovada',
    indeferido: 'Indeferida'
  };
  @Input({ required: true }) statusClasses: Record<PreMatricula['status'], string> = {
    aguardando: 'warning',
    aprovado: 'success',
    indeferido: 'error'
  };
  @Input({ required: true }) filtro: Filtro = 'todas';
  @Input() selecionada: PreMatricula | null = null;

  @Output() filtroChange = new EventEmitter<Filtro>();
  @Output() selecionar = new EventEmitter<PreMatricula>();
  @Output() statusChange = new EventEmitter<PreMatricula['status']>();
  @Output() documentoChange = new EventEmitter<{ documento: DocumentoRequisito; status: DocumentoRequisito['status'] }>();
  @Output() observacoesChange = new EventEmitter<string>();
  @Output() concluir = new EventEmitter<void>();
  @Output() indeferir = new EventEmitter<void>();

  get preMatriculasFiltradas(): PreMatricula[] {
    if (this.filtro === 'todas') {
      return this.preMatriculas;
    }
    return this.preMatriculas.filter(item => item.status === this.filtro);
  }

  selecionarPreMatricula(pre: PreMatricula): void {
    this.selecionar.emit(pre);
  }

  atualizarFiltro(valor: Filtro): void {
    this.filtroChange.emit(valor);
  }

  atualizarStatus(valor: PreMatricula['status']): void {
    this.statusChange.emit(valor);
  }

  atualizarDocumento(documento: DocumentoRequisito, status: DocumentoRequisito['status']): void {
    this.documentoChange.emit({ documento, status });
  }

  atualizarObservacoes(texto: string): void {
    this.observacoesChange.emit(texto);
  }

  documentosAceitos(pre: PreMatricula): number {
    return pre.documentos.filter(doc => doc.status === 'aceito').length;
  }

  progressoDocumentos(pre: PreMatricula): number {
    if (!pre.documentos.length) {
      return 0;
    }
    return (this.documentosAceitos(pre) / pre.documentos.length) * 100;
  }
}
