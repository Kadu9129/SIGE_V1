import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { AuthService, AuthUser } from '../../../core/services/auth.service';
import { filter } from 'rxjs/operators';

interface NavItem {
  label: string;
  route?: string;
  icon: string;
  roles: string[];
  sectionId?: string; // ancora dentro de uma página (ex: painel admin)
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const ALL_ROLES = ['admin', 'diretor', 'professor', 'aluno', 'responsavel'];

@Component({
  selector: 'app-navegacao',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navegacao.component.html',
  styleUrls: ['./navegacao.component.css']
})
export class NavegacaoComponent implements OnInit {
  user: AuthUser | null = null;
  notifications = 3;
  sidebarCollapsed = false;
  visibleSections: NavSection[] = [];
  private currentRoute = '';
  private currentSectionParam: string | null = null;

  private readonly sections: NavSection[] = [
    {
      title: 'Principal',
      items: [
        { label: 'Dashboard', route: '/menu', icon: 'fas fa-th-large', roles: ALL_ROLES },
        { label: 'Secretaria Escolar', route: '/painel', icon: 'fas fa-building-columns', roles: ['admin', 'diretor'] },
        { label: 'Gestão de turmas', route: '/painel', icon: 'fas fa-users-gear', roles: ['admin', 'diretor'], sectionId: 'turmas-section' },
        { label: 'Avisos e materiais', route: '/painel', icon: 'fas fa-bullhorn', roles: ['admin', 'diretor'], sectionId: 'avisos-section' },
        { label: 'Dados acadêmicos', route: '/painel', icon: 'fas fa-folder-open', roles: ['admin', 'diretor'], sectionId: 'dados-academicos-section' },
        { label: 'Área do Professor', route: '/professor', icon: 'fas fa-chalkboard-teacher', roles: ['professor'] },
        { label: 'Área do Aluno', route: '/aluno', icon: 'fas fa-user-graduate', roles: ['aluno'] },
        { label: 'Área do Responsável', route: '/responsavel', icon: 'fas fa-users', roles: ['responsavel'] }
      ]
    },
    {
      title: 'Secretaria',
      items: [
        { label: 'Visão geral', route: '/painel', icon: 'fas fa-building-columns', roles: ['admin', 'diretor'], sectionId: 'top' },
        { label: 'Indicadores', route: '/painel', icon: 'fas fa-gauge-high', roles: ['admin', 'diretor'], sectionId: 'indicadores-section' },
        { label: 'Pendências', route: '/painel', icon: 'fas fa-clipboard-check', roles: ['admin', 'diretor'], sectionId: 'pendencias-section' },
        { label: 'Atendimentos', route: '/painel', icon: 'fas fa-bolt', roles: ['admin', 'diretor'], sectionId: 'acoes-section' },
        { label: 'Pré-matrícula', route: '/painel', icon: 'fas fa-user-plus', roles: ['admin', 'diretor'], sectionId: 'pre-matriculas-section' },
        { label: 'Transferências', route: '/painel', icon: 'fas fa-route', roles: ['admin', 'diretor'], sectionId: 'transferencias-section' },
        { label: 'Gestão de turmas', route: '/painel', icon: 'fas fa-users-gear', roles: ['admin', 'diretor'], sectionId: 'turmas-section' },
        { label: 'Avisos e materiais', route: '/painel', icon: 'fas fa-bullhorn', roles: ['admin', 'diretor'], sectionId: 'avisos-section' },
        { label: 'Lançamento acadêmico', route: '/painel', icon: 'fas fa-chalkboard-user', roles: ['admin', 'diretor'], sectionId: 'academico-professores-section' },
        { label: 'Boletim e frequência', route: '/painel', icon: 'fas fa-clipboard-user', roles: ['admin', 'diretor'], sectionId: 'academico-alunos-section' },
        { label: 'Dados acadêmicos', route: '/painel', icon: 'fas fa-folder-open', roles: ['admin', 'diretor'], sectionId: 'dados-academicos-section' },
        { label: 'Eventos', route: '/painel', icon: 'fas fa-calendar-days', roles: ['admin', 'diretor'], sectionId: 'eventos-section' },
        { label: 'Cadastros', route: '/painel', icon: 'fas fa-id-card', roles: ['admin', 'diretor'], sectionId: 'usuarios-section' }
      ]
    }
  ];

