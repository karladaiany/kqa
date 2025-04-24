import { CONFIG } from './config.js';

/**
 * Aplica uma máscara a um valor
 * @param {string} value - Valor a ser mascarado
 * @param {string} mask - Máscara a ser aplicada
 * @returns {string} Valor mascarado
 */
export function applyMask(value, mask) {
    let maskedValue = '';
    let valueIndex = 0;
    
    for (let i = 0; i < mask.length && valueIndex < value.length; i++) {
        if (mask[i] === '#') {
            maskedValue += value[valueIndex++];
        } else {
            maskedValue += mask[i];
        }
    }
    
    return maskedValue;
}

/**
 * Remove caracteres não numéricos de uma string
 * @param {string} value - String a ser limpa
 * @returns {string} String apenas com números
 */
export function cleanNumber(value) {
    return value.replace(/\D/g, '');
}

/**
 * Cria um elemento de feedback (toast)
 * @param {string} message - Mensagem a ser exibida
 * @param {string} type - Tipo do toast (success, error, info)
 * @returns {HTMLElement} Elemento do toast
 */
export const createToast = (message, type = 'info') => {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    const { TOP, RIGHT } = CONFIG.TOAST.POSITION;
    toast.style.top = TOP;
    toast.style.right = RIGHT;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, CONFIG.TOAST.DURATION);
    
    return toast;
};

/**
 * Função de debounce para limitar chamadas de função
 * @param {Function} func - Função a ser debounced
 * @param {number} wait - Tempo de espera em ms
 * @returns {Function} Função debounced
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Copia texto para a área de transferência
 * @param {string} text - Texto a ser copiado
 * @returns {Promise<void>}
 */
export async function copyToClipboard(text) {
    if (!text) {
        throw new Error('Texto vazio');
    }
    
    try {
        await navigator.clipboard.writeText(text);
    } catch (error) {
        console.error('Erro ao copiar para área de transferência:', error);
        throw error;
    }
} 