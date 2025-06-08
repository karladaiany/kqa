/**
 * Gerador de cartões de crédito para a aplicação KQA
 * @author KQA Team
 * @description Funções para geração de cartões de crédito válidos
 */

import { fakerPT_BR as faker } from "@faker-js/faker";
import { BANDEIRAS_CARTAO, TIPOS_CARTAO } from "../constants";
import {
	formatarNumeroCartao,
	formatarValidadeCartao,
	formatarParaMaiusculas,
} from "../utils/formatters";
import { detectarBandeiraCartao } from "../utils/validators";
import { getEredeTestCardByStatus } from "./eredeTestCards";

// ============================================================================
// GERAÇÃO DE NÚMERO DE CARTÃO
// ============================================================================

/**
 * Gera número de cartão válido usando algoritmo de Luhn
 * @param {string} bandeira - Bandeira do cartão
 * @param {string} tipo - Tipo do cartão (credito/debito)
 * @returns {string} Número de cartão válido
 */
export const gerarNumeroCartao = (bandeira, tipo) => {
	// Se o tipo for 'multiplo', seleciona aleatoriamente entre crédito e débito
	if (tipo === "multiplo") {
		tipo = faker.helpers.arrayElement(["credito", "debito"]);
	}

	// Validação da configuração da bandeira
	if (!bandeira || !BANDEIRAS_CARTAO[bandeira]) {
		// Se não especificar bandeira, gera aleatório (excluindo erede)
		const todasBandeiras = Object.keys(BANDEIRAS_CARTAO).filter(
			(b) => b !== "erede"
		);
		bandeira = faker.helpers.arrayElement(todasBandeiras);
	}

	const config = BANDEIRAS_CARTAO[bandeira];

	// Verifica se o array de prefixos não está vazio
	if (!config.prefixos || config.prefixos.length === 0) {
		throw new Error(
			`Configuração inválida para bandeira ${bandeira}: prefixos vazio`
		);
	}

	const prefixo = faker.helpers.arrayElement(config.prefixos);
	const tamanho = faker.helpers.arrayElement(config.tamanhos);

	// Gera os dígitos restantes
	const numeroBase =
		prefixo + faker.string.numeric(tamanho - prefixo.length - 1);

	// Implementação do algoritmo de Luhn para gerar o dígito verificador
	let soma = 0;
	let dobra = false;

	for (let i = numeroBase.length - 1; i >= 0; i--) {
		let digito = parseInt(numeroBase[i]);

		if (dobra) {
			digito *= 2;
			if (digito > 9) {
				digito -= 9;
			}
		}

		soma += digito;
		dobra = !dobra;
	}

	const digitoVerificador = ((Math.floor(soma / 10) + 1) * 10 - soma) % 10;
	return numeroBase + digitoVerificador;
};

/**
 * Gera número de cartão aleatório
 * @returns {string} Número de cartão válido aleatório
 */
export const gerarNumeroCartaoAleatorio = () => {
	const bandeiraAleatoria = faker.helpers.arrayElement(
		Object.keys(BANDEIRAS_CARTAO)
	);
	const tipoAleatorio = faker.helpers.arrayElement(TIPOS_CARTAO);
	return gerarNumeroCartao(bandeiraAleatoria, tipoAleatorio);
};

// ============================================================================
// GERAÇÃO DE DADOS COMPLEMENTARES
// ============================================================================

/**
 * Gera nome para cartão de crédito
 * @returns {string} Nome em maiúsculas
 */
export const gerarNomeCartao = () => {
	return formatarParaMaiusculas(faker.person.fullName());
};

/**
 * Gera data de validade futura para cartão
 * @returns {string} Data de validade no formato MM/AA
 */
export const gerarValidadeCartao = () => {
	const dataFutura = faker.date.future();
	return formatarValidadeCartao(dataFutura);
};

/**
 * Gera CVV baseado na bandeira
 * @param {string} bandeira - Bandeira do cartão
 * @returns {string} CVV válido
 */
export const gerarCVV = (bandeira) => {
	const digitos = bandeira === "amex" ? 4 : 3;
	return faker.string.numeric(digitos);
};

// ============================================================================
// GERAÇÃO DE CARTÃO COMPLETO
// ============================================================================

/**
 * Gera cartão de crédito completo
 * @param {string} [bandeira=""] - Bandeira específica (opcional)
 * @param {string} [tipo=""] - Tipo específico (opcional)
 * @param {string} [eredeStatus=""] - Status para cartões Erede (opcional)
 * @returns {Object} Objeto com dados completos do cartão
 */
