/**
 * Gera dados de um produto
 * @returns {Object} Dados do produto gerado
 */
export function generateProduct() {
    return {
        nome: faker.commerce.productName(),
        descricao: faker.commerce.productDescription(),
        preco: faker.commerce.price(10, 1000, 2),
        categoria: faker.commerce.department(),
        codigo: faker.random.alphaNumeric(10).toUpperCase(),
        marca: faker.company.companyName(),
        modelo: faker.random.alphaNumeric(6).toUpperCase(),
        estoque: Math.floor(Math.random() * 1000)
    };
} 