/**
 * Constantes centralizadas da aplicação KQA
 * @author KQA Team
 * @description Arquivo para centralizar todas as constantes utilizadas na aplicação
 */

// ============================================================================
// CONSTANTES DE DOCUMENTOS E ENDEREÇOS
// ============================================================================

/**
 * Tipos de logradouro válidos no Brasil
 * @type {string[]}
 */
export const TIPOS_LOGRADOURO = [
	"Rua",
	"Avenida",
	"Travessa",
	"Alameda",
	"Praça",
	"Estrada",
	"Rodovia",
	"Viela",
	"Beco",
	"Largo",
	"Vila",
	"Passagem",
	"Ladeira",
];

/**
 * Faixas de CEP por estado brasileiro
 * @type {Object<string, {inicio: string, fim: string}>}
 */
export const FAIXAS_CEP = {
	SP: { inicio: "01000000", fim: "19999999" },
	RJ: { inicio: "20000000", fim: "28999999" },
	ES: { inicio: "29000000", fim: "29999999" },
	MG: { inicio: "30000000", fim: "39999999" },
	BA: { inicio: "40000000", fim: "48999999" },
	SE: { inicio: "49000000", fim: "49999999" },
	PE: { inicio: "50000000", fim: "56999999" },
	AL: { inicio: "57000000", fim: "57999999" },
	PB: { inicio: "58000000", fim: "58999999" },
	RN: { inicio: "59000000", fim: "59999999" },
	CE: { inicio: "60000000", fim: "63999999" },
	PI: { inicio: "64000000", fim: "64999999" },
	MA: { inicio: "65000000", fim: "65999999" },
	PA: { inicio: "66000000", fim: "68899999" },
	AP: { inicio: "68900000", fim: "68999999" },
	AM: { inicio: "69000000", fim: "69299999" },
	RR: { inicio: "69300000", fim: "69399999" },
	AC: { inicio: "69900000", fim: "69999999" },
	DF: { inicio: "70000000", fim: "72799999" },
	GO: { inicio: "72800000", fim: "76799999" },
	TO: { inicio: "77000000", fim: "77999999" },
	MT: { inicio: "78000000", fim: "78899999" },
	MS: { inicio: "79000000", fim: "79999999" },
	RO: { inicio: "76800000", fim: "76999999" },
	PR: { inicio: "80000000", fim: "87999999" },
	SC: { inicio: "88000000", fim: "89999999" },
	RS: { inicio: "90000000", fim: "99999999" },
};

// ============================================================================
// CONSTANTES DE PRODUTOS E TECNOLOGIA
// ============================================================================

/**
 * Lista de produtos tecnológicos para geração de dados fictícios
 * @type {string[]}
 */
export const PRODUTOS_TECNOLOGIA = [
	"Sistema de Automação de Testes",
	"Framework de Desenvolvimento Web",
	"Plataforma de Machine Learning",
	"Software de Análise de Dados",
	"Ferramenta de DevOps",
	"Sistema de Gestão Ágil",
	"Plataforma de Testes A/B",
	"Software de Monitoramento de Performance",
	"IDE Inteligente",
	"Ferramenta de Code Review",
	"Sistema de CI/CD",
	"Plataforma de Design System",
	"Software de Prototipação",
	"Ferramenta de Versionamento",
	"Sistema de Análise de Código",
	"Plataforma de Documentação",
	"Software de Gerenciamento de APIs",
	"Ferramenta de Debug",
	"Sistema de Logging",
	"Plataforma de Cloud Computing",
];

/**
 * Categorias de tecnologia para classificação de produtos
 * @type {string[]}
 */
export const CATEGORIAS_TECNOLOGIA = [
	"Desenvolvimento de Software",
	"Qualidade de Software",
	"DevOps",
	"Inteligência Artificial",
	"Machine Learning",
	"UI/UX Design",
	"Gestão de Projetos",
	"Metodologias Ágeis",
	"Automação de Testes",
	"Cloud Computing",
	"Segurança da Informação",
	"Arquitetura de Software",
	"Frontend Development",
	"Backend Development",
	"Mobile Development",
	"Data Science",
	"Big Data",
	"Blockchain",
	"IoT",
	"Microserviços",
	"API Development",
	"Design System",
	"Code Quality",
	"Performance",
	"Acessibilidade",
	"DevSecOps",
	"SRE",
	"Infraestrutura",
	"Banco de Dados",
	"Business Intelligence",
];

/**
 * Descrições detalhadas para produtos tecnológicos
 * @type {string[]}
 */
