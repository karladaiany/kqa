import React from 'react';
import { FaComment, FaCamera, FaPaperclip, FaTimes, FaCopy, FaBroom } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useTestStatus } from '../../hooks/useTestStatus';

const TestStatusCard = () => {
  const {
    testStatus,
    environment,
    formData,
    handleStatusChange,
    handleEnvironmentChange,
    handleInputChange,
    handleClearField,
    handleToggleAttachment,
    handleClear
  } = useTestStatus();

  const testStatusOptions = [
    { value: 'waiting', label: '‼️   Aguardando' },
    { value: 'blocked', label: '🚫   Bloqueado' },
    { value: 'cancelled', label: '🗑️   Cancelado' },
    { value: 'passed', label: '✅   Passou' },
    { value: 'failed', label: '❌   Reprovado' },
    { value: 'returned', label: '↩️   Retornado' }
  ];

  const environmentOptions = [
    { value: 'alpha', label: '🔮   Alpha' },
    { value: 'prod', label: '⚙️   Produção' },
    { value: 'stage', label: '🧪   Stage' }
  ];

  const handleCopy = () => {
    if (!testStatus) {
      toast.warning('Selecione um status primeiro!');
      return;
    }

    const selectedStatusOption = testStatusOptions.find(option => option.value === testStatus);
    const selectedEnvironmentOption = environmentOptions.find(option => option.value === environment);

    // Remove espaços extras do label
    const formatLabel = (label) => {
      return label.replace(/\s+/g, ' ').trim();
    };

    let template = '⇝ QA ⇜\n\n';

    // Status do Teste
    template += ':: Teste ::\n';
    template += `${formatLabel(selectedStatusOption.label)}\n\n`;

    // Ambiente (se selecionado)
    if (environment && ['passed', 'failed', 'blocked', 'returned'].includes(testStatus)) {
      template += ':: Ambiente ::\n';
      template += `${formatLabel(selectedEnvironmentOption.label)}\n\n`;
    }

    // Validação
    if (['passed', 'returned'].includes(testStatus) && formData.validation) {
      template += ':: Validação ::\n';
      template += `${formData.validation}\n\n`;
    }

    // Observação
    if (formData.observation) {
      template += ':: Obs ::\n';
      template += `${formData.observation}\n\n`;
    }

    // Aguardando
    if (testStatus === 'waiting' && formData.waiting) {
      template += ':: Aguardando ::\n';
      template += `${formData.waiting}\n\n`;
    }

    // Motivo do bloqueio
    if (testStatus === 'blocked' && formData.blockReason) {
      template += ':: Motivo do bloqueio ::\n';
      template += `${formData.blockReason}\n\n`;
    }

    // Informações
    if (testStatus === 'returned' && formData.information) {
      template += ':: Informações ::\n';
      template += `${formData.information}\n\n`;
    }

    // Motivo do retorno
    if (testStatus === 'returned' && formData.returnReason) {
      template += ':: Motivo retorno ::\n';
      template += `${formData.returnReason}\n\n`;
    }

    // Evidências
    if (formData.evidenceDescription || formData.evidenceLink || formData.hasAttachment) {
      template += ':: Evidência(s) ::\n';
      
      if (formData.evidenceDescription) {
        template += `${formData.evidenceDescription}\n`;
      }
      
      if (formData.evidenceLink) {
        template += `Evidência no link: ${formData.evidenceLink}\n`;
      }
      
      if (formData.hasAttachment) {
        template += '📎 Evidência em anexo na atividade\n';
      }
    }

    navigator.clipboard.writeText(template.trim());
    toast.success('Comentário copiado!');
  };

  const renderEnvironmentField = () => {
    if (!['passed', 'failed', 'blocked', 'returned'].includes(testStatus)) return null;

    return (
      <div className="campo-item">
        <label htmlFor="environment">Ambiente</label>
        <div className="campo-valor">
          <select
            id="environment"
            value={environment}
            onChange={handleEnvironmentChange}
            className="copyable"
          >
            <option value="">Selecione um ambiente</option>
            {environmentOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  };

  const renderConditionalFields = () => {
    switch (testStatus) {
      case 'waiting':
        return (
          <>
            <div className="campo-item">
              <label htmlFor="observation">Observação</label>
              <div className="campo-valor textarea-container" style={{ position: 'relative' }}>
                <textarea
                  id="observation"
                  value={formData.observation}
                  onChange={handleInputChange('observation')}
                  placeholder="Digite sua observação"
                />
                {formData.observation && (
                  <FaTimes
                    className="clear-icon"
                    onClick={() => handleClearField('observation')}
                    style={{
                      position: 'absolute',
                      right: '8px',
                      top: '8px',
                      cursor: 'pointer'
                    }}
                  />
                )}
              </div>
            </div>
            <div className="campo-item">
              <label htmlFor="waiting">Aguardando</label>
              <div className="campo-valor textarea-container" style={{ position: 'relative' }}>
                <textarea
                  id="waiting"
                  value={formData.waiting}
                  onChange={handleInputChange('waiting')}
                  placeholder="Digite o que está aguardando"
                />
                {formData.waiting && (
                  <FaTimes
                    className="clear-icon"
                    onClick={() => handleClearField('waiting')}
                    style={{
                      position: 'absolute',
                      right: '8px',
                      top: '8px',
                      cursor: 'pointer'
                    }}
                  />
                )}
              </div>
            </div>
          </>
        );

      case 'blocked':
        return (
          <>
            {renderEnvironmentField()}
            <div className="campo-item">
              <label htmlFor="observation">Observação</label>
              <div className="campo-valor textarea-container" style={{ position: 'relative' }}>
                <textarea
                  id="observation"
                  value={formData.observation}
                  onChange={handleInputChange('observation')}
                  placeholder="Digite sua observação"
                />
                {formData.observation && (
                  <FaTimes
                    className="clear-icon"
                    onClick={() => handleClearField('observation')}
                    style={{
                      position: 'absolute',
                      right: '8px',
                      top: '8px',
                      cursor: 'pointer'
                    }}
                  />
                )}
              </div>
            </div>
            <div className="campo-item">
              <label htmlFor="blockReason">Motivo do bloqueio</label>
              <div className="campo-valor textarea-container" style={{ position: 'relative' }}>
                <textarea
                  id="blockReason"
                  value={formData.blockReason}
                  onChange={handleInputChange('blockReason')}
                  placeholder="Digite o motivo do bloqueio"
                />
                {formData.blockReason && (
                  <FaTimes
                    className="clear-icon"
                    onClick={() => handleClearField('blockReason')}
                    style={{
                      position: 'absolute',
                      right: '8px',
                      top: '8px',
                      cursor: 'pointer'
                    }}
                  />
                )}
              </div>
            </div>
          </>
        );

      case 'cancelled':
        return (
          <div className="campo-item">
            <label htmlFor="observation">Observação</label>
            <div className="campo-valor textarea-container" style={{ position: 'relative' }}>
              <textarea
                id="observation"
                value={formData.observation}
                onChange={handleInputChange('observation')}
                placeholder="Digite sua observação"
              />
              {formData.observation && (
                <FaTimes
                  className="clear-icon"
                  onClick={() => handleClearField('observation')}
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '8px',
                    cursor: 'pointer'
                  }}
                />
              )}
            </div>
          </div>
        );

      case 'passed':
        return (
          <>
            {renderEnvironmentField()}
            <div className="campo-item">
              <label htmlFor="validation">Validação</label>
              <div className="campo-valor textarea-container" style={{ position: 'relative' }}>
                <textarea
                  id="validation"
                  value={formData.validation}
                  onChange={handleInputChange('validation')}
                  placeholder="Digite a validação realizada"
                />
                {formData.validation && (
                  <FaTimes
                    className="clear-icon"
                    onClick={() => handleClearField('validation')}
                    style={{
                      position: 'absolute',
                      right: '8px',
                      top: '8px',
                      cursor: 'pointer'
                    }}
                  />
                )}
              </div>
            </div>
            <div className="campo-item">
              <label htmlFor="observation">Observação</label>
              <div className="campo-valor textarea-container" style={{ position: 'relative' }}>
                <textarea
                  id="observation"
                  value={formData.observation}
                  onChange={handleInputChange('observation')}
                  placeholder="Digite sua observação"
                />
                {formData.observation && (
                  <FaTimes
                    className="clear-icon"
                    onClick={() => handleClearField('observation')}
                    style={{
                      position: 'absolute',
                      right: '8px',
                      top: '8px',
                      cursor: 'pointer'
                    }}
                  />
                )}
              </div>
            </div>
          </>
        );

      case 'failed':
        return (
          <>
            {renderEnvironmentField()}
            <div className="campo-item">
              <label htmlFor="observation">Observação</label>
              <div className="campo-valor textarea-container" style={{ position: 'relative' }}>
                <textarea
                  id="observation"
                  value={formData.observation}
                  onChange={handleInputChange('observation')}
                  placeholder="Digite sua observação"
                />
                {formData.observation && (
                  <FaTimes
                    className="clear-icon"
                    onClick={() => handleClearField('observation')}
                    style={{
                      position: 'absolute',
                      right: '8px',
                      top: '8px',
                      cursor: 'pointer'
                    }}
                  />
                )}
              </div>
            </div>
          </>
        );

      case 'returned':
        return (
          <>
            {renderEnvironmentField()}
            <div className="campo-item">
              <label htmlFor="validation">Validação</label>
              <div className="campo-valor textarea-container" style={{ position: 'relative' }}>
                <textarea
                  id="validation"
                  value={formData.validation}
                  onChange={handleInputChange('validation')}
                  placeholder="Digite a validação realizada"
                />
                {formData.validation && (
                  <FaTimes
                    className="clear-icon"
                    onClick={() => handleClearField('validation')}
                    style={{
                      position: 'absolute',
                      right: '8px',
                      top: '8px',
                      cursor: 'pointer'
                    }}
                  />
                )}
              </div>
            </div>
            <div className="campo-item">
              <label htmlFor="observation">Observação</label>
              <div className="campo-valor textarea-container" style={{ position: 'relative' }}>
                <textarea
                  id="observation"
                  value={formData.observation}
                  onChange={handleInputChange('observation')}
                  placeholder="Digite sua observação"
                />
                {formData.observation && (
                  <FaTimes
                    className="clear-icon"
                    onClick={() => handleClearField('observation')}
                    style={{
                      position: 'absolute',
                      right: '8px',
                      top: '8px',
                      cursor: 'pointer'
                    }}
                  />
                )}
              </div>
            </div>
            <div className="campo-item">
              <label htmlFor="information">Informações</label>
              <div className="campo-valor textarea-container" style={{ position: 'relative' }}>
                <textarea
                  id="information"
                  value={formData.information}
                  onChange={handleInputChange('information')}
                  placeholder="Digite as informações adicionais"
                />
                {formData.information && (
                  <FaTimes
                    className="clear-icon"
                    onClick={() => handleClearField('information')}
                    style={{
                      position: 'absolute',
                      right: '8px',
                      top: '8px',
                      cursor: 'pointer'
                    }}
                  />
                )}
              </div>
            </div>
            <div className="campo-item">
              <label htmlFor="returnReason">Motivo do retorno</label>
              <div className="campo-valor textarea-container" style={{ position: 'relative' }}>
                <textarea
                  id="returnReason"
                  value={formData.returnReason}
                  onChange={handleInputChange('returnReason')}
                  placeholder="Digite o motivo do retorno"
                />
                {formData.returnReason && (
                  <FaTimes
                    className="clear-icon"
                    onClick={() => handleClearField('returnReason')}
                    style={{
                      position: 'absolute',
                      right: '8px',
                      top: '8px',
                      cursor: 'pointer'
                    }}
                  />
                )}
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  const renderEvidenceSection = () => {
    if (!testStatus) return null;

    return (
      <>
        <div className="section-divider">
          <FaCamera /> Evidências
        </div>

        <div className="campo-item">
          <label htmlFor="evidenceDescription">Descrição da evidência</label>
          <div className="campo-valor textarea-container" style={{ position: 'relative' }}>
            <textarea
              id="evidenceDescription"
              value={formData.evidenceDescription}
              onChange={handleInputChange('evidenceDescription')}
              placeholder="Digite a descrição da evidência"
            />
            {formData.evidenceDescription && (
              <FaTimes
                className="clear-icon"
                onClick={() => handleClearField('evidenceDescription')}
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '8px',
                  cursor: 'pointer'
                }}
              />
            )}
          </div>
        </div>

        <div className="campo-item">
          <label htmlFor="evidenceLink">Link da evidência</label>
          <div className="campo-valor" style={{ position: 'relative', border: 'none', background: 'none', padding: 0 }}>
            <input
              type="text"
              id="evidenceLink"
              value={formData.evidenceLink}
              onChange={handleInputChange('evidenceLink')}
              className="copyable"
              placeholder="Cole o link da evidência"
              style={{ 
                width: '100%', 
                height: '36px',
                paddingRight: formData.evidenceLink ? '30px' : '12px',
                paddingLeft: '12px',
                border: '1px solid var(--border-color)',
                borderRadius: '4px',
                backgroundColor: 'var(--card-bg)',
                color: 'var(--text-primary)',
                fontSize: '0.9rem'
              }}
            />
            {formData.evidenceLink && (
              <FaTimes
                className="clear-icon"
                onClick={() => handleClearField('evidenceLink')}
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  cursor: 'pointer'
                }}
              />
            )}
          </div>
        </div>

        <div className="campo-item">
          <div 
            className={`attachment-toggle ${formData.hasAttachment ? 'active' : ''}`}
            onClick={handleToggleAttachment}
          >
            <FaPaperclip /> Evidência em anexo na atividade
          </div>
        </div>
      </>
    );
  };

  return (
    <section className="card" id="test-status">
      <div className="card-header">
        <h2><FaComment className="header-icon" /> Comentário QA</h2>
      </div>
      
      <div className="card-content">
        <div className="campo-item">
          <label htmlFor="testStatus">Status do Teste</label>
          <div className="campo-valor">
            <select
              id="testStatus"
              value={testStatus}
              onChange={handleStatusChange}
              className="copyable"
            >
              <option value="">Selecione um status</option>
              {testStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {renderConditionalFields()}
        {renderEvidenceSection()}

        <div className="card-actions">
          <button 
            className="action-button" 
            onClick={handleCopy}
            disabled={!testStatus}
          >
            <FaCopy /> Copiar
          </button>
          <button 
            className="action-button clear" 
            onClick={handleClear}
            disabled={!testStatus}
          >
            <FaBroom /> Limpar tudo
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestStatusCard; 