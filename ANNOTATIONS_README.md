# 📝 Funcionalidade de Anotações - KQA

## Visão Geral

A nova seção de **Anotações** foi implementada no KQA, permitindo que os usuários criem, editem, organizem e personalizem anotações interativas em uma área de trabalho virtual. Esta funcionalidade combina drag-and-drop, redimensionamento e edição de texto rica para criar uma experiência similar aos aplicativos de notas modernas.

## 🚀 Funcionalidades Implementadas

### ✨ **Criação de Anotações**

- **Botão "+"**: Cria uma nova anotação com um clique
- **Posicionamento inteligente**: Novas anotações são posicionadas automaticamente para evitar sobreposição
- **Tamanho padrão**: 300x200px com cores pré-definidas

### 🎨 **Personalização Visual**

- **8 cores de fundo**: Amarelo, Rosa, Azul, Verde, Roxo, Laranja, Cinza, Branco
- **8 cores de texto**: Preto, Cinza, Azul, Verde, Vermelho, Roxo, Laranja, Rosa
- **Seletor de cores**: Interface intuitiva para mudança rápida de cores

### ✏️ **Editor de Texto Rico**

- **Formatação básica**: Negrito, Itálico, Sublinhado, Riscado
- **Listas**: Lista com marcadores, Lista numerada
- **Lista de tarefas**: Checkboxes interativos para acompanhar tarefas
- **Citações**: Suporte a blockquotes estilizados
- **Imagens**: Upload e inserção de imagens (base64)

### 🖱️ **Interação Avançada**

- **Drag-and-Drop**: Arrastar anotações livremente pela área de trabalho
- **Redimensionamento**: Redimensionar horizontal e verticalmente
- **Área limitada**: Movimentação restrita à área de trabalho
- **Handles visuais**: Indicações visuais para arrastar e redimensionar

### 💾 **Persistência e Segurança**

- **Criptografia**: Dados salvos com criptografia AES no localStorage
- **Auto-save**: Salvamento automático a cada modificação
- **Timestamp**: Registro da última modificação
- **Recuperação**: Dados persistem entre sessões

### 🗑️ **Gestão de Conteúdo**

- **Exclusão individual**: Botão de lixeira em cada anotação
- **Confirmação**: Modal de confirmação antes da exclusão definitiva
- **Limpeza geral**: Botão para limpar todas as anotações
- **Estados vazios**: Interface elegante quando não há anotações

## 🛠️ **Tecnologias Utilizadas**

### **Bibliotecas Principais**

- **react-rnd**: Drag-and-drop + redimensionamento
- **@tiptap/react**: Editor de texto rico
- **crypto-js**: Criptografia dos dados

### **Extensões do Tiptap**

- **StarterKit**: Funcionalidades básicas de texto
- **TextStyle**: Suporte a estilos de texto
- **Color**: Cores de texto personalizadas
- **Highlight**: Realce de texto
- **TaskList/TaskItem**: Listas de tarefas
- **Image**: Suporte a imagens

## 📁 **Estrutura de Arquivos**

```
src/
├── components/
│   └── Annotations/
│       ├── AnnotationsCard.jsx    # Componente principal
│       └── MiniCard.jsx           # Componente individual de anotação
├── hooks/
│   └── useAnnotations.js          # Hook para gerenciamento de estado
└── styles/
    └── annotations.css            # Estilos específicos
```

## 🎯 **Como Usar**

### **Criar Nova Anotação**

1. Clique no botão "Nova" no cabeçalho da seção
2. Uma nova anotação aparecerá na área de trabalho
3. Clique no conteúdo para começar a editar

### **Editar Conteúdo**

1. Clique na área de texto da anotação
2. Use a toolbar que aparece para formatação
3. Digite o conteúdo desejado

### **Personalizar Cores**

1. Passe o mouse sobre a anotação
2. Clique no ícone de paleta (🎨)
3. Selecione a cor de fundo e/ou texto desejada

### **Mover e Redimensionar**

1. **Mover**: Clique e arraste pela barra superior com o ícone de grip
2. **Redimensionar**: Arraste pelas bordas ou cantos da anotação

### **Inserir Imagem**

1. Clique no ícone de imagem (📷) na toolbar
2. Selecione uma imagem do seu dispositivo
3. A imagem será inserida na posição do cursor

### **Excluir Anotação**

1. Passe o mouse sobre a anotação
2. Clique no ícone de lixeira (🗑️)
3. Confirme a exclusão no modal que aparece

## 🔧 **Configurações Técnicas**

### **Dados da Anotação**

```javascript
{
  id: number,
  x: number,                    // Posição horizontal
  y: number,                    // Posição vertical
  width: number,                // Largura
  height: number,               // Altura
  content: string,              // Conteúdo HTML
  backgroundColor: string,      // Cor de fundo
  textColor: string,           // Cor do texto
  lastModified: string         // Timestamp ISO
}
```

