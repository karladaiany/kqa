# Card de Registro de BUG

Este card permite registrar informações detalhadas sobre bugs encontrados, com funcionalidades avançadas de extração automática de dados.

## 🆕 Funcionalidade de Extração Automática de ID do Ambiente

### Como Funciona

O campo **URL** agora possui inteligência para extrair automaticamente o **ID do ambiente** quando você inserir links do Twygo.

#### Exemplo Prático:

```
URL inserida: https://app.twygoead.com/admin/o/12345/dashboard
```

**Resultado**: O campo "ID do ambiente" será automaticamente preenchido com `12345`

### Validação e Feedback Visual

#### ✅ **Link Válido do Twygo**

- **Borda verde** no campo URL
- **Indicador de sucesso**: "ID do ambiente extraído automaticamente"
- **Preenchimento automático** do campo ID do ambiente

#### ❌ **Link Inválido**

- **Borda vermelha** no campo URL
- **Mensagens específicas**:
  - "Link do Twygo deve conter ID do ambiente (/o/)"
  - "Não foi possível extrair o ID do ambiente"
  - "URL inválida"

#### 💡 **Link Comum (não Twygo)**

- **Comportamento normal** sem validação específica
- Permite inserir qualquer URL sem interferência

### Exemplos de URLs Suportadas

#### ✅ **URLs Válidas (com extração automática)**

```
https://app.twygoead.com/admin/o/12345/dashboard
https://twygoead.com/platform/o/67890/courses
https://sistema.twygoead.com/o/54321/reports?view=detailed
```

#### ❌ **URLs do Twygo Inválidas**

```
https://app.twygoead.com/admin/dashboard (sem /o/)
https://twygoead.com/platform/courses (sem ID)
```

#### 💡 **URLs Comuns (aceitas sem validação)**

```
https://google.com
https://github.com/projeto
https://app.exemplo.com/bug-report
```

## Benefícios da Nova Funcionalidade

### 🎯 **Precisão**

- Elimina erros de digitação manual do ID do ambiente
- Extração baseada em regex confiável

### ⚡ **Velocidade**

- Preenchimento instantâneo ao colar a URL
- Reduz passos no fluxo de trabalho

### 🔄 **Flexibilidade**

- Campo URL continua funcionando normalmente para outros links
- Funcionalidade opcional - não obrigatória

### 💾 **Persistência**

- URL e ID do ambiente salvos automaticamente no localStorage
- Dados preservados entre sessões

## Implementação Técnica

### Padrão de Extração

```javascript
// Regex utilizada para capturar ID do ambiente
const envMatch = url.match(/\/o\/(\d+)/);
```

### Validações Aplicadas

1. **Domínio**: Deve conter "twygoead.com"
2. **Estrutura**: Deve ter padrão `/o/[número]`
3. **ID**: Número válido extraível do padrão
4. **Formato**: URL válida

### Estados Gerenciados

- `urlValidation`: Status e mensagem de validação
- `envIdExtracted`: Flag de sucesso temporário (3 segundos)
- `bugData.url`: Valor da URL
- `bugData.envId`: ID do ambiente extraído

## Casos de Uso

### 1. **Registro de Bug via Twygo**

```
1. Usuário copia URL da tela onde encontrou o bug
2. Cola no campo URL do card
3. ID do ambiente é extraído automaticamente
4. Prossegue com descrição do bug
```

### 2. **Registro de Bug Geral**

```
1. Usuário insere URL de qualquer sistema
2. Preenche manualmente o ID do ambiente (se necessário)
3. Sistema não interfere no fluxo normal
```

### 3. **Correção de URL Inválida**

```
1. Sistema detecta URL do Twygo sem padrão /o/
2. Mostra mensagem explicativa
3. Usuário corrige a URL ou ignora a validação
```

## Compatibilidade

- ✅ **Todos os navegadores modernos**
- ✅ **Mobile e desktop**
- ✅ **Variações de subdomínio do Twygo**
- ✅ **URLs com parâmetros adicionais**
- ✅ **Preserva funcionalidade existente**

## Funcionalidades Originais do Card

### Campos Principais

- **Descrição do BUG**: Descrição detalhada do problema
- **Passo a passo para reprodução**: Instruções para reproduzir o bug
- **Comportamento esperado**: O que deveria acontecer

### Informações Adicionais

- **URL**: Link onde o bug foi encontrado (agora com extração automática)
- **Login**: Credenciais de acesso
- **Senha**: Senha com toggle de visibilidade
- **ID do ambiente**: Identificador do ambiente (agora preenchido automaticamente)
- **Outros**: Informações complementares

### Evidências

- **Descrição da evidência**: Contexto da evidência
- **Link da evidência**: URL de capturas ou vídeos
- **Evidência em anexo**: Toggle para indicar anexos

### Ações Disponíveis

- **Copiar**: Copia todo o conteúdo formatado
- **Criar atividade**: Abre modal do Artia para criar atividade
- **Limpar tudo**: Reseta todos os campos

### Persistência Inteligente

- Dados salvos automaticamente no localStorage
- Credenciais criptografadas por segurança
- Carregamento automático ao reabrir o card

---

**🚀 A nova funcionalidade de extração automática torna o registro de bugs do Twygo ainda mais eficiente!**