export const gerarCartaoCredito = (
	bandeira = "",
	tipo = "",
	eredeStatus = ""
) => {
	// Caso especial para cartões Erede
	if (bandeira.toLowerCase() === "erede") {
		return gerarCartaoErede(eredeStatus);
	}

	// Se o tipo for 'multiplo', seleciona aleatoriamente entre crédito e débito
	let tipoReal = tipo;
	if (tipo === "multiplo") {
		tipoReal = faker.helpers.arrayElement(["credito", "debito"]);
	}

	// Gera número do cartão
	const numero = gerarNumeroCartao(bandeira, tipoReal);
	const bandeiraSelecionada = bandeira || detectarBandeiraCartao(numero);

	return {
		numero,
		numeroFormatado: formatarNumeroCartao(numero, bandeiraSelecionada),
		nome: gerarNomeCartao(),
		validade: gerarValidadeCartao(),
		cvv: gerarCVV(bandeiraSelecionada),
		bandeira: bandeiraSelecionada.toUpperCase(),
		tipo:
			tipo === "multiplo"
				? `${tipoReal} (múltiplo)`
				: tipoReal || "credito",
		isErede: false,
	};
};

/**
 * Gera cartão Erede específico
 * @param {string} eredeStatus - Status do cartão Erede
 * @returns {Object} Objeto com dados do cartão Erede
 */
export const gerarCartaoErede = (eredeStatus = "APROVADA") => {
	const eredeCard = getEredeTestCardByStatus(eredeStatus);

	return {
		numero: eredeCard.number,
		numeroFormatado: formatarNumeroCartao(eredeCard.number, "erede"),
		nome: eredeCard.name,
		validade: eredeCard.expiry,
		cvv: eredeCard.cvv,
		bandeira: "EREDE",
		tipo: "",
		isErede: true,
	};
};

/**
 * Gera cartão aleatório de qualquer bandeira
 * @returns {Object} Objeto com dados completos do cartão aleatório
 */
export const gerarCartaoAleatorio = () => {
	const bandeiraAleatoria = faker.helpers.arrayElement(
		Object.keys(BANDEIRAS_CARTAO)
	);
	const tipoAleatorio = faker.helpers.arrayElement(TIPOS_CARTAO);
	return gerarCartaoCredito(bandeiraAleatoria, tipoAleatorio);
};

// ============================================================================
// CONFIGURAÇÕES DE CARTÃO
// ============================================================================

/**
 * Obtém lista de bandeiras disponíveis
 * @returns {string[]} Array com nomes das bandeiras
 */
export const obterBandeirasDisponiveis = () => {
	return Object.keys(BANDEIRAS_CARTAO);
};

/**
 * Obtém lista de tipos de cartão disponíveis
 * @returns {string[]} Array com tipos de cartão
 */
export const obterTiposCartao = () => {
	return [...TIPOS_CARTAO];
};

/**
 * Obtém configuração de uma bandeira específica
 * @param {string} bandeira - Nome da bandeira
 * @returns {Object|null} Configuração da bandeira ou null se não encontrada
 */
export const obterConfiguracaoBandeira = (bandeira) => {
	return BANDEIRAS_CARTAO[bandeira] || null;
};

/**
 * Verifica se uma bandeira é válida
 * @param {string} bandeira - Nome da bandeira
 * @returns {boolean} True se a bandeira for válida
 */
export const isBandeiraValida = (bandeira) => {
	return bandeira && BANDEIRAS_CARTAO.hasOwnProperty(bandeira);
};

/**
 * Verifica se um tipo de cartão é válido
 * @param {string} tipo - Tipo do cartão
 * @returns {boolean} True se o tipo for válido
 */
export const isTipoCartaoValido = (tipo) => {
	return tipo && (TIPOS_CARTAO.includes(tipo) || tipo === "multiplo");
};

// ============================================================================
// UTILITÁRIOS ESPECIALIZADOS
// ============================================================================

/**
 * Gera múltiplos cartões para teste
 * @param {number} quantidade - Quantidade de cartões a gerar
 * @param {string} [bandeira] - Bandeira específica (opcional)
 * @param {string} [tipo] - Tipo específico (opcional)
 * @returns {Object[]} Array com cartões gerados
 */
export const gerarMultiplosCartoes = (
	quantidade,
	bandeira = null,
	tipo = null
) => {
	const cartoes = [];

	for (let i = 0; i < quantidade; i++) {
		cartoes.push(gerarCartaoCredito(bandeira, tipo));
	}

	return cartoes;
};

/**
 * Gera cartão com dados específicos
 * @param {Object} configuracao - Configuração personalizada
 * @returns {Object} Cartão gerado com configurações específicas
 */
export const gerarCartaoPersonalizado = (configuracao = {}) => {
	const {
		bandeira = "",
		tipo = "",
		eredeStatus = "",
		nome = null,
		cvvCustom = null,
	} = configuracao;

	let cartao = gerarCartaoCredito(bandeira, tipo, eredeStatus);

	// Sobrescreve nome se fornecido
	if (nome) {
		cartao.nome = formatarParaMaiusculas(nome);
	}

	// Sobrescreve CVV se fornecido
	if (cvvCustom) {
		cartao.cvv = cvvCustom;
	}

	return cartao;
};
