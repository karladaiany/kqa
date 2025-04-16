import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';
import { Card, Switch } from '@mui/material';
import { useTheme } from '../context/ThemeContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { encryptData, decryptData } from '../utils/crypto';

const BugReportCard = () => {
  const { isDarkMode } = useTheme();
  const { showToast } = useToast();
  const [bugData, setBugData] = useLocalStorage('bugReport', {
    // Campos principais
    incident: '',
    steps: '',
    expectedBehavior: '',
    // Informações
    url: '',
    login: '',
    password: '',
    orgId: '',
    // Evidências
    evidence: '',
    evidenceLink: '',
    hasEvidence: false
  });

  // Campos sensíveis que devem ser criptografados
  const sensitiveFields = ['password', 'login', 'orgId'];

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setBugData(prev => ({
      ...prev,
      [field]: sensitiveFields.includes(field) ? encryptData(value) : value
    }));
  };

  // Função para obter valor descriptografado
  const getDecryptedValue = (field) => {
    return sensitiveFields.includes(field) ? decryptData(bugData[field]) : bugData[field];
  };

  const handleClear = (field) => {
    setBugData(prev => ({
      ...prev,
      [field]: ''
    }));
  };

  const handleToggle = () => {
    setBugData(prev => ({
      ...prev,
      hasEvidence: !prev.hasEvidence
    }));
  };

  const copyTemplate = () => {
    const template = `:: Incidente identificado ::
${bugData.incident}

:: Passo a passo para reprodução ::
${bugData.steps}

:: Comportamento esperado ::
${bugData.expectedBehavior}

:: Informações ::
url: ${bugData.url}
login: ${decryptData(bugData.login)}
senha: ${decryptData(bugData.password)}
id_ambiente: ${decryptData(bugData.orgId)}

:: Evidência(s) ::${bugData.evidence ? `\n${bugData.evidence}` : ''}${bugData.hasEvidence ? '\n✓ Evidência em anexo na atividade' : ''}${bugData.evidenceLink ? `\n✓ Evidência no link: ${bugData.evidenceLink}` : ''}`;

    navigator.clipboard.writeText(template.trim())
      .then(() => showToast('Template copiado!'))
      .catch(err => console.error('Erro ao copiar:', err));
  };

  const clearAll = () => {
    setBugData({
      incident: '',
      steps: '',
      expectedBehavior: '',
      url: '',
      login: '',
      password: '',
      orgId: '',
      evidence: '',
      evidenceLink: '',
      hasEvidence: false
    });
    showToast('Todos os campos foram limpos!');
  };

  const renderField = (field, label) => {
    // Função auxiliar para formatar o label
    const formatLabel = (label) => {
      if (field === 'url') return 'URL';
      if (field === 'orgId') {
        return <><span className="id">ID</span> do ambiente</>;
      }
      return label;
    };

    return (
      <div className="form-group" key={field}>
        <input
          type={field === 'password' ? 'password' : 'text'}
          className={`form-control ${field === 'url' ? 'text-uppercase' : ''}`}
          value={getDecryptedValue(field)}
          onChange={handleChange(field)}
          placeholder=" "
        />
        <label className={`form-label ${field === 'url' ? 'text-uppercase' : ''}`}>
          {formatLabel(label)}
        </label>
        {bugData[field] && (
          <i 
            className="fas fa-times clear-field-icon"
            onClick={() => handleClear(field)}
            title="Limpar campo"
          />
        )}
        {sensitiveFields.includes(field) && (
          <div className="sensitive-field-warning">
            <i className="fas fa-shield-alt"></i>
          </div>
        )}
      </div>
    );
  };

  // Adicionar aviso de dados locais
  const renderLocalStorageWarning = () => (
    <div className="storage-warning">
      <i className="fas fa-info-circle"></i>
      <span>
        Os dados são salvos localmente no seu navegador. 
        Dados sensíveis são criptografados. 
        Use "Limpar tudo" para removê-los.
      </span>
    </div>
  );

  return (
    <Card 
      sx={{ 
        p: 2, 
        bgcolor: isDarkMode ? 'var(--dark-card-bg)' : 'var(--background-color)',
      }}
    >
      <div className="card-header">
        <h5><i className="fas fa-bug"></i> Registro de BUG </h5>
      </div>
      <div className="card-body">
        {renderLocalStorageWarning()}
        {/* Campos principais */}
        <div className="form-section">
          {renderField('incident', 'Incidente identificado')}
          {renderField('steps', 'Passo a passo para reprodução')}
          {renderField('expectedBehavior', 'Comportamento esperado')}
        </div>

        {/* Seção de Informações */}
        <div className="form-section">
          <h6 className="section-title">
            <i className="fas fa-info-circle"></i> Informações
          </h6>
          <div className="form-row">
            {renderField('url', 'URL')}
            {renderField('login', 'Login')}
            {renderField('password', 'Senha')}
            {renderField('orgId', 'ID do ambiente')}
          </div>
        </div>

        {/* Seção de Evidências */}
        <div className="form-section">
          <h6 className="section-title">
            <i className="fas fa-camera"></i> Evidências
          </h6>
          <div className="form-row">
            {renderField('evidence', 'Descrição da evidência')}
            {renderField('evidenceLink', 'Link da evidência')}
            <div className="evidence-toggle">
              <Switch
                checked={bugData.hasEvidence}
                onChange={handleToggle}
                color="primary"
              />
              <span>Evidência em anexo na atividade</span>
            </div>
          </div>
        </div>

        {/* Botões de ação */}
        <div className="form-actions">
          <button 
            className="btn btn-primary" 
            onClick={copyTemplate}
          >
            <i className="fas fa-copy"></i> Copiar
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={clearAll}
          >
            <i className="fas fa-broom"></i> Limpar Tudo
          </button>
        </div>
      </div>
    </Card>
  );
};

export default BugReportCard; 