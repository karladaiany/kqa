/**
 * Utilitários de formatação para a aplicação KQA
 * @author KQA Team
 * @description Funções para formatação de documentos, números e textos
 */

import { FORMATOS_DOCUMENTOS, MASCARAS_DOCUMENTOS } from '../constants';

// ============================================================================
// FORMATAÇÃO DE DOCUMENTOS
// ============================================================================

/**
 * Formata um CPF aplicando a máscara xxx.xxx.xxx-xx
 * @param {string} cpf - CPF sem formatação
 * @returns {string} CPF formatado
 */
export const formatarCPF = cpf => {
  if (!cpf) return '';
  return cpf.replace(FORMATOS_DOCUMENTOS.CPF, MASCARAS_DOCUMENTOS.CPF);
};

/**
 * Formata um CNPJ aplicando a máscara xx.xxx.xxx/xxxx-xx
 * @param {string} cnpj - CNPJ sem formatação
 * @returns {string} CNPJ formatado
 */
export const formatarCNPJ = cnpj => {
  if (!cnpj) return '';
  return cnpj.replace(FORMATOS_DOCUMENTOS.CNPJ, MASCARAS_DOCUMENTOS.CNPJ);
};

/**
 * Formata um RG aplicando a máscara xx.xxx.xxx-x
 * @param {string} rg - RG sem formatação
 * @returns {string} RG formatado
 */
export const formatarRG = rg => {
  if (!rg) return '';
  return rg.replace(FORMATOS_DOCUMENTOS.RG, MASCARAS_DOCUMENTOS.RG);
};

// ============================================================================
// FORMATAÇÃO DE CARTÃO DE CRÉDITO
// ============================================================================

/**
 * Formata número de cartão de crédito conforme a bandeira
 * @param {string} numero - Número do cartão sem formatação
 * @param {string} bandeira - Bandeira do cartão (visa, mastercard, amex, etc.)
 * @returns {string} Número formatado com espaços
 */
export const formatarNumeroCartao = (numero, bandeira) => {
  if (!numero) return '';

  // AMEX: 4 + 6 + 5 dígitos
  if (bandeira && bandeira.toLowerCase() === 'amex') {
    return numero.replace(/(\d{4})(\d{6})(\d{5})/, '$1 $2 $3');
  }

  // Outros cartões: grupos de 4 dígitos
  return numero.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, '$1 $2 $3 $4');
};

/**
 * Formata validade do cartão no formato MM/AA
 * @param {string|Date} validade - Data de validade
 * @returns {string} Validade formatada
 */
export const formatarValidadeCartao = validade => {
  if (!validade) return '';

  if (validade instanceof Date) {
    return validade.toLocaleDateString('pt-BR', {
      month: '2-digit',
      year: '2-digit',
    });
  }

  return validade;
};

// ============================================================================
// FORMATAÇÃO DE TELEFONE
// ============================================================================

/**
 * Formata número de telefone no padrão brasileiro (xx) 9xxxx-xxxx
 * @param {string} ddd - Código de área
 * @param {string} numeroBase - Número base do telefone
 * @returns {string} Telefone formatado
 */
export const formatarTelefone = (ddd, numeroBase) => {
  if (!ddd || !numeroBase) return '';

  return `(${ddd}) 9${numeroBase.slice(0, 4)}-${numeroBase.slice(4)}`;
};

/**
 * Formata telefone completo a partir de string
 * @param {string} telefone - Telefone sem formatação (apenas números)
 * @returns {string} Telefone formatado
 */
export const formatarTelefoneCompleto = telefone => {
  if (!telefone) return '';

  // Remove todos os caracteres não numéricos
  const apenasNumeros = telefone.replace(/\D/g, '');

  // Verifica se tem o tamanho correto (11 dígitos)
  if (apenasNumeros.length !== 11) return telefone;

  const ddd = apenasNumeros.slice(0, 2);
  const numero = apenasNumeros.slice(2);

  return `(${ddd}) ${numero.slice(0, 5)}-${numero.slice(5)}`;
};

// ============================================================================
// FORMATAÇÃO DE ENDEREÇO
// ============================================================================

