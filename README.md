# 🎲 KQA :: Gerador de Dados para QA

Sistema completo para geração de dados de teste e automação de QA, desenvolvido para facilitar o trabalho de Quality Assurance Engineers.

## 🚀 Funcionalidades

### 📋 Geração de Dados

- **Documentos**: CPF, CNPJ, RG com formatação automática
- **Dados Pessoais**: Nome, email, telefone, endereço completo
- **Produtos**: Nome, descrição e categorias aleatórias
- **Cartões**: Visa, Mastercard, Amex, Elo e Erede com validação
- **Utilitários**: Gerador de caracteres e contador de texto

### 📁 Geração de Arquivos

- Exportação em JSON e CSV
- Configuração de separadores CSV
- Seleção de campos personalizados
- Controle de quantidade de registros

### 🔧 Ferramentas Complementares

- Geração de senhas seguras
- Registro de bugs e comentários QA
- Controle de deploy e evidências
- Interface responsiva com tema claro/escuro

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React.js, JavaScript ES6+
- **Estilização**: CSS3 com variáveis customizadas
- **Ícones**: React Icons (Font Awesome)
- **Notificações**: React Toastify
- **Build**: Vite
- **Testes**: Vitest (unitários) configurado

## 📦 Instalação e Uso

```bash
# Clone o repositório
git clone https://github.com/karladaiany/kqa.git

# Entre no diretório
cd kqa

# Instale as dependências
npm install

# Execute em modo desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 🎨 Personalização

### Adicionando sua Imagem de Avatar

1. Adicione sua foto em `public/assets/karla-avatar.jpg`
2. A imagem será exibida automaticamente no footer
3. Caso a imagem não carregue, será exibido um fallback com suas iniciais

### Configurando Links Sociais

Edite o arquivo `src/components/Footer.jsx` para atualizar seus links:

```jsx
<a href="https://github.com/seu-usuario" target="_blank">
  <FaGithub />
</a>
<a href="https://linkedin.com/in/seu-perfil" target="_blank">
  <FaLinkedin />
</a>
```

## 📱 Responsividade

O sistema é totalmente responsivo e funciona perfeitamente em:

- 💻 Desktop (1200px+)
- 📱 Tablet (768px - 1199px)
- 📱 Mobile (até 767px)

## 🔒 Boas Práticas Implementadas

- **DRY (Don't Repeat Yourself)**: Componentes reutilizáveis
- **Performance**: Lazy loading e otimizações de renderização
- **Acessibilidade**: ARIA labels e navegação por teclado
- **SEO**: Meta tags e estrutura semântica
- **Segurança**: Validação de dados e sanitização

## 🧪 Testes Unitários

O projeto está configurado para testes unitários com Vitest:

```bash
# Executar testes unitários
npm run test:unit:run

# Executar testes com cobertura
npm run test:unit:coverage
```

## 📋 Versionamento

O projeto segue [Semantic Versioning](https://semver.org/lang/pt-BR/) e [Conventional Commits](https://www.conventionalcommits.org/pt-br/):

### Scripts de Versionamento

```bash
# Verificar versão atual
npm run version:check

# Releases automáticos (com testes + lint + push)
npm run release:patch    # Correções (1.0.0 → 1.0.1)
npm run release:minor    # Funcionalidades (1.0.0 → 1.1.0)
npm run release:major    # Breaking changes (1.0.0 → 2.0.0)
```

### Conventional Commits

```bash
feat: adicionar nova funcionalidade      # MINOR version
fix: corrigir bug específico            # PATCH version
feat!: mudança incompatível             # MAJOR version
docs: atualizar documentação            # No version change
```

📖 **Documentação completa**: [docs/VERSIONING.md](docs/VERSIONING.md)

## 🤝 Contribuição

Este projeto segue workflows específicos de desenvolvimento e versionamento:

### 📋 Para Contribuidores

- **Guia completo**: [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md)
- **Conventional Commits** obrigatório
- **Testes** e **lint** obrigatórios
- **Review** via Pull Request

### 🚀 Workflow Rápido

```bash
# 1. Criar branch de feature
git checkout -b feat/minha-feature

# 2. Desenvolver + commit seguindo convenção
git commit -m "feat: adicionar nova funcionalidade"

# 3. Push + PR
git push origin feat/minha-feature

# 4. Após merge → Release na main
npm run release:minor
```

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👩‍💻 Sobre a Criadora

<div align="center">
  <img src="public/assets/karla-avatar.jpg" alt="Karla Daiany" width="120" style="border-radius: 50%;">
  
  **Karla Daiany**  
  *QA Automation Engineer*
  
  Especialista em automação de testes e desenvolvimento de ferramentas para QA.  
  Apaixonada por criar soluções que tornam o trabalho de qualidade mais eficiente.
  
  [![GitHub](https://img.shields.io/badge/GitHub-karladaiany-181717?style=flat&logo=github)](https://github.com/karladaiany)
  [![LinkedIn](https://img.shields.io/badge/LinkedIn-karladaiany-0A66C2?style=flat&logo=linkedin)](https://linkedin.com/in/karladaiany)
</div>

---

<div align="center">
  <p>Feito com ❤️ e ☕ por <strong>Karla Daiany</strong></p>
  <p><em>Sistema KQA - Facilitando o trabalho de QA desde 2024</em></p>
</div>
