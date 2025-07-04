/**
 * Validador de atividades para importação
 */

import {
  ACTIVITY_TYPES,
  URGENCIA_OPTIONS,
  PLATAFORMA_OPTIONS,
  TIPO_CLIENTE_OPTIONS,
  CRITICIDADE_OPTIONS,
  DIFICULDADE_LOCALIZACAO_OPTIONS,
  CAUSA_DEMANDA_OPTIONS,
  GARANTIA_OPTIONS,
  FUNCIONALIDADE_OPTIONS,
  RESPONSAVEL_OPTIONS,
  getEnabledActivityTypes,
} from '../constants/artiaOptions';

import { REQUIRED_FIELDS_BY_TYPE } from '../constants/artiaFieldHashes';

/**
 * Validar array de atividades antes da importação
 * @param {Array} activities - Array de atividades
 * @param {boolean} isUpdate - Se é importação de atualização
 * @returns {Object} { validActivities: Array, errors: Array }
 */
export const validateActivitiesForImport = (activities, isUpdate = false) => {
  const validActivities = [];
  const errors = [];

  activities.forEach((activity, index) => {
    const lineNumber = activity._originalLine || index + 2; // +2 porque linha 1 é header
    const activityErrors = validateSingleActivity(
      activity,
      lineNumber,
      isUpdate
    );

    if (activityErrors.length === 0) {
      validActivities.push(activity);
    } else {
      errors.push(...activityErrors);
    }
  });

  return { validActivities, errors };
};

/**
 * Validar uma única atividade
 * @param {Object} activity - Dados da atividade
 * @param {number} lineNumber - Número da linha no CSV
 * @param {boolean} isUpdate - Se é importação de atualização
 * @returns {Array} Array de erros
 */
export const validateSingleActivity = (
  activity,
  lineNumber,
  isUpdate = false
) => {
  const errors = [];

  if (isUpdate) {
    // Apenas campos essenciais para atualização
    if (!activity.artiaId) {
      errors.push(
        `Linha ${lineNumber}: Campo 'artia_id' é obrigatório para atualização`
      );
    }
    if (!activity.titulo || activity.titulo.trim() === '') {
      errors.push(
        `Linha ${lineNumber}: Campo 'titulo' é obrigatório para atualização`
      );
    }
    if (!activity.accountId) {
      errors.push(
        `Linha ${lineNumber}: Campo 'account_id' é obrigatório para atualização`
      );
    }
    return errors;
  }

  // Validações básicas comuns
  errors.push(...validateBasicFields(activity, lineNumber));

  // Validações específicas por tipo
  errors.push(...validateTypeSpecificFields(activity, lineNumber));

  // Validações de valores permitidos
  errors.push(...validateFieldValues(activity, lineNumber));

  return errors;
};

/**
 * Validar campos básicos obrigatórios
 * @param {Object} activity - Dados da atividade
 * @param {number} lineNumber - Número da linha
 * @returns {Array} Array de erros
 */
const validateBasicFields = (activity, lineNumber) => {
  const errors = [];

  // Tipo obrigatório
  if (!activity.tipo) {
    errors.push(`Linha ${lineNumber}: Campo 'tipo' é obrigatório`);
  } else if (
    !Object.values(getEnabledActivityTypes()).includes(activity.tipo)
  ) {
    errors.push(`Linha ${lineNumber}: Tipo '${activity.tipo}' inválido`);
  }

  // Título obrigatório
  if (!activity.titulo || activity.titulo.trim() === '') {
    errors.push(`Linha ${lineNumber}: Campo 'titulo' é obrigatório`);
  }

  // Validar tamanho do título
  if (activity.titulo && activity.titulo.length > 255) {
    errors.push(
      `Linha ${lineNumber}: Título muito longo (máximo 255 caracteres)`
    );
  }

  return errors;
};

/**
 * Validar campos obrigatórios específicos por tipo
 * @param {Object} activity - Dados da atividade
 * @param {number} lineNumber - Número da linha
 * @returns {Array} Array de erros
 */
