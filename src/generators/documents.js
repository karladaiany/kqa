/**
 * Gera um CPF válido
 * @returns {string} CPF gerado
 */
export function generateCPF() {
    let cpf = '';
    for (let i = 0; i < 9; i++) {
        cpf += Math.floor(Math.random() * 10);
    }

    // Calcula primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let digit1 = 11 - (sum % 11);
    if (digit1 > 9) digit1 = 0;
    cpf += digit1;

    // Calcula segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    let digit2 = 11 - (sum % 11);
    if (digit2 > 9) digit2 = 0;
    cpf += digit2;

    return cpf;
}

/**
 * Gera um CNPJ válido
 * @returns {string} CNPJ gerado
 */
export function generateCNPJ() {
    let cnpj = '';
    for (let i = 0; i < 12; i++) {
        cnpj += Math.floor(Math.random() * 10);
    }

    // Calcula primeiro dígito verificador
    let sum = 0;
    let weight = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    for (let i = 0; i < 12; i++) {
        sum += parseInt(cnpj.charAt(i)) * weight[i];
    }
    let digit1 = 11 - (sum % 11);
    if (digit1 > 9) digit1 = 0;
    cnpj += digit1;

    // Calcula segundo dígito verificador
    sum = 0;
    weight = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    for (let i = 0; i < 13; i++) {
        sum += parseInt(cnpj.charAt(i)) * weight[i];
    }
    let digit2 = 11 - (sum % 11);
    if (digit2 > 9) digit2 = 0;
    cnpj += digit2;

    return cnpj;
}

/**
 * Gera um RG válido
 * @returns {string} RG gerado
 */
export function generateRG() {
    let rg = '';
    for (let i = 0; i < 8; i++) {
        rg += Math.floor(Math.random() * 10);
    }
    return rg;
} 