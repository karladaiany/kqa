/**
 * Card de Importação de Atividades
 * Permite importação em lote de atividades via CSV
 */

import React, { useState, useCallback, useRef } from 'react';
import {
  FaFileImport,
  FaDownload,
  FaSpinner,
  FaCheck,
  FaExclamationTriangle,
  FaUpload,
  FaFileAlt,
  FaEye,
  FaEyeSlash,
  FaRocket,
  FaHistory,
  FaTrash,
  FaTimes,
  FaInfoCircle,
  FaEdit,
  FaClipboardList,
  FaCheckDouble,
  FaEraser,
  FaMinus,
  FaExchangeAlt,
} from 'react-icons/fa';
import { toast } from 'react-toastify';

import {
  useActivityImport,
  IMPORT_STATES,
} from '../../../hooks/useActivityImport';
import {
  getEnabledActivityTypes,
  CUSTOM_STATUS_OPTIONS,
} from '../../../constants/artiaOptions';
import './ActivityImportCard.css';

const ActivityImportCard = () => {
  // Obter apenas os tipos de atividade habilitados
  const enabledActivityTypes = getEnabledActivityTypes();
  const enabledActivityTypesValues = Object.values(enabledActivityTypes);

  const {
    // Estados
    currentState,
    selectedFile,
    importName,
    importMode,
    processProgress,

    // Dados
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
    processFile,
    executeImport,
    resetImport,
    clearHistory,
    removeHistoryItem,
    downloadTemplate,
    downloadUpdateTemplate,
  } = useActivityImport();

  // Estados locais do componente
  const [expanded, setExpanded] = useState(false);
  const [forceCollapsed, setForceCollapsed] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showInfoPanel, setShowInfoPanel] = useState(false);

  // Função para carregar dados salvos do localStorage
  const loadSavedCredentials = () => {
    try {
      const saved = localStorage.getItem('activityImportCredentials');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      // Erro silencioso ao carregar credenciais
    }
    return {
      email: '',
      password: '',
      accountId: '',
      folderId: '',
      useFileAccountId: true,
      useFileFolderId: true,
    };
  };

  const loadSavedStatus = () => {
    try {
      const saved = localStorage.getItem('activityImportStatus');
      return saved || 'default';
    } catch (error) {
      // Erro silencioso ao carregar status
      return 'default';
    }
  };

  const [credentials, setCredentials] = useState(loadSavedCredentials);
  const [selectedStatus, setSelectedStatus] = useState(loadSavedStatus);

  // Função para salvar credenciais no localStorage
  const saveCredentials = newCredentials => {
    try {
      localStorage.setItem(
        'activityImportCredentials',
        JSON.stringify(newCredentials)
      );
    } catch (error) {
      // Erro silencioso ao salvar credenciais
    }
  };

  const saveStatus = status => {
    try {
      localStorage.setItem('activityImportStatus', status);
    } catch (error) {
      // Erro silencioso ao salvar status
    }
  };

  // Função para atualizar credenciais com persistência
  const updateCredentials = updates => {
    const newCredentials = { ...credentials, ...updates };
    setCredentials(newCredentials);
    saveCredentials(newCredentials);
  };

  // Função para atualizar status com persistência
  const updateSelectedStatus = status => {
    setSelectedStatus(status);
    saveStatus(status);
  };

  const [selectedTypes, setSelectedTypes] = useState(
    enabledActivityTypesValues
  );

  const fileInputRef = useRef(null);

  // Verificar se há dados salvos no localStorage
  React.useEffect(() => {
    const savedCredentials = localStorage.getItem('activityImportCredentials');
    const savedStatus = localStorage.getItem('activityImportStatus');

    if (savedCredentials || savedStatus) {
      // Dados carregados silenciosamente do cache
    }
  }, []);

  // Função para verificar se há dados/atividade em andamento
  const hasAnyData = useCallback(() => {
    return (
      selectedFile ||
      currentState !== IMPORT_STATES.IDLE ||
      importHistory.length > 0
    );
  }, [selectedFile, currentState, importHistory.length]);

  // Controle de expansão do card
  const showFields = React.useMemo(() => {
    // Se o usuário forçou o colapso, mantém colapsado independente dos dados
    if (forceCollapsed) return false;
    // Senão, mostra se expandido ou se há dados
    return expanded || hasAnyData();
  }, [expanded, hasAnyData, forceCollapsed]);

  /**
   * Função para expandir o card
   */
  const handleExpand = useCallback(() => {
    setExpanded(true);
    setForceCollapsed(false);
  }, []);

  /**
   * Função para colapsar o card
   */
  const handleCollapse = useCallback(() => {
    setExpanded(false);
    setForceCollapsed(true);
  }, []);

  // Função para limpar dados salvos
  const clearSavedData = () => {
    try {
      localStorage.removeItem('activityImportCredentials');
      localStorage.removeItem('activityImportStatus');
    } catch (error) {
      // Erro silencioso ao limpar dados salvos
    }
  };

  /**
   * Função para resetar importação e estado de expansão
   */
  const handleResetImport = useCallback(() => {
    resetImport();
    setForceCollapsed(false);
  }, [resetImport]);

  /**
   * Função para reset completo (incluindo dados salvos)
   */
  const handleCompleteReset = useCallback(() => {
    // Reset do hook de importação
    resetImport();

    // Reset dos estados locais
    setCredentials({
      email: '',
      password: '',
      accountId: '',
      folderId: '',
      useFileAccountId: true,
      useFileFolderId: true,
    });
    setSelectedStatus('default');
    setForceCollapsed(false);

    // Limpar dados salvos
    clearSavedData();
  }, [resetImport]);

  /**
   * Toggle de tipo de atividade
   */
  const toggleActivityType = useCallback(type => {
    setSelectedTypes(prev => {
      if (prev.includes(type)) {
        return prev.filter(t => t !== type);
      } else {
        return [...prev, type];
      }
    });
  }, []);

  /**
   * Fechar painel com ESC
   */
  React.useEffect(() => {
    const handleKeyDown = event => {
      if (event.key === 'Escape' && showInfoPanel) {
        setShowInfoPanel(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showInfoPanel]);

  /**
   * Manipular drop de arquivo
   */
  const handleDrop = useCallback(
    e => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleResetImport(); // Resetar estado antes de selecionar novo arquivo
        selectFile(files[0]);
        // Expandir card automaticamente quando arquivo é carregado
        setExpanded(true);
        setForceCollapsed(false);
      }
    },
    [selectFile, handleResetImport]
  );

  /**
   * Manipular drag over
   */
  const handleDragOver = useCallback(e => {
    e.preventDefault();
  }, []);

  /**
   * Manipular seleção de arquivo via input
   */
  const handleFileSelect = useCallback(
    e => {
      const file = e.target.files[0];
      if (file) {
        handleResetImport(); // Resetar estado antes de selecionar novo arquivo
        selectFile(file);
        // Expandir card automaticamente quando arquivo é carregado
        setExpanded(true);
        setForceCollapsed(false);
      }
      // Limpar o input para permitir selecionar o mesmo arquivo novamente
      e.target.value = '';
    },
    [selectFile, handleResetImport]
  );

  /**
   * Processar arquivo após seleção
   */
  const handleProcessFile = useCallback(async () => {
    if (!selectedFile) return;

    if (!importName.trim()) {
      toast.error('Por favor, preencha a descrição da importação');
      return;
    }

    // Validar credenciais básicas
    if (!credentials.email || !credentials.password) {
      toast.error('Por favor, preencha email e senha');
      return;
    }

    // Validar campos personalizados quando necessário
    if (importMode === 'create') {
      if (!credentials.useFileAccountId && !credentials.accountId) {
        toast.error(
          'Por favor, preencha o ID do Grupo de Trabalho ou use o valor do arquivo'
        );
        return;
      }
      if (!credentials.useFileFolderId && !credentials.folderId) {
        toast.error(
          'Por favor, preencha o ID da Pasta/Projeto ou use o valor do arquivo'
        );
        return;
      }
    }

    const success = await processFile();
    if (success) {
      setShowPreview(true);
    }
  }, [selectedFile, processFile, importName, credentials, importMode]);

  /**
   * Executar importação
   */
  const handleExecuteImport = useCallback(async () => {
    if (!canProceed) {
      toast.warning('Corrija os erros antes de prosseguir');
      return;
    }

    // Preparar os dados de configuração
    const importConfig = {
      email: credentials.email,
      password: credentials.password,
      useFileAccountId: credentials.useFileAccountId,
      useFileFolderId: credentials.useFileFolderId,
      accountId: credentials.useFileAccountId ? null : credentials.accountId,
      folderId: credentials.useFileFolderId ? null : credentials.folderId,
    };

    // Determinar o status selecionado
    const selectedStatusId =
      selectedStatus === 'default' ? null : Number(selectedStatus);

    const success = await executeImport(importConfig, selectedStatusId);
    if (success) {
      // Importação concluída com sucesso
      toast.success(
        '✅ Importação concluída! Verifique o histórico para baixar relatórios.'
      );
    }
  }, [canProceed, executeImport, credentials, selectedStatus]);

  /**
   * Redownload de relatório do histórico
   */
  const handleRedownload = useCallback(historyItem => {
    const csvContent = generateHistoryReportCSV(historyItem);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const link = document.createElement('a');
    link.href = url;
    link.download = `${historyItem.importName}-redownload-${timestamp}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
    toast.success('📥 Relatório baixado novamente!');
  }, []);

  /**
   * Gerar CSV de item do histórico
   */
  const generateHistoryReportCSV = historyItem => {
    const headers = [
      'artia_id',
      'artia_uid',
      'linha',
      'titulo',
      'status',
      'erro',
    ];
    const { results } = historyItem;

    const rows = [
      ...results.success.map(item => [
        item.id,
        item.uid,
        item.line,
        `"${item.title}"`,
        'Sucesso',
        '',
      ]),
      ...results.errors.map(item => [
        '',
        '',
        item.line,
        `"${item.title}"`,
        'Erro',
        `"${item.error}"`,
      ]),
    ];

    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  };

  /**
   * Remover item individual do histórico
   */
  const handleRemoveHistoryItem = useCallback(
    itemId => {
      if (
        window.confirm('Tem certeza que deseja remover este item do histórico?')
      ) {
        removeHistoryItem(itemId);
        toast.info('Item removido do histórico');
      }
    },
    [removeHistoryItem]
  );

  /**
   * Renderizar estado atual
   */
  const renderCurrentState = () => {
    switch (currentState) {
      case IMPORT_STATES.IDLE:
        return renderFileUpload();

      case IMPORT_STATES.FILE_SELECTED:
        return renderFileSelected();

      case IMPORT_STATES.PARSING:
      case IMPORT_STATES.VALIDATING:
        return renderProcessing();

      case IMPORT_STATES.PREVIEW:
        return renderPreview();

      case IMPORT_STATES.PROCESSING:
        return renderImporting();

      case IMPORT_STATES.COMPLETED:
        return renderCompleted();

      case IMPORT_STATES.ERROR:
        return renderError();

      default:
        return renderFileUpload();
    }
  };

  /**
   * Renderizar zona de upload
   */
  const renderFileUpload = () => (
    <div className='import-section'>
      <div
        className='file-drop-zone'
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
      >
        <FaUpload className='drop-icon' />
        <p className='drop-text'>
          Arraste seu arquivo aqui ou <span className='click-text'>clique</span>{' '}
          para selecionar
        </p>
        <small className='drop-hint'>Formato aceito: .csv (máx. 10MB)</small>
      </div>
    </div>
  );

  /**
   * Renderizar arquivo selecionado
   */
  const renderFileSelected = () => (
    <div className='import-section'>
      <div className='file-selected'>
        <FaFileAlt className='file-icon' />
        <div className='file-info'>
          <strong>{selectedFile?.name}</strong>
          <small>{(selectedFile?.size / 1024).toFixed(1)} KB</small>
        </div>
        <button
          className='btn-secondary'
          onClick={() => fileInputRef.current?.click()}
          title='Selecionar outro arquivo'
        >
          <FaExchangeAlt /> Substituir
        </button>
      </div>

      <div className='import-mode'>
        <label>Modo de importação</label>
        <div className='mode-toggles'>
          <button
            type='button'
            className={`mode-toggle ${importMode === 'create' ? 'active' : ''}`}
            onClick={() => setImportMode('create')}
          >
            Criar atividades
          </button>
          <button
            type='button'
            className={`mode-toggle ${importMode === 'update' ? 'active' : ''}`}
            onClick={() => setImportMode('update')}
          >
            Atualizar atividades
          </button>
        </div>
      </div>

      {/* Dados adicionais */}
      <div className='credentials-section'>
        <h4>Dados adicionais</h4>

        <div className='credentials-grid'>
          {/* Login e Senha na mesma linha */}
          <div className='grid-row'>
            <div className='import-identification'>
              <label htmlFor='login-field'>
                Login <span style={{ color: '#dc3545' }}>*</span>
              </label>
              <div className='input-container'>
                <input
                  id='login-field'
                  type='email'
                  value={credentials.email}
                  onChange={e => updateCredentials({ email: e.target.value })}
                  placeholder='seu.email@empresa.com'
                  className='import-name-input'
                  required
                />
              </div>
            </div>

            <div className='import-identification'>
              <label htmlFor='password-field'>
                Senha <span style={{ color: '#dc3545' }}>*</span>
              </label>
              <div className='input-container'>
                <input
                  id='password-field'
                  type='password'
                  value={credentials.password}
                  onChange={e =>
                    updateCredentials({ password: e.target.value })
                  }
                  placeholder='Sua senha de acesso'
                  className='import-name-input'
                  required
                />
              </div>
            </div>
          </div>

          {/* Descrição e Situação padrão na mesma linha */}
          <div className='grid-row'>
            <div className='import-identification'>
              <label htmlFor='import-name'>
                Descrição <span style={{ color: '#dc3545' }}>*</span>
              </label>
              <div className='input-container'>
                <input
                  id='import-name'
                  type='text'
                  maxLength={30}
                  value={importName}
                  onChange={e => setImportName(e.target.value)}
                  placeholder='Ex: Sprint 15 - Correções de Bug'
                  className='import-name-input'
                />
                <div
                  className={`char-counter ${importName.length >= 25 ? 'near-limit' : ''}`}
                >
                  {importName.length}/30
                </div>
              </div>
            </div>

            {importMode === 'create' && (
              <div className='import-identification'>
                <label htmlFor='status-select'>
                  Situação padrão das atividades
                </label>
                <select
                  id='status-select'
                  value={selectedStatus}
                  onChange={e => updateSelectedStatus(e.target.value)}
                  className='status-select'
                >
                  <option value='default'>Aplicar conforme arquivo</option>
                  {CUSTOM_STATUS_OPTIONS.map(option => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* IDs do Grupo e Pasta na mesma linha */}
          {importMode === 'create' && (
            <div className='grid-row'>
              <div className='import-identification'>
                <label htmlFor='account-field'>ID do Grupo de Trabalho</label>
                <div className='toggle-field-row'>
                  <button
                    type='button'
                    className={`toggle-button ${!credentials.useFileAccountId ? 'active' : ''}`}
                    onClick={() =>
                      updateCredentials({
                        useFileAccountId: !credentials.useFileAccountId,
                        accountId: credentials.useFileAccountId
                          ? ''
                          : credentials.accountId,
                      })
                    }
                  >
                    <span className='toggle-icon'>
                      {!credentials.useFileAccountId ? '✓' : '+'}
                    </span>
                    Valor personalizado
                  </button>
                  {!credentials.useFileAccountId && (
                    <div className='inline-input-container'>
                      <input
                        id='account-field'
                        type='text'
                        value={credentials.accountId}
                        onChange={e => {
                          const value = e.target.value.replace(/\D/g, '');
                          updateCredentials({ accountId: value });
                        }}
                        maxLength={10}
                        placeholder='Ex: 12345'
                        className='import-name-input'
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className='import-identification'>
                <label htmlFor='folder-field'>ID da Pasta/Projeto</label>
                <div className='toggle-field-row'>
                  <button
                    type='button'
                    className={`toggle-button ${!credentials.useFileFolderId ? 'active' : ''}`}
                    onClick={() =>
                      updateCredentials({
                        useFileFolderId: !credentials.useFileFolderId,
                        folderId: credentials.useFileFolderId
                          ? ''
                          : credentials.folderId,
                      })
                    }
                  >
                    <span className='toggle-icon'>
                      {!credentials.useFileFolderId ? '✓' : '+'}
                    </span>
                    Valor personalizado
                  </button>
                  {!credentials.useFileFolderId && (
                    <div className='inline-input-container'>
                      <input
                        id='folder-field'
                        type='text'
                        value={credentials.folderId}
                        onChange={e => {
                          const value = e.target.value.replace(/\D/g, '');
                          updateCredentials({ folderId: value });
                        }}
                        maxLength={10}
                        placeholder='Ex: 67890'
                        className='import-name-input'
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <button
        className='btn-action'
        onClick={handleProcessFile}
        disabled={
          !credentials.email ||
          !credentials.password ||
          (importMode === 'create' &&
            !credentials.useFileAccountId &&
            !credentials.accountId) ||
          (!credentials.useFileFolderId && !credentials.folderId)
        }
      >
        <FaRocket /> Processar Arquivo
      </button>
    </div>
  );

  /**
   * Renderizar processamento
   */
  const renderProcessing = () => (
    <div className='import-section'>
      <div className='processing-status'>
        <FaSpinner className='fa-spin' />
        <p>Processando arquivo...</p>
        <small>Validando dados e verificando formato</small>
      </div>
    </div>
  );

  /**
   * Renderizar preview dos dados
   * Nova estrutura: container delimitado, ação no header, credenciais movidas para etapa anterior
   */
  const renderPreview = () => (
    <div className='import-section'>
      {/* Preview Container */}
      <div className='preview-container'>
        <div className='preview-header'>
          <div className='preview-title-stats'>
            <h4>Preview dos Dados</h4>
            <div className='preview-stats'>
              <span className='stat success'>
                ✅ {validatedData.length} válidas
              </span>
              {hasErrors && (
                <span className='stat error'>
                  ❌ {parseErrors.length + validationErrors.length} erros
                </span>
              )}
            </div>
          </div>
          <button
            className='btn-icon-only'
            onClick={() => setShowPreview(!showPreview)}
            title={showPreview ? 'Ocultar Preview' : 'Mostrar Preview'}
          >
            {showPreview ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {renderPreviewConfig()}

        {hasErrors && (
          <div className='errors-section'>
            <h5>⚠️ Erros Encontrados:</h5>
            <div className='errors-list'>
              {[...parseErrors, ...validationErrors]
                .slice(0, 10)
                .map((error, index) => (
                  <div key={index} className='error-item'>
                    {error}
                  </div>
                ))}
              {parseErrors.length + validationErrors.length > 10 && (
                <div className='error-item'>
                  ... e mais {parseErrors.length + validationErrors.length - 10}{' '}
                  erros
                </div>
              )}
            </div>

            {recommendations.length > 0 && (
              <div className='recommendations'>
                <h6>💡 Recomendações:</h6>
                <ul>
                  {recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {validatedData.length > 0 && showPreview && (
          <div className='preview-table-container'>
            <div className='preview-table'>
              <table>
                <thead>
                  <tr>
                    <th>Linha</th>
                    {Object.keys(validatedData[0])
                      .filter(
                        key =>
                          key !== '_originalLine' && // Excluir campos internos
                          key !== '_errors' &&
                          key !== '_warnings' &&
                          validatedData.some(item => item[key]) // Verificar se algum item tem valor nesta coluna
                      )
                      .map(key => (
                        <th key={key}>{getColumnDisplayName(key)}</th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {validatedData.slice(0, 10).map((activity, index) => (
                    <tr key={index}>
                      <td>{activity._originalLine}</td>
                      {Object.keys(activity)
                        .filter(
                          key =>
                            key !== '_originalLine' &&
                            key !== '_errors' &&
                            key !== '_warnings' &&
                            validatedData.some(item => item[key])
                        )
                        .map(key => (
                          <td key={key} title={activity[key]}>
                            {activity[key]?.length > 50
                              ? `${activity[key].substring(0, 50)}...`
                              : activity[key] || '-'}
                          </td>
                        ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {validatedData.length > 10 && (
                <p className='preview-more'>
                  ... e mais {validatedData.length - 10} atividades
                </p>
              )}
            </div>
          </div>
        )}

        {canProceed && (
          <div className='preview-actions'>
            <button
              className='btn-primary'
              onClick={handleExecuteImport}
              disabled={
                !credentials.email ||
                !credentials.password ||
                (importMode === 'create' &&
                  !credentials.useFileAccountId &&
                  !credentials.accountId) ||
                (importMode === 'create' &&
                  !credentials.useFileFolderId &&
                  !credentials.folderId)
              }
            >
              <FaRocket />{' '}
              {importMode === 'create'
                ? 'Executar Importação'
                : 'Executar Atualização'}
            </button>
            <button className='btn-secondary' onClick={handleResetImport}>
              <FaTimes /> Cancelar
            </button>
          </div>
        )}
      </div>
    </div>
  );

  /**
   * Renderizar configuração que será aplicada
   */
  const renderPreviewConfig = () => (
    <div className='preview-config'>
      <h5>⚙️ Configurações que serão aplicadas na importação</h5>

      {/* Primeira linha: Modo, ID do Grupo, ID da Pasta */}
      <div className='preview-config-row'>
        <div className='preview-config-item'>
          <span className='preview-config-label'>Modo:</span>
          <span className='preview-config-value'>
            {importMode === 'create' ? 'Criar' : 'Atualizar'}
          </span>
        </div>

        {importMode === 'create' && (
          <>
            <div className='preview-config-item'>
              <span className='preview-config-label'>ID do grupo:</span>
              <span
                className={`preview-config-value ${
                  credentials.useFileAccountId
                    ? 'auto'
                    : credentials.accountId
                      ? 'cached'
                      : 'empty'
                }`}
              >
                {credentials.useFileAccountId
                  ? 'Conforme arquivo'
                  : credentials.accountId || 'Não definido'}
              </span>
            </div>

            <div className='preview-config-item'>
              <span className='preview-config-label'>ID da pasta:</span>
              <span
                className={`preview-config-value ${
                  credentials.useFileFolderId
                    ? 'auto'
                    : credentials.folderId
                      ? 'cached'
                      : 'empty'
                }`}
              >
                {credentials.useFileFolderId
                  ? 'Conforme arquivo'
                  : credentials.folderId || 'Não definido'}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Segunda linha: Situação da atividade, Login */}
      <div className='preview-config-row'>
        {importMode === 'create' && (
          <div className='preview-config-item'>
            <span className='preview-config-label'>Situação da atividade:</span>
            <span
              className={`preview-config-value ${
                selectedStatus === 'default' ? 'auto' : 'cached'
              }`}
            >
              {selectedStatus === 'default'
                ? 'Conforme arquivo'
                : CUSTOM_STATUS_OPTIONS.find(
                    opt => opt.id === Number(selectedStatus)
                  )?.name || 'Padrão do sistema'}
            </span>
          </div>
        )}

        <div className='preview-config-item'>
          <span className='preview-config-label'>Login:</span>
          <span
            className={`preview-config-value ${credentials.email ? 'cached' : 'empty'}`}
          >
            {credentials.email || 'Não informado'}
          </span>
        </div>
      </div>
    </div>
  );

  /**
   * Renderizar importação em andamento
   */
  const renderImporting = () => (
    <div className='import-section'>
      <div className='import-progress'>
        <h4>🚀 Importando Atividades...</h4>

        <div className='progress-bar'>
          <div
            className='progress-fill'
            style={{ width: `${processProgress}%` }}
          />
        </div>

        <div className='progress-text'>
          {Math.round(processProgress)}% concluído
        </div>

        <div className='progress-stats'>
          <span className='stat success'>
            ✅ {processResults.success.length}{' '}
            {importMode === 'create' ? 'criadas' : 'atualizadas'}
          </span>
          <span className='stat error'>
            ❌ {processResults.errors.length} erros
          </span>
        </div>

        <small>⏳ Aguarde... Não feche esta aba durante a importação</small>
      </div>
    </div>
  );

  /**
   * Renderizar importação concluída
   */
  const renderCompleted = () => (
    <div className='import-section'>
      <div className='import-complete'>
        <FaCheck className='success-icon' />
        <h4>
          {processResults.success.length > 0
            ? 'Importação concluída!'
            : 'Importação processada'}
        </h4>

        <div className='completion-stats'>
          <div className='stat-card success'>
            <span className='stat-number'>{processResults.success.length}</span>
            <span className='stat-label'>
              {importMode === 'create'
                ? 'Atividades Criadas'
                : 'Atividades Atualizadas'}
            </span>
          </div>

          {processResults.errors.length > 0 && (
            <div className='stat-card error'>
              <span className='stat-number'>
                {processResults.errors.length}
              </span>
              <span className='stat-label'>Erros</span>
            </div>
          )}

          <div className='stat-card rate'>
            <span className='stat-number'>
              {processResults.total > 0
                ? Math.round(
                    (processResults.success.length / processResults.total) * 100
                  )
                : 0}
              %
            </span>
            <span className='stat-label'>Taxa de Sucesso</span>
          </div>
        </div>

        <div className='completion-actions'>
          <div className='action-group'>
            {processResults.success.length > 0 && (
              <button
                className='btn-secondary'
                onClick={() => downloadUpdateTemplate(processResults.success)}
                title='Baixar template para atualização das atividades criadas'
              >
                <FaEdit /> Template de Atualização
              </button>
            )}

            <button className='btn-secondary' onClick={handleResetImport}>
              <FaRocket /> Nova Importação
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  /**
   * Renderizar estado de erro
   */
  const renderError = () => (
    <div className='import-section'>
      <div className='error-state'>
        <FaExclamationTriangle className='error-icon' />
        <h4>❌ Erro na Importação</h4>
        <p>Verifique o arquivo e tente novamente.</p>

        <button className='btn-action' onClick={handleResetImport}>
          <FaRocket /> Tentar Novamente
        </button>
      </div>
    </div>
  );

  /**
   * Função para obter nome formal da coluna
   */
  const getColumnDisplayName = key => {
    const columnNames = {
      linha: 'Linha',
      tipo: 'Tipo',
      titulo: 'Título',
      descricao: 'Descrição',
      esforcoestimado: 'Esforço',
      inicioestimado: 'Início estimado',
      terminoestimado: 'Término estimado',
      funcionalidade: 'Funcionalidade',
      subfuncionalidade: 'Sub-funcionalidade',
      responsavel: 'Responsável',
      responsabilidade: 'Responsabilidade',
      account_id: 'ID do grupo',
      folder_id: 'ID da pasta',
      urgencia: 'Urgência',
      complexidade: 'Complexidade',
      situacao: 'Situação',
      observacoes: 'Observações',
    };

    return (
      columnNames[key.toLowerCase()] ||
      key.charAt(0).toUpperCase() + key.slice(1)
    );
  };

  return (
    <section className='card' id='activity-import'>
      <div className='card-header'>
        <h2>
          <FaFileImport className='header-icon' /> Importação de Atividades
        </h2>
        {!showFields && (
          <button
            className='generate-all-btn'
            onClick={handleExpand}
            title='Nova importação de atividades'
          >
            +
          </button>
        )}
        {showFields && (
          <div className='card-actions'>
            <button
              className={`btn-icon selection-btn ${showHistory ? 'active' : ''}`}
              onClick={() => setShowHistory(!showHistory)}
              title='Histórico de importações'
            >
              <FaHistory />
            </button>
            <button
              className='btn-icon selection-btn'
              onClick={handleCollapse}
              title='Colapsar card'
            >
              <FaMinus />
            </button>
          </div>
        )}
      </div>

      {showFields && (
        <div className='card-content'>
          {/* Template Download Section - ocultar durante preview, processamento e quando concluída */}
          {currentState !== IMPORT_STATES.PREVIEW &&
            currentState !== IMPORT_STATES.PROCESSING &&
            currentState !== IMPORT_STATES.COMPLETED && (
              <div className='template-section'>
                <div className='template-header'>
                  <div className='template-title'>
                    <h4>Modelo de importação</h4>
                    <p>
                      Baixe o template CSV personalizado para importação
                      <button
                        className={`info-trigger-btn selection-btn ${showInfoPanel ? 'active' : ''}`}
                        onClick={() => setShowInfoPanel(!showInfoPanel)}
                        title='Configurar tipos e ver orientações'
                      >
                        <FaInfoCircle />
                      </button>
                    </p>
                  </div>
                </div>

                {/* Painel informativo */}
                {showInfoPanel && (
                  <div className='info-panel'>
                    <div className='info-panel-header'>
                      <h4>
                        <FaClipboardList className='panel-icon' /> Configuração
                        e Orientações
                      </h4>
                      <button
                        className='close-panel-btn selection-btn'
                        onClick={() => setShowInfoPanel(false)}
                      >
                        <FaTimes />
                      </button>
                    </div>
                    <div className='info-panel-content'>
                      {/* Seção 1: Seletor de tipos - movido para cá */}
                      <div className='info-section'>
                        <div className='section-header-with-actions'>
                          <h4>Tipos a incluir no template</h4>
                          <div className='selection-actions'>
                            <button
                              className='btn-icon selection-btn'
                              onClick={() =>
                                setSelectedTypes(enabledActivityTypesValues)
                              }
                              title='Selecionar todos os tipos'
                            >
                              <FaCheckDouble />
                            </button>
                            <button
                              className='btn-icon selection-btn'
                              onClick={() => setSelectedTypes([])}
                              title='Limpar seleção'
                            >
                              <FaEraser />
                            </button>
                          </div>
                        </div>
                        <div className='activity-types-selector'>
                          <div className='toggle-field-row'>
                            {enabledActivityTypesValues.map(type => (
                              <button
                                key={type}
                                className={`toggle-button ${selectedTypes.includes(type) ? 'active' : ''}`}
                                onClick={() => toggleActivityType(type)}
                              >
                                <div className='toggle-content'>
                                  <span className='toggle-icon'>
                                    {selectedTypes.includes(type) ? '✓' : '+'}
                                  </span>
                                  <span>{type}</span>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Seção 2: Download do Template */}
                      <div className='info-section info-section-spaced'>
                        <h4>Download do Template</h4>
                        <div className='download-action-panel'>
                          <button
                            className={`btn-download ${selectedTypes.length === 0 ? 'disabled' : ''}`}
                            onClick={() =>
                              downloadTemplate(selectedTypes, selectedStatus)
                            }
                            disabled={selectedTypes.length === 0}
                          >
                            <FaDownload />
                            <span>
                              {selectedTypes.length === 0
                                ? 'Nenhum tipo selecionado'
                                : 'Baixar modelo'}
                            </span>
                          </button>
                          {selectedTypes.length === 0 && (
                            <p className='download-hint'>
                              Configure os tipos de atividade na seção acima
                              para gerar seu template personalizado.
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Seção 3: Campos Obrigatórios */}
                      <div className='info-section info-section-spaced'>
                        <h4>Como identificar campos obrigatórios</h4>
                        <div className='field-indicators'>
                          <div className='indicator required'>
                            <strong>(*)</strong> = Sempre obrigatório
                          </div>
                          <div className='indicator conditional'>
                            <strong>(**)</strong> = Obrigatório para alguns
                            tipos
                          </div>
                          <div className='indicator optional'>
                            <strong>sem indicador</strong> = Opcional
                          </div>
                        </div>
                      </div>

                      {/* Seção 4: Tutorial Excel */}
                      <div className='info-section info-section-spaced'>
                        <h4>Como utilizar no Excel (Recomendado)</h4>
                        <div className='excel-steps'>
                          <div className='step'>
                            <strong>1. Abra o Excel</strong>
                            <p>Crie uma nova planilha em branco</p>
                          </div>

                          <div className='step'>
                            <strong>2. Importe o CSV</strong>
                            <p>
                              Dados → Obter Dados → De Arquivo → Do Texto/CSV
                            </p>
                          </div>

                          <div className='step'>
                            <strong>3. Configure a importação</strong>
                            <p>
                              Delimiter: Vírgula, Codificação: UTF-8, clique em
                              &quot;Carregar&quot;
                            </p>
                          </div>

                          <div className='step'>
                            <strong>4. Limpe o arquivo</strong>
                            <p>
                              ⚠️ DELETE as linhas explicativas (linhas com
                              &quot;LEGENDA&quot; e &quot;TIPO&quot;)
                            </p>
                          </div>

                          <div className='step'>
                            <strong>5. Preencha seus dados</strong>
                            <p>
                              Use os exemplos como base e preencha os campos{' '}
                              <strong>obrigatórios</strong>
                            </p>
                          </div>

                          <div className='step'>
                            <strong>6. Salve como CSV</strong>
                            <p>
                              Arquivo → Salvar Como → CSV (delimitado por
                              vírgula)
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Seção 5: Tipos de Atividade */}
                      <div className='info-section info-section-spaced'>
                        <h4>Campos obrigatórios por tipo</h4>
                        <div className='activity-types-info'>
                          <div
                            className='type-info'
                            style={{ borderLeft: '4px solid #08ECCC' }}
                          >
                            <strong>Desenvolvimento</strong>{' '}
                            <span className='field-count'>4 campos</span>
                            <p>
                              Tipo, título, funcionalidade, sub-funcionalidade
                            </p>
                            <small className='field-note'>
                              Se não informado nos campos acima: account_id,
                              folder_id
                            </small>
                          </div>
                          <div
                            className='type-info'
                            style={{ borderLeft: '4px solid #F90EF4' }}
                          >
                            <strong>Execução de testes</strong>{' '}
                            <span className='field-count'>4 campos</span>
                            <p>
                              Tipo, título, funcionalidade, sub-funcionalidade
                            </p>
                            <small className='field-note'>
                              Se não informado nos campos acima: account_id,
                              folder_id
                            </small>
                          </div>
                          <div
                            className='type-info'
                            style={{ borderLeft: '4px solid #89B0EB' }}
                          >
                            <strong>Teste de mesa</strong>{' '}
                            <span className='field-count'>4 campos</span>
                            <p>
                              Tipo, título, funcionalidade, sub-funcionalidade
                            </p>
                            <small className='field-note'>
                              Se não informado nos campos acima: account_id,
                              folder_id
                            </small>
                          </div>
                          <div
                            className='type-info'
                            style={{ borderLeft: '4px solid #90F485' }}
                          >
                            <strong>Análise de testes</strong>{' '}
                            <span className='field-count'>4 campos</span>
                            <p>
                              Tipo, título, funcionalidade, sub-funcionalidade
                            </p>
                            <small className='field-note'>
                              Se não informado nos campos acima: account_id,
                              folder_id
                            </small>
                          </div>
                          <div
                            className='type-info'
                            style={{ borderLeft: '4px solid #F1D8D8' }}
                          >
                            <strong>Documentação</strong>{' '}
                            <span className='field-count'>2 campos</span>
                            <p>Apenas tipo e título</p>
                            <small className='field-note'>
                              Se não informado nos campos acima: account_id,
                              folder_id
                            </small>
                          </div>
                        </div>
                      </div>

                      {/* Seção 6: Dicas */}
                      <div className='info-section info-section-spaced'>
                        <h4>Dicas importantes</h4>
                        <div className='tips-list'>
                          <div className='tip'>
                            <div className='tip-row'>
                              <div className='tip-item'>
                                <strong>✅ Use valores exatos</strong>
                                <p>
                                  Urgência: &quot;Baixo&quot;,
                                  &quot;Médio&quot;, &quot;Alto&quot;,
                                  &quot;Crítico&quot;
                                </p>
                              </div>
                              <div className='tip-item'>
                                <strong>⚠️ Delete comentários</strong>
                                <p>
                                  Remova linhas explicativas antes de importar
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          {/* Main Import Section */}
          {renderCurrentState()}
          {/* History Section */}
          {showHistory && (
            <div className='history-section'>
              <div className='template-header'>
                <div className='template-title'>
                  <h4>Histórico de Importações</h4>
                  <p>
                    Serão exibidas as últimas 10 importações realizadas. Se
                    necessário, salve os arquivos localmente para uso futuro.
                    {importHistory.length > 0 && (
                      <>
                        <button
                          className='btn-icon-only'
                          onClick={clearHistory}
                          title='Limpar histórico'
                        >
                          <FaTrash />
                        </button>
                        <button
                          className='btn-icon-only'
                          onClick={handleCompleteReset}
                          title='Limpar dados salvos e resetar formulário'
                          style={{ marginLeft: '8px' }}
                        >
                          <FaEraser />
                        </button>
                      </>
                    )}
                  </p>
                </div>
              </div>

              {importHistory.length === 0 ? (
                <p className='no-history'>Nenhuma importação realizada</p>
              ) : (
                <div className='history-table-container'>
                  <table className='history-table'>
                    <thead>
                      <tr>
                        <th>Descrição</th>
                        <th>Data / Hora</th>
                        <th>Situação</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {importHistory.map(item => {
                        const hasErrors =
                          item.status === 'error' ||
                          item.status === 'parse_error' ||
                          item.status === 'read_error';

                        const isPartial = item.status === 'partial';

                        let statusText = 'Concluído';
                        if (hasErrors) {
                          statusText = 'Erro';
                        } else if (isPartial) {
                          statusText = 'Parcial';
                        }

                        return (
                          <tr key={item.id}>
                            <td title={item.importName} className='td-name'>
                              {item.importName}
                            </td>
                            <td className='td-datetime'>
                              <div className='date-time-group'>
                                <div className='date'>
                                  {new Date(item.timestamp).toLocaleDateString(
                                    'pt-BR'
                                  )}
                                </div>
                                <div className='time'>
                                  {new Date(item.timestamp).toLocaleTimeString(
                                    'pt-BR',
                                    {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    }
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className='td-situation'>
                              {hasErrors ? (
                                <div className='situation-error'>
                                  <span className='situation-label error'>
                                    {item.results?.errors?.length > 1
                                      ? `${item.results.errors.length} erros`
                                      : 'Erro'}
                                  </span>
                                  <div className='error-details-improved'>
                                    {item.results?.errors?.length > 0 ? (
                                      item.results.errors.length === 1 ? (
                                        <div className='error-item-compact'>
                                          <span className='error-message'>
                                            {item.results.errors[0].error}
                                          </span>
                                        </div>
                                      ) : (
                                        <div className='error-summary-compact'>
                                          <details className='error-details-toggle'>
                                            <summary>Ver detalhes</summary>
                                            <div className='error-list-expanded'>
                                              {item.results.errors.map(
                                                (error, index) => (
                                                  <div
                                                    key={index}
                                                    className='error-item-expanded'
                                                  >
                                                    <div className='error-line-header'>
                                                      <span className='error-line-ref'>
                                                        Linha{' '}
                                                        {Number(error.line) + 1}
                                                      </span>
                                                    </div>
                                                    {error.error.includes(
                                                      'Data de início inválida'
                                                    ) ? (
                                                      <div className='error-message'>
                                                        Data de início inválida.
                                                        Use o formato YYYY-MM-DD
                                                        (ex: 2024-03-20)
                                                      </div>
                                                    ) : error.error.includes(
                                                        'Data de término inválida'
                                                      ) ? (
                                                      <div className='error-message'>
                                                        Data de término
                                                        inválida. Use o formato
                                                        YYYY-MM-DD (ex:
                                                        2024-03-20)
                                                      </div>
                                                    ) : error.error.includes(
                                                        'Headers obrigatórios ausentes'
                                                      ) ? (
                                                      <div className='error-message'>
                                                        Headers obrigatórios
                                                        ausentes. Verifique se o
                                                        arquivo possui todos os
                                                        campos obrigatórios no
                                                        cabeçalho.
                                                      </div>
                                                    ) : error.error.includes(
                                                        'Falha na autenticação'
                                                      ) ? (
                                                      <div className='error-message'>
                                                        Falha na autenticação.
                                                        Verifique suas
                                                        credenciais do Artia e
                                                        tente novamente.
                                                      </div>
                                                    ) : error.error.includes(
                                                        'tipo, titulo'
                                                      ) ? (
                                                      <div className='error-message'>
                                                        Campos obrigatórios
                                                        ausentes. Adicione as
                                                        colunas tipo e titulo ao
                                                        seu arquivo CSV.
                                                      </div>
                                                    ) : (
                                                      <div className='error-message'>
                                                        {error.error}
                                                      </div>
                                                    )}
                                                  </div>
                                                )
                                              )}
                                            </div>
                                          </details>
                                        </div>
                                      )
                                    ) : (
                                      <div className='error-item-compact'>
                                        <span className='error-message'>
                                          {item.errorMessage}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ) : isPartial ? (
                                <div className='situation-partial'>
                                  <span className='situation-label partial'>
                                    Parcial
                                  </span>
                                  <span className='success-details'>
                                    {item.successCount} atividades criadas,{' '}
                                    {item.errorCount} com erro
                                  </span>
                                </div>
                              ) : (
                                <div className='situation-success'>
                                  <span className='situation-label success'>
                                    Sucesso
                                  </span>
                                  <span className='success-details'>
                                    {item.successCount} atividades criadas
                                  </span>
                                </div>
                              )}
                            </td>
                            <td className='td-actions'>
                              <div className='action-buttons'>
                                <div className='download-dropdown'>
                                  <FaDownload className='action-icon' />
                                  <div className='download-dropdown-content'>
                                    <div
                                      className='download-item'
                                      onClick={() => handleRedownload(item)}
                                    >
                                      <FaDownload /> Relatório de Criação
                                    </div>

                                    {item.status !== 'error' &&
                                      item.results?.success?.length > 0 && (
                                        <div
                                          className='download-item'
                                          onClick={() =>
                                            downloadUpdateTemplate(
                                              item.results.success
                                            )
                                          }
                                        >
                                          <FaEdit /> Template de Atualização
                                        </div>
                                      )}
                                  </div>
                                </div>

                                <FaTimes
                                  className='action-icon danger'
                                  onClick={() =>
                                    handleRemoveHistoryItem(item.id)
                                  }
                                  title='Remover do histórico'
                                />
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Input de arquivo oculto - sempre disponível */}
      <input
        ref={fileInputRef}
        type='file'
        accept='.csv,.txt'
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
    </section>
  );
};

export default ActivityImportCard;
