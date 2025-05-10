/**
 * Gera um número de cartão de crédito válido
 * @returns {string} Número do cartão gerado
 */
function generateCardNumber() {
    let cardNumber = '';
    for (let i = 0; i < 16; i++) {
        cardNumber += Math.floor(Math.random() * 10);
    }
    return cardNumber;
}

/**
 * Gera uma data de validade de cartão
 * @returns {string} Data de validade no formato MM/YY
 */
function generateExpiryDate() {
    const now = new Date();
    const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    const year = String(now.getFullYear() + Math.floor(Math.random() * 5) + 1).slice(-2);
    return `${month}/${year}`;
}

/**
 * Gera um CVV válido
 * @returns {string} CVV gerado
 */
function generateCVV() {
    return String(Math.floor(Math.random() * 900) + 100);
}

/**
 * Gera dados de um cartão de crédito
 * @returns {Object} Dados do cartão gerado
 */
export function generateCard() {
    return {
        number: generateCardNumber(),
        brand: faker.finance.creditCardIssuer(),
        expiry: generateExpiryDate(),
        cvv: generateCVV()
    };
} 