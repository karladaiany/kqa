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
 * Gera um RG válido no formato de São Paulo
 * O dígito verificador é calculado usando a regra:
 * 1. Multiplica cada dígito por um peso (2,3,4,5,6,7,8,9)
 * 2. Soma os resultados
 * 3. Divide por 11 e pega o resto
 * 4. Se o resto for 10, o DV é X, senão é o próprio resto
 * @returns {string} RG gerado
 */
export function generateRG() {
  // Gera os 8 primeiros dígitos
  let rg = '';
  for (let i = 0; i < 8; i++) {
    rg += Math.floor(Math.random() * 10);
  }

  // Calcula o dígito verificador
  let soma = 0;
  const pesos = [2, 3, 4, 5, 6, 7, 8, 9];

  for (let i = 0; i < 8; i++) {
    soma += parseInt(rg[i]) * pesos[i];
  }

  const resto = soma % 11;
  const dv = resto === 10 ? 'X' : resto.toString();

  return rg + dv;
}

/**
 * Formata um CPF aplicando a máscara xxx.xxx.xxx-xx
 * @param {string} cpf - CPF sem formatação
 * @returns {string} CPF formatado
 */
export function formatCPF(cpf) {
  if (!cpf) return '';

  // Remove formatação existente
  const apenasNumeros = cpf.replace(/\D/g, '');

  // Verifica se tem 11 dígitos
  if (apenasNumeros.length !== 11) return cpf;

  // Aplica a formatação
  return apenasNumeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

/**
 * Formata um CNPJ aplicando a máscara xx.xxx.xxx/xxxx-xx
 * @param {string} cnpj - CNPJ sem formatação
 * @returns {string} CNPJ formatado
 */
export function formatCNPJ(cnpj) {
  if (!cnpj) return '';

  // Remove formatação existente
  const apenasNumeros = cnpj.replace(/\D/g, '');

  // Verifica se tem 14 dígitos
  if (apenasNumeros.length !== 14) return cnpj;

  // Aplica a formatação
  return apenasNumeros.replace(
    /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
    '$1.$2.$3/$4-$5'
  );
}

/**
 * Formata um RG aplicando a máscara xx.xxx.xxx-x
 * @param {string} rg - RG sem formatação
 * @returns {string} RG formatado
 */
export function formatRG(rg) {
  if (!rg) return '';

  // Remove formatação existente mas preserva o X no final
  const rgLimpo = rg.toString().replace(/[^\dX]/gi, '');

  // Verifica se tem 9 caracteres
  if (rgLimpo.length !== 9) return rg;

  // Aplica a formatação
  return rgLimpo.replace(/(\d{2})(\d{3})(\d{3})([0-9X])/i, '$1.$2.$3-$4');
}

/**
 * Valida CPF usando o algoritmo oficial
 * @param {string} cpf - CPF a ser validado (com ou sem formatação)
 * @returns {boolean} True se o CPF for válido
 */
export function validateCPF(cpf) {
  if (!cpf) return false;

  // Remove formatação
  const cpfLimpo = cpf.replace(/\D/g, '');

  // Verifica se tem 11 dígitos
  if (cpfLimpo.length !== 11) return false;

  // Verifica se todos os dígitos são iguais (CPF inválido)
  if (/^(\d)\1{10}$/.test(cpfLimpo)) return false;

  // Validação do primeiro dígito verificador
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpfLimpo.charAt(i)) * (10 - i);
  }
  let resto = soma % 11;
  const digito1 = resto < 2 ? 0 : 11 - resto;

  if (parseInt(cpfLimpo.charAt(9)) !== digito1) return false;

  // Validação do segundo dígito verificador
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpfLimpo.charAt(i)) * (11 - i);
  }
  resto = soma % 11;
  const digito2 = resto < 2 ? 0 : 11 - resto;

  return parseInt(cpfLimpo.charAt(10)) === digito2;
}

/**
 * Valida CNPJ usando o algoritmo oficial
 * @param {string} cnpj - CNPJ a ser validado (com ou sem formatação)
 * @returns {boolean} True se o CNPJ for válido
 */
export function validateCNPJ(cnpj) {
  if (!cnpj) return false;

  // Remove formatação
  const cnpjLimpo = cnpj.replace(/\D/g, '');

  // Verifica se tem 14 dígitos
  if (cnpjLimpo.length !== 14) return false;

  // Verifica se todos os dígitos são iguais (CNPJ inválido)
  if (/^(\d)\1{13}$/.test(cnpjLimpo)) return false;

  // Validação do primeiro dígito verificador
  let peso = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let soma = 0;
  for (let i = 0; i < 12; i++) {
    soma += parseInt(cnpjLimpo.charAt(i)) * peso[i];
  }
  let resto = soma % 11;
  const digito1 = resto < 2 ? 0 : 11 - resto;

  if (parseInt(cnpjLimpo.charAt(12)) !== digito1) return false;

  // Validação do segundo dígito verificador
  peso = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  soma = 0;
  for (let i = 0; i < 13; i++) {
    soma += parseInt(cnpjLimpo.charAt(i)) * peso[i];
  }
  resto = soma % 11;
  const digito2 = resto < 2 ? 0 : 11 - resto;

  return parseInt(cnpjLimpo.charAt(13)) === digito2;
}
