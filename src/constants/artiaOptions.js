export const URGENCIA_OPTIONS = [
  'Alto',
  'Medio',
  'Baixo',
  'Urgente',
  'Escalação',
];

export const PLATAFORMA_OPTIONS = ['Desktop', 'Mobile'];

export const TIPO_CLIENTE_OPTIONS = [
  'Cliente externo',
  'Cliente interno',
  'Desenvolvimento',
  'Ferramentas de teste (Scout/Bullet/Airbrake)',
  'Qualidade',
  'Produto',
  'Testes automatizados',
];

export const CRITICIDADE_OPTIONS = ['Alto', 'Médio', 'Baixo'];

export const DIFICULDADE_LOCALIZACAO_OPTIONS = ['Alto', 'Médio', 'Baixo'];

export const CAUSA_DEMANDA_OPTIONS = [
  'Ambiente',
  'Atividade duplicada',
  'Diferente do especificado na regra de negocio',
  'Erro de deploy',
  'Erro de documentação',
  'Erro legado',
  'Falta de definição',
  'Falta de informação',
  'Falta de retorno',
  'Falha de definição',
  'Infra',
  'Mudança de escopo',
  'Necessidade de capacitação',
  'Performance',
  'Segurança',
];

export const GARANTIA_OPTIONS = ['Sim', 'Não'];

export const RESPONSAVEL_OPTIONS = [
  { name: 'Alexandre', id: 263356 },
  { name: 'Angelica', id: 203772 },
  { name: 'Eduardo', id: 242721 },
  { name: 'Éverton', id: 200317 },
  { name: 'Fred', id: 174652 },
  { name: 'Josué', id: 259332 },
  { name: 'Karla', id: 208561 },
  { name: 'Mazepa', id: 212376 },
  { name: 'Milles', id: 186004 },
  { name: 'João', id: 279121 },
  { name: 'Jeiel', id: 279122 },
  { name: 'Gustavo', id: 273428 },
  { name: 'Vini Lisboa', id: 200535 },
  { name: 'Vine Coelho', id: 200531 },
  { name: 'Felipe', id: 200527 },
];

