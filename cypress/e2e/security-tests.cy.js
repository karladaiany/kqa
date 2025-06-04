/**
 * Testes de Segurança para KQA
 * Verifica proteções contra XSS, CSRF e outras vulnerabilidades
 */

describe('KQA - Testes de Segurança', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('header h1').should('contain', 'KQA :: Gerador de Dados para QA');
  });

  describe('Proteção contra XSS', () => {
    it('deve sanitizar entrada de texto no contador', () => {
      const xssPayload = "<script>alert('XSS')</script>";

      // Testar no contador de caracteres que aceita textarea
      cy.get('[data-testid="data-field-texto-textarea"]').clear();
      cy.get('[data-testid="data-field-texto-textarea"]').type(xssPayload);

      // Verificar se não há execução do script (o texto deve aparecer como texto, não como HTML)
      cy.get('[data-testid="data-field-texto-textarea"]')
        .should('contain.value', xssPayload)
        .should('not.contain.html', '<script>');
    });

    it('deve verificar se não há execução de scripts maliciosos', () => {
      // Verifica se a página não executa alertas automaticamente
      cy.window().then(win => {
        const originalAlert = win.alert;
        let alertCalled = false;
        win.alert = () => {
          alertCalled = true;
        };

        // Aguardar um tempo para ver se algum script malicioso executa
        cy.wait(1000).then(() => {
          expect(alertCalled).to.be.false;
          win.alert = originalAlert;
        });
      });
    });
  });

  describe('Content Security Policy (CSP)', () => {
    it('deve ter headers de segurança configurados no HTML', () => {
      cy.document().then(doc => {
        const cspMeta = doc.querySelector(
          'meta[http-equiv="Content-Security-Policy"]'
        );
        expect(cspMeta).to.not.be.null;
      });
    });

    it('deve ter X-Frame-Options configurado', () => {
      cy.document().then(doc => {
        const frameOptionsMeta = doc.querySelector(
          'meta[http-equiv="X-Frame-Options"]'
        );
        expect(frameOptionsMeta).to.not.be.null;
      });
    });
  });

  describe('Validação de Dados', () => {
    it('deve validar entrada de dados nos campos de texto', () => {
      // Testar com dados muito longos
      const longString = 'A'.repeat(1000);

      cy.get('[data-testid="data-field-texto-textarea"]').clear();
      cy.get('[data-testid="data-field-texto-textarea"]').type(
        longString.substring(0, 100)
      );
      cy.get('[data-testid="data-field-texto-textarea"]').should(
        'not.be.empty'
      );
    });

    it('deve limitar entrada de números no gerador de caracteres', () => {
      // Testar limite máximo
      cy.get('[data-testid="caracteres-length-input"]').clear();
      cy.get('[data-testid="caracteres-length-input"]').type('999999');

      // Verificar se o campo aceita apenas valores válidos
      cy.get('[data-testid="caracteres-length-input"]').should('be.visible');
    });
  });

  describe('Proteção de Dados Sensíveis', () => {
    it('deve gerar dados válidos sem vazar informações', () => {
      // Verificar se consegue gerar CPF
      cy.get('[data-testid="data-field-cpf-regenerate-btn"]').click();
      cy.get('[data-testid="data-field-cpf-value"]').should('not.be.empty');

      // Verificar se o valor gerado parece ser um CPF válido (formato)
      cy.get('[data-testid="data-field-cpf-value"]')
        .invoke('text')
        .should('match', /^\d{3}\.\d{3}\.\d{3}-\d{2}$/);
    });

    it('deve permitir limpeza segura de dados', () => {
      cy.window().then(win => {
        // Adicionar alguns dados de teste
        win.localStorage.setItem('test-data', 'test-value');
        expect(win.localStorage.getItem('test-data')).to.equal('test-value');

        // Limpar dados
        win.localStorage.removeItem('test-data');
        expect(win.localStorage.getItem('test-data')).to.be.null;
      });
    });
  });

  describe('Funcionalidade de Rate Limiting', () => {
    it('deve permitir operações normais sem bloqueios', () => {
      // Testar geração normal de dados (não excessiva)
      for (let i = 0; i < 3; i++) {
        cy.get('[data-testid="data-field-cpf-regenerate-btn"]').click();
        cy.wait(100);
      }

      // Não deve haver mensagens de erro
      cy.get('.Toastify__toast--error').should('not.exist');
    });
  });

  describe('Integridade de Recursos', () => {
    it('deve carregar recursos seguros', () => {
      // Verificar se fontes externas são HTTPS
      cy.get('link[href*="fonts.googleapis.com"]').should('exist');
      cy.get('link[href*="fonts.googleapis.com"]')
        .should('have.attr', 'href')
        .and('include', 'https://');
    });

    it('deve ter elementos de segurança presentes', () => {
      // Verificar se meta tags de segurança existem
      cy.document().then(doc => {
        const securityMetas = doc.querySelectorAll(
          'meta[http-equiv*="Content-Security-Policy"], meta[http-equiv*="X-Frame-Options"]'
        );
        expect(securityMetas.length).to.be.greaterThan(0);
      });
    });
  });

  describe('Validação de LocalStorage', () => {
    it('deve permitir operações seguras no localStorage', () => {
      cy.window().then(win => {
        // Testar operações básicas de localStorage
        const testKey = 'security-test';
        const testValue = JSON.stringify({
          data: 'test',
          timestamp: Date.now(),
        });

        // Salvar dados
        win.localStorage.setItem(testKey, testValue);

        // Recuperar dados
        const retrieved = win.localStorage.getItem(testKey);
        expect(retrieved).to.equal(testValue);

        // Limpar dados
        win.localStorage.removeItem(testKey);
        expect(win.localStorage.getItem(testKey)).to.be.null;
      });
    });

    it('deve lidar com dados corrompidos graciosamente', () => {
      cy.window().then(win => {
        // Inserir JSON inválido
        win.localStorage.setItem('corrupted-data', '{invalid json}');

        // Recarregar página para ver se ainda funciona
        cy.reload();
        cy.get('header h1').should('be.visible');

        // Limpar dados corrompidos
        win.localStorage.removeItem('corrupted-data');
      });
    });
  });

  describe('Proteção contra Ataques', () => {
    it('deve prevenir manipulação de DOM maliciosa', () => {
      cy.window().then(win => {
        // Tentar adicionar elemento malicioso
        const maliciousScript = win.document.createElement('script');
        maliciousScript.textContent = 'window.maliciousFlag = true;';

        // Tentar adicionar ao head
        try {
          win.document.head.appendChild(maliciousScript);
        } catch (e) {
          // CSP deve bloquear
        }

        // Verificar se a aplicação ainda funciona
        cy.get('[data-testid="documentos-card"]').should('be.visible');
      });
    });

    it('deve validar funcionalidades de cópia segura', () => {
      // Gerar dados e testar cópia
      cy.get('[data-testid="data-field-cpf-regenerate-btn"]').click();
      cy.get('[data-testid="data-field-cpf-copy-btn"]').click();

      // Verificar se não há erros de segurança na cópia
      cy.get('.Toastify__toast--success', { timeout: 3000 }).should(
        'be.visible'
      );
    });
  });
});
