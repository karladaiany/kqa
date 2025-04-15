import React, { useState, useCallback } from 'react';
import { useToast } from '../../context/ToastContext';
import { faker } from '@faker-js/faker/locale/pt_BR';
import './CharCounter.css';

export const CharCounter = ({ title = "Gerador de Caracteres" }) => {
  const { showToast } = useToast();
  const [count, setCount] = useState(100);
  const [text, setText] = useState('');

  const generateText = useCallback(() => {
    const newText = count <= 0 ? '' : 
                   count <= 10 ? faker.lorem.word({ length: count }) :
                   count <= 50 ? faker.lorem.words({ min: 3, max: 7 }) :
                   count <= 200 ? faker.lorem.sentences({ min: 2, max: 4 }) :
                   faker.lorem.paragraphs(2);
                   
    setText(newText.slice(0, count));
  }, [count]);

  const handleCountChange = useCallback((event) => {
    const value = parseInt(event.target.value) || 0;
    setCount(Math.max(0, Math.min(1000, value)));
  }, []);

  const handleCopy = useCallback(() => {
    if (!text) {
      showToast('Gere um texto primeiro!');
      return;
    }
    
    navigator.clipboard.writeText(text)
      .then(() => showToast('Texto copiado para a área de transferência!'))
      .catch(err => console.error('Erro ao copiar:', err));
  }, [text, showToast]);

  const handleClear = useCallback(() => {
    setText('');
    showToast('Texto limpo!');
  }, [showToast]);

  return (
    <div className="card" id="gerador-caracteres">
      <div className="card-header">
        <h5><i className="fas fa-text-width"></i> {title}</h5>
      </div>
      <div className="card-body">
        <div className="input-group mb-3">
          <span className="input-group-text">Caracteres</span>
          <input 
            type="number" 
            className="form-control" 
            id="char-count" 
            value={count}
            onChange={handleCountChange}
            min="0"
            max="1000"
          />
          <button 
            className="btn btn-primary" 
            id="generate-text"
            onClick={generateText}
          >
            <i className="fas fa-sync-alt"></i>
          </button>
          <button 
            className="btn btn-outline-secondary" 
            id="copy-text"
            onClick={handleCopy}
            title="Copiar"
          >
            <i className="fas fa-copy"></i>
          </button>
          <button 
            className="btn btn-outline-secondary" 
            id="clear-text"
            onClick={handleClear}
            title="Limpar"
          >
            <i className="fas fa-eraser"></i>
          </button>
        </div>
        <textarea 
          id="generated-text" 
          className="form-control"
          value={text}
          readOnly
          rows="4"
          placeholder="O texto gerado aparecerá aqui..."
        />
        <div className="text-muted mt-2">
          Caracteres gerados: {text.length}
        </div>
      </div>
    </div>
  );
}; 