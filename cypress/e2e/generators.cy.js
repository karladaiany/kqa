describe('Geradores de Dados', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('deve gerar um CPF válido', () => {
        cy.get('#generate-cpf').click();
        cy.get('#cpf').should('not.be.empty');
    });

    it('deve gerar um CNPJ válido', () => {
        cy.get('#generate-cnpj').click();
        cy.get('#cnpj').should('not.be.empty');
    });

    it('deve gerar um RG válido', () => {
        cy.get('#generate-rg').click();
        cy.get('#rg').should('not.be.empty');
    });

    it('deve gerar dados pessoais completos', () => {
        cy.get('#generate-person').click();
        cy.get('#pessoa-dados').should('not.be.empty');
        cy.get('#pessoa-nome').should('not.be.empty');
        cy.get('#pessoa-email').should('not.be.empty');
        cy.get('#pessoa-telefone').should('not.be.empty');
        cy.get('#pessoa-celular').should('not.be.empty');
        cy.get('#pessoa-rua').should('not.be.empty');
        cy.get('#pessoa-numero').should('not.be.empty');
        cy.get('#pessoa-bairro').should('not.be.empty');
        cy.get('#pessoa-cidade').should('not.be.empty');
        cy.get('#pessoa-estado').should('not.be.empty');
        cy.get('#pessoa-cep').should('not.be.empty');
    });

    it('deve gerar dados de cartão de crédito', () => {
        cy.get('#generate-card').click();
        cy.get('#credit-card-data').should('not.be.empty');
        cy.get('#card-number').should('not.be.empty');
        cy.get('#card-brand').should('not.be.empty');
        cy.get('#card-expiry').should('not.be.empty');
        cy.get('#card-cvv').should('not.be.empty');
    });

    it('deve gerar dados de produto', () => {
        cy.get('#generate-product').click();
        cy.get('#produto-dados').should('not.be.empty');
        cy.get('#produto-nome').should('not.be.empty');
        cy.get('#produto-descricao').should('not.be.empty');
        cy.get('#produto-preco').should('not.be.empty');
        cy.get('#produto-categoria').should('not.be.empty');
        cy.get('#produto-codigo').should('not.be.empty');
        cy.get('#produto-marca').should('not.be.empty');
        cy.get('#produto-modelo').should('not.be.empty');
        cy.get('#produto-estoque').should('not.be.empty');
    });
}); 