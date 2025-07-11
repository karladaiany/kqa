# Modal de Criação de Atividades - Artia

Este modal permite criar atividades no Artia através da API GraphQL.

## Como usar

### Método tradicional

1. Acesse a funcionalidade através dos cards no dashboard:
   - **Registro de Bug**: Clique no ícone de bug (🐛)
   - **Deploy**: Clique no ícone de foguete (🚀)
2. Preencha as informações básicas:

   - Login e senha do Artia
   - Título da atividade
   - Tipo (selecionado automaticamente baseado na origem)

3. Insira manualmente:
   - ID do Grupo de Trabalho
   - ID da Pasta/Projeto
   - Demais configurações específicas

### 🆕 Novo Método: Extração Automática via Link

1. **Cole o link do projeto Artia** no campo "Link do projeto Artia"

   - Exemplo: `https://app2.artia.com/a/4874953/f/4885568/kanban?filter_id=7719544`

2. **IDs extraídos automaticamente**:

   - **ID do Grupo**: `4874953` (número após `/a/`)
   - **ID da Pasta**: `4885568` (número após `/f/`)

3. **Validação em tempo real**:

   - ✅ Link válido: Feedback verde e ícone de sucesso
   - ❌ Link inválido: Borda vermelha e mensagem de erro
   - 💡 Link vazio: Campo opcional, sem validação

4. **Persistência automática**: O link é salvo no localStorage para reutilização

### Exemplos de Links Válidos

```
https://app2.artia.com/a/4874953/f/4885568/kanban
https://app.artia.com/a/123456/f/789012/board?view=timeline
https://artia.com/workspace/a/555444/f/333222/tasks
```

### Validações Implementadas

- **Domínio**: Deve conter "artia.com"
- **Estrutura**: Deve ter `/a/[número]` e `/f/[número]`
- **IDs**: Números válidos extraíveis dos padrões
- **Formato**: URL válida

## Estados Visuais

### Campo de Link

- **Normal**: Borda padrão
- **Sucesso**: Borda verde + indicador "IDs extraídos automaticamente"
- **Erro**: Borda vermelha + mensagem de erro específica
- **Ajuda**: Texto explicativo para links válidos

### Feedback de Usuário

- **Extração bem-sucedida**: Animação de confirmação (3 segundos)
- **Link salvo**: Persistido automaticamente no localStorage
- **Campos preenchidos**: Atualização automática dos IDs

## Casos de Uso

### 1. Primeiro Acesso

```
1. Usuário cola link do Artia
2. Sistema extrai IDs automaticamente
3. Campos ID do Grupo e ID da Pasta são preenchidos
4. Link é salvo para próximas sessões
```

### 2. Reutilização

```
1. Usuário abre modal novamente
2. Link anterior é carregado do localStorage
3. IDs são mantidos dos valores salvos
4. Usuário pode alterar link se necessário
```

### 3. Validação de Entrada

```
1. Link inválido: Mensagem de erro clara
2. Link sem IDs: "Não foi possível extrair os IDs"
3. Domínio incorreto: "Link deve ser do domínio artia.com"
4. Formato inválido: "Link inválido"
```

## Implementação Técnica

### Funções Principais

#### `extractIdsFromArtiaLink(link)`

Extrai account_id e folder_id do link usando regex:

- Padrão conta: `/a/(\d+)`
- Padrão pasta: `/f/(\d+)`

#### `validateArtiaLink(link)`

Valida formato e estrutura do link:

- URL válida
- Domínio artia.com
- Presença de padrões `/a/` e `/f/`

### Estados Gerenciados

- `linkValidation`: Status e mensagem de validação
- `linkExtracted`: Flag de sucesso temporário
- `formData.artiaLink`: Valor do link

### Persistência

- Link salvo em `localStorage` junto com outros dados do modal
- Carregamento automático na inicialização
- Exclusão de credenciais do armazenamento (apenas link e configurações)

## Benefícios UX/UI

1. **Redução de Erros**: Eliminação de digitação manual de IDs
2. **Velocidade**: Extração instantânea de múltiplos valores
3. **Feedback Visual**: Estados claros de sucesso/erro
4. **Persistência**: Reutilização automática de links
5. **Flexibilidade**: Campo opcional, não obrigatório
6. **Acessibilidade**: Mensagens claras e indicadores visuais

## Compatibilidade

- ✅ Todos os tipos de atividade (Bug, Deploy)
- ✅ Links com parâmetros adicionais
- ✅ Diferentes subdomínios do Artia
- ✅ Mobile e desktop
- ✅ Navegadores modernos com suporte a `:has()` CSS

---

## Processo de Criação (Original)

- Clique no botão "🚀 Criar atividade" (cor laranja)
- Aguarde o processamento da requisição
- Receba confirmação de sucesso/erro via toast
- Visualize no histórico de atividades criadas

### Para atividade específica:

- Clique no botão "☁️ Criar atividade" (cor laranja)
- Aguarde o processamento da requisição
- Receba confirmação de sucesso/erro via toast
- Visualize no histórico de atividades criadas

### Campos obrigatórios:

- Login e senha do Artia
- Título da atividade
- Tipo da atividade
- ID do Grupo de Trabalho (agora com extração automática)
- ID da Pasta/Projeto (agora com extração automática)
- Situação padrão das atividades

### Campos específicos por tipo:

- **Deploy**: Funcionalidade, Sub-funcionalidade, ID do Responsável
- **Bug**: Campos dinâmicos baseados na configuração

## Estados do Modal

### 1. Autenticação

- Campos de login e senha (senha não salva no localStorage)
- Toggle de visibilidade da senha

### 2. Dados da Atividade

- Campos básicos da atividade
- Seleção de tipo baseada na origem (bug/deploy)
- Geração automática de template do título

### 3. Link do Artia (Nova Funcionalidade)

- Campo opcional para inserção de link
- Extração automática de IDs
- Validação em tempo real

### 4. Campos Específicos

- Renderização dinâmica baseada no tipo de atividade
- Validação contextual

### 5. Histórico

- Lista de atividades criadas recentemente
- Links diretos para atividades no Artia
- Opção de limpar histórico

## Armazenamento Local

O modal salva automaticamente (com debounce de 800ms):

- Dados do formulário (exceto credenciais)
- Link do Artia
- Configurações de campos específicos
- Histórico de atividades criadas

**Não são salvos**: Login e senha por questões de segurança.

This modal permite criar atividades no Artia através da API GraphQL.
