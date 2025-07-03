/**
 * Hashes dos campos customizados do Artia
 * Obtidos da documentação da API
 */

export const ARTIA_FIELD_HASHES = {
  CRITICIDADE: 'e91420d26f1223bff88cb136e4a916bc27b67498',
  FUNCIONALIDADE: 'ff3ff8fbc68189d8b90299306cf56911d4af62fc',
  SUB_FUNCIONALIDADE: 'a7d8d9c30ceec1fcdcdfa97b36d26fe68cf8d0a6',
  PLATAFORMA: 'df4fbb15aae25af08eab46c37ed296d5610c153c',
  URGENCIA: 'e6774e5faca80a82fb9d154252d7f0959c82455f',
  TICKET_MOVIDESK: 'dc76d8f0df4fea0eaebdbea8acf7cc3f4e51fe25',
  CLIENTE: '26c8da01bf407ef7f522679472b26da0f47307e9',
  ID_ORGANIZACAO: '57482e9a0bf9a1bcd32fdfa2cd0ee5686cf6dc8f',
  EMAIL: '87a26add0591af451d4950260583fad0b383910f',
  TIPO_CLIENTE: 'bd4955d4e08e24b51450ab9557bfba1dad5c51d6',
  CAUSA_DEMANDA: '1ea5ec0a90db2643df579910b49a9c73f84d5596',
  DIFICULDADE_LOCALIZACAO: '495fbfd782e12bb20b41190fe7e9770a1a5453eb',
  GARANTIA: '40a45aca28c74a3e7dad314250cf23c7a45c3a57',
  // Campos de datas estimadas (baseados na documentação do Artia)
  ESTIMATED_START: 'estimatedStart', // Campo nativo da API, não hash
  ESTIMATED_END: 'estimatedEnd', // Campo nativo da API, não hash
  // Campos adicionais disponíveis
  REBOTE: '35529c896d093897ae89dbdb0362e14e2a05e694',
  CLASSIFICACAO: '7417cfa09e78a94f740c0fa1a3a1b87d4ccc0261',
};

/**
 * Campos obrigatórios por tipo de atividade
 */
export const REQUIRED_FIELDS_BY_TYPE = {
  Desenvolvimento: ['FUNCIONALIDADE', 'SUB_FUNCIONALIDADE'],
  'Execução de testes': ['FUNCIONALIDADE', 'SUB_FUNCIONALIDADE'],
  'Teste de mesa': [
    // Nenhum campo customizado obrigatório
  ],
  'Automação de testes': ['FUNCIONALIDADE', 'SUB_FUNCIONALIDADE'],
  'Análise de testes': ['FUNCIONALIDADE', 'SUB_FUNCIONALIDADE'],
  'Bug produção': [
    'TICKET_MOVIDESK',
    'URGENCIA',
    'PLATAFORMA',
    'FUNCIONALIDADE',
    'SUB_FUNCIONALIDADE',
    'CLIENTE',
    'ID_ORGANIZACAO',
    'EMAIL',
    'TIPO_CLIENTE',
    'CRITICIDADE',
    'DIFICULDADE_LOCALIZACAO',
    'CAUSA_DEMANDA',
    'GARANTIA',
  ],
  'Bug retrabalho': [
    'PLATAFORMA',
    'FUNCIONALIDADE',
    'SUB_FUNCIONALIDADE',
    'CRITICIDADE',
    'CAUSA_DEMANDA',
  ],
  Deploy: [
    // Deploy não tem campos customizados obrigatórios
  ],
  Documentação: [
    // Documentação não tem campos customizados obrigatórios
  ],
};

/**
 * Mapeamento dos campos do formulário para os hashes da API
 */
