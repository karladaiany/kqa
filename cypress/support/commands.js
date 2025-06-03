// cypress/support/commands.js

// Comando para selecionar por data-testid
Cypress.Commands.add("getByTestId", (testId) => {
	return cy.get(`[data-testid="${testId}"]`);
});

// Comando para verificar se um campo está preenchido e válido
Cypress.Commands.add("validateFieldContent", (testId, pattern = null) => {
	cy.getByTestId(testId).should("be.visible");
	cy.getByTestId(testId).should("not.be.empty");

	if (pattern) {
		cy.getByTestId(testId).invoke("val").should("match", pattern);
	}
});

// Comando para testar funcionalidade de cópia
Cypress.Commands.add("testCopyToClipboard", (testId) => {
	cy.getByTestId(`${testId}-copy-btn`).click();
	cy.get(".Toastify__toast--success").should("be.visible");
});

// Comando para verificar responsividade
Cypress.Commands.add("testResponsiveness", () => {
	// Desktop
	cy.viewport(1200, 800);
	cy.get(".content-wrapper").should("be.visible");

	// Tablet
	cy.viewport(768, 1024);
	cy.get(".content-wrapper").should("be.visible");

	// Mobile
	cy.viewport(375, 667);
	cy.get("#menu-toggle").should("be.visible");
});

// Comando para validar acessibilidade básica
Cypress.Commands.add("checkBasicA11y", () => {
	// Verificar se elementos têm aria-labels apropriados
	cy.get("button").each(($btn) => {
		cy.wrap($btn)
			.should("have.attr", "aria-label")
			.or("have.attr", "title");
	});

	// Verificar se inputs têm labels
	cy.get("input").each(($input) => {
		const id = $input.attr("id");
		if (id) {
			cy.get(`label[for="${id}"]`).should("exist");
		}
	});
});
