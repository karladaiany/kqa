describe('Funcionalidade de Máscaras', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('deve alternar máscara do CPF', () => {
        cy.get('#generate-cpf').click();
        cy.get('#cpf').then($cpf => {
            const cpfSemMascara = $cpf.text();
            expect(cpfSemMascara).to.match(/^\d{11}$/);

            cy.get('#cpf-mask-toggle').click();
            cy.get('#cpf').should('match', /^\d{3}\.\d{3}\.\d{3}-\d{2}$/);

            cy.get('#cpf-mask-toggle').click();
            cy.get('#cpf').should('match', /^\d{11}$/);
        });
    });

    it('deve alternar máscara do CNPJ', () => {
        cy.get('#generate-cnpj').click();
        cy.get('#cnpj').then($cnpj => {
            const cnpjSemMascara = $cnpj.text();
            expect(cnpjSemMascara).to.match(/^\d{14}$/);

            cy.get('#cnpj-mask-toggle').click();
            cy.get('#cnpj').should('match', /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/);

            cy.get('#cnpj-mask-toggle').click();
            cy.get('#cnpj').should('match', /^\d{14}$/);
        });
    });

    it('deve manter a máscara do CPF ao gerar novo valor', () => {
        cy.get('#cpf-mask-toggle').click();
        cy.get('#generate-cpf').click();
        cy.get('#cpf').should('match', /^\d{3}\.\d{3}\.\d{3}-\d{2}$/);
    });

    it('deve manter a máscara do CNPJ ao gerar novo valor', () => {
        cy.get('#cnpj-mask-toggle').click();
        cy.get('#generate-cnpj').click();
        cy.get('#cnpj').should('match', /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/);
    });
}); 