/**
 * Utilitário para parsing de arquivos CSV para importação de atividades
 */

import {
  RESPONSAVEL_OPTIONS,
  getEnabledActivityTypes,
  CUSTOM_STATUS_OPTIONS,
} from '../constants/artiaOptions';
import { REQUIRED_FIELDS_BY_TYPE } from '../constants/artiaFieldHashes';
import Papa from 'papaparse';

/**
 * Headers esperados no CSV para importação
 */
export const CSV_HEADERS = [
  'account_id',
  'folder_id',
  'situacao_atividade',
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
 * Mapeamento inverso: de nomes internos JS para headers CSV corretos
 */
export const JS_TO_CSV_MAPPING = {
  artiaId: 'artia_id',
  artiaUid: 'artia_uid',
  accountId: 'account_id',
  folderId: 'folder_id',
  customStatusId: 'custom_status_id',
  situacaoAtividade: 'situacao_atividade',
  tipo: 'tipo',
  titulo: 'titulo',
  descricao: 'descricao',
  esforcoEstimado: 'esforco_estimado',
  inicioEstimado: 'inicio_estimado',
  terminoEstimado: 'termino_estimado',
  ticketMovidesk: 'ticket_movidesk',
  urgencia: 'urgencia',
  plataforma: 'plataforma',
  funcionalidade: 'funcionalidade',
  subFuncionalidade: 'sub_funcionalidade',
  cliente: 'cliente',
  idOrganizacao: 'id_organizacao',
  email: 'email',
  tipoCliente: 'tipo_cliente',
  criticidade: 'criticidade',
  dificuldadeLocalizacao: 'dificuldade_localizacao',
  causaDemanda: 'causa_demanda',
  garantia: 'garantia',
  responsavel: 'responsavel',
  _originalLine: '_original_line',
};

/**
 * Mapeamento de headers CSV para nomes de propriedades JS
 */
export const CSV_TO_JS_MAPPING = {
  // Campos obrigatórios
  tipo: 'tipo',
  titulo: 'titulo',

  // Campos de identificação do Artia
  account_id: 'accountId',
  folder_id: 'folderId',
  custom_status_id: 'customStatusId',

  // Campos opcionais comuns
  descricao: 'descricao',
  esforco_estimado: 'esforcoEstimado',
  inicio_estimado: 'inicioEstimado',
  termino_estimado: 'terminoEstimado',
  situacao_atividade: 'situacaoAtividade',
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

  // Campos específicos para atualização
  artia_id: 'artiaId',
  artia_uid: 'artiaUid',

  // Campos de controle interno
  _original_line: '_originalLine',
};

/**
 * Validações específicas para template de atualização
 * @param {Object} activity - Dados da atividade
 * @param {number} lineNumber - Número da linha (incluindo header)
 * @param {Array} availableFields - Campos disponíveis no CSV
 * @returns {Array} Array de erros
 */
const validateUpdateActivityLine = (
  activity,
  lineNumber,
  availableFields = []
) => {
  const errors = [];
  const dataLineNumber = lineNumber - 1; // Número da linha de dados (excluindo header)

  // Campos obrigatórios para atualização
  if (!activity.artia_id || activity.artia_id.toString().trim() === '') {
    errors.push(
      `Linha ${dataLineNumber} (linha de dados): Campo 'artia_id' é obrigatório para atualização. ` +
        `Campos encontrados no CSV: [${availableFields.join(', ')}]`
    );
  } else {
    // Validar se artia_id é um número válido
    const artiaIdValue = parseInt(activity.artia_id);
    if (isNaN(artiaIdValue) || artiaIdValue <= 0) {
      errors.push(
        `Linha ${dataLineNumber} (linha de dados): ID da atividade '${activity.artia_id}' deve ser um número inteiro positivo`
      );
    }
  }

  if (!activity.titulo || activity.titulo.toString().trim() === '') {
    errors.push(
      `Linha ${dataLineNumber} (linha de dados): Campo 'titulo' é obrigatório para atualização`
    );
  }

  if (!activity.account_id || activity.account_id.toString().trim() === '') {
    errors.push(
      `Linha ${dataLineNumber} (linha de dados): Campo 'account_id' é obrigatório para atualização. ` +
        `Campos encontrados no CSV: [${availableFields.join(', ')}]`
    );
  }

  // Validar account_id se preenchido
  if (activity.account_id && activity.account_id.toString().trim() !== '') {
    const accountIdValue = parseInt(activity.account_id);
    if (isNaN(accountIdValue) || accountIdValue <= 0) {
      errors.push(
        `Linha ${dataLineNumber} (linha de dados): ID do Grupo de Trabalho '${activity.account_id}' deve ser um número inteiro positivo`
      );
    }
  }

  // Validar folder_id se preenchido
  if (activity.folder_id && activity.folder_id.toString().trim() !== '') {
    const folderIdValue = parseInt(activity.folder_id);
    if (isNaN(folderIdValue) || folderIdValue <= 0) {
      errors.push(
        `Linha ${dataLineNumber} (linha de dados): ID da Pasta/Projeto '${activity.folder_id}' deve ser um número inteiro positivo`
      );
    }
  }

  // Converter e validar formato de datas se preenchidas
  if (activity.inicio_estimado) {
    activity.inicio_estimado = convertDateToISO(activity.inicio_estimado);
    if (!isValidDate(activity.inicio_estimado)) {
      errors.push(
        `Linha ${dataLineNumber} (linha de dados): Data de início inválida. Use formato DD/MM/YYYY ou YYYY-MM-DD`
      );
    }
  }

  if (activity.termino_estimado) {
    activity.termino_estimado = convertDateToISO(activity.termino_estimado);
    if (!isValidDate(activity.termino_estimado)) {
      errors.push(
        `Linha ${dataLineNumber} (linha de dados): Data de término inválida. Use formato DD/MM/YYYY ou YYYY-MM-DD`
      );
    }
  }

  // Validar esforço estimado se preenchido
  if (activity.esforco_estimado) {
    const testValue = activity.esforco_estimado.toString().replace(',', '.');
    if (isNaN(parseFloat(testValue))) {
      errors.push(
        `Linha ${dataLineNumber} (linha de dados): Esforço estimado deve ser um número (use ponto ou vírgula como separador decimal, ex: 2.5 ou 2,5)`
      );
    } else {
      activity.esforco_estimado = activity.esforco_estimado.toString();
    }
  }

  // Validar situação/status se preenchido
  if (
    activity.situacao_atividade &&
    activity.situacao_atividade.toString().trim() !== ''
  ) {
    const status = CUSTOM_STATUS_OPTIONS.find(
      s => s.name.toLowerCase() === activity.situacao_atividade.toLowerCase()
    );
    if (!status) {
      errors.push(
        `Linha ${dataLineNumber} (linha de dados): Situação '${activity.situacao_atividade}' inválida. Valores válidos: ${CUSTOM_STATUS_OPTIONS.map(s => s.name).join(', ')}`
      );
    }
  }

  return errors;
};

function normalizeHeader(header) {
  const original = header;
  const normalized = header
    .replace(/\s*\(\*+\)\s*$/, '') // remove (*), (**) etc
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove acentos
    .replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`) // camelCase para snake_case
    .replace(/[\s-]+/g, '_') // espaços e hífens para _
    .replace(/__+/g, '_') // múltiplos _ para um só
    .replace(/^_+|_+$/g, '') // remove _ do início/fim
    .toLowerCase();

  // Headers artia_id normalizados automaticamente

  return normalized;
}

/**
 * Parse CSV content para array de objetos
 * @param {string} csvContent - Conteúdo do arquivo CSV
 * @param {boolean} isUpdateTemplate - Se é template de atualização
 * @returns {Object} { data: Array, errors: Array, isUpdateDetected: boolean }
 */
export const parseCSV = (csvContent, isUpdateTemplate = false) => {
  const errors = [];
  let originalHeaders = [];
  let data = [];

  try {
    const result = Papa.parse(csvContent, {
      header: true,
      delimiter: ';',
      skipEmptyLines: true,
      dynamicTyping: false,
    });

    if (result.errors.length > 0) {
      errors.push(
        ...result.errors.map(e => `Erro na linha ${e.row}: ${e.message}`)
      );
      return { data: [], errors, originalHeaders: [], isUpdateDetected: false };
    }

    // Normalizar headers para snake_case
    originalHeaders = (result.meta.fields || []).map(h => normalizeHeader(h));

    // Detectar automaticamente se é template de atualização baseado nos headers
    // Verificar várias possibilidades de nomes para o ID do Artia
    const artiaIdVariations = ['artia_id', 'artiaid', 'id_artia', 'id'];
    const hasArtiaId = artiaIdVariations.some(
      variation =>
        originalHeaders.includes(variation) ||
        originalHeaders.some(
          header =>
            header.toLowerCase().includes('artia') &&
            header.toLowerCase().includes('id')
        )
    );
    const autoDetectedUpdate = hasArtiaId || isUpdateTemplate;

    // Detectar header do Artia para validação de template
    const detectedArtiaHeader = originalHeaders.find(
      header =>
        artiaIdVariations.includes(header) ||
        (header.toLowerCase().includes('artia') &&
          header.toLowerCase().includes('id'))
    );

    // Para cada linha, criar objeto com chaves normalizadas
    data = result.data.map(row => {
      const normalized = {};
      Object.entries(row).forEach(([key, value]) => {
        const normKey = normalizeHeader(key);
        normalized[normKey] = value;
      });
      return normalized;
    });

    // Validação e transformação dos dados (mantendo lógica anterior)
    const validatedData = [];
    for (let i = 0; i < data.length; i++) {
      const activity = data[i];
      const lineNumber = i + 2; // +2 por causa do header
      let lineErrors = [];
      if (autoDetectedUpdate) {
        lineErrors = validateUpdateActivityLine(
          activity,
          lineNumber,
          originalHeaders
        );
      } else {
        lineErrors = validateActivityLine(activity, lineNumber);
      }
      if (lineErrors.length > 0) {
        errors.push(...lineErrors);
      } else {
        const transformedActivity = transformActivityData(activity);
        validatedData.push({
          ...transformedActivity,
          _originalLine: lineNumber,
        });
      }
    }

    return {
      data: validatedData,
      errors,
      originalHeaders,
      isUpdateDetected: autoDetectedUpdate,
    };
  } catch (error) {
    return {
      data: [],
      errors: [`Erro ao processar CSV: ${error.message}`],
      originalHeaders: [],
      isUpdateDetected: false,
    };
  }
};

/**
 * Parse linha CSV considerando aspas e escape
 * @param {string} line - Linha do CSV
 * @returns {Array} Array de valores
 */
const parseCSVLine = line => {
  // Detectar o delimitador (vírgula ou ponto-e-vírgula)
  const delimiter = line.includes(';') ? ';' : ',';

  const values = [];
  let currentValue = '';
  let isInsideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      // Se encontrar aspas duplas seguidas dentro de um valor entre aspas, considerar como escape
      if (isInsideQuotes && line[i + 1] === '"') {
        currentValue += '"';
        i++; // Pular próxima aspas
        continue;
      }
      isInsideQuotes = !isInsideQuotes;
    } else if (char === delimiter && !isInsideQuotes) {
      // Fim do valor atual
      values.push(currentValue.trim());
      currentValue = '';
    } else {
      currentValue += char;
    }
  }

  // Adicionar último valor
  values.push(currentValue.trim());
  return values;
};

/**
 * Validações básicas da linha de atividade
 * @param {Object} activity - Dados da atividade
 * @param {number} lineNumber - Número da linha (incluindo header)
 * @returns {Array} Array de erros
 */
const validateActivityLine = (activity, lineNumber) => {
  const errors = [];
  const dataLineNumber = lineNumber - 1; // Número da linha de dados (excluindo header)

  // Tipo obrigatório e válido
  if (!activity.tipo) {
    errors.push(
      `Linha ${dataLineNumber} (linha de dados): Campo 'tipo' é obrigatório`
    );
  } else if (
    !Object.values(getEnabledActivityTypes()).includes(activity.tipo)
  ) {
    errors.push(
      `Linha ${dataLineNumber} (linha de dados): Tipo '${activity.tipo}' inválido. Tipos válidos: ${Object.values(getEnabledActivityTypes()).join(', ')}`
    );
  }

  // Título obrigatório
  if (!activity.titulo) {
    errors.push(
      `Linha ${dataLineNumber} (linha de dados): Campo 'titulo' é obrigatório`
    );
  }

  // Converter e validar formato de datas se preenchidas
  if (activity.inicio_estimado) {
    activity.inicio_estimado = convertDateToISO(activity.inicio_estimado);
    if (!isValidDate(activity.inicio_estimado)) {
      errors.push(
        `Linha ${dataLineNumber} (linha de dados): Data de início inválida. Use formato DD/MM/YYYY ou YYYY-MM-DD`
      );
    }
  }

  if (activity.termino_estimado) {
    activity.termino_estimado = convertDateToISO(activity.termino_estimado);
    if (!isValidDate(activity.termino_estimado)) {
      errors.push(
        `Linha ${dataLineNumber} (linha de dados): Data de término inválida. Use formato DD/MM/YYYY ou YYYY-MM-DD`
      );
    }
  }

  // Validar esforço estimado se preenchido
  if (activity.esforco_estimado) {
    // Converter vírgula para ponto temporariamente apenas para validação numérica
    const testValue = activity.esforco_estimado.toString().replace(',', '.');
    if (isNaN(parseFloat(testValue))) {
      errors.push(
        `Linha ${dataLineNumber} (linha de dados): Esforço estimado deve ser um número (use ponto ou vírgula como separador decimal, ex: 2.5 ou 2,5)`
      );
    } else {
      // Manter o valor original exatamente como está
      activity.esforco_estimado = activity.esforco_estimado.toString();
    }
  }

  // Validar situação/status se preenchido
  if (
    activity.situacao_atividade &&
    activity.situacao_atividade.toString().trim() !== ''
  ) {
    const status = CUSTOM_STATUS_OPTIONS.find(
      s => s.name.toLowerCase() === activity.situacao_atividade.toLowerCase()
    );
    if (!status) {
      errors.push(
        `Linha ${dataLineNumber} (linha de dados): Situação '${activity.situacao_atividade}' inválida. Valores válidos: ${CUSTOM_STATUS_OPTIONS.map(s => s.name).join(', ')}`
      );
    }
  }

  // Validar account_id se preenchido
  if (activity.account_id && activity.account_id.toString().trim() !== '') {
    const accountIdValue = parseInt(activity.account_id);
    if (isNaN(accountIdValue) || accountIdValue <= 0) {
      errors.push(
        `Linha ${dataLineNumber} (linha de dados): ID do Grupo de Trabalho '${activity.account_id}' deve ser um número inteiro positivo`
      );
    }
  }

  // Validar folder_id se preenchido
  if (activity.folder_id && activity.folder_id.toString().trim() !== '') {
    const folderIdValue = parseInt(activity.folder_id);
    if (isNaN(folderIdValue) || folderIdValue <= 0) {
      errors.push(
        `Linha ${dataLineNumber} (linha de dados): ID da Pasta/Projeto '${activity.folder_id}' deve ser um número inteiro positivo`
      );
    }
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
  if (transformed.esforco_estimado) {
    transformed.esforco_estimado =
      parseFloat(transformed.esforco_estimado) || 0;
  }

  // Converter account_id para número se preenchido
  if (
    transformed.account_id &&
    transformed.account_id.toString().trim() !== ''
  ) {
    const accountIdValue = parseInt(transformed.account_id);
    if (!isNaN(accountIdValue) && accountIdValue > 0) {
      transformed.account_id = accountIdValue.toString();
    }
  }

  // Converter folder_id para número se preenchido
  if (transformed.folder_id && transformed.folder_id.toString().trim() !== '') {
    const folderIdValue = parseInt(transformed.folder_id);
    if (!isNaN(folderIdValue) && folderIdValue > 0) {
      transformed.folder_id = folderIdValue.toString();
    }
  }

  // Converter responsável nome para ID
  if (transformed.responsavel) {
    const responsavel = RESPONSAVEL_OPTIONS.find(
      r => r.name.toLowerCase() === transformed.responsavel.toLowerCase()
    );
    if (responsavel) {
      transformed.responsible_id = responsavel.id;
    }
  }

  // --- SITUAÇÃO/STATUS ---
  // Se a coluna existe e está preenchida
  if (Object.prototype.hasOwnProperty.call(transformed, 'situacao_atividade')) {
    if (
      transformed.situacao_atividade &&
      transformed.situacao_atividade.toString().trim() !== ''
    ) {
      // Buscar status por nome (case-insensitive)
      const status = CUSTOM_STATUS_OPTIONS.find(
        s =>
          s.name.toLowerCase() === transformed.situacao_atividade.toLowerCase()
      );

      if (status) {
        transformed.custom_status_id = status.id;
        transformed.has_valid_custom_status = true;
      } else {
        // Valor inválido - será usado o padrão do card
        transformed.custom_status_id = null;
        transformed.has_valid_custom_status = false;
      }
    } else {
      // Coluna existe mas está vazia: forçar uso do select
      transformed.custom_status_id = null;
      transformed.has_valid_custom_status = false;
    }
  } else {
    // Coluna não existe: forçar uso do select
    transformed.custom_status_id = null;
    transformed.has_valid_custom_status = false;
  }

  // --- DESCRIÇÃO ---
  // Se vier preenchida do CSV, usar. Só usar fallback se não houver valor.
  if (
    Object.prototype.hasOwnProperty.call(transformed, 'descricao') &&
    transformed.descricao &&
    transformed.descricao.toString().trim() !== ''
  ) {
    // Mantém a descrição do CSV
  } else {
    // Fallback será aplicado no ArtiaService se necessário
    transformed.descricao = '';
  }

  return transformed;
};

/**
 * Converter data do formato brasileiro (DD/MM/YYYY) para ISO (YYYY-MM-DD)
 * @param {string} dateString - String da data
 * @returns {string} Data no formato ISO ou string original se já estiver correto
 */
const convertDateToISO = dateString => {
  if (!dateString || dateString.trim() === '') return dateString;

  // Se já está no formato ISO, retorna como está
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString;
  }

  // Tentar converter do formato brasileiro DD/MM/YYYY
  const brDateRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
  const match = dateString.match(brDateRegex);

  if (match) {
    const [, day, month, year] = match;
    // Adicionar zeros à esquerda se necessário
    const paddedDay = day.padStart(2, '0');
    const paddedMonth = month.padStart(2, '0');
    return `${year}-${paddedMonth}-${paddedDay}`;
  }

  return dateString; // Retorna original se não conseguir converter
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
 * Gerar template CSV para importação
 */
export const generateCSVTemplate = (
  selectedTypes = Object.values(getEnabledActivityTypes()),
  selectedStatusId = null
) => {
  try {
    // Usar ponto-e-vírgula como delimitador padrão (mais comum no Excel BR)
    const delimiter = ';';

    // Headers com indicadores de obrigatoriedade
    const headersWithIndicators = CSV_HEADERS.map(header => {
      if (['tipo', 'titulo', 'account_id', 'folder_id'].includes(header)) {
        return `${header} (*)`;
      }
      return header;
    });

    // Linhas de explicação
    const legend = [
      '"LEGENDA: (*) = SEMPRE OBRIGATÓRIO | (**) = OBRIGATÓRIO PARA ALGUNS TIPOS | sem indicador = OPCIONAL"',
      '"FORMATO: Arquivo CSV usando ponto-e-vírgula (;) como delimitador - compatível com Excel BR"',
      '"IMPORTAÇÃO: Aceita tanto vírgula (,) quanto ponto-e-vírgula (;) como delimitadores automaticamente"',
      '"CODIFICAÇÃO: UTF-8 com BOM para compatibilidade total com caracteres especiais"',
      '"ESFORÇO: Use horas (ex: 2 ou 3). Valores decimais (2.5 ou 2,5) serão arredondados para cima (3)"',
      '"DATAS: Use o formato DD/MM/YYYY (ex: 20/03/2024)"',
      '"CAMPOS DISPONÍVEIS: Apenas os campos que continham dados na importação original são exibidos"',
      '',
    ];

    // Adicionar lista de responsáveis disponíveis
    const responsibleList = [
      '"RESPONSÁVEIS DISPONÍVEIS:"',
      ...RESPONSAVEL_OPTIONS.map(resp => `"${resp.name}"`),
    ];

    // Exemplos para cada tipo selecionado
    const examples = selectedTypes.map((type, index) => {
      const example = getExampleForType(type, index + 1, selectedStatusId);
      return CSV_HEADERS.map(field => {
        const value = example[CSV_TO_JS_MAPPING[field]] || '';
        // Escapar valores APENAS se contêm delimitadores, aspas ou quebras de linha
        if (
          value.includes(delimiter) ||
          value.includes('"') ||
          value.includes('\n')
        ) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(delimiter);
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
      };

      const requiredFieldsFormatted = requiredFields
        .map(field => fieldMapping[field] || field)
        .join(', ');

      return `"TIPO: ${type} | CAMPOS OBRIGATÓRIOS: ${requiredFieldsFormatted}"`;
    });

    // Montar conteúdo final com BOM para UTF-8
    const content = [
      ...legend,
      ...responsibleList,
      '',
      ...typeComments,
      '',
      headersWithIndicators.join(delimiter),
      ...examples,
    ].join('\n');

    // Adicionar BOM para UTF-8
    return '\ufeff' + content;
  } catch (error) {
    // Erro ao gerar template CSV
    throw new Error(`Erro ao gerar template: ${error.message}`);
  }
};

/**
 * Gerar exemplo para um tipo específico
 */
const getExampleForType = (type, index, selectedStatusId = null) => {
  const example = {
    // Campos de identificação
    accountId: '4874953',
    folderId: '4885568',
    customStatusId: selectedStatusId || '246888',

    // Campos básicos
    tipo: type,
    titulo: `[${type.toUpperCase()}-${String(index).padStart(3, '0')}] Exemplo de ${type}`,
    descricao: `Descrição detalhada da atividade de ${type}`,

    // Campos de tempo
    esforcoEstimado: index % 2 === 0 ? '2' : '3',
    inicioEstimado: new Date(Date.now() + index * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    terminoEstimado: new Date(Date.now() + (index + 2) * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],

    // Campos específicos por tipo
    funcionalidade: type === 'Documentação' ? '' : 'API',
    subFuncionalidade: type === 'Documentação' ? '' : 'Autenticação',
    ticketMovidesk: type === 'Desenvolvimento' ? '' : '',
    urgencia: type === 'Desenvolvimento' ? '' : '',
    plataforma: type === 'Desenvolvimento' ? '' : '',

    // Campos opcionais
    responsavel:
      RESPONSAVEL_OPTIONS[index % RESPONSAVEL_OPTIONS.length]?.name || '',
  };

  return example;
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

/**
 * Gera template CSV para atualização de atividades
 * @param {Array} activities - Lista de atividades do relatório de importação
 * @param {Object} credentials - Credenciais/configurações da aplicação
 * @param {string} selectedStatus - Status selecionado na aplicação
 * @returns {string} Conteúdo do CSV
 */
export const generateUpdateTemplate = (
  activities,
  credentials = null,
  selectedStatus = null
) => {
  if (!activities || activities.length === 0) {
    return 'Nenhuma atividade disponível para gerar template de atualização';
  }

  // Filtrar atividades que possuem ID (obrigatório para atualização)
  const validActivities = activities.filter(activity => activity.id);

  if (validActivities.length === 0) {
    return 'Nenhuma atividade com ID válido encontrada para atualização';
  }

  // Função para converter ID de status para nome legível
  const getStatusNameById = statusId => {
    const status = CUSTOM_STATUS_OPTIONS.find(s => s.id === parseInt(statusId));
    return status ? status.name : '';
  };

  // Campos obrigatórios para atualização segundo a documentação da API
  const mandatoryFields = [
    'artiaId', // id
    'titulo', // title
    'accountId',
  ];

  // Coletar todos os campos que têm dados em pelo menos uma atividade
  const allFields = new Set(mandatoryFields);

  // Adicionar campos de configuração se disponíveis
  if (credentials?.accountId) {
    allFields.add('accountId');
  }
  if (credentials?.folderId) {
    allFields.add('folderId');
  }
  if (selectedStatus) {
    allFields.add('situacaoAtividade');
  }

  validActivities.forEach(activity => {
    const originalData = activity.originalData || {};

    // Adicionar campos básicos da atividade se disponíveis
    if (activity.titulo || activity.title) allFields.add('titulo');
    if (activity.tipo || activity.type) allFields.add('tipo');
    if (activity.descricao || activity.description) allFields.add('descricao');
    if (activity.accountId) allFields.add('accountId');
    if (activity.folderId) allFields.add('folderId');
    if (activity.uid) allFields.add('artiaUid');

    // Adicionar campo de situação se há dados de status
    if (
      activity.customStatusId ||
      originalData.customStatusId ||
      originalData.situacao_atividade
    ) {
      allFields.add('situacaoAtividade');
    }

    // Adicionar campos dos dados originais
    Object.keys(originalData).forEach(field => {
      const value = originalData[field];
      // Adicionar campo se tiver valor não vazio
      if (value && value.toString().trim() !== '') {
        allFields.add(field);
      }
    });
  });

  // Converter para array e ordenar (mantendo identificadores no início)
  const headers = [...allFields];

  // Ordem preferencial: obrigatórios primeiro
  const fieldOrder = [
    'artiaId', // id
    'titulo', // title
    'accountId',
    'artiaUid',
    'folderId',
    'situacaoAtividade',
    'tipo',
    'descricao',
    'responsavel',
    'esforcoEstimado',
    'inicioEstimado',
    'terminoEstimado',
    'urgencia',
    'funcionalidade',
    'subFuncionalidade',
    'plataforma',
    'ticketMovidesk',
    'cliente',
    'idOrganizacao',
    'email',
    'tipoCliente',
    'criticidade',
    'dificuldadeLocalizacao',
    'causaDemanda',
    'garantia',
    'dataInicio',
    'dataFim',
    'observacoes',
  ];

  const orderedHeaders = [];
  fieldOrder.forEach(field => {
    if (headers.includes(field)) {
      orderedHeaders.push(field);
    }
  });
  headers.forEach(field => {
    if (!orderedHeaders.includes(field)) {
      orderedHeaders.push(field);
    }
  });

  // Converter headers internos para formato CSV correto (snake_case)
  const csvHeaders = orderedHeaders.map(header => {
    const csvHeader = JS_TO_CSV_MAPPING[header] || header;
    const normalizedHeader = normalizeHeader(csvHeader);
    // Adicionar (*) apenas aos campos realmente obrigatórios
    if (['artia_id', 'titulo', 'account_id'].includes(normalizedHeader)) {
      return `${normalizedHeader} (*)`;
    }
    return normalizedHeader;
  });

  // Criar linhas de documentação
  const documentation = [
    '"LEGENDA: (*) Campo obrigatório para atualização | Demais campos são opcionais"',
    '"IMPORTANTE: Para atualizar uma atividade, é necessário fornecer artia_id, titulo e account_id"',
    '"CONFIGURAÇÃO: Os demais campos podem ser preenchidos automaticamente com os valores da criação"',
    "\"SITUAÇÃO: Use nomes como 'Não iniciado', 'Backlog', 'Backlog Programado', 'Triagem'\"",
    '"FORMATO: Arquivo CSV usando ponto-e-vírgula (;) como delimitador - compatível com Excel BR"',
    '"CODIFICAÇÃO: UTF-8 com BOM para compatibilidade total com caracteres especiais"',
    '',
  ];

  // Criar linhas com os dados das atividades existentes
  const activityRows = validActivities.map(activity => {
    const originalData = activity.originalData || {};
    return orderedHeaders
      .map(header => {
        let value = '';
        switch (header) {
          case 'artiaId':
            value = activity.id || '';
            break;
          case 'titulo':
            value =
              originalData.titulo || activity.titulo || activity.title || '';
            break;
          case 'accountId':
            // Prioridade: dados originais > dados da atividade > configuração da aplicação
            value =
              originalData.accountId ||
              originalData.account_id ||
              activity.accountId ||
              credentials?.accountId ||
              '';
            break;
          case 'artiaUid':
            value = activity.uid || '';
            break;
          case 'folderId':
            // Prioridade: dados originais > dados da atividade > configuração da aplicação
            value =
              originalData.folderId ||
              originalData.folder_id ||
              activity.folderId ||
              credentials?.folderId ||
              '';
            break;
          case 'situacaoAtividade': {
            // Prioridade: dados originais (nome) > dados da atividade (ID) > configuração da aplicação (ID)
            // Se já é nome, manter. Se é ID, converter para nome
            const statusValue =
              originalData.situacao_atividade ||
              originalData.situacaoAtividade ||
              activity.situacaoAtividade ||
              activity.customStatusId ||
              selectedStatus ||
              '';

            // Se o valor é um número (ID), converter para nome
            if (statusValue && !isNaN(parseInt(statusValue))) {
              const statusName = getStatusNameById(statusValue);
              value = statusName || statusValue;
            } else {
              value = statusValue;
            }
            break;
          }
          case 'tipo':
            value = originalData.tipo || activity.tipo || activity.type || '';
            break;
          case 'descricao':
            value =
              originalData.descricao ||
              activity.descricao ||
              activity.description ||
              '';
            break;
          default:
            value = originalData[header] || '';
        }
        value = value.toString().trim();
        if (
          value.includes(';') ||
          value.includes('"') ||
          value.includes('\n')
        ) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      })
      .join(';');
  });

  // Montar o CSV final com BOM para UTF-8
  const content = [
    ...documentation,
    csvHeaders.join(';'),
    ...activityRows,
  ].join('\n');
  return '\ufeff' + content;
};

/**
 * Gera template CSV para atualização de atividades baseado nos headers do arquivo importado
 * @param {Array} activities - Lista de atividades do relatório de importação
 * @param {Array} originalHeaders - Headers originais do arquivo importado
 * @param {Object} credentials - Credenciais/configurações da aplicação
 * @param {string} selectedStatus - Status selecionado na aplicação
 * @returns {string} Conteúdo do CSV
 */
export const generateUpdateTemplateFromHeaders = (
  activities,
  originalHeaders,
  credentials = null,
  selectedStatus = null
) => {
  if (!activities || activities.length === 0) {
    return 'Nenhuma atividade disponível para gerar template de atualização';
  }

  if (!originalHeaders || originalHeaders.length === 0) {
    return 'Headers originais não encontrados para gerar template de atualização';
  }

  // Função para converter ID de status para nome legível
  const getStatusNameById = statusId => {
    const status = CUSTOM_STATUS_OPTIONS.find(s => s.id === parseInt(statusId));
    return status ? status.name : '';
  };

  // Campos obrigatórios para atualização
  const mandatoryUpdateFields = [
    'artia_id', // ID da atividade no Artia
    'titulo', // Título da atividade
    'account_id', // ID do grupo de trabalho
  ];

  // Criar array de headers baseado no arquivo original
  const baseHeaders = [...originalHeaders];

  // Adicionar campos obrigatórios para atualização se não existirem
  const finalHeaders = [...baseHeaders];
  mandatoryUpdateFields.forEach(field => {
    if (!finalHeaders.includes(field)) {
      finalHeaders.push(field);
    }
  });

  // Converter headers para formato CSV correto (snake_case)
  const csvHeaders = finalHeaders.map(header => {
    const normalizedHeader = normalizeHeader(header);
    // Adicionar (*) apenas aos campos realmente obrigatórios
    if (['artia_id', 'titulo', 'account_id'].includes(normalizedHeader)) {
      return `${normalizedHeader} (*)`;
    }
    return normalizedHeader;
  });

  // Criar linhas de documentação
  const documentation = [
    '"LEGENDA: (*) Campo obrigatório para atualização | Demais campos são opcionais"',
    '"IMPORTANTE: Para atualizar uma atividade, é necessário fornecer artia_id, titulo e account_id"',
    '"ESTRUTURA: Mantida a mesma estrutura de headers do arquivo original importado"',
    "\"SITUAÇÃO: Use nomes como 'Não iniciado', 'Backlog', 'Backlog Programado', 'Triagem'\"",
    '"FORMATO: Arquivo CSV usando ponto-e-vírgula (;) como delimitador - compatível com Excel BR"',
    '"CODIFICAÇÃO: UTF-8 com BOM para compatibilidade total com caracteres especiais"',
    '',
  ];

  // Criar linhas com os dados das atividades existentes
  const activityRows = activities.map(activity => {
    const originalData = activity.originalData || {};

    return finalHeaders
      .map(header => {
        let value = '';

        // Campos específicos para atualização
        switch (header) {
          case 'artia_id':
            value = activity.id || '';
            break;
          case 'account_id':
            // Prioridade: dados originais > configuração da aplicação
            value =
              originalData.account_id ||
              originalData.accountId ||
              activity.accountId ||
              credentials?.accountId ||
              '';
            break;
          case 'folder_id':
            // Prioridade: dados originais > configuração da aplicação
            value =
              originalData.folder_id ||
              originalData.folderId ||
              activity.folderId ||
              credentials?.folderId ||
              '';
            break;
          case 'situacao_atividade': {
            // Prioridade: dados originais (nome) > dados da atividade (ID) > configuração da aplicação (ID)
            // Se já é nome, manter. Se é ID, converter para nome
            const statusValue =
              originalData.situacao_atividade ||
              originalData.situacaoAtividade ||
              activity.situacaoAtividade ||
              activity.customStatusId ||
              selectedStatus ||
              '';

            // Se o valor é um número (ID), converter para nome
            if (statusValue && !isNaN(parseInt(statusValue))) {
              const statusName = getStatusNameById(statusValue);
              value = statusName || statusValue;
            } else {
              value = statusValue;
            }
            break;
          }
          default:
            // Para outros campos, usar dados originais
            value = originalData[header] || '';
        }

        value = value.toString().trim();

        // Escapar valores que contêm delimitador, aspas ou quebras de linha
        if (
          value.includes(';') ||
          value.includes('"') ||
          value.includes('\n')
        ) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      })
      .join(';');
  });

  // Montar o CSV final com BOM para UTF-8
  const content = [
    ...documentation,
    csvHeaders.join(';'),
    ...activityRows,
  ].join('\n');
  return '\ufeff' + content;
};