export const FUNCIONALIDADE_OPTIONS = {
  'Agente de documentação de processos': [
    'Repositórios',
    'Arquitetura de processos',
    'Agente de documentação',
    'Documentos de referência',
    'Portal de processos',
  ],
  'Agente de importação': ['Importação de Questionários'],
  'Agente de suporte': ['Chatbot'],
  'Ambientes adicionais': [
    'Ambiente adicional antigo',
    'Acesso',
    'Criação',
    'Inativação',
    'Listagem',
  ],
  Aprender: [
    'Cards',
    'Chat',
    'Layout',
    'Progresso',
    'Reprodução de atividade',
    'Usabilidade',
  ],
  'Automação de testes': ['Automação de testes'],
  API: [
    'Autenticação',
    'Catálogo',
    'Conteúdos',
    'Curso',
    'Inscrições',
    'Organização',
    'Questionários',
    'Usuários',
  ],
  Arquitetura: ['Componentes', 'Banco de dados', 'Segurança', 'Tecnologia'],
  Biblioteca: ['Biblioteca'],
  'Catálogo de cursos': ['Catálogo - visão admin', 'Catálogo - visão aluno'],
  Certificado: [
    'Catálogo',
    'Curso',
    'Emitidos',
    'Empresa',
    'Geração',
    'Modelos',
    'Organização',
    'Trilha',
  ],
  Chat: ['Hubspot'],
  'Cobrança de inscrição': [
    'Cobrança automática',
    'Cupons e Vouchers',
    'Logs de transação',
  ],
  Compartilhamentos: [
    'Busca',
    'Concedidos',
    'Cópia',
    'Encerramento',
    'Espelho',
    'Exclusão',
    'Filtro',
    'Listagem',
    'Recebidos',
  ],
  Comunicação: ['Registro de alterações', 'Regras da comunidade'],
  Comunidades: ['Comunidades', 'Discussões', 'Notícias'],
  Configurações: [
    'Ambientes adicionais',
    'Assinatura',
    'Cobrança de inscrição',
    'Comunicação',
    'Integrações',
    'Navegação',
    'Organização',
    'Plugins',
    'Regras do jogo',
  ],
  Conteúdos: [
    'Abrir em nova aba',
    'Adição/Edição',
    'Ambiente adicional',
    'Aprendizagem',
    'Atividades',
    'Banner',
    'Busca',
    'Compartilhar com outro ambiente',
    'Dashboards',
    'Divulgar',
    'Equipe',
    'Estúdio de criação',
    'Excluir',
    'Extração de dados',
    'Filtro',
    'Gestores de turma',
    'Inscrição',
    'Instrutor',
    'Lista de conteúdos',
    'Soph.ia',
  ],
  Dashboard: [
    'Dashboard - visão admin',
    'Dashboard - visão aluno',
    'Dashboard - visão gestor',
    'Dashboard - visão instrutor',
  ],
  Empresas: ['Adição/Edição', 'Exclusão', 'Listagem'],
  'Envio de e-mail': [
    'Cadastro de usuário',
    'Cancelamento de inscrição',
    'Certificado',
    'Contato com o organizador',
    'Enviado pelo instrutor (Aprendizagem)',
    'Extração de dados (Conteúdos)',
    'Extração de dados (Inscrições)',
    'Extração de dados (Questionários)',
    'Extração de dados (Unuários)',
    'Inscrição em conteúdo',
    'Inscrição em massa',
    'Grupo de inscrições',
    'Piloto automático',
    'Recuperação de senha',
    'Trial- Confirmação de conta',
  ],
  Equipe: [
    'Busca',
    'Dashboards',
    'Filtro',
    'Listagem',
    'Pontuação',
    'Visão detalhada',
  ],
  Exportação: ['Conteúdos', 'Inscrição', 'Questionários', 'Usuários'],
  'Formulário de inscrição': ['Formulário de inscrição'],
  Importação: ['Inscrição', 'Usuários'],
  'Integração Fleeg': ['Integração Fleeg'],
  'Integração Hubspot': ['Integração Hubspot'],
  'Integrações de pagamento': ['Asaas', 'e-Rede', 'PagSeguro'],
  Log: [
    'Ambiente adicional',
    'Cobrança de inscrição - Logs de transações',
    'Comunicação',
    'Comunidades',
    'Cursos',
    'Inscrição',
    'Login/Logout',
    'Organização',
    'Usuários',
    'Super admin',
  ],
  Login: ['Magic link', 'Padrão (e-mail/cpf)', 'Redes sociais'],
  'Magic link': ['Configuração', 'Geração - Usuário', 'Magic link'],
  'Menu de apoio (Sophia)': [
    'Primeiros passos',
    'Fale com a gente',
    'Contratar a Twygo',
    'Excluir informações',
  ],
  'Meus cursos': ['Aprender', 'Meus cursos'],
  Navegação: ['Modo de uso'],
  Notificações: [
    'Interna (microserviço)',
    'Modal (pop up)',
    'Topo de tela (faixa amarela)',
  ],
  Organização: [
    'Certificado',
    'Customizações',
    'Dados',
    'Integrações',
    'Piloto automático',
    'Termos',
    'Restrições por IP',
    'Webhook',
  ],
  'Página pública': [
    'Inscrição',
    'Lista de itens',
    'Página pública de um conteúdo',
  ],
  'Perfil de usuários': ['Perfil de usuários'],
  'Piloto automático': [
    'Adição/Edição',
    'Ações em massa',
    'Busca',
    'Disparo: Certificado estiver a X dias de expirar',
    'Disparo: Conteúdo é atualizado',
    'Disparo: Conteúdo é publicado',
    'Disparo: Usuário é cadastrado com área X',
    'Disparo: Usuário é cadastrado com cargo X',
    'Disparo: Usuário é criado',
    'Disparo: Usuário é vinculado à empresa X',
    'Disparo: Usuário estiver a X dias de perder o acesso ao conteúdo',
    'Exclusão',
    'Extração de dados',
    'Filtro',
    'Listagem',
  ],
  Play: [
    'Busca',
    'Card resumido',
    'Card detalhado',
    'Destaque',
    'Filtro',
    'Listagem',
    'Ver tudo',
  ],
  Questionários: [
    'Adição/Edição',
    'Busca',
    'Dashboards',
    'Exclusão',
    'Filtro',
    'Listagem',
    'Perguntas',
  ],
  'Registre-se': ['Formulário Registre-se'],
  'Regras do jogo': ['Regras do Jogo'],
  Site: ['Site'],
  'Soph.ia': [
    'Atividades',
    'Questionário',
    'Resumo do conteúdo',
    'Roteiro do narrador',
    'Vídeo narrado',
  ],
  SSO: ['SSO'],
  'Super admin': [
    'Acesso - Liberação de usuários',
    'Acesso - Manutenção de perfis de acesso',
    'Assinaturas - Manutenção de assinaturas',
    'Assinaturas - Tabela de preços',
    'Features',
    'Outros',
  ],
  Termos: ['Aceite dos termos', 'Adição/Edição'],
  Trial: ['Acesso', 'Base populada', 'Formulário'],
  Trilha: ['Trilha'],
  Twygo: ['Twygo'],
  Usuários: [
    'Ações em massa',
    'Adição/Edição',
    'Alteração de senha',
    'Comentários',
    'Dashboards',
    'Exclusão',
    'Exportação',
    'Filtro',
    'Importação',
    'Listagem',
    'Pontuação',
    'Pontuação manual',
    'Registros de acesso',
    'Visão detalhada',
  ],
  'Views de BI': ['Clientes', 'Internas'],
};

