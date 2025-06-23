# 🤝 Guia de Contribuição - KQA

Este documento define os workflows e padrões de desenvolvimento do projeto KQA.

## 🎯 Workflows de Desenvolvimento

### 📋 **Opção 1 - Release Controlado (Recomendado para Features Grandes)**

```bash
# 1. 📝 Desenvolvimento na branch de feature
git checkout -b feat/nova-funcionalidade
git commit -m "feat: implementar nova funcionalidade"
git push origin feat/nova-funcionalidade

# 2. 🔄 Criar Pull Request (SEM merge ainda)
# → Abrir PR no GitHub para review

# 3. ✅ Após aprovação - Merge local + Release
git checkout main
git pull origin main
git merge feat/nova-funcionalidade
npm run release:minor  # ou patch/major conforme necessário

# 4. 🎉 Resultado: 1 deploy com versão correta
```

### 📋 **Opção 2 - Release Post-Merge (Fluxo Padrão GitHub)**

```bash
# 1. 📝 Desenvolvimento + Push
git checkout -b feat/nova-funcionalidade
git commit -m "feat: implementar nova funcionalidade"
git push origin feat/nova-funcionalidade

# 2. 🔄 Pull Request + Merge automático
# → GitHub faz merge → Vercel deploy v1.0.0

# 3. 🚀 Release manual após merge
git checkout main
git pull origin main
npm run release:minor
# → Nova versão v1.1.0 → Vercel deploy final
```

## 📝 Conventional Commits

### Formato Obrigatório:

```
<tipo>(<escopo>): <descrição>

[corpo opcional]

[rodapé opcional]
```

### Tipos de Commit:

| Tipo        | Impacto na Versão | Exemplo                             |
| ----------- | ----------------- | ----------------------------------- |
| `feat:`     | **MINOR**         | `feat: adicionar gerador de senhas` |
| `fix:`      | **PATCH**         | `fix: corrigir validação de CPF`    |
| `feat!:`    | **MAJOR**         | `feat!: migrar para nova API`       |
| `docs:`     | Nenhum            | `docs: atualizar README`            |
| `style:`    | **PATCH**         | `style: ajustar espaçamento`        |
| `refactor:` | **PATCH**         | `refactor: extrair componente`      |
| `test:`     | Nenhum            | `test: adicionar testes unitários`  |
| `chore:`    | Nenhum            | `chore: atualizar dependências`     |

### ✅ Exemplos Corretos:

```bash
feat: adicionar componente de upload de arquivos
fix(validation): corrigir regex de validação de email
feat(api)!: alterar formato de resposta para v2
docs: adicionar guia de instalação
test: implementar testes para gerador de CPF
refactor: extrair lógica de validação para utils
chore: atualizar dependências do React para v18
```

### ❌ Exemplos Incorretos:

```bash
# Muito vago
fix: correção

# Sem tipo
adicionar nova funcionalidade

# Tipo errado
feat: corrigir bug (deveria ser fix:)

# Sem descrição clara
chore: mudanças
```

## 🚀 Scripts de Release

### Comandos Disponíveis:

```bash
# 🔍 Verificar versão atual
npm run version:check

# 📈 Releases com validação completa
npm run release:patch    # Correções (1.0.0 → 1.0.1)
npm run release:minor    # Funcionalidades (1.0.0 → 1.1.0)
npm run release:major    # Breaking changes (1.0.0 → 2.0.0)

# 🛠️ Comandos manuais (apenas se necessário)
npm run version:patch    # Sem push automático
npm run version:minor    # Sem push automático
npm run version:major    # Sem push automático
```

### ⚠️ Validações Automáticas:

- ✅ **Testes unitários** devem passar
- ✅ **Lint** deve estar sem erros
- ✅ **Build** deve ser bem-sucedido
- ✅ **Formato SemVer** deve ser válido

## 🔄 Processo de Review

### 📋 Checklist do Autor:

- [ ] Testes passando (`npm run test:unit:run`)
- [ ] Lint sem erros (`npm run lint`)
- [ ] Commit seguindo Conventional Commits
- [ ] Documentação atualizada (se necessário)
- [ ] Funcionalidade testada manualmente

### 📋 Checklist do Reviewer:

- [ ] Código segue padrões do projeto
- [ ] Lógica está clara e bem estruturada
- [ ] Testes adequados implementados
- [ ] Performance não foi impactada
- [ ] Segurança foi considerada
- [ ] Acessibilidade foi mantida

## 🌟 Boas Práticas

### ✅ **Commits:**

- **Usar sempre** Conventional Commits
- **Commits pequenos** e focados
- **Mensagens claras** e descritivas
- **Testar** antes de fazer commit

### ✅ **Branches:**

- **Nomenclatura**: `feat/`, `fix/`, `docs/`, `refactor/`
- **Manter atualizadas** com main
- **Deletar** após merge
- **Não commitar** direto na main

### ✅ **Pull Requests:**

- **Título claro** seguindo Conventional Commits
- **Descrição detalhada** do que foi implementado
- **Screenshots** para mudanças visuais
- **Linking issues** relacionadas

### ✅ **Releases:**

- **Sempre na branch main**
- **Após testes** e validações
- **Documentar** mudanças significativas
- **Comunicar** ao time sobre breaking changes

## 🚨 Regras Importantes

### ❌ **Não Fazer:**

- Commits diretos na main
- Releases em branches de feature
- Pular validações de teste/lint
- Usar mensagens de commit vagas
- Fazer releases sem documentar

### ✅ **Sempre Fazer:**

- Testar antes de fazer PR
- Seguir padrões de commit
- Documentar mudanças significativas
- Comunicar breaking changes
- Manter branches atualizadas

## 📞 Dúvidas?

1. **Consulte a documentação**: `docs/VERSIONING.md`
2. **Execute**: `npm run version:check`
3. **Verifique exemplos**: `CHANGELOG.md`
4. **Entre em contato** com a equipe

---

## 🔗 Links Úteis

- [Conventional Commits](https://www.conventionalcommits.org/pt-br/)
- [Semantic Versioning](https://semver.org/lang/pt-BR/)
- [Guia de Versionamento](./VERSIONING.md)
- [Git Flow](https://gitflow.github.io/)

---

**Lembre-se**: Estes workflows foram definidos para **manter qualidade** e **facilitar colaboração**. Quando em dúvida, prefira **segurança** e **comunicação**! 🚀
