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
    <div className="card">
      <div className="card-header">
        <h5><i className="fas fa-text-width"></i> Contador de Caracteres</h5>
      </div>
      <div className="card-body">
        <div className="form-group">
          <textarea
            className="form-control"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Digite ou cole seu texto aqui"
            rows="3"
          />
        </div>

        {text && (
          <>
            <div className="char-count-info">
              Caracteres: {text.length}
            </div>
            <div className="form-actions">
              <button 
                className="btn btn-secondary btn-sm"
                onClick={handleClear}
              >
                <i className="fas fa-broom"></i>
                Limpar tudo
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}; 