const validateTypeSpecificFields = (activity, lineNumber) => {
  const errors = [];

  if (!activity.tipo) return errors;

  const requiredFields = REQUIRED_FIELDS_BY_TYPE[activity.tipo] || [];

  // Mapeamento de campos internos para propriedades do objeto
  const fieldMapping = {
    TICKET_MOVIDESK: 'ticketMovidesk',
    URGENCIA: 'urgencia',
    PLATAFORMA: 'plataforma',
    FUNCIONALIDADE: 'funcionalidade',
    SUB_FUNCIONALIDADE: 'subFuncionalidade',
    CLIENTE: 'cliente',
    ID_ORGANIZACAO: 'idOrganizacao',
    EMAIL: 'email',
    TIPO_CLIENTE: 'tipoCliente',
    CRITICIDADE: 'criticidade',
    DIFICULDADE_LOCALIZACAO: 'dificuldadeLocalizacao',
    CAUSA_DEMANDA: 'causaDemanda',
    GARANTIA: 'garantia',
  };

  requiredFields.forEach(field => {
    const propertyName = fieldMapping[field];
    if (
      propertyName &&
      (!activity[propertyName] || activity[propertyName].trim() === '')
    ) {
      errors.push(
        `Linha ${lineNumber}: Campo '${propertyName}' é obrigatório para tipo '${activity.tipo}'`
      );
    }
  });

  return errors;
};

/**
 * Validar valores dos campos contra opções permitidas
 * @param {Object} activity - Dados da atividade
 * @param {number} lineNumber - Número da linha
 * @returns {Array} Array de erros
 */
