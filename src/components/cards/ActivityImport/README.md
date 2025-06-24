# 📋 Card de Importação de Atividades - Guia de Uso

## 🎯 Identificando Campos Obrigatórios no CSV

### 📊 Sistema de Indicadores

O template CSV baixado utiliza um sistema de indicadores visuais para identificar campos obrigatórios:

- **`(*)`** = Campo **SEMPRE OBRIGATÓRIO** (para todos os tipos)
- **`(**)`** = Campo **OBRIGATÓRIO PARA ALGUNS TIPOS\*\* específicos
- **Sem indicador** = Campo **OPCIONAL**

### 📑 Campos Sempre Obrigatórios

Estes campos são **obrigatórios para TODOS os tipos de atividade**:

1. **`tipo (*)`** - Tipo da atividade (Bug Produção, Deploy, etc.)
2. **`titulo (*)`** - Título/nome da atividade

### 🎯 Campos Obrigatórios por Tipo

#### **Bug Produção** (13 campos obrigatórios)

- `tipo (*)`, `titulo (*)`
- `ticketMovidesk (**)`, `urgencia (**)`, `plataforma (**)`
- `funcionalidade (**)`, `subFuncionalidade (**)`
- `cliente (**)`, `idOrganizacao (**)`, `email (**)`
- `tipoCliente (**)`, `criticidade (**)`, `dificuldadeLocalizacao (**)`
- `causaDemanda (**)`, `garantia (**)`

#### **Bug Retrabalho** (5 campos obrigatórios)

- `tipo (*)`, `titulo (*)`
- `plataforma (**)`, `funcionalidade (**)`, `subFuncionalidade (**)`

#### **Desenvolvimento** (4 campos obrigatórios)

- `tipo (*)`, `titulo (*)`
- `funcionalidade (**)`, `subFuncionalidade (**)`

#### **Execução de Testes** (4 campos obrigatórios)

- `tipo (*)`, `titulo (*)`
- `funcionalidade (**)`, `subFuncionalidade (**)`

#### **Automação de Testes** (4 campos obrigatórios)

- `tipo (*)`, `titulo (*)`
- `funcionalidade (**)`, `subFuncionalidade (**)`

#### **Análise de Testes** (4 campos obrigatórios)

- `tipo (*)`, `titulo (*)`
- `funcionalidade (**)`, `subFuncionalidade (**)`

#### **Tipos Simples** (apenas 2 campos obrigatórios)

- **Teste de Mesa**: `tipo (*)`, `titulo (*)`
- **Deploy**: `tipo (*)`, `titulo (*)`
- **Documentação**: `tipo (*)`, `titulo (*)`

## 📝 Como Ler o Template

### 1. **Header com Indicadores**

```csv
tipo (*),titulo (*),descricao,esforcoEstimado,ticketMovidesk (**),urgencia (**),...
```

### 2. **Linha de Legenda**

```csv
"LEGENDA: (*) = SEMPRE OBRIGATÓRIO | (**) = OBRIGATÓRIO PARA ALGUNS TIPOS | sem indicador = OPCIONAL",,,,,,...
```

### 3. **Comentários por Tipo**

```csv
"TIPO: Bug Produção | CAMPOS OBRIGATÓRIOS: tipo, titulo, ticketMovidesk, urgencia, plataforma, funcionalidade, subFuncionalidade, cliente, idOrganizacao, email, tipoCliente, criticidade, dificuldadeLocalizacao, causaDemanda, garantia",,,,,,...
```

### 4. **Exemplos de Dados**

```csv
Bug Produção,"[BUG PRODUÇÃO-001] Exemplo de Bug Produção","Descrição detalhada da atividade de Bug Produção",2.5,"MOV-12345","Alto",...
```

## ⚠️ Dicas Importantes

### ✅ **Boas Práticas**

- **Delete as linhas de comentário** antes de importar (linhas que começam com "LEGENDA" e "TIPO:")
- **Mantenha apenas o header e os dados** para importação
- **Preencha TODOS os campos marcados** com `(*)` e `(**)` para os tipos escolhidos
- **Use os valores exatos** dos exemplos para campos com opções limitadas

### 🚫 **Erros Comuns**

- Deixar campos obrigatórios vazios
- Usar valores inválidos (ex: "Muito Alto" em vez de "Alto" para urgência)
- Incluir as linhas de comentário na importação
- Misturar tipos de atividade sem preencher campos específicos

### 📋 **Valores Válidos**

#### **Urgência**

- `Baixo`, `Médio`, `Alto`, `Crítico`

#### **Plataforma**

- `Desktop`, `Mobile`, `Tablet`, `Web`, `API`

#### **Criticidade**

- `Baixo`, `Médio`, `Alto`, `Crítico`

#### **Tipo Cliente**

- `Cliente interno`, `Cliente externo`, `Parceiro`, `Fornecedor`

#### **Dificuldade Localização**

- `Baixo`, `Médio`, `Alto`

#### **Causa Demanda**

- `Erro de código`, `Falta de definição`, `Mudança de requisito`, `Erro de ambiente`, `Outro`

#### **Garantia**

- `Sim`, `Não`

## 🎯 Exemplo Prático

Para criar um **Bug Produção**, você DEVE preencher:

```csv
tipo (*),titulo (*),ticketMovidesk (**),urgencia (**),plataforma (**),funcionalidade (**),subFuncionalidade (**),cliente (**),idOrganizacao (**),email (**),tipoCliente (**),criticidade (**),dificuldadeLocalizacao (**),causaDemanda (**),garantia (**)
Bug Produção,Login não funciona no Chrome,MOV-98765,Alto,Desktop,Login,Autenticação,Cliente ABC,12345,cliente@abc.com,Cliente externo,Alto,Médio,Erro de código,Não
```

## 🔄 Fluxo Recomendado

1. **📥 Baixe o template** com os tipos desejados
2. **👀 Analise os indicadores** nos headers
3. **📖 Leia os comentários** de cada tipo
4. **🗑️ Delete as linhas de comentário**
5. **✏️ Preencha os dados** respeitando campos obrigatórios
6. **📤 Faça upload** do arquivo limpo
7. **✅ Valide na preview** antes de importar

---

💡 **Dúvidas?** O sistema mostra erros detalhados durante a validação, indicando exatamente quais campos estão faltando ou incorretos!
