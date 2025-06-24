/**
 * Utilitário para parsing de arquivos CSV para importação de atividades
 */

import { ACTIVITY_TYPES, RESPONSAVEL_OPTIONS } from '../constants/artiaOptions';
import { REQUIRED_FIELDS_BY_TYPE } from '../constants/artiaFieldHashes';

/**
 * Headers esperados no CSV para importação
 */
export const CSV_HEADERS = [
  'tipo',
  'titulo',
  'descricao',
  'esforco_estimado',
  'inicio_estimado',
  'termino_estimado',
  'ticket_movidesk',
  'urgencia',
  'plataforma',
  'funcionalidade',
  'sub_funcionalidade',
  'cliente',
  'id_organizacao',
  'email',
  'tipo_cliente',
  'criticidade',
  'dificuldade_localizacao',
  'causa_demanda',
  'garantia',
  'responsavel',
];

/**
 * Mapeamento de headers CSV para nomes de propriedades JS
 */
export const CSV_TO_JS_MAPPING = {
  tipo: 'tipo',
  titulo: 'titulo',
  descricao: 'descricao',
  esforco_estimado: 'esforcoEstimado',
  inicio_estimado: 'inicioEstimado',
  termino_estimado: 'terminoEstimado',
  ticket_movidesk: 'ticketMovidesk',
  urgencia: 'urgencia',
  plataforma: 'plataforma',
  funcionalidade: 'funcionalidade',
  sub_funcionalidade: 'subFuncionalidade',
  cliente: 'cliente',
  id_organizacao: 'idOrganizacao',
  email: 'email',
  tipo_cliente: 'tipoCliente',
  criticidade: 'criticidade',
  dificuldade_localizacao: 'dificuldadeLocalizacao',
  causa_demanda: 'causaDemanda',
  garantia: 'garantia',
  responsavel: 'responsavel',
};

/**
 * Parse CSV content para array de objetos
 * @param {string} csvContent - Conteúdo do arquivo CSV
 * @returns {Object} { data: Array, errors: Array }
 */
export const parseCSV = csvContent => {
  const errors = [];
  const data = [];

  try {
    // Dividir em linhas e filtrar linhas vazias
    const lines = csvContent
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    if (lines.length === 0) {
      return { data: [], errors: ['Arquivo CSV está vazio'] };
    }

    // Primeira linha deve ser o header
    const headerLine = lines[0];
    const headers = parseCSVLine(headerLine);

    // Validar headers obrigatórios
    const missingHeaders = ['tipo', 'titulo'].filter(
      required => !headers.some(h => h.toLowerCase() === required)
    );

    if (missingHeaders.length > 0) {
      errors.push(
        `Headers obrigatórios ausentes: ${missingHeaders.join(', ')}`
      );
      return { data: [], errors };
    }

    // Processar linhas de dados
    for (let i = 1; i < lines.length; i++) {
      const lineNumber = i + 1;
      const values = parseCSVLine(lines[i]);

      if (values.length === 0) continue; // Pular linhas vazias

      // Criar objeto da atividade
      const activity = {};
      headers.forEach((header, index) => {
        const jsProperty = CSV_TO_JS_MAPPING[header.toLowerCase()] || header;
        const value = values[index] || '';
        activity[jsProperty] = value.trim();
      });

      // Validações básicas
      const lineErrors = validateActivityLine(activity, lineNumber);
      if (lineErrors.length > 0) {
        errors.push(...lineErrors);
      } else {
        // Transformar dados conforme necessário
        const transformedActivity = transformActivityData(activity);
        data.push({ ...transformedActivity, _originalLine: lineNumber });
      }
    }

    return { data, errors };
  } catch (error) {
    return {
      data: [],
      errors: [`Erro ao processar CSV: ${error.message}`],
    };
  }
};

/**
 * Parse de uma linha CSV considerando aspas e vírgulas
 * @param {string} line - Linha do CSV
 * @returns {Array} Array de valores
 */
export const parseCSVLine = line => {
  const values = [];
  let current = '';
  let inQuotes = false;
  let i = 0;

  while (i < line.length) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Aspas escapadas ("")
        current += '"';
        i += 2;
      } else {
        // Início ou fim de aspas
        inQuotes = !inQuotes;
        i++;
      }
    } else if (char === ',' && !inQuotes) {
      // Separador de campo
      values.push(current);
      current = '';
      i++;
    } else {
      // Caractere normal
      current += char;
      i++;
    }
  }

  // Adicionar último valor
  values.push(current);

  return values;
};

