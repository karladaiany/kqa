/**
 * Utilitários de Performance para Otimização de Componentes
 *
 * Este módulo fornece funções para otimizar a performance da aplicação,
 * incluindo lazy loading, preload de componentes e otimizações de rendering.
 */

import { lazy, memo, useCallback } from 'react';

/**
 * Função para criar componentes lazy com retry automático
 * @param {Function} importFunction - Função de import dinâmico
 * @param {number} maxRetries - Número máximo de tentativas (padrão: 3)
 * @returns {React.Component} Componente lazy com retry
 */
export const createLazyComponentWithRetry = (
  importFunction,
  maxRetries = 3
) => {
  return lazy(() => {
    return new Promise((resolve, reject) => {
      let retryCount = 0;

      const attemptImport = () => {
        importFunction()
          .then(resolve)
          .catch(error => {
            retryCount++;
            if (retryCount < maxRetries) {
              console.warn(
                `Tentativa ${retryCount} falhou, tentando novamente...`
              );
              setTimeout(attemptImport, 1000 * retryCount); // Delay progressivo
            } else {
              console.error(
                `Falha ao carregar componente após ${maxRetries} tentativas:`,
                error
              );
              reject(error);
            }
          });
      };

      attemptImport();
    });
  });
};

/**
 * Hook para preload de componentes lazy
 * @param {Array} componentImports - Array de funções de import
 */
export const usePreloadComponents = componentImports => {
  const preloadComponents = useCallback(() => {
    componentImports.forEach(importFn => {
      // Preload componentes em idle time
      if (window.requestIdleCallback) {
        window.requestIdleCallback(() => {
          importFn().catch(console.warn);
        });
      } else {
        // Fallback para navegadores sem requestIdleCallback
        setTimeout(() => {
          importFn().catch(console.warn);
        }, 100);
      }
    });
  }, [componentImports]);

  return { preloadComponents };
};

/**
 * HOC para memoização inteligente de componentes
 * @param {React.Component} Component - Componente a ser memoizado
 * @param {Function} areEqual - Função de comparação customizada
 * @returns {React.Component} Componente memoizado
 */
export const withSmartMemo = (Component, areEqual) => {
  return memo(
    Component,
    areEqual ||
      ((prevProps, nextProps) => {
        // Comparação superficial otimizada
        const prevKeys = Object.keys(prevProps);
        const nextKeys = Object.keys(nextProps);

        if (prevKeys.length !== nextKeys.length) {
          return false;
        }

        return prevKeys.every(key => {
          const prevValue = prevProps[key];
          const nextValue = nextProps[key];

          // Comparação otimizada para diferentes tipos
          if (
            typeof prevValue === 'function' &&
            typeof nextValue === 'function'
          ) {
            return prevValue.toString() === nextValue.toString();
          }

          if (Array.isArray(prevValue) && Array.isArray(nextValue)) {
            return (
              prevValue.length === nextValue.length &&
              prevValue.every((item, index) => item === nextValue[index])
            );
          }

          if (typeof prevValue === 'object' && typeof nextValue === 'object') {
            return JSON.stringify(prevValue) === JSON.stringify(nextValue);
          }

          return prevValue === nextValue;
        });
      })
  );
};

/**
 * Função para detectar recursos do navegador
 * @returns {Object} Objeto com capacidades do navegador
 */
export const getBrowserCapabilities = () => {
  return {
    supportsWebP: () => {
      const canvas = document.createElement('canvas');
      return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    },
    supportsLazyLoading: 'loading' in HTMLImageElement.prototype,
    supportsIntersectionObserver: 'IntersectionObserver' in window,
    supportsRequestIdleCallback: 'requestIdleCallback' in window,
    supportsPreload: () => {
      const link = document.createElement('link');
      return (
        link.relList &&
        link.relList.supports &&
        link.relList.supports('preload')
      );
    },
    memoryInfo: navigator.deviceMemory || 'unknown',
    connectionSpeed: navigator.connection?.effectiveType || 'unknown',
  };
};

/**
 * Função para preload de recursos críticos
 * @param {Array} resources - Array de recursos para preload
 */
export const preloadCriticalResources = resources => {
  resources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = resource.as || 'script';
    link.href = resource.href;

    if (resource.crossorigin) {
      link.crossOrigin = resource.crossorigin;
    }

    document.head.appendChild(link);
  });
};

/**
 * Função para detectar se o usuário prefere motion reduzido
 * @returns {boolean} True se prefere motion reduzido
 */
export const prefersReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Função para otimizar images com lazy loading
 * @param {string} src - URL da imagem
 * @param {Object} options - Opções de otimização
 * @returns {Object} Propriedades otimizadas para imagem
 */
export const optimizeImageProps = (src, options = {}) => {
  const {
    lazy = true,
    webpFallback = true,
    sizes = '100vw',
    quality = 75,
  } = options;

  const capabilities = getBrowserCapabilities();
  const props = {
    src,
    sizes,
    loading: lazy && capabilities.supportsLazyLoading ? 'lazy' : 'eager',
  };

  // Adicionar suporte a WebP se disponível
  if (webpFallback && capabilities.supportsWebP()) {
    const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    props.srcSet = `${webpSrc} 1x`;
  }

  return props;
};

/**
 * Função para debounce otimizado
 * @param {Function} func - Função a ser executada
 * @param {number} wait - Tempo de espera em ms
 * @param {boolean} immediate - Executar imediatamente
 * @returns {Function} Função com debounce aplicado
 */
export const optimizedDebounce = (func, wait, immediate = false) => {
  let timeout;
  let args;
  let context;
  let timestamp;
  let result;

  const later = () => {
    const last = Date.now() - timestamp;
    if (last < wait && last >= 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      if (!immediate) {
        result = func.apply(context, args);
        context = args = null;
      }
    }
  };

  const debounced = function (...params) {
    context = this;
    args = params;
    timestamp = Date.now();
    const callNow = immediate && !timeout;
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }
    return result;
  };

  debounced.cancel = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };

  debounced.flush = () => {
    if (timeout) {
      result = func.apply(context, args);
      context = args = null;
      clearTimeout(timeout);
      timeout = null;
    }
    return result;
  };

  return debounced;
};

/**
 * Performance monitor para desenvolvimento
 */
export const PerformanceMonitor = {
  measures: new Map(),

  start(name) {
    this.measures.set(name, performance.now());
  },

  end(name) {
    const start = this.measures.get(name);
    if (start) {
      const duration = performance.now() - start;
      // Performance: ${name} ${duration.toFixed(2)}ms
      this.measures.delete(name);
      return duration;
    }
    return null;
  },

  measure(name, fn) {
    this.start(name);
    const result = fn();
    this.end(name);
    return result;
  },

  async measureAsync(name, fn) {
    this.start(name);
    const result = await fn();
    this.end(name);
    return result;
  },
};

export default {
  createLazyComponentWithRetry,
  usePreloadComponents,
  withSmartMemo,
  getBrowserCapabilities,
  preloadCriticalResources,
  prefersReducedMotion,
  optimizeImageProps,
  optimizedDebounce,
  PerformanceMonitor,
};
