/**
 * Copia texto para a área de transferência
 * @param {string} text - Texto a ser copiado
 * @returns {Promise<void>}
 */
export async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        console.error('Erro ao copiar para área de transferência:', err);
        return fallbackCopyToClipboard(text);
    }
}

/**
 * Método alternativo para copiar texto para a área de transferência
 * @param {string} text - Texto a ser copiado
 * @returns {boolean} Indica se a operação foi bem sucedida
 */
function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '0';
    textArea.style.top = '0';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        return successful;
    } catch (err) {
        console.error('Erro ao copiar para área de transferência:', err);
        document.body.removeChild(textArea);
        return false;
    }
} 