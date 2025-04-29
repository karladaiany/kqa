describe('DataField Component', () => {
  const testId = 'test-data-field';
  const testValue = 'valor-teste';

  beforeEach(() => {
    cy.visit('/');
    cy.window().then((win) => {
      win.navigator.clipboard.writeText(''); // Limpa a área de transferência
    });
  });

  it('deve renderizar corretamente com as props básicas', () => {
    cy.mount(<DataField testId={testId} value={testValue} />);
    cy.getDataField(testId).should('exist');
    cy.getDataFieldValue(testId).should('have.text', testValue);
  });

  it('deve copiar o valor ao clicar no texto', () => {
    cy.mount(<DataField testId={testId} value={testValue} />);
    cy.getDataFieldValue(testId).click();
    cy.verifyClipboardContent(testValue);
    cy.checkCopyFeedback();
  });

  it('deve copiar o valor ao clicar no botão de cópia', () => {
    cy.mount(<DataField testId={testId} value={testValue} />);
    cy.get(`#${testId}-copy-button`).click();
    cy.verifyClipboardContent(testValue);
    cy.checkCopyFeedback();
  });

  it('deve mostrar e acionar o botão de regeneração quando onRegenerate é fornecido', () => {
    const onRegenerateSpy = cy.spy().as('onRegenerateSpy');
    cy.mount(
      <DataField 
        testId={testId} 
        value={testValue} 
        onRegenerate={onRegenerateSpy} 
      />
    );

    cy.get(`#${testId}-regenerate-button`)
      .should('exist')
      .click();

    cy.get('@onRegenerateSpy').should('have.been.calledOnce');
  });

  it('deve ser acessível via teclado', () => {
    cy.mount(<DataField testId={testId} value={testValue} />);
    cy.getDataFieldValue(testId).focus().type('{enter}');
    cy.verifyClipboardContent(testValue);
    cy.checkCopyFeedback();

    const onRegenerateSpy = cy.spy().as('onRegenerateSpy');
    cy.mount(
      <DataField 
        testId={testId} 
        value={testValue} 
        onRegenerate={onRegenerateSpy} 
      />
    );

    cy.get(`#${testId}-regenerate-button`)
      .focus()
      .type('{enter}');

    cy.get('@onRegenerateSpy').should('have.been.calledOnce');
  });

  it('deve lidar com valores longos corretamente', () => {
    const longValue = 'a'.repeat(100);
    cy.mount(<DataField testId={testId} value={longValue} />);
    cy.getDataFieldValue(testId)
      .should('have.css', 'text-overflow', 'ellipsis')
      .and('have.css', 'overflow', 'hidden');
  });

  it('deve exibir mensagem de erro quando a cópia falha', () => {
    cy.window().then((win) => {
      cy.stub(win.navigator.clipboard, 'writeText').rejects();
    });

    cy.mount(<DataField testId={testId} value={testValue} />);
    cy.getDataFieldValue(testId).click();
    cy.contains('Erro ao copiar para a área de transferência')
      .should('be.visible');
  });
}); 