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
export const sanitizeString = input => {
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
export const isSafeString = input => {
  if (typeof input !== 'string') return false;

  // Verifica se contém caracteres perigosos
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /data:text\/html/i,
    /vbscript:/i,
  ];

  return !dangerousPatterns.some(pattern => pattern.test(input));
};

/**
 * Sanitiza dados de entrada de formulários
 * @param {Object} formData - Dados do formulário
 * @returns {Object} Dados sanitizados
 */
export const sanitizeFormData = formData => {
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
 * @param {string} email - E-mail a ser validado
 * @returns {boolean} True se o email for seguro
 */
export const isSafeEmail = email => {
  if (!email || typeof email !== 'string') return false;

  // Padrões de emails maliciosos conhecidos
  const maliciousPatterns = [
    /script/i,
    /javascript/i,
    /vbscript/i,
    /<.*>/,
    /\.\./,
    /[<>]/,
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
export const validateCSRFToken = token => {
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
export const isSafeObject = obj => {
  if (!obj || typeof obj !== 'object') return false;

  const dangerousKeys = ['__proto__', 'constructor', 'prototype'];

  return !dangerousKeys.some(key => key in obj);
};

/**
 * Rate limiting simples baseado em localStorage
 * @param {string} action - Ação a ser limitada
 * @param {number} maxAttempts - Número máximo de tentativas
 * @param {number} timeWindow - Janela de tempo em milissegundos
 * @returns {boolean} True se a ação está dentro do limite
 */
export const checkRateLimit = (action, maxAttempts = 5, timeWindow = 60000) => {
  try {
    const now = Date.now();
    const key = `rateLimit_${action}`;
    const attempts = JSON.parse(localStorage.getItem(key) || '[]');

    // Remove tentativas antigas
    const recentAttempts = attempts.filter(
      timestamp => now - timestamp < timeWindow
    );

    if (recentAttempts.length >= maxAttempts) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Rate limit exceeded for action: ${action}`);
      }
      return false;
    }

    // Adiciona nova tentativa
    recentAttempts.push(now);
    localStorage.setItem(key, JSON.stringify(recentAttempts));

    return true;
  } catch (error) {
    // Em caso de erro, permite a ação
    return true;
  }
};

/**
 * Valida e sanitiza dados do localStorage
 * @param {string} key - Chave do localStorage
 * @param {*} defaultValue - Valor padrão se não encontrar ou for inválido
 * @param {Function} validator - Função de validação customizada
 * @returns {*} Dados validados e sanitizados
 */
export const getSecureLocalStorage = (
  key,
  defaultValue = null,
  validator = null
) => {
  try {
    const storedData = localStorage.getItem(key);

    if (!storedData) {
      return defaultValue;
    }

    // Verifica se o JSON não foi corrompido
    let parsed;
    try {
      parsed = JSON.parse(storedData);
    } catch {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Invalid JSON in localStorage key: ${key}`);
      }
      return defaultValue;
    }

    // Validação de segurança
    if (typeof parsed === 'string') {
      if (!isSafeString(parsed)) {
        if (process.env.NODE_ENV === 'development') {
          console.warn(`Unsafe string detected in localStorage key: ${key}`);
        }
        return defaultValue;
      }
    }

    if (typeof parsed === 'object' && parsed !== null) {
      if (!isSafeObject(parsed)) {
        if (process.env.NODE_ENV === 'development') {
          console.warn(`Unsafe object detected in localStorage key: ${key}`);
        }
        return defaultValue;
      }
    }

    // Validação customizada se fornecida
    if (validator && typeof validator === 'function') {
      if (!validator(parsed)) {
        if (process.env.NODE_ENV === 'development') {
          console.warn(`Custom validation failed for localStorage key: ${key}`);
        }
        return defaultValue;
      }
    }

    return parsed;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Error reading localStorage key ${key}:`, error);
    }
    return defaultValue;
  }
};

/**
 * Salva dados no localStorage de forma segura
 * @param {string} key - Chave do localStorage
 * @param {*} value - Valor a ser salvo
 * @param {Function} sanitizer - Função de sanitização opcional
 * @returns {boolean} True se salvou com sucesso
 */
export const setSecureLocalStorage = (key, value, sanitizer = null) => {
  try {
    // Limita o tamanho da chave
    if (key.length > 100) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('LocalStorage key too long, truncating');
      }
      key = key.substring(0, 100);
    }

    let processedValue = value;

    // Sanitização customizada se fornecida
    if (sanitizer && typeof sanitizer === 'function') {
      processedValue = sanitizer(value);
    }

    // Sanitização padrão para strings
    if (typeof processedValue === 'string') {
      processedValue = sanitizeString(processedValue);
    }

    // Sanitização para objetos
    if (typeof processedValue === 'object' && processedValue !== null) {
      processedValue = sanitizeFormData(processedValue);
    }

    // Verifica o tamanho do dado para evitar exceder limites do localStorage
    const serialized = JSON.stringify(processedValue);
    if (serialized.length > 5 * 1024 * 1024) {
      // 5MB limit
      if (process.env.NODE_ENV === 'development') {
        console.warn('Data too large for localStorage');
      }
      return false;
    }

    localStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Error saving to localStorage key ${key}:`, error);
    }
    return false;
  }
};

