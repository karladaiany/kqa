import { DDDsValidos } from '../config/ddds.js';

/**
 * Normaliza texto removendo acentos
 * @param {string} text - Texto a ser normalizado
 * @returns {string} Texto normalizado
 */
function normalizeText(text) {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * Gera um número de telefone válido
 * @returns {string} Número de telefone gerado
 */
function generateValidPhone() {
  const ddd = DDDsValidos[Math.floor(Math.random() * DDDsValidos.length)];
  const number = Math.floor(10000000 + Math.random() * 90000000);
  return `${ddd}${number}`;
}

/**
 * Gera dados de uma pessoa
 * @returns {Object} Dados da pessoa gerada
 */
export function generatePerson() {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const email = faker.internet.email(firstName, lastName).toLowerCase();

  return {
    nome: `${firstName} ${lastName}`,
    email: normalizeText(email),
    telefone: generateValidPhone(),
    celular: generateValidPhone(),
    rua: faker.address.streetName(),
    numero: faker.address.buildingNumber(),
    bairro: faker.address.county(),
    cidade: faker.address.city(),
    estado: faker.address.state(),
    cep: faker.address.zipCode('#####-###'),
  };
}
