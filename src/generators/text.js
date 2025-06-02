/**
 * Gerador de textos e categorias para a aplicação KQA
 * @author KQA Team
 * @description Funções para geração de textos aleatórios e categorias tecnológicas
 */

import { fakerPT_BR as faker } from "@faker-js/faker";
import { CATEGORIAS_TECNOLOGIA } from "../constants";

// ============================================================================
// GERAÇÃO DE CATEGORIAS
// ============================================================================

/**
 * Gera categorias únicas de tecnologia
 * @param {number} quantidade - Quantidade de categorias a gerar
 * @returns {string[]} Array com categorias únicas
 */
export const gerarCategoriasUnicas = (quantidade) => {
	const categoriasDisponiveis = [...CATEGORIAS_TECNOLOGIA];
	const categoriasSelecionadas = [];

	// Garantir que não se solicite mais categorias do que existe
	const quantidadeReal = Math.min(quantidade, categoriasDisponiveis.length);

	for (let i = 0; i < quantidadeReal; i++) {
		const indiceAleatorio = Math.floor(
			Math.random() * categoriasDisponiveis.length
		);
		categoriasSelecionadas.push(categoriasDisponiveis[indiceAleatorio]);
		categoriasDisponiveis.splice(indiceAleatorio, 1);
	}

	return categoriasSelecionadas;
};

/**
 * Gera uma categoria aleatória
 * @returns {string} Categoria tecnológica aleatória
 */
export const gerarCategoriaAleatoria = () => {
	return faker.helpers.arrayElement(CATEGORIAS_TECNOLOGIA);
};

/**
 * Gera múltiplas categorias (podem repetir)
 * @param {number} quantidade - Quantidade de categorias
 * @returns {string[]} Array com categorias (podem repetir)
 */
export const gerarMultiplasCategorias = (quantidade) => {
	const categorias = [];

	for (let i = 0; i < quantidade; i++) {
		categorias.push(gerarCategoriaAleatoria());
	}

	return categorias;
};

// ============================================================================
// GERAÇÃO DE TEXTO ALEATÓRIO
// ============================================================================

/**
 * Gera texto aleatório com tamanho específico
 * @param {number} length - Tamanho desejado do texto
 * @returns {string} Texto gerado com tamanho exato
 */
export const gerarTextoAleatorio = (length) => {
	if (!length || length <= 0) return "";

	// Para comprimentos muito pequenos, gera palavras curtas do lorem
	if (length < 5) {
		const word = faker.lorem.word();
		return word.substring(0, length);
	}

	let text = "";

	// Decide se vai usar palavras ou um texto contínuo baseado no tamanho
	if (length < 50) {
		// Para textos curtos, usa palavras individuais
		while (text.length < length) {
			const word = faker.lorem.word();
			if (text.length === 0) {
				text = word;
			} else if (text.length + word.length + 1 <= length) {
				text += " " + word;
			} else {
				break;
			}
		}
	} else {
		// Para textos maiores, gera parágrafos e ajusta
		text = faker.lorem
			.paragraphs(Math.ceil(length / 100))
			.replace(/\n/g, " ");
	}

	// Ajusta o texto para o tamanho exato
	if (text.length < length) {
		// Se faltam caracteres, adiciona palavras até atingir ou ultrapassar
		while (text.length < length) {
			const word = faker.lorem.word();
			if (text.length + word.length + 1 <= length) {
				text += " " + word;
			} else {
				// Completa com caracteres do último word para atingir o tamanho exato
				const remaining = length - text.length - 1;
				if (remaining > 0) {
					text += " " + word.substring(0, remaining);
				}
				break;
			}
		}
	} else if (text.length > length) {
		// Se passou do tamanho, corta no último espaço antes do limite
		text = text.substring(0, length);
		const lastSpace = text.lastIndexOf(" ");
		if (lastSpace > length * 0.8) {
			// Só corta no espaço se não perder mais de 20% do texto
			text = text.substring(0, lastSpace);
		}

		// Se ainda estiver maior que o limite, corta exatamente no limite
		if (text.length > length) {
			text = text.substring(0, length);
		}

		// Se ficou menor, completa com caracteres do lorem
		while (text.length < length) {
			text += faker.lorem.word().charAt(0);
		}
	}

	return text;
};

/**
 * Gera palavra única
 * @param {number} [maxLength] - Tamanho máximo da palavra (opcional)
 * @returns {string} Palavra aleatória
 */
export const gerarPalavra = (maxLength = null) => {
	const palavra = faker.lorem.word();

	if (maxLength && palavra.length > maxLength) {
		return palavra.substring(0, maxLength);
	}

	return palavra;
};

/**
 * Gera frase aleatória
 * @param {number} [minWords=5] - Mínimo de palavras
 * @param {number} [maxWords=15] - Máximo de palavras
 * @returns {string} Frase aleatória
 */
export const gerarFrase = (minWords = 5, maxWords = 15) => {
	const numPalavras = faker.number.int({ min: minWords, max: maxWords });
	return faker.lorem.words(numPalavras);
};

/**
 * Gera parágrafo aleatório
 * @param {number} [minSentences=3] - Mínimo de frases
 * @param {number} [maxSentences=6] - Máximo de frases
 * @returns {string} Parágrafo aleatório
 */
