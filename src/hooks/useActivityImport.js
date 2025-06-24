/**
 * Hook customizado para gerenciar importação de atividades
 */

import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { ArtiaService } from '../services/artiaService';
import {
  parseCSV,
  validateFile,
  generateCSVTemplate,
} from '../utils/csvParser';
import {
  validateActivitiesForImport,
  generateRecommendations,
} from '../utils/activityValidator';

// Constantes para o histórico
const IMPORT_HISTORY_KEY = 'kqa_import_history';
const MAX_HISTORY_ITEMS = 10;

/**
 * Estados possíveis da importação
 */
export const IMPORT_STATES = {
  IDLE: 'idle',
  FILE_SELECTED: 'file_selected',
  PARSING: 'parsing',
  VALIDATING: 'validating',
  PREVIEW: 'preview',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  ERROR: 'error',
};

/**
 * Hook para gerenciar importação de atividades
 */
export const useActivityImport = () => {
  // Estados principais
  const [currentState, setCurrentState] = useState(IMPORT_STATES.IDLE);
  const [selectedFile, setSelectedFile] = useState(null);
  const [importName, setImportName] = useState('');
  const [importMode, setImportMode] = useState('create'); // 'create' ou 'update'

  // Estados dos dados
  const [parsedData, setParsedData] = useState([]);
  const [validatedData, setValidatedData] = useState([]);
  const [parseErrors, setParseErrors] = useState([]);
  const [validationErrors, setValidationErrors] = useState([]);

  // Estados do processamento
  const [isProcessing, setIsProcessing] = useState(false);
  const [processProgress, setProcessProgress] = useState(0);
  const [processResults, setProcessResults] = useState({
    success: [],
    errors: [],
    total: 0,
  });

  // Estado do histórico
  const [importHistory, setImportHistory] = useState(() => {
    const saved = localStorage.getItem(IMPORT_HISTORY_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  /**
   * Resetar todos os estados para inicial
   */
  const resetImport = useCallback(() => {
    setCurrentState(IMPORT_STATES.IDLE);
    setSelectedFile(null);
    setImportName('');
    setParsedData([]);
    setValidatedData([]);
    setParseErrors([]);
    setValidationErrors([]);
    setProcessProgress(0);
    setProcessResults({ success: [], errors: [], total: 0 });
    setIsProcessing(false);
  }, []);

  /**
   * Validar e selecionar arquivo
   */
  const selectFile = useCallback(file => {
    const validation = validateFile(file);

    if (!validation.isValid) {
      toast.error(validation.error);
      setCurrentState(IMPORT_STATES.ERROR);
      return false;
    }

    setSelectedFile(file);
    setCurrentState(IMPORT_STATES.FILE_SELECTED);

    // Gerar nome padrão baseado no arquivo
    const defaultName = file.name.replace(/\.[^/.]+$/, ''); // Remove extensão
    setImportName(defaultName);

    toast.success('Arquivo selecionado com sucesso!');
    return true;
  }, []);

  /**
   * Fazer parse do arquivo CSV
   */
  const parseFile = useCallback(async () => {
    if (!selectedFile) {
      toast.error('Nenhum arquivo selecionado');
      return false;
    }

    setCurrentState(IMPORT_STATES.PARSING);

    try {
      const fileContent = await readFileContent(selectedFile);
      const parseResult = parseCSV(fileContent);

      setParsedData(parseResult.data);
      setParseErrors(parseResult.errors);

      if (parseResult.errors.length > 0) {
        setCurrentState(IMPORT_STATES.ERROR);
        toast.error(
          `Erro no parse: ${parseResult.errors.length} erro(s) encontrado(s)`
        );
        return false;
      }

      setCurrentState(IMPORT_STATES.VALIDATING);
      return true;
    } catch (error) {
      setCurrentState(IMPORT_STATES.ERROR);
      toast.error(`Erro ao ler arquivo: ${error.message}`);
      return false;
    }
  }, [selectedFile]);

  /**
   * Validar dados após parse
   */
  const validateData = useCallback(() => {
    if (parsedData.length === 0) {
      toast.warning('Nenhum dado para validar');
      return false;
    }

    setCurrentState(IMPORT_STATES.VALIDATING);

    const validationResult = validateActivitiesForImport(parsedData);

    setValidatedData(validationResult.validActivities);
    setValidationErrors(validationResult.errors);

    if (validationResult.errors.length > 0) {
      const errorCount = validationResult.errors.length;
      const validCount = validationResult.validActivities.length;

      toast.warning(
        `${errorCount} erro(s) de validação encontrado(s). ${validCount} atividades válidas.`,
        { autoClose: 5000 }
      );
    }

    setCurrentState(IMPORT_STATES.PREVIEW);
    return true;
  }, [parsedData]);

  /**
   * Processar arquivo completo (parse + validação)
   */
  const processFile = useCallback(async () => {
    const parseSuccess = await parseFile();
    if (!parseSuccess) return false;

    return validateData();
  }, [parseFile, validateData]);

  /**
   * Executar importação das atividades válidas
   */
  const executeImport = useCallback(
    async credentials => {
      if (validatedData.length === 0) {
        toast.error('Nenhuma atividade válida para importar');
        return false;
      }

      if (!credentials?.email || !credentials?.password) {
        toast.error('Credenciais do Artia são obrigatórias');
        return false;
      }

      setIsProcessing(true);
      setCurrentState(IMPORT_STATES.PROCESSING);
      setProcessProgress(0);

      const results = {
        success: [],
        errors: [],
        total: validatedData.length,
      };

      try {
        // Autenticar primeiro
        const authResult = await ArtiaService.ensureValidToken(
          credentials.email,
          credentials.password
        );

        if (!authResult.success) {
          throw new Error('Falha na autenticação do Artia');
        }

        // Processar atividades em sequência com delay
        for (let i = 0; i < validatedData.length; i++) {
          const activity = validatedData[i];

          try {
            // Converter dados para formato do Artia
            const activityData = convertToArtiaFormat(activity, credentials);

            // Criar atividade
            const result = await ArtiaService.createActivity(activityData);

            results.success.push({
              line: activity._originalLine,
              title: activity.titulo,
              id: result.id,
              uid: result.uid,
              originalData: activity,
            });

            // Atualizar progresso
            setProcessProgress(((i + 1) / validatedData.length) * 100);
          } catch (error) {
            console.error(`Erro na linha ${activity._originalLine}:`, error);

            results.errors.push({
              line: activity._originalLine,
              title: activity.titulo,
              error: error.message,
              details: error.response?.data,
              originalData: activity,
            });
          }

          // Delay entre requisições para não sobrecarregar a API
          if (i < validatedData.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        }

        setProcessResults(results);
        setCurrentState(IMPORT_STATES.COMPLETED);

        // Salvar no histórico
        saveToHistory(results);

        // Feedback final
        const successCount = results.success.length;
        const errorCount = results.errors.length;

        if (successCount > 0) {
          toast.success(
            `Importação concluída! ${successCount} atividades criadas com sucesso.`,
            { autoClose: 8000 }
          );
        }

        if (errorCount > 0) {
          toast.warning(
            `${errorCount} atividades falharam. Verifique o relatório detalhado.`,
            { autoClose: 8000 }
          );
        }

        return true;
      } catch (error) {
        console.error('Erro na importação:', error);
        setCurrentState(IMPORT_STATES.ERROR);
        toast.error(`Erro na importação: ${error.message}`);
        return false;
      } finally {
        setIsProcessing(false);
      }
    },
    [validatedData, importName]
  );

  /**
   * Salvar importação no histórico local
   */
  const saveToHistory = useCallback(
    results => {
      const historyItem = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        importName: importName || 'Importação sem nome',
        totalActivities: results.total,
        successCount: results.success.length,
        errorCount: results.errors.length,
        results: results,
        status: 'completed',
      };

      const updatedHistory = [historyItem, ...importHistory].slice(
        0,
        MAX_HISTORY_ITEMS
      );
      setImportHistory(updatedHistory);
      localStorage.setItem(IMPORT_HISTORY_KEY, JSON.stringify(updatedHistory));

      toast.success('📚 Importação salva no histórico local!');
    },
    [importName, importHistory]
  );

  /**
   * Limpar histórico
   */
  const clearHistory = useCallback(() => {
    setImportHistory([]);
    localStorage.removeItem(IMPORT_HISTORY_KEY);
    toast.info('🗑️ Histórico limpo!');
  }, []);

  /**
   * Download do template CSV
   */
  const downloadTemplate = useCallback(selectedTypes => {
    try {
      const csvContent = generateCSVTemplate(selectedTypes);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = 'template-importacao-atividades.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
      toast.success('📥 Template baixado com sucesso!');
    } catch (error) {
      toast.error(`Erro ao gerar template: ${error.message}`);
    }
  }, []);

  // Getters computados
  const hasErrors = parseErrors.length > 0 || validationErrors.length > 0;
  const canProceed = validatedData.length > 0 && !hasErrors;
  const recommendations = hasErrors
    ? generateRecommendations([...parseErrors, ...validationErrors])
    : [];

  return {
    // Estados
    currentState,
    selectedFile,
    importName,
    importMode,
    isProcessing,
    processProgress,

    // Dados
    parsedData,
    validatedData,
    parseErrors,
    validationErrors,
    processResults,
    importHistory,

    // Getters computados
    hasErrors,
    canProceed,
    recommendations,

    // Ações
    setImportName,
    setImportMode,
    selectFile,
    parseFile,
    validateData,
    processFile,
    executeImport,
    resetImport,
    clearHistory,
    downloadTemplate,
  };
};

/**
 * Ler conteúdo do arquivo como texto
 */
const readFileContent = file => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = e => resolve(e.target.result);
    reader.onerror = e => reject(new Error('Erro ao ler arquivo'));

    reader.readAsText(file, 'UTF-8');
  });
};

