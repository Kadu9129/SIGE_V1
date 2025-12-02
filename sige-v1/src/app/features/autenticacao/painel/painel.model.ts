export interface Estatisticas {
  matriculasAtivas: number;
  documentosPendentes: number;
  solicitacoesHoje: number;
  transferenciasEmCurso: number;
}

export interface Atividade {
  id: number;
  titulo: string;
  descricao: string;
  tempo: string;
  tipo: string;
  icone: string;
}

export interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: string;
  handler:
    | 'novaMatricula'
    | 'documentos'
    | 'pendencias'
    | 'menuPrincipal'
    | 'transferencias'
    | 'eventos'
    | 'academicoProfessor'
    | 'academicoAlunos'
    | 'turmas'
    | 'avisos'
    | 'dadosAcademicos';
}

export interface DocumentoRequisito {
  tipo: 'RG' | 'CPF' | 'Comprovante' | 'Histórico';
  status: 'pendente' | 'enviado' | 'aceito' | 'recusado';
}

export interface PreMatricula {
  id: string;
  aluno: string;
  responsavel: string;
  serie: string;
  dataEnvio: string;
  status: 'aguardando' | 'aprovado' | 'indeferido';
  observacoes?: string;
  documentos: DocumentoRequisito[];
}

export interface EscolaDestino {
  id: string;
  nome: string;
  cidade: string;
  vagas: number;
  nivel: 'Fundamental' | 'Médio' | 'Infantil';
}

export interface Transferencia {
  id: string;
  aluno: string;
  origem: string;
  destinoId?: string;
  destino?: string;
  status: 'rascunho' | 'emAnalise' | 'concluida' | 'cancelada';
  justificativa?: string;
  solicitante: string;
  dataSolicitacao: string;
  dataAtualizacao: string;
}

export type EventoCategoria = 'Acadêmico' | 'Institucional' | 'Comunitário';

export interface Evento {
  id: string;
  titulo: string;
  descricao: string;
  data: string;
  icone: string;
  categoria: EventoCategoria;
}

export interface EventoPayload extends Omit<Evento, 'id'> {
  id?: string;
}

export interface LancamentoProfessorAluno {
  id: string;
  nome: string;
  nota?: number | null;
  frequencia?: 'presente' | 'ausente' | 'atraso' | null;
  observacao?: string;
  ultimaAtualizacao?: string;
}

export interface LancamentoProfessorTurma {
  id: string;
  nome: string;
  turno: 'Manhã' | 'Tarde' | 'Noite';
  dataReferencia: string;
  alunos: LancamentoProfessorAluno[];
}

export interface LancamentoProfessorDisciplina {
  id: string;
  nome: string;
  serie: string;
  pendencias?: number;
  turmas: LancamentoProfessorTurma[];
}

export type TurmaTurno = 'Matutino' | 'Vespertino' | 'Noturno' | 'Integral';
export type TurmaStatus = 'Planejada' | 'Ativa' | 'Finalizada' | 'Cancelada';

export interface TurmaCursoOption {
  id: number;
  nome: string;
  codigo: string;
  nivel?: string;
}

export interface TurmaProfessor {
  id: number;
  nome: string;
  especialidade?: string;
  disponibilidade?: string;
}

export interface TurmaAluno {
  id: number;
  nome: string;
  serie?: string;
  matricula?: string;
  matriculaId?: number;
  responsavel?: string;
  status?: string;
}

export interface TurmaCadastro {
  id: number;
  codigo: string;
  nome: string;
  anoLetivo: number;
  serie?: string;
  turno: TurmaTurno;
  capacidadeMaxima: number;
  cursoId: number;
  cursoNome: string;
  professorCoordenadorId?: number;
  professor?: TurmaProfessor;
  alunos: TurmaAluno[];
  status: TurmaStatus;
  sala?: string;
}

export interface TurmaCadastroPayload {
  codigo: string;
  nome: string;
  anoLetivo: number;
  serie?: string;
  turno: TurmaTurno;
  capacidadeMaxima: number;
  cursoId: number;
  professorCoordenadorId?: number;
  sala?: string;
  status: TurmaStatus;
  alunoIds: number[];
}

export interface BoletimDisciplina {
  id: string;
  nome: string;
  media: number;
  situacao: 'regular' | 'atencao' | 'excelente';
  ultimaAtualizacao: string;
}

export interface FrequenciaMensal {
  periodo: string;
  percentual: number;
}

export interface HistoricoNotaRegistro {
  etapa: string;
  data: string;
  nota: number;
  descricao?: string;
}

export interface AcademicoAlunoResumo {
  id: string;
  nome: string;
  turma: string;
  boletim: BoletimDisciplina[];
  frequencia: FrequenciaMensal[];
  historicoNotas: HistoricoNotaRegistro[];
}

export type AvisoDestinoTipo = 'turma' | 'escola' | 'individual';

export interface AvisoAnexo {
  id: string;
  nome: string;
  tipo: 'pdf' | 'imagem' | 'link';
  url: string;
}

export interface AvisoMaterial {
  id: string;
  titulo: string;
  descricao: string;
  destinoTipo: AvisoDestinoTipo;
  turmasDestino?: string[];
  destinatarios?: string[];
  dataEnvio: string;
  autor: string;
  anexos: AvisoAnexo[];
}

export interface AvisoMaterialPayload extends Omit<AvisoMaterial, 'id' | 'dataEnvio' | 'autor'> {
  autor?: string;
}

export interface HistoricoEscolarRegistro {
  ano: string;
  serie: string;
  situacao: 'aprovado' | 'cursando';
  mediaFinal: number;
}

export interface DadosAcademicosAluno {
  id: string;
  nome: string;
  turma: string;
  curso: string;
  mediaFinal: number;
  historico: HistoricoEscolarRegistro[];
  boletim: BoletimDisciplina[];
  frequenciaMensal: FrequenciaMensal[];
}

export type SecretariaSection =
  | 'resumo'
  | 'indicadores'
  | 'pendencias'
  | 'acoes'
  | 'cadastros'
  | 'preMatriculas'
  | 'transferencias'
  | 'eventos'
  | 'academicoProfessor'
  | 'academicoAlunos'
  | 'turmas'
  | 'avisos'
  | 'dadosAcademicos';
