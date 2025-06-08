import { useCallback } from 'react';

const useTextareaResizeActions = () => {
  const STORAGE_KEY = 'kqa-textarea-sizes';

  // Função para limpar tamanhos de textareas de um card específico
  const clearCardTextareaSizes = useCallback(cardId => {
    try {
      const savedSizes = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');

      // Filtrar e remover entradas que correspondem ao cardId
      const filteredSizes = Object.keys(savedSizes).reduce((acc, key) => {
        if (!key.includes(`textarea-${cardId}-`)) {
          acc[key] = savedSizes[key];
        }
        return acc;
      }, {});

      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredSizes));

      // Resetar altura dos textareas do card para o padrão
      const cardElement = document.getElementById(cardId);
      if (cardElement) {
        const textareas = cardElement.querySelectorAll('textarea.copyable');
        textareas.forEach(textarea => {
          textarea.style.height = 'auto'; // Reset para altura automática
          textarea.style.height = `${textarea.scrollHeight}px`; // Ajustar para conteúdo
        });
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Erro ao limpar tamanhos dos textareas:', error);
      }
    }
  }, []);

  return {
    clearCardTextareaSizes,
  };
};

export default useTextareaResizeActions;
