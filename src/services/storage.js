/**
 * Salva dados no localStorage
 * @param {string} key - Chave para armazenamento
 * @param {any} data - Dados a serem salvos
 */
export function saveToStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (err) {
        console.error('Erro ao salvar no localStorage:', err);
        return false;
    }
}

/**
 * Carrega dados do localStorage
 * @param {string} key - Chave dos dados
 * @returns {any} Dados carregados ou null se não existir
 */
export function loadFromStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (err) {
        console.error('Erro ao carregar do localStorage:', err);
        return null;
    }
}

/**
 * Remove dados do localStorage
 * @param {string} key - Chave dos dados a serem removidos
 */
export function removeFromStorage(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (err) {
        console.error('Erro ao remover do localStorage:', err);
        return false;
    }
} 