const validateFieldValues = (activity, lineNumber) => {
  const errors = [];

  // Validar urgência
  if (
    activity.urgencia &&
    !(
      Array.isArray(URGENCIA_OPTIONS) &&
      URGENCIA_OPTIONS.includes(activity.urgencia)
    )
  ) {
    errors.push(
      `Linha ${lineNumber}: Urgência '${activity.urgencia}' inválida. Valores válidos: ${Array.isArray(URGENCIA_OPTIONS) ? URGENCIA_OPTIONS.join(', ') : ''}`
    );
  }

  // Validar plataforma
  if (
    activity.plataforma &&
    !(
      Array.isArray(PLATAFORMA_OPTIONS) &&
      PLATAFORMA_OPTIONS.includes(activity.plataforma)
    )
  ) {
    errors.push(
      `Linha ${lineNumber}: Plataforma '${activity.plataforma}' inválida. Valores válidos: ${Array.isArray(PLATAFORMA_OPTIONS) ? PLATAFORMA_OPTIONS.join(', ') : ''}`
    );
  }

  // Validar tipo de cliente
  if (
    activity.tipoCliente &&
    !(
      Array.isArray(TIPO_CLIENTE_OPTIONS) &&
      TIPO_CLIENTE_OPTIONS.includes(activity.tipoCliente)
    )
  ) {
    errors.push(
      `Linha ${lineNumber}: Tipo de cliente '${activity.tipoCliente}' inválido. Valores válidos: ${Array.isArray(TIPO_CLIENTE_OPTIONS) ? TIPO_CLIENTE_OPTIONS.join(', ') : ''}`
    );
  }

  // Validar criticidade
  if (
    activity.criticidade &&
    !(
      Array.isArray(CRITICIDADE_OPTIONS) &&
      CRITICIDADE_OPTIONS.includes(activity.criticidade)
    )
  ) {
    errors.push(
      `Linha ${lineNumber}: Criticidade '${activity.criticidade}' inválida. Valores válidos: ${Array.isArray(CRITICIDADE_OPTIONS) ? CRITICIDADE_OPTIONS.join(', ') : ''}`
    );
  }

  // Validar dificuldade de localização
  if (
    activity.dificuldadeLocalizacao &&
    !(
      Array.isArray(DIFICULDADE_LOCALIZACAO_OPTIONS) &&
      DIFICULDADE_LOCALIZACAO_OPTIONS.includes(activity.dificuldadeLocalizacao)
    )
  ) {
    errors.push(
      `Linha ${lineNumber}: Dificuldade de localização '${activity.dificuldadeLocalizacao}' inválida. Valores válidos: ${Array.isArray(DIFICULDADE_LOCALIZACAO_OPTIONS) ? DIFICULDADE_LOCALIZACAO_OPTIONS.join(', ') : ''}`
    );
  }

  // Validar causa da demanda
  if (
    activity.causaDemanda &&
    !(
      Array.isArray(CAUSA_DEMANDA_OPTIONS) &&
      CAUSA_DEMANDA_OPTIONS.includes(activity.causaDemanda)
    )
  ) {
    errors.push(
      `Linha ${lineNumber}: Causa da demanda '${activity.causaDemanda}' inválida. Valores válidos: ${Array.isArray(CAUSA_DEMANDA_OPTIONS) ? CAUSA_DEMANDA_OPTIONS.join(', ') : ''}`
    );
  }

  // Validar garantia
  if (
    activity.garantia &&
    !(
      Array.isArray(GARANTIA_OPTIONS) &&
      GARANTIA_OPTIONS.includes(activity.garantia)
    )
  ) {
    errors.push(
      `Linha ${lineNumber}: Garantia '${activity.garantia}' inválida. Valores válidos: ${Array.isArray(GARANTIA_OPTIONS) ? GARANTIA_OPTIONS.join(', ') : ''}`
    );
  }

  // Validar funcionalidade
  if (
    activity.funcionalidade &&
    !Object.keys(FUNCIONALIDADE_OPTIONS).includes(activity.funcionalidade)
  ) {
    errors.push(
      `Linha ${lineNumber}: Funcionalidade '${activity.funcionalidade}' inválida`
    );
  }

  // Validar sub-funcionalidade
  if (activity.subFuncionalidade && activity.funcionalidade) {
    const validSubFuncionalidades =
      FUNCIONALIDADE_OPTIONS[activity.funcionalidade] || [];
    if (!validSubFuncionalidades.includes(activity.subFuncionalidade)) {
      errors.push(
        `Linha ${lineNumber}: Sub-funcionalidade '${activity.subFuncionalidade}' inválida para funcionalidade '${activity.funcionalidade}'`
      );
    }
  }

  // Validar responsável
  if (activity.responsavel) {
    const validResponsaveis = RESPONSAVEL_OPTIONS.map(r => r.name);
    if (
      !validResponsaveis.some(
        name => name.toLowerCase() === activity.responsavel.toLowerCase()
      )
    ) {
      errors.push(
        `Linha ${lineNumber}: Responsável '${activity.responsavel}' inválido. Valores válidos: ${validResponsaveis.join(', ')}`
      );
    }
  }

  // Validar email (formato básico)
  if (activity.email && !isValidEmail(activity.email)) {
    errors.push(`Linha ${lineNumber}: Email '${activity.email}' inválido`);
  }

  // Validar ticket movidesk (deve ser número se preenchido)
  if (activity.ticketMovidesk && isNaN(parseInt(activity.ticketMovidesk))) {
    errors.push(`Linha ${lineNumber}: Ticket Movidesk deve ser um número`);
  }

  // Validar ID organização (deve ser número se preenchido)
  if (activity.idOrganizacao && isNaN(parseInt(activity.idOrganizacao))) {
    errors.push(`Linha ${lineNumber}: ID Organização deve ser um número`);
  }

  // Validar datas
  if (activity.inicioEstimado && !isValidDate(activity.inicioEstimado)) {
    errors.push(
      `Linha ${lineNumber}: Data de início inválida. Use formato YYYY-MM-DD`
    );
  }

  if (activity.terminoEstimado && !isValidDate(activity.terminoEstimado)) {
    errors.push(
      `Linha ${lineNumber}: Data de término inválida. Use formato YYYY-MM-DD`
    );
  }

  // Validar se data de término é posterior à de início
  if (activity.inicioEstimado && activity.terminoEstimado) {
    const startDate = new Date(activity.inicioEstimado);
    const endDate = new Date(activity.terminoEstimado);
    if (endDate < startDate) {
      errors.push(
        `Linha ${lineNumber}: Data de término deve ser posterior à data de início`
      );
    }
  }

  // Validar esforço estimado
  if (
    activity.esforcoEstimado !== undefined &&
    activity.esforcoEstimado !== ''
  ) {
    const effort = parseFloat(activity.esforcoEstimado);
    if (isNaN(effort) || effort < 0) {
      errors.push(
        `Linha ${lineNumber}: Esforço estimado deve ser um número positivo`
      );
    }
  }

  return errors;
};

