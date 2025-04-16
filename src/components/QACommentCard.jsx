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
  Checkbox,
  FormControlLabel
} from '@mui/material';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';

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
    hasEvidence: false,
    evidenceLink: '',
    hasEvidenceLink: false
  });

  const { showToast } = useToast();
  const [text, setText] = useState('');

  const fieldLabels = {
    validation: 'Validação',
    observation: 'Observação',
    waiting: 'Aguardando',
    returnReason: 'Motivo do retorno',
    blockReason: 'Motivo do bloqueio'
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

  const handleCheckboxChange = (field) => (event) => {
    setQaData(prev => ({
      ...prev,
      [field]: event.target.checked
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
      hasEvidence: false,
      evidenceLink: '',
      hasEvidenceLink: false
    });
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
    if (!text) {
      showToast('Digite um texto primeiro!');
      return;
    }
    navigator.clipboard.writeText(text)
      .then(() => showToast('Texto copiado!'))
      .catch(err => console.error('Erro ao copiar:', err));
  }, [text, showToast]);

  const handleClear = useCallback(() => {
    setText('');
    showToast('Texto limpo!');
  }, [showToast]);

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
      <h5 style={{ 
        marginBottom: '1rem',
        color: isDarkMode ? 'var(--dark-text)' : 'inherit'
      }}>
        <i className="fas" style={{ marginRight: '0.5rem' }}></i>
        🗣️ Comentário QA
      </h5>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel sx={{ color: isDarkMode ? 'var(--dark-text)' : 'inherit' }}>
          Status do Teste
        </InputLabel>
        <Select
          value={qaData.testStatus}
          onChange={handleChange('testStatus')}
          label="Status do Teste"
          sx={{
            color: isDarkMode ? 'var(--dark-text)' : 'inherit',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: isDarkMode ? 'var(--dark-border)' : 'inherit',
            },
          }}
        >
          {Object.entries(statusOptions).map(([key, { label }]) => (
            <MenuItem key={key} value={key}>{label}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {getVisibleFields().map(field => (
        <Box key={field} sx={{ mb: 2 }}>
          {field === 'environment' ? (
            <FormControl fullWidth>
              <InputLabel sx={{ color: isDarkMode ? 'var(--dark-text)' : 'inherit' }}>
                Ambiente
              </InputLabel>
              <Select
                value={qaData[field]}
                onChange={handleChange(field)}
                label="Ambiente"
                sx={{
                  color: isDarkMode ? 'var(--dark-text)' : 'inherit',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: isDarkMode ? 'var(--dark-border)' : 'inherit',
                  },
                }}
              >
                {Object.entries(environmentOptions).map(([key, { label }]) => (
                  <MenuItem key={key} value={key}>{label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            <div className="form-group">
              <label className="form-label">{fieldLabels[field]}</label>
              <div className="input-container">
                <TextField
                  fullWidth
                  multiline
                  placeholder={`Digite ${fieldLabels[field].toLowerCase()} aqui...`}
                  value={qaData[field]}
                  onChange={handleChange(field)}
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <i 
                        className="fas fa-eraser" 
                        style={{ 
                          cursor: 'pointer',
                          color: isDarkMode ? 'var(--dark-text)' : 'inherit',
                          marginRight: '8px'
                        }}
                        onClick={() => clearField(field)}
                        title="Limpar"
                      />
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: isDarkMode ? 'var(--dark-text)' : 'inherit',
                      '& fieldset': {
                        borderColor: isDarkMode ? 'var(--dark-border)' : 'inherit',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: isDarkMode ? 'var(--dark-text)' : 'inherit',
                    },
                  }}
                />
                {qaData[field] && (
                  <i 
                    className="fas fa-times clear-field-icon"
                    onClick={() => clearField(field)}
                    title="Limpar campo"
                  />
                )}
              </div>
            </div>
          )}
        </Box>
      ))}

      <FormControlLabel
        control={
          <Checkbox
            checked={qaData.hasEvidence}
            onChange={handleCheckboxChange('hasEvidence')}
            sx={{
              color: isDarkMode ? 'var(--dark-text)' : 'inherit',
              '&.Mui-checked': {
                color: 'var(--primary-color)',
              },
            }}
          />
        }
        label="Evidência em anexo na atividade"
        sx={{
          color: isDarkMode ? 'var(--dark-text)' : 'inherit',
        }}
      />

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={qaData.hasEvidenceLink}
              onChange={handleCheckboxChange('hasEvidenceLink')}
              sx={{
                color: isDarkMode ? 'var(--dark-text)' : 'inherit',
                '&.Mui-checked': {
                  color: 'var(--primary-color)',
                },
              }}
            />
          }
          label="Evidência no link:"
          sx={{
            color: isDarkMode ? 'var(--dark-text)' : 'inherit',
          }}
        />
        {qaData.hasEvidenceLink && (
          <TextField
            size="small"
            value={qaData.evidenceLink}
            onChange={handleChange('evidenceLink')}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: isDarkMode ? 'var(--dark-text)' : 'inherit',
                '& fieldset': {
                  borderColor: isDarkMode ? 'var(--dark-border)' : 'inherit',
                },
              },
            }}
          />
        )}
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <Button 
          variant="contained" 
          onClick={handleCopy}
          sx={{
            bgcolor: 'var(--primary-color)',
            '&:hover': {
              bgcolor: 'var(--secondary-color)',
            },
          }}
        >
          <i className="fas fa-copy" style={{ marginRight: '0.5rem' }}></i>
          Copiar
        </Button>
        <Button 
          variant="outlined" 
          onClick={clearAll}
          sx={{
            color: isDarkMode ? 'var(--dark-text)' : 'inherit',
            borderColor: isDarkMode ? 'var(--dark-border)' : 'inherit',
          }}
        >
          <i className="fas fa-broom" style={{ marginRight: '0.5rem' }}></i>
          Limpar Tudo
        </Button>
      </Box>
    </Card>
  );
};

export default QACommentCard; 