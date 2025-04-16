import React, { useState, useCallback, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { faker } from '@faker-js/faker/locale/pt_BR';
import './Documents.css';

export const Documents = () => {
  const { showToast } = useToast();
  
  // Inicializa estados com valores do localStorage
  const [useCPFMask, setUseCPFMask] = useState(() => 
    localStorage.getItem('useCPFMask') !== 'false'
  );
  const [useCNPJMask, setUseCNPJMask] = useState(() => 
    localStorage.getItem('useCNPJMask') !== 'false'
  );
  const [useRGMask, setUseRGMask] = useState(() => 
    localStorage.getItem('useRGMask') !== 'false'
  );

  // Atualiza localStorage quando os estados mudam
  useEffect(() => {
    localStorage.setItem('useCPFMask', useCPFMask);
    localStorage.setItem('useCNPJMask', useCNPJMask);
    localStorage.setItem('useRGMask', useRGMask);
  }, [useCPFMask, useCNPJMask, useRGMask]);

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

    return numbers.join('');
  }, [generateRandomNumber, calculateCPFDigit]);

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

    return numbers.join('');
  }, [generateRandomNumber]);

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

    return numbers.join('');
  }, [generateRandomNumber]);

  const [documents, setDocuments] = useState(() => generateNewDocuments());

  function formatCPF(cpf) {
    return useCPFMask ? cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4') : cpf;
  }

  function formatCNPJ(cnpj) {
    return useCNPJMask ? cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5') : cnpj;
  }

  function formatRG(rg) {
    return useRGMask ? rg.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4') : rg;
  }

  function generateNewDocuments() {
    const rawCPF = generateCPF();
    const rawCNPJ = generateCNPJ();
    const rawRG = generateRG();

    return {
      cpf: formatCPF(rawCPF),
      cnpj: formatCNPJ(rawCNPJ),
      rg: formatRG(rawRG)
    };
  }

  const toggleMask = useCallback((type) => {
    switch (type) {
      case 'cpf':
        setUseCPFMask(prev => !prev);
        setDocuments(prev => ({
          ...prev,
          cpf: !useCPFMask 
            ? prev.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
            : prev.cpf.replace(/\D/g, '')
        }));
        break;
      case 'cnpj':
        setUseCNPJMask(prev => !prev);
        setDocuments(prev => ({
          ...prev,
          cnpj: !useCNPJMask
            ? prev.cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
            : prev.cnpj.replace(/\D/g, '')
        }));
        break;
      case 'rg':
        setUseRGMask(prev => !prev);
        setDocuments(prev => ({
          ...prev,
          rg: !useRGMask
            ? prev.rg.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4')
            : prev.rg.replace(/\D/g, '')
        }));
        break;
    }
  }, [useCPFMask, useCNPJMask, useRGMask]);

  const regenerateField = useCallback((field) => {
    setDocuments(prev => ({
      ...prev,
      [field]: field === 'cpf' ? formatCPF(generateCPF()) :
               field === 'cnpj' ? formatCNPJ(generateCNPJ()) :
               formatRG(generateRG())
    }));
  }, [useCPFMask, useCNPJMask, useRGMask]);

  const handleCopy = useCallback((text) => {
    navigator.clipboard.writeText(text)
      .then(() => showToast('Copiado para a área de transferência!'))
      .catch(err => console.error('Erro ao copiar:', err));
  }, [showToast]);

  const DataField = ({ label, value, field, showMask = false }) => (
    <div className="campo-item">
      <label data-field={label}>{label}</label>
      <div className="campo-valor">
        <span className="copyable">{value}</span>
        <i 
          className="fas fa-copy copy-icon" 
          title="Copiar"
          onClick={() => handleCopy(value)}
        />
        <i 
          className="fas fa-sync-alt regenerate-icon" 
          title="Gerar novo"
          onClick={() => regenerateField(field)}
        />
        {showMask && (
          <i
            className={`fas fa-mask ${
              (field === 'cpf' && useCPFMask) ||
              (field === 'cnpj' && useCNPJMask) ||
              (field === 'rg' && useRGMask) ? 'active' : ''
            }`}
            title="Alternar máscara"
            onClick={() => toggleMask(field)}
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
        <div id="documentos-dados">
          <DataField label="CPF" value={documents.cpf} field="cpf" showMask={true} />
          <DataField label="CNPJ" value={documents.cnpj} field="cnpj" showMask={true} />
          <DataField label="RG" value={documents.rg} field="rg" showMask={true} />
        </div>
        <button 
          className="btn btn-primary btn-sm regenerate-btn"
          onClick={() => setDocuments(generateNewDocuments())}
        >
          <i className="fas fa-sync-alt"></i>
        </button>
      </div>
    </div>
  );
}; 