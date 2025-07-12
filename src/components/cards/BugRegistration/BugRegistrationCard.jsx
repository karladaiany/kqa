import React, { useState, useMemo, useEffect } from 'react';
import {
  FaBug,
  FaInfoCircle,
  FaCamera,
  FaPaperclip,
  FaTimes,
  FaCopy,
  FaBroom,
  FaEye,
  FaRocket,
  FaCheck,
  FaExclamationTriangle,
} from 'react-icons/fa';
import { useBugRegistration } from '../../../hooks/useBugRegistration';
import useTextareaResizeActions from '../../../hooks/useTextareaResizeActions';
import ArtiaActivityModal from '../../modals/ArtiaActivityModal/ArtiaActivityModal';

const hasAnyData = bugData => {
  return Object.keys(bugData).some(key => {
    if (key === 'hasAttachment') return bugData[key];
    return !!bugData[key];
  });
};

// Função para extrair ID do ambiente de links do Twygo
const extractEnvIdFromTwygoLink = url => {
  if (!url || typeof url !== 'string') {
    return { envId: '', isValid: false };
  }

  try {
    // Regex para capturar ID do ambiente após '/o/'
    const envMatch = url.match(/\/o\/(\d+)/);
    const envId = envMatch ? envMatch[1] : '';
    const isValid = !!(envId && url.includes('twygoead.com'));

    return { envId, isValid };
  } catch (error) {
    return { envId: '', isValid: false };
  }
};

// Função para validar se é um link válido do Twygo
const validateTwygoLink = url => {
  if (!url) return { isValid: true, message: '', showHint: false }; // URL vazio é válido (opcional)

  try {
    new URL(url); // Verifica se é uma URL válida

    // Verificar se contém domínio do Twygo
    if (!url.includes('twygoead.com')) {
      return {
        isValid: true, // URL válida, mas não do Twygo (não mostra erro)
        message: '',
        showHint: false,
      };
    }

    // Se é do Twygo mas não tem /o/, ainda é válido (pode ser página de login, home, etc.)
    if (!url.includes('/o/')) {
      return {
        isValid: true,
        message: '',
        showHint: false, // Não é erro, apenas não tem ID para extrair
      };
    }

    // Se tem /o/, tenta extrair o ID
    const { envId } = extractEnvIdFromTwygoLink(url);
    if (!envId) {
      return {
        isValid: true, // Não é erro, apenas não conseguiu extrair
        message: '',
        showHint: false,
      };
    }

    return { isValid: true, message: '', showHint: true };
  } catch {
    return {
      isValid: false,
      message: 'URL inválida',
      showHint: false,
    };
  }
};

