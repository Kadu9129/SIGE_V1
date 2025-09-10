import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Usuario {
  id: number;
  nome: string;
  email: string;
  tipo: string;
  status: string;
  ultimoAcesso: Date;
}

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

interface Configuracoes {
  nomeInstituicao: string;
  anoLetivo: number;
  timezone: string;
  autenticacaoDupla: boolean;
  tempoSessao: number;
  logAuditoria: boolean;
  emailNotificacoes: boolean;
  smsNotificacoes: boolean;
}

@Component({
  selector: 'app-painel',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './painel.component.html',
  styleUrl: './painel.component.css'
})
export class PainelComponent implements OnInit {
  usuario: any = null;
  abaSelecionada = 'dashboard';
  
  estatisticas: Estatisticas = {
    usuariosAtivos: 142,
    sessoesAbertas: 23,
    uptime: 99.8,
    armazenamento: 45.2
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

  usuarios: Usuario[] = [
    {
      id: 1,
      nome: 'Administrador SIGE',
      email: 'admin@sige.edu.br',
      tipo: 'admin',
      status: 'ativo',
      ultimoAcesso: new Date()
    },
    {
      id: 2,
      nome: 'Prof. Ricardo Mendes',
      email: 'ricardo.mendes@sige.edu.br',
      tipo: 'professor',
      status: 'ativo',
      ultimoAcesso: new Date(Date.now() - 30 * 60 * 1000) // 30 min ago
    },
    {
      id: 3,
      nome: 'Ana Silva Santos',
      email: 'ana.santos@email.com',
      tipo: 'aluno',
      status: 'ativo',
      ultimoAcesso: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
    },
    {
      id: 4,
      nome: 'Maria Santos',
      email: 'maria.santos@email.com',
      tipo: 'responsavel',
      status: 'inativo',
      ultimoAcesso: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
    },
    {
      id: 5,
      nome: 'Prof. Carmen Silva',
      email: 'carmen.silva@sige.edu.br',
      tipo: 'professor',
      status: 'ativo',
      ultimoAcesso: new Date(Date.now() - 15 * 60 * 1000) // 15 min ago
    }
  ];

  configuracoes: Configuracoes = {
    nomeInstituicao: 'Colégio SIGE',
    anoLetivo: 2024,
    timezone: 'America/Sao_Paulo',
    autenticacaoDupla: false,
    tempoSessao: 60,
    logAuditoria: true,
    emailNotificacoes: true,
    smsNotificacoes: false
  };

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.verificarAutenticacao();
    this.carregarUsuario();
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
      this.usuario = JSON.parse(userData);
    }
  }

  selecionarAba(aba: string): void {
    this.abaSelecionada = aba;
  }

  logout(): void {
    if (confirm('Tem certeza que deseja sair do sistema?')) {
      localStorage.removeItem('sige_token');
      localStorage.removeItem('sige_user');
      this.router.navigate(['/login']);
    }
  }

  get usuariosFiltrados(): Usuario[] {
    return this.usuarios.filter(usuario => {
      const matchNome = usuario.nome.toLowerCase().includes(this.filtroUsuarios.toLowerCase());
      const matchEmail = usuario.email.toLowerCase().includes(this.filtroUsuarios.toLowerCase());
      const matchTipo = this.filtroTipo === '' || usuario.tipo === this.filtroTipo;
      
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

  salvarConfiguracoes(): void {
    // TODO: Implementar salvamento das configurações
    console.log('Configurações a serem salvas:', this.configuracoes);
    alert('Configurações salvas com sucesso!');
  }

  resetarConfiguracoes(): void {
    if (confirm('Tem certeza que deseja restaurar as configurações padrão?')) {
      this.configuracoes = {
        nomeInstituicao: 'Colégio SIGE',
        anoLetivo: 2024,
        timezone: 'America/Sao_Paulo',
        autenticacaoDupla: false,
        tempoSessao: 60,
        logAuditoria: true,
        emailNotificacoes: true,
        smsNotificacoes: false
      };
      alert('Configurações restauradas para os valores padrão!');
    }
  }

  gerarRelatorio(tipo: string): void {
    console.log(`Gerando relatório: ${tipo}`);
    
    // Simular geração de relatório
    const tiposRelatorio: { [key: string]: string } = {
      'usuarios-ativos': 'Relatório de Usuários Ativos',
      'log-acessos': 'Relatório de Log de Acessos',
      'performance': 'Relatório de Performance do Sistema',
      'erros': 'Relatório de Log de Erros'
    };

    const nomeRelatorio = tiposRelatorio[tipo] || 'Relatório';
    
    // Simular delay de geração
    alert(`Iniciando geração do ${nomeRelatorio}...`);
    
    setTimeout(() => {
      // TODO: Implementar geração real do relatório
      alert(`${nomeRelatorio} gerado com sucesso! O arquivo será baixado em breve.`);
      
      // Simular download do relatório
      this.downloadRelatorio(tipo);
    }, 2000);
  }

  private downloadRelatorio(tipo: string): void {
    // Simular download de um arquivo
    const content = this.gerarConteudoRelatorio(tipo);
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `relatorio-${tipo}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    
    // Limpar
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  private gerarConteudoRelatorio(tipo: string): string {
    const dataAtual = new Date().toLocaleString('pt-BR');
    
    const conteudos: { [key: string]: string } = {
      'usuarios-ativos': `RELATÓRIO DE USUÁRIOS ATIVOS - SIGE
Gerado em: ${dataAtual}
Total de usuários ativos: ${this.estatisticas.usuariosAtivos}

=== DETALHES ===
${this.usuarios.filter(u => u.status === 'ativo').map(u => 
  `- ${u.nome} (${u.email}) - Tipo: ${u.tipo} - Último acesso: ${u.ultimoAcesso.toLocaleString('pt-BR')}`
).join('\n')}`,

      'log-acessos': `RELATÓRIO DE LOG DE ACESSOS - SIGE
Gerado em: ${dataAtual}
Período: Últimas 24 horas
Total de acessos: 245

=== ACESSOS RECENTES ===
- admin@sige.edu.br - ${new Date().toLocaleString('pt-BR')} - IP: 192.168.1.10
- ricardo.mendes@sige.edu.br - ${new Date(Date.now() - 30*60*1000).toLocaleString('pt-BR')} - IP: 192.168.1.15
- ana.santos@email.com - ${new Date(Date.now() - 2*60*60*1000).toLocaleString('pt-BR')} - IP: 192.168.1.20`,

      'performance': `RELATÓRIO DE PERFORMANCE DO SISTEMA - SIGE
Gerado em: ${dataAtual}
Uptime: ${this.estatisticas.uptime}%
Sessões abertas: ${this.estatisticas.sessoesAbertas}
Uso de armazenamento: ${this.estatisticas.armazenamento}GB

=== MÉTRICAS ===
- Tempo de resposta médio: 120ms
- CPU: 15% de uso
- Memória: 2.1GB / 8GB
- Rede: 50Mbps disponível`,

      'erros': `RELATÓRIO DE LOG DE ERROS - SIGE
Gerado em: ${dataAtual}
Período: Últimas 24 horas
Total de erros: 3

=== ERROS REGISTRADOS ===
[ERROR] ${new Date(Date.now() - 4*60*60*1000).toLocaleString('pt-BR')} - Tentativa de acesso negada para IP 192.168.1.100
[WARN] ${new Date(Date.now() - 6*60*60*1000).toLocaleString('pt-BR')} - Timeout na conexão com banco de dados
[ERROR] ${new Date(Date.now() - 12*60*60*1000).toLocaleString('pt-BR')} - Falha no upload de arquivo para usuário ana.santos@email.com`
    };

    return conteudos[tipo] || `Relatório ${tipo} não encontrado.`;
  }
}
