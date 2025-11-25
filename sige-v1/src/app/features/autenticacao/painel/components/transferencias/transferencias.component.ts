import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EscolaDestino, Transferencia } from '../../painel.model';

@Component({
  selector: 'app-painel-transferencias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transferencias.component.html',
  styleUrls: ['./transferencias.component.css']
})
export class PainelTransferenciasComponent {
  @Input({ required: true }) visible = false;
  @Input({ required: true }) solicitacoes: Transferencia[] = [];
  @Input({ required: true }) destinos: EscolaDestino[] = [];
  @Input({ required: true }) historico: Transferencia[] = [];
  @Input({ required: true }) statusLabels: Record<Transferencia['status'], string> = {
    rascunho: 'Rascunho',
    emAnalise: 'Em análise',
    concluida: 'Concluída',
    cancelada: 'Cancelada'
  };
  @Input({ required: true }) statusClasses: Record<Transferencia['status'], string> = {
    rascunho: 'warning',
    emAnalise: 'info',
    concluida: 'success',
    cancelada: 'error'
  };
  @Input() selecionada: Transferencia | null = null;

  @Output() selecionar = new EventEmitter<Transferencia>();
  @Output() destinoChange = new EventEmitter<string>();
  @Output() justificativaChange = new EventEmitter<string>();
  @Output() confirmar = new EventEmitter<void>();
  @Output() cancelar = new EventEmitter<void>();

  selecionarSolicitacao(req: Transferencia): void {
    this.selecionar.emit(req);
  }

  atualizarDestino(valor: string): void {
    this.destinoChange.emit(valor);
  }

  atualizarJustificativa(valor: string): void {
    this.justificativaChange.emit(valor);
  }

  trackById(_: number, item: Transferencia): string {
    return item.id;
  }
}
