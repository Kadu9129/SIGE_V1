import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface ContatoForm {
  nome: string;
  email: string;
  mensagem: string;
}

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {
  contato: ContatoForm = {
    nome: '',
    email: '',
    mensagem: ''
  };

  enviarMensagem(): void {
    if (this.contato.nome && this.contato.email && this.contato.mensagem) {
      // Simular envio de mensagem
      console.log('Mensagem enviada:', this.contato);
      
      // Exibir mensagem de sucesso
      alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
      
      // Limpar formulário
      this.contato = {
        nome: '',
        email: '',
        mensagem: ''
      };
    } else {
      alert('Por favor, preencha todos os campos do formulário.');
    }
  }

  // Método para scroll suave para seções (se necessário)
  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
