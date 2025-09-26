# Guia de Instalação e Execução do FinançasPro

Este guia fornece instruções detalhadas para instalar e executar a aplicação FinançasPro em seu ambiente local ou em um servidor de sua escolha.

## Requisitos do Sistema

### Para o Backend
- Python 3.11 ou superior
- pip (gerenciador de pacotes Python)
- Ambiente virtual Python (venv)

### Para o Frontend
- Node.js 14.x ou superior
- npm ou yarn

## Estrutura do Projeto

```
financas-pro-app/
├── backend/
│   ├── requirements.txt
│   ├── src/
│   │   ├── main.py
│   │   └── ...
│   └── venv/
└── frontend/
    ├── package.json
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   └── ...
    └── build/
```

## Instalação

### 1. Configuração do Backend

1. Navegue até a pasta do backend:
   ```bash
   cd financas-pro-app/backend
   ```

2. Crie um ambiente virtual Python:
   ```bash
   python -m venv venv
   ```

3. Ative o ambiente virtual:
   - No Windows:
     ```bash
     venv\Scripts\activate
     ```
   - No Linux/Mac:
     ```bash
     source venv/bin/activate
     ```

4. Instale as dependências:
   ```bash
   pip install -r requirements.txt
   ```

### 2. Configuração do Frontend

1. Navegue até a pasta do frontend:
   ```bash
   cd financas-pro-app/frontend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Construa o frontend para produção:
   ```bash
   npm run build
   ```

## Execução da Aplicação

### Opção 1: Execução Local (Desenvolvimento)

1. Inicie o backend:
   ```bash
   cd financas-pro-app/backend
   source venv/bin/activate  # ou venv\Scripts\activate no Windows
   python src/main.py
   ```
   O backend estará disponível em: http://localhost:5000

2. Em outro terminal, inicie o frontend:
   ```bash
   cd financas-pro-app/frontend
   npm start
   ```
   O frontend estará disponível em: http://localhost:3000

### Opção 2: Execução Integrada (Produção)

1. Copie os arquivos de build do frontend para a pasta static do backend:
   ```bash
   mkdir -p financas-pro-app/backend/src/static
   cp -r financas-pro-app/frontend/build/* financas-pro-app/backend/src/static/
   ```

2. Inicie o backend com Gunicorn:
   ```bash
   cd financas-pro-app/backend
   source venv/bin/activate  # ou venv\Scripts\activate no Windows
   gunicorn src.main:app
   ```
   A aplicação completa estará disponível em: http://localhost:8000

## Implantação em Servidor

### Opção 1: Implantação Manual

1. Transfira os arquivos do projeto para seu servidor
2. Configure o ambiente Python e Node.js no servidor
3. Siga os passos de instalação acima
4. Configure um servidor web (Nginx, Apache) para servir a aplicação

### Opção 2: Implantação no Heroku

1. Instale a CLI do Heroku
2. Faça login no Heroku:
   ```bash
   heroku login
   ```
3. Crie um novo aplicativo:
   ```bash
   heroku create financas-pro-app
   ```
4. Configure os buildpacks:
   ```bash
   heroku buildpacks:add heroku/python
   ```
5. Faça o deploy:
   ```bash
   git push heroku main
   ```

## Credenciais de Demonstração

Para acessar a aplicação, utilize as seguintes credenciais:
- **Email**: demo@financaspro.com
- **Senha**: senha123

## Funcionalidades Implementadas

- Dashboard financeiro com visualizações gráficas
- Sistema de importação de planilhas Excel
- Funcionalidade de conciliação automática
- Interface com tema claro/escuro
- Sistema de autenticação e autorização

## Suporte

Se você encontrar algum problema durante a instalação ou execução, entre em contato através do email: suporte@financaspro.com