/**
 * Validações básicas da linha de atividade
 * @param {Object} activity - Dados da atividade
 * @param {number} lineNumber - Número da linha
 * @returns {Array} Array de erros
 */
const validateActivityLine = (activity, lineNumber) => {
  const errors = [];

  // Tipo obrigatório e válido
  if (!activity.tipo) {
    errors.push(`Linha ${lineNumber}: Campo 'tipo' é obrigatório`);
  } else if (!Object.values(ACTIVITY_TYPES).includes(activity.tipo)) {
    errors.push(
      `Linha ${lineNumber}: Tipo '${activity.tipo}' inválido. Tipos válidos: ${Object.values(ACTIVITY_TYPES).join(', ')}`
    );
  }

  // Título obrigatório
  if (!activity.titulo) {
    errors.push(`Linha ${lineNumber}: Campo 'titulo' é obrigatório`);
  }

  // Validar formato de datas se preenchidas
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

  // Validar esforço estimado se preenchido
  if (activity.esforcoEstimado && isNaN(parseFloat(activity.esforcoEstimado))) {
    errors.push(`Linha ${lineNumber}: Esforço estimado deve ser um número`);
  }

  return errors;
};

/**
 * Transforma dados da atividade para formato correto
 * @param {Object} activity - Dados da atividade
 * @returns {Object} Atividade transformada
 */
