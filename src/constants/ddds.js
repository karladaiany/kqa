/**
 * Configurações de DDDs válidos no Brasil
 * @author KQA Team
 * @description Arquivo centralizado com todos os DDDs válidos organizados por região
 */

// ============================================================================
// DDDs VÁLIDOS POR REGIÃO
// ============================================================================

/**
 * DDDs válidos da região Norte
 * @type {string[]}
 */
export const DDDS_NORTE = [
	"68", // Acre
	"96", // Amapá
	"92",
	"97", // Amazonas
	"91",
	"93",
	"94", // Pará
	"69", // Rondônia
	"95", // Roraima
	"63", // Tocantins
];

/**
 * DDDs válidos da região Nordeste
 * @type {string[]}
 */
export const DDDS_NORDESTE = [
	"82", // Alagoas
	"71",
	"73",
	"74",
	"75",
	"77", // Bahia
	"85",
	"88", // Ceará
	"98",
	"99", // Maranhão
	"83", // Paraíba
	"81",
	"87", // Pernambuco
	"86",
	"89", // Piauí
	"84", // Rio Grande do Norte
	"79", // Sergipe
];

/**
 * DDDs válidos da região Centro-Oeste
 * @type {string[]}
 */
export const DDDS_CENTRO_OESTE = [
	"61", // Distrito Federal
	"62",
	"64", // Goiás
	"65",
	"66", // Mato Grosso
	"67", // Mato Grosso do Sul
];

/**
 * DDDs válidos da região Sudeste
 * @type {string[]}
 */
export const DDDS_SUDESTE = [
	"27",
	"28", // Espírito Santo
	"31",
	"32",
	"33",
	"34",
	"35",
	"37",
	"38", // Minas Gerais
	"21",
	"22",
	"24", // Rio de Janeiro
	"11",
	"12",
	"13",
	"14",
	"15",
	"16",
	"17",
	"18",
	"19", // São Paulo
];

/**
 * DDDs válidos da região Sul
 * @type {string[]}
 */
export const DDDS_SUL = [
	"41",
	"42",
	"43",
	"44",
	"45",
	"46", // Paraná
	"51",
	"53",
	"54",
	"55", // Rio Grande do Sul
	"47",
	"48",
	"49", // Santa Catarina
];

/**
 * Todos os DDDs válidos no Brasil (unificado)
 * @type {string[]}
 */
export const DDDS_VALIDOS = [
	...DDDS_NORTE,
	...DDDS_NORDESTE,
	...DDDS_CENTRO_OESTE,
	...DDDS_SUDESTE,
	...DDDS_SUL,
];

/**
 * DDDs válidos como números (para compatibilidade)
 * @type {number[]}
 */
export const DDDS_VALIDOS_NUMERICOS = DDDS_VALIDOS.map((ddd) =>
	parseInt(ddd, 10)
);

/**
 * Mapeamento de DDDs por estado
 * @type {Object<string, string[]>}
 */
export const DDDS_POR_ESTADO = {
	// Norte
	AC: ["68"],
	AP: ["96"],
	AM: ["92", "97"],
	PA: ["91", "93", "94"],
	RO: ["69"],
	RR: ["95"],
	TO: ["63"],

	// Nordeste
	AL: ["82"],
	BA: ["71", "73", "74", "75", "77"],
	CE: ["85", "88"],
	MA: ["98", "99"],
	PB: ["83"],
	PE: ["81", "87"],
	PI: ["86", "89"],
	RN: ["84"],
	SE: ["79"],

	// Centro-Oeste
	DF: ["61"],
	GO: ["62", "64"],
	MT: ["65", "66"],
	MS: ["67"],

	// Sudeste
	ES: ["27", "28"],
	MG: ["31", "32", "33", "34", "35", "37", "38"],
	RJ: ["21", "22", "24"],
	SP: ["11", "12", "13", "14", "15", "16", "17", "18", "19"],

	// Sul
	PR: ["41", "42", "43", "44", "45", "46"],
	RS: ["51", "53", "54", "55"],
	SC: ["47", "48", "49"],
};

/**
 * Função para obter DDDs de um estado específico
 * @param {string} estado - Sigla do estado (ex: "SP", "RJ")
 * @returns {string[]} Array com os DDDs do estado
 */
export const obterDDDsPorEstado = (estado) => {
	return DDDS_POR_ESTADO[estado.toUpperCase()] || [];
};

/**
 * Função para validar se um DDD é válido
 * @param {string|number} ddd - DDD a ser validado
 * @returns {boolean} True se o DDD for válido
 */
export const validarDDD = (ddd) => {
	const dddString = String(ddd).padStart(2, "0");
	return DDDS_VALIDOS.includes(dddString);
};

/**
 * Função para obter um DDD aleatório
 * @param {string} [estado] - Sigla do estado para filtrar DDDs (opcional)
 * @returns {string} DDD aleatório
 */
export const obterDDDAleatorio = (estado = null) => {
	const ddds = estado ? obterDDDsPorEstado(estado) : DDDS_VALIDOS;
	return ddds[Math.floor(Math.random() * ddds.length)];
};
