import { useEffect, useCallback } from 'react';

const useTextareaResize = () => {
  // Chave para armazenar as configurações no localStorage
  const STORAGE_KEY = 'kqa-textarea-sizes';

  // Função para salvar o tamanho do textarea no localStorage
  const saveTextareaSize = useCallback((textareaId, height) => {
    try {
      const savedSizes = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      savedSizes[textareaId] = height;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedSizes));
    } catch (error) {
      console.warn('Erro ao salvar tamanho do textarea:', error);
    }
  }, []);

  // Função para carregar o tamanho do textarea do localStorage
  const loadTextareaSize = useCallback(textareaId => {
    try {
      const savedSizes = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return savedSizes[textareaId] || null;
    } catch (error) {
      console.warn('Erro ao carregar tamanho do textarea:', error);
      return null;
    }
  }, []);

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
      console.warn('Erro ao limpar tamanhos dos textareas:', error);
    }
  }, []);

  // Função para aplicar o resize observer em um textarea
  const setupTextareaResize = useCallback(
    textarea => {
      if (!textarea || textarea.dataset.resizeSetup === 'true') return;

      // Marcar como configurado para evitar duplicação
      textarea.dataset.resizeSetup = 'true';

      // Gerar ID único baseado no contexto do textarea
      const textareaId =
        textarea.id ||
        `textarea-${textarea.closest('.card')?.id || 'unknown'}-${
          textarea.placeholder || 'default'
        }`;

      // Carregar tamanho salvo
      const savedHeight = loadTextareaSize(textareaId);
      if (savedHeight) {
        textarea.style.height = savedHeight;
      }

      // Observer para detectar mudanças de tamanho
      const resizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
          const { height } = entry.contentRect;
          if (height > 32) {
            // Apenas salvar se for maior que altura mínima
            saveTextareaSize(textareaId, `${height}px`);
          }
        }
      });

      // Iniciar observação
      resizeObserver.observe(textarea);

      // Cleanup function
      return () => {
        resizeObserver.disconnect();
        textarea.dataset.resizeSetup = 'false';
      };
    },
    [loadTextareaSize, saveTextareaSize]
  );

  // Função para configurar todos os textareas na página
  const setupAllTextareas = useCallback(() => {
    const textareas = document.querySelectorAll('textarea.copyable');
    const cleanupFunctions = [];

    textareas.forEach(textarea => {
      const cleanup = setupTextareaResize(textarea);
      if (cleanup) {
        cleanupFunctions.push(cleanup);
      }
    });

    return () => {
      cleanupFunctions.forEach(cleanup => cleanup());
    };
  }, [setupTextareaResize]);

  // Hook para ser usado em componentes
  useEffect(() => {
    // Configurar textareas existentes
    const cleanup = setupAllTextareas();

    // Observer para novos textareas adicionados dinamicamente
    const mutationObserver = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Verificar se o próprio node é um textarea
            if (node.matches && node.matches('textarea.copyable')) {
              setupTextareaResize(node);
            }
            // Verificar textareas filhos
            const childTextareas =
              node.querySelectorAll &&
              node.querySelectorAll('textarea.copyable');
            if (childTextareas) {
              childTextareas.forEach(setupTextareaResize);
            }
          }
        });
      });
    });

    // Observar mudanças no DOM
    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Cleanup
    return () => {
      cleanup();
      mutationObserver.disconnect();
    };
  }, [setupAllTextareas, setupTextareaResize]);

  return {
    setupTextareaResize,
    setupAllTextareas,
    saveTextareaSize,
    loadTextareaSize,
    clearCardTextareaSizes,
  };
};

export default useTextareaResize;