  private readonly professorSection: NavSection = {
    title: 'Professor',
    items: [
      { label: 'Visão geral', route: '/professor', icon: 'fas fa-chalkboard', roles: ['professor'], sectionId: 'prof-top' },
      { label: 'Menus principais', route: '/professor', icon: 'fas fa-th-large', roles: ['professor'], sectionId: 'prof-menu' },
      { label: 'Ações rápidas', route: '/professor', icon: 'fas fa-bolt', roles: ['professor'], sectionId: 'prof-acoes' },
      { label: 'Minhas turmas', route: '/professor', icon: 'fas fa-users-class', roles: ['professor'], sectionId: 'prof-turmas' },
      { label: 'Agenda do dia', route: '/professor', icon: 'fas fa-calendar-day', roles: ['professor'], sectionId: 'prof-agenda' },
      { label: 'Pendências', route: '/professor', icon: 'fas fa-list-check', roles: ['professor'], sectionId: 'prof-pendencias' },
      { label: 'Comunicados', route: '/professor', icon: 'fas fa-message', roles: ['professor'], sectionId: 'prof-comunicados' }
    ]
  };

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loadUser();
    this.updateCurrentRoute(this.router.url);
    this.buildMenu();
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(event => {
        const navEvent = event as NavigationEnd;
        this.updateCurrentRoute(navEvent.urlAfterRedirects);
        this.buildMenu();
      });
  }

  onNavClick(event: Event, item: NavItem): void {
    if (!item.route && !item.sectionId) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    if (item.sectionId && item.route) {
      const usesSectionParam = this.routeUsesSectionParam(item.route);
      event.preventDefault();
      if (usesSectionParam) {
        this.router.navigate([item.route], { queryParams: { section: item.sectionId } });
      } else {
        const targetRoute = item.route;
        const sectionId = item.sectionId;
        const sameRoute = this.currentRoute === targetRoute;

        if (sameRoute) {
          this.scrollToSection(sectionId);
        } else {
          this.router.navigate([targetRoute]).then(() => this.deferScroll(sectionId));
        }
      }
      return;
    }

    if (item.sectionId && !item.route) {
      event.preventDefault();
      this.scrollToSection(item.sectionId);
      return;
    }
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  logout(): void {
    this.authService.logout();
  }

  get userName(): string {
    return this.user?.nome ?? 'Usuário';
  }

  get userRole(): string {
    const role = this.user?.role ?? '';
    return role ? role.charAt(0).toUpperCase() + role.slice(1) : 'Perfil';
  }

  get userInitials(): string {
    if (!this.user?.nome) return '?';
    return this.user.nome
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(part => part.charAt(0).toUpperCase())
      .join('');
  }

  private loadUser(): void {
    this.user = this.authService.getCurrentUser();
    if (!this.user) {
      this.authService.logout();
    }
  }

  private buildMenu(): void {
    const role = this.user?.role?.toLowerCase() ?? '';
    const baseSections = this.sections
      .map(section => ({
        ...section,
        items: section.items.filter(item => item.roles.includes(role))
      }))
      .filter(section => section.items.length > 0);

    const extras: NavSection[] = [];
    if (role === 'professor' && this.isProfessorContext()) {
      extras.push(this.professorSection);
    }

    this.visibleSections = [...baseSections, ...extras];
  }

  private updateCurrentRoute(url: string): void {
    const [pathPart, queryPart] = url.split('?');
    this.currentRoute = pathPart.split('#')[0];
    this.currentSectionParam = this.extractSectionParam(queryPart);
  }

  private isProfessorContext(): boolean {
    return this.currentRoute.startsWith('/professor');
  }

  private scrollToSection(sectionId: string): void {
    if (typeof document === 'undefined') {
      return;
    }

    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  private deferScroll(sectionId: string): void {
    setTimeout(() => this.scrollToSection(sectionId), 150);
  }

  isItemActive(item: NavItem): boolean {
    if (!item.route) {
      return false;
    }
    if (item.sectionId && this.routeUsesSectionParam(item.route)) {
      return this.currentRoute.startsWith(item.route) && this.currentSectionParam === item.sectionId;
    }
    return this.currentRoute.startsWith(item.route);
  }

  private extractSectionParam(query?: string): string | null {
    if (!query) {
      return null;
    }
    try {
      const params = new URLSearchParams(query);
      return params.get('section');
    } catch {
      return null;
    }
  }

  private routeUsesSectionParam(route: string): boolean {
    return ['/professor', '/painel'].some(base => route.startsWith(base));
  }
}