export const ACTIVITY_TYPES = {
  DESENVOLVIMENTO: 'Desenvolvimento',
  EXECUCAO_TESTES: 'Execução de testes',
  TESTE_MESA: 'Teste de mesa',
  AUTOMACAO_TESTES: 'Automação de testes',
  ANALISE_TESTES: 'Análise de testes',
  BUG_PRODUCAO: 'Bug produção',
  BUG_RETRABALHO: 'Bug retrabalho',
  DEPLOY: 'Deploy',
  DOCUMENTACAO: 'Documentação',
};

// Configuração de visibilidade dos tipos de atividade para importação
export const ACTIVITY_TYPES_CONFIG = {
  [ACTIVITY_TYPES.DESENVOLVIMENTO]: { enabled: true },
  [ACTIVITY_TYPES.EXECUCAO_TESTES]: { enabled: true },
  [ACTIVITY_TYPES.TESTE_MESA]: { enabled: true },
  [ACTIVITY_TYPES.AUTOMACAO_TESTES]: { enabled: false }, // ❌ Oculto
  [ACTIVITY_TYPES.ANALISE_TESTES]: { enabled: true },
  [ACTIVITY_TYPES.BUG_PRODUCAO]: { enabled: false }, // ❌ Oculto na importação
  [ACTIVITY_TYPES.BUG_RETRABALHO]: { enabled: false }, // ❌ Oculto na importação
  [ACTIVITY_TYPES.DEPLOY]: { enabled: false }, // ❌ Oculto
  [ACTIVITY_TYPES.DOCUMENTACAO]: { enabled: true },
};

// Configuração específica para criação de atividades (modal)
export const ACTIVITY_CREATION_CONFIG = {
  [ACTIVITY_TYPES.DESENVOLVIMENTO]: { enabled: false }, // ❌ Não usado no modal
  [ACTIVITY_TYPES.EXECUCAO_TESTES]: { enabled: false }, // ❌ Não usado no modal
  [ACTIVITY_TYPES.TESTE_MESA]: { enabled: false }, // ❌ Não usado no modal
  [ACTIVITY_TYPES.AUTOMACAO_TESTES]: { enabled: false }, // ❌ Não usado no modal
  [ACTIVITY_TYPES.ANALISE_TESTES]: { enabled: false }, // ❌ Não usado no modal
  [ACTIVITY_TYPES.BUG_PRODUCAO]: { enabled: true }, // ✅ Disponível no modal de bug
  [ACTIVITY_TYPES.BUG_RETRABALHO]: { enabled: true }, // ✅ Disponível no modal de bug
  [ACTIVITY_TYPES.DEPLOY]: { enabled: true }, // ✅ Disponível no modal de deploy
  [ACTIVITY_TYPES.DOCUMENTACAO]: { enabled: false }, // ❌ Não usado no modal
};

