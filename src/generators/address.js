/**
 * Gerador de endereços e CEPs para a aplicação KQA
 * @author KQA Team
 * @description Funções para geração de endereços válidos brasileiros
 */

import { fakerPT_BR as faker } from "@faker-js/faker";
import { TIPOS_LOGRADOURO, FAIXAS_CEP } from "../constants";
import { DDDS_VALIDOS, obterDDDAleatorio } from "../constants/ddds";

// ============================================================================
// GERAÇÃO DE CEP
// ============================================================================

/**
 * Gera um CEP válido para um estado específico
 * @param {string} estado - Sigla do estado (ex: "SP", "RJ")
 * @returns {string} CEP válido para o estado
 */
export const gerarCEPValido = (estado) => {
	const estadoUpper = estado.toUpperCase();
	const faixa = FAIXAS_CEP[estadoUpper];

	if (!faixa) {
		// Se não encontrar o estado, gera um CEP genérico válido
		return faker.string.numeric(8);
	}

	const inicio = parseInt(faixa.inicio);
	const fim = parseInt(faixa.fim);
	const cepNumerico = Math.floor(Math.random() * (fim - inicio + 1)) + inicio;

	return cepNumerico.toString().padStart(8, "0");
};

/**
 * Gera um CEP aleatório para qualquer estado
 * @returns {string} CEP válido aleatório
 */
export const gerarCEPAleatorio = () => {
	const estados = Object.keys(FAIXAS_CEP);
	const estadoAleatorio = faker.helpers.arrayElement(estados);
	return gerarCEPValido(estadoAleatorio);
};

// ============================================================================
// GERAÇÃO DE ENDEREÇO COMPLETO
// ============================================================================

/**
 * Gera um endereço completo brasileiro
 * @param {string} [estado] - Estado específico (opcional)
 * @returns {Object} Objeto com dados completos do endereço
 */
export const gerarEnderecoCompleto = (estado = null) => {
	const tipoLogradouro = faker.helpers.arrayElement(TIPOS_LOGRADOURO);
	const estadoSelecionado =
		estado || faker.location.state({ abbreviated: true });

	return {
		rua: `${tipoLogradouro} ${faker.location.street()}`,
		numero: faker.string.numeric(4),
		complemento: gerarComplemento(),
		bairro: faker.location.county(),
		cidade: faker.location.city(),
		estado: estadoSelecionado,
		cep: gerarCEPValido(estadoSelecionado),
	};
};

/**
 * Gera apenas a parte da rua do endereço
 * @returns {string} Rua com tipo de logradouro
 */
export const gerarRua = () => {
	const tipoLogradouro = faker.helpers.arrayElement(TIPOS_LOGRADOURO);
	return `${tipoLogradouro} ${faker.location.street()}`;
};

/**
 * Gera número para endereço
 * @param {number} [digitos=4] - Quantidade de dígitos do número
 * @returns {string} Número do endereço
 */
export const gerarNumeroEndereco = (digitos = 4) => {
	return faker.string.numeric(digitos);
};

/**
 * Gera complemento para endereço (apartamento, casa, sala, etc.)
 * @returns {string} Complemento do endereço
 */
export const gerarComplemento = () => {
	const tipos = ["", "Apto", "Casa", "Sala", "Bloco", "Conjunto"];
	const tipoSelecionado = faker.helpers.arrayElement(tipos);

	if (!tipoSelecionado) return "";

	return `${tipoSelecionado} ${faker.string.numeric(3)}`;
};

/**
 * Gera nome de bairro
 * @returns {string} Nome do bairro
 */
export const gerarBairro = () => {
	return faker.location.county();
};

/**
 * Gera nome de cidade
 * @returns {string} Nome da cidade
 */
export const gerarCidade = () => {
	return faker.location.city();
};

// ============================================================================
// GERAÇÃO DE TELEFONE
// ============================================================================

/**
 * Gera um número de telefone brasileiro válido
 * @param {string} [estado] - Estado para filtrar DDD (opcional)
 * @returns {Object} Objeto com DDD e número completo
 */
export const gerarTelefone = (estado = null) => {
	const ddd = obterDDDAleatorio(estado);
	const numeroBase = faker.string.numeric(8);

	return {
		ddd,
		numeroBase,
		numeroCompleto: `(${ddd}) 9${numeroBase.slice(0, 4)}-${numeroBase.slice(
			4
		)}`,
		numeroSemFormatacao: `${ddd}9${numeroBase}`,
	};
};

/**
 * Gera apenas o DDD válido
 * @param {string} [estado] - Estado específico (opcional)
 * @returns {string} DDD válido
 */
export const gerarDDD = (estado = null) => {
	return obterDDDAleatorio(estado);
};

/**
 * Gera número base do telefone (8 dígitos)
 * @returns {string} Número base do telefone
 */
export const gerarNumeroBaseTelefone = () => {
	return faker.string.numeric(8);
};

// ============================================================================
// VALIDAÇÃO DE ENDEREÇO
// ============================================================================

/**
 * Valida se um CEP pertence a um estado específico
 * @param {string} cep - CEP a ser validado
 * @param {string} estado - Estado para validação
 * @returns {boolean} True se o CEP pertence ao estado
 */
export const validarCEPPorEstado = (cep, estado) => {
	const estadoUpper = estado.toUpperCase();
	const faixa = FAIXAS_CEP[estadoUpper];

	if (!faixa) return false;

	const cepNumerico = parseInt(cep.replace(/\D/g, ""));
	const inicio = parseInt(faixa.inicio);
	const fim = parseInt(faixa.fim);

	return cepNumerico >= inicio && cepNumerico <= fim;
};

/**
 * Identifica o estado baseado no CEP
 * @param {string} cep - CEP a ser analisado
 * @returns {string|null} Sigla do estado ou null se não encontrado
 */
export const identificarEstadoPorCEP = (cep) => {
	const cepNumerico = parseInt(cep.replace(/\D/g, ""));

	for (const [estado, faixa] of Object.entries(FAIXAS_CEP)) {
		const inicio = parseInt(faixa.inicio);
		const fim = parseInt(faixa.fim);

		if (cepNumerico >= inicio && cepNumerico <= fim) {
			return estado;
		}
	}

	return null;
};

// ============================================================================
// UTILITÁRIOS DE ENDEREÇO
// ============================================================================

/**
 * Lista todos os tipos de logradouro disponíveis
 * @returns {string[]} Array com todos os tipos de logradouro
 */
export const obterTiposLogradouro = () => {
	return [...TIPOS_LOGRADOURO];
};

/**
 * Lista todos os estados com suas faixas de CEP
 * @returns {Object} Objeto com estados e suas faixas de CEP
 */
export const obterFaixasCEP = () => {
	return { ...FAIXAS_CEP };
};

/**
 * Gera dados de localização completos (endereço + telefone)
 * @param {string} [estado] - Estado específico (opcional)
 * @returns {Object} Objeto com endereço e telefone
 */
export const gerarLocalizacaoCompleta = (estado = null) => {
	const endereco = gerarEnderecoCompleto(estado);
	const telefone = gerarTelefone(estado);

	return {
		endereco,
		telefone,
		localizacao: {
			estado: endereco.estado,
			cidade: endereco.cidade,
			cep: endereco.cep,
			ddd: telefone.ddd,
		},
	};
};
