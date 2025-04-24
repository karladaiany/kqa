describe('Funcionalidade de Tema', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('deve alternar entre tema claro e escuro', () => {
        // Verificar tema inicial (claro)
        cy.get('body').should('not.have.class', 'dark-theme');

        // Alternar para tema escuro
        cy.get('#theme-toggle').click();
        cy.get('body').should('have.class', 'dark-theme');

        // Alternar para tema claro
        cy.get('#theme-toggle').click();
        cy.get('body').should('not.have.class', 'dark-theme');
    });

    it('deve persistir a preferência de tema', () => {
        // Alternar para tema escuro
        cy.get('#theme-toggle').click();
        cy.get('body').should('have.class', 'dark-theme');

        // Recarregar a página
        cy.reload();

        // Verificar se o tema escuro foi mantido
        cy.get('body').should('have.class', 'dark-theme');
    });

    it('deve aplicar estilos corretos no tema escuro', () => {
        // Alternar para tema escuro
        cy.get('#theme-toggle').click();

        // Verificar estilos dos elementos
        cy.get('body').should('have.css', 'background-color', 'rgb(33, 37, 41)');
        cy.get('body').should('have.css', 'color', 'rgb(248, 249, 250)');

        cy.get('.card').should('have.css', 'background-color', 'rgb(52, 58, 64)');
        cy.get('.card-header').should('have.css', 'background-color', 'rgb(52, 58, 64)');
        cy.get('.card-title').should('have.css', 'color', 'rgb(248, 249, 250)');
        cy.get('.campo-valor').should('have.css', 'background-color', 'rgb(69, 77, 85)');
    });

    it('deve aplicar estilos corretos no tema claro', () => {
        // Verificar estilos dos elementos no tema claro
        cy.get('body').should('have.css', 'background-color', 'rgb(248, 249, 250)');
        cy.get('body').should('have.css', 'color', 'rgb(33, 37, 41)');

        cy.get('.card').should('have.css', 'background-color', 'rgb(255, 255, 255)');
        cy.get('.card-header').should('have.css', 'background-color', 'rgb(255, 255, 255)');
        cy.get('.card-title').should('have.css', 'color', 'rgb(51, 51, 51)');
        cy.get('.campo-valor').should('have.css', 'background-color', 'rgb(248, 249, 250)');
    });
}); 