/**
 * Converter dados da atividade para formato esperado pelo ArtiaService
 */
const convertToArtiaFormat = (activity, credentials) => {
  return {
    // Campos básicos
    titulo: activity.titulo,
    descricao: activity.descricao || '',
    tipo: activity.tipo,

    // Campos opcionais
    esforcoEstimado: activity.esforcoEstimado || 1,
    inicioEstimado: activity.inicioEstimado || '',
    terminoEstimado: activity.terminoEstimado || '',
    responsibleId: activity.responsibleId || null,

    // Campos específicos por tipo
    ticketMovidesk: activity.ticketMovidesk || '',
    urgencia: activity.urgencia || '',
    plataforma: activity.plataforma || '',
    funcionalidade: activity.funcionalidade || '',
    subFuncionalidade: activity.subFuncionalidade || '',
    cliente: activity.cliente || '',
    idOrganizacao: activity.idOrganizacao || '',
    email: activity.email || '',
    tipoCliente: activity.tipoCliente || '',
    criticidade: activity.criticidade || '',
    dificuldadeLocalizacao: activity.dificuldadeLocalizacao || '',
    causaDemanda: activity.causaDemanda || '',
    garantia: activity.garantia || '',

    // Credenciais para criação
    login: credentials.email,
    senha: credentials.password,
    accountId: credentials.accountId || '',
    folderId: credentials.folderId || '',
  };
};
