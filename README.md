# KQA - Gerador de Dados Fictícios para QA

Uma aplicação web para gerar dados fictícios úteis para testes de qualidade de software.

## Funcionalidades

- Geração de documentos (CPF, CNPJ, RG)
- Geração de dados pessoais
- Geração de cartões de crédito e débito
- Geração de produtos
- Copiar dados para área de transferência
- Alternar entre tema claro e escuro
- Interface responsiva

## Tecnologias Utilizadas

- JavaScript (ES6+)
- HTML5
- CSS3
- Bootstrap 5
- Font Awesome
- Faker.js
- Vite
- ESLint
- Cypress (para testes)

## Estrutura do Projeto

```
kqa/
├── src/
│   ├── config/         # Arquivos de configuração
│   ├── generators/     # Geradores de dados
│   ├── dom/           # Manipulação do DOM
│   ├── services/      # Serviços (storage, etc)
│   ├── utils/         # Funções utilitárias
│   └── main.js        # Arquivo principal
├── public/            # Arquivos estáticos
├── styles.css         # Estilos CSS
├── index.html         # Página principal
├── package.json       # Dependências e scripts
├── vite.config.js     # Configuração do Vite
└── .eslintrc.js       # Configuração do ESLint
```

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/kqa.git
cd kqa
```

2. Instale as dependências:
```bash
npm install
```

## Desenvolvimento

Para iniciar o servidor de desenvolvimento:
```bash
npm run dev
```

## Build

Para criar uma versão de produção:
```bash
npm run build
```

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.
