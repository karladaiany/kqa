describe('Gerador de Dados Fictícios', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    describe('Tema', () => {
        it('deve alternar entre tema claro e escuro', () => {
            cy.get('#theme-toggle').click();
            cy.get('body').should('have.class', 'dark-theme');
            
            cy.get('#theme-toggle').click();
            cy.get('body').should('not.have.class', 'dark-theme');
        });

        it('deve persistir a preferência de tema', () => {
            cy.get('#theme-toggle').click();
            cy.reload();
            cy.get('body').should('have.class', 'dark-theme');
        });
    });

    describe('Documentos', () => {
        it('deve gerar CPF com máscara', () => {
            cy.get('#cpf').should('match', /^\d{3}\.\d{3}\.\d{3}-\d{2}$/);
        });

        it('deve alternar máscara do CPF', () => {
            cy.get('#cpf-mask-toggle').click();
            cy.get('#cpf').should('match', /^\d{11}$/);
            
            cy.get('#cpf-mask-toggle').click();
            cy.get('#cpf').should('match', /^\d{3}\.\d{3}\.\d{3}-\d{2}$/);
        });

        it('deve gerar CNPJ com máscara', () => {
            cy.get('#cnpj').should('match', /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/);
        });

        it('deve alternar máscara do CNPJ', () => {
            cy.get('#cnpj-mask-toggle').click();
            cy.get('#cnpj').should('match', /^\d{14}$/);
            
            cy.get('#cnpj-mask-toggle').click();
            cy.get('#cnpj').should('match', /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/);
        });

        it('deve gerar RG', () => {
            cy.get('#rg').should('match', /^\d{2}\.\d{3}\.\d{3}-\d{1}$/);
        });
    });

    describe('Dados Pessoais', () => {
        it('deve gerar dados pessoais completos', () => {
            cy.get('#generate-person').click();
            
            cy.get('#pessoa-dados').within(() => {
                cy.get('.campo-item').should('have.length', 7);
                cy.get('.copyable').should('have.length', 7);
            });
        });

        it('deve copiar dados pessoais', () => {
            cy.get('#pessoa-dados .copyable').first().click();
            cy.window().its('navigator.clipboard.readText').should('be.called');
        });
    });

    describe('Cartão de Crédito', () => {
        it('deve gerar dados de cartão de crédito', () => {
            cy.get('#generate-card').click();
            
            cy.get('#credit-card-data').within(() => {
                cy.get('.campo-item').should('have.length', 5);
                cy.get('.copyable').should('have.length', 5);
            });
        });

        it('deve gerar número de cartão válido', () => {
            cy.get('#credit-card-data .copyable').first().should('match', /^\d{16}$/);
        });
    });

    describe('Produto', () => {
        it('deve gerar dados de produto', () => {
            cy.get('#generate-product').click();
            
            cy.get('#produto-dados').within(() => {
                cy.get('.campo-item').should('have.length', 6);
                cy.get('.copyable').should('have.length', 6);
            });
        });

        it('deve gerar preço formatado', () => {
            cy.get('#produto-dados .copyable').eq(2).should('match', /^R\$\s\d+,\d{2}$/);
        });
    });

    describe('Performance', () => {
        it('deve carregar rapidamente', () => {
            cy.window().its('performance.timing.loadEventEnd').should('be.lessThan', 2000);
        });

        it('deve gerar dados rapidamente', () => {
            const startTime = performance.now();
            cy.get('#generate-all').click();
            cy.wrap(performance.now() - startTime).should('be.lessThan', 500);
        });
    });
}); 