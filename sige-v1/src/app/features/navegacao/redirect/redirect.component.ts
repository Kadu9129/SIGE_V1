import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LoggerService } from '../../../core/services/logger.service';

@Component({
  selector: 'app-redirect',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="redirecting">Redirecionando...</div>`,
  styles: [`.redirecting { padding: 1rem; color: #666; }`]
})
export class RedirectComponent {
  constructor(private router: Router, private auth: AuthService, private logger: LoggerService) {}

  ngOnInit(): void {
    const logged = this.auth.isLoggedIn();
    if (!logged) {
      this.logger.warn('RedirectComponent: not logged, go to /login');
      this.router.navigate(['/login']);
      return;
    }
    const user = this.auth.getCurrentUser();
    const role = (user?.role || '').toLowerCase().trim();
    let destino = '/painel';
    if (role === 'professor') destino = '/professor';
    else if (role === 'aluno') destino = '/aluno';
    else if (role === 'responsavel') destino = '/responsavel';
    else destino = '/painel';
    this.logger.log('RedirectComponent: role-based route', { role, destino, user });
    this.router.navigate([destino]);
  }
}
