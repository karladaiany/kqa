# 📋 Card de Importação de Atividades - Guia de Uso

## 🎯 Identificando Campos Obrigatórios no CSV

### 📊 Sistema de Indicadores

O template CSV baixado utiliza um sistema de indicadores visuais para identificar campos obrigatórios:

- **`(*)`** = Campo **SEMPRE OBRIGATÓRIO** (para todos os tipos)
- **`(**)`** = Campo **OBRIGATÓRIO PARA ALGUNS TIPOS\*\* específicos
- **Sem indicador** = Campo **OPCIONAL**

### 🔧 Formato e Codificação

- **Delimitador**: Ponto-e-vírgula (`;`) - compatível com Excel BR
- **Codificação**: UTF-8 com BOM para caracteres especiais
- **Importação**: Aceita automaticamente vírgula (`,`) ou ponto-e-vírgula (`;`) como delimitadores

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

## 🔄 Template de Atualização

### 📋 Campos Obrigatórios para Atualização

Para atualizar uma atividade, você DEVE fornecer:

1. **`artia_id (*)`** - ID da atividade no Artia
2. **`titulo (*)`** - Título da atividade
3. **`account_id (*)`** - ID do grupo de trabalho

### 📝 Exemplo de Template de Atualização

```csv
artia_id (*),titulo (*),account_id (*),folder_id,custom_status_id,descricao,esforco_estimado,inicio_estimado,termino_estimado
12345,Novo título da atividade,4874953,4885568,246888,Nova descrição detalhada,4,25/03/2024,27/03/2024
```

### 🔧 Configuração Automática

O template de atualização inclui automaticamente os campos de configuração da aplicação:

- **`account_id`**: Preenchido com o valor configurado na aplicação (se disponível)
- **`folder_id`**: Preenchido com o valor configurado na aplicação (se disponível)  
- **`custom_status_id`**: Preenchido com o status selecionado na aplicação (se disponível)

**Prioridade dos valores:**
1. Dados originais do CSV de criação
2. Configuração atual da aplicação
3. Campo vazio (se nenhum valor disponível)

### ⚠️ Dicas para Atualização

- **Mantenha os campos obrigatórios**: Sempre preencha `artia_id`, `titulo` e `account_id`
- **Apenas campos alterados**: Preencha apenas os campos que deseja atualizar
- **Configuração automática**: O template inclui automaticamente `account_id`, `folder_id` e `custom_status_id` se configurados na aplicação
- **Formato de datas**: Use DD/MM/YYYY (será convertido automaticamente)
- **Delimitador**: O template usa ponto-e-vírgula (`;`) por padrão
- **Codificação**: UTF-8 com BOM para caracteres especiais

## 🔄 Fluxo Recomendado

1. **📥 Baixe o template** com os tipos desejados
2. **👀 Analise os indicadores** nos headers
3. **📖 Leia os comentários** de cada tipo
4. **🗑️ Delete as linhas de comentário**
5. **✏️ Preencha os dados** respeitando campos obrigatórios
6. **📤 Faça upload** do arquivo limpo
7. **✅ Valide na preview** antes de importar

## 🎨 Formatação HTML Customizada

### ✨ Funcionalidade Avançada

O campo `descricao` do CSV aceita **formatação HTML customizada** para criar atividades com formatação visual avançada.

### 📝 Exemplos de Uso

#### **Título Colorido**
```csv
tipo,titulo,descricao
Desenvolvimento,"Nova funcionalidade","<span style=\"color: #8e44ad; font-weight: bold;\">Implementação necessário:</span>
- Criar formulário de cadastro
- Implementar validações
- Adicionar testes unitários"
```

#### **Lista Formatada**
```csv
tipo,titulo,descricao
Teste,"Teste de funcionalidade","<h3 style=\"color: #2c3e50;\">Cenários de Teste:</h3>
<ul style=\"margin-left: 20px;\">
<li>Login com credenciais válidas</li>
<li>Login com credenciais inválidas</li>
<li>Recuperação de senha</li>
</ul>"
```

#### **Seções Destacadas**
```csv
tipo,titulo,descricao
Documentação,"Atualizar docs","<div style=\"background-color: #f8f9fa; padding: 10px; border-left: 4px solid #007bff;\">
<strong>Objetivo:</strong> Atualizar documentação da API
</div>
<br>
<strong>Arquivos a atualizar:</strong>
- README.md
- API.md
- CHANGELOG.md"
```

### 🛡️ Segurança

O sistema **sanitiza automaticamente** o HTML para segurança:

