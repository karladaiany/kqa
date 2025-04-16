import React, { useState, useCallback } from 'react';
import { useToast } from '../../context/ToastContext';
import { faker } from '@faker-js/faker/locale/pt_BR';
import './CreditCard.css';

const CARD_BRANDS = {
  mastercard: {
    name: 'Mastercard',
    icon: 'fab fa-cc-mastercard',
    prefixes: ['51', '52', '53', '54', '55'],
    length: 16
  },
  visa: {
    name: 'Visa',
    icon: 'fab fa-cc-visa',
    prefixes: ['4'],
    length: 16
  },
  amex: {
    name: 'American Express',
    icon: 'fab fa-cc-amex',
    prefixes: ['34', '37'],
    length: 15
  }
};

const CARD_TYPES = {
  credito: 'Crédito',
  debito: 'Débito'
};

function formatCardNumber(number, brand) {
  const digits = number.replace(/\D/g, '');
  
  if (brand === 'amex') {
    return digits.replace(/(\d{4})(\d{6})(\d{5})/, '$1 $2 $3')
      .replace(/(.{4})(.{6})(.{5})/, '$1 $2 $3');
  }
  
  return digits.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, '$1 $2 $3 $4')
    .replace(/(.{4})(.{4})(.{4})(.{4})/, '$1 $2 $3 $4');
}

export const CreditCard = () => {
  const { showToast } = useToast();

  function generateCardNumber(brand) {
    const prefix = faker.helpers.arrayElement(CARD_BRANDS[brand].prefixes);
    const length = CARD_BRANDS[brand].length;
    let number = prefix;
    
    while (number.length < length - 1) {
      number += faker.number.int({ min: 0, max: 9 });
    }
    
    // Implementar algoritmo de Luhn para gerar o último dígito válido
    // ... código do algoritmo de Luhn ...
    
    return number;
  }

  function generateCardData() {
    const expiryMonth = faker.number.int({ min: 1, max: 12 }).toString().padStart(2, '0');
    const expiryYear = (faker.number.int({ min: 24, max: 29 })).toString();
    const cvv = faker.number.int({ min: 100, max: 999 }).toString();

    return {
      expiryDate: `${expiryMonth}/${expiryYear}`,
      cvv
    };
  }

  function generateNewCards() {
    const cards = {};
    Object.keys(CARD_BRANDS).forEach(brand => {
      cards[brand] = {
        credito: { number: generateCardNumber(brand), ...generateCardData() },
        debito: { number: generateCardNumber(brand), ...generateCardData() }
      };
    });
    return cards;
  }

  const [cards, setCards] = useState(() => generateNewCards());

  const handleCopy = useCallback((text) => {
    navigator.clipboard.writeText(text)
      .then(() => showToast('Copiado para a área de transferência!'))
      .catch(err => console.error('Erro ao copiar:', err));
  }, [showToast]);

  const regenerateCard = useCallback((brand, type) => {
    setCards(prev => ({
      ...prev,
      [brand]: {
        ...prev[brand],
        [type]: { number: generateCardNumber(brand), ...generateCardData() }
      }
    }));
  }, []);

  const CardSection = ({ brand, type }) => {
    const typeKey = type === 'Crédito' ? 'credito' : 'debito';
    return (
      <div className="card-section">
        <div className="card-brand-header">
          <div className="brand-info">
            <i className={`${CARD_BRANDS[brand].icon} brand-icon`}></i>
            <span className="brand-name">{CARD_BRANDS[brand].name} - {type}</span>
          </div>
          <i 
            className="fas fa-sync-alt regenerate-icon"
            title="Gerar novo cartão"
            onClick={() => regenerateCard(brand, typeKey)}
          />
        </div>
        <div className="card-data">
          <div className="data-field">
            <label>Número:</label>
            <div className="field-value">
              <span className="copyable card-number">
                {formatCardNumber(cards[brand][typeKey].number, brand)}
              </span>
              <i 
                className="fas fa-copy copy-icon" 
                title="Copiar número"
                onClick={() => handleCopy(cards[brand][typeKey].number)}
              />
            </div>
          </div>
          <div className="data-field">
            <label>Validade:</label>
            <div className="field-value">
              <span className="copyable">{cards[brand][typeKey].expiryDate}</span>
              <i 
                className="fas fa-copy copy-icon" 
                title="Copiar validade"
                onClick={() => handleCopy(cards[brand][typeKey].expiryDate)}
              />
            </div>
          </div>
          <div className="data-field">
            <label>CVV:</label>
            <div className="field-value">
              <span className="copyable">{cards[brand][typeKey].cvv}</span>
              <i 
                className="fas fa-copy copy-icon" 
                title="Copiar CVV"
                onClick={() => handleCopy(cards[brand][typeKey].cvv)}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="card" id="cartao-credito">
      <div className="card-header">
        <h5><i className="fas fa-credit-card"></i> Cartões</h5>
      </div>
      <div className="card-body">
        {Object.keys(CARD_BRANDS).map(brand => (
          <div key={brand} className="brand-container">
            {Object.values(CARD_TYPES).map(type => (
              <CardSection key={`${brand}-${type}`} brand={brand} type={type} />
            ))}
          </div>
        ))}
        <button 
          className="btn btn-primary btn-sm regenerate-btn"
          onClick={() => setCards(generateNewCards())}
        >
          <i className="fas fa-sync-alt"></i>
        </button>
      </div>
    </div>
  );
}; 