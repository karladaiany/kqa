# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [1.0.0] - 2024-01-XX

### ✨ Funcionalidades Iniciais

- **Geração de Dados**:

  - Gerador de CPF, CNPJ e RG com formatação automática
  - Geração de dados pessoais (nome, email, telefone, endereço)
  - Gerador de produtos com nomes e categorias aleatórias
  - Geração de cartões de teste (Visa, Mastercard, Amex, Elo, Erede)
  - Utilitários para caracteres aleatórios e contador de texto

- **Geração de Arquivos**:

  - Exportação em formatos JSON e CSV
  - Configuração personalizada de separadores CSV
  - Seleção de campos específicos para exportação
  - Controle de quantidade de registros

- **Ferramentas QA**:

  - Sistema de anotações e comentários
  - Registro de bugs com histórico
  - Controle de status de deploy
  - Interface para evidências de teste

- **Interface e UX**:

  - Design responsivo para desktop, tablet e mobile
  - Tema claro/escuro
  - Ícones intuitivos (React Icons)
  - Notificações toast para feedback
  - Navegação otimizada com sidebar

- **Tecnologia e Performance**:
  - Arquitetura React.js moderna
  - Build otimizado com Vite
  - Testes unitários configurados (Vitest)
  - PWA ready com service worker
  - Otimizações de performance e SEO

### 🔒 Segurança

- Implementação de Content Security Policy (CSP)
- Headers de segurança configurados
- Validação e sanitização de dados
- Proteção contra ataques XSS

### 📱 Compatibilidade

- Suporte completo a navegadores modernos
- Interface responsiva para dispositivos móveis
- Acessibilidade com ARIA labels
- Navegação por teclado

---

## Convenções de Commit

Este projeto usa [Conventional Commits](https://www.conventionalcommits.org/) para gerar automaticamente o changelog:

- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `docs:` - Documentação
- `style:` - Formatação, estilo
- `refactor:` - Refatoração de código
- `perf:` - Melhoria de performance
- `test:` - Testes
- `chore:` - Manutenção
- `ci:` - CI/CD

### Exemplos:

```
feat: adicionar gerador de senhas seguras
fix: corrigir validação de CPF com caracteres especiais
docs: atualizar README com instruções de versionamento
```
