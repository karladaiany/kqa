# Correções para Problemas de Produção - KQA

## Problemas Identificados e Corrigidos

### 1. Content Security Policy (CSP)

**Problema**: Headers de segurança sendo definidos via meta tags em vez de HTTP headers
**Solução**:

- Criado `vercel.json` com configuração de headers HTTP
- Removidos meta tags de CSP do `index.html`
- Adicionado `public/_headers` para compatibilidade com outras plataformas

### 2. Script Inline Bloqueado

**Problema**: Scripts inline sendo rejeitados pela CSP
**Solução**:

- Ajustada CSP para permitir scripts necessários do Vercel
- Melhorado tratamento de erros no `main.jsx`

### 3. Manifest.json Inválido

**Problema**: Protocolo "kqa" não permitido
**Solução**:

- Alterado para "web+kqa" conforme especificação

### 4. Erro React PureComponent

**Problema**: React não carregando corretamente causando erro de PureComponent undefined
**Solução**:

- Adicionado try/catch no render principal
- Implementado fallback com recarregamento automático
- Melhorado tratamento global de erros

## Arquivos Modificados

1. **`vercel.json`** (novo) - Configuração de headers e deploy (removida configuração desnecessária de functions)
2. **`index.html`** - Removidos meta headers de segurança
3. **`public/manifest.json`** - Corrigido protocolo inválido
4. **`public/_headers`** (novo) - Headers para outras plataformas
5. **`vite.config.js`** - Otimizações de build
6. **`src/main.jsx`** - Melhor tratamento de erros
7. **`package.json`** - Script de build otimizado

## Correções Adicionais

### Erro de Build

**Problema**: Erro "The pattern "src/**/\*.js" defined in functions doesn't match any Serverless Functions"
**Solução\*\*: Removida seção `functions` do `vercel.json` pois este é um projeto SPA que não usa funções serverless

### CSP Data URI

**Problema**: Scripts com data URI sendo bloqueados pela CSP
**Solução**: Adicionado `data: blob:` ao `script-src` na CSP

### Preload Desnecessário

**Problema**: Arquivos .jsx sendo pré-carregados mas não existindo no build final
**Solução**: Removidos preloads desnecessários do index.html

### Service Worker

**Problema**: SW tentando cachear arquivos que não existem no build
**Solução**:

- Corrigidos paths no service worker
- Temporariamente desabilitado para debug
- Removidas referências a arquivos .jsx

### Manifest Simplificado

**Problema**: Campos experimentais causando avisos
**Solução**: Removidos `share_target` e `protocol_handlers` problemáticos

### Debug de Cache

**Solução**: Criado `public/clear-cache.html` para limpeza manual de cache durante debug

### React PureComponent Error

**Problema**: Erro "Cannot read properties of undefined (reading 'PureComponent')" em chunks
**Solução**:

- Simplificada configuração de chunks no Vite
- Adicionada verificação de carregamento do React antes de renderizar
- Alterado minificador de Terser para ESBuild (mais estável)
- Configurado jsxRuntime automático

## Comandos para Deploy

```bash
# Build para produção
npm run build

# Preview local da build
npm run preview

# Deploy no Vercel (se usando CLI)
vercel --prod
```

## Verificações Pós-Deploy

1. Verificar se os headers HTTP estão sendo aplicados corretamente
2. Confirmar que não há mais erros de CSP no console
3. Testar carregamento completo da aplicação
4. Verificar se o manifest.json não gera mais avisos

## Headers de Segurança Implementados

- `Content-Security-Policy`: Controla recursos que podem ser carregados
- `X-Content-Type-Options`: Previne MIME sniffing
- `X-Frame-Options`: Previne clickjacking
- `X-XSS-Protection`: Proteção contra XSS
- `Referrer-Policy`: Controla informações de referrer
- `Permissions-Policy`: Controla APIs do navegador

## Notas Importantes

- Os headers agora são definidos via HTTP em vez de meta tags
- Mantida compatibilidade com diferentes plataformas de hosting
- Implementado fallback robusto caso React falhe ao carregar
- CSP configurada para permitir recursos necessários do Vercel Live
