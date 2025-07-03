/**
 * Utilitário para parsing de arquivos CSV para importação de atividades
 */

import {
  ACTIVITY_TYPES,
  RESPONSAVEL_OPTIONS,
  getEnabledActivityTypes,
  CUSTOM_STATUS_OPTIONS,
} from '../constants/artiaOptions';
import { REQUIRED_FIELDS_BY_TYPE } from '../constants/artiaFieldHashes';

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
  tipo: 'tipo',
  titulo: 'titulo',
  descricao: 'descricao',
  esforcoEstimado: 'esforco_estimado',
  inicioEstimado: 'inicio_estimado',
  terminoEstimado: 'termino_estimado',
  situacaoAtividade: 'situacao_atividade',
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
    const rawHeaders = parseCSVLine(headerLine);

    // Limpar indicadores (*) e (**) dos headers
    const headers = rawHeaders.map(header =>
      header
        .replace(/\s*\(\*+\)\s*$/, '')
        .trim()
        .toLowerCase()
    );

    // Validar headers obrigatórios
    const missingHeaders = ['tipo', 'titulo'].filter(
      required => !headers.includes(required)
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
      const line = lines[i];

      // Pular linhas de comentário (que começam com aspas e contêm palavras-chave específicas)
      if (
        line.startsWith('"') &&
        (line.includes('LEGENDA') ||
          line.includes('TIPO:') ||
          line.includes('OBRIGATÓRIO') ||
          line.includes('CAMPOS OBRIGATÓRIOS'))
      ) {
        continue;
      }

      // Pular linhas que são apenas vírgulas ou espaços (separadores)
      if (/^[\s,]*$/.test(line)) {
        continue;
      }

      const values = parseCSVLine(line);

      if (values.length === 0) continue; // Pular linhas vazias

      // Pular se todos os valores são vazios
      if (values.every(val => val.trim() === '')) continue;

      // Criar objeto da atividade
      const activity = {};
      headers.forEach((header, index) => {
        const jsProperty = CSV_TO_JS_MAPPING[header] || header;
        // Remover aspas duplas do início e fim do valor
        const value = values[index]
          ? values[index].replace(/^"(.*)"$/, '$1')
          : '';
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
 * @param {number} lineNumber - Número da linha
 * @returns {Array} Array de erros
 */
const validateActivityLine = (activity, lineNumber) => {
  const errors = [];

  // Tipo obrigatório e válido
  if (!activity.tipo) {
    errors.push(`Linha ${lineNumber}: Campo 'tipo' é obrigatório`);
  } else if (
    !Object.values(getEnabledActivityTypes()).includes(activity.tipo)
  ) {
    errors.push(
      `Linha ${lineNumber}: Tipo '${activity.tipo}' inválido. Tipos válidos: ${Object.values(getEnabledActivityTypes()).join(', ')}`
    );
  }

  // Título obrigatório
  if (!activity.titulo) {
    errors.push(`Linha ${lineNumber}: Campo 'titulo' é obrigatório`);
  }

  // Converter e validar formato de datas se preenchidas
  if (activity.inicioEstimado) {
    activity.inicioEstimado = convertDateToISO(activity.inicioEstimado);
    if (!isValidDate(activity.inicioEstimado)) {
      errors.push(
        `Linha ${lineNumber}: Data de início inválida. Use formato DD/MM/YYYY ou YYYY-MM-DD`
      );
    }
  }

  if (activity.terminoEstimado) {
    activity.terminoEstimado = convertDateToISO(activity.terminoEstimado);
    if (!isValidDate(activity.terminoEstimado)) {
      errors.push(
        `Linha ${lineNumber}: Data de término inválida. Use formato DD/MM/YYYY ou YYYY-MM-DD`
      );
    }
  }

  // Validar esforço estimado se preenchido
  if (activity.esforcoEstimado) {
    // Converter vírgula para ponto temporariamente apenas para validação numérica
    const testValue = activity.esforcoEstimado.toString().replace(',', '.');
    if (isNaN(parseFloat(testValue))) {
      errors.push(
        `Linha ${lineNumber}: Esforço estimado deve ser um número (use ponto ou vírgula como separador decimal, ex: 2.5 ou 2,5)`
      );
    } else {
      // Manter o valor original exatamente como está
      activity.esforcoEstimado = activity.esforcoEstimado.toString();
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

  // --- SITUAÇÃO/STATUS ---
  // Se a coluna existe e está preenchida
  if (Object.prototype.hasOwnProperty.call(transformed, 'situacaoAtividade')) {
    if (
      transformed.situacaoAtividade &&
      transformed.situacaoAtividade.toString().trim() !== ''
    ) {
      const status = CUSTOM_STATUS_OPTIONS.find(
        s =>
          s.name.toLowerCase() === transformed.situacaoAtividade.toLowerCase()
      );
      if (status) {
        transformed.customStatusId = status.id;
        transformed.hasValidCustomStatus = true;
      } else {
        // Valor inválido - será usado o padrão do card
        transformed.hasValidCustomStatus = false;
      }
    } else {
      // Coluna existe mas está vazia: forçar uso do select
      transformed.hasValidCustomStatus = false;
    }
  } else {
    // Coluna não existe: forçar uso do select
    transformed.hasValidCustomStatus = false;
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
      '"FORMATO: Arquivo CSV usando vírgula (,) ou ponto-e-vírgula (;) como delimitador"',
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
 * @returns {string} Conteúdo do CSV
 */
export const generateUpdateTemplate = activities => {
  if (!activities || activities.length === 0) {
    return 'Nenhuma atividade disponível para gerar template de atualização';
  }

  // Campos obrigatórios para identificação
  const mandatoryFields = [
    'artiaId',
    'artiaUid',
    'accountId',
    'folderId',
    'customStatusId',
  ];

  // Coletar todos os campos que têm dados em pelo menos uma atividade
  const allFields = new Set(mandatoryFields);

  activities.forEach(activity => {
    const originalData = activity.originalData || {};
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

  // Reordenar para ter uma sequência lógica (usando nomes internos)
  const fieldOrder = [
    'artiaId',
    'artiaUid',
    'accountId',
    'folderId',
    'customStatusId',
    'tipo',
    'titulo',
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

  // Adicionar campos na ordem preferencial se existirem
  fieldOrder.forEach(field => {
    if (headers.includes(field)) {
      orderedHeaders.push(field);
    }
  });

  // Adicionar campos restantes que não estão na ordem preferencial
  headers.forEach(field => {
    if (!orderedHeaders.includes(field)) {
      orderedHeaders.push(field);
    }
  });

  // Converter headers internos para formato CSV correto
  const csvHeaders = orderedHeaders.map(
    header => JS_TO_CSV_MAPPING[header] || header
  );

  // Criar linhas de documentação
  const documentation = [
    'LEGENDA: (*) Campo obrigatório | (**) Obrigatório para alguns tipos | Demais campos são opcionais',
    'IMPORTANTE: Para atualizar uma atividade, é necessário fornecer artia_id OU artia_uid, e pelo menos um campo para atualizar',
    'CONFIGURAÇÃO: Os campos account_id, folder_id e custom_status_id são preenchidos automaticamente com os valores da criação',
    'TIPOS: Desenvolvimento, Execução de testes, Teste de mesa, Análise de testes, Documentação',
    'URGÊNCIA: Baixo, Médio, Alto, Crítico',
    'DATAS: Formato DD/MM/YYYY (ex: 20/03/2024) - será convertido automaticamente',
    'CAMPOS DISPONÍVEIS: Apenas os campos que continham dados na importação original são exibidos',
    '',
  ];

  // Criar linhas com os dados das atividades existentes
  const activityRows = activities.map(activity => {
    const originalData = activity.originalData || {};

    return orderedHeaders
      .map(header => {
        let value = '';

        switch (header) {
          case 'artiaId':
            value = activity.id || '';
            break;
          case 'artiaUid':
            value = activity.uid || '';
            break;
          case 'accountId':
            value = originalData.accountId || activity.accountId || '';
            break;
          case 'folderId':
            value = originalData.folderId || activity.folderId || '';
            break;
          case 'customStatusId':
            value =
              originalData.customStatusId || activity.customStatusId || '';
            break;
          default:
            value = originalData[header] || '';
        }

        // Escapar com aspas apenas se necessário
        value = value.toString().trim();
        if (
          value.includes(',') ||
          value.includes('"') ||
          value.includes('\n')
        ) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      })
      .join(',');
  });

  // Montar o CSV final
  return [...documentation, csvHeaders.join(','), ...activityRows].join('\n');
};
