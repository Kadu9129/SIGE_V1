import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AvisoMaterial, AvisoMaterialPayload, AvisoDestinoTipo, TurmaAluno, TurmaCadastro } from '../../painel.model';

interface NovoAnexo {
  nome: string;
  tipo: 'pdf' | 'imagem' | 'link';
  url: string;
}

@Component({
  selector: 'app-painel-avisos-materiais',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './avisos-materiais.component.html',
  styleUrls: ['./avisos-materiais.component.css']
})
export class PainelAvisosMateriaisComponent {
  @Input({ required: true }) visible = false;
  @Input({ required: true }) avisos: AvisoMaterial[] = [];
  @Input({ required: true }) turmasDestino: TurmaCadastro[] = [];
  @Input({ required: true }) alunosDestino: TurmaAluno[] = [];

  @Output() salvarAviso = new EventEmitter<AvisoMaterialPayload>();

  filtroDestino: AvisoDestinoTipo | 'todos' = 'todos';

  form: AvisoMaterialPayload = {
    titulo: '',
    descricao: '',
    destinoTipo: 'turma',
    turmasDestino: [],
    destinatarios: [],
    anexos: []
  };

  novoAnexo: NovoAnexo = {
    nome: '',
    tipo: 'pdf',
    url: ''
  };

  submit(): void {
    if (!this.isFormValido) {
      return;
    }
    const payload: AvisoMaterialPayload = {
      ...this.form,
      titulo: this.form.titulo.trim(),
      descricao: this.form.descricao.trim(),
      turmasDestino: this.form.destinoTipo === 'turma' ? [...(this.form.turmasDestino ?? [])] : [],
      destinatarios: this.form.destinoTipo === 'individual' ? [...(this.form.destinatarios ?? [])] : [],
      anexos: [...this.form.anexos]
    };
    this.salvarAviso.emit(payload);
    this.resetForm();
  }

  adicionarAnexo(): void {
    if (!this.novoAnexo.nome.trim() || !this.novoAnexo.url.trim()) {
      return;
    }
    const anexoId = typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `anx-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    this.form.anexos = [
      ...this.form.anexos,
      {
        id: anexoId,
        nome: this.novoAnexo.nome.trim(),
        tipo: this.novoAnexo.tipo,
        url: this.novoAnexo.url.trim()
      }
    ];
    this.novoAnexo = { nome: '', tipo: 'pdf', url: '' };
  }

  removerAnexo(id: string): void {
    this.form.anexos = this.form.anexos.filter(anexo => anexo.id !== id);
  }

  atualizarDestino(tipo: AvisoDestinoTipo): void {
    this.form.destinoTipo = tipo;
    if (tipo !== 'turma') {
      this.form.turmasDestino = [];
    }
    if (tipo !== 'individual') {
      this.form.destinatarios = [];
    }
  }

  toggleLista(lista: 'turmasDestino' | 'destinatarios', id: string): void {
    const atual = new Set(this.form[lista]);
    if (atual.has(id)) {
      atual.delete(id);
    } else {
      atual.add(id);
    }
    this.form[lista] = Array.from(atual);
  }

  get avisosFiltrados(): AvisoMaterial[] {
    if (this.filtroDestino === 'todos') {
      return this.avisos;
    }
    return this.avisos.filter(aviso => aviso.destinoTipo === this.filtroDestino);
  }

  get isFormValido(): boolean {
    if (!this.form.titulo.trim() || !this.form.descricao.trim()) {
      return false;
    }
    if (this.form.destinoTipo === 'turma' && !(this.form.turmasDestino?.length)) {
      return false;
    }
    if (this.form.destinoTipo === 'individual' && !(this.form.destinatarios?.length)) {
      return false;
    }
    return true;
  }

  private resetForm(): void {
    this.form = {
      titulo: '',
      descricao: '',
      destinoTipo: 'turma',
      turmasDestino: [],
      destinatarios: [],
      anexos: []
    };
  }
}
