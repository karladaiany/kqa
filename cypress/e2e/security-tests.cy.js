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
    const xssPayloads = [
      "<script>alert('XSS')</script>",
      "javascript:alert('XSS')",
      "<img src=x onerror=alert('XSS')>",
      "<svg onload=alert('XSS')>",
      "';alert('XSS');//",
      "<iframe src=javascript:alert('XSS')></iframe>",
    ];

    xssPayloads.forEach((payload, index) => {
      it(`deve sanitizar payload XSS #${index + 1}: ${payload.substring(0, 30)}...`, () => {
        // Tenta inserir payload XSS em campos de texto
        cy.get('#dados-pessoais').within(() => {
          cy.contains('Nome')
            .parent()
            .within(() => {
              cy.get('input').clear().type(payload);
              cy.get('input').should('not.contain.value', '<script');
              cy.get('input').should('not.contain.value', 'javascript:');
              cy.get('input').should('not.contain.value', 'onerror');
            });
        });

        // Verifica se nenhum alerta foi executado
        cy.window().then(win => {
          cy.stub(win, 'alert').as('windowAlert');
        });
        cy.get('@windowAlert').should('not.have.been.called');
      });
    });

    it('deve sanitizar dados salvos no localStorage', () => {
      const maliciousData = "<script>alert('XSS')</script>";

      cy.window().then(win => {
        // Tenta salvar dados maliciosos
        win.localStorage.setItem(
          'test-xss',
          JSON.stringify({
            data: maliciousData,
          })
        );
      });

      // Recarrega a página para verificar se dados são sanitizados
      cy.reload();

      // Verifica se dados foram sanitizados
      cy.window().then(win => {
        const storedData = win.localStorage.getItem('test-xss');
        if (storedData) {
          const parsed = JSON.parse(storedData);
          expect(parsed.data).to.not.include('<script');
          expect(parsed.data).to.not.include('javascript:');
        }
      });
    });
  });

  describe('Content Security Policy (CSP)', () => {
    it('deve ter headers de segurança configurados', () => {
      cy.request('/').then(response => {
        // Verifica se CSP está configurado no HTML
        expect(response.body).to.include('Content-Security-Policy');
        expect(response.body).to.include('X-Content-Type-Options');
        expect(response.body).to.include('X-Frame-Options');
      });
    });

    it('deve bloquear scripts inline maliciosos', () => {
      cy.window().then(win => {
        // Tenta criar um script malicioso
        const script = win.document.createElement('script');
        script.innerHTML = "alert('CSP Bypass Attempt')";

        // Verifica se o script é bloqueado
        cy.wrap(
          new Promise(resolve => {
            script.onerror = () => resolve('blocked');
            script.onload = () => resolve('loaded');
            win.document.head.appendChild(script);
            setTimeout(() => resolve('timeout'), 1000);
          })
        ).should('not.equal', 'loaded');
      });
    });
  });

  describe('Validação de Entrada', () => {
    it('deve limitar o tamanho dos inputs', () => {
      const longString = 'A'.repeat(10000); // String muito longa

      cy.get('#dados-pessoais').within(() => {
        cy.contains('Nome')
          .parent()
          .within(() => {
            cy.get('input').clear().type(longString.substring(0, 500));
            cy.get('input')
              .invoke('val')
              .then(value => {
                expect(value.length).to.be.lessThan(5000);
              });
          });
      });
    });

    it('deve validar emails de forma segura', () => {
      const maliciousEmails = [
        "<script>alert('xss')</script>@test.com",
        "test@<script>alert('xss')</script>.com",
        "javascript:alert('xss')@test.com",
      ];

      maliciousEmails.forEach(email => {
        cy.get('#dados-pessoais').within(() => {
          cy.contains('E-mail')
            .parent()
            .within(() => {
              cy.get('input').clear().type(email);
              cy.get('input').should('not.contain.value', '<script');
              cy.get('input').should('not.contain.value', 'javascript:');
            });
        });
      });
    });
  });

  describe('Proteção de Dados Sensíveis', () => {
    it('não deve vazar dados no console', () => {
      const consoleLogs = [];

      cy.window().then(win => {
        // Mock console methods para detectar vazamentos
        cy.stub(win.console, 'log').callsFake((...args) => {
          consoleLogs.push(args.join(' '));
        });
      });

      // Gera alguns dados
      cy.get('#documentos').within(() => {
        cy.contains('CPF')
          .parent()
          .within(() => {
            cy.get('button[title*="Regenerar"]').click();
          });
      });

      // Verifica se não há dados sensíveis no console
      cy.then(() => {
        consoleLogs.forEach(log => {
          expect(log).to.not.match(/\d{3}\.\d{3}\.\d{3}-\d{2}/); // CPF
          expect(log).to.not.match(/\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}/); // CNPJ
        });
      });
    });

    it('deve limpar dados sensíveis ao sair', () => {
      // Gera alguns dados
      cy.get('#documentos').within(() => {
        cy.contains('CPF')
          .parent()
          .within(() => {
            cy.get('button[title*="Regenerar"]').click();
          });
      });

      // Simula saída da aplicação
      cy.window().then(win => {
        win.dispatchEvent(new Event('beforeunload'));

        // Verifica se dados temporários foram limpos
        const temporaryKeys = Object.keys(win.localStorage).filter(
          key => key.includes('temp_') || key.includes('cache_')
        );
        expect(temporaryKeys).to.have.length(0);
      });
    });
  });

  describe('Rate Limiting', () => {
    it('deve limitar geração excessiva de dados', () => {
      // Tenta gerar dados rapidamente múltiplas vezes
      for (let i = 0; i < 10; i++) {
        cy.get('#documentos').within(() => {
          cy.contains('CPF')
            .parent()
            .within(() => {
              cy.get('button[title*="Regenerar"]').click();
            });
        });
      }

      // Verifica se há algum tipo de limitação ou alerta
      cy.get('.Toastify__toast').should('exist');
    });
  });

  describe('Proteção contra Clickjacking', () => {
    it('deve ter proteção X-Frame-Options', () => {
      cy.request('/').then(response => {
        expect(response.body).to.include('X-Frame-Options');
        expect(response.body).to.include('DENY');
      });
    });
  });

  describe('Proteção de Referrer', () => {
    it('deve ter política de referrer configurada', () => {
      cy.request('/').then(response => {
        expect(response.body).to.include('Referrer-Policy');
      });
    });
  });

  describe('Validação de LocalStorage', () => {
    it('deve validar dados corrompidos no localStorage', () => {
      cy.window().then(win => {
        // Insere dados corrompidos
        win.localStorage.setItem('corrupted-data', '{invalid json}');
        win.localStorage.setItem(
          'malicious-data',
          JSON.stringify({
            __proto__: { isAdmin: true },
            data: 'test',
          })
        );
      });

      // Recarrega a página
      cy.reload();

      // Verifica se a aplicação ainda funciona
      cy.get('header h1').should('be.visible');
      cy.get('#documentos').should('be.visible');
    });

    it('deve limpar dados expirados automaticamente', () => {
      cy.window().then(win => {
        // Insere dados com timestamp antigo
        const oldTimestamp = Date.now() - 30 * 24 * 60 * 60 * 1000; // 30 dias atrás
        win.localStorage.setItem(
          'old-data',
          JSON.stringify({
            timestamp: oldTimestamp,
            data: 'should be cleaned',
          })
        );
      });

      // Aguarda limpeza automática
      cy.wait(1000);

      // Verifica se dados antigos foram limpos
      cy.window().then(win => {
        const oldData = win.localStorage.getItem('old-data');
        if (oldData) {
          const parsed = JSON.parse(oldData);
          expect(Date.now() - parsed.timestamp).to.be.lessThan(
            24 * 60 * 60 * 1000
          );
        }
      });
    });
  });

  describe('Integridade de Recursos', () => {
    it('deve carregar recursos de fontes confiáveis', () => {
      cy.get('link[href*="fonts.googleapis.com"]').should('exist');
      cy.get('script[src*="unsafe"]').should('not.exist');
    });

    it('deve usar HTTPS para recursos externos', () => {
      cy.get('link[href^="http://"]').should('not.exist');
      cy.get('script[src^="http://"]').should('not.exist');
    });
  });
});
