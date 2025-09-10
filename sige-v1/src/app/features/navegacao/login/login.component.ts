import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface LoginData {
  email: string;
  password: string;
  lembrarMe: boolean;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginData: LoginData = {
    email: '',
    password: '',
    lembrarMe: false
  };

  mostrarSenha = false;
  carregando = false;
  mensagemErro = '';
  mensagemSucesso = '';

  constructor(private router: Router) {}

  realizarLogin(): void {
    if (this.carregando) return;

    this.carregando = true;
    this.mensagemErro = '';
    this.mensagemSucesso = '';

    // Simular chamada de API
    setTimeout(() => {
      // Validação simples para demonstração
      if (this.loginData.email === 'admin@sige.edu.br' && this.loginData.password === '123456') {
        this.mensagemSucesso = 'Login realizado com sucesso!';
        
        // Armazenar dados do usuário se "lembrar-me" estiver marcado
        if (this.loginData.lembrarMe) {
          localStorage.setItem('sige_remember_user', this.loginData.email);
        }
        
        // Simular armazenamento de token
        localStorage.setItem('sige_token', 'fake-jwt-token-' + Date.now());
        localStorage.setItem('sige_user', JSON.stringify({
          email: this.loginData.email,
          nome: 'Administrador',
          role: 'admin'
        }));

        // Redirecionar para o menu após 1.5 segundos
        setTimeout(() => {
          this.router.navigate(['/menu']);
        }, 1500);
      } else {
        this.mensagemErro = 'Email ou senha incorretos. Tente novamente.';
      }
      
      this.carregando = false;
    }, 2000); // Simular delay de rede
  }

  toggleMostrarSenha(): void {
    this.mostrarSenha = !this.mostrarSenha;
  }

  esqueceuSenha(event: Event): void {
    event.preventDefault();
    
    if (!this.loginData.email) {
      alert('Por favor, digite seu email primeiro e clique em "Esqueceu a senha?" novamente.');
      return;
    }

    // Simular envio de email de recuperação
    this.mensagemSucesso = `Um link de recuperação foi enviado para ${this.loginData.email}`;
    this.mensagemErro = '';
    
    // Limpar mensagem após 5 segundos
    setTimeout(() => {
      this.mensagemSucesso = '';
    }, 5000);
  }

  criarConta(event: Event): void {
    event.preventDefault();
    
    // Por enquanto, mostrar um alert
    alert('Funcionalidade de criação de conta ainda não implementada. Entre em contato com o administrador.');
    
    // Futuramente pode navegar para uma página de registro
    // this.router.navigate(['/registro']);
  }

  ngOnInit(): void {
    // Verificar se existe usuário lembrado
    const usuarioLembrado = localStorage.getItem('sige_remember_user');
    if (usuarioLembrado) {
      this.loginData.email = usuarioLembrado;
      this.loginData.lembrarMe = true;
    }

    // Verificar se já está logado
    const token = localStorage.getItem('sige_token');
    if (token) {
      this.router.navigate(['/menu']);
    }
  }
}
