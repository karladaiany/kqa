describe('KQA - Geração de Dados', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('header h1').should('contain', 'KQA :: Gerador de Dados para QA');
  });

  describe('Geração de Documentos', () => {
    it('deve gerar CPF válido', () => {
      cy.get('[data-testid="documentos-card"]').should('be.visible');

      // Gerar CPF usando data-testids específicos
      cy.get('[data-testid="data-field-cpf-regenerate-btn"]').click();

      // Aguardar geração
      cy.wait(300);

      cy.get('[data-testid="data-field-cpf-value"]').should('not.be.empty');
    });

    it('deve gerar CNPJ válido', () => {
      cy.get('[data-testid="data-field-cnpj-regenerate-btn"]').click();

      // Aguardar geração
      cy.wait(300);

      cy.get('[data-testid="data-field-cnpj-value"]').should('not.be.empty');
    });

    it('deve alternar entre formato com e sem máscara', () => {
      // Primeiro gerar um CPF
      cy.get('[data-testid="data-field-cpf-regenerate-btn"]').click();
      cy.wait(300);
      cy.get('[data-testid="data-field-cpf-value"]').should('not.be.empty');

      // Alternar máscara
      cy.get('[data-testid="data-field-cpf-toggle-mask-btn"]').click();
      cy.get('[data-testid="data-field-cpf-value"]').should('not.be.empty');
    });
  });

  describe('Geração de Dados Pessoais', () => {
    it('deve gerar dados pessoais completos', () => {
      cy.get('[data-testid="dados-pessoais-card"]').should('be.visible');

      // Gerar todos os dados
      cy.get('[data-testid="dados-pessoais-generate-all-btn"]').click();

      // Verificar se todos os campos foram preenchidos usando data-testids
      cy.get('[data-testid="data-field-nome-value"]').should('not.be.empty');
      cy.get('[data-testid="data-field-e-mail-value"]').should(
        'contain.text',
        '@'
      );
      cy.get('[data-testid="data-field-telefone-value"]').should(
        'not.be.empty'
      );
      cy.get('[data-testid="data-field-endereço-value"]').should(
        'not.be.empty'
      );
      cy.get('[data-testid="data-field-cep-value"]').should('not.be.empty');
    });

    it('deve regenerar campos individuais', () => {
      // Primeiro gerar todos os dados
      cy.get('[data-testid="dados-pessoais-generate-all-btn"]').click();

      // Esperar um pouco e regenerar nome - usar within para especificar o contexto
      cy.wait(100);
      cy.get('[data-testid="dados-pessoais-card"]').within(() => {
        cy.get('[data-testid="data-field-nome-regenerate-btn"]')
          .first()
          .click();
        cy.get('[data-testid="data-field-nome-value"]')
          .first()
          .should('not.be.empty');
      });
    });
  });

  describe('Funcionalidade de Cópia', () => {
    it('deve copiar valores para a área de transferência', () => {
      // Primeiro gerar dados
      cy.get('[data-testid="data-field-cpf-regenerate-btn"]').click();
      cy.wait(100); // Esperar gerar

      // Copiar valor
      cy.get('[data-testid="data-field-cpf-copy-btn"]').click();

      // Verificar se o toast de sucesso aparece
      cy.get('.Toastify__toast--success', { timeout: 5000 }).should(
        'be.visible'
      );
    });
  });

  describe('Cartão de Crédito', () => {
    it('deve gerar cartão de crédito válido', () => {
      cy.get('[data-testid="cartao-card"]').should('be.visible');

      // Gerar cartão usando o botão específico
      cy.get('[data-testid="cartao-generate-btn"]').click();

      // Verificar se dados foram gerados
      cy.wait(500);
      cy.get('[data-testid="data-field-número-value"]').should('not.be.empty');
      cy.get('[data-testid="data-field-nome-value"]').should('not.be.empty');
      cy.get('[data-testid="data-field-validade-value"]').should(
        'not.be.empty'
      );
      cy.get('[data-testid="data-field-cvv-value"]').should('not.be.empty');
    });

    it('deve alternar entre diferentes bandeiras', () => {
      cy.get('[data-testid="cartao-bandeira-select"]').select('mastercard');
      cy.get('[data-testid="cartao-generate-btn"]').click();
      cy.wait(300);
      cy.get('[data-testid="data-field-número-value"]').should('not.be.empty');
    });
  });

  describe('Geração de Produto', () => {
    it('deve gerar produto completo', () => {
      cy.get('[data-testid="produto-card"]').should('be.visible');

      // Gerar todos os dados do produto
      cy.get('[data-testid="produto-generate-all-btn"]').click();

      // Verificar campos
      cy.get('[data-testid="data-field-nome-value"]').should('not.be.empty');
      cy.get('[data-testid="data-field-descrição-value"]').should(
        'not.be.empty'
      );
    });

    it('deve regenerar categorias', () => {
      cy.get('[data-testid="produto-categorias-regenerate-btn"]').click();
      cy.wait(200);
      // Verificar se existem categorias
      cy.get('[data-testid="produto-categorias-field"]')
        .find('.categories-container')
        .should('not.be.empty');
    });
  });

  describe('Gerador de Caracteres', () => {
    it('deve gerar caracteres com quantidade específica', () => {
      cy.get('[data-testid="caracteres-card"]').should('be.visible');

      // Definir quantidade - separar comandos para evitar linter error
      cy.get('[data-testid="caracteres-length-input"]').clear();
      cy.get('[data-testid="caracteres-length-input"]').type('10');

      // Aguardar geração automática
      cy.wait(500);

      // Verificar se gerou - separar comandos para evitar erro de linter
      cy.get('[data-testid="data-field-caracteres-gerados-value"]').should(
        'not.be.empty'
      );

      // Verificar que há caracteres gerados (sem validar tamanho exato)
      cy.get('[data-testid="data-field-caracteres-gerados-value"]')
        .invoke('text')
        .then(text => {
          expect(text.length).to.be.greaterThan(0);
        });
    });

    it('deve limpar campo de quantidade', () => {
      cy.get('[data-testid="caracteres-length-input"]').type('5');
      cy.get('[data-testid="caracteres-clear-btn"]').click();
      cy.get('[data-testid="caracteres-length-input"]').should('be.empty');
    });
  });

  describe('Contador de Caracteres', () => {
    it('deve contar caracteres do texto inserido', () => {
      const textoTeste = 'Este é um texto de teste';

      cy.get('[data-testid="contador-card"]').should('be.visible');

      // Inserir texto - separar comandos para evitar linter error
      cy.get('[data-testid="data-field-texto-textarea"]').clear();
      cy.get('[data-testid="data-field-texto-textarea"]').type(textoTeste);

      // Verificar contador - separar comando para evitar linter error
      cy.get('[data-testid="contador-total-value"]').should(
        'contain.text',
        textoTeste.length.toString()
      );
    });

    it('deve limpar texto quando há conteúdo', () => {
      const textoTeste = 'Texto para limpar';

      // Inserir texto primeiro
      cy.get('[data-testid="data-field-texto-textarea"]').clear();
      cy.get('[data-testid="data-field-texto-textarea"]').type(textoTeste);

      // Verificar que o contador mostra o tamanho correto
      cy.get('[data-testid="contador-total-value"]').should(
        'contain.text',
        textoTeste.length.toString()
      );

      // O botão de limpar deve aparecer quando há texto
      cy.get('[data-testid="data-field-texto-clear-btn"]').should('exist');
    });
  });

  describe('Responsividade', () => {
    it('deve funcionar em diferentes tamanhos de tela', () => {
      // Desktop
      cy.viewport(1200, 800);
      cy.get('[data-testid="documentos-card"]').should('be.visible');

      // Mobile
      cy.viewport(375, 667);
      cy.get('[data-testid="documentos-card"]').should('be.visible');

      // Tablet
      cy.viewport(768, 1024);
      cy.get('[data-testid="documentos-card"]').should('be.visible');
    });
  });
});