- ✅ **Tags permitidas**: `span`, `div`, `p`, `strong`, `b`, `em`, `i`, `u`, `br`, `ul`, `ol`, `li`, `h1-h6`
- ✅ **Estilos permitidos**: `color`, `background-color`, `font-family`, `font-size`, `font-weight`, `text-align`, `margin`, `padding`, `border`, `border-radius`, `display`, `line-height`
- ❌ **Tags bloqueadas**: `script`, `iframe`, `object`, `embed`, `form`, `input`, etc.
- ❌ **Estilos bloqueados**: `javascript:`, `expression()`, `url()`, etc.

### 🎯 Dicas de Formatação

#### **Cores Recomendadas**
- **Roxo**: `#8e44ad` (padrão do sistema)
- **Azul**: `#007bff` (destaque)
- **Verde**: `#28a745` (sucesso)
- **Vermelho**: `#dc3545` (erro)
- **Laranja**: `#fd7e14` (aviso)

#### **Estruturas Comuns**
```html
<!-- Título destacado -->
<span style="color: #8e44ad; font-weight: bold;">Título:</span>

<!-- Seção com borda -->
<div style="border-left: 4px solid #007bff; padding-left: 10px;">
Conteúdo da seção
</div>

<!-- Lista formatada -->
<ul style="margin-left: 20px;">
<li>Item 1</li>
<li>Item 2</li>
</ul>
```

### ⚠️ Importante

- **Escape de aspas**: Use `\"` dentro de strings CSV
- **Codificação**: Sempre use UTF-8 com BOM
- **Delimitador**: Ponto-e-vírgula (`;`) é recomendado
- **Validação**: O sistema valida e limpa HTML automaticamente

## 📄 Exemplo Completo de CSV com Formatação HTML

```csv
tipo;titulo;descricao;esforco_estimado;funcionalidade;sub_funcionalidade
Desenvolvimento;"Implementar sistema de login";"<span style=\"color: #8e44ad; font-weight: bold;\">Implementação necessário:</span><br><br><strong>Funcionalidades:</strong><ul style=\"margin-left: 20px;\"><li>Criar formulário de login</li><li>Implementar autenticação JWT</li><li>Adicionar validações de segurança</li><li>Criar testes unitários</li></ul><br><div style=\"background-color: #f8f9fa; padding: 10px; border-left: 4px solid #007bff;\"><strong>Observações:</strong> Seguir padrões de segurança OWASP</div>";8;Login;Autenticação
Teste;"Teste de integração";"<h3 style=\"color: #2c3e50;\">Cenários de Teste:</h3><br><ul style=\"margin-left: 20px;\"><li>Login com credenciais válidas</li><li>Login com credenciais inválidas</li><li>Recuperação de senha</li><li>Logout automático</li></ul><br><span style=\"color: #28a745; font-weight: bold;\">Critérios de Aceitação:</span><br>- Todos os cenários devem passar<br>- Cobertura mínima de 90%";4;Login;Testes
Documentação;"Atualizar documentação";"<div style=\"background-color: #fff3cd; padding: 10px; border: 1px solid #ffeaa7;\"><strong>Objetivo:</strong> Atualizar documentação da API</div><br><strong>Arquivos a atualizar:</strong><ul><li>README.md</li><li>API.md</li><li>CHANGELOG.md</li></ul><br><span style=\"color: #fd7e14;\">Prioridade:</span> Alta";2;Documentação;API
```

### 🎯 Resultado Esperado

As atividades criadas terão formatação visual rica com:
- **Títulos coloridos** em roxo
- **Listas formatadas** com indentação
- **Seções destacadas** com bordas e cores
- **Hierarquia visual** clara com diferentes tamanhos de texto
- **Cores semânticas** para diferentes tipos de informação

---

💡 **Dúvidas?** O sistema mostra erros detalhados durante a validação, indicando exatamente quais campos estão faltando ou incorretos!

# ActivityImportCard - Importação de Atividades

## 📋 Visão Geral

O `ActivityImportCard` é um componente React avançado para importação de atividades via arquivo CSV para o sistema Artia. Oferece uma interface completa com validação, preview, histórico e **persistência de sessão**.

## ✨ Funcionalidades Principais

### 🔄 **Persistência de Sessão (NOVO!)**

- **Recuperação automática**: Após refresh da página, o progresso é mantido
- **Notificação visual**: Banner azul informa sobre sessão recuperada
- **Continuidade**: Possibilidade de continuar exatamente de onde parou
- **Expiração**: Sessões expiram após 24 horas automaticamente
- **Controle manual**: Botão para iniciar nova importação quando necessário

### 📁 Download de Template

- **Seleção de tipos**: Escolha quais tipos de atividade incluir
- **Template personalizado**: CSV gerado com apenas os campos necessários
- **Guia completo**: Painel informativo com instruções detalhadas
- **Conversão de datas**: Suporte automático para formato brasileiro (DD/MM/YYYY)
- **Template de atualização**: CSV para atualizar atividades já importadas
- **Formato otimizado**: Ponto-e-vírgula como delimitador e UTF-8 com BOM
- **Campos obrigatórios**: Template de atualização exige id, title e accountId conforme API

