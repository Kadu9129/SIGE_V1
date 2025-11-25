import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-responsavel-area',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
  <div class="perfil-wrapper">
    <h1>Área do Responsável</h1>
    <section class="bloco">
      <h2>Dependentes</h2>
      <p>Lista de alunos vinculados (placeholder).</p>
    </section>
    <section class="bloco">
      <h2>Boletins</h2>
      <p>Notas e desempenho dos dependentes (placeholder).</p>
    </section>
    <section class="bloco">
      <h2>Frequência</h2>
      <p>Presença acumulada dos dependentes (placeholder).</p>
    </section>
    <section class="bloco">
      <h2>Financeiro</h2>
      <p>Resumo de mensalidades e status de pagamento (placeholder).</p>
    </section>
  </div>
  `,
  styles: [`
    .perfil-wrapper { padding: 1.5rem; }
    h1 { margin-bottom: 1rem; font-size: 1.6rem; }
    .bloco { background:#fff; border:1px solid #ddd; border-radius:6px; padding:1rem; margin-bottom:1rem; }
    .bloco h2 { margin:0 0 .5rem; font-size:1.1rem; }
  `]
})
export class ResponsavelAreaComponent {}