### **Configurações de Segurança**

- **Chave de criptografia**: Hardcoded para simplicidade (pode ser melhorada)
- **Algoritmo**: AES com crypto-js
- **Armazenamento**: localStorage (pode ser migrado para backend)

## 📱 **Responsividade**

A funcionalidade é totalmente responsiva:

### **Desktop (>768px)**

- Toolbar completa visível
- Área de trabalho ampla (500px de altura)
- Grid de cores 4x2

### **Tablet (768px)**

- Toolbar compacta
- Área de trabalho média (400px de altura)
- Grid de cores 3x3

### **Mobile (<480px)**

- Toolbar minimal
- Área de trabalho reduzida (350px de altura)
- Modal de exclusão em tela cheia

## 🎨 **Design System**

### **Cores de Fundo Padrão**

- **Amarelo**: `#fef9e7` (padrão)
- **Rosa**: `#fef2f2`
- **Azul**: `#eff6ff`
- **Verde**: `#f0fdf4`
- **Roxo**: `#f5f3ff`
- **Laranja**: `#fff7ed`
- **Cinza**: `#f9fafb`
- **Branco**: `#ffffff`

### **Cores de Texto Padrão**

- **Preto**: `#374151` (padrão)
- **Cinza**: `#6b7280`
- **Azul**: `#2563eb`
- **Verde**: `#059669`
- **Vermelho**: `#dc2626`
- **Roxo**: `#7c3aed`
- **Laranja**: `#ea580c`
- **Rosa**: `#db2777`

## 🔄 **Melhorias Futuras**

### **Funcionalidades Planejadas**

- [ ] **Busca**: Buscar por conteúdo das anotações
- [ ] **Tags**: Sistema de tags para categorização
- [ ] **Layers**: Sistema de camadas para organização
- [ ] **Exportação**: Exportar anotações como PDF/PNG
- [ ] **Colaboração**: Compartilhamento em tempo real
- [ ] **Templates**: Modelos pré-definidos de anotações
- [ ] **Backup na nuvem**: Sincronização com backend

### **Melhorias Técnicas**

- [ ] **Performance**: Virtualização para muitas anotações
- [ ] **Offline**: Funcionamento completo offline
- [ ] **Undo/Redo**: Histórico de modificações
- [ ] **Shortcuts**: Atalhos de teclado
- [ ] **Acessibilidade**: Melhor suporte para screen readers

## 🐛 **Problemas Conhecidos**

1. **Upload de imagem**: Imagens grandes podem impactar performance
2. **Mobile**: Experiência de edição pode ser limitada em telas muito pequenas
3. **Concorrência**: Sem proteção contra modificações simultâneas

## 📄 **Licença e Contribuição**

Esta funcionalidade segue o mesmo padrão de licenciamento do projeto KQA. Contribuições são bem-vindas através de pull requests.

---

**Desenvolvido com ❤️ para melhorar a experiência do usuário no KQA**

## Persistência de Dados

✅ **SIM, os minicards são completamente persistidos!**

Os dados das anotações são automaticamente salvos e carregados usando:

### Tecnologia de Persistência

- **LocalStorage**: Armazenamento local no navegador
- **Criptografia AES**: Dados são criptografados para segurança
- **Auto-save**: Salvamento automático a cada mudança
- **Recuperação**: Dados são restaurados quando você reabrir a aplicação

### O que é Persistido

- Posição (x, y) de cada minicard
- Tamanho (largura e altura)
- Conteúdo do texto rich text
- Cores de fundo e texto
- Timestamp da última modificação
- Imagens inseridas (convertidas em base64)

### Como Funciona

1. **Salvamento Automático**: Toda alteração é imediatamente salva
2. **Criptografia**: Os dados são criptografados antes de serem salvos
3. **Carregamento**: Ao abrir a aplicação, os dados são descriptografados e restaurados
4. **Backup Local**: Os dados ficam salvos no navegador até serem explicitamente deletados

### Localização dos Dados

- Os dados ficam salvos em: `localStorage['kqa-annotations']`
- Formato: Dados criptografados usando chave `kqa-annotations-key`

---

## Correções Implementadas

### 🎨 Color Picker Corrigido

- **Problema**: O seletor de cores não estava funcionando
- **Solução**:
  - Melhorado event handling dos botões de cor
  - Corrigido o timing de fechamento do color picker
  - Adicionado delay para permitir seleção adequada
  - Melhorados os estilos visuais dos botões de cor

### 🔧 Melhorias Técnicas

- Otimizada função `handleColorChange`
- Corrigido timing do `onMouseLeave`
- Melhorados estilos CSS dos botões de cor
- Adicionado feedback visual melhor na seleção

---
