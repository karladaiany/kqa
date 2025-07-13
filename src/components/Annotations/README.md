# Seção Meus Ambientes

## Visão Geral

A seção "Meus Ambientes" foi implementada como uma sub-seção dentro das "Anotações Rápidas", permitindo aos usuários gerenciar seus ambientes de desenvolvimento de forma organizada e intuitiva.

## Funcionalidades

### 📌 Características Principais

- **Integração com Anotações**: Implementada como sub-seção das anotações rápidas
- **Grid Responsivo**: Layout que se adapta a diferentes tamanhos de tela
- **Personalização Completa**: Ícones, cores e tags customizáveis
- **Persistência Local**: Dados salvos no localStorage do navegador
- **Validação de URLs**: Verificação automática de URLs válidas
- **Acessibilidade**: Suporte completo para navegação por teclado e screen readers

### 🎨 Customização

Cada ambiente pode ser personalizado com:

- **Nome**: Até 15 caracteres
- **URL**: Link para o ambiente (validação automática)
- **Ícone**: Seleção de ícones relacionados a tecnologia e aprendizagem
- **Cor do Ícone**: Paleta de 10 cores predefinidas
- **Tag**: Nome da tag personalizada (até 15 caracteres)
- **Cor da Tag**: Paleta de cores independente para tags

### 🔧 Ações Disponíveis

- **Adicionar**: Botão '+' no cabeçalho da seção
- **Visualizar**: Clique no card para abrir o ambiente em nova aba
- **Editar**: Ícone de lápis no hover do card
- **Excluir**: Ícone 'X' no hover com confirmação

## Estrutura dos Componentes

### MyEnvironmentsSection

- Componente principal que gerencia a lista de ambientes
- Controla o estado do modal e das operações CRUD
- Integra com o hook useMyEnvironments

### EnvironmentCard

- Representa cada ambiente individualmente
- Gerencia estados de hover e confirmação de exclusão
- Suporte a navegação por teclado

### EnvironmentModal

- Modal para criação e edição de ambientes
- Validação de formulário em tempo real
- Seletores de cores e ícones interativos

## Hook useMyEnvironments

### Funcionalidades

- `environments`: Lista de ambientes
- `addEnvironment`: Adicionar novo ambiente
- `editEnvironment`: Editar ambiente existente
- `removeEnvironment`: Remover ambiente
- `openEnvironment`: Abrir URL do ambiente
- `validateUrl`: Validar URLs

### Estrutura dos Dados

```javascript
{
  id: string,
  name: string,
  url: string,
  icon: string,
  iconColor: string,
  tagName: string,
  tagColor: string,
  createdAt: string,
  updatedAt?: string
}
```

## Estilos e Temas

### Variáveis CSS Utilizadas

- `--primary`, `--primary-dark`, `--primary-bg`
- `--card-bg`, `--border`, `--hover-bg`
- `--text-primary`, `--text-secondary`
- `--danger`, `--danger-dark`

### Responsividade

- Desktop: Grid com cards de 180px+
- Tablet: Grid com cards de 150px+
- Mobile: Grid com cards de 120px+

## Integração com o Sistema

### Localização

- Integrada na seção "Anotações Rápidas"
- Posicionada após a área de trabalho das anotações
- Utiliza o mesmo padrão visual dos demais componentes

### Acessibilidade

- Suporte completo para navegação por teclado
- Labels ARIA apropriados
- Contraste adequado para ambos os temas
- Mensagens de erro descritivas

## Considerações de Performance

- Lazy loading dos ícones
- Debounce na validação de URLs
- Otimização de re-renders com useCallback
- Armazenamento eficiente no localStorage

## Futuras Melhorias

- Importação/exportação de ambientes
- Categorização de ambientes
- Histórico de acessos
- Sincronização entre dispositivos
- Atalhos de teclado personalizados
