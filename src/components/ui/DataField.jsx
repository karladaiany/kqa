import React from 'react';
import PropTypes from 'prop-types';
import { FaCopy, FaSync, FaMask, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';

// Importações das constantes centralizadas
import { MENSAGENS } from '../../constants';
import { CONFIG_ACESSIBILIDADE } from '../../config/theme';

const DataField = ({
  label,
  value,
  raw = '',
  onRegenerate = null,
  testId = '',
  isTextArea = false,
  showMask = true,
  onToggleMask = null,
  onTextChange = null,
  onClear = null,
  showCopy = true,
}) => {
  const fieldId = testId || `field-${label.toLowerCase().replace(/\s+/g, '-')}`;
  const baseTestId = `data-field-${label.toLowerCase().replace(/\s+/g, '-')}`;

  const handleCopy = () => {
    const textToCopy = !showMask && raw ? raw : value;
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => toast.success(MENSAGENS.SUCESSO.COPIADO))
      .catch(() => toast.error(MENSAGENS.ERRO.COPIA_FALHOU));
  };

  return (
    <div className='campo-item' data-testid={`${baseTestId}-container`}>
      <label htmlFor={`${fieldId}-value`} data-testid={`${baseTestId}-label`}>
        {label}
      </label>
      <div
        className='campo-valor'
        data-testid={`${baseTestId}-value-container`}
      >
        {isTextArea ? (
          <textarea
            id={`${fieldId}-value`}
            value={value}
            onChange={onTextChange}
            className='copyable'
            data-testid={`${baseTestId}-textarea`}
          />
        ) : (
          <span
            id={`${fieldId}-value`}
            className='copyable'
            onClick={handleCopy}
            title={CONFIG_ACESSIBILIDADE.tooltips.clickToCopy}
            role='button'
            tabIndex={0}
            onKeyPress={e => e.key === 'Enter' && handleCopy()}
            data-testid={`${baseTestId}-value`}
          >
            {showMask ? value : raw || value}
          </span>
        )}
        {showCopy && (
          <button
            type='button'
            className='icon-button'
            onClick={handleCopy}
            aria-label={CONFIG_ACESSIBILIDADE.ariaLabels.copyValue}
            data-testid={`${baseTestId}-copy-btn`}
          >
            <FaCopy className='copy-icon' />
          </button>
        )}
        {onRegenerate && (
          <button
            type='button'
            className='icon-button regenerate'
            onClick={onRegenerate}
            aria-label={CONFIG_ACESSIBILIDADE.ariaLabels.regenerateValue}
            data-testid={`${baseTestId}-regenerate-btn`}
          >
            <FaSync className='regenerate-icon' />
          </button>
        )}
        {onToggleMask && (
          <button
            type='button'
            className='icon-button'
            onClick={onToggleMask}
            aria-label={CONFIG_ACESSIBILIDADE.ariaLabels.toggleMask}
            data-testid={`${baseTestId}-toggle-mask-btn`}
          >
            <FaMask className={`mask-icon ${showMask ? 'active' : ''}`} />
          </button>
        )}
        {onClear && value && (
          <button
            type='button'
            className='icon-button'
            onClick={onClear}
            aria-label={CONFIG_ACESSIBILIDADE.ariaLabels.clearField}
            data-testid={`${baseTestId}-clear-btn`}
          >
            <FaTimes className='clear-icon' />
          </button>
        )}
      </div>
    </div>
  );
};

DataField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  raw: PropTypes.string,
  onRegenerate: PropTypes.func,
  testId: PropTypes.string,
  isTextArea: PropTypes.bool,
  showMask: PropTypes.bool,
  onToggleMask: PropTypes.func,
  onTextChange: PropTypes.func,
  onClear: PropTypes.func,
  showCopy: PropTypes.bool,
};

export default DataField;
