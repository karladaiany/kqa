// cypress/support/e2e.js

// Import commands.js using ES2015 syntax:
import "./commands";

// Comando customizado para aguardar carregamento da aplicação
Cypress.Commands.add("waitForAppLoad", () => {
	cy.get('[data-testid="app-container"]', { timeout: 10000 }).should(
		"be.visible"
	);
});

// Comando para gerar CPF e validar
Cypress.Commands.add("generateAndValidateCPF", () => {
	cy.get('[data-testid="cpf-generate-btn"]').click();
	cy.get('[data-testid="cpf-field"]').should("not.be.empty");
	cy.get('[data-testid="cpf-field"]')
		.invoke("val")
		.should("match", /^\d{3}\.\d{3}\.\d{3}-\d{2}$/);
});

// Comando para alternar tema
Cypress.Commands.add("toggleTheme", () => {
	cy.get(".theme-toggle").click();
});

// Comando para testar geração de dados pessoais
Cypress.Commands.add("generatePersonData", () => {
	cy.get('[data-testid="person-generate-all-btn"]').click();
	cy.get('[data-testid="person-name-field"]').should("not.be.empty");
	cy.get('[data-testid="person-email-field"]').should("contain", "@");
});
