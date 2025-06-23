# 📋 Guia de Versionamento - KQA

Este documento define o sistema de versionamento do projeto KQA, baseado em **Semantic Versioning** e **Conventional Commits**.

## 🎯 Semantic Versioning (SemVer)

O projeto segue o padrão **MAJOR.MINOR.PATCH** (ex: `1.2.3`):

### 📊 Tipos de Versão

| Tipo      | Quando Usar            | Exemplo         | Descrição                              |
| --------- | ---------------------- | --------------- | -------------------------------------- |
| **MAJOR** | Mudanças incompatíveis | `1.0.0 → 2.0.0` | Breaking changes, refatorações grandes |
| **MINOR** | Novas funcionalidades  | `1.0.0 → 1.1.0` | Novos recursos compatíveis             |
| **PATCH** | Correções de bugs      | `1.0.0 → 1.0.1` | Fixes, melhorias pequenas              |

### ⚡ Scripts de Versionamento

```bash
# Verificar versão atual
npm run version:check

# Incrementar versões
npm run version:patch    # Para correções (1.0.0 → 1.0.1)
npm run version:minor    # Para funcionalidades (1.0.0 → 1.1.0)
npm run version:major    # Para breaking changes (1.0.0 → 2.0.0)

# Release completo (com testes + lint)
npm run release:patch    # Patch + push com tags
npm run release:minor    # Minor + push com tags
npm run release:major    # Major + push com tags
```

## 📝 Conventional Commits

### Formato

```
<tipo>(<escopo>): <descrição>

[corpo opcional]

[rodapé opcional]
```

### 🏷️ Tipos de Commit

| Tipo       | Emoji | Descrição            | Afeta Versão |
| ---------- | ----- | -------------------- | ------------ |
| `feat`     | ✨    | Nova funcionalidade  | MINOR        |
| `fix`      | 🐛    | Correção de bug      | PATCH        |
| `docs`     | 📚    | Documentação         | -            |
| `style`    | 🎨    | Formatação, CSS      | PATCH        |
| `refactor` | ♻️    | Refatoração          | PATCH        |
| `perf`     | ⚡    | Melhoria performance | PATCH        |
| `test`     | 🧪    | Testes               | -            |
| `chore`    | 🔧    | Manutenção           | -            |
| `ci`       | 👷    | CI/CD                | -            |

### 📖 Exemplos de Commits

```bash
# Nova funcionalidade (MINOR)
feat: adicionar gerador de senhas seguras
feat(cards): suporte para cartão Hipercard

# Correção de bug (PATCH)
fix: corrigir validação de CPF inválido
fix(deploy): resolver erro de build em produção

# Breaking change (MAJOR)
feat!: migrar para nova API de geração
feat(api)!: alterar formato de resposta dos dados

# Outros tipos
docs: atualizar README com instruções de deploy
style(ui): ajustar espaçamento dos cards
refactor: extrair lógica de validação para utils
test: adicionar testes para gerador de CNPJ
chore: atualizar dependências do projeto
```

## 🚀 Fluxo de Release

### 1. **Desenvolvimento**

```bash
# Trabalhar na feature
git checkout -b feat/nova-funcionalidade

# Commits seguindo convenção
git commit -m "feat: adicionar nova funcionalidade"
git commit -m "test: adicionar testes para nova funcionalidade"
git commit -m "docs: documentar nova funcionalidade"
```

### 2. **Pre-Release**

```bash
# Merger na develop/main
git checkout main
git merge feat/nova-funcionalidade

# Executar testes e validações
npm run test:unit:run
npm run lint
```

### 3. **Release**

```bash
# Para nova funcionalidade
npm run release:minor

# Para correção de bug
npm run release:patch

# Para breaking change
npm run release:major
```

### 4. **Deploy Automático**

- O push com tags dispara deploy automático no Vercel
- Arquivo `version.json` é gerado automaticamente
- Changelog é atualizado automaticamente

## 📂 Arquivos de Controle

### `version.json` (Gerado Automaticamente)

```json
{
  "version": "1.2.3",
  "timestamp": "2024-01-15T10:30:00Z",
  "git": {
    "branch": "main",
    "commit": "abc123...",
    "shortCommit": "abc123"
  },
  "environment": "production",
  "buildNumber": "vercel-123"
}
```

### `CHANGELOG.md`

- Gerado automaticamente baseado nos commits
- Organizado por versão e tipo
- Links para commits e PRs

## 🔍 Verificação de Versão

### No Desenvolvimento

```bash
# Verificar versão atual e próximas possíveis
npm run version:check

# Verificar informações de deploy
npm run deploy:check
```

### Em Produção

- Acesse `/version.json` para ver informações da versão
- Footer do app mostra versão atual
- Console do browser exibe informações de build

## 🛡️ Validações Automáticas

### Pre-Commit

- Lint do código
- Testes unitários
- Validação de formato de commit

### Pre-Release

- Todos os testes passando
- Lint sem erros
- Build de produção bem-sucedido

### Post-Release

- Tag criada no Git
- Deploy disparado automaticamente
- Changelog atualizado

## ⚠️ Regras Importantes

### ✅ Boas Práticas

- **Sempre** usar conventional commits
- **Testar** antes de fazer release
- **Documentar** mudanças significativas
- **Revisar** changelog antes do release

### ❌ Evitar

- Commits diretos na main sem passar pelo fluxo
- Releases sem testes
- Mudanças de versão manual no package.json
- Pular validações

## 🔗 Links Úteis

- [Semantic Versioning](https://semver.org/lang/pt-BR/)
- [Conventional Commits](https://www.conventionalcommits.org/pt-br/)
- [Keep a Changelog](https://keepachangelog.com/pt-BR/)
- [Git Flow](https://gitflow.github.io/)

---

## 📞 Suporte

Para dúvidas sobre versionamento:

1. Consulte este documento
2. Execute `npm run version:check`
3. Verifique exemplos no `CHANGELOG.md`
4. Entre em contato com a equipe de desenvolvimento
