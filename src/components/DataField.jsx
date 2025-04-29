import React from 'react';
import PropTypes from 'prop-types';
import { FaCopy, FaSync } from 'react-icons/fa';
import { toast } from 'react-toastify';

const DataField = ({ label, value, rawValue, onRegenerate, testId, isTextArea }) => {
  const fieldId = testId || `field-${label.toLowerCase().replace(/\s+/g, '-')}`;
  
  const handleCopy = () => {
    const textToCopy = rawValue || value;
    navigator.clipboard.writeText(textToCopy)
      .then(() => toast.success('Copiado para a área de transferência!'))
      .catch(() => toast.error('Erro ao copiar para a área de transferência'));
  };

  return (
    <div className="campo-item" data-testid={fieldId}>
      <label htmlFor={`${fieldId}-value`}>{label}:</label>
      <div className={`campo-valor ${isTextArea ? 'textarea-container' : ''}`}>
        {isTextArea ? (
          <textarea
            id={`${fieldId}-value`}
            value={value}
            readOnly
            placeholder="Cole seu texto aqui..."
          />
        ) : (
          <span 
            id={`${fieldId}-value`}
            className="copyable"
            onClick={handleCopy}
            title="Clique para copiar"
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && handleCopy()}
          >
            {value}
          </span>
        )}
        <button
          type="button"
          className="icon-button"
          onClick={handleCopy}
          aria-label="Copiar valor"
        >
          <FaCopy className="copy-icon" />
        </button>
        {onRegenerate && (
          <button
            type="button"
            className="icon-button regenerate"
            onClick={onRegenerate}
            aria-label="Gerar novo valor"
          >
            <FaSync className="regenerate-icon" />
          </button>
        )}
      </div>
    </div>
  );
};

DataField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  rawValue: PropTypes.string,
  onRegenerate: PropTypes.func,
  testId: PropTypes.string,
  isTextArea: PropTypes.bool,
};

DataField.defaultProps = {
  rawValue: '',
  onRegenerate: null,
  testId: '',
  isTextArea: false,
};

export default DataField; 