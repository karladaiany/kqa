/**
 * Hook customizado para gerenciar importação de atividades
 */

import { useState, useCallback, useEffect } from 'react';
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
const IMPORT_SESSION_KEY = 'kqa_import_session';
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

  // Estado da sessão ativa
  const [sessionId, setSessionId] = useState(null);

  /**
   * Salvar sessão atual no localStorage
   */
  const saveSession = useCallback(sessionData => {
    const session = {
      id: sessionData.id || Date.now(),
      timestamp: new Date().toISOString(),
      ...sessionData,
    };

    localStorage.setItem(IMPORT_SESSION_KEY, JSON.stringify(session));
    setSessionId(session.id);
    return session.id;
  }, []);

  /**
   * Recuperar sessão salva
   */
  const loadSession = useCallback(() => {
    const saved = localStorage.getItem(IMPORT_SESSION_KEY);
    if (!saved) return null;

    try {
      const session = JSON.parse(saved);
      // Verificar se a sessão não é muito antiga (ex: 24 horas)
      const sessionAge = Date.now() - new Date(session.timestamp).getTime();
      const maxAge = 24 * 60 * 60 * 1000; // 24 horas

      if (sessionAge > maxAge) {
        localStorage.removeItem(IMPORT_SESSION_KEY);
        return null;
      }

      return session;
    } catch (error) {
      localStorage.removeItem(IMPORT_SESSION_KEY);
      return null;
    }
  }, []);

  /**
   * Limpar sessão ativa
   */
  const clearSession = useCallback(() => {
    localStorage.removeItem(IMPORT_SESSION_KEY);
    setSessionId(null);
  }, []);

  /**
   * Verificar e recuperar sessão ao inicializar
   */
  useEffect(() => {
    const savedSession = loadSession();
    if (savedSession) {
      // Recuperar estado da sessão
      setCurrentState(savedSession.currentState || IMPORT_STATES.IDLE);
      setImportName(savedSession.importName || '');
      setImportMode(savedSession.importMode || 'create');
      setParsedData(savedSession.parsedData || []);
      setValidatedData(savedSession.validatedData || []);
      setParseErrors(savedSession.parseErrors || []);
      setValidationErrors(savedSession.validationErrors || []);
      setProcessResults(
        savedSession.processResults || { success: [], errors: [], total: 0 }
      );
      setSessionId(savedSession.id);

      // Mostrar notificação sobre sessão recuperada
      if (savedSession.currentState !== IMPORT_STATES.IDLE) {
        toast.info(
          'Sessão anterior recuperada! Você pode continuar de onde parou.',
          {
            autoClose: 5000,
          }
        );
      }
    }
  }, [loadSession]);

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
    clearSession(); // Limpar sessão ao resetar
  }, [clearSession]);

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

        // Mostrar erros específicos
        const errorMessages = parseResult.errors.slice(0, 3).join('; ');
        const moreErrors =
          parseResult.errors.length > 3
            ? ` e mais ${parseResult.errors.length - 3} erros`
            : '';

        // Salvar erro de parsing no histórico
        const parseErrorHistoryItem = {
          id: Date.now(),
          timestamp: new Date().toISOString(),
          importName: importName || 'Arquivo com erro de formatação',
          totalActivities: 0,
          successCount: 0,
          errorCount: parseResult.errors.length,
          results: {
            success: [],
            errors: parseResult.errors.map((error, index) => ({
              line: index + 1,
              title: 'Erro de formatação',
              error: error,
              details: 'Erro no parsing do arquivo CSV',
            })),
            total: 0,
          },
          status: 'parse_error',
          errorMessage: `${errorMessages}${moreErrors}`,
        };

        const updatedHistory = [parseErrorHistoryItem, ...importHistory].slice(
          0,
          MAX_HISTORY_ITEMS
        );
        setImportHistory(updatedHistory);
        localStorage.setItem(
          IMPORT_HISTORY_KEY,
          JSON.stringify(updatedHistory)
        );

        toast.error(`Erro no arquivo: ${errorMessages}${moreErrors}`, {
          autoClose: 8000,
        });
        return false;
      }

      setCurrentState(IMPORT_STATES.VALIDATING);
      return true;
    } catch (error) {
      setCurrentState(IMPORT_STATES.ERROR);

      // Salvar erro de leitura no histórico
      const readErrorHistoryItem = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        importName: importName || 'Erro na leitura do arquivo',
        totalActivities: 0,
        successCount: 0,
        errorCount: 1,
        results: {
          success: [],
          errors: [
            {
              line: 'Arquivo',
              title: 'Erro de leitura',
              error: error.message,
              details: 'Não foi possível ler o conteúdo do arquivo',
            },
          ],
          total: 0,
        },
        status: 'read_error',
        errorMessage: `Erro ao ler arquivo: ${error.message}`,
      };

      const updatedHistory = [readErrorHistoryItem, ...importHistory].slice(
        0,
        MAX_HISTORY_ITEMS
      );
      setImportHistory(updatedHistory);
      localStorage.setItem(IMPORT_HISTORY_KEY, JSON.stringify(updatedHistory));

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

    // Se há apenas erros de validação (sem atividades válidas), salvar no histórico
    if (
      validationResult.errors.length > 0 &&
      validationResult.validActivities.length === 0
    ) {
      const validationErrorHistoryItem = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        importName: importName || 'Arquivo com erros de validação',
        totalActivities: parsedData.length,
        successCount: 0,
        errorCount: validationResult.errors.length,
        results: {
          success: [],
          errors: validationResult.errors.map(error => {
            // Extrair número da linha do erro
            const lineMatch = error.match(/Linha (\d+):/);
            const lineNumber = lineMatch ? parseInt(lineMatch[1]) : 'N/A';
            // Remover "Linha X:" do início da mensagem
            const cleanError = error.replace(/^Linha \d+:\s*/, '');

            return {
              line: lineNumber,
              title: 'Erro de validação',
              error: cleanError,
              details: 'Erro na validação dos dados',
            };
          }),
          total: parsedData.length,
        },
        status: 'parse_error',
        errorMessage: `${validationResult.errors.length} erros de validação encontrados`,
      };

      const updatedHistory = [
        validationErrorHistoryItem,
        ...importHistory,
      ].slice(0, MAX_HISTORY_ITEMS);
      setImportHistory(updatedHistory);
      localStorage.setItem(IMPORT_HISTORY_KEY, JSON.stringify(updatedHistory));
    }

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
  }, [parsedData, importName, importHistory]);

  /**
   * Processar arquivo completo (parse + validação)
   */
  const processFile = useCallback(async () => {
    if (!selectedFile) {
      toast.error('Nenhum arquivo selecionado');
      return false;
    }

    setCurrentState(IMPORT_STATES.PARSING);

    try {
      // Fazer parse do arquivo
      const fileContent = await readFileContent(selectedFile);
      const parseResult = parseCSV(fileContent);

      setParsedData(parseResult.data);
      setParseErrors(parseResult.errors);

      if (parseResult.errors.length > 0) {
        setCurrentState(IMPORT_STATES.ERROR);

        // Salvar erro de parsing no histórico
        const parseErrorHistoryItem = {
          id: Date.now(),
          timestamp: new Date().toISOString(),
          importName: importName || 'Arquivo com erro de formatação',
          totalActivities: 0,
          successCount: 0,
          errorCount: parseResult.errors.length,
          results: {
            success: [],
            errors: parseResult.errors.map((error, index) => ({
              line: index + 1,
              title: 'Erro de formatação',
              error: error,
              details: 'Erro no parsing do arquivo CSV',
            })),
            total: 0,
          },
          status: 'parse_error',
          errorMessage: `${parseResult.errors.length} erros de formatação encontrados`,
        };

        const updatedHistory = [parseErrorHistoryItem, ...importHistory].slice(
          0,
          MAX_HISTORY_ITEMS
        );
        setImportHistory(updatedHistory);
        localStorage.setItem(
          IMPORT_HISTORY_KEY,
          JSON.stringify(updatedHistory)
        );

        toast.error(
          `Erro no arquivo: ${parseResult.errors.slice(0, 3).join('; ')}`,
          {
            autoClose: 8000,
          }
        );
        return false;
      }

      // Validar dados imediatamente com os dados do parse
      if (parseResult.data.length === 0) {
        toast.warning('Nenhum dado para validar');
        return false;
      }

      setCurrentState(IMPORT_STATES.VALIDATING);

      const validationResult = validateActivitiesForImport(parseResult.data);
      setValidatedData(validationResult.validActivities);
      setValidationErrors(validationResult.errors);

      // Se há apenas erros de validação (sem atividades válidas), salvar no histórico
      if (
        validationResult.errors.length > 0 &&
        validationResult.validActivities.length === 0
      ) {
        const validationErrorHistoryItem = {
          id: Date.now(),
          timestamp: new Date().toISOString(),
          importName: importName || 'Arquivo com erros de validação',
          totalActivities: parseResult.data.length,
          successCount: 0,
          errorCount: validationResult.errors.length,
          results: {
            success: [],
            errors: validationResult.errors.map(error => {
              const lineMatch = error.match(/Linha (\d+):/);
              const lineNumber = lineMatch ? parseInt(lineMatch[1]) : 'N/A';
              const cleanError = error.replace(/^Linha \d+:\s*/, '');

              return {
                line: lineNumber,
                title: 'Erro de validação',
                error: cleanError,
                details: 'Erro na validação dos dados',
              };
            }),
            total: parseResult.data.length,
          },
          status: 'parse_error',
          errorMessage: `${validationResult.errors.length} erros de validação encontrados`,
        };

        const updatedHistory = [
          validationErrorHistoryItem,
          ...importHistory,
        ].slice(0, MAX_HISTORY_ITEMS);
        setImportHistory(updatedHistory);
        localStorage.setItem(
          IMPORT_HISTORY_KEY,
          JSON.stringify(updatedHistory)
        );
      }

      if (validationResult.errors.length > 0) {
        const errorCount = validationResult.errors.length;
        const validCount = validationResult.validActivities.length;

        toast.warning(
          `${errorCount} erro(s) de validação encontrado(s). ${validCount} atividades válidas.`,
          { autoClose: 5000 }
        );
      }

      setCurrentState(IMPORT_STATES.PREVIEW);

      // Salvar sessão após processamento bem-sucedido
      saveSession({
        currentState: IMPORT_STATES.PREVIEW,
        importName,
        importMode,
        parsedData: parseResult.data,
        validatedData: validationResult.validActivities,
        parseErrors: parseResult.errors,
        validationErrors: validationResult.errors,
        fileName: selectedFile?.name,
      });

      return true;
    } catch (error) {
      setCurrentState(IMPORT_STATES.ERROR);

      // Salvar erro de leitura no histórico
      const readErrorHistoryItem = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        importName: importName || 'Erro na leitura do arquivo',
        totalActivities: 0,
        successCount: 0,
        errorCount: 1,
        results: {
          success: [],
          errors: [
            {
              line: 'Arquivo',
              title: 'Erro de leitura',
              error: error.message,
              details: 'Não foi possível ler o conteúdo do arquivo',
            },
          ],
          total: 0,
        },
        status: 'read_error',
        errorMessage: `Erro ao ler arquivo: ${error.message}`,
      };

      const updatedHistory = [readErrorHistoryItem, ...importHistory].slice(
        0,
        MAX_HISTORY_ITEMS
      );
      setImportHistory(updatedHistory);
      localStorage.setItem(IMPORT_HISTORY_KEY, JSON.stringify(updatedHistory));

      toast.error(`Erro ao ler arquivo: ${error.message}`);
      return false;
    }
  }, [selectedFile, importName, importHistory]);

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
        // Validar credenciais antes de tentar autenticar
        if (!credentials.email || !credentials.password) {
          throw new Error(
            'Email e senha são obrigatórios para autenticação no Artia'
          );
        }

        // Autenticar primeiro
        let authToken;
        try {
          authToken = await ArtiaService.ensureValidToken(
            credentials.email,
            credentials.password
          );
        } catch (authError) {
          throw new Error(
            `Falha na autenticação do Artia: ${authError.message}`
          );
        }

        if (!authToken) {
          throw new Error('Falha na autenticação do Artia: Token não recebido');
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

        // Salvar no histórico (incluindo erros de validação se houver)
        const completeResults = {
          ...results,
          errors: [
            ...results.errors,
            // Adicionar erros de validação que não foram processados
            ...validationErrors.map(error => {
              const lineMatch = error.match(/Linha (\d+):/);
              const lineNumber = lineMatch ? parseInt(lineMatch[1]) : 'N/A';
              const cleanError = error.replace(/^Linha \d+:\s*/, '');

              return {
                line: lineNumber,
                title: 'Erro de validação (não processado)',
                error: cleanError,
                details: 'Erro detectado durante validação',
              };
            }),
          ],
        };

        saveToHistory(completeResults);

        // Limpar sessão após importação bem-sucedida
        clearSession();

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

        // Salvar erro no histórico
        const errorHistoryItem = {
          id: Date.now(),
          timestamp: new Date().toISOString(),
          importName: importName || 'Importação com erro',
          totalActivities: validatedData.length,
          successCount: 0,
          errorCount: validatedData.length,
          results: {
            success: [],
            errors: [
              {
                line: 'Geral',
                title: 'Erro na importação',
                error: error.message,
                details: error.response?.data || error.stack,
              },
            ],
            total: validatedData.length,
          },
          status: 'error',
          errorMessage: error.message,
        };

        const updatedHistory = [errorHistoryItem, ...importHistory].slice(
          0,
          MAX_HISTORY_ITEMS
        );
        setImportHistory(updatedHistory);
        localStorage.setItem(
          IMPORT_HISTORY_KEY,
          JSON.stringify(updatedHistory)
        );

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
   * Remover item individual do histórico
   */
  const removeHistoryItem = useCallback(
    itemId => {
      const updatedHistory = importHistory.filter(item => item.id !== itemId);
      setImportHistory(updatedHistory);
      localStorage.setItem(IMPORT_HISTORY_KEY, JSON.stringify(updatedHistory));
    },
    [importHistory]
  );

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
  const canProceed = validatedData.length > 0; // Permite prosseguir se há atividades válidas, mesmo com alguns erros
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
    removeHistoryItem,
    downloadTemplate,

    // Sessão
    sessionId,
    saveSession,
    loadSession,
    clearSession,
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
