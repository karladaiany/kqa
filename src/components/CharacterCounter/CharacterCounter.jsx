import React, { useState, useCallback } from 'react';
import { useToast } from '../../context/ToastContext';
import './CharacterCounter.css';

export const CharacterCounter = () => {
  const { showToast } = useToast();
  const [text, setText] = useState('');

  const handleTextChange = useCallback((event) => {
    setText(event.target.value);
  }, []);

  const handleCopy = useCallback(() => {
    if (!text) {
      showToast('Digite algum texto primeiro!');
      return;
    }
    
    navigator.clipboard.writeText(text)
      .then(() => showToast('Copiado para a área de transferência!'))
      .catch(err => console.error('Erro ao copiar:', err));
  }, [text, showToast]);

  const handleClear = useCallback(() => {
    setText('');
    showToast('Texto limpo!');
  }, [showToast]);

  return (
    <div className="card" id="contador-caracteres">
      <div className="card-header">
        <h5><i className="fas fa-calculator"></i> Contador de Caracteres</h5>
      </div>
      <div className="card-body">
        <textarea
          className="form-control mb-3"
          value={text}
          onChange={handleTextChange}
          rows="4"
          placeholder="Digite ou cole seu texto aqui..."
        />
        <div className="d-flex justify-content-between align-items-center">
          <div className="text-muted">
            Caracteres: {text.length}
          </div>
          <div className="btn-group">
            <button 
              className="btn btn-outline-secondary"
              onClick={handleCopy}
              title="Copiar"
            >
              <i className="fas fa-copy"></i>
            </button>
            <button 
              className="btn btn-outline-secondary"
              onClick={handleClear}
              title="Limpar"
            >
              <i className="fas fa-eraser"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 