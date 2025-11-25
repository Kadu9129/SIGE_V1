import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Evento, EventoPayload } from '../../painel.model';

interface IconOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-painel-eventos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class PainelEventosComponent {
  @Input({ required: true }) visible = false;
  @Input({ required: true }) eventos: Evento[] = [];
  @Input({ required: true }) categorias: Evento['categoria'][] = [];
  @Input({ required: true }) icones: IconOption[] = [];

  @Output() salvar = new EventEmitter<EventoPayload>();
  @Output() remover = new EventEmitter<string>();

  filtroCategoria: Evento['categoria'] | 'todos' = 'todos';
  busca = '';
  formData: EventoPayload = this.criarFormPadrao();
  editando = false;

  get eventosFiltrados(): Evento[] {
    return this.eventos
      .filter(evento => {
        const matchCategoria = this.filtroCategoria === 'todos' || evento.categoria === this.filtroCategoria;
        const termo = this.busca.trim().toLowerCase();
        const matchTexto = !termo || evento.titulo.toLowerCase().includes(termo) || evento.descricao.toLowerCase().includes(termo);
        return matchCategoria && matchTexto;
      })
      .sort((a, b) => a.data.localeCompare(b.data));
  }

  selecionarParaEdicao(evento: Evento): void {
    this.formData = { ...evento };
    this.editando = true;
  }

  submitForm(): void {
    if (!this.formData.titulo?.trim() || !this.formData.data || !this.formData.descricao?.trim()) {
      alert('Preencha título, data e descrição para registrar o evento.');
      return;
    }
    this.salvar.emit({ ...this.formData });
    this.resetarFormulario();
  }

  resetarFormulario(): void {
    this.formData = this.criarFormPadrao();
    this.editando = false;
  }

  removerEvento(id: string): void {
    if (confirm('Confirmar exclusão deste evento do calendário?')) {
      this.remover.emit(id);
      if (this.formData.id === id) {
        this.resetarFormulario();
      }
    }
  }

  trackById(_: number, evento: Evento): string {
    return evento.id;
  }

  iconClasses(value?: string): string[] {
    if (!value?.trim()) {
      return ['fas', 'fa-calendar-star'];
    }
    const classes = value.split(' ').filter(Boolean);
    const hasStyle = classes.some(cls => ['fas', 'far', 'fab', 'fa-solid', 'fa-regular', 'fa-light'].includes(cls));
    if (!hasStyle) {
      classes.unshift('fas');
    }
    const hasGlyph = classes.some(cls => cls.startsWith('fa-'));
    if (!hasGlyph) {
      classes.push('fa-calendar-star');
    }
    return classes;
  }

  private criarFormPadrao(): EventoPayload {
    return {
      titulo: '',
      descricao: '',
      data: new Date().toISOString().slice(0, 10),
      icone: this.icones[0]?.value ?? 'fas fa-calendar-day',
      categoria: this.categorias[0] ?? 'Acadêmico'
    };
  }
}
