/**
 * Hook para gerenciamento de cartão de crédito
 * @author KQA Team
 * @description Extrai lógica de cartão mantendo comportamento original idêntico
 */

import { useState, useCallback, useMemo } from 'react';
import { useDataGenerator } from './useDataGenerator';

/**
 * Hook para gerenciar cartão de crédito
 * Mantém comportamento idêntico ao código original do DataGenerator
 */
export const useCreditCard = () => {
  const { generateCreditCard, getEredeTestCardStatuses } = useDataGenerator();

  const eredeStatuses = useMemo(() => {
    return getEredeTestCardStatuses ? getEredeTestCardStatuses() : [];
  }, [getEredeTestCardStatuses]);

  // Estados atualizados para nova estrutura
  const [card, setCard] = useState(() => generateCreditCard('visa', 'credito'));
  const [cardConfig, setCardConfig] = useState({
    bandeira: 'visa',
    tipo: 'credito',
    eredeStatus: 'Mastercard Crédito',
  });

  // Função atualizada para nova estrutura - toda a lógica de atualização aqui
  const handleCardConfigChange = useCallback(
    e => {
      const { name, value } = e.target;

      setCardConfig(prev => {
        const newConfig = { ...prev, [name]: value };

        // Gera novo cartão apenas quando necessário
        if (name === 'bandeira') {
          if (value.toLowerCase() === 'erede') {
            newConfig.eredeStatus = 'Mastercard Crédito';
            const newCard = generateCreditCard(value, '', 'Mastercard Crédito');
            setCard(newCard);
          } else {
            const newCard = generateCreditCard(value, newConfig.tipo);
            setCard(newCard);
          }
        } else if (
          name === 'eredeStatus' &&
          newConfig.bandeira.toLowerCase() === 'erede'
        ) {
          const newCard = generateCreditCard(newConfig.bandeira, '', value);
          setCard(newCard);
        } else if (
          name === 'tipo' &&
          newConfig.bandeira.toLowerCase() !== 'erede'
        ) {
          const newCard = generateCreditCard(newConfig.bandeira, value);
          setCard(newCard);
        }

        return newConfig;
      });
    },
    [generateCreditCard]
  );

  // Função para regenerar cartão (apenas para bandeiras não-Erede)
  const regenerateCard = useCallback(() => {
    if (cardConfig.bandeira.toLowerCase() !== 'erede') {
      setCard(generateCreditCard(cardConfig.bandeira, cardConfig.tipo));
    }
  }, [generateCreditCard, cardConfig.bandeira, cardConfig.tipo]);

  return {
    card,
    cardConfig,
    eredeStatuses,
    handleCardConfigChange,
    regenerateCard,
  };
};