/**
 * Validar formato de email
 * @param {string} email - Email para validar
 * @returns {boolean} Se o email é válido
 */
const isValidEmail = email => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validar formato de data YYYY-MM-DD
 * @param {string} dateString - String da data
 * @returns {boolean} Se a data é válida
 */
const isValidDate = dateString => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;

  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

/**
 * Gerar resumo de validação
 * @param {Array} errors - Array de erros
 * @returns {Object} Resumo agrupado por tipo de erro
 */
export const generateValidationSummary = errors => {
  const summary = {
    total: errors.length,
    byType: {},
    byLine: {},
    criticalErrors: [],
    warnings: [],
  };

  errors.forEach(error => {
    // Extrair número da linha
    const lineMatch = error.match(/Linha (\d+):/);
    const lineNumber = lineMatch ? parseInt(lineMatch[1]) : 'Desconhecida';

    // Agrupar por linha
    if (!summary.byLine[lineNumber]) {
      summary.byLine[lineNumber] = [];
    }
    summary.byLine[lineNumber].push(error);

    // Categorizar erros
    if (error.includes('é obrigatório')) {
      summary.byType.required = (summary.byType.required || 0) + 1;
      summary.criticalErrors.push(error);
    } else if (error.includes('inválid')) {
      summary.byType.invalid = (summary.byType.invalid || 0) + 1;
    } else if (error.includes('formato')) {
      summary.byType.format = (summary.byType.format || 0) + 1;
    } else {
      summary.byType.other = (summary.byType.other || 0) + 1;
    }
  });

  return summary;
};

/**
 * Gerar recomendações baseadas nos erros
 * @param {Array} errors - Array de erros
 * @returns {Array} Array de recomendações
 */
export const generateRecommendations = errors => {
  const recommendations = [];
  const errorTypes = new Set();

  errors.forEach(error => {
    if (error.includes('é obrigatório')) {
      errorTypes.add('required');
    } else if (error.includes('inválid')) {
      errorTypes.add('invalid');
    } else if (error.includes('formato')) {
      errorTypes.add('format');
    }
  });

  if (errorTypes.has('required')) {
    recommendations.push(
      'Verifique se todos os campos obrigatórios estão preenchidos conforme o tipo de atividade'
    );
  }

  if (errorTypes.has('invalid')) {
    recommendations.push(
      'Confira se os valores estão dentro das opções permitidas (use o template como referência)'
    );
  }

  if (errorTypes.has('format')) {
    recommendations.push(
      'Verifique os formatos: datas (YYYY-MM-DD), números e emails'
    );
  }

  if (
    errors.some(
      e => e.includes('Funcionalidade') || e.includes('Sub-funcionalidade')
    )
  ) {
    recommendations.push(
      'Certifique-se de que a sub-funcionalidade pertence à funcionalidade selecionada'
    );
  }

  if (errors.some(e => e.includes('Data'))) {
    recommendations.push('Data de término deve ser posterior à data de início');
  }

  if (recommendations.length === 0) {
    recommendations.push(
      'Revise os dados conforme as mensagens de erro específicas'
    );
  }

  return recommendations;
};
