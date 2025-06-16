# Integração com Artia

Este módulo implementa a integração da plataforma KQA com a API GraphQL do Artia para criação de atividades de trabalho.

## Funcionalidades

### Tipos de Atividade Suportados

1. **BUG Produção** - Criado a partir do card "Registro de BUG"
2. **BUG Retrabalho** - Criado a partir do card "Registro de BUG"
3. **Deploy** - Criado a partir do card "Deploy"

### Como Usar

1. **No card de Registro de BUG:**

   - Preencha os dados do bug
   - Clique no botão "🚀 Criar atividade" (cor laranja)
   - Selecione entre "Bug produção" ou "Bug retrabalho"

2. **No card de Deploy:**
   - Preencha os dados do deploy
   - Clique no botão "☁️ Criar atividade" (cor laranja)
   - O tipo "Deploy" já vem pré-selecionado

### Campos do Modal

#### Campos Básicos (obrigatórios para todos os tipos):

- **Login**: Seu login do Artia
- **Senha**: Sua senha do Artia
- **Título**: Título da atividade (pré-preenchido baseado nos dados do card)
- **Tipo**: Tipo da atividade

#### Campos Específicos por Tipo:

**BUG Produção:**

- Nº ticket movidesk (número)
- Urgência (Alto/Médio/Baixo/Urgente/Escalação)
- Prioridade (número)
- Plataforma (Desktop/Mobile)
- Funcionalidade (lista dinâmica)
- Sub-funcionalidade (baseada na funcionalidade selecionada)
- Cliente (texto)
- ID organização (número)
- E-mail (email)
- Tipo de cliente (lista de opções)
- Criticidade (Alto/Médio/Baixo)
- Dificuldade de localização (Alto/Médio/Baixo)
- Causa da demanda (lista de opções)
- Garantia (Sim/Não)

**BUG Retrabalho:**

- Prioridade (número)
- Plataforma (Desktop/Mobile)
- Funcionalidade (lista dinâmica)
- Sub-funcionalidade (baseada na funcionalidade selecionada)
- Criticidade (Alto/Médio/Baixo)
- Dificuldade de localização (Alto/Médio/Baixo)
- Causa da demanda (lista de opções)

**Deploy:**

- Nenhum campo adicional necessário

## Estrutura dos Arquivos

```
src/components/ArtiaActivityModal/
├── ArtiaActivityModal.jsx    // Componente principal do modal
├── ArtiaActivityModal.css    // Estilos do modal
├── index.js                  // Export do componente
└── README.md                 // Esta documentação

src/constants/
└── artiaOptions.js           // Constantes com todas as opções dos campos
```

## Implementação Técnica

### Estados do Modal

- `formData`: Dados do formulário
- `showPassword`: Controle de visibilidade da senha
- `loading`: Estado de carregamento durante submissão
- `subFuncionalidadeOptions`: Opções dinâmicas de sub-funcionalidade

### Validações

- Todos os campos marcados como obrigatórios são validados
- Sub-funcionalidade só fica disponível após selecionar a funcionalidade
- Diferentes campos são exibidos baseados no tipo de atividade selecionado

### Integração com GraphQL

A implementação atual inclui uma simulação da chamada à API. A integração real com GraphQL deve substituir a seção comentada no método `handleSubmit`:

```javascript
// Aqui será implementada a chamada GraphQL para o Artia
console.log('Dados para enviar ao Artia:', formData);

// Simulação de sucesso - substitua pela implementação real da API
await new Promise(resolve => setTimeout(resolve, 2000));
```

## Próximos Passos

1. Implementar a chamada GraphQL real para o Artia
2. Adicionar tratamento de erros específicos da API
3. Implementar cache das credenciais do usuário
4. Adicionar validações adicionais conforme necessário

## Dependências

- `@apollo/client`: Cliente GraphQL
- `graphql`: Biblioteca GraphQL
- `react-icons`: Ícones utilizados no modal
- `react-toastify`: Notificações toast
