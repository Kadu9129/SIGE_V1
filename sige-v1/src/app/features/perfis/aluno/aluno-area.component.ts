import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { AlunosApiService } from '../../../core/services/alunos-api.service';
import { Aluno } from '../../../core/models/aluno.model';
import { LoggerService } from '../../../core/services/logger.service';

@Component({
  selector: 'app-aluno-area',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './aluno-area.component.html',
  styleUrls: ['./aluno-area.component.css']
})
export class AlunoAreaComponent {
  aluno: Aluno | null = null;
  carregando = true;

  constructor(private auth: AuthService, private alunosApi: AlunosApiService, private logger: LoggerService) {}

  ngOnInit(): void {
    const user = this.auth.getCurrentUser();
    const role = (user?.role || '').toLowerCase();
    if (role !== 'aluno') {
      this.logger.warn('AlunoArea: role não é aluno', { role, user });
      this.carregando = false;
      return;
    }
    const usuarioId = user?.id ?? null;
    this.logger.log('AlunoArea: carregando aluno por UsuarioId', { usuarioId });
    // Se ainda não persistimos o id no AuthService, tentar buscar via fallback
    if (!usuarioId) {
      // Como o backend devolve Id no login, ideal persistir em AuthService. Por enquanto, sem id, não carregamos.
      this.logger.error('AlunoArea: usuário sem id no storage');
      this.carregando = false;
      return;
    }

    this.alunosApi.getByUsuarioId(usuarioId).subscribe({
      next: (res) => {
        this.aluno = res.data as Aluno;
        this.logger.info('AlunoArea: aluno carregado', this.aluno);
        this.carregando = false;
      },
      error: (err) => { this.logger.error('AlunoArea: erro ao carregar aluno', err); this.carregando = false; }
    });
  }

  onFotoSelecionada(evt: Event): void {
    const input = evt.target as HTMLInputElement;
    const file = input.files && input.files[0];
    if (!file || !this.aluno) return;
    this.logger.log('AlunoArea: upload foto iniciado', { fileName: file.name, size: file.size });
    this.alunosApi.uploadFoto(this.aluno.id, file).subscribe({
      next: (res) => {
        const url = res.data as string;
        if (url) {
          this.aluno!.fotoPerfil = url;
          this.logger.info('AlunoArea: foto atualizada', { url });
        }
      },
      error: (err) => { this.logger.error('AlunoArea: erro upload foto', err); }
    });
  }
}
