/**
 * Utilitários de validação para a aplicação KQA
 * @author KQA Team
 * @description Funções de validação para documentos, cartões e dados brasileiros
 */

import { BANDEIRAS_CARTAO } from '../constants';
import { validarDDD } from '../constants/ddds';

// ============================================================================
// VALIDAÇÃO DE DOCUMENTOS BRASILEIROS
// ============================================================================

/**
 * Valida CPF usando o algoritmo oficial
 * @param {string} cpf - CPF a ser validado (com ou sem formatação)
 * @returns {boolean} True se o CPF for válido
 */
export const validarCPF = cpf => {
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
};

/**
 * Valida CNPJ usando o algoritmo oficial
 * @param {string} cnpj - CNPJ a ser validado (com ou sem formatação)
 * @returns {boolean} True se o CNPJ for válido
 */
export const validarCNPJ = cnpj => {
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
};

/**
 * Valida RG (formato São Paulo)
 * @param {string} rg - RG a ser validado (com ou sem formatação)
 * @returns {boolean} True se o RG for válido
 */
export const validarRG = rg => {
  if (!rg) return false;

  // Remove formatação
  const rgLimpo = rg.replace(/\D/g, '').replace(/X/gi, 'X');

  // Verifica se tem 9 caracteres (8 dígitos + 1 dígito verificador ou X)
  if (rgLimpo.length !== 9) return false;

  // Extrai os 8 primeiros dígitos
  const numerosRG = rgLimpo.substring(0, 8);
  const digitoVerificador = rgLimpo.charAt(8);

  // Verifica se os 8 primeiros são todos números
  if (!/^\d{8}$/.test(numerosRG)) return false;

  // Calcula o dígito verificador
  let soma = 0;
  const pesos = [2, 3, 4, 5, 6, 7, 8, 9];

  for (let i = 0; i < 8; i++) {
    soma += parseInt(numerosRG[i]) * pesos[i];
  }

  const resto = soma % 11;
  const dvCalculado = resto === 10 ? 'X' : resto.toString();

  return digitoVerificador.toUpperCase() === dvCalculado;
};

// ============================================================================
// VALIDAÇÃO DE CARTÃO DE CRÉDITO
// ============================================================================

/**
 * Valida número de cartão de crédito usando algoritmo de Luhn
 * @param {string} numero - Número do cartão (com ou sem formatação)
 * @returns {boolean} True se o número for válido
 */
export const validarNumeroCartao = numero => {
  if (!numero) return false;

  // Remove formatação
  const numeroLimpo = numero.replace(/\D/g, '');

  // Verifica se tem pelo menos 13 dígitos
  if (numeroLimpo.length < 13 || numeroLimpo.length > 19) return false;

  // Algoritmo de Luhn
  let soma = 0;
  let dobra = false;

  for (let i = numeroLimpo.length - 1; i >= 0; i--) {
    let digito = parseInt(numeroLimpo[i]);

    if (dobra) {
      digito *= 2;
      if (digito > 9) {
        digito -= 9;
      }
    }

    soma += digito;
    dobra = !dobra;
  }

  return soma % 10 === 0;
};

/**
 * Detecta a bandeira do cartão baseado no número
 * @param {string} numero - Número do cartão
 * @returns {string} Nome da bandeira ou "desconhecida"
 */
export const detectarBandeiraCartao = numero => {
  if (!numero) return 'desconhecida';

  const numeroLimpo = numero.replace(/\D/g, '');

  for (const [bandeira, config] of Object.entries(BANDEIRAS_CARTAO)) {
    for (const prefixo of config.prefixos) {
      if (numeroLimpo.startsWith(prefixo)) {
        return bandeira;
      }
    }
  }

  return 'desconhecida';
};

/**
 * Valida CVV baseado na bandeira do cartão
 * @param {string} cvv - Código de segurança
 * @param {string} bandeira - Bandeira do cartão
 * @returns {boolean} True se o CVV for válido
 */
export const validarCVV = (cvv, bandeira) => {
  if (!cvv) return false;

  const cvvLimpo = cvv.replace(/\D/g, '');

  // American Express usa 4 dígitos, outros usam 3
  const tamanhoEsperado = bandeira === 'amex' ? 4 : 3;

  return cvvLimpo.length === tamanhoEsperado;
};

/**
 * Valida data de validade do cartão
 * @param {string} validade - Data no formato MM/AA ou MM/AAAA
 * @returns {boolean} True se a validade for válida e futura
 */
export const validarValidadeCartao = validade => {
  if (!validade) return false;

  const regex = /^(0[1-9]|1[0-2])\/(\d{2}|\d{4})$/;
  const match = validade.match(regex);

  if (!match) return false;

  const mes = parseInt(match[1]);
  let ano = parseInt(match[2]);

  // Se ano tem 2 dígitos, assume 20XX
  if (ano < 100) {
    ano += 2000;
  }

  const dataValidade = new Date(ano, mes - 1); // -1 porque mês no Date é 0-indexed
  const agora = new Date();

  // Verifica se a validade é futura
  return dataValidade > agora;
};

