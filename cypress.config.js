import { defineConfig } from "cypress";

export default defineConfig({
	e2e: {
		baseUrl: "http://localhost:3000",
		setupNodeEvents(on, config) {
			// implement node event listeners here
		},
		specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
		supportFile: "cypress/support/e2e.js",
		videosFolder: "cypress/videos",
		screenshotsFolder: "cypress/screenshots",
		video: true,
		screenshot: "on-failure",
	},
	component: {
		devServer: {
			framework: "react",
			bundler: "vite",
		},
		specPattern: "src/**/*.cy.{js,jsx,ts,tsx}",
		supportFile: "cypress/support/component.js",
	},
	env: {
		// Variáveis de ambiente para testes
		generateDataDelay: 500,
	},
});
