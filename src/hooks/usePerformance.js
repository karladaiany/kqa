/**
 * Hook para otimizações de performance
 * @author KQA Team
 * @description Hook que implementa memoização e debounce para melhorar performance
 */

import { useCallback, useMemo, useRef, useEffect, useState } from 'react';

/**
 * Hook para debounce de funções
 * @param {Function} callback - Função a ser executada com debounce
 * @param {number} delay - Delay em milissegundos
 * @returns {Function} Função com debounce aplicado
 */
export const useDebounce = (callback, delay) => {
  const timeoutRef = useRef(null);

  const debouncedCallback = useCallback(
    (...args) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
};

/**
 * Hook para memoização de valores computados
 * @param {Function} computeFn - Função de computação
 * @param {Array} deps - Dependências para recomputação
 * @returns {any} Valor memoizado
 */
export const useMemoizedValue = (computeFn, deps) => {
  return useMemo(computeFn, deps);
};

/**
 * Hook para callbacks memoizados
 * @param {Function} callback - Função callback
 * @param {Array} deps - Dependências
 * @returns {Function} Callback memoizado
 */
export const useMemoizedCallback = (callback, deps) => {
  return useCallback(callback, deps);
};

/**
 * Hook para throttle de funções
 * @param {Function} callback - Função a ser executada com throttle
 * @param {number} limit - Limite em milissegundos
 * @returns {Function} Função com throttle aplicado
 */
export const useThrottle = (callback, limit) => {
  const inThrottle = useRef(false);

  const throttledCallback = useCallback(
    (...args) => {
      if (!inThrottle.current) {
        callback(...args);
        inThrottle.current = true;
        setTimeout(() => {
          inThrottle.current = false;
        }, limit);
      }
    },
    [callback, limit]
  );

  return throttledCallback;
};

/**
 * Hook para lazy loading de componentes
 * @param {Function} importFn - Função de import dinâmico
 * @returns {Object} Estado do lazy loading
 */
export const useLazyComponent = (importFn) => {
  const [component, setComponent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    importFn()
      .then(module => {
        if (mounted) {
          setComponent(() => module.default || module);
          setLoading(false);
        }
      })
      .catch(err => {
        if (mounted) {
          setError(err);
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [importFn]);

  return { component, loading, error };
}; 