const BugRegistrationCard = () => {
  const {
    bugData,
    showPassword,
    setShowPassword,
    handleInputChange,
    handleClearField,
    handleToggleAttachment,
    handleCopyAll,
  } = useBugRegistration();

  const { clearCardTextareaSizes } = useTextareaResizeActions();

  // Estado para controlar expansão dos campos
  const [expanded, setExpanded] = useState(false);

  // Estado para controlar o modal do Artia
  const [showArtiaModal, setShowArtiaModal] = useState(false);

  // Estados para validação e feedback do URL do Twygo
  const [urlValidation, setUrlValidation] = useState({
    isValid: true,
    message: '',
    showHint: false,
  });
  const [envIdExtracted, setEnvIdExtracted] = useState(false);

  // Sempre que limpar tudo, fecha os campos e limpa os tamanhos dos textareas
  const handleClearAll = () => {
    handleClearField('all');
    setExpanded(false);
    // Limpar tamanhos dos textareas do localStorage
    clearCardTextareaSizes('bug');
  };

  // Processar URL do Twygo quando alterada
  useEffect(() => {
    const url = bugData.url?.trim();

    if (!url) {
      setUrlValidation({ isValid: true, message: '', showHint: false });
      setEnvIdExtracted(false);
      return;
    }

    // Validar formato da URL
    const validation = validateTwygoLink(url);
    setUrlValidation(validation);

    if (validation.isValid && validation.showHint) {
      // Extrair ID do ambiente do link do Twygo
      const { envId, isValid } = extractEnvIdFromTwygoLink(url);

      if (isValid && envId) {
        // Atualizar campo apenas se estiver vazio ou se o valor for diferente
        const shouldUpdateEnvId = !bugData.envId || bugData.envId !== envId;

        if (shouldUpdateEnvId) {
          setEnvIdExtracted(true);
          // Mostrar feedback positivo temporário
          setTimeout(() => setEnvIdExtracted(false), 3000);

          // Usar handleInputChange para manter a consistência com o hook
          handleInputChange('envId', envId);
        }
      }
    } else {
      setEnvIdExtracted(false);
    }
  }, [bugData.url, bugData.envId, handleInputChange]);

  // Exibe campos se houver dados ou se estiver expandido
  const showFields = useMemo(
    () => expanded || hasAnyData(bugData),
    [expanded, bugData]
  );

  return (
    <section className='card' id='bug'>
      <div className='card-header'>
        <h2>
          <FaBug className='header-icon' /> Registro de BUG
        </h2>
        {!showFields && (
          <button
            className='generate-all-btn'
            onClick={() => setExpanded(true)}
            title='Novo registro de BUG'
          >
            +
          </button>
        )}
      </div>
      {showFields && (
        <div className='card-content'>
          <div className='campo-item'>
            <label htmlFor='field-incident'>Descrição do BUG</label>
            <div className='campo-valor'>
              <textarea
                id='field-incident'
                value={bugData.incident}
                onChange={e => handleInputChange('incident', e.target.value)}
                className='copyable'
              />
              {bugData.incident && (
                <FaTimes
                  className='clear-icon'
                  onClick={() => handleClearField('incident')}
                />
              )}
            </div>
          </div>

          <div className='campo-item'>
            <div className='campo-valor'>
              <textarea
                value={bugData.steps}
                onChange={e => handleInputChange('steps', e.target.value)}
                className='copyable'
                placeholder=' '
              />
              <label>Passo a passo para reprodução</label>
              {bugData.steps && (
                <FaTimes
                  className='clear-icon'
                  onClick={() => handleClearField('steps')}
                />
              )}
            </div>
          </div>

          <div className='campo-item'>
            <div className='campo-valor'>
              <textarea
                value={bugData.expectedBehavior}
                onChange={e =>
                  handleInputChange('expectedBehavior', e.target.value)
                }
                className='copyable'
                placeholder=' '
              />
              <label>Comportamento esperado</label>
              {bugData.expectedBehavior && (
                <FaTimes
                  className='clear-icon'
                  onClick={() => handleClearField('expectedBehavior')}
                />
              )}
            </div>
          </div>

          <div className='section-divider'>
            <FaInfoCircle /> Informações
          </div>

          <div className='campo-item'>
            <div
              className={`campo-valor ${!urlValidation.isValid ? 'url-error' : envIdExtracted ? 'url-success' : ''}`}
            >
              <input
                type='url'
                value={bugData.url}
                onChange={e => handleInputChange('url', e.target.value)}
                className='copyable'
                placeholder=' '
              />
              <label>
                URL
                {envIdExtracted && (
                  <span className='url-success-indicator'>
                    <FaCheck /> ID do ambiente extraído automaticamente
                  </span>
                )}
              </label>
              {bugData.url && (
                <FaTimes
                  className='clear-icon'
                  onClick={() => handleClearField('url')}
                />
              )}
              {!urlValidation.isValid && (
                <div className='url-error-message'>
                  <FaExclamationTriangle />
                  {urlValidation.message}
                </div>
              )}
            </div>
          </div>

          <div className='campo-item'>
            <div className='campo-valor'>
              <input
                type='text'
                value={bugData.login}
                onChange={e => handleInputChange('login', e.target.value)}
                className='copyable'
                placeholder=' '
              />
              <label>Login</label>
              {bugData.login && (
                <FaTimes
                  className='clear-icon'
                  onClick={() => handleClearField('login')}
                />
              )}
            </div>
          </div>

          <div className='campo-item'>
            <div className='campo-valor'>
              <input
                type={showPassword ? 'text' : 'password'}
                value={bugData.password}
                onChange={e => handleInputChange('password', e.target.value)}
                className='copyable'
                placeholder=' '
              />
              <label>Senha</label>
              <FaEye
                className='toggle-password'
                onClick={() => setShowPassword(!showPassword)}
              />
              {bugData.password && (
                <FaTimes
                  className='clear-icon'
                  onClick={() => handleClearField('password')}
                />
              )}
            </div>
          </div>

          <div className='campo-item'>
            <div className='campo-valor'>
              <input
                type='number'
                value={bugData.envId}
                onChange={e => handleInputChange('envId', e.target.value)}
                className='copyable'
                placeholder=' '
              />
              <label>ID do ambiente</label>
              {bugData.envId && (
                <FaTimes
                  className='clear-icon'
                  onClick={() => handleClearField('envId')}
                />
              )}
            </div>
          </div>

          <div className='campo-item'>
            <div className='campo-valor'>
              <textarea
                value={bugData.others}
                onChange={e => handleInputChange('others', e.target.value)}
                className='copyable'
                placeholder=' '
              />
              <label>Outros</label>
              {bugData.others && (
                <FaTimes
                  className='clear-icon'
                  onClick={() => handleClearField('others')}
                />
              )}
            </div>
          </div>

          <div className='section-divider'>
            <FaCamera /> Evidências
          </div>

          <div className='campo-item'>
            <div className='campo-valor'>
              <textarea
                value={bugData.evidenceDescription}
                onChange={e =>
                  handleInputChange('evidenceDescription', e.target.value)
                }
                className='copyable'
                placeholder=' '
              />
              <label>Descrição da evidência</label>
              {bugData.evidenceDescription && (
                <FaTimes
                  className='clear-icon'
                  onClick={() => handleClearField('evidenceDescription')}
                />
              )}
            </div>
          </div>

          <div className='campo-item'>
            <div className='campo-valor'>
              <input
                type='text'
                value={bugData.evidenceLink}
                onChange={e =>
                  handleInputChange('evidenceLink', e.target.value)
                }
                className='copyable'
                placeholder='https://jam.dev/'
              />
              <label>Link da evidência</label>
              {bugData.evidenceLink && (
                <FaTimes
                  className='clear-icon'
                  onClick={() => handleClearField('evidenceLink')}
                />
              )}
            </div>
          </div>

          <div className='campo-item'>
            <div
              className={`attachment-toggle ${
                bugData.hasAttachment ? 'active' : ''
              }`}
              onClick={handleToggleAttachment}
            >
              <FaPaperclip /> Evidência em anexo na atividade
            </div>
          </div>

          <div className='card-actions'>
            <button
              className='generate-all-btn'
              onClick={handleCopyAll}
              title='Copiar'
            >
              <FaCopy /> Copiar
            </button>
            <button
              className='generate-all-btn'
              onClick={() => setShowArtiaModal(true)}
              title='Criar atividade no Artia'
            >
              <FaRocket /> Criar atividade
            </button>
            <button className='generate-all-btn' onClick={handleClearAll}>
              <FaBroom /> Limpar tudo
            </button>
          </div>
        </div>
      )}

      <ArtiaActivityModal
        isOpen={showArtiaModal}
        onClose={() => setShowArtiaModal(false)}
        activityType='bug'
        initialData={{
          titulo: bugData.incident
            ? `BUG: ${bugData.incident.substring(0, 50)}${bugData.incident.length > 50 ? '...' : ''}`
            : '',
        }}
      />
    </section>
  );
};

export default BugRegistrationCard;
