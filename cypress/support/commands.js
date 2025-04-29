Cypress.Commands.add('getDataField', (testId) => {
  return cy.get(`[data-testid="${testId}"]`);
});

Cypress.Commands.add('getDataFieldValue', (testId) => {
  return cy.get(`#${testId}-value`);
});

Cypress.Commands.add('verifyClipboardContent', (expectedValue) => {
  cy.window().then((win) => {
    cy.wrap(win.navigator.clipboard.readText())
      .should('eq', expectedValue);
  });
});

Cypress.Commands.add('checkCopyFeedback', () => {
  cy.contains('Copiado para a área de transferência!')
    .should('be.visible');
}); 