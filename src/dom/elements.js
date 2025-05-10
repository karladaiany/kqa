/**
 * Elementos do DOM
 * @type {Object}
 */
export const elements = {
    cpf: document.querySelector('#cpf'),
    cnpj: document.querySelector('#cnpj'),
    rg: document.querySelector('#rg'),
    pessoaDados: document.getElementById('pessoa-dados'),
    creditCard: document.getElementById('credit-card-data'),
    produtoDados: document.getElementById('produto-dados'),
    generateButtons: {
        cpf: document.getElementById('generate-cpf'),
        cnpj: document.getElementById('generate-cnpj'),
        rg: document.getElementById('generate-rg'),
        person: document.getElementById('generate-person'),
        card: document.getElementById('generate-card'),
        product: document.getElementById('generate-product')
    },
    maskToggles: {
        cpf: document.getElementById('cpf-mask-toggle'),
        cnpj: document.getElementById('cnpj-mask-toggle')
    },
    theme: document.getElementById('theme-toggle')
};

/**
 * Atualiza o conteúdo de um elemento
 * @param {HTMLElement} element - Elemento a ser atualizado
 * @param {string} content - Conteúdo a ser inserido
 */
export function updateElementContent(element, content) {
    if (element) {
        element.textContent = content;
    }
}

/**
 * Atualiza o HTML de um elemento
 * @param {HTMLElement} element - Elemento a ser atualizado
 * @param {string} html - HTML a ser inserido
 */
export function updateElementHTML(element, html) {
    if (element) {
        element.innerHTML = html;
    }
}

/**
 * Adiciona um evento a um elemento
 * @param {HTMLElement} element - Elemento alvo
 * @param {string} event - Nome do evento
 * @param {Function} callback - Função de callback
 */
export function addEvent(element, event, callback) {
    if (element) {
        element.addEventListener(event, callback);
    }
} 