import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { DashboardApiService, DashboardGeral } from '../../../core/services/dashboard-api.service';
import { UsuariosApiService, Usuario } from '../../../core/services/usuarios-api.service';
import {
  AcademicoAlunoResumo,
  Atividade,
  AvisoMaterial,
  AvisoMaterialPayload,
  DadosAcademicosAluno,
  DocumentoRequisito,
  EscolaDestino,
  Estatisticas,
  Evento,
  EventoPayload,
  LancamentoProfessorAluno,
  LancamentoProfessorDisciplina,
  LancamentoProfessorTurma,
  PreMatricula,
  QuickAction,
  SecretariaSection,
  Transferencia,
  TurmaAluno,
  TurmaCadastro,
  TurmaCadastroPayload,
  TurmaProfessor
} from './painel.model';
import { PainelPreMatriculaComponent } from './components/pre-matricula/pre-matricula.component';
import { PainelTransferenciasComponent } from './components/transferencias/transferencias.component';
import { PainelEventosComponent } from './components/eventos/eventos.component';
import { PainelLancamentoProfessorComponent } from './components/lancamento-professor/lancamento-professor.component';
import { PainelLancamentoAlunosComponent } from './components/lancamento-alunos/lancamento-alunos.component';
import { PainelGestaoTurmasComponent } from './components/gestao-turmas/gestao-turmas.component';
import { PainelAvisosMateriaisComponent } from './components/avisos-materiais/avisos-materiais.component';
import { PainelDadosAcademicosComponent } from './components/dados-academicos/dados-academicos.component';

@Component({
  selector: 'app-painel',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    PainelPreMatriculaComponent,
    PainelTransferenciasComponent,
    PainelEventosComponent,
    PainelLancamentoProfessorComponent,
    PainelLancamentoAlunosComponent,
    PainelGestaoTurmasComponent,
    PainelAvisosMateriaisComponent,
    PainelDadosAcademicosComponent
  ],
  templateUrl: './painel.component.html',
  styleUrl: './painel.component.shell.css'
})
export class PainelComponent implements OnInit {
  usuario: any = null;
  
  estatisticas: Estatisticas = {
    matriculasAtivas: 0,
    documentosPendentes: 0,
    solicitacoesHoje: 0,
    transferenciasEmCurso: 0
  };

  atividades: Atividade[] = [
    {
      id: 1,
      titulo: 'Transferência aprovada',
      descricao: 'Aluno Gabriel Souza movido para unidade Centro',
      tempo: 'há 5 minutos',
      tipo: 'success',
      icone: 'fas fa-route'
    },
    {
      id: 2,
      titulo: 'Histórico emitido',
      descricao: 'Declaração de matrícula enviada para família Silva',
      tempo: 'há 1 hora',
      tipo: 'info',
      icone: 'fas fa-file-export'
    },
    {
      id: 3,
      titulo: 'Documento pendente',
      descricao: 'Responsável aguarda assinatura digital',
      tempo: 'há 2 horas',
      tipo: 'warning',
      icone: 'fas fa-clipboard-list'
    },
    {
      id: 4,
      titulo: 'Nova matrícula iniciada',
      descricao: 'Ficha da aluna Sofia Andrade aguardando documentos',
      tempo: 'há 1 dia',
      tipo: 'success',
      icone: 'fas fa-id-card'
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
      id: 'nova-matricula',
      label: 'Nova matrícula',
      description: 'Iniciar cadastro de um novo aluno',
      icon: 'fas fa-id-card',
      handler: 'novaMatricula'
    },
    {
      id: 'emitir-documento',
      label: 'Documentos oficiais',
      description: 'Emitir declarações ou históricos',
      icon: 'fas fa-file-signature',
      handler: 'documentos'
    },
    {
      id: 'pendencias',
      label: 'Pendências da secretaria',
      description: 'Revisar solicitações urgentes',
      icon: 'fas fa-clipboard-check',
      handler: 'pendencias'
    },
    {
      id: 'transferencias',
      label: 'Transferências',
      description: 'Gerenciar solicitações entre unidades',
      icon: 'fas fa-route',
      handler: 'transferencias'
    },
    {
      id: 'gestao-turmas',
      label: 'Gestão de turmas',
      description: 'Criar turmas e vincular professores',
      icon: 'fas fa-users-gear',
      handler: 'turmas'
    },
    {
      id: 'lancamento-professor',
      label: 'Lançamento acadêmico',
      description: 'Notas e frequência por disciplina',
      icon: 'fas fa-chalkboard-user',
      handler: 'academicoProfessor'
    },
    {
      id: 'boletim-alunos',
      label: 'Boletim das famílias',
      description: 'Compartilhar notas e frequência',
      icon: 'fas fa-clipboard-user',
      handler: 'academicoAlunos'
    },
    {
      id: 'avisos-materiais',
      label: 'Avisos e materiais',
      description: 'Publicar comunicados oficiais',
      icon: 'fas fa-bullhorn',
      handler: 'avisos'
    },
    {
      id: 'eventos',
      label: 'Eventos oficiais',
      description: 'Publicar calendário institucional',
      icon: 'fas fa-calendar-star',
      handler: 'eventos'
    },
    {
      id: 'dados-academicos',
      label: 'Dados acadêmicos',
      description: 'Histórico escolar e médias finais',
      icon: 'fas fa-folder-open',
      handler: 'dadosAcademicos'
    },
    {
      id: 'menu',
      label: 'Menu principal',
      description: 'Voltar para o hub com todos os módulos',
      icon: 'fas fa-th-large',
      handler: 'menuPrincipal'
    }
  ];

