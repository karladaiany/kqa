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
  FaRocket,
  FaHistory,
  FaTrash,
  FaTimes,
  FaInfoCircle,
  FaCog,
  FaEdit,
} from 'react-icons/fa';
import { toast } from 'react-toastify';

import {
  useActivityImport,
  IMPORT_STATES,
} from '../../../hooks/useActivityImport';
import { ACTIVITY_TYPES } from '../../../constants/artiaOptions';
import './ActivityImportCard.css';

const ActivityImportCard = () => {
  const {
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
    processFile,
    executeImport,
    resetImport,
    clearHistory,
    downloadTemplate,
  } = useActivityImport();

  // Estados locais do componente
  const [showHistory, setShowHistory] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    accountId: '',
    folderId: '',
  });
  const [selectedTypes, setSelectedTypes] = useState(
    Object.values(ACTIVITY_TYPES)
  );

  const fileInputRef = useRef(null);

  /**
   * Manipular drop de arquivo
   */
  const handleDrop = useCallback(
    e => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        selectFile(files[0]);
      }
    },
    [selectFile]
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
        selectFile(file);
      }
    },
    [selectFile]
  );

  /**
   * Processar arquivo após seleção
   */
  const handleProcessFile = useCallback(async () => {
    if (!selectedFile) return;

    const success = await processFile();
    if (success) {
      setShowPreview(true);
    }
  }, [selectedFile, processFile]);

  /**
   * Executar importação
   */
  const handleExecuteImport = useCallback(async () => {
    if (!canProceed) {
      toast.warning('Corrija os erros antes de prosseguir');
      return;
    }

    const success = await executeImport(credentials);
    if (success) {
      // Download automático do relatório
      setTimeout(() => {
        downloadMainReport();
      }, 2000);
    }
  }, [canProceed, executeImport, credentials]);

  /**
   * Download do relatório principal
   */
  const downloadMainReport = useCallback(() => {
    if (processResults.success.length === 0) return;

    const csvContent = generateMainReportCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `relatorio-${importName}-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
    toast.success('📥 Relatório baixado automaticamente!');
  }, [processResults, importName]);

  /**
   * Gerar CSV do relatório principal
   */
  const generateMainReportCSV = useCallback(() => {
    const headers = [
      'artia_id',
      'artia_uid',
      'linha_original',
      'titulo',
      'tipo',
      'status',
      'erro',
    ];

    const rows = [
      ...processResults.success.map(item => [
        item.id,
        item.uid,
        item.line,
        `"${item.title}"`,
        item.originalData.tipo,
        'Sucesso',
        '',
      ]),
      ...processResults.errors.map(item => [
        '',
        '',
        item.line,
        `"${item.title}"`,
        item.originalData.tipo,
        'Erro',
        `"${item.error}"`,
      ]),
    ];

    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  }, [processResults]);

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
          Arraste seu arquivo CSV aqui ou{' '}
          <span className='click-text'>clique para selecionar</span>
        </p>
        <small className='drop-hint'>
          Formatos aceitos: .csv, .txt (máx. 50MB)
        </small>
      </div>

      <input
        ref={fileInputRef}
        type='file'
        accept='.csv,.txt'
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
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
        >
          <FaEdit /> Trocar
        </button>
      </div>

      <div className='import-identification'>
        <label htmlFor='import-name'>
          📝 Nome desta importação (máx. 100 caracteres):
        </label>
        <input
          id='import-name'
          type='text'
          maxLength={100}
          value={importName}
          onChange={e => setImportName(e.target.value)}
          placeholder='Ex: Sprint 15 - Correções de Bug'
          className='import-name-input'
        />
      </div>

      <div className='import-mode'>
        <label>Modo de importação:</label>
        <div className='mode-options'>
          <label className='mode-option'>
            <input
              type='radio'
              value='create'
              checked={importMode === 'create'}
              onChange={e => setImportMode(e.target.value)}
            />
            <span>Criar atividades</span>
          </label>
          <label className='mode-option'>
            <input
              type='radio'
              value='update'
              checked={importMode === 'update'}
              onChange={e => setImportMode(e.target.value)}
            />
            <span>Atualizar atividades</span>
          </label>
        </div>
      </div>

      <button className='btn-primary' onClick={handleProcessFile}>
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
   */
  const renderPreview = () => (
    <div className='import-section'>
      <div className='preview-header'>
        <h4>
          <FaEye /> Preview dos Dados
        </h4>
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

      {validatedData.length > 0 && (
        <div className='preview-table-container'>
          <button
            className='btn-secondary'
            onClick={() => setShowPreview(!showPreview)}
          >
            <FaEye /> {showPreview ? 'Ocultar' : 'Mostrar'} Preview
          </button>

          {showPreview && (
            <div className='preview-table'>
              <table>
                <thead>
                  <tr>
                    <th>Linha</th>
                    <th>Tipo</th>
                    <th>Título</th>
                    <th>Responsável</th>
                  </tr>
                </thead>
                <tbody>
                  {validatedData.slice(0, 10).map((activity, index) => (
                    <tr key={index}>
                      <td>{activity._originalLine}</td>
                      <td>{activity.tipo}</td>
                      <td title={activity.titulo}>
                        {activity.titulo.length > 50
                          ? `${activity.titulo.substring(0, 50)}...`
                          : activity.titulo}
                      </td>
                      <td>{activity.responsavel || 'Não definido'}</td>
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
          )}
        </div>
      )}

      {canProceed && (
        <div className='credentials-section'>
          <h5>🔐 Credenciais do Artia:</h5>
          <div className='credentials-form'>
            <div className='form-row'>
              <input
                type='email'
                placeholder='Email'
                value={credentials.email}
                onChange={e =>
                  setCredentials(prev => ({ ...prev, email: e.target.value }))
                }
              />
              <input
                type='password'
                placeholder='Senha'
                value={credentials.password}
                onChange={e =>
                  setCredentials(prev => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
              />
            </div>
            <div className='form-row'>
              <input
                type='text'
                placeholder='Account ID'
                value={credentials.accountId}
                onChange={e =>
                  setCredentials(prev => ({
                    ...prev,
                    accountId: e.target.value,
                  }))
                }
              />
              <input
                type='text'
                placeholder='Folder ID'
                value={credentials.folderId}
                onChange={e =>
                  setCredentials(prev => ({
                    ...prev,
                    folderId: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <button
            className='btn-primary'
            onClick={handleExecuteImport}
            disabled={!credentials.email || !credentials.password}
          >
            <FaRocket /> Executar Importação ({validatedData.length} atividades)
          </button>
        </div>
      )}

      <div className='preview-actions'>
        <button className='btn-secondary' onClick={resetImport}>
          <FaTimes /> Cancelar
        </button>
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
          {processProgress.toFixed(1)}% concluído
        </div>

        <div className='progress-stats'>
          <span className='stat success'>
            ✅ {processResults.success.length} criadas
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
        <h4>✅ Importação Concluída!</h4>

        <div className='completion-stats'>
          <div className='stat-card success'>
            <span className='stat-number'>{processResults.success.length}</span>
            <span className='stat-label'>Atividades Criadas</span>
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
              {(
                (processResults.success.length / processResults.total) *
                100
              ).toFixed(1)}
              %
            </span>
            <span className='stat-label'>Taxa de Sucesso</span>
          </div>
        </div>

        <div className='completion-actions'>
          <button className='btn-primary' onClick={downloadMainReport}>
            <FaDownload /> Baixar Relatório Completo
          </button>

          <button className='btn-secondary' onClick={resetImport}>
            <FaRocket /> Nova Importação
          </button>
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

        <button className='btn-primary' onClick={resetImport}>
          <FaRocket /> Tentar Novamente
        </button>
      </div>
    </div>
  );

  return (
    <div className='card activity-import-card'>
      <div className='card-header'>
        <div className='card-title'>
          <FaFileImport className='card-icon' />
          <span>Importação de Atividades</span>
        </div>

        <div className='card-actions'>
          <button
            className='btn-icon'
            onClick={() => downloadTemplate(selectedTypes)}
            title='Baixar template CSV'
          >
            <FaDownload />
          </button>

          <button
            className='btn-icon'
            onClick={() => setShowHistory(!showHistory)}
            title='Histórico de importações'
          >
            <FaHistory />
          </button>

          <button
            className='btn-icon'
            onClick={resetImport}
            title='Reset importação'
          >
            <FaTimes />
          </button>
        </div>
      </div>

      <div className='card-content'>
        {/* Template Download Section */}
        <div className='template-section'>
          <h4>📋 Modelo de Importação</h4>
          <p>Baixe o template CSV com exemplos dos tipos de atividade:</p>

          <div className='template-info'>
            <div className='info-card'>
              <FaInfoCircle className='info-icon' />
              <div className='info-content'>
                <h5>🎯 Como identificar campos obrigatórios</h5>
                <div className='field-indicators'>
                  <span className='indicator required'>
                    <strong>(*)</strong> = Sempre obrigatório
                  </span>
                  <span className='indicator conditional'>
                    <strong>(**)</strong> = Obrigatório para alguns tipos
                  </span>
                  <span className='indicator optional'>
                    <strong>sem indicador</strong> = Opcional
                  </span>
                </div>
                <small>
                  💡 O template incluirá comentários explicativos sobre campos
                  obrigatórios para cada tipo
                </small>
              </div>
            </div>
          </div>

          <div className='type-selector'>
            <label>Tipos a incluir no template:</label>
            <div className='type-checkboxes'>
              {Object.values(ACTIVITY_TYPES).map(type => (
                <label key={type} className='type-checkbox'>
                  <input
                    type='checkbox'
                    checked={selectedTypes.includes(type)}
                    onChange={e => {
                      if (e.target.checked) {
                        setSelectedTypes(prev => [...prev, type]);
                      } else {
                        setSelectedTypes(prev => prev.filter(t => t !== type));
                      }
                    }}
                  />
                  <span>{type}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            className='btn-primary'
            onClick={() => downloadTemplate(selectedTypes)}
            disabled={selectedTypes.length === 0}
          >
            <FaDownload /> Baixar Template ({selectedTypes.length} tipos)
          </button>
        </div>

        {/* Main Import Section */}
        {renderCurrentState()}

        {/* History Section */}
        {showHistory && (
          <div className='history-section'>
            <div className='history-header'>
              <h4>📚 Histórico de Importações ({importHistory.length})</h4>
              {importHistory.length > 0 && (
                <button className='btn-secondary' onClick={clearHistory}>
                  <FaTrash /> Limpar Histórico
                </button>
              )}
            </div>

            {importHistory.length === 0 ? (
              <p className='no-history'>Nenhuma importação realizada ainda.</p>
            ) : (
              <div className='history-list'>
                {importHistory.map(item => (
                  <div key={item.id} className='history-item'>
                    <div className='history-info'>
                      <strong>{item.importName}</strong>
                      <small>
                        {new Date(item.timestamp).toLocaleString('pt-BR')}
                      </small>
                      <div className='history-stats'>
                        ✅ {item.successCount} sucessos | ❌ {item.errorCount}{' '}
                        erros
                      </div>
                    </div>
                    <button
                      className='btn-secondary'
                      onClick={() => handleRedownload(item)}
                    >
                      <FaDownload /> Baixar
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityImportCard;