/**
 * Detecta possíveis ataques de XSS em tempo real
 * @param {string} input - Input do usuário
 * @returns {boolean} True se suspeito de XSS
 */
export const detectXSSAttempt = input => {
  if (typeof input !== 'string') return false;

  const xssPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe[^>]*>/gi,
    /<object[^>]*>/gi,
    /<embed[^>]*>/gi,
    /expression\s*\(/gi,
    /url\s*\(/gi,
    /eval\s*\(/gi,
  ];

  return xssPatterns.some(pattern => pattern.test(input));
};

/**
 * Monitora atividades suspeitas e bloqueia se necessário
 * @param {string} activity - Tipo de atividade
 * @param {*} data - Dados da atividade
 * @returns {boolean} True se a atividade é permitida
 */
export const monitorSuspiciousActivity = (activity, data = null) => {
  const suspiciousActivities = getSecureLocalStorage(
    'suspicious_activities',
    [],
    activities => Array.isArray(activities)
  );

  const now = Date.now();
  const oneHour = 60 * 60 * 1000;

  // Remove atividades antigas (mais de 1 hora)
  const recentActivities = suspiciousActivities.filter(
    record => now - record.timestamp < oneHour
  );

  // Verifica se há atividade suspeita
  if (data && typeof data === 'string' && detectXSSAttempt(data)) {
    recentActivities.push({
      activity,
      timestamp: now,
      type: 'xss_attempt',
      data: sanitizeString(data.substring(0, 100)), // Limita e sanitiza o log
    });

    setSecureLocalStorage('suspicious_activities', recentActivities);

    // Bloqueia se muitas tentativas em pouco tempo
    const xssAttempts = recentActivities.filter(
      record =>
        record.type === 'xss_attempt' && now - record.timestamp < 15 * 60 * 1000
    );

    if (xssAttempts.length >= 3) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Multiple XSS attempts detected, blocking activity');
      }
      return false;
    }
  }

  return true;
};

/**
 * Limpa dados de segurança expirados
 */
export const cleanupSecurityData = () => {
  try {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    // Lista de chaves relacionadas à segurança
    const securityKeys = ['suspicious_activities', 'rate_limit_data'];

    securityKeys.forEach(baseKey => {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(baseKey)) {
          const data = getSecureLocalStorage(key, null);
          if (data && typeof data === 'object' && data.timestamp) {
            if (now - data.timestamp > oneDay) {
              localStorage.removeItem(key);
            }
          }
        }
      }
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Error cleaning up security data:', error);
    }
  }
};