// Função helper para obter apenas os tipos habilitados para importação
export const getEnabledActivityTypes = () => {
  return Object.entries(ACTIVITY_TYPES)
    .filter(([key]) => ACTIVITY_TYPES_CONFIG[ACTIVITY_TYPES[key]]?.enabled)
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});
};

// Função helper para obter tipos habilitados para criação de atividades
export const getEnabledActivityTypesForCreation = () => {
  return Object.entries(ACTIVITY_TYPES)
    .filter(([key]) => ACTIVITY_CREATION_CONFIG[ACTIVITY_TYPES[key]]?.enabled)
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});
};

export const ACTIVITY_FIELDS = {
  // Campos básicos que todos os tipos possuem
  COMMON_FIELDS: [
    { name: 'titulo', label: 'Título', type: 'text', required: true },
    {
      name: 'descricao',
      label: 'Descrição',
      type: 'textarea',
      required: false,
    },
    {
      name: 'esforcoEstimado',
      label: 'Esforço estimado (horas)',
      type: 'number',
      required: false,
    },
    {
      name: 'inicioEstimado',
      label: 'Início estimado',
      type: 'date',
      required: false,
    },
    {
      name: 'terminoEstimado',
      label: 'Término estimado',
      type: 'date',
      required: false,
    },
    {
      name: 'responsibleId',
      label: 'Responsável',
      type: 'select',
      options: RESPONSAVEL_OPTIONS,
      required: false,
    },
  ],

  // DESENVOLVIMENTO → Apenas funcionalidade e sub-funcionalidade obrigatórias
  [ACTIVITY_TYPES.DESENVOLVIMENTO]: [
    {
      name: 'funcionalidade',
      label: 'Funcionalidade',
      type: 'select',
      options: Object.keys(FUNCIONALIDADE_OPTIONS),
      required: true,
    },
    {
      name: 'subFuncionalidade',
      label: 'Sub-funcionalidade',
      type: 'select',
      options: [],
      required: true,
    },
  ],

  // EXECUÇÃO DE TESTES → Apenas funcionalidade e sub-funcionalidade obrigatórias
  [ACTIVITY_TYPES.EXECUCAO_TESTES]: [
    {
      name: 'funcionalidade',
      label: 'Funcionalidade',
      type: 'select',
      options: Object.keys(FUNCIONALIDADE_OPTIONS),
      required: true,
    },
    {
      name: 'subFuncionalidade',
      label: 'Sub-funcionalidade',
      type: 'select',
      options: [],
      required: true,
    },
  ],

  // TESTE DE MESA → Nenhum campo customizado obrigatório
  [ACTIVITY_TYPES.TESTE_MESA]: [],

  // AUTOMAÇÃO DE TESTES → Apenas funcionalidade e sub-funcionalidade obrigatórias
  [ACTIVITY_TYPES.AUTOMACAO_TESTES]: [
    {
      name: 'funcionalidade',
      label: 'Funcionalidade',
      type: 'select',
      options: Object.keys(FUNCIONALIDADE_OPTIONS),
      required: true,
    },
    {
      name: 'subFuncionalidade',
      label: 'Sub-funcionalidade',
      type: 'select',
      options: [],
      required: true,
    },
  ],

  // ANÁLISE DE TESTES → Apenas funcionalidade e sub-funcionalidade obrigatórias
  [ACTIVITY_TYPES.ANALISE_TESTES]: [
    {
      name: 'funcionalidade',
      label: 'Funcionalidade',
      type: 'select',
      options: Object.keys(FUNCIONALIDADE_OPTIONS),
      required: true,
    },
    {
      name: 'subFuncionalidade',
      label: 'Sub-funcionalidade',
      type: 'select',
      options: [],
      required: true,
    },
  ],

  // BUG PRODUÇÃO → Todos os campos obrigatórios
  [ACTIVITY_TYPES.BUG_PRODUCAO]: [
    {
      name: 'ticketMovidesk',
      label: 'Nº ticket movidesk',
      type: 'text',
      required: true,
    },
    {
      name: 'prioridade',
      label: 'Prioridade',
      type: 'number',
      required: true,
      min: 0,
      max: 4,
    },
    {
      name: 'urgencia',
      label: 'Urgência',
      type: 'select',
      options: URGENCIA_OPTIONS,
      required: true,
    },
    {
      name: 'plataforma',
      label: 'Plataforma',
      type: 'select',
      options: PLATAFORMA_OPTIONS,
      required: true,
    },
    {
      name: 'funcionalidade',
      label: 'Funcionalidade',
      type: 'select',
      options: Object.keys(FUNCIONALIDADE_OPTIONS),
      required: true,
    },
    {
      name: 'subFuncionalidade',
      label: 'Sub-funcionalidade',
      type: 'select',
      options: [],
      required: true,
    },
    { name: 'cliente', label: 'Cliente', type: 'text', required: true },
    {
      name: 'idOrganizacao',
      label: 'ID organização',
      type: 'text',
      required: true,
    },
    { name: 'email', label: 'E-mail', type: 'text', required: true },
    {
      name: 'tipoCliente',
      label: 'Tipo de cliente',
      type: 'select',
      options: TIPO_CLIENTE_OPTIONS,
      required: true,
    },
    {
      name: 'criticidade',
      label: 'Criticidade',
      type: 'select',
      options: CRITICIDADE_OPTIONS,
      required: true,
    },
    {
      name: 'dificuldadeLocalizacao',
      label: 'Dificuldade de localização',
      type: 'select',
      options: DIFICULDADE_LOCALIZACAO_OPTIONS,
      required: true,
    },
    {
      name: 'causaDemanda',
      label: 'Causa da demanda',
      type: 'select',
      options: CAUSA_DEMANDA_OPTIONS,
      required: true,
    },
    {
      name: 'garantia',
      label: 'Garantia',
      type: 'select',
      options: GARANTIA_OPTIONS,
      required: true,
    },
  ],

  // BUG RETRABALHO → Campos específicos obrigatórios
  [ACTIVITY_TYPES.BUG_RETRABALHO]: [
    {
      name: 'prioridade',
      label: 'Prioridade',
      type: 'number',
      required: true,
      min: 0,
      max: 4,
    },
    {
      name: 'plataforma',
      label: 'Plataforma',
      type: 'select',
      options: PLATAFORMA_OPTIONS,
      required: true,
    },
    {
      name: 'funcionalidade',
      label: 'Funcionalidade',
      type: 'select',
      options: Object.keys(FUNCIONALIDADE_OPTIONS),
      required: true,
    },
    {
      name: 'subFuncionalidade',
      label: 'Sub-funcionalidade',
      type: 'select',
      options: [],
      required: true,
    },
    {
      name: 'criticidade',
      label: 'Criticidade',
      type: 'select',
      options: CRITICIDADE_OPTIONS,
      required: true,
    },
    {
      name: 'dificuldadeLocalizacao',
      label: 'Dificuldade de localização',
      type: 'select',
      options: DIFICULDADE_LOCALIZACAO_OPTIONS,
      required: true,
    },
    {
      name: 'causaDemanda',
      label: 'Causa da demanda',
      type: 'select',
      options: CAUSA_DEMANDA_OPTIONS,
      required: true,
    },
  ],

  // DEPLOY → Nenhum campo customizado obrigatório
  [ACTIVITY_TYPES.DEPLOY]: [],

  // DOCUMENTAÇÃO → Nenhum campo customizado obrigatório
  [ACTIVITY_TYPES.DOCUMENTACAO]: [],
};

// Status customizados para atividades
export const CUSTOM_STATUS_OPTIONS = [
  { id: 246888, name: 'Não iniciado' },
  { id: 246886, name: 'Backlog' },
  { id: 246887, name: 'Backlog Programado' },
  { id: 246895, name: 'Triagem' },
];

export const DEFAULT_CUSTOM_STATUS_ID = 246886; // Backlog por padrão