export const gerarParagrafo = (minSentences = 3, maxSentences = 6) => {
	const numFrases = faker.number.int({
		min: minSentences,
		max: maxSentences,
	});
	return faker.lorem.sentences(numFrases);
};

/**
 * Gera múltiplos parágrafos
 * @param {number} quantidade - Quantidade de parágrafos
 * @returns {string} Texto com múltiplos parágrafos
 */
export const gerarMultiplosParagrafos = (quantidade) => {
	return faker.lorem.paragraphs(quantidade);
};

// ============================================================================
// GERAÇÃO DE TEXTO ESPECIALIZADO
// ============================================================================

/**
 * Gera texto com caracteres especiais
 * @param {number} length - Tamanho do texto
 * @param {boolean} [includeSpaces=true] - Incluir espaços
 * @param {boolean} [includeNumbers=true] - Incluir números
 * @param {boolean} [includeSymbols=false] - Incluir símbolos
 * @returns {string} Texto com caracteres especiais
 */
export const gerarTextoComEspeciais = (
	length,
	includeSpaces = true,
	includeNumbers = true,
	includeSymbols = false
) => {
	let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

	if (includeNumbers) {
		chars += "0123456789";
	}

	if (includeSpaces) {
		chars += "   "; // Adiciona alguns espaços para aumentar a chance
	}

	if (includeSymbols) {
		chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";
	}

	let result = "";
	for (let i = 0; i < length; i++) {
		result += chars.charAt(Math.floor(Math.random() * chars.length));
	}

	return result;
};

/**
 * Gera texto numérico
 * @param {number} length - Tamanho do texto numérico
 * @returns {string} Texto apenas com números
 */
export const gerarTextoNumerico = (length) => {
	return faker.string.numeric(length);
};

/**
 * Gera texto alfanumérico
 * @param {number} length - Tamanho do texto
 * @returns {string} Texto alfanumérico
 */
export const gerarTextoAlfanumerico = (length) => {
	return faker.string.alphanumeric(length);
};

/**
 * Gera UUID v4
 * @returns {string} UUID válido
 */
export const gerarUUID = () => {
	return faker.string.uuid();
};

// ============================================================================
// GERAÇÃO DE TEXTO TÉCNICO
// ============================================================================

/**
 * Gera nome de variável/função em camelCase
 * @returns {string} Nome em camelCase
 */
export const gerarNomeCamelCase = () => {
	const palavras = faker.lorem
		.words(faker.number.int({ min: 2, max: 4 }))
		.split(" ");
	return (
		palavras[0].toLowerCase() +
		palavras
			.slice(1)
			.map(
				(palavra) =>
					palavra.charAt(0).toUpperCase() +
					palavra.slice(1).toLowerCase()
			)
			.join("")
	);
};

/**
 * Gera nome de constante em UPPER_CASE
 * @returns {string} Nome em UPPER_CASE
 */
export const gerarNomeConstante = () => {
	return faker.lorem
		.words(faker.number.int({ min: 2, max: 3 }))
		.toUpperCase()
		.replace(/\s+/g, "_");
};

/**
 * Gera nome de classe em PascalCase
 * @returns {string} Nome em PascalCase
 */
export const gerarNomeClasse = () => {
	return faker.lorem
		.words(faker.number.int({ min: 1, max: 3 }))
		.split(" ")
		.map(
			(palavra) =>
				palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase()
		)
		.join("");
};

/**
 * Gera comentário de código
 * @param {string} [tipo='inline'] - Tipo do comentário ('inline', 'block', 'doc')
 * @returns {string} Comentário formatado
 */
export const gerarComentarioCodigo = (tipo = "inline") => {
	const conteudo = faker.lorem.sentence();

	switch (tipo) {
		case "block":
			return `/*\n * ${conteudo}\n */`;
		case "doc":
			return `/**\n * ${conteudo}\n */`;
		default:
			return `// ${conteudo}`;
	}
};

// ============================================================================
// UTILITÁRIOS DE TEXTO
// ============================================================================

/**
 * Lista todas as categorias disponíveis
 * @returns {string[]} Array com todas as categorias
 */
export const obterTodasCategorias = () => {
	return [...CATEGORIAS_TECNOLOGIA];
};

/**
 * Conta palavras em um texto
 * @param {string} texto - Texto a contar
 * @returns {number} Número de palavras
 */
export const contarPalavras = (texto) => {
	if (!texto || typeof texto !== "string") return 0;
	return texto
		.trim()
		.split(/\s+/)
		.filter((palavra) => palavra.length > 0).length;
};

/**
 * Conta caracteres em um texto
 * @param {string} texto - Texto a contar
 * @param {boolean} [incluirEspacos=true] - Incluir espaços na contagem
 * @returns {number} Número de caracteres
 */
export const contarCaracteres = (texto, incluirEspacos = true) => {
	if (!texto || typeof texto !== "string") return 0;
	return incluirEspacos ? texto.length : texto.replace(/\s/g, "").length;
};

/**
 * Trunca texto no tamanho especificado
 * @param {string} texto - Texto a truncar
 * @param {number} tamanho - Tamanho máximo
 * @param {string} [sufixo='...'] - Sufixo para indicar truncamento
 * @returns {string} Texto truncado
 */
export const truncarTexto = (texto, tamanho, sufixo = "...") => {
	if (!texto || texto.length <= tamanho) return texto;
	return texto.substring(0, tamanho - sufixo.length) + sufixo;
};
