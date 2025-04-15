import React, { useState, useCallback } from 'react';
import { useToast } from '../../context/ToastContext';
import { faker } from '@faker-js/faker/locale/pt_BR';
import './CreditCard.css';

export const CreditCard = () => {
  const { showToast } = useToast();
  const [cardData, setCardData] = useState(() => generateNewCard());

  function generateNewCard() {
    return {
      number: faker.finance.creditCardNumber(),
      brand: faker.finance.creditCardIssuer(),
      expiry: faker.date.future().toLocaleDateString('pt-BR', { month: '2-digit', year: '2-digit' }),
      cvv: faker.finance.creditCardCVV()
    };
  }

  const handleCopy = useCallback((text) => {
    navigator.clipboard.writeText(text)
      .then(() => showToast('Copiado para a área de transferência!'))
      .catch(err => console.error('Erro ao copiar:', err));
  }, [showToast]);

  const regenerateField = useCallback((field) => {
    setCardData(prev => ({
      ...prev,
      [field]: generateNewCard()[field]
    }));
  }, []);

  const DataField = ({ label, value, field }) => (
    <div className="campo-item">
      <label>{label}:</label>
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
      </div>
    </div>
  );

  return (
    <div className="card" id="cartao-credito">
      <div className="card-header">
        <h5><i className="fas fa-credit-card"></i> Cartão de Crédito</h5>
      </div>
      <div className="card-body">
        <div id="credit-card-data" className="mb-3">
          <DataField label="Número" value={cardData.number} field="number" />
          <DataField label="Bandeira" value={cardData.brand} field="brand" />
          <DataField label="Validade" value={cardData.expiry} field="expiry" />
          <DataField label="CVV" value={cardData.cvv} field="cvv" />
        </div>
        <button 
          className="btn btn-primary btn-sm regenerate-btn"
          onClick={() => setCardData(generateNewCard())}
        >
          <i className="fas fa-sync-alt"></i>
        </button>
      </div>
    </div>
  );
}; 