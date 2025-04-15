import React, { useState, useCallback } from 'react';
import { useToast } from '../../context/ToastContext';
import './Documents.css';

export const Documents = () => {
  const { showToast } = useToast();
  const [useCPFMask, setUseCPFMask] = useState(true);
  const [useCNPJMask, setUseCNPJMask] = useState(true);

  // Funções auxiliares
  const generateRandomNumber = useCallback((min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }, []);

  const calculateCPFDigit = useCallback((numbers) => {
    let sum = 0;
    for (let i = 0; i < numbers.length; i++) {
      sum += numbers[i] * (numbers.length + 1 - i);
    }
    const digit = 11 - (sum % 11);
    return digit > 9 ? 0 : digit;
  }, []);

  // Gerador de CPF
  const generateCPF = useCallback(() => {
    const numbers = [];
    for (let i = 0; i < 9; i++) {
      numbers.push(generateRandomNumber(0, 9));
    }

    const digit1 = calculateCPFDigit(numbers);
    numbers.push(digit1);
    const digit2 = calculateCPFDigit(numbers);
    numbers.push(digit2);

    const cpf = numbers.join('');
    return useCPFMask ? 
      cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4') : 
      cpf;
  }, [generateRandomNumber, calculateCPFDigit, useCPFMask]);

  // Gerador de CNPJ
  const generateCNPJ = useCallback(() => {
    const numbers = [];
    for (let i = 0; i < 12; i++) {
      numbers.push(generateRandomNumber(0, 9));
    }

    let sum = 0;
    let pos = 5;
    for (let i = 0; i < 12; i++) {
      sum += numbers[i] * pos;
      pos = pos === 2 ? 9 : pos - 1;
    }

    let digit = 11 - (sum % 11);
    numbers.push(digit > 9 ? 0 : digit);

    sum = 0;
    pos = 6;
    for (let i = 0; i < 13; i++) {
      sum += numbers[i] * pos;
      pos = pos === 2 ? 9 : pos - 1;
    }

    digit = 11 - (sum % 11);
    numbers.push(digit > 9 ? 0 : digit);

    const cnpj = numbers.join('');
    return useCNPJMask ? 
      cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5') : 
      cnpj;
  }, [generateRandomNumber, useCNPJMask]);

  // Gerador de RG
  const generateRG = useCallback(() => {
    const numbers = [];
    for (let i = 0; i < 8; i++) {
      numbers.push(generateRandomNumber(0, 9));
    }

    let sum = 0;
    for (let i = 0; i < 8; i++) {
      sum += numbers[i] * (2 + i);
    }

    const digit = 11 - (sum % 11);
    numbers.push(digit === 11 ? 0 : digit);

    const rg = numbers.join('');
    return rg.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4');
  }, [generateRandomNumber]);

  // Estado dos documentos
  const [documents, setDocuments] = useState(() => ({
    cpf: generateCPF(),
    cnpj: generateCNPJ(),
    rg: generateRG()
  }));

  const handleCopy = useCallback((text) => {
    navigator.clipboard.writeText(text)
      .then(() => showToast('Copiado para a área de transferência!'))
      .catch(err => console.error('Erro ao copiar:', err));
  }, [showToast]);

  const regenerateDocument = useCallback((type) => {
    setDocuments(prev => ({
      ...prev,
      [type]: type === 'cpf' ? generateCPF() :
              type === 'cnpj' ? generateCNPJ() : generateRG()
    }));
  }, [generateCPF, generateCNPJ, generateRG]);

  const toggleMask = useCallback((type) => {
    if (type === 'cpf') {
      setUseCPFMask(prev => !prev);
      setDocuments(prev => ({ ...prev, cpf: generateCPF() }));
    } else {
      setUseCNPJMask(prev => !prev);
      setDocuments(prev => ({ ...prev, cnpj: generateCNPJ() }));
    }
  }, [generateCPF, generateCNPJ]);

  const DocumentField = ({ label, value, type }) => (
    <div className="campo-item">
      <label>{label}:</label>
      <div className="campo-valor">
        <span className="copyable" id={type}>{value}</span>
        <i 
          className="fas fa-copy copy-icon" 
          title="Copiar"
          onClick={() => handleCopy(value)}
        />
        <i 
          className="fas fa-sync-alt regenerate-icon" 
          title="Gerar novo"
          onClick={() => regenerateDocument(type)}
        />
        {(type === 'cpf' || type === 'cnpj') && (
          <i 
            className={`fas fa-mask ${type === 'cpf' ? useCPFMask : useCNPJMask ? 'active' : ''}`}
            title="Alternar máscara"
            onClick={() => toggleMask(type)}
          />
        )}
      </div>
    </div>
  );

  return (
    <div className="card" id="documentos">
      <div className="card-header">
        <h5><i className="fas fa-id-card"></i> Documentos</h5>
      </div>
      <div className="card-body">
        <DocumentField label="CPF" value={documents.cpf} type="cpf" />
        <DocumentField label="CNPJ" value={documents.cnpj} type="cnpj" />
        <DocumentField label="RG" value={documents.rg} type="rg" />
      </div>
    </div>
  );
}; 