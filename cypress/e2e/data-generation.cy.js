describe("KQA - Geração de Dados", () => {
	beforeEach(() => {
		cy.visit("/");
		cy.get("header h1").should(
			"contain",
			"KQA :: Gerador de Dados para QA"
		);
	});

	describe("Geração de Documentos", () => {
		it("deve gerar CPF válido", () => {
			// Encontrar o card de documentos
			cy.get("#documentos").should("be.visible");

			// Gerar CPF
			cy.get("#documentos").within(() => {
				cy.contains("CPF")
					.parent()
					.within(() => {
						cy.get('button[title*="Regenerar"]').click();
						cy.get("input").should("not.be.empty");
						cy.get("input")
							.invoke("val")
							.should("match", /^\d{3}\.\d{3}\.\d{3}-\d{2}$/);
					});
			});
		});

		it("deve gerar CNPJ válido", () => {
			cy.get("#documentos").within(() => {
				cy.contains("CNPJ")
					.parent()
					.within(() => {
						cy.get('button[title*="Regenerar"]').click();
						cy.get("input").should("not.be.empty");
						cy.get("input")
							.invoke("val")
							.should(
								"match",
								/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/
							);
					});
			});
		});

		it("deve alternar entre formato com e sem máscara", () => {
			cy.get("#documentos").within(() => {
				cy.contains("CPF")
					.parent()
					.within(() => {
						// Clicar no botão de máscara
						cy.get('button[title*="máscara"]').click();
						cy.get("input")
							.invoke("val")
							.should("match", /^\d{11}$/);

						// Voltar para formato com máscara
						cy.get('button[title*="máscara"]').click();
						cy.get("input")
							.invoke("val")
							.should("match", /^\d{3}\.\d{3}\.\d{3}-\d{2}$/);
					});
			});
		});
	});

	describe("Geração de Dados Pessoais", () => {
		it("deve gerar dados pessoais completos", () => {
			cy.get("#dados-pessoais").should("be.visible");

			// Gerar todos os dados
			cy.get("#dados-pessoais").within(() => {
				cy.get(".generate-all-btn").click();

				// Verificar se todos os campos foram preenchidos
				cy.contains("Nome")
					.parent()
					.find("input")
					.should("not.be.empty");
				cy.contains("E-mail")
					.parent()
					.find("input")
					.should("contain", "@");
				cy.contains("Telefone")
					.parent()
					.find("input")
					.should("not.be.empty");
				cy.contains("Endereço")
					.parent()
					.find("input")
					.should("not.be.empty");
				cy.contains("CEP")
					.parent()
					.find("input")
					.should("match", /^\d{5}-\d{3}$/);
			});
		});

		it("deve regenerar campos individuais", () => {
			cy.get("#dados-pessoais").within(() => {
				// Gerar nome
				cy.contains("Nome")
					.parent()
					.within(() => {
						const oldValue = cy.get("input").invoke("val");
						cy.get('button[title*="Regenerar"]').click();
						cy.get("input").should("not.be.empty");
						// Valor deve ter mudado (probabilidade muito alta)
					});
			});
		});
	});

	describe("Funcionalidade de Cópia", () => {
		it("deve copiar valores para a área de transferência", () => {
			cy.get("#documentos").within(() => {
				cy.contains("CPF")
					.parent()
					.within(() => {
						cy.get('button[title*="Copiar"]').click();
						cy.get(".Toastify__toast--success").should(
							"be.visible"
						);
					});
			});
		});
	});

	describe("Cartão de Crédito", () => {
		it("deve gerar cartão de crédito válido", () => {
			cy.get("#cartao")
				.should("be.visible")
				.within(() => {
					cy.get('button[title*="Regenerar cartão"]').click();

					// Verificar número do cartão
					cy.contains("Número")
						.parent()
						.find("input")
						.should("not.be.empty");
					cy.contains("Número")
						.parent()
						.find("input")
						.invoke("val")
						.should("match", /^\d{4}\s\d{4}\s\d{4}\s\d{4}$/);

					// Verificar CVV
					cy.contains("CVV")
						.parent()
						.find("input")
						.should("not.be.empty");
					cy.contains("CVV")
						.parent()
						.find("input")
						.invoke("val")
						.should("match", /^\d{3,4}$/);
				});
		});
	});

	describe("Responsividade", () => {
		it("deve funcionar em diferentes tamanhos de tela", () => {
			// Desktop
			cy.viewport(1200, 800);
			cy.get(".content-wrapper").should("be.visible");
			cy.get("#menu-toggle").should("not.be.visible");

			// Mobile
			cy.viewport(375, 667);
			cy.get("#menu-toggle").should("be.visible");
			cy.get("#menu-toggle").click();
			cy.get(".sidebar").should("be.visible");
		});
	});
});
