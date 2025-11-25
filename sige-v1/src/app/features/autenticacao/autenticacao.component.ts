import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService, LoginCredentials } from '../../core/services/auth.service';
import { LoggerService } from '../../core/services/logger.service';
import { UsuariosApiService, CreateUsuario } from '../../core/services/usuarios-api.service';
import { Router } from '@angular/router';

interface RecuperarData {
  email: string;
}

interface CriarData {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
  tipo: string;
}

@Component({
  selector: 'app-autenticacao',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './autenticacao.component.html',
  styleUrl: './autenticacao.component.css'
})
export class AutenticacaoComponent {
  tabAtiva = 'login';
  mostrarSenha = false;
  carregando = false;
  mensagem = '';
  erro = false;
  loginData: LoginCredentials = {
    email: '',
    senha: '',
    lembrarMe: false
  };

  recuperarData: RecuperarData = {
    email: ''
  };

  criarData: CriarData = {
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    tipo: ''
  };

  constructor(private authService: AuthService, private router: Router, private usuariosApi: UsuariosApiService, private logger: LoggerService) {}

  selecionarTab(tab: string): void {
    this.tabAtiva = tab;
    this.limparMensagens();
  }

  toggleSenha(): void {
    this.mostrarSenha = !this.mostrarSenha;
  }

  realizarLogin(): void {
    if (!this.loginData.email || !this.loginData.senha) {
      this.exibirMensagem('Preencha email e senha.', true);
      return;
    }
    this.carregando = true;
    this.limparMensagens();
    this.authService.login(this.loginData).subscribe({
      next: (success) => {
        this.carregando = false;
        if (success) {
          this.exibirMensagem('Login realizado com sucesso!', false);
          setTimeout(() => {
            const user = this.authService.getCurrentUser();
            const role = (user?.role || '').toLowerCase().trim();
            let destino = '/painel';
            if (role === 'professor') destino = '/professor';
            else if (role === 'aluno') destino = '/aluno';
            else if (role === 'responsavel') destino = '/responsavel';
            else destino = '/painel'; // admin/diretor ou desconhecido
            this.logger.log('Redirect pós-login', { role, destino, user });
            this.router.navigate([destino]);
          }, 600);
        } else {
          this.exibirMensagem('Email ou senha incorretos.', true);
        }
      },
      error: () => {
        this.carregando = false;
        this.logger.error('Erro de comunicação no login');
        this.exibirMensagem('Erro ao comunicar com o servidor.', true);
      }
    });
  }

  recuperarSenha(): void {
    this.carregando = true;
    this.limparMensagens();

    // Simular envio de email
    setTimeout(() => {
      this.exibirMensagem(`Instruções de recuperação enviadas para ${this.recuperarData.email}`, false);
      this.carregando = false;
      
      // Limpar formulário
      this.recuperarData.email = '';
    }, 1500);
  }

  criarConta(): void {
    this.carregando = true;
    this.limparMensagens();

    if (!this.criarData.nome || !this.criarData.email || !this.criarData.tipo) {
      this.exibirMensagem('Preencha nome, email e tipo.', true);
      this.carregando = false;
      return;
    }
    if (this.criarData.senha !== this.criarData.confirmarSenha) {
      this.exibirMensagem('As senhas não coincidem.', true);
      this.carregando = false;
      return;
    }
    if (this.criarData.senha.length < 6) {
      this.exibirMensagem('A senha deve ter pelo menos 6 caracteres.', true);
      this.carregando = false;
      return;
    }

    const payload: CreateUsuario = {
      nome: this.criarData.nome,
      email: this.criarData.email,
      senha: this.criarData.senha,
      tipoUsuario: this.mapTipoUsuario(this.criarData.tipo)
    };

    this.usuariosApi.create(payload).subscribe({
      next: () => {
        this.exibirMensagem('Conta criada com sucesso! Faça login para continuar.', false);
        this.carregando = false;
        this.criarData = { nome: '', email: '', senha: '', confirmarSenha: '', tipo: '' };
        setTimeout(() => { this.tabAtiva = 'login'; this.limparMensagens(); }, 1500);
      },
      error: (err) => {
        const msg = err?.error?.message || 'Falha ao criar usuário.';
        this.exibirMensagem(msg, true);
        this.carregando = false;
      }
    });
  }

  private mapTipoUsuario(tipo: string): string {
    // Map valores simples do formulário para enum backend
    const map: Record<string,string> = {
      admin: 'Admin',
      diretor: 'Diretor',
      professor: 'Professor',
      aluno: 'Aluno',
      responsavel: 'Responsavel'
    };
    return map[tipo] || 'Aluno';
  }

  private exibirMensagem(mensagem: string, isErro: boolean): void {
    this.mensagem = mensagem;
    this.erro = isErro;
    
    // Limpar mensagem após 5 segundos
    setTimeout(() => {
      this.limparMensagens();
    }, 5000);
  }

  private limparMensagens(): void {
    this.mensagem = '';
    this.erro = false;
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      // Usuário autenticado, não precisa ver tela de login
      // Poderíamos redirecionar para /menu aqui se quisermos
    }

    const remembered = this.authService.getRememberedUser();
    if (remembered) {
      this.loginData.email = remembered;
      this.loginData.lembrarMe = true;
    }
  }
}
