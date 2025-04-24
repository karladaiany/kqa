describe('Funcionalidade de Copiar', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('deve copiar CPF para a área de transferência', () => {
        cy.get('#generate-cpf').click();
        cy.get('#cpf').then($cpf => {
            const cpf = $cpf.text();
            cy.get('#cpf').siblings('.campo-acoes').find('.copy-icon').click();
            cy.window().then(win => {
                win.navigator.clipboard.readText().then(text => {
                    expect(text).to.equal(cpf);
                });
            });
        });
    });

    it('deve copiar CNPJ para a área de transferência', () => {
        cy.get('#generate-cnpj').click();
        cy.get('#cnpj').then($cnpj => {
            const cnpj = $cnpj.text();
            cy.get('#cnpj').siblings('.campo-acoes').find('.copy-icon').click();
            cy.window().then(win => {
                win.navigator.clipboard.readText().then(text => {
                    expect(text).to.equal(cnpj);
                });
            });
        });
    });

    it('deve copiar RG para a área de transferência', () => {
        cy.get('#generate-rg').click();
        cy.get('#rg').then($rg => {
            const rg = $rg.text();
            cy.get('#rg').siblings('.campo-acoes').find('.copy-icon').click();
            cy.window().then(win => {
                win.navigator.clipboard.readText().then(text => {
                    expect(text).to.equal(rg);
                });
            });
        });
    });

    it('deve copiar dados pessoais para a área de transferência', () => {
        cy.get('#generate-person').click();
        const fields = ['nome', 'email', 'telefone', 'celular', 'rua', 'numero', 'bairro', 'cidade', 'estado', 'cep'];
        
        fields.forEach(field => {
            cy.get(`#pessoa-${field}`).then($element => {
                const value = $element.text();
                cy.get(`#pessoa-${field}`).siblings('.campo-acoes').find('.copy-icon').click();
                cy.window().then(win => {
                    win.navigator.clipboard.readText().then(text => {
                        expect(text).to.equal(value);
                    });
                });
            });
        });
    });

    it('deve copiar dados de cartão de crédito para a área de transferência', () => {
        cy.get('#generate-card').click();
        const fields = ['number', 'brand', 'expiry', 'cvv'];
        
        fields.forEach(field => {
            cy.get(`#card-${field}`).then($element => {
                const value = $element.text();
                cy.get(`#card-${field}`).siblings('.campo-acoes').find('.copy-icon').click();
                cy.window().then(win => {
                    win.navigator.clipboard.readText().then(text => {
                        expect(text).to.equal(value);
                    });
                });
            });
        });
    });

    it('deve copiar dados de produto para a área de transferência', () => {
        cy.get('#generate-product').click();
        const fields = ['nome', 'descricao', 'preco', 'categoria', 'codigo', 'marca', 'modelo', 'estoque'];
        
        fields.forEach(field => {
            cy.get(`#produto-${field}`).then($element => {
                const value = $element.text();
                cy.get(`#produto-${field}`).siblings('.campo-acoes').find('.copy-icon').click();
                cy.window().then(win => {
                    win.navigator.clipboard.readText().then(text => {
                        expect(text).to.equal(value);
                    });
                });
            });
        });
    });
}); 