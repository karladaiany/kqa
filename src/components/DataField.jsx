import React from 'react';
import { FaCopy, FaSync } from 'react-icons/fa';
import { toast } from 'react-toastify';

const DataField = ({ label, value, rawValue, onRegenerate }) => {
  const handleCopy = () => {
    const textToCopy = rawValue || value;
    navigator.clipboard.writeText(textToCopy)
      .then(() => toast.success('Copiado para a área de transferência!'))
      .catch(() => toast.error('Erro ao copiar para a área de transferência'));
  };

  return (
    <div className="campo-item" data-testid={`field-${label.toLowerCase().replace(/\s+/g, '-')}`}>
      <label>{label}:</label>
      <div className="campo-valor">
        <span 
          className="copyable"
          onClick={handleCopy}
          title="Clique para copiar"
        >
          {value}
        </span>
        <FaCopy 
          className="copy-icon" 
          title="Copiar"
          onClick={handleCopy}
        />
        {onRegenerate && (
          <FaSync 
            className="regenerate-icon" 
            title="Gerar novo"
            onClick={onRegenerate}
          />
        )}
      </div>
    </div>
  );
};

export default DataField; 