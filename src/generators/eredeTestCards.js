// PLEASE REPLACE THIS WITH ACTUAL DATA FROM:
// https://developer.userede.com.br/e-rede#tutorial-sandbox-cartoes

export const eredeTestCards = [
	{
		status: "APROVADA",
		description: "Autorizado",
		number: "5012345678901234", // Placeholder
		expiry: "12/29", // Placeholder
		cvv: "123", // Placeholder
		name: "Cliente Aprovado Erede",
	},
	{
		status: "NEGADA_SALDO",
		description: "Saldo Insuficiente",
		number: "5098765432109876", // Placeholder
		expiry: "11/28", // Placeholder
		cvv: "321", // Placeholder
		name: "Cliente Sem Saldo Erede",
	},
	{
		status: "NEGADA_GENERICO",
		description: "Erro Genérico",
		number: "5055555555555555", // Placeholder
		expiry: "10/27", // Placeholder
		cvv: "456", // Placeholder
		name: "Cliente Erro Erede",
	},
	{
		status: "NEGADA_CARTAO_INVALIDO",
		description: "Cartão Inválido/Bloqueado",
		number: "5011112222333344", // Placeholder
		expiry: "09/26", // Placeholder
		cvv: "789", // Placeholder
		name: "Cliente Cartao Invalido Erede",
	},
	// Add more card scenarios as extracted from the documentation
];

// Helper to get a specific card by status
export const getEredeTestCardByStatus = (status) => {
	return (
		eredeTestCards.find((card) => card.status === status) ||
		eredeTestCards[0]
	); // Fallback to the first card
};

// Helper to get all available statuses for the select dropdown
export const getEredeTestCardStatuses = () => {
	return eredeTestCards.map((card) => ({
		status: card.status,
		description: card.description,
	}));
};
