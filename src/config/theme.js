/**
 * Configurações de tema da aplicação KQA
 * @author KQA Team
 * @description Arquivo centralizado para configurações de tema e interface
 */

// ============================================================================
// CONFIGURAÇÕES DE TEMA
// ============================================================================

/**
 * Configurações padrão do tema
 * @type {Object}
 */
export const CONFIG_TEMA_PADRAO = {
	/**
	 * Tema escuro como padrão
	 * @type {boolean}
	 */
	darkMode: true,

	/**
	 * Salvar automaticamente preferências do usuário
	 * @type {boolean}
	 */
	autoSave: true,

	/**
	 * Chave para localStorage
	 * @type {string}
	 */
	storageKey: "darkMode",

	/**
	 * Classe CSS para tema escuro
	 * @type {string}
	 */
	darkThemeClass: "dark-theme",
};

/**
 * Configurações de transições e animações
 * @type {Object}
 */
export const CONFIG_ANIMACOES = {
	/**
	 * Duração padrão das transições (em segundos)
	 * @type {number}
	 */
	duracaoTransicao: 0.3,

	/**
	 * Tipo de easing para transições
	 * @type {string}
	 */
	easingTransicao: "ease",

	/**
	 * Duração da animação de spin (em segundos)
	 * @type {number}
	 */
	duracaoSpin: 1,

	/**
	 * Configurações para usuários que preferem movimento reduzido
	 * @type {Object}
	 */
	movimentoReduzido: {
		duracaoAnimacao: 0.01,
		iteracaoAnimacao: 1,
		duracaoTransicao: 0.01,
		scrollBehavior: "auto",
	},
};

/**
 * Configurações de layout responsivo
 * @type {Object}
 */
export const CONFIG_BREAKPOINTS = {
	/**
	 * Breakpoint para tablets
	 * @type {number}
	 */
	tablet: 991,

	/**
	 * Breakpoint para mobile
	 * @type {number}
	 */
	mobile: 800,

	/**
	 * Breakpoint para desktop pequeno
	 * @type {number}
	 */
	desktopPequeno: 1200,

	/**
	 * Breakpoint para desktop grande
	 * @type {number}
	 */
	desktopGrande: 1400,
};

/**
 * Configurações de scroll
 * @type {Object}
 */
export const CONFIG_SCROLL = {
	/**
	 * Offset mínimo para mostrar botão de scroll para cima
	 * @type {number}
	 */
	offsetMinimo: 100,

	/**
	 * Offset para mostrar botão de scroll para baixo
	 * @type {number}
	 */
	offsetMaximo: 100,

	/**
	 * Comportamento do scroll
	 * @type {string}
	 */
	comportamento: "smooth",
};

/**
 * Configurações de acessibilidade
 * @type {Object}
 */
export const CONFIG_ACESSIBILIDADE = {
	/**
	 * Labels para screen readers
	 * @type {Object<string, string>}
	 */
	ariaLabels: {
		menuToggle: "Abrir menu",
		themeToggle: "Alternar tema",
		themeToDark: "Mudar para tema escuro",
		themeToLight: "Mudar para tema claro",
		copyValue: "Copiar valor",
		regenerateValue: "Gerar novo valor",
		toggleMask: "Alternar máscara",
		clearField: "Limpar campo",
		scrollToTop: "Rolar para o topo",
		scrollToBottom: "Rolar para baixo",
	},

	/**
	 * Títulos para tooltips
	 * @type {Object<string, string>}
	 */
	tooltips: {
		clickToCopy: "Clique para copiar",
		generateAll: "Gerar todos os dados novamente",
		generateAllPersonal: "Gerar todos os dados pessoais novamente",
		generateAllProduct: "Gerar todos os dados do produto novamente",
		generateAllComplementary: "Gerar todos os dados complementares",
		copyCategory: "Copiar categoria",
	},
};

/**
 * Função para obter configuração de tema do localStorage
 * @returns {boolean} Estado do tema escuro
 */
export const obterConfiguracaoTema = () => {
	const savedTheme = localStorage.getItem(CONFIG_TEMA_PADRAO.storageKey);
	return savedTheme === null
		? CONFIG_TEMA_PADRAO.darkMode
		: savedTheme === "true";
};

/**
 * Função para salvar configuração de tema no localStorage
 * @param {boolean} darkMode - Estado do tema escuro
 */
export const salvarConfiguracaoTema = (darkMode) => {
	if (CONFIG_TEMA_PADRAO.autoSave) {
		localStorage.setItem(CONFIG_TEMA_PADRAO.storageKey, String(darkMode));
	}
};

/**
 * Função para aplicar tema no documento
 * @param {boolean} darkMode - Estado do tema escuro
 */
export const aplicarTema = (darkMode) => {
	document.body.classList.toggle(CONFIG_TEMA_PADRAO.darkThemeClass, darkMode);
};

/**
 * Função para inicializar tema da aplicação
 * @returns {boolean} Estado inicial do tema
 */
export const inicializarTema = () => {
	const darkMode = obterConfiguracaoTema();
	aplicarTema(darkMode);
	return darkMode;
};

/**
 * Função para alternar tema
 * @param {boolean} currentDarkMode - Estado atual do tema
 * @returns {boolean} Novo estado do tema
 */
export const alternarTema = (currentDarkMode) => {
	const newDarkMode = !currentDarkMode;
	salvarConfiguracaoTema(newDarkMode);
	aplicarTema(newDarkMode);
	return newDarkMode;
};