export const FORM_FIELD_TO_HASH = {
  criticidade: ARTIA_FIELD_HASHES.CRITICIDADE,
  funcionalidade: ARTIA_FIELD_HASHES.FUNCIONALIDADE,
  subFuncionalidade: ARTIA_FIELD_HASHES.SUB_FUNCIONALIDADE,
  plataforma: ARTIA_FIELD_HASHES.PLATAFORMA,
  urgencia: ARTIA_FIELD_HASHES.URGENCIA,
  ticketMovidesk: ARTIA_FIELD_HASHES.TICKET_MOVIDESK,
  cliente: ARTIA_FIELD_HASHES.CLIENTE,
  idOrganizacao: ARTIA_FIELD_HASHES.ID_ORGANIZACAO,
  email: ARTIA_FIELD_HASHES.EMAIL,
  tipoCliente: ARTIA_FIELD_HASHES.TIPO_CLIENTE,
  causaDemanda: ARTIA_FIELD_HASHES.CAUSA_DEMANDA,
  dificuldadeLocalizacao: ARTIA_FIELD_HASHES.DIFICULDADE_LOCALIZACAO,
  garantia: ARTIA_FIELD_HASHES.GARANTIA,
  // Campos de datas estimadas
  inicioEstimado: ARTIA_FIELD_HASHES.ESTIMATED_START,
  terminoEstimado: ARTIA_FIELD_HASHES.ESTIMATED_END,
  // Campos adicionais (se necessário no futuro)
  rebote: ARTIA_FIELD_HASHES.REBOTE,
  classificacao: ARTIA_FIELD_HASHES.CLASSIFICACAO,
};

/**
 * Valores padrão para campos obrigatórios da API
 */
export const DEFAULT_ARTIA_VALUES = {
  // IDs configurados para o ambiente atual - TODOS OS TIPOS
  FOLDER_TYPE_ID_DESENVOLVIMENTO: 546649, // Desenvolvimento
  FOLDER_TYPE_ID_EXECUCAO_TESTES: 546650, // Execução de testes
  FOLDER_TYPE_ID_TESTE_MESA: 578464, // Teste de mesa
  FOLDER_TYPE_ID_AUTOMACAO_TESTES: 546652, // Automação de testes
  FOLDER_TYPE_ID_ANALISE_TESTES: 546651, // Análise de testes
  FOLDER_TYPE_ID_BUG_PRODUCAO: 546654, // Bug Produção
  FOLDER_TYPE_ID_BUG_RETRABALHO: 546653, // Bug Retrabalho
  FOLDER_TYPE_ID_DEPLOY: 546658, // Deploy
  FOLDER_TYPE_ID_DOCUMENTACAO: 546655, // Documentação

  PRIORITY: 1,
  ESTIMATED_EFFORT: 1,
  ORGANIZATION_ID: 136701, // OrganizationId fixo

  // Valores padrão para campos editáveis (podem ser alterados no modal)
  DEFAULT_ACCOUNT_ID: '', // Será preenchido pelo usuário
  DEFAULT_FOLDER_ID: '', // Será preenchido pelo usuário
};

/**
 * Mapeia tipos de atividade para folder type IDs
 */
export const ACTIVITY_TYPE_TO_FOLDER_TYPE_ID = {
  Desenvolvimento: DEFAULT_ARTIA_VALUES.FOLDER_TYPE_ID_DESENVOLVIMENTO,
  'Execução de testes': DEFAULT_ARTIA_VALUES.FOLDER_TYPE_ID_EXECUCAO_TESTES,
  'Teste de mesa': DEFAULT_ARTIA_VALUES.FOLDER_TYPE_ID_TESTE_MESA,
  'Automação de testes': DEFAULT_ARTIA_VALUES.FOLDER_TYPE_ID_AUTOMACAO_TESTES,
  'Análise de testes': DEFAULT_ARTIA_VALUES.FOLDER_TYPE_ID_ANALISE_TESTES,
  'Bug produção': DEFAULT_ARTIA_VALUES.FOLDER_TYPE_ID_BUG_PRODUCAO,
  'Bug retrabalho': DEFAULT_ARTIA_VALUES.FOLDER_TYPE_ID_BUG_RETRABALHO,
  Deploy: DEFAULT_ARTIA_VALUES.FOLDER_TYPE_ID_DEPLOY,
  Documentação: DEFAULT_ARTIA_VALUES.FOLDER_TYPE_ID_DOCUMENTACAO,
};
