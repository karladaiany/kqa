/**
 * Utilitários de acessibilidade para a aplicação KQA
 * @author KQA Team
 * @description Funções para melhorar a acessibilidade e usabilidade
 */

/**
 * Gera IDs únicos para elementos de formulário
 * @param {string} prefix - Prefixo para o ID
 * @returns {string} ID único
 */
export const generateUniqueId = (prefix = 'kqa') => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Cria associação entre label e input
 * @param {string} inputId - ID do input
 * @param {string} labelText - Texto do label
 * @returns {Object} Propriedades para label e input
 */
export const createLabelInputAssociation = (inputId, labelText) => {
  return {
    labelProps: {
      htmlFor: inputId,
      children: labelText,
    },
    inputProps: {
      id: inputId,
      'aria-label': labelText,
    },
  };
};

/**
 * Gera aria-label descritivo para botões de ação
 * @param {string} action - Ação do botão (ex: 'copiar', 'regenerar')
 * @param {string} target - Alvo da ação (ex: 'CPF', 'dados pessoais')
 * @returns {string} Aria-label descritivo
 */
export const generateActionAriaLabel = (action, target) => {
  const actionMap = {
    copiar: 'Copiar',
    regenerar: 'Regenerar',
    gerar: 'Gerar',
    limpar: 'Limpar',
    alternar: 'Alternar',
    abrir: 'Abrir',
    fechar: 'Fechar',
  };

  const actionText = actionMap[action.toLowerCase()] || action;
  return `${actionText} ${target}`;
};

/**
 * Cria propriedades ARIA para componentes de status
 * @param {string} status - Status atual ('loading', 'success', 'error')
 * @param {string} message - Mensagem de status
 * @returns {Object} Propriedades ARIA
 */
export const createStatusAriaProps = (status, message) => {
  const statusMap = {
    loading: 'polite',
    success: 'polite',
    error: 'assertive',
  };

  return {
    'aria-live': statusMap[status] || 'polite',
    'aria-atomic': 'true',
    role: status === 'error' ? 'alert' : 'status',
    children: message,
  };
};

/**
 * Gerencia foco para navegação por teclado
 * @param {string} elementId - ID do elemento para focar
 * @param {number} delay - Delay antes de focar (ms)
 */
export const manageFocus = (elementId, delay = 0) => {
  setTimeout(() => {
    const element = document.getElementById(elementId);
    if (element && typeof element.focus === 'function') {
      element.focus();
    }
  }, delay);
};

/**
 * Cria propriedades para componentes expansíveis (accordion, dropdown)
 * @param {boolean} isExpanded - Se o componente está expandido
 * @param {string} controlsId - ID do elemento controlado
 * @returns {Object} Propriedades ARIA
 */
export const createExpandableAriaProps = (isExpanded, controlsId) => {
  return {
    'aria-expanded': isExpanded,
    'aria-controls': controlsId,
    role: 'button',
    tabIndex: 0,
  };
};

/**
 * Valida contraste de cores (simplificado)
 * @param {string} foreground - Cor do texto (hex)
 * @param {string} background - Cor de fundo (hex)
 * @returns {Object} Resultado da validação
 */
export const validateColorContrast = (foreground, background) => {
  // Função simplificada - em produção, usar biblioteca especializada
  const hexToRgb = hex => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  const getLuminance = rgb => {
    const { r, g, b } = rgb;
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const fgRgb = hexToRgb(foreground);
  const bgRgb = hexToRgb(background);

  if (!fgRgb || !bgRgb) {
    return { valid: false, ratio: 0, level: 'invalid' };
  }

  const fgLum = getLuminance(fgRgb);
  const bgLum = getLuminance(bgRgb);

  const ratio =
    (Math.max(fgLum, bgLum) + 0.05) / (Math.min(fgLum, bgLum) + 0.05);

  return {
    valid: ratio >= 4.5,
    ratio: Math.round(ratio * 100) / 100,
    level: ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : 'fail',
  };
};

/**
 * Cria propriedades para componentes de formulário com validação
 * @param {boolean} isValid - Se o campo é válido
 * @param {string} errorMessage - Mensagem de erro
 * @param {string} fieldId - ID do campo
 * @returns {Object} Propriedades ARIA
 */
export const createFormFieldAriaProps = (isValid, errorMessage, fieldId) => {
  const errorId = `${fieldId}-error`;

  return {
    fieldProps: {
      'aria-invalid': !isValid,
      'aria-describedby': !isValid ? errorId : undefined,
    },
    errorProps: !isValid
      ? {
          id: errorId,
          role: 'alert',
          'aria-live': 'polite',
          children: errorMessage,
        }
      : null,
  };
};

/**
 * Utilitário para anúncios de screen reader
 * @param {string} message - Mensagem para anunciar
 * @param {string} priority - Prioridade ('polite' ou 'assertive')
 */
export const announceToScreenReader = (message, priority = 'polite') => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.style.position = 'absolute';
  announcement.style.left = '-10000px';
  announcement.style.width = '1px';
  announcement.style.height = '1px';
  announcement.style.overflow = 'hidden';

  document.body.appendChild(announcement);
  announcement.textContent = message;

  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

/**
 * Verifica se o usuário prefere movimento reduzido
 * @returns {boolean} True se prefere movimento reduzido
 */
export const prefersReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Cria propriedades para skip links
 * @param {string} targetId - ID do elemento alvo
 * @param {string} text - Texto do skip link
 * @returns {Object} Propriedades do skip link
 */
export const createSkipLinkProps = (targetId, text) => {
  return {
    href: `#${targetId}`,
    className: 'skip-link',
    onClick: e => {
      e.preventDefault();
      manageFocus(targetId, 100);
    },
    children: text,
  };
};
