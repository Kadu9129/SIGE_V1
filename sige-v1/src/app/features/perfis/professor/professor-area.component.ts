import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';

interface ProfessorMenuItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  route?: string;
}

interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: string;
}

interface TurmaResumo {
  id: string;
  nome: string;
  serie: string;
  alunos: number;
  proximaAula: string;
  sala: string;
}

interface AgendaItem {
  id: string;
  horario: string;
  descricao: string;
  turma: string;
  tipo: 'aula' | 'reuniao' | 'prazo';
}

interface PendenciaItem {
  id: string;
  titulo: string;
  detalhe: string;
  prazo: string;
  prioridade: 'alta' | 'media' | 'baixa';
}

interface ComunicadoItem {
  id: string;
  titulo: string;
  descricao: string;
  tempo: string;
}

type ProfessorSection =
  | 'resumo'
  | 'menus'
  | 'acoes'
  | 'turmas'
  | 'agenda'
  | 'pendencias'
  | 'comunicados';

@Component({
  selector: 'app-professor-area',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
  <section class="professor-panel">


    <div class="panel-view">
      <header class="panel-hero card" id="prof-top" *ngIf="isSection('resumo')">
        <div class="hero-text">
          <p class="eyebrow">Olá, {{ professor.nome }}</p>
          <h1>Painel do Professor</h1>
          <p class="lead">Veja suas turmas, agenda do dia e atalhos para as rotinas mais usadas.</p>
          <div class="hero-tags">
            <span class="tag">Disciplinas: {{ professor.disciplinas }}</span>
            <span class="tag">Turmas ativas: {{ turmas.length }}</span>
            <span class="tag success">Aulas hoje: {{ aulasHoje }}</span>
          </div>
        </div>
        <div class="hero-stats">
          <div>
            <small>Próxima aula</small>
            <strong>{{ proximaAtividade?.turma || '-' }}</strong>
            <span>{{ proximaAtividade?.horario || 'Sem agenda' }}</span>
          </div>
          <div>
            <small>Correções pendentes</small>
            <strong>{{ pendencias.length }}</strong>
            <span>Itens na fila</span>
          </div>
          <div>
            <small>Comunicados</small>
            <strong>{{ comunicados.length }}</strong>
            <span>Novidades recentes</span>
          </div>
        </div>
      </header>

      <section class="card" aria-labelledby="menu-professor" id="prof-menu" *ngIf="isSection('menus')">
      <header class="section-header">
        <div>
          <h2 id="menu-professor">Menus principais</h2>
          <p>Acesse rapidamente os módulos da área do professor.</p>
        </div>
      </header>
      <div class="menu-grid">
        <button class="menu-card" *ngFor="let item of menuPrincipal" (click)="navegar(item)">
          <div class="menu-icon">
            <i [class]="item.icon"></i>
          </div>
          <div class="menu-info">
            <strong>{{ item.title }}</strong>
            <p>{{ item.description }}</p>
          </div>
          <span class="menu-arrow"><i class="fas fa-arrow-right"></i></span>
        </button>
      </div>
    </section>

      <section class="card" *ngIf="isSection('acoes') && quickActions.length" id="prof-acoes">
      <header class="section-header">
        <div>
          <h2>Ações rápidas</h2>
          <p>Fluxos curtos para ganhar tempo.</p>
        </div>
      </header>
      <div class="action-grid">
        <button class="action-card" *ngFor="let action of quickActions" (click)="executarAcao(action)">
          <i [class]="action.icon"></i>
          <div>
            <strong>{{ action.label }}</strong>
            <p>{{ action.description }}</p>
          </div>
        </button>
      </div>
    </section>
 
      <section class="card" id="prof-turmas" *ngIf="isSection('turmas')">
        <header class="section-header">
          <div>
            <h2>Minhas turmas</h2>
            <p>Resumo rápido das turmas atribuídas.</p>
          </div>
        </header>
        <div class="turma-list">
          <article class="turma-card" *ngFor="let turma of turmas">
            <div>
              <h3>{{ turma.nome }}</h3>
              <p>{{ turma.serie }} • {{ turma.alunos }} alunos</p>
            </div>
            <div class="turma-next">
              <span>Próxima aula</span>
              <strong>{{ turma.proximaAula }}</strong>
              <small>Sala {{ turma.sala }}</small>
            </div>
          </article>
        </div>
      </section>

      <section class="card" id="prof-agenda" *ngIf="isSection('agenda')">
        <header class="section-header">
          <div>
            <h2>Agenda do dia</h2>
            <p>Próximos compromissos.</p>
          </div>
        </header>
        <ul class="agenda-list">
          <li *ngFor="let compromisso of agenda">
            <div class="agenda-time">{{ compromisso.horario }}</div>
            <div>
              <strong>{{ compromisso.descricao }}</strong>
              <p>{{ compromisso.turma }}</p>
            </div>
            <span class="agenda-badge" [ngClass]="compromisso.tipo">{{ compromisso.tipo }}</span>
          </li>
        </ul>
      </section>

      <section class="card" id="prof-pendencias" *ngIf="isSection('pendencias')">
        <header class="section-header">
          <div>
            <h2>Pendências</h2>
            <p>Atividades que exigem ação.</p>
          </div>
        </header>
        <ul class="pendencia-list">
          <li *ngFor="let item of pendencias">
            <div>
              <strong>{{ item.titulo }}</strong>
              <p>{{ item.detalhe }}</p>
            </div>
            <div class="pendencia-meta">
              <span class="pendencia-badge" [ngClass]="item.prioridade">{{ item.prioridade }}</span>
              <small>{{ item.prazo }}</small>
            </div>
          </li>
        </ul>
      </section>

      <section class="card" id="prof-comunicados" *ngIf="isSection('comunicados')">
        <header class="section-header">
          <div>
            <h2>Comunicados</h2>
            <p>Mensagens recentes da coordenação.</p>
          </div>
        </header>
        <ul class="comunicado-list">
          <li *ngFor="let aviso of comunicados">
            <div>
              <strong>{{ aviso.titulo }}</strong>
              <p>{{ aviso.descricao }}</p>
            </div>
            <span class="tempo">{{ aviso.tempo }}</span>
          </li>
        </ul>
      </section>
    </div>
  </section>
  `,
  styles: [`
    :host { display: block; }
    .professor-panel {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      padding: 1.5rem;
      background: #f5f6fb;
    }

    .card {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 8px 24px rgba(15, 23, 42, 0.05);
    }

    .panel-hero {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      gap: 1.5rem;
      background: linear-gradient(135deg, #eef2ff, #ffffff);
    }

    .hero-text { flex: 1 1 320px; }

    .eyebrow {
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #6366f1;
      margin-bottom: 0.25rem;
    }

    .panel-hero h1 { margin: 0; font-size: 1.9rem; color: #0f172a; }
    .lead { margin: 0.5rem 0 1rem; color: #475569; }

    .hero-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .tag {
      padding: 0.35rem 0.8rem;
      border-radius: 999px;
      background: rgba(15, 23, 42, 0.06);
      font-size: 0.85rem;
      color: #0f172a;
    }

    .tag.success {
      background: rgba(16, 185, 129, 0.15);
      color: #047857;
    }

    .hero-stats {
      flex: 1 1 260px;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 1rem;
    }

    .hero-stats div {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 1rem;
    }

    .hero-stats small { display: block; color: #94a3b8; margin-bottom: 0.25rem; }
    .hero-stats strong { display: block; font-size: 1.2rem; color: #111827; }
    .hero-stats span { color: #64748b; font-size: 0.9rem; }

    .panel-tabs {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      margin-top: -0.5rem;
    }

    .panel-tabs button {
      display: inline-flex;
      align-items: center;
      padding: 0.45rem 0.9rem;
      border-radius: 999px;
      font-size: 0.9rem;
      color: #475569;
      border: 1px solid #e2e8f0;
      background: transparent;
      cursor: pointer;
      transition: background 0.2s ease, color 0.2s ease;
    }

    .panel-tabs button:hover {
      background: #eef2ff;
      color: #312e81;
    }

    .panel-tabs button.active {
      background: #312e81;
      color: #fff;
      border-color: #312e81;
    }

    .panel-view {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      flex-wrap: wrap;
      align-items: center;
      border-bottom: 1px solid #f1f5f9;
      padding-bottom: 1rem;
    }

    .section-header h2 { margin: 0; font-size: 1.35rem; color: #0f172a; }
    .section-header p { margin: 0.2rem 0 0; color: #64748b; }

    .menu-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1rem;
    }

    .menu-card {
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      background: #fff;
      padding: 1rem;
      display: grid;
      grid-template-columns: auto 1fr auto;
      gap: 1rem;
      align-items: center;
      cursor: pointer;
      text-align: left;
      transition: box-shadow 0.2s ease, transform 0.2s ease;
    }

    .menu-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 24px rgba(15, 23, 42, 0.08);
    }

    .menu-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: #eef2ff;
      color: #4338ca;
      display: grid;
      place-items: center;
      font-size: 1.2rem;
    }

    .menu-info strong { display: block; color: #0f172a; }
    .menu-info p { margin: 0.25rem 0 0; color: #64748b; font-size: 0.9rem; }
    .menu-arrow { color: #94a3b8; }

    .action-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1rem;
    }

    .action-card {
      display: flex;
      gap: 1rem;
      align-items: flex-start;
      padding: 1rem;
      border-radius: 14px;
      border: 1px solid #e2e8f0;
      background: #f8fafc;
      text-align: left;
      cursor: pointer;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .action-card i { font-size: 1.3rem; color: #4f46e5; }
    .action-card strong { display: block; color: #0f172a; }
    .action-card p { margin: 0.2rem 0 0; color: #64748b; }

    .action-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 24px rgba(79, 70, 229, 0.12);
    }

    .panel-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
    }

    .turma-list { display: flex; flex-direction: column; gap: 1rem; }

    .turma-card {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 0.75rem;
      padding: 1rem;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      background: #f8fafc;
    }

    .turma-card h3 { margin: 0; color: #0f172a; }
    .turma-card p { margin: 0.25rem 0 0; color: #64748b; }

    .turma-next { text-align: right; }
    .turma-next span { display: block; font-size: 0.8rem; color: #94a3b8; }
    .turma-next strong { display: block; color: #111827; }
    .turma-next small { color: #94a3b8; }

    .agenda-list,
    .pendencia-list,
    .comunicado-list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .agenda-list li {
      display: grid;
      grid-template-columns: auto 1fr auto;
      gap: 1rem;
      align-items: center;
      padding: 0.75rem 0;
      border-bottom: 1px solid #f1f5f9;
    }

    .agenda-time {
      font-weight: 600;
      color: #1d4ed8;
    }

    .agenda-list p { margin: 0.2rem 0 0; color: #64748b; }

    .agenda-badge {
      padding: 0.3rem 0.8rem;
      border-radius: 999px;
      font-size: 0.75rem;
      text-transform: uppercase;
      background: #e0e7ff;
      color: #3730a3;
    }

    .agenda-badge.reuniao { background: #fef3c7; color: #92400e; }
    .agenda-badge.prazo { background: #fee2e2; color: #b91c1c; }

    .pendencia-list li,
    .comunicado-list li {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      border-bottom: 1px solid #f1f5f9;
      padding-bottom: 0.75rem;
    }

    .pendencia-badge {
      padding: 0.25rem 0.6rem;
      border-radius: 999px;
      font-size: 0.75rem;
      text-transform: capitalize;
    }

    .pendencia-badge.alta { background: #fee2e2; color: #b91c1c; }
    .pendencia-badge.media { background: #fef3c7; color: #92400e; }
    .pendencia-badge.baixa { background: #dcfce7; color: #15803d; }

    .pendencia-meta { text-align: right; }
    .pendencia-meta small { color: #94a3b8; }

    .tempo { color: #94a3b8; font-size: 0.85rem; }

    @media (max-width: 768px) {
      .professor-panel { padding: 1rem; }
      .panel-hero { flex-direction: column; }
      .hero-stats { grid-template-columns: 1fr; }
      .turma-card { flex-direction: column; text-align: left; }
      .turma-next { text-align: left; }
    }
  `]
})
export class ProfessorAreaComponent implements OnInit {
  constructor(private router: Router, private route: ActivatedRoute) {}

  professor = {
    nome: 'Profa. Renata Lima',
    disciplinas: 3
  };

  selectedSection: ProfessorSection = 'resumo';
  private readonly sectionFromParam: Record<string, ProfessorSection> = {
    'prof-top': 'resumo',
    'prof-menu': 'menus',
    'prof-acoes': 'acoes',
    'prof-turmas': 'turmas',
    'prof-agenda': 'agenda',
    'prof-pendencias': 'pendencias',
    'prof-comunicados': 'comunicados'
  };

  private readonly paramFromSection: Record<ProfessorSection, string> = {
    resumo: 'prof-top',
    menus: 'prof-menu',
    acoes: 'prof-acoes',
    turmas: 'prof-turmas',
    agenda: 'prof-agenda',
    pendencias: 'prof-pendencias',
    comunicados: 'prof-comunicados'
  };

  menuPrincipal: ProfessorMenuItem[] = [
    { id: 'turmas', title: 'Minhas turmas', description: 'Listas, horários e comunicados', icon: 'fas fa-users-class', route: '/professor/turmas' },
    { id: 'notas', title: 'Registro de notas', description: 'Avaliações e feedbacks', icon: 'fas fa-file-pen', route: '/professor/notas' },
    { id: 'frequencia', title: 'Frequência', description: 'Lançamento diário de presença', icon: 'fas fa-clipboard-check', route: '/professor/frequencia' },
    { id: 'materiais', title: 'Materiais', description: 'Planos e recursos compartilhados', icon: 'fas fa-folder-open', route: '/professor/materiais' }
  ];

  quickActions: QuickAction[] = [
    { id: 'nova-avaliacao', label: 'Nova avaliação', description: 'Criar avaliação para uma turma', icon: 'fas fa-star' },
    { id: 'frequencia', label: 'Registrar frequência', description: 'Atualizar lista de presença', icon: 'fas fa-user-check' },
    { id: 'avisar', label: 'Enviar comunicado', description: 'Mensagem rápida para os alunos', icon: 'fas fa-paper-plane' }
  ];

  turmas: TurmaResumo[] = [
    { id: '1', nome: 'Turma 9ºA', serie: '9º ano', alunos: 32, proximaAula: '13h20 - Matemática', sala: '203' },
    { id: '2', nome: 'Turma 8ºB', serie: '8º ano', alunos: 28, proximaAula: '15h10 - Geometria', sala: '205' },
    { id: '3', nome: 'Turma 1ºEM', serie: 'Ensino Médio', alunos: 35, proximaAula: '19h00 - Estatística', sala: 'Sala Maker' }
  ];

  agenda: AgendaItem[] = [
    { id: 'a1', horario: '13:20', descricao: 'Aula de Matemática', turma: '9ºA', tipo: 'aula' },
    { id: 'a2', horario: '15:10', descricao: 'Aula de Geometria', turma: '8ºB', tipo: 'aula' },
    { id: 'a3', horario: '17:30', descricao: 'Reunião com coordenação', turma: 'Sala 01', tipo: 'reuniao' },
    { id: 'a4', horario: '21:00', descricao: 'Envio de relatório bimestral', turma: 'Todas as turmas', tipo: 'prazo' }
  ];

  pendencias: PendenciaItem[] = [
    { id: 'p1', titulo: 'Corrigir prova diagnóstica', detalhe: 'Turma 9ºA - 32 alunos', prazo: 'Hoje, 22h', prioridade: 'alta' },
    { id: 'p2', titulo: 'Atualizar frequência', detalhe: 'Turma 1ºEM (últimas 2 aulas)', prazo: 'Amanhã', prioridade: 'media' },
    { id: 'p3', titulo: 'Planejar oficina de revisão', detalhe: 'Enviar materiais para coordenação', prazo: 'Sexta-feira', prioridade: 'baixa' }
  ];

  comunicados: ComunicadoItem[] = [
    { id: 'c1', titulo: 'Novo calendário de avaliações', descricao: 'Coordenação publicou cronograma atualizado.', tempo: 'Há 1 hora' },
    { id: 'c2', titulo: 'Semana de mentoria', descricao: 'Professores disponíveis para plantões.', tempo: 'Hoje cedo' },
    { id: 'c3', titulo: 'Feedback das famílias', descricao: '3 mensagens aguardando resposta.', tempo: 'Ontem' }
  ];

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const sectionParam = params.get('section');
      if (sectionParam && this.sectionFromParam[sectionParam]) {
        this.selectedSection = this.sectionFromParam[sectionParam];
      }
    });
  }

  selectSection(section: ProfessorSection): void {
    this.selectedSection = section;
    const sectionParam = this.paramFromSection[section];
    if (sectionParam) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { section: sectionParam },
        replaceUrl: true
      });
    }
  }

  isSection(section: ProfessorSection): boolean {
    return this.selectedSection === section;
  }

  get proximaAtividade(): AgendaItem | null {
    return this.agenda[0] ?? null;
  }

  get aulasHoje(): number {
    return this.agenda.filter(item => item.tipo === 'aula').length;
  }

  navegar(item: ProfessorMenuItem): void {
    if (item.route) {
      this.router.navigate([item.route]);
      return;
    }
    alert('Funcionalidade em desenvolvimento.');
  }

  executarAcao(acao: QuickAction): void {
    switch (acao.id) {
      case 'nova-avaliacao':
        alert('Abrindo fluxo para nova avaliação...');
        break;
      case 'frequencia':
        alert('Redirecionando para registro de frequência...');
        break;
      case 'avisar':
        alert('Abrindo envio de comunicado...');
        break;
      default:
        alert('Ação indisponível.');
    }
  }
}