/**
 * Formata CEP no padrão xxxxx-xxx
 * @param {string} cep - CEP sem formatação
 * @returns {string} CEP formatado
 */
export const formatarCEP = cep => {
  if (!cep) return '';

  const apenasNumeros = cep.replace(/\D/g, '');
  if (apenasNumeros.length !== 8) return cep;

  return apenasNumeros.replace(/(\d{5})(\d{3})/, '$1-$2');
};

/**
 * Formata endereço completo
 * @param {Object} endereco - Objeto com dados do endereço
 * @returns {string} Endereço formatado em uma linha
 */
export const formatarEnderecoCompleto = endereco => {
  if (!endereco) return '';

  const { rua, numero, complemento, bairro, cidade, estado, cep } = endereco;

  let enderecoFormatado = `${rua || ''}`;
  if (numero) enderecoFormatado += `, ${numero}`;
  if (complemento && complemento.trim())
    enderecoFormatado += `, ${complemento}`;
  if (bairro) enderecoFormatado += ` - ${bairro}`;
  if (cidade) enderecoFormatado += `, ${cidade}`;
  if (estado) enderecoFormatado += `/${estado}`;
  if (cep) enderecoFormatado += ` - ${formatarCEP(cep)}`;

  return enderecoFormatado;
};

// ============================================================================
// FORMATAÇÃO DE TEXTO
// ============================================================================

/**
 * Remove acentos de uma string
 * @param {string} texto - Texto com acentos
 * @returns {string} Texto sem acentos e em lowercase
 */
export const removerAcentos = texto => {
  if (!texto) return '';

  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '.');
};

/**
 * Formata nome para email
 * @param {string} nome - Nome completo
 * @returns {string} Nome formatado para email
 */
export const formatarNomeParaEmail = nome => {
  if (!nome) return '';

  return removerAcentos(nome.replace(/\s+/g, '.'));
};

/**
 * Capitaliza primeira letra de cada palavra
 * @param {string} texto - Texto a ser capitalizado
 * @returns {string} Texto com primeira letra de cada palavra em maiúscula
 */
export const capitalizarPalavras = texto => {
  if (!texto) return '';

  return texto
    .toLowerCase()
    .split(' ')
    .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1))
    .join(' ');
};

/**
 * Formata texto para maiúsculas (usado em nomes de cartão)
 * @param {string} texto - Texto a ser formatado
 * @returns {string} Texto em maiúsculas
 */
export const formatarParaMaiusculas = texto => {
  if (!texto) return '';
  return texto.toUpperCase();
};

// ============================================================================
// FORMATAÇÃO DE MOEDA
// ============================================================================

/**
 * Formata valor monetário em Real brasileiro
 * @param {number} valor - Valor numérico
 * @returns {string} Valor formatado em BRL
 */
export const formatarMoeda = valor => {
  if (typeof valor !== 'number') return 'R$ 0,00';

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor);
};

/**
 * Formata número com separadores de milhares
 * @param {number} numero - Número a ser formatado
 * @returns {string} Número formatado com pontos separadores
 */
export const formatarNumero = numero => {
  if (typeof numero !== 'number') return '0';

  return new Intl.NumberFormat('pt-BR').format(numero);
};

// ============================================================================
// FORMATAÇÃO DE DATA
// ============================================================================

/**
 * Formata data para o padrão brasileiro dd/mm/aaaa
 * @param {Date|string} data - Data a ser formatada
 * @returns {string} Data formatada
 */
export const formatarData = data => {
  if (!data) return '';

  const dataObj = data instanceof Date ? data : new Date(data);

  if (isNaN(dataObj.getTime())) return '';

  return dataObj.toLocaleDateString('pt-BR');
};

/**
 * Formata data e hora para o padrão brasileiro
 * @param {Date|string} data - Data a ser formatada
 * @returns {string} Data e hora formatadas
 */
export const formatarDataHora = data => {
  if (!data) return '';

  const dataObj = data instanceof Date ? data : new Date(data);

  if (isNaN(dataObj.getTime())) return '';

  return dataObj.toLocaleString('pt-BR');
};