  selectedSection: SecretariaSection = 'resumo';
  preMatriculas: PreMatricula[] = [
    {
      id: 'PM-2345',
      aluno: 'Marina Nascimento',
      responsavel: 'Laura Nascimento',
      serie: '6º ano',
      dataEnvio: '2025-11-20T10:30:00Z',
      status: 'aguardando',
      documentos: [
        { tipo: 'RG', status: 'enviado' },
        { tipo: 'CPF', status: 'enviado' },
        { tipo: 'Comprovante', status: 'pendente' },
        { tipo: 'Histórico', status: 'pendente' }
      ]
    },
    {
      id: 'PM-2346',
      aluno: 'Pedro Henrique Alves',
      responsavel: 'Roberta Alves',
      serie: '1º EM',
      dataEnvio: '2025-11-22T09:10:00Z',
      status: 'aprovado',
      documentos: [
        { tipo: 'RG', status: 'aceito' },
        { tipo: 'CPF', status: 'aceito' },
        { tipo: 'Comprovante', status: 'aceito' },
        { tipo: 'Histórico', status: 'aceito' }
      ]
    },
    {
      id: 'PM-2347',
      aluno: 'João Victor Paiva',
      responsavel: 'Luciano Paiva',
      serie: '8º ano',
      dataEnvio: '2025-11-23T14:45:00Z',
      status: 'indeferido',
      observacoes: 'Documentação incompleta',
      documentos: [
        { tipo: 'RG', status: 'enviado' },
        { tipo: 'CPF', status: 'pendente' },
        { tipo: 'Comprovante', status: 'recusado' },
        { tipo: 'Histórico', status: 'pendente' }
      ]
    }
  ];
  preMatriculaSelecionada: PreMatricula | null = null;
  filtroPreMatricula: 'todas' | 'aguardando' | 'aprovado' | 'indeferido' = 'todas';
  readonly statusLabels: Record<PreMatricula['status'], string> = {
    aguardando: 'Aguardando análise',
    aprovado: 'Aprovada',
    indeferido: 'Indeferida'
  };
  readonly statusClasses: Record<PreMatricula['status'], string> = {
    aguardando: 'warning',
    aprovado: 'success',
    indeferido: 'error'
  };
  destinosTransferencia: EscolaDestino[] = [
    {
      id: 'sig-centro',
      nome: 'Colégio SIGE - Centro',
      cidade: 'Belo Horizonte',
      vagas: 4,
      nivel: 'Fundamental'
    },
    {
      id: 'sig-sul',
      nome: 'Colégio SIGE - Zona Sul',
      cidade: 'Belo Horizonte',
      vagas: 2,
      nivel: 'Médio'
    },
    {
      id: 'sig-contagem',
      nome: 'Colégio SIGE - Contagem',
      cidade: 'Contagem',
      vagas: 6,
      nivel: 'Fundamental'
    }
  ];
  solicitacoesTransferencia: Transferencia[] = [
    {
      id: 'TR-2401',
      aluno: 'Igor Mendes',
      origem: 'Colégio SIGE - Pampulha',
      status: 'emAnalise',
      justificativa: '',
      solicitante: 'Secretaria - Pampulha',
      dataSolicitacao: '2025-11-21T09:15:00Z',
      dataAtualizacao: '2025-11-21T10:00:00Z'
    },
    {
      id: 'TR-2402',
      aluno: 'Bruna Costa',
      origem: 'Colégio SIGE - Betim',
      destinoId: 'sig-centro',
      destino: 'Colégio SIGE - Centro',
      status: 'rascunho',
      justificativa: 'Aproximação da nova residência',
      solicitante: 'Secretaria - Betim',
      dataSolicitacao: '2025-11-22T11:40:00Z',
      dataAtualizacao: '2025-11-22T11:45:00Z'
    }
  ];
  historicoTransferencias: Transferencia[] = [
    {
      id: 'TR-2390',
      aluno: 'Maria Eduarda Ramos',
      origem: 'Colégio SIGE - Pampulha',
      destinoId: 'sig-centro',
      destino: 'Colégio SIGE - Centro',
      status: 'concluida',
      justificativa: 'Mudança de endereço da família',
      solicitante: 'Secretaria Central',
      dataSolicitacao: '2025-10-10T08:00:00Z',
      dataAtualizacao: '2025-10-12T15:30:00Z'
    },
    {
      id: 'TR-2388',
      aluno: 'Lucas Almeida',
      origem: 'Colégio SIGE - Zona Norte',
      destinoId: 'sig-contagem',
      destino: 'Colégio SIGE - Contagem',
      status: 'cancelada',
      justificativa: 'Documentação incompleta',
      solicitante: 'Secretaria Zona Norte',
      dataSolicitacao: '2025-09-28T14:00:00Z',
      dataAtualizacao: '2025-09-29T09:20:00Z'
    }
  ];
  transferenciaSelecionada: Transferencia | null = null;
  readonly transferenciaStatusLabels: Record<Transferencia['status'], string> = {
    rascunho: 'Rascunho',
    emAnalise: 'Em análise',
    concluida: 'Concluída',
    cancelada: 'Cancelada'
  };
  readonly transferenciaStatusClasses: Record<Transferencia['status'], string> = {
    rascunho: 'warning',
    emAnalise: 'info',
    concluida: 'success',
    cancelada: 'error'
  };
  professoresDisponiveis: TurmaProfessor[] = [
    { id: 'prof-mat', nome: 'Carla Mendes', especialidade: 'Matemática', disponibilidade: 'Manhã' },
    { id: 'prof-por', nome: 'Renato Souza', especialidade: 'Língua Portuguesa', disponibilidade: 'Tarde' },
    { id: 'prof-his', nome: 'Aline Figueiredo', especialidade: 'História', disponibilidade: 'Integral' }
  ];
  alunosDisponiveisTurma: TurmaAluno[] = [
    { id: 'acad-001', nome: 'Marina Nascimento', serie: '9º Ano' },
    { id: 'acad-002', nome: 'Pedro Henrique Alves', serie: '1º EM' },
    { id: 'acad-003', nome: 'João Victor Paiva', serie: '9º Ano' },
    { id: 'acad-004', nome: 'Sofia Andrade', serie: '9º Ano' },
    { id: 'acad-005', nome: 'Igor Mendes', serie: '9º Ano' },
    { id: 'acad-006', nome: 'Bruna Costa', serie: '1º EM' }
  ];
  turmasSecretaria: TurmaCadastro[] = [
    {
      id: 'TUR-901',
      nome: '9º Ano A',
      etapa: 'Fundamental II',
      turno: 'Manhã',
      capacidade: 32,
      professor: { id: 'prof-mat', nome: 'Carla Mendes', especialidade: 'Matemática' },
      alunos: [
        { id: 'acad-001', nome: 'Marina Nascimento', serie: '9º Ano' },
        { id: 'acad-003', nome: 'João Victor Paiva', serie: '9º Ano' },
        { id: 'acad-004', nome: 'Sofia Andrade', serie: '9º Ano' },
        { id: 'acad-005', nome: 'Igor Mendes', serie: '9º Ano' }
      ],
      status: 'ativo',
      sala: '201'
    },
    {
      id: 'TUR-1EMA',
      nome: '1º EM A',
      etapa: 'Ensino Médio',
      turno: 'Manhã',
      capacidade: 28,
      professor: { id: 'prof-por', nome: 'Renato Souza', especialidade: 'Língua Portuguesa' },
      alunos: [
        { id: 'acad-002', nome: 'Pedro Henrique Alves', serie: '1º EM' },
        { id: 'acad-006', nome: 'Bruna Costa', serie: '1º EM' }
      ],
      status: 'planejado',
      sala: '301'
    }
  ];
  turmaSecretariaSelecionada: TurmaCadastro | null = null;
  avisosMateriais: AvisoMaterial[] = [
    {
      id: 'AV-0001',
      titulo: 'Entrega de projeto integrador',
      descricao: 'Lembramos que o projeto deve ser entregue até sexta-feira com assinatura do responsável.',
      destinoTipo: 'turma',
      turmasDestino: ['TUR-901'],
      dataEnvio: '2025-11-23T08:15:00Z',
      autor: 'Secretaria Escolar',
      anexos: [
        { id: 'anx-01', nome: 'Roteiro do projeto', tipo: 'pdf', url: '#' }
      ]
    },
    {
      id: 'AV-0002',
      titulo: 'Reunião geral de pais',
      descricao: 'Convocação para a reunião de encerramento do semestre, às 19h no auditório principal.',
      destinoTipo: 'escola',
      dataEnvio: '2025-11-20T17:30:00Z',
      autor: 'Diretoria Pedagógica',
      anexos: [
        { id: 'anx-02', nome: 'Convite oficial', tipo: 'imagem', url: '#' },
        { id: 'anx-03', nome: 'Link da transmissão', tipo: 'link', url: '#' }
      ]
    }
  ];
  lancamentoProfessorDisciplinas: LancamentoProfessorDisciplina[] = [
    {
      id: 'mat-9ano',
      nome: 'Matemática',
      serie: '9º ano',
      turmas: [
        {
          id: '9A',
          nome: '9º Ano A',
          turno: 'Manhã',
          dataReferencia: '2025-11-25T00:00:00Z',
          alunos: [
            { id: 'acad-001', nome: 'Marina Nascimento', nota: 8.5, frequencia: 'presente', ultimaAtualizacao: '2025-11-25T09:05:00Z' },
            { id: 'acad-002', nome: 'Pedro Henrique Alves', nota: 7.2, frequencia: 'presente', ultimaAtualizacao: '2025-11-25T09:08:00Z' },
            { id: 'acad-003', nome: 'João Victor Paiva', nota: null, frequencia: null }
          ]
        },
        {
          id: '9B',
          nome: '9º Ano B',
          turno: 'Tarde',
          dataReferencia: '2025-11-25T00:00:00Z',
          alunos: [
            { id: 'acad-004', nome: 'Sofia Andrade', nota: 9.1, frequencia: 'presente', ultimaAtualizacao: '2025-11-25T13:05:00Z' },
            { id: 'acad-005', nome: 'Igor Mendes', nota: 6.8, frequencia: 'atraso', ultimaAtualizacao: '2025-11-25T13:10:00Z' }
          ]
        }
      ]
    },
    {
      id: 'por-ensino-medio',
      nome: 'Língua Portuguesa',
      serie: '1º EM',
      turmas: [
        {
          id: '1EM-A',
          nome: '1º EM A',
          turno: 'Manhã',
          dataReferencia: '2025-11-25T00:00:00Z',
          alunos: [
            { id: 'acad-006', nome: 'Bruna Costa', nota: 8.9, frequencia: 'presente', ultimaAtualizacao: '2025-11-25T08:45:00Z' },
            { id: 'acad-007', nome: 'Lucas Almeida', nota: null, frequencia: 'ausente' },
            { id: 'acad-008', nome: 'Maria Eduarda Ramos', nota: 7.5, frequencia: 'presente', ultimaAtualizacao: '2025-11-25T08:55:00Z' }
          ]
        }
      ]
    }
  ];
  disciplinaLancamentoSelecionada: LancamentoProfessorDisciplina | null = null;
  turmaLancamentoSelecionada: LancamentoProfessorTurma | null = null;
  readonly frequenciaOptions = [
    { value: 'presente' as const, label: 'Presente', badge: 'success' },
    { value: 'ausente' as const, label: 'Falta', badge: 'error' },
    { value: 'atraso' as const, label: 'Atraso', badge: 'warning' }
  ];
  academicoAlunos: AcademicoAlunoResumo[] = [
    {
      id: 'acad-001',
      nome: 'Marina Nascimento',
      turma: '9º Ano A',
      boletim: [
        { id: 'MAT', nome: 'Matemática', media: 8.6, situacao: 'excelente', ultimaAtualizacao: '2025-11-22T00:00:00Z' },
        { id: 'POR', nome: 'Português', media: 8.1, situacao: 'regular', ultimaAtualizacao: '2025-11-20T00:00:00Z' },
        { id: 'CIE', nome: 'Ciências', media: 9.0, situacao: 'excelente', ultimaAtualizacao: '2025-11-18T00:00:00Z' }
      ],
      frequencia: [
        { periodo: 'Set/2025', percentual: 97 },
        { periodo: 'Out/2025', percentual: 95 },
        { periodo: 'Nov/2025', percentual: 96 }
      ],
      historicoNotas: [
        { etapa: '1º Bimestre', data: '2025-03-30T00:00:00Z', nota: 8.2, descricao: 'Prova bimestral' },
        { etapa: '2º Bimestre', data: '2025-06-30T00:00:00Z', nota: 8.8, descricao: 'Projeto integrador' },
        { etapa: '3º Bimestre', data: '2025-09-30T00:00:00Z', nota: 9.0, descricao: 'Avaliação contínua' }
      ]
    },
    {
      id: 'acad-002',
      nome: 'Pedro Henrique Alves',
      turma: '1º EM A',
      boletim: [
        { id: 'MAT', nome: 'Matemática', media: 7.2, situacao: 'regular', ultimaAtualizacao: '2025-11-21T00:00:00Z' },
        { id: 'POR', nome: 'Português', media: 7.8, situacao: 'regular', ultimaAtualizacao: '2025-11-19T00:00:00Z' },
        { id: 'HIS', nome: 'História', media: 6.5, situacao: 'atencao', ultimaAtualizacao: '2025-11-17T00:00:00Z' }
      ],
      frequencia: [
        { periodo: 'Set/2025', percentual: 91 },
        { periodo: 'Out/2025', percentual: 88 },
        { periodo: 'Nov/2025', percentual: 90 }
      ],
      historicoNotas: [
        { etapa: 'Simulado ENEM', data: '2025-08-15T00:00:00Z', nota: 7.1 },
        { etapa: 'Redação guiada', data: '2025-09-20T00:00:00Z', nota: 7.8 }
      ]
    },
    {
      id: 'acad-003',
      nome: 'João Victor Paiva',
      turma: '9º Ano B',
      boletim: [
        { id: 'MAT', nome: 'Matemática', media: 6.4, situacao: 'atencao', ultimaAtualizacao: '2025-11-19T00:00:00Z' },
        { id: 'GEO', nome: 'Geografia', media: 7.5, situacao: 'regular', ultimaAtualizacao: '2025-11-18T00:00:00Z' }
      ],
      frequencia: [
        { periodo: 'Set/2025', percentual: 92 },
        { periodo: 'Out/2025', percentual: 85 },
        { periodo: 'Nov/2025', percentual: 88 }
      ],
      historicoNotas: [
        { etapa: 'Recuperação paralela', data: '2025-10-05T00:00:00Z', nota: 6.8, descricao: 'Atividade monitorada' }
      ]
    }
  ];
  dadosAcademicosAlunos: DadosAcademicosAluno[] = [
    {
      id: 'acad-001',
      nome: 'Marina Nascimento',
      turma: '9º Ano A',
      curso: 'Fundamental II',
      mediaFinal: 8.7,
      historico: [
        { ano: '2023', serie: '8º ano', situacao: 'aprovado', mediaFinal: 8.5 },
        { ano: '2024', serie: '9º ano', situacao: 'cursando', mediaFinal: 8.7 }
      ],
      boletim: [
        { id: 'MAT', nome: 'Matemática', media: 8.9, situacao: 'excelente', ultimaAtualizacao: '2025-11-22T00:00:00Z' },
        { id: 'POR', nome: 'Português', media: 8.2, situacao: 'regular', ultimaAtualizacao: '2025-11-21T00:00:00Z' },
        { id: 'CIE', nome: 'Ciências', media: 9.3, situacao: 'excelente', ultimaAtualizacao: '2025-11-20T00:00:00Z' }
      ],
      frequenciaMensal: [
        { periodo: 'Set/2025', percentual: 97 },
        { periodo: 'Out/2025', percentual: 95 },
        { periodo: 'Nov/2025', percentual: 96 }
      ]
    },
    {
      id: 'acad-002',
      nome: 'Pedro Henrique Alves',
      turma: '1º EM A',
      curso: 'Ensino Médio',
      mediaFinal: 7.4,
      historico: [
        { ano: '2023', serie: '9º ano', situacao: 'aprovado', mediaFinal: 7.8 },
        { ano: '2024', serie: '1º EM', situacao: 'cursando', mediaFinal: 7.4 }
      ],
      boletim: [
        { id: 'MAT', nome: 'Matemática', media: 7.1, situacao: 'regular', ultimaAtualizacao: '2025-11-21T00:00:00Z' },
        { id: 'HIS', nome: 'História', media: 6.9, situacao: 'atencao', ultimaAtualizacao: '2025-11-18T00:00:00Z' },
        { id: 'BIO', nome: 'Biologia', media: 7.6, situacao: 'regular', ultimaAtualizacao: '2025-11-19T00:00:00Z' }
      ],
      frequenciaMensal: [
        { periodo: 'Set/2025', percentual: 92 },
        { periodo: 'Out/2025', percentual: 88 },
        { periodo: 'Nov/2025', percentual: 90 }
      ]
    }
  ];
  alunoDadosSelecionado: DadosAcademicosAluno | null = null;
  alunoAcademicoSelecionado: AcademicoAlunoResumo | null = null;
  eventos: Evento[] = [
    {
      id: 'EV-0125',
      titulo: 'Mostra Cultural 2025',
      descricao: 'Apresentações artísticas e exposição de projetos integradores.',
      data: '2025-12-10',
      icone: 'fas fa-palette',
      categoria: 'Comunitário'
    },
    {
      id: 'EV-0126',
      titulo: 'Feira de Profissões',
      descricao: 'Universidades convidadas para orientação dos alunos do ensino médio.',
      data: '2025-12-15',
      icone: 'fas fa-graduation-cap',
      categoria: 'Acadêmico'
    },
    {
      id: 'EV-0127',
      titulo: 'Encontro com Pais e Responsáveis',
      descricao: 'Apresentação das metas para o próximo semestre e devolutiva das avaliações.',
      data: '2026-01-05',
      icone: 'fas fa-handshake',
      categoria: 'Institucional'
    }
  ];
  readonly categoriasEventos: Evento['categoria'][] = ['Acadêmico', 'Institucional', 'Comunitário'];
  readonly opcoesIconesEventos = [
    { label: 'Acadêmico', value: 'fas fa-graduation-cap' },
    { label: 'Institucional', value: 'fas fa-handshake' },
    { label: 'Comunitário', value: 'fas fa-people-group' },
    { label: 'Cultura', value: 'fas fa-palette' },
    { label: 'Esportivo', value: 'fas fa-trophy' }
  ];