### 📤 Upload e Validação

- **Drag & Drop**: Interface intuitiva para seleção de arquivos
- **Validação robusta**: Verificação de formato, estrutura e dados
- **Conversão automática**: Datas brasileiras convertidas para ISO automaticamente
- **Feedback detalhado**: Erros específicos com linha e descrição

### 👀 Preview Inteligente

- **Visualização completa**: Tabela com todas as atividades a serem importadas
- **Indicadores visuais**: Status de validação por linha
- **Estatísticas**: Contadores de sucessos, erros e warnings
- **Recomendações**: Sugestões automáticas para correção

### 🚀 Importação

- **Processo controlado**: Importação com feedback em tempo real
- **Barra de progresso**: Acompanhamento visual do processo
- **Relatório automático**: Download do relatório de importação
- **Tratamento de erros**: Captura e exibição de erros específicos

### 📊 Histórico Completo

- **Tabela profissional**: Histórico de todas as importações
- **Todos os erros**: Parse, validação e importação salvos
- **Remoção individual**: Botão para remover itens específicos
- **Persistência**: Histórico mantido no localStorage

## 🔧 Estados da Importação

### Fluxo Principal

1. **IDLE** - Estado inicial, aguardando arquivo
2. **FILE_SELECTED** - Arquivo selecionado, pronto para processar
3. **PARSING** - Fazendo parse do CSV
4. **VALIDATING** - Validando dados
5. **PREVIEW** - Exibindo preview para confirmação
6. **IMPORTING** - Executando importação
7. **COMPLETED** - Importação finalizada com sucesso
8. **ERROR** - Erro em qualquer etapa

### 🔄 Persistência de Estados

- **Sessão salva**: Estados PREVIEW, VALIDATING, PARSING são persistidos
- **Recuperação**: Ao recarregar, usuário continua do estado salvo
- **Expiração**: 24 horas após última atividade
- **Limpeza**: Sessão limpa automaticamente após importação completa

## 💾 Armazenamento Local

### Chaves localStorage

- `kqa_import_history`: Histórico de importações (máx. 10 itens)
- `kqa_import_session`: Sessão ativa atual
- `activityImportExpanded`: Estado de expansão do card

### Estrutura da Sessão

```javascript
{
  id: timestamp,
  timestamp: ISO_string,
  currentState: string,
  importName: string,
  importMode: string,
  parsedData: array,
  validatedData: array,
  parseErrors: array,
  validationErrors: array,
  processResults: object,
  fileName: string
}
```

## 🎯 Como Testar a Persistência

### Cenário 1: Recuperação após Preview

1. Faça upload de um arquivo CSV válido
2. Aguarde o processamento até chegar no preview
3. Recarregue a página (F5)
4. ✅ Banner azul deve aparecer
5. ✅ Preview deve estar disponível
6. ✅ Pode continuar para importação

### Cenário 2: Recuperação com Erros

1. Faça upload de um arquivo com erros
2. Aguarde o processamento
3. Recarregue a página
4. ✅ Banner azul deve aparecer
5. ✅ Erros devem estar visíveis
6. ✅ Pode corrigir e tentar novamente

### Cenário 3: Nova Importação

1. Com uma sessão ativa
2. Clique no botão 🗑️ no banner azul
3. ✅ Sessão deve ser limpa
4. ✅ Card volta ao estado inicial
5. ✅ Pode iniciar nova importação

## 🔒 Segurança e Performance

### Validações

- **Tipo de arquivo**: Apenas .csv aceito
- **Tamanho**: Limite de 10MB
- **Estrutura**: Validação de headers obrigatórios
- **Dados**: Validação de campos por tipo de atividade

### Performance

- **Processamento assíncrono**: Não bloqueia interface
- **Chunks de dados**: Processamento em lotes
- **Debounce**: Evita múltiplas operações simultâneas
- **Cleanup**: Limpeza automática de sessões antigas

### Segurança

- **Sanitização**: Limpeza de dados de entrada
- **Validação**: Múltiplas camadas de verificação
- **Escape**: Prevenção de XSS em dados CSV
- **Timeout**: Expiração automática de sessões

## 🔄 Fluxo de Dados

```
Arquivo CSV → Parse → Validação → Preview → Importação
     ↓           ↓         ↓         ↓         ↓
  Sessão    Sessão    Sessão    Sessão   Limpeza
   Salva     Salva     Salva     Salva   Sessão
```

## 📱 Responsividade

- **Desktop**: Interface completa com todas as funcionalidades
- **Tablet**: Layout adaptado, tabelas responsivas
- **Mobile**: Interface simplificada, navegação otimizada
