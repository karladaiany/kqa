/**
 * Cartões de teste Erede com dados reais
 * @author KQA Team
 * @description Cartões de teste válidos para a plataforma Erede
 */

import { fakerPT_BR as faker } from '@faker-js/faker';

export const eredeTestCards = [
  {
    bandeira: 'Mastercard',
    tipo: 'Débito',
    numero: '5277696455399733',
    validade: '01/35',
    cvv: '123',
    option: 'Mastercard Débito',
  },
  {
    bandeira: 'Mastercard',
    tipo: 'Crédito',
    numero: '5448280000000007',
    validade: '01/35',
    cvv: '123',
    option: 'Mastercard Crédito',
  },
  {
    bandeira: 'Visa',
    tipo: 'Débito',
    numero: '4761120000000148',
    validade: '01/35',
    cvv: '123',
    option: 'Visa Débito',
  },
  {
    bandeira: 'Visa',
    tipo: 'Crédito',
    numero: '4235647728025682',
    validade: '01/35',
    cvv: '123',
    option: 'Visa Crédito',
  },
  {
    bandeira: 'Hipercard',
    tipo: 'Crédito',
    numero: '6062825624254001',
    validade: '01/35',
    cvv: '123',
    option: 'Hipercard Crédito',
  },
  {
    bandeira: 'Hiper',
    tipo: 'Crédito',
    numero: '6370950847866501',
    validade: '01/35',
    cvv: '123',
    option: 'Hiper Crédito',
  },
  {
    bandeira: 'Diners',
    tipo: 'Crédito',
    numero: '36490101441625',
    validade: '01/35',
    cvv: '123',
    option: 'Diners Crédito',
  },
  {
    bandeira: 'JCB',
    tipo: 'Crédito',
    numero: '3569990012290937',
    validade: '01/35',
    cvv: '123',
    option: 'JCB Crédito',
  },
  {
    bandeira: 'Credz',
    tipo: 'Crédito',
    numero: '6367600001405019',
    validade: '01/35',
    cvv: '123',
    option: 'Credz Crédito',
  },
  {
    bandeira: 'Amex',
    tipo: 'Crédito',
    numero: '371341553758128',
    validade: '01/35',
    cvv: '1234',
    option: 'Amex Crédito',
  },
  {
    bandeira: 'Cabal',
    tipo: 'Crédito',
    numero: '6042034400069940',
    validade: '01/35',
    cvv: '123',
    option: 'Cabal Crédito',
  },
  {
    bandeira: 'Sorocred',
    tipo: 'Crédito',
    numero: '6364142000000122',
    validade: '01/35',
    cvv: '123',
    option: 'Sorocred Crédito',
  },
  {
    bandeira: 'Credsystem',
    tipo: 'Crédito',
    numero: '6280281038975334',
    validade: '01/35',
    cvv: '123',
    option: 'Credsystem Crédito',
  },
  {
    bandeira: 'Banescard',
    tipo: 'Crédito',
    numero: '6031828795629272',
    validade: '01/35',
    cvv: '123',
    option: 'Banescard Crédito',
  },
  {
    bandeira: 'Elo',
    tipo: 'Crédito',
    numero: '4389358876174389',
    validade: '01/35',
    cvv: '123',
    option: 'Elo Crédito',
  },
  {
    bandeira: 'Elo',
    tipo: 'Débito',
    numero: '5067230000009011',
    validade: '01/35',
    cvv: '123',
    option: 'Elo Débito',
  },
  {
    bandeira: 'Elo',
    tipo: 'Voucher',
    numero: '5041758436269362',
    validade: '01/35',
    cvv: '123',
    option: 'Elo Voucher',
  },
  {
    bandeira: 'Ticket',
    tipo: 'Voucher',
    numero: '4514166603616681',
    validade: '01/35',
    cvv: '123',
    option: 'Ticket Voucher',
  },
  {
    bandeira: 'Alelo',
    tipo: 'Voucher',
    numero: '4389357063526690',
    validade: '01/35',
    cvv: '123',
    option: 'Alelo Voucher',
  },
  {
    bandeira: 'Sodexo',
    tipo: 'Voucher',
    numero: '6363688827373622',
    validade: '01/35',
    cvv: '123',
    option: 'Sodexo Voucher',
  },
  {
    bandeira: 'Caju',
    tipo: 'Voucher',
    numero: '5284776885068867',
    validade: '01/35',
    cvv: '123',
    option: 'Caju Voucher',
  },
  {
    bandeira: 'Flex',
    tipo: 'Voucher',
    numero: '5490630354637860',
    validade: '01/35',
    cvv: '123',
    option: 'Flex Voucher',
  },
];

/**
 * Gera nome para cartão de crédito em maiúsculas
 * @returns {string} Nome em maiúsculas
 */
export const gerarNomeCartaoErede = () => {
  return faker.person.fullName().toUpperCase();
};

/**
 * Busca cartão por option (bandeira + tipo)
 * @param {string} option - Opção selecionada (bandeira + tipo)
 * @returns {Object} Dados do cartão (sem nome - deve ser gerado externamente)
 */
export const getEredeTestCardByOption = option => {
  const card = eredeTestCards.find(card => card.option === option);
  if (card) {
    return { ...card };
  }
  // Fallback para o primeiro cartão
  return { ...eredeTestCards[0] };
};

/**
 * Busca cartão por status (mantido para compatibilidade)
 * @param {string} _status - Status do cartão (não utilizado, mantido para compatibilidade)
 * @returns {Object} Dados do cartão (sem nome - deve ser gerado externamente)
 */
export const getEredeTestCardByStatus = _status => {
  // Para compatibilidade, retorna o primeiro cartão Mastercard Crédito
  return { ...eredeTestCards[1] }; // Mastercard Crédito
};

/**
 * Retorna todas as opções de bandeira+tipo para o select
 * @returns {Array} Array com opções para o select
 */
export const getEredeTestCardStatuses = () => {
  return eredeTestCards.map(card => ({
    status: card.option,
    description: card.option,
  }));
};
