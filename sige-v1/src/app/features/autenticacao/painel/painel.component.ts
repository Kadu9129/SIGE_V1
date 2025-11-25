import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { DashboardApiService, DashboardGeral } from '../../../core/services/dashboard-api.service';
import { UsuariosApiService, Usuario } from '../../../core/services/usuarios-api.service';

// Usuario interface moved to usuarios-api.service import

interface Estatisticas {
  usuariosAtivos: number;
  sessoesAbertas: number;
  uptime: number;
  armazenamento: number;
}

interface Atividade {
  id: number;
  titulo: string;
  descricao: string;
  tempo: string;
  tipo: string;
  icone: string;
}

interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: string;
  handler: 'novoUsuario' | 'usuarios' | 'pendencias' | 'menuPrincipal';
}

type AdminSection = 'resumo' | 'indicadores' | 'pendencias' | 'acoes' | 'usuarios';

@Component({
  selector: 'app-painel',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './painel.component.html',
  styleUrl: './painel.component.shell.css'
})
export class PainelComponent implements OnInit {
  usuario: any = null;
  
  estatisticas: Estatisticas = {
    usuariosAtivos: 0,
    sessoesAbertas: 0,
    uptime: 0,
    armazenamento: 0
  };

  atividades: Atividade[] = [
    {
      id: 1,
      titulo: 'Novo usuário cadastrado',
      descricao: 'Prof. João Silva foi adicionado ao sistema',
      tempo: 'há 5 minutos',
      tipo: 'success',
      icone: 'fas fa-user-plus'
    },
    {
      id: 2,
      titulo: 'Backup realizado',
      descricao: 'Backup automático dos dados concluído com sucesso',
      tempo: 'há 1 hora',
      tipo: 'info',
      icone: 'fas fa-save'
    },
    {
      id: 3,
      titulo: 'Alerta de segurança',
      descricao: 'Tentativa de acesso negada para IP 192.168.1.100',
      tempo: 'há 2 horas',
      tipo: 'warning',
      icone: 'fas fa-shield-alt'
    },
    {
      id: 4,
      titulo: 'Sistema atualizado',
      descricao: 'Versão 2.1.3 instalada com sucesso',
      tempo: 'há 1 dia',
      tipo: 'success',
      icone: 'fas fa-sync-alt'
    }
  ];

  filtroUsuarios = '';
  filtroTipo = '';

  usuarios: Usuario[] = [];
  carregandoUsuarios = false;
  carregandoDashboard = false;
  dashboard: DashboardGeral | null = null;

  quickActions: QuickAction[] = [
    {
      id: 'novo-usuario',
      label: 'Cadastrar usuário',
      description: 'Abrir fluxo rápido para criação de usuários',
      icon: 'fas fa-user-plus',
      handler: 'novoUsuario'
    },
    {
      id: 'filtrar-usuarios',
      label: 'Filtrar usuários',
      description: 'Ir direto para a grade e aplicar filtros',
      icon: 'fas fa-filter',
      handler: 'usuarios'
    },
    {
      id: 'pendencias',
      label: 'Ver pendências',
      description: 'Revisar alertas ou atividades recentes',
      icon: 'fas fa-clipboard-check',
      handler: 'pendencias'
    },
    {
      id: 'menu',
      label: 'Menu principal',
      description: 'Voltar para o hub com todos os módulos',
      icon: 'fas fa-th-large',
      handler: 'menuPrincipal'
    }
  ];

  selectedSection: AdminSection = 'resumo';

  private readonly sectionFromParam: Record<string, AdminSection> = {
    top: 'resumo',
    'indicadores-section': 'indicadores',
    'pendencias-section': 'pendencias',
    'acoes-section': 'acoes',
    'usuarios-section': 'usuarios'
  };

  private readonly paramFromSection: Record<AdminSection, string> = {
    resumo: 'top',
    indicadores: 'indicadores-section',
    pendencias: 'pendencias-section',
    acoes: 'acoes-section',
    usuarios: 'usuarios-section'
  };