// ============================================================================
// VALIDAÇÃO DE TELEFONE
// ============================================================================

/**
 * Valida número de telefone brasileiro
 * @param {string} telefone - Telefone a ser validado
 * @returns {boolean} True se o telefone for válido
 */
export const validarTelefone = telefone => {
  if (!telefone) return false;

  // Remove formatação
  const telefoneLimpo = telefone.replace(/\D/g, '');

  // Verifica se tem 11 dígitos (DDD + 9 dígitos)
  if (telefoneLimpo.length !== 11) return false;

  // Extrai DDD
  const ddd = telefoneLimpo.substring(0, 2);

  // Valida DDD
  if (!validarDDD(ddd)) return false;

  // Verifica se o terceiro dígito é 9 (celular)
  const terceiroDigito = telefoneLimpo.charAt(2);
  if (terceiroDigito !== '9') return false;

  return true;
};

// ============================================================================
// VALIDAÇÃO DE EMAIL
// ============================================================================

/**
 * Valida formato de email
 * @param {string} email - E-mail a ser validado
 * @returns {boolean} True se o email for válido
 */
export const validarEmail = email => {
  if (!email) return false;

  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regexEmail.test(email);
};

/**
 * Valida se o email é um email de teste (domínio @teste.com)
 * @param {string} email - E-mail a ser validado
 * @returns {boolean} True se for email de teste
 */
export const isEmailTeste = email => {
  if (!email) return false;
  return email.endsWith('@teste.com');
};

// ============================================================================
// VALIDAÇÃO DE CEP
// ============================================================================

/**
 * Valida formato de CEP brasileiro
 * @param {string} cep - CEP a ser validado
 * @returns {boolean} True se o formato for válido
 */
export const validarFormatoCEP = cep => {
  if (!cep) return false;

  const cepLimpo = cep.replace(/\D/g, '');
  return cepLimpo.length === 8;
};

// ============================================================================
// VALIDAÇÃO DE DADOS COMPLETOS
// ============================================================================

/**
 * Valida objeto pessoa completo
 * @param {Object} pessoa - Objeto com dados da pessoa
 * @returns {Object} Resultado da validação com detalhes
 */
export const validarPessoaCompleta = pessoa => {
  const resultado = {
    valido: true,
    erros: [],
  };

  if (!pessoa) {
    resultado.valido = false;
    resultado.erros.push('Objeto pessoa não fornecido');
    return resultado;
  }

  // Valida nome
  if (!pessoa.nome || pessoa.nome.trim().length < 2) {
    resultado.valido = false;
    resultado.erros.push('Nome deve ter pelo menos 2 caracteres');
  }

  // Valida email
  if (!validarEmail(pessoa.email)) {
    resultado.valido = false;
    resultado.erros.push('E-mail inválido');
  }

  // Valida telefone
  if (!validarTelefone(pessoa.telefone)) {
    resultado.valido = false;
    resultado.erros.push('Telefone inválido');
  }

  // Valida endereço
  if (pessoa.endereco) {
    if (!validarFormatoCEP(pessoa.endereco.cep)) {
      resultado.valido = false;
      resultado.erros.push('CEP inválido');
    }

    if (!pessoa.endereco.rua || pessoa.endereco.rua.trim().length < 5) {
      resultado.valido = false;
      resultado.erros.push('Rua deve ter pelo menos 5 caracteres');
    }

    if (!pessoa.endereco.cidade || pessoa.endereco.cidade.trim().length < 2) {
      resultado.valido = false;
      resultado.erros.push('Cidade deve ter pelo menos 2 caracteres');
    }

    if (!pessoa.endereco.estado || pessoa.endereco.estado.length !== 2) {
      resultado.valido = false;
      resultado.erros.push('Estado deve ter 2 caracteres');
    }
  }

  return resultado;
};

/**
 * Valida objeto cartão completo
 * @param {Object} cartao - Objeto com dados do cartão
 * @returns {Object} Resultado da validação com detalhes
 */
export const validarCartaoCompleto = cartao => {
  const resultado = {
    valido: true,
    erros: [],
  };

  if (!cartao) {
    resultado.valido = false;
    resultado.erros.push('Objeto cartão não fornecido');
    return resultado;
  }

  // Valida número
  if (!validarNumeroCartao(cartao.numero)) {
    resultado.valido = false;
    resultado.erros.push('Número do cartão inválido');
  }

  // Valida CVV
  const bandeira = detectarBandeiraCartao(cartao.numero);
  if (!validarCVV(cartao.cvv, bandeira)) {
    resultado.valido = false;
    resultado.erros.push('CVV inválido para a bandeira detectada');
  }

  // Valida validade
  if (!validarValidadeCartao(cartao.validade)) {
    resultado.valido = false;
    resultado.erros.push('Data de validade inválida ou expirada');
  }

  // Valida nome
  if (!cartao.nome || cartao.nome.trim().length < 2) {
    resultado.valido = false;
    resultado.erros.push('Nome do portador deve ter pelo menos 2 caracteres');
  }

  return resultado;
};
