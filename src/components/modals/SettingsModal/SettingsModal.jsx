import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  FaTimes,
  FaEye,
  FaEyeSlash,
  FaCog,
  FaLink,
  FaSave,
  FaTrash,
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useSettings, AVAILABLE_FEATURES } from '../../../contexts/SettingsContext';
import './SettingsModal.css';

// Mapeamento de funcionalidades para nomes e ícones
const FEATURE_CONFIG = {
  [AVAILABLE_FEATURES.DOCUMENTOS]: {
    name: 'Documentos',
    icon: '📄',
  },
  [AVAILABLE_FEATURES.DADOS_PESSOAIS]: {
    name: 'Dados Pessoais',
    icon: '👤',
  },
  [AVAILABLE_FEATURES.PRODUTO]: {
    name: 'Produtos',
    icon: '🎓',
  },
  [AVAILABLE_FEATURES.CARTAO]: {
    name: 'Cartão',
    icon: '💳',
  },
  [AVAILABLE_FEATURES.CARACTERES]: {
    name: 'Gerador de Caracteres',
    icon: '🔤',
  },
  [AVAILABLE_FEATURES.CONTADOR]: {
    name: 'Contador de Caracteres',
    icon: '🔢',
  },
  [AVAILABLE_FEATURES.DADOS_COMPLEMENTARES]: {
    name: 'Dados Complementares',
    icon: '💼',
  },
  [AVAILABLE_FEATURES.FILE_GENERATOR]: {
    name: 'Geração de Arquivo',
    icon: '📁',
  },
  [AVAILABLE_FEATURES.BUG]: {
    name: 'Registro de BUG',
    icon: '🐛',
  },
  [AVAILABLE_FEATURES.TEST_STATUS]: {
    name: 'Comentário QA',
    icon: '💬',
  },
  [AVAILABLE_FEATURES.DEPLOY]: {
    name: 'Deploy',
    icon: '🚀',
  },
  [AVAILABLE_FEATURES.ACTIVITY_IMPORT]: {
    name: 'Importar Atividades',
    icon: '📥',
  },
  [AVAILABLE_FEATURES.QUICK_ANNOTATIONS]: {
    name: 'Anotações rápidas',
    icon: '⚡',
  },
  [AVAILABLE_FEATURES.CUSTOM_ANNOTATIONS]: {
    name: 'Anotações personalizadas',
    icon: '📝',
  },
  [AVAILABLE_FEATURES.MY_ENVIRONMENTS]: {
    name: 'Meus ambientes',
    icon: '🌐',
  },
};

const SettingsModal = ({ isOpen, onClose }) => {
  const {
    artiaCredentials,
    settings,
    saveArtiaCredentials,
    clearArtiaCredentials,
    toggleFeature,
    hasArtiaCredentials,
  } = useSettings();

  // Inicializar credenciais uma única vez baseado nas credenciais atuais
  const [credentials, setCredentials] = useState(() => ({
    login: artiaCredentials.login || '',
    senha: artiaCredentials.senha || '',
  }));

  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveCredentials = async () => {
    if (!credentials.login || !credentials.senha) {
      toast.error('Login e senha são obrigatórios');
      return;
    }

    setIsSaving(true);
    try {
      await saveArtiaCredentials(credentials);
      toast.success('Credenciais salvas com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar credenciais');
      console.error('Erro ao salvar credenciais:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClearCredentials = () => {
    if (
      window.confirm('Tem certeza que deseja limpar as credenciais do Artia?')
    ) {
      clearArtiaCredentials();
      setCredentials({ login: '', senha: '' });
      toast.success('Credenciais removidas');
    }
  };

  const handleToggleFeature = featureId => {
    toggleFeature(featureId);
    const featureName = FEATURE_CONFIG[featureId]?.name || featureId;
    const isVisible = settings.features[featureId];

    toast.success(
      `${featureName} ${isVisible ? 'ocultado' : 'exibido'} com sucesso!`
    );
  };

  if (!isOpen) return null;

  return (
    <div className='modal-overlay' onClick={onClose}>
      <div className='modal-container' onClick={e => e.stopPropagation()}>
        <div className='modal-header'>
          <h2>
            <FaCog className='modal-icon' />
            Configurações
          </h2>
          <button
            className='modal-close-button'
            onClick={onClose}
            title='Fechar configurações'
          >
            <FaTimes />
          </button>
        </div>

        <div className='modal-body'>
          {/* Seção: Integração com Artia */}
          <div className='settings-section'>
            <div className='section-divider'>
              <FaLink />
              Integração com Artia
            </div>

            <div className='credentials-info'>
              <p className='credentials-status'>
                Status:{' '}
                {hasArtiaCredentials() ? (
                  <span className='status-ok'>✓ Configurado</span>
                ) : (
                  <span className='status-error'>✗ Não configurado</span>
                )}
              </p>
              <p className='credentials-description'>
                Configure suas credenciais do Artia para criar atividades de
                Bug, Deploy e importar atividades.
              </p>
            </div>

            <div className='modal-field-group'>
              <label htmlFor='artia-login'>
                Login <span className='modal-required'>*</span>
              </label>
              <div className='modal-input-container'>
                <input
                  id='artia-login'
                  type='email'
                  value={credentials.login}
                  onChange={e =>
                    setCredentials(prev => ({
                      ...prev,
                      login: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className='modal-field-group'>
              <label htmlFor='artia-senha'>
                Senha <span className='modal-required'>*</span>
              </label>
              <div className='modal-input-container'>
                <input
                  id='artia-senha'
                  type={showPassword ? 'text' : 'password'}
                  value={credentials.senha}
                  onChange={e =>
                    setCredentials(prev => ({
                      ...prev,
                      senha: e.target.value,
                    }))
                  }
                />
                <button
                  type='button'
                  className='modal-toggle-password'
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className='credentials-actions'>
              <button
                className='modal-action-button primary'
                onClick={handleSaveCredentials}
                disabled={isSaving || !credentials.login || !credentials.senha}
              >
                {isSaving ? (
                  <>
                    <div className='modal-spinner' />
                    Salvando...
                  </>
                ) : (
                  <>
                    <FaSave />
                    Salvar Credenciais
                  </>
                )}
              </button>

              {hasArtiaCredentials() && (
                <button
                  className='modal-action-button warning'
                  onClick={handleClearCredentials}
                  title='Remover credenciais salvas'
                >
                  <FaTrash />
                  Limpar Credenciais
                </button>
              )}
            </div>
          </div>

          {/* Seção: Funcionalidades */}
          <div className='settings-section'>
            <div className='section-divider'>
              <FaCog />
              Funcionalidades
            </div>

            <div className='features-info'>
              <p className='features-description'>
                Controle quais funcionalidades estarão visíveis na aplicação.
              </p>
            </div>

            <div className='features-grid'>
              {Object.entries(FEATURE_CONFIG).map(([featureId, config]) => (
                <div
                  key={featureId}
                  className={`feature-item ${settings.features[featureId] ? 'visible' : 'hidden'}`}
                >
                  <div className='feature-info'>
                    <span className='feature-icon'>{config.icon}</span>
                    <span className='feature-name'>{config.name}</span>
                  </div>

                  <div className='feature-status'>
                    <div 
                      className={`status-circle ${settings.features[featureId] ? 'active' : 'inactive'}`}
                      onClick={() => handleToggleFeature(featureId)}
                      title={`${settings.features[featureId] ? 'Ocultar' : 'Mostrar'} ${config.name}`}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleToggleFeature(featureId);
                        }
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className='modal-footer'>
          <button className='modal-action-button secondary' onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

SettingsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default SettingsModal;