  constructor(
    private authService: AuthService,
    private dashService: DashboardApiService,
    private usuariosApi: UsuariosApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.verificarAutenticacao();
    this.carregarUsuario();
    this.carregarDashboard();
    this.carregarUsuarios();
    this.route.queryParamMap.subscribe(params => {
      const sectionParam = params.get('section');
      if (sectionParam && this.sectionFromParam[sectionParam]) {
        this.selectedSection = this.sectionFromParam[sectionParam];
      }
    });
  }

  carregarDashboard(): void {
    this.carregandoDashboard = true;
    this.dashService.geral().subscribe({
      next: data => {
        this.dashboard = data;
        this.estatisticas.usuariosAtivos = data.totalUsuarios;
        this.estatisticas.sessoesAbertas = data.totalTurmas; // placeholder
        this.estatisticas.uptime = 100; // estático MVP
        this.estatisticas.armazenamento = data.totalAlunos; // placeholder
      },
      error: () => {},
      complete: () => this.carregandoDashboard = false
    });
  }

  carregarUsuarios(): void {
    this.carregandoUsuarios = true;
    this.usuariosApi.list(1, 15).subscribe({
      next: lista => this.usuarios = lista,
      error: () => {},
      complete: () => this.carregandoUsuarios = false
    });
  }

  verificarAutenticacao(): void {
    if (!this.authService.isLoggedIn()) {
      this.authService.logout();
    }
  }

  carregarUsuario(): void {
    this.usuario = this.authService.getCurrentUser();
  }

  logout(): void {
    if (confirm('Tem certeza que deseja sair do sistema?')) {
      this.authService.logout();
    }
  }

  get saudacao(): string {
    const hora = new Date().getHours();
    if (hora < 12) {
      return 'Bom dia';
    }
    if (hora < 18) {
      return 'Boa tarde';
    }
    return 'Boa noite';
  }

  get primeiroNome(): string {
    return this.usuario?.nome?.split(' ')[0] ?? 'Administrador';
  }

  get ultimoAcesso(): string {
    const acesso = this.usuario?.ultimoAcesso;
    return acesso ? new Date(acesso).toLocaleString('pt-BR') : 'Não informado';
  }

  get usuariosFiltrados(): Usuario[] {
    return this.usuarios.filter(usuario => {
      const matchNome = usuario.nome.toLowerCase().includes(this.filtroUsuarios.toLowerCase());
      const matchEmail = usuario.email.toLowerCase().includes(this.filtroUsuarios.toLowerCase());
      const matchTipo = this.filtroTipo === '' || (usuario as any).tipo === this.filtroTipo;
      
      return (matchNome || matchEmail) && matchTipo;
    });
  }

  novoUsuario(): void {
    // TODO: Implementar modal ou navegar para página de criação de usuário
    alert('Funcionalidade em desenvolvimento: Criar novo usuário');
  }

  editarUsuario(usuario: Usuario): void {
    // TODO: Implementar modal ou navegar para página de edição
    alert(`Funcionalidade em desenvolvimento: Editar usuário ${usuario.nome}`);
  }

  confirmarExclusao(usuario: Usuario): void {
    if (confirm(`Tem certeza que deseja excluir o usuário ${usuario.nome}?`)) {
      // TODO: Implementar exclusão real
      this.usuarios = this.usuarios.filter(u => u.id !== usuario.id);
      alert('Usuário excluído com sucesso!');
    }
  }

  executarAcao(acao: QuickAction): void {
    switch (acao.handler) {
      case 'novoUsuario':
        this.novoUsuario();
        break;
      case 'usuarios':
        this.selectSection('usuarios');
        break;
      case 'pendencias':
        this.selectSection('pendencias');
        break;
      case 'menuPrincipal':
        this.router.navigate(['/menu']);
        break;
    }
  }

  selectSection(section: AdminSection): void {
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

  isSection(section: AdminSection): boolean {
    return this.selectedSection === section;
  }
}