  private readonly sectionFromParam: Record<string, SecretariaSection> = {
    top: 'resumo',
    'indicadores-section': 'indicadores',
    'pendencias-section': 'pendencias',
    'acoes-section': 'acoes',
    'usuarios-section': 'cadastros',
    'pre-matriculas-section': 'preMatriculas',
    'transferencias-section': 'transferencias',
    'eventos-section': 'eventos',
    'academico-professores-section': 'academicoProfessor',
    'academico-alunos-section': 'academicoAlunos',
    'turmas-section': 'turmas',
    'avisos-section': 'avisos',
    'dados-academicos-section': 'dadosAcademicos'
  };

  private readonly paramFromSection: Record<SecretariaSection, string> = {
    resumo: 'top',
    indicadores: 'indicadores-section',
    pendencias: 'pendencias-section',
    acoes: 'acoes-section',
    cadastros: 'usuarios-section',
    preMatriculas: 'pre-matriculas-section',
    transferencias: 'transferencias-section',
    eventos: 'eventos-section',
    academicoProfessor: 'academico-professores-section',
    academicoAlunos: 'academico-alunos-section',
    turmas: 'turmas-section',
    avisos: 'avisos-section',
    dadosAcademicos: 'dados-academicos-section'
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
    this.preMatriculaSelecionada = this.preMatriculas[0] ?? null;
    this.transferenciaSelecionada = this.solicitacoesTransferencia[0] ?? null;
    this.estatisticas.transferenciasEmCurso = this.solicitacoesTransferencia.length;
    this.turmaSecretariaSelecionada = this.turmasSecretaria[0] ?? null;
    this.disciplinaLancamentoSelecionada = this.lancamentoProfessorDisciplinas[0] ?? null;
    this.turmaLancamentoSelecionada = this.disciplinaLancamentoSelecionada?.turmas[0] ?? null;
    this.alunoAcademicoSelecionado = this.academicoAlunos[0] ?? null;
    this.alunoDadosSelecionado = this.dadosAcademicosAlunos[0] ?? null;
    this.recalcularPendencias();
  }

