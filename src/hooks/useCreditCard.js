/**
 * Hook para gerenciamento de cartão de crédito
 * @author KQA Team
 * @description Extrai lógica de cartão mantendo comportamento original idêntico
 */

import { useState, useCallback, useEffect } from 'react';
import { useDataGenerator } from './useDataGenerator';

/**
 * Hook para gerenciar cartão de crédito
 * Mantém comportamento idêntico ao código original do DataGenerator
 */
export const useCreditCard = () => {
  const { generateCreditCard, getEredeTestCardStatuses } = useDataGenerator();

  const eredeStatuses = getEredeTestCardStatuses
    ? getEredeTestCardStatuses()
    : [];

  // Estados idênticos ao original
  const [card, setCard] = useState(generateCreditCard('visa', 'credito'));
  const [cardConfig, setCardConfig] = useState({
    bandeira: 'visa',
    tipo: 'credito',
    eredeStatus: 'APROVADA',
  });

  // Effect idêntico ao original para Erede
  useEffect(() => {
    if (cardConfig.bandeira.toLowerCase() === 'erede') {
      const newCard = generateCreditCard(
        cardConfig.bandeira,
        '',
        cardConfig.eredeStatus
      );
      setCard(newCard);
    }
  }, [cardConfig.eredeStatus, generateCreditCard, cardConfig.bandeira]);

  // Função idêntica ao original do DataGenerator
  const handleCardConfigChange = useCallback(
    e => {
      const { name, value } = e.target;
      setCardConfig(prev => {
        const newConfig = { ...prev, [name]: value };

        if (name === 'bandeira' && value.toLowerCase() === 'erede') {
          newConfig.eredeStatus = 'APROVADA';
          setCard(generateCreditCard(value, '', 'APROVADA'));
        } else if (newConfig.bandeira.toLowerCase() === 'erede') {
          setCard(
            generateCreditCard(newConfig.bandeira, '', newConfig.eredeStatus)
          );
        } else {
          setCard(generateCreditCard(newConfig.bandeira, newConfig.tipo));
        }
        return newConfig;
      });
    },
    [generateCreditCard]
  );

  // Função para regenerar cartão
  const regenerateCard = useCallback(() => {
    if (cardConfig.bandeira.toLowerCase() === 'erede') {
      setCard(
        generateCreditCard(cardConfig.bandeira, '', cardConfig.eredeStatus)
      );
    } else {
      setCard(generateCreditCard(cardConfig.bandeira, cardConfig.tipo));
    }
  }, [generateCreditCard, cardConfig]);

  return {
    card,
    cardConfig,
    eredeStatuses,
    handleCardConfigChange,
    regenerateCard,
  };
};
