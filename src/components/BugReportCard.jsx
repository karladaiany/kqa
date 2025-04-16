import React, { useState, useCallback } from 'react';
import { 
  Card, 
  TextField, 
  Button, 
  Box, 
  Typography,
  Checkbox,
  FormControlLabel 
} from '@mui/material';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';

const BugReportCard = () => {
  const { isDarkMode } = useTheme();
  const [bugData, setBugData] = useLocalStorage('bugReport', {
    incident: '',
    steps: '',
    expectedBehavior: '',
    url: '',
    login: '',
    password: '',
    orgId: '',
    evidence: '',
    hasEvidence: false,
    evidenceLink: '',
    hasEvidenceLink: false
  });

  const { showToast } = useToast();
  const [text, setText] = useState('');

  const fieldLabels = {
    incident: 'Incidente identificado',
    steps: 'Passo a passo para reprodução',
    expectedBehavior: 'Comportamento esperado',
    url: 'URL',
    login: 'Login',
    password: 'Senha',
    orgId: 'ID da Organização',
    evidence: 'Descrição da evidência'
  };

  const handleChange = (field) => (event) => {
    setBugData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleCheckboxChange = (field) => (event) => {
    setBugData(prev => ({
      ...prev,
      [field]: event.target.checked
    }));
  };

  const clearField = (field) => {
    setBugData(prev => ({
      ...prev,
      [field]: typeof prev[field] === 'boolean' ? false : ''
    }));
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
      hasEvidence: false,
      evidenceLink: '',
      hasEvidenceLink: false
    });
  };

  const renderTextField = (field) => (
    <Box key={field} sx={{ mb: 2 }}>
      <TextField
        fullWidth
        multiline
        label={fieldLabels[field]}
        placeholder={`Digite ${fieldLabels[field].toLowerCase()} aqui...`}
        value={bugData[field]}
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
    </Box>
  );

  const copyTemplate = () => {
    const template = `:: Incidente identificado ::
${bugData.incident}

:: Passo a passo para reprodução ::
${bugData.steps}

:: Comportamento esperado ::
${bugData.expectedBehavior}

:: Informações ::
url: ${bugData.url}
login: ${bugData.login}
senha: ${bugData.password}
org_id: ${bugData.orgId}

:: Evidência(s) ::
${bugData.evidence}
${bugData.hasEvidence ? '✓ Evidência em anexo na atividade' : ''}
${bugData.hasEvidenceLink ? `✓ Evidência no link: ${bugData.evidenceLink}` : ''}`;

    navigator.clipboard.writeText(template)
      .then(() => showToast('Copiado para a área de transferência!'))
      .catch(err => console.error('Erro ao copiar:', err));
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
      id="bug-report"
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
        🐞 Registro de BUG's
      </h5>
      
      {/* Campos principais */}
      {['incident', 'steps', 'expectedBehavior'].map(renderTextField)}

      {/* Seção de Informações */}
      <Typography 
        variant="subtitle1" 
        sx={{ 
          mt: 3, 
          mb: 2, 
          color: isDarkMode ? 'var(--dark-text)' : 'inherit',
          fontWeight: 'bold'
        }}
      >
        <i className="fas fa-info-circle" style={{ marginRight: '0.5rem' }}></i>
        Informações
      </Typography>
      <Box sx={{ pl: 2 }}>
        {['url', 'login', 'password', 'orgId'].map(renderTextField)}
      </Box>

      {/* Seção de Evidências */}
      <Typography 
        variant="subtitle1" 
        sx={{ 
          mt: 3, 
          mb: 2, 
          color: isDarkMode ? 'var(--dark-text)' : 'inherit',
          fontWeight: 'bold'
        }}
      >
        <i className="fas fa-camera" style={{ marginRight: '0.5rem' }}></i>
        Evidências
      </Typography>
      <Box sx={{ pl: 2 }}>
        {renderTextField('evidence')}
        
        <FormControlLabel
          control={
            <Checkbox
              checked={bugData.hasEvidence}
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

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={bugData.hasEvidenceLink}
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
          {bugData.hasEvidenceLink && (
            <TextField
              size="small"
              value={bugData.evidenceLink}
              onChange={handleChange('evidenceLink')}
              placeholder="Cole o link aqui..."
              sx={{
                flexGrow: 1,
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
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
        <Button 
          variant="contained" 
          onClick={copyTemplate}
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

      <div className="form-group">
        <label className="form-label">Passo a passo para reprodução</label>
        <div className="input-container">
          <input
            type="text"
            className="form-control"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Digite os passos para reproduzir o bug..."
          />
          {text && (
            <i 
              className="fas fa-times clear-field-icon"
              onClick={handleClear}
              title="Limpar campo"
            />
          )}
        </div>
      </div>
    </Card>
  );
};

export default BugReportCard; 