  carregarDashboard(): void {
    this.carregandoDashboard = true;
    this.dashService.geral().subscribe({
      next: data => {
        this.dashboard = data;
        this.estatisticas.matriculasAtivas = data.totalAlunos;
        this.estatisticas.documentosPendentes = data.totalTurmas; // placeholder
        this.estatisticas.solicitacoesHoje = data.totalUsuarios; // placeholder
        this.estatisticas.transferenciasEmCurso = data.totalProfessores; // placeholder
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
      case 'novaMatricula':
        this.novaMatricula();
        break;
      case 'documentos':
        this.emitirDocumento();
        break;
      case 'pendencias':
        this.selectSection('pendencias');
        break;
      case 'transferencias':
        this.selectSection('transferencias');
        break;
      case 'turmas':
        this.selectSection('turmas');
        break;
      case 'academicoProfessor':
        this.selectSection('academicoProfessor');
        break;
      case 'academicoAlunos':
        this.selectSection('academicoAlunos');
        break;
      case 'avisos':
        this.selectSection('avisos');
        break;
      case 'eventos':
        this.selectSection('eventos');
        break;
      case 'dadosAcademicos':
        this.selectSection('dadosAcademicos');
        break;
      case 'menuPrincipal':
        this.router.navigate(['/menu']);
        break;
    }
  }

  selectSection(section: SecretariaSection): void {
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

  isSection(section: SecretariaSection): boolean {
    return this.selectedSection === section;
  }

  selecionarPreMatricula(req: PreMatricula): void {
    this.preMatriculaSelecionada = req;
  }

  atualizarStatus(status: PreMatricula['status']): void {
    if (!this.preMatriculaSelecionada) {
      return;
    }
    this.preMatriculaSelecionada.status = status;
  }

  atualizarDocumento(doc: DocumentoRequisito, status: DocumentoRequisito['status']): void {
    doc.status = status;
  }

  atualizarObservacoes(texto: string): void {
    if (!this.preMatriculaSelecionada) {
      return;
    }
    this.preMatriculaSelecionada.observacoes = texto;
  }

  concluirMatricula(): void {
    if (!this.preMatriculaSelecionada) {
      return;
    }
    this.preMatriculaSelecionada.status = 'aprovado';
    this.preMatriculaSelecionada.observacoes = 'Matrícula concluída em ' + new Date().toLocaleDateString('pt-BR');
    alert('Pré-matrícula concluída com sucesso!');
  }

  selecionarTransferencia(req: Transferencia): void {
    this.transferenciaSelecionada = req;
  }

  atualizarDestinoTransferencia(destinoId: string): void {
    if (!this.transferenciaSelecionada) {
      return;
    }
    if (!destinoId) {
      this.transferenciaSelecionada.destinoId = undefined;
      this.transferenciaSelecionada.destino = undefined;
      return;
    }
    const destino = this.destinosTransferencia.find(item => item.id === destinoId);
    this.transferenciaSelecionada.destinoId = destinoId;
    this.transferenciaSelecionada.destino = destino ? destino.nome : undefined;
  }

  atualizarJustificativaTransferencia(texto: string): void {
    if (!this.transferenciaSelecionada) {
      return;
    }
    this.transferenciaSelecionada.justificativa = texto;
  }

  confirmarTransferencia(): void {
    if (!this.transferenciaSelecionada) {
      return;
    }
    if (!this.transferenciaSelecionada.destino) {
      alert('Selecione a escola de destino para continuar.');
      return;
    }
    if (!this.transferenciaSelecionada.justificativa?.trim()) {
      alert('Informe a justificativa para registrar a transferência.');
      return;
    }
    this.transferenciaSelecionada.status = 'concluida';
    this.transferenciaSelecionada.dataAtualizacao = new Date().toISOString();
    this.historicoTransferencias = [
      { ...this.transferenciaSelecionada },
      ...this.historicoTransferencias
    ];
    this.solicitacoesTransferencia = this.solicitacoesTransferencia.filter(t => t.id !== this.transferenciaSelecionada?.id);
    this.transferenciaSelecionada = this.solicitacoesTransferencia[0] ?? null;
    this.estatisticas.transferenciasEmCurso = this.solicitacoesTransferencia.length;
    alert('Transferência confirmada e registrada no histórico.');
  }

  cancelarTransferencia(): void {
    if (!this.transferenciaSelecionada) {
      return;
    }
    this.transferenciaSelecionada.status = 'cancelada';
    this.transferenciaSelecionada.dataAtualizacao = new Date().toISOString();
    this.historicoTransferencias = [
      { ...this.transferenciaSelecionada },
      ...this.historicoTransferencias
    ];
    this.solicitacoesTransferencia = this.solicitacoesTransferencia.filter(t => t.id !== this.transferenciaSelecionada?.id);
    this.transferenciaSelecionada = this.solicitacoesTransferencia[0] ?? null;
    this.estatisticas.transferenciasEmCurso = this.solicitacoesTransferencia.length;
    alert('Solicitação cancelada e movida para o histórico.');
  }

  selecionarTurmaSecretaria(id: string): void {
    this.turmaSecretariaSelecionada = this.turmasSecretaria.find(turma => turma.id === id) ?? null;
  }

  criarTurmaSecretaria(payload: TurmaCadastroPayload): void {
    const professor = this.professoresDisponiveis.find(item => item.id === payload.professorId);
    if (!professor) {
      alert('Selecione um professor válido antes de salvar.');
      return;
    }

    const alunosSelecionados = this.alunosDisponiveisTurma.filter(aluno => payload.alunoIds.includes(aluno.id));
    const novoId = `TUR-${this.turmasSecretaria.length + 902}`;
    const novaTurma: TurmaCadastro = {
      id: novoId,
      nome: payload.nome.trim(),
      etapa: payload.etapa.trim(),
      turno: payload.turno,
      capacidade: payload.capacidade,
      professor,
      alunos: alunosSelecionados,
      status: alunosSelecionados.length ? 'ativo' : 'planejado',
      sala: 'A definir'
    };

    this.turmasSecretaria = [novaTurma, ...this.turmasSecretaria];
    this.turmaSecretariaSelecionada = novaTurma;
    alert('Turma criada com sucesso!');
  }

  salvarAvisoMaterial(payload: AvisoMaterialPayload): void {
    const novoAviso: AvisoMaterial = {
      id: `AV-${(this.avisosMateriais.length + 1).toString().padStart(4, '0')}`,
      titulo: payload.titulo,
      descricao: payload.descricao,
      destinoTipo: payload.destinoTipo,
      turmasDestino: payload.turmasDestino ?? [],
      destinatarios: payload.destinatarios ?? [],
      anexos: payload.anexos ?? [],
      dataEnvio: new Date().toISOString(),
      autor: payload.autor ?? (this.usuario?.nome ?? 'Secretaria')
    };

    this.avisosMateriais = [novoAviso, ...this.avisosMateriais];
    alert('Aviso publicado com sucesso!');
  }

  selecionarDisciplinaLancamento(id: string): void {
    const encontrada = this.lancamentoProfessorDisciplinas.find(disciplina => disciplina.id === id) ?? null;
    this.disciplinaLancamentoSelecionada = encontrada;
    this.turmaLancamentoSelecionada = encontrada?.turmas[0] ?? null;
  }

  selecionarTurmaLancamento(id: string): void {
    if (!this.disciplinaLancamentoSelecionada) {
      return;
    }
    this.turmaLancamentoSelecionada = this.disciplinaLancamentoSelecionada.turmas.find(turma => turma.id === id) ?? null;
  }

  atualizarNotaLancamento(evento: { alunoId: string; nota: number | null }): void {
    this.atualizarAlunoLancamento(evento.alunoId, aluno => {
      aluno.nota = evento.nota;
      aluno.ultimaAtualizacao = new Date().toISOString();
    });
  }

  atualizarFrequenciaLancamento(evento: { alunoId: string; frequencia: 'presente' | 'ausente' | 'atraso' | null }): void {
    this.atualizarAlunoLancamento(evento.alunoId, aluno => {
      aluno.frequencia = evento.frequencia ?? null;
      aluno.ultimaAtualizacao = new Date().toISOString();
    });
  }

  selecionarAlunoAcademico(id: string): void {
    this.alunoAcademicoSelecionado = this.academicoAlunos.find(aluno => aluno.id === id) ?? this.academicoAlunos[0] ?? null;
  }

  selecionarAlunoDados(id: string): void {
    this.alunoDadosSelecionado = this.dadosAcademicosAlunos.find(aluno => aluno.id === id) ?? this.dadosAcademicosAlunos[0] ?? null;
  }

  private atualizarAlunoLancamento(alunoId: string, atualizador: (aluno: LancamentoProfessorAluno) => void): void {
    for (const disciplina of this.lancamentoProfessorDisciplinas) {
      let alterou = false;
      for (const turma of disciplina.turmas) {
        const aluno = turma.alunos.find(a => a.id === alunoId);
        if (aluno) {
          atualizador(aluno);
          alterou = true;
          break;
        }
      }
      if (alterou) {
        disciplina.pendencias = this.calcularPendenciasDisciplina(disciplina);
        if (this.disciplinaLancamentoSelecionada?.id === disciplina.id) {
          this.disciplinaLancamentoSelecionada = disciplina;
          if (this.turmaLancamentoSelecionada) {
            this.turmaLancamentoSelecionada = disciplina.turmas.find(t => t.id === this.turmaLancamentoSelecionada?.id) ?? disciplina.turmas[0] ?? null;
          }
        }
        break;
      }
    }
  }

  private recalcularPendencias(): void {
    this.lancamentoProfessorDisciplinas.forEach(disciplina => {
      disciplina.pendencias = this.calcularPendenciasDisciplina(disciplina);
    });
  }

  private calcularPendenciasDisciplina(disciplina: LancamentoProfessorDisciplina): number {
    return disciplina.turmas.reduce((acc, turma) => {
      const pendentes = turma.alunos.filter(aluno => aluno.nota == null || !aluno.frequencia).length;
      return acc + pendentes;
    }, 0);
  }

  handleSalvarEvento(payload: EventoPayload): void {
    if (payload.id) {
      this.eventos = this.eventos.map(evento =>
        evento.id === payload.id ? { ...evento, ...payload } : evento
      );
      return;
    }
    const novoEvento: Evento = {
      id: `EV-${Math.floor(Math.random() * 9000) + 1000}`,
      titulo: payload.titulo,
      descricao: payload.descricao,
      data: payload.data,
      icone: payload.icone,
      categoria: payload.categoria
    };
    this.eventos = [novoEvento, ...this.eventos];
  }

  handleRemoverEvento(id: string): void {
    this.eventos = this.eventos.filter(evento => evento.id !== id);
  }

  private novaMatricula(): void {
    alert('Fluxo de matrícula em desenvolvimento.');
  }

  private emitirDocumento(): void {
    alert('Em breve será possível emitir documentos por aqui.');
  }
}
