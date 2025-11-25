export interface Matricula {
  id: number;
  numeroMatricula: string;
  alunoId: number;
  nomeAluno: string;
  matriculaAluno: string;
  turmaId: number;
  nomeTurma: string;
  codigoTurma: string;
  anoLetivo: number;
  dataMatricula: string;
  status: string;
  observacoes?: string | null;
}

export interface Responsavel {
  id: number;
  nomeCompleto: string;
  cpf: string;
  rg?: string | null;
  telefone?: string | null;
  email?: string | null;
  endereco?: string | null;
  parentesco: string;
  principal: boolean;
  dataVinculo: string;
}

export interface Aluno {
  id: number;
  usuarioId: number;
  nomeUsuario: string;
  emailUsuario: string;
  matricula: string;
  nomeCompleto: string;
  dataNascimento: string;
  sexo: string;
  rg?: string | null;
  cpf?: string | null;
  endereco?: string | null;
  cidade?: string | null;
  estado?: string | null;
  cep?: string | null;
  telefoneResponsavel?: string | null;
  emailResponsavel?: string | null;
  status: string;
  dataMatricula: string;
  escolaId: number;
  nomeEscola: string;
  fotoPerfil?: string | null;
  matriculas?: Matricula[];
  responsaveis?: Responsavel[];
}