const transformActivityData = activity => {
  const transformed = { ...activity };

  // Converter esforço para número
  if (transformed.esforcoEstimado) {
    transformed.esforcoEstimado = parseFloat(transformed.esforcoEstimado) || 0;
  }

  // Converter responsável nome para ID
  if (transformed.responsavel) {
    const responsavel = RESPONSAVEL_OPTIONS.find(
      r => r.name.toLowerCase() === transformed.responsavel.toLowerCase()
    );
    if (responsavel) {
      transformed.responsibleId = responsavel.id;
    }
  }

  return transformed;
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
 * Gerar template CSV para download
 * @param {Array} selectedTypes - Tipos de atividade selecionados
 * @returns {string} Conteúdo do CSV template
 */
export const generateCSVTemplate = (
  selectedTypes = Object.values(ACTIVITY_TYPES)
) => {
  // Header do CSV com indicadores de campos obrigatórios
  const headerWithRequiredIndicators = CSV_HEADERS.map(field => {
    // Mapear header para field interno
    const fieldMapping = {
      tipo: 'TIPO',
      titulo: 'TITULO',
      ticketMovidesk: 'TICKET_MOVIDESK',
      urgencia: 'URGENCIA',
      plataforma: 'PLATAFORMA',
      funcionalidade: 'FUNCIONALIDADE',
      subFuncionalidade: 'SUB_FUNCIONALIDADE',
      cliente: 'CLIENTE',
      idOrganizacao: 'ID_ORGANIZACAO',
      email: 'EMAIL',
      tipoCliente: 'TIPO_CLIENTE',
      criticidade: 'CRITICIDADE',
      dificuldadeLocalizacao: 'DIFICULDADE_LOCALIZACAO',
      causaDemanda: 'CAUSA_DEMANDA',
      garantia: 'GARANTIA',
    };

    const fieldKey = fieldMapping[CSV_TO_JS_MAPPING[field]];

    // Verificar se é obrigatório para algum dos tipos selecionados
    const isRequiredForAnyType = selectedTypes.some(type => {
      const requiredFields = REQUIRED_FIELDS_BY_TYPE[type] || [];
      return requiredFields.includes(fieldKey);
    });

    // Campos sempre obrigatórios
    const alwaysRequired = ['tipo', 'titulo'];
    const isAlwaysRequired = alwaysRequired.includes(CSV_TO_JS_MAPPING[field]);

    if (isAlwaysRequired) {
      return `${field} (*)`;
    } else if (isRequiredForAnyType) {
      return `${field} (**)`;
    } else {
      return field;
    }
  });

  const header = headerWithRequiredIndicators.join(',');

  // Linha de explicação dos indicadores
  const legend =
    '"LEGENDA: (*) = SEMPRE OBRIGATÓRIO | (**) = OBRIGATÓRIO PARA ALGUNS TIPOS | sem indicador = OPCIONAL"' +
    ',' +
    Array(CSV_HEADERS.length - 1)
      .fill('')
      .join(',');

  // Linha em branco para separação
  const separator = Array(CSV_HEADERS.length).fill('').join(',');

  // Exemplos para cada tipo selecionado
  const examples = selectedTypes.map((type, index) => {
    const example = getExampleForType(type, index + 1);
    return CSV_HEADERS.map(field => {
      const value = example[CSV_TO_JS_MAPPING[field]] || '';
      // Escapar valores que contêm vírgulas ou aspas
      if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(',');
  });

  // Adicionar comentário explicativo sobre cada tipo
  const typeComments = selectedTypes.map(type => {
    const requiredFields = REQUIRED_FIELDS_BY_TYPE[type] || [];
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

    const requiredFieldNames = requiredFields
      .map(field => fieldMapping[field])
      .filter(Boolean);
    const allRequired = ['tipo', 'titulo', ...requiredFieldNames];

    return (
      `"TIPO: ${type} | CAMPOS OBRIGATÓRIOS: ${allRequired.join(', ')}"` +
      ',' +
      Array(CSV_HEADERS.length - 1)
        .fill('')
        .join(',')
    );
  });

  return [
    header,
    legend,
    separator,
    ...typeComments,
    separator,
    ...examples,
  ].join('\n');
};

/**
 * Gerar exemplo de atividade para um tipo específico
 * @param {string} type - Tipo da atividade
 * @param {number} index - Índice para variação dos dados
 * @returns {Object} Exemplo de atividade
 */
const getExampleForType = (type, index) => {
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() + index);
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 2);

  const baseExample = {
    tipo: type,
    titulo: `[${type.toUpperCase()}-${index.toString().padStart(3, '0')}] Exemplo de ${type}`,
    descricao: `Descrição detalhada da atividade de ${type}`,
    esforcoEstimado: '2.5',
    inicioEstimado: startDate.toISOString().split('T')[0],
    terminoEstimado: endDate.toISOString().split('T')[0],
    responsavel: 'Alexandre',
  };

  // Adicionar campos específicos por tipo
  switch (type) {
    case ACTIVITY_TYPES.BUG_PRODUCAO:
      return {
        ...baseExample,
        ticketMovidesk: 'MOV-12345',
        urgencia: 'Alto',
        plataforma: 'Desktop',
        funcionalidade: 'Login',
        subFuncionalidade: 'Autenticação',
        cliente: 'Cliente Exemplo',
        idOrganizacao: '12345',
        email: 'cliente@exemplo.com',
        tipoCliente: 'Cliente externo',
        criticidade: 'Alto',
        dificuldadeLocalizacao: 'Médio',
        causaDemanda: 'Erro de código',
        garantia: 'Não',
      };

    case ACTIVITY_TYPES.BUG_RETRABALHO:
      return {
        ...baseExample,
        plataforma: 'Desktop',
        funcionalidade: 'Dashboard',
        subFuncionalidade: 'Dashboard - visão admin',
        criticidade: 'Médio',
        causaDemanda: 'Falta de definição',
      };

    case ACTIVITY_TYPES.DESENVOLVIMENTO:
    case ACTIVITY_TYPES.EXECUCAO_TESTES:
    case ACTIVITY_TYPES.AUTOMACAO_TESTES:
    case ACTIVITY_TYPES.ANALISE_TESTES:
      return {
        ...baseExample,
        funcionalidade: 'API',
        subFuncionalidade: 'Autenticação',
      };

    default:
      return baseExample;
  }
};

/**
 * Validar arquivo antes do upload
 * @param {File} file - Arquivo selecionado
 * @returns {Object} { isValid: boolean, error: string }
 */
export const validateFile = file => {
  // Verificar se é um arquivo
  if (!file) {
    return { isValid: false, error: 'Nenhum arquivo selecionado' };
  }

  // Verificar extensão
  const validExtensions = ['.csv', '.txt'];
  const fileName = file.name.toLowerCase();
  const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext));

  if (!hasValidExtension) {
    return {
      isValid: false,
      error: `Arquivo deve ter extensão ${validExtensions.join(' ou ')}`,
    };
  }

  // Verificar tamanho (50MB máximo)
  const maxSize = 50 * 1024 * 1024; // 50MB
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'Arquivo muito grande. Tamanho máximo: 50MB',
    };
  }

  return { isValid: true, error: null };
};
