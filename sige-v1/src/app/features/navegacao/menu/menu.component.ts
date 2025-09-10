import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { DadosService } from '../../../core/services/dados.service';

interface Usuario {
  nome: string;
  email: string;
  role: string;
}

interface Estatisticas {
  totalAlunos: number;
  totalProfessores: number;
  totalTurmas: number;
  totalMatriculas: number;
}

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {
  usuarioLogado: Usuario | null = null;
  sidebarCollapsed = false;
  menuAtivo = '';
  conteudoAtivo = false;
  tituloAtual = '';
  iconeAtual = '';
  mostrarBotaoNovo = false;
  notificacoes = 3;

  estatisticas: Estatisticas = {
    totalAlunos: 0,
    totalProfessores: 0,
    totalTurmas: 0,
    totalMatriculas: 0
  };

  constructor(
    private router: Router,
    private dadosService: DadosService
  ) {}

  ngOnInit(): void {
    this.verificarAutenticacao();
    this.carregarUsuario();
    this.carregarEstatisticas();
  }

  verificarAutenticacao(): void {
    const token = localStorage.getItem('sige_token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }
  }

  carregarUsuario(): void {
    const userData = localStorage.getItem('sige_user');
    if (userData) {
      this.usuarioLogado = JSON.parse(userData);
    }
  }

  carregarEstatisticas(): void {
    // Simular carregamento de estatísticas com dados do serviço
    this.dadosService.getAlunos().subscribe({
      next: (alunos) => {
        this.estatisticas.totalAlunos = alunos.length;
      },
      error: (error) => {
        console.error('Erro ao carregar alunos:', error);
        this.estatisticas.totalAlunos = 150; // Valor padrão
      }
    });

    this.dadosService.getProfessores().subscribe({
      next: (professores) => {
        this.estatisticas.totalProfessores = professores.length;
      },
      error: (error) => {
        console.error('Erro ao carregar professores:', error);
        this.estatisticas.totalProfessores = 25; // Valor padrão
      }
    });

    this.dadosService.getTurmas().subscribe({
      next: (turmas) => {
        this.estatisticas.totalTurmas = turmas.length;
      },
      error: (error) => {
        console.error('Erro ao carregar turmas:', error);
        this.estatisticas.totalTurmas = 12; // Valor padrão
      }
    });

    this.dadosService.getMatriculas().subscribe({
      next: (matriculas) => {
        this.estatisticas.totalMatriculas = matriculas.length;
      },
      error: (error) => {
        console.error('Erro ao carregar matrículas:', error);
        this.estatisticas.totalMatriculas = 145; // Valor padrão
      }
    });
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  navegarPara(secao: string, event: Event | null): void {
    if (event) {
      event.preventDefault();
    }

    this.menuAtivo = secao;
    this.conteudoAtivo = true;
    
    // Configurar o conteúdo baseado na seção
    switch (secao) {
      case 'dashboard':
        this.tituloAtual = 'Dashboard';
        this.iconeAtual = 'fas fa-tachometer-alt';
        this.mostrarBotaoNovo = false;
        break;
      case 'alunos':
        this.tituloAtual = 'Alunos';
        this.iconeAtual = 'fas fa-graduation-cap';
        this.mostrarBotaoNovo = true;
        break;
      case 'professores':
        this.tituloAtual = 'Professores';
        this.iconeAtual = 'fas fa-chalkboard-teacher';
        this.mostrarBotaoNovo = true;
        break;
      case 'turmas':
        this.tituloAtual = 'Turmas';
        this.iconeAtual = 'fas fa-users';
        this.mostrarBotaoNovo = true;
        break;
      case 'matriculas':
        this.tituloAtual = 'Matrículas';
        this.iconeAtual = 'fas fa-clipboard-list';
        this.mostrarBotaoNovo = true;
        break;
      case 'financeiro':
        this.tituloAtual = 'Financeiro';
        this.iconeAtual = 'fas fa-dollar-sign';
        this.mostrarBotaoNovo = false;
        break;
      case 'relatorios':
        this.tituloAtual = 'Relatórios';
        this.iconeAtual = 'fas fa-chart-bar';
        this.mostrarBotaoNovo = false;
        break;
      case 'configuracoes':
        this.tituloAtual = 'Configurações';
        this.iconeAtual = 'fas fa-cogs';
        this.mostrarBotaoNovo = false;
        break;
      default:
        this.conteudoAtivo = false;
        this.tituloAtual = 'Menu Principal';
        this.menuAtivo = '';
    }
  }

  logout(): void {
    // Confirmar logout
    if (confirm('Tem certeza que deseja sair do sistema?')) {
      // Limpar dados do localStorage
      localStorage.removeItem('sige_token');
      localStorage.removeItem('sige_user');
      
      // Redirecionar para login
      this.router.navigate(['/login']);
    }
  }

  // Método para voltar ao dashboard principal
  voltarAoDashboard(): void {
    this.conteudoAtivo = false;
    this.menuAtivo = '';
    this.tituloAtual = '';
  }
}