export const DESCRICOES_PRODUTOS_TECNOLOGIA = [
	"Solução avançada que automatiza todo o ciclo de testes, desde a criação até a execução e relatórios, aumentando a eficiência da equipe de QA.",
	"Plataforma integrada que utiliza inteligência artificial para otimizar processos de desenvolvimento e garantir a qualidade do código.",
	"Sistema completo de gestão de projetos ágeis com recursos de planejamento, monitoramento e métricas em tempo real.",
	"Ferramenta inovadora para análise estática e dinâmica de código, identificando vulnerabilidades e sugerindo melhorias.",
	"Software especializado em testes de performance, permitindo simulações de carga e análise detalhada de desempenho.",
	"Plataforma colaborativa para design e prototipação, facilitando a criação e validação de interfaces com usuários.",
	"Sistema robusto de integração contínua e entrega contínua (CI/CD) com suporte a múltiplas tecnologias e ambientes.",
	"Ferramenta completa para documentação técnica, com suporte a versionamento e colaboração em tempo real.",
	"Solução moderna para monitoramento e análise de APIs, garantindo performance e segurança em todas as integrações.",
	"Plataforma unificada de DevOps que integra ferramentas de desenvolvimento, teste e implantação em um único ambiente.",
	"Sistema inteligente de revisão de código que utiliza ML para identificar padrões e sugerir melhorias.",
	"Ferramenta especializada em testes de acessibilidade e usabilidade, garantindo a melhor experiência para todos os usuários.",
	"Plataforma avançada de análise de dados com recursos de visualização e geração de relatórios personalizados.",
	"Software de gerenciamento de configuração que automatiza processos de deploy e rollback com zero downtime.",
	"Sistema integrado de logging e monitoramento com alertas em tempo real e análise preditiva de problemas.",
	"Ferramenta de automação de processos de QA com suporte a testes funcionais, de integração e end-to-end.",
	"Plataforma completa para desenvolvimento de APIs com recursos de documentação, teste e monitoramento.",
	"Solução especializada em testes de segurança, identificando vulnerabilidades e sugerindo correções.",
	"Sistema de versionamento avançado com recursos de branching, merging e resolução de conflitos.",
	"Ferramenta de análise de qualidade de código com métricas detalhadas e sugestões de refatoração.",
];

// ============================================================================
// CONSTANTES DE FORMATAÇÃO
// ============================================================================

/**
 * Padrões de formatação para documentos brasileiros
 * @type {Object<string, RegExp>}
 */
export const FORMATOS_DOCUMENTOS = {
	CPF: /(\d{3})(\d{3})(\d{3})(\d{2})/,
	CNPJ: /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
	RG: /(\d{2})(\d{3})(\d{3})(\d{1})/,
};

/**
 * Máscaras de formatação para documentos brasileiros
 * @type {Object<string, string>}
 */
export const MASCARAS_DOCUMENTOS = {
	CPF: "$1.$2.$3-$4",
	CNPJ: "$1.$2.$3/$4-$5",
	RG: "$1.$2.$3-$4",
};

// ============================================================================
// CONSTANTES DE CONFIGURAÇÃO
// ============================================================================

/**
 * Configurações padrão para geração de dados
 * @type {Object}
 */
export const CONFIG_GERACAO = {
	/**
	 * Tamanho padrão para geração de caracteres aleatórios
	 * @type {number}
	 */
	TAMANHO_PADRAO_CHARS: 10,

	/**
	 * Número máximo de categorias únicas a serem geradas
	 * @type {number}
	 */
	MAX_CATEGORIAS_UNICAS: 5,

	/**
	 * Configurações de tema padrão
	 * @type {Object}
	 */
	TEMA_PADRAO: {
		darkMode: true,
		autoSave: true,
	},
};

// ============================================================================
// CONSTANTES DE CARTÃO DE CRÉDITO
// ============================================================================

/**
 * Configurações de bandeiras de cartão de crédito
 * @type {Object<string, Object>}
 */
export const BANDEIRAS_CARTAO = {
	visa: {
		nome: "Visa",
		prefixos: ["4"],
		tamanhos: [13, 16, 19],
	},
	mastercard: {
		nome: "MasterCard",
		prefixos: ["51", "52", "53", "54", "55"],
		tamanhos: [16],
	},
	amex: {
		nome: "American Express",
		prefixos: ["34", "37"],
		tamanhos: [15],
	},
	elo: {
		nome: "Elo",
		prefixos: ["636368", "438935", "504175", "451416", "636297"],
		tamanhos: [16],
	},
	hipercard: {
		nome: "Hipercard",
		prefixos: ["384100", "384140", "384160", "606282"],
		tamanhos: [16],
	},
};

/**
 * Tipos de cartão disponíveis
 * @type {string[]}
 */
export const TIPOS_CARTAO = ["credito", "debito"];

// ============================================================================
// CONSTANTES DE INTERFACE
// ============================================================================

/**
 * Configurações de notificações (Toast)
 * @type {Object}
 */
export const CONFIG_TOAST = {
	position: "bottom-right",
	autoClose: 3000,
	hideProgressBar: false,
	newestOnTop: true,
	closeOnClick: true,
	rtl: false,
	pauseOnFocusLoss: true,
	draggable: true,
	pauseOnHover: true,
};

/**
 * Mensagens padrão da aplicação
 * @type {Object<string, string>}
 */
export const MENSAGENS = {
	SUCESSO: {
		COPIADO: "Copiado para a área de transferência!",
		CATEGORIA_COPIADA: "Categoria copiada!",
		CAMPOS_LIMPOS: "Todos os campos foram limpos!",
		DADOS_GERADOS: "Novos dados gerados com sucesso!",
	},
	ERRO: {
		COPIA_FALHOU: "Erro ao copiar para a área de transferência",
		GERACAO_FALHOU: "Erro ao gerar novos dados",
		CAMPO_INVALIDO: "Campo contém valor inválido",
	},
	INFO: {
		CARREGANDO: "Gerando dados...",
		PROCESSANDO: "Processando informações...",
	},
};
