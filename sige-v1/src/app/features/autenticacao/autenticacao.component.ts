import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface LoginData {
  email: string;
  senha: string;
  lembrarMe: boolean;
}

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

  loginData: LoginData = {
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

  constructor(private router: Router) {}

  selecionarTab(tab: string): void {
    this.tabAtiva = tab;
    this.limparMensagens();
  }

  toggleSenha(): void {
    this.mostrarSenha = !this.mostrarSenha;
  }

  realizarLogin(): void {
    this.carregando = true;
    this.limparMensagens();

    // Simular chamada de API
    setTimeout(() => {
      if (this.loginData.email === 'admin@sige.edu.br' && this.loginData.senha === '123456') {
        this.exibirMensagem('Login realizado com sucesso!', false);
        
        // Armazenar dados do usuário
        if (this.loginData.lembrarMe) {
          localStorage.setItem('sige_remember_user', this.loginData.email);
        }
        
        localStorage.setItem('sige_token', 'fake-jwt-token-' + Date.now());
        localStorage.setItem('sige_user', JSON.stringify({
          email: this.loginData.email,
          nome: 'Administrador',
          role: 'admin'
        }));

        // Redirecionar após 1.5 segundos
        setTimeout(() => {
          this.router.navigate(['/menu']);
        }, 1500);
      } else {
        this.exibirMensagem('Email ou senha incorretos.', true);
      }
      
      this.carregando = false;
    }, 2000);
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

    // Validar senhas
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

    // Simular criação de conta
    setTimeout(() => {
      this.exibirMensagem('Conta criada com sucesso! Faça login para continuar.', false);
      this.carregando = false;
      
      // Limpar formulário e mudar para aba de login
      this.criarData = {
        nome: '',
        email: '',
        senha: '',
        confirmarSenha: '',
        tipo: ''
      };
      
      // Mudar para aba de login após 2 segundos
      setTimeout(() => {
        this.tabAtiva = 'login';
        this.limparMensagens();
      }, 2000);
    }, 2000);
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
    // Verificar se já está logado
    const token = localStorage.getItem('sige_token');
    if (token) {
      this.router.navigate(['/menu']);
    }

    // Verificar se existe usuário lembrado
    const usuarioLembrado = localStorage.getItem('sige_remember_user');
    if (usuarioLembrado) {
      this.loginData.email = usuarioLembrado;
      this.loginData.lembrarMe = true;
    }
  }
}
