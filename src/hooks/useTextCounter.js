/**
 * Hook para gerenciamento de contador de caracteres
 * @author KQA Team
 * @description Extrai lógica de contador mantendo comportamento original idêntico
 */

import { useState, useCallback } from 'react';

/**
 * Hook para gerenciar contador de caracteres
 * Mantém comportamento idêntico ao código original do DataGenerator
 */
export const useTextCounter = () => {
  // Estado idêntico ao original
  const [textCounter, setTextCounter] = useState({
    text: '',
    count: 0,
  });

  // Função idêntica ao original do DataGenerator
  const handleTextChange = useCallback(e => {
    const newText = e.target.value;
    setTextCounter({
      text: newText,
      count: newText.length,
    });
  }, []);

  // Função idêntica ao original do DataGenerator
  const handleClearText = useCallback(() => {
    setTextCounter({
      text: '',
      count: 0,
    });
  }, []);

  return {
    textCounter,
    handleTextChange,
    handleClearText,
  };
};
