import React, { useState, useCallback } from 'react';
import { useToast } from '../../context/ToastContext';
import { faker } from '@faker-js/faker/locale/pt_BR';
import './CharCounter.css';

export const CharCounter = () => {
  const { showToast } = useToast();
  const [charCount, setCharCount] = useState('');
  const [generatedText, setGeneratedText] = useState('');

  const generateChars = useCallback(() => {
    if (!charCount) return;
    const count = parseInt(charCount);
    if (isNaN(count) || count <= 0) return;

    // Palavras para geração aleatória
    const words = [
      'teste', 'qualidade', 'software', 'automação', 'desenvolvimento',
      'sistema', 'projeto', 'análise', 'dados', 'validação',
      'verificação', 'execução', 'cenário', 'caso', 'evidência',
      'bug', 'defeito', 'melhoria', 'sprint', 'release'
    ];

    let result = '';
    while (result.length < count) {
      const word = faker.helpers.arrayElement(words);
      if (result.length === 0) {
        result = word;
      } else {
        result += ' ' + word;
      }
    }

    // Ajusta o tamanho exato
    result = result.slice(0, count);
    setGeneratedText(result);
  }, [charCount]);

  const handleCopy = useCallback(() => {
    if (!generatedText) return;
    navigator.clipboard.writeText(generatedText)
      .then(() => showToast('Copiado para a área de transferência!'))
      .catch(err => console.error('Erro ao copiar:', err));
  }, [generatedText, showToast]);

  const clearAll = useCallback(() => {
    setCharCount('');
    setGeneratedText('');
  }, []);

  const clearCharCount = useCallback((e) => {
    e.stopPropagation();
    setCharCount('');
  }, []);

  return (
    <div className="card">
      <div className="card-header">
        <h5><i className="fas fa-font"></i> Gerador de Caracteres</h5>
      </div>
      <div className="card-body">
        <div className="form-group">
          <input
            type="number"
            className="form-control char-input"
            value={charCount}
            onChange={(e) => setCharCount(e.target.value)}
            placeholder=" "
            onWheel={(e) => e.target.blur()}
            style={{ appearance: 'textfield' }}
          />
          <label className="form-label">Caracteres</label>
          {charCount && (
            <>
              <i
                className="fas fa-sync-alt regenerate-icon"
                onClick={generateChars}
                title="Gerar caracteres"
              />
              <i
                className="fas fa-times clear-field-icon"
                onClick={clearCharCount}
                title="Limpar campo"
              />
            </>
          )}
        </div>

        <div className="form-group">
          <textarea
            className="form-control"
            value={generatedText}
            readOnly
            rows="3"
            placeholder="Caracteres gerados aparecerão aqui"
          />
          {generatedText && (
            <div className="form-actions">
              <button 
                className="btn btn-primary btn-sm"
                onClick={handleCopy}
              >
                <i className="fas fa-copy"></i>
                Copiar
              </button>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={clearAll}
              >
                <i className="fas fa-broom"></i>
                Limpar tudo
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 