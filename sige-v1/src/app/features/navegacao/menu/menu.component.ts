import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AlunosApiService } from '../../../core/services/alunos-api.service';
import { ProfessoresApiService } from '../../../core/services/professores-api.service';
import { DashboardApiService } from '../../../core/services/dashboard-api.service';
import { AuthService, AuthUser } from '../../../core/services/auth.service';

interface Estatisticas {
  totalAlunos: number;
  totalProfessores: number;
  totalTurmas: number;
  totalMatriculas: number;
}

interface QuickAction {
	label: string;
	icon: string;
	route: string;
	roles: string[];
	description: string;
}

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {
  usuarioLogado: AuthUser | null = null;
  notificacoes = 3;

  estatisticas: Estatisticas = {
    totalAlunos: 0,
    totalProfessores: 0,
    totalTurmas: 0,
    totalMatriculas: 0
  };

  private readonly quickActions: QuickAction[] = [
	{ label: 'Cadastrar Aluno', icon: 'fas fa-user-plus', route: '/painel', roles: ['admin', 'diretor'], description: 'Adicionar novo estudante à base' },
	{ label: 'Cadastrar Professor', icon: 'fas fa-user-tie', route: '/painel', roles: ['admin', 'diretor'], description: 'Registrar um docente' },
	{ label: 'Ir para área do Professor', icon: 'fas fa-chalkboard-teacher', route: '/professor', roles: ['professor'], description: 'Acessar turmas e registros' },
	{ label: 'Ir para área do Aluno', icon: 'fas fa-user-graduate', route: '/aluno', roles: ['aluno'], description: 'Visualizar boletim e frequência' },
	{ label: 'Ir para área do Responsável', icon: 'fas fa-users', route: '/responsavel', roles: ['responsavel'], description: 'Acompanhar dependentes' }
  ];

  constructor(
    private authService: AuthService,
    private alunosApi: AlunosApiService,
    private professoresApi: ProfessoresApiService,
    private dashboardApi: DashboardApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.enforceAuth();
    this.carregarUsuario();
    this.carregarEstatisticas();
  }

  carregarUsuario(): void {
    this.usuarioLogado = this.authService.getCurrentUser();
  }

  get saudacao(): string {
	const hora = new Date().getHours();
	if (hora < 12) return 'Bom dia';
	if (hora < 18) return 'Boa tarde';
	return 'Boa noite';
  }

  get primeiroNome(): string {
	return this.usuarioLogado?.nome?.split(' ')[0] ?? 'Usuário';
  }

  carregarEstatisticas(): void {
    // Carrega contagem de alunos via API paginada
    this.alunosApi.list(1, 1).subscribe({
      next: (resp) => {
        this.estatisticas.totalAlunos = resp.data?.totalItems ?? 0;
      },
      error: () => { this.estatisticas.totalAlunos = 0; }
    });

    // Carrega contagem de professores
    this.professoresApi.list(1, 1).subscribe({
      next: (resp) => {
        this.estatisticas.totalProfessores = resp.data?.totalItems ?? 0;
      },
      error: () => { this.estatisticas.totalProfessores = 0; }
    });

    // Dashboard geral para turmas / matrículas (placeholder)
    this.dashboardApi.geral().subscribe({
      next: (geral) => {
        this.estatisticas.totalTurmas = geral.totalTurmas;
        this.estatisticas.totalMatriculas = geral.totalAlunos; // usar endpoint específico depois
      },
      error: () => {}
    });
  }

  get acoesRapidas(): QuickAction[] {
	const role = this.usuarioLogado?.role?.toLowerCase() ?? '';
	return this.quickActions.filter(action => action.roles.includes(role));
  }

  navegar(route: string): void {
	this.router.navigate([route]);
  }

  private enforceAuth(): void {
	if (!this.authService.isLoggedIn()) {
		this.authService.logout();
	}
  }
}
