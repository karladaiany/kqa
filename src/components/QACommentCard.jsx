import React, { useState, useCallback } from 'react';
import { 
  Card, 
  TextField, 
  Button, 
  Box, 
  Select, 
  MenuItem, 
  FormControl,
  InputLabel,
  Switch
} from '@mui/material';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import './QACommentCard.css';

const QACommentCard = () => {
  const { isDarkMode } = useTheme();
  const [qaData, setQaData] = useLocalStorage('qaComment', {
    testStatus: '',
    environment: '',
    validation: '',
    observation: '',
    waiting: '',
    returnReason: '',
    blockReason: '',
    evidence: '',
    evidenceLink: '',
    hasEvidence: false
  });

  const { showToast } = useToast();

  const fieldLabels = {
    validation: 'Validação',
    observation: 'Observação',
    waiting: 'Aguardando',
    returnReason: 'Motivo do retorno',
    blockReason: 'Motivo do bloqueio',
    evidence: 'Descrição da evidência',
    evidenceLink: 'Link da evidência'
  };

  const statusOptions = {
    REPROVADO: { label: '❌ Reprovado', value: '❌ Reprovado' },
    PASSOU: { label: '✅ Passou', value: '✅ Passou' },
    AGUARDANDO: { label: '‼️ Aguardando', value: '‼️ Aguardando' },
    BLOQUEADO: { label: '🚫 Bloqueado', value: '🚫 Bloqueado' },
    RETORNADO: { label: '↩ Retornado', value: '↩ Retornado' },
    CANCELADO: { label: '🗑️ Cancelado', value: '🗑️ Cancelado' }
  };

  const environmentOptions = {
    STAGE: { label: '🧪 Stage', value: '🧪 Stage' },
    PRODUCAO: { label: '⚙️ Produção', value: '⚙️ Produção' },
    ALPHA: { label: '🔮 Alpha', value: '🔮 Alpha' }
  };

  const handleChange = (field) => (event) => {
    setQaData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleToggle = () => {
    setQaData(prev => ({
      ...prev,
      hasEvidence: !prev.hasEvidence
    }));
  };

  const clearField = (field) => {
    setQaData(prev => ({
      ...prev,
      [field]: typeof prev[field] === 'boolean' ? false : ''
    }));
  };

  const clearAll = () => {
    setQaData({
      testStatus: '',
      environment: '',
      validation: '',
      observation: '',
      waiting: '',
      returnReason: '',
      blockReason: '',
      evidence: '',
      evidenceLink: '',
      hasEvidence: false
    });
    showToast('Todos os campos foram limpos!');
  };

  const getVisibleFields = () => {
    const baseFields = ['environment', 'validation', 'observation'];
    switch (qaData.testStatus) {
      case 'AGUARDANDO':
        return [...baseFields, 'waiting'];
      case 'BLOQUEADO':
        return [...baseFields, 'blockReason'];
      case 'RETORNADO':
        return [...baseFields, 'returnReason'];
      case 'CANCELADO':
        return ['observation'];
      default:
        return baseFields;
    }
  };

  const handleCopy = useCallback(() => {
    const template = `:: Status do Teste ::
${statusOptions[qaData.testStatus]?.label || ''}

:: Ambiente ::
${environmentOptions[qaData.environment]?.label || ''}

:: Validação ::
${qaData.validation}

:: Observação ::
${qaData.observation}

${qaData.waiting ? `:: Aguardando ::\n${qaData.waiting}\n` : ''}
${qaData.returnReason ? `:: Motivo do Retorno ::\n${qaData.returnReason}\n` : ''}
${qaData.blockReason ? `:: Motivo do Bloqueio ::\n${qaData.blockReason}\n` : ''}

:: Evidência(s) ::${qaData.evidence ? `\n${qaData.evidence}` : ''}${qaData.hasEvidence ? '\n✓ Evidência em anexo na atividade' : ''}${qaData.evidenceLink ? `\n✓ Evidência no link: ${qaData.evidenceLink}` : ''}`;

    navigator.clipboard.writeText(template.trim())
      .then(() => showToast('Template copiado!'))
      .catch(err => console.error('Erro ao copiar:', err));
  }, [qaData, showToast]);

  const renderField = (field) => {
    return (
      <div className="form-group" key={field}>
        <input
          type="text"
          className="form-control"
          value={qaData[field]}
          onChange={handleChange(field)}
          placeholder=" "
        />
        <label className="form-label">{fieldLabels[field]}</label>
        {qaData[field] && (
          <i 
            className="fas fa-times clear-field-icon"
            onClick={() => clearField(field)}
            title="Limpar campo"
          />
        )}
      </div>
    );
  };

  return (
    <Card 
      id="qa-comment"
      sx={{ 
        p: 2, 
        height: '100%',
        boxShadow: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)',
        borderRadius: '0.25rem',
        bgcolor: isDarkMode ? 'var(--dark-card-bg)' : 'var(--background-color)',
        color: isDarkMode ? 'var(--dark-text)' : 'inherit'
      }}
    >
      <div className="card-header">
        <h5>
          <i className="fas fa-comment"></i>
          Comentário QA
        </h5>
      </div>

      <div className="card-body">
        <div className="form-section">
          <FormControl fullWidth className="form-group">
            <InputLabel>Status do teste</InputLabel>
            <Select
              value={qaData.testStatus}
              onChange={handleChange('testStatus')}
              label="Status do teste"
            >
              {Object.entries(statusOptions).map(([key, { label }]) => (
                <MenuItem key={key} value={key}>{label}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {getVisibleFields().map(field => (
            field === 'environment' ? (
              <FormControl fullWidth key={field} className="form-group">
                <InputLabel>Ambiente</InputLabel>
                <Select
                  value={qaData[field]}
                  onChange={handleChange(field)}
                  label="Ambiente"
                >
                  {Object.entries(environmentOptions).map(([key, { label }]) => (
                    <MenuItem key={key} value={key}>{label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              renderField(field)
            )
          ))}
        </div>

        <div className="form-section">
          <h6 className="section-title">
            <i className="fas fa-camera"></i> Evidências
          </h6>
          <div className="form-row">
            {renderField('evidence')}
            {renderField('evidenceLink')}
            <div className="evidence-toggle">
              <Switch
                checked={qaData.hasEvidence}
                onChange={handleToggle}
                color="primary"
              />
              <span>Evidência em anexo na atividade</span>
            </div>
          </div>
        </div>

        <div className="card-footer">
          <button className="btn-copy" onClick={handleCopy}>
            <i className="fas fa-copy"></i>
            Copiar
          </button>
          <button className="btn-clear" onClick={clearAll}>
            <i className="fas fa-trash"></i>
            Limpar tudo
          </button>
        </div>
      </div>
    </Card>
  );
};

export default QACommentCard; 