/**
 * Utilitários de segurança para a aplicação KQA
 * @author KQA Team
 * @description Funções para sanitização, validação e segurança de dados
 */

/**
 * Sanitiza string removendo caracteres perigosos
 * @param {string} input - String a ser sanitizada
 * @returns {string} String sanitizada
 */
export const sanitizeString = (input) => {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove scripts
    .replace(/<[^>]*>/g, '') // Remove tags HTML
    .replace(/javascript:/gi, '') // Remove javascript:
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim();
};

/**
 * Valida se uma string contém apenas caracteres seguros
 * @param {string} input - String a ser validada
 * @returns {boolean} True se a string for segura
 */
export const isSafeString = (input) => {
  if (typeof input !== 'string') return false;
  
  // Verifica se contém caracteres perigosos
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /data:text\/html/i,
    /vbscript:/i
  ];
  
  return !dangerousPatterns.some(pattern => pattern.test(input));
};

/**
 * Sanitiza dados de entrada de formulários
 * @param {Object} formData - Dados do formulário
 * @returns {Object} Dados sanitizados
 */
export const sanitizeFormData = (formData) => {
  if (!formData || typeof formData !== 'object') return {};
  
  const sanitized = {};
  
  for (const [key, value] of Object.entries(formData)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(item => 
        typeof item === 'string' ? sanitizeString(item) : item
      );
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
};

/**
 * Valida se um email é seguro (não é um email de teste malicioso)
 * @param {string} email - Email a ser validado
 * @returns {boolean} True se o email for seguro
 */
export const isSafeEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  
  // Padrões de emails maliciosos conhecidos
  const maliciousPatterns = [
    /script/i,
    /javascript/i,
    /vbscript/i,
    /<.*>/,
    /\.\./,
    /[<>]/
  ];
  
  return !maliciousPatterns.some(pattern => pattern.test(email));
};

/**
 * Gera um token CSRF simples para proteção
 * @returns {string} Token CSRF
 */
export const generateCSRFToken = () => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * Valida se um token CSRF é válido
 * @param {string} token - Token a ser validado
 * @returns {boolean} True se o token for válido
 */
export const validateCSRFToken = (token) => {
  if (!token || typeof token !== 'string') return false;
  
  // Token deve ter 64 caracteres hexadecimais
  return /^[a-f0-9]{64}$/i.test(token);
};

/**
 * Limita o tamanho de strings para prevenir ataques de DoS
 * @param {string} input - String de entrada
 * @param {number} maxLength - Tamanho máximo permitido
 * @returns {string} String limitada
 */
export const limitStringLength = (input, maxLength = 1000) => {
  if (typeof input !== 'string') return '';
  
  return input.length > maxLength ? input.substring(0, maxLength) : input;
};

/**
 * Valida se um objeto não contém propriedades perigosas
 * @param {Object} obj - Objeto a ser validado
 * @returns {boolean} True se o objeto for seguro
 */
export const isSafeObject = (obj) => {
  if (!obj || typeof obj !== 'object') return false;
  
  const dangerousKeys = ['__proto__', 'constructor', 'prototype'];
  
  return !dangerousKeys.some(key => key in obj);
};

/**
 * Rate limiting simples baseado em localStorage
 * @param {string} key - Chave para identificar a ação
 * @param {number} limit - Limite de tentativas
 * @param {number} windowMs - Janela de tempo em milissegundos
 * @returns {boolean} True se a ação está dentro do limite
 */
export const checkRateLimit = (key, limit = 10, windowMs = 60000) => {
  try {
    const now = Date.now();
    const storageKey = `rateLimit_${key}`;
    const stored = localStorage.getItem(storageKey);
    
    if (!stored) {
      localStorage.setItem(storageKey, JSON.stringify({ count: 1, timestamp: now }));
      return true;
    }
    
    const data = JSON.parse(stored);
    
    // Reset se a janela de tempo passou
    if (now - data.timestamp > windowMs) {
      localStorage.setItem(storageKey, JSON.stringify({ count: 1, timestamp: now }));
      return true;
    }
    
    // Verifica se está dentro do limite
    if (data.count >= limit) {
      return false;
    }
    
    // Incrementa contador
    data.count++;
    localStorage.setItem(storageKey, JSON.stringify(data));
    return true;
    
  } catch (error) {
    console.warn('Erro no rate limiting:', error);
    return true; // Em caso de erro, permite a ação
  }
}; 