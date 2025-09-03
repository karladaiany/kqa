# 🎛️ Modal de Campos Customizados

## 📋 Descrição

Modal para gerenciar campos customizados que serão aplicados em toda a aplicação. Permite adicionar, editar e excluir opções personalizadas para:

- **Tipo de Atividade**: Novos tipos de atividade disponíveis para criação
- **Situação**: Status customizados para atividades
- **Funcionalidade**: Funcionalidades personalizadas
- **Sub-funcionalidade**: Sub-funcionalidades customizadas

## 🎯 Funcionalidades

### ✨ Interface Intuitiva
- **Tabs organizadas** por tipo de campo
- **Contador visual** de campos em cada tab
- **Estados vazios** informativos
- **Responsivo** para mobile e desktop

### 🔧 Gerenciamento de Campos
- **Adicionar** novos campos via input
- **Editar** campos existentes inline
- **Excluir** campos com confirmação
- **Validação** de duplicatas
- **Atalhos de teclado** (Enter para salvar, Esc para cancelar)

### 💾 Persistência
- **localStorage** para armazenamento local
- **Integração** com constantes existentes
- **Compatibilidade** com campos padrão

## 🚀 Como Usar

### Acesso ao Modal
1. Abrir **Configurações** (ícone de engrenagem)
2. Ir para seção **Administrador**
3. Clicar no botão **"Acessar"**
4. Modal de campos customizados será aberto

### Adicionando Campos
1. Selecionar a **tab** desejada
2. Digitar o valor no **campo de entrada**
3. Clicar no botão **"+"** ou pressionar **Enter**
4. Campo será adicionado à lista

### Editando Campos
1. Clicar no **ícone de edição** (lápis)
2. Modificar o valor no **campo de edição**
3. Pressionar **Enter** para salvar ou **Esc** para cancelar
4. Campo será atualizado na lista

### Excluindo Campos
1. Clicar no **ícone de exclusão** (lixeira)
2. Confirmar a exclusão no **dialog**
3. Campo será removido da lista

## 🔗 Integração com a Aplicação

### Hook Personalizado
```javascript
import { useCustomFields } from '../../hooks/useCustomFields';

const { 
  customFields, 
  addCustomField, 
  editCustomField, 
  deleteCustomField 
} = useCustomFields();
```

### Utilitário de Integração
```javascript
import { 
  getCombinedActivityTypes, 
  getCombinedStatusOptions 
} from '../../utils/customFieldsIntegrator';

// Obter opções combinadas (padrão + customizadas)
const activityTypes = getCombinedActivityTypes();
const statusOptions = getCombinedStatusOptions();
```

### Validação de Campos
```javascript
import { validateActivityFields } from '../../utils/customFieldsIntegrator';

const errors = validateActivityFields(activity);
if (errors.length > 0) {
  console.error('Campos inválidos:', errors);
}
```

## 📊 Estrutura de Dados

### Armazenamento
```javascript
// localStorage keys
{
  'custom_activity_types': ['Novo Tipo 1', 'Novo Tipo 2'],
  'custom_status_options': ['Status Customizado'],
  'custom_functionality_options': ['Nova Funcionalidade'],
  'custom_sub_functionality_options': ['Nova Sub-funcionalidade']
}
```

### Estado do Modal
```javascript
{
  activeTab: 'tipo_atividade',
  editingField: { type: 'tipo_atividade', index: 0, value: '...' },
  newFieldValue: '',
  customFields: {
    tipo_atividade: [...],
    situacao: [...],
    funcionalidade: [...],
    sub_funcionalidade: [...]
  }
}
```

## 🎨 Estilos e Temas

### Variáveis CSS Utilizadas
- `--primary-color`: Cor principal dos botões
- `--text-color`: Cor do texto
- `--border-color`: Cor das bordas
- `--card-bg`: Fundo dos cards
- `--hover-bg`: Fundo no hover
- `--warning-color`: Cor de aviso
- `--success-color`: Cor de sucesso
- `--danger-color`: Cor de perigo

### Responsividade
- **Desktop**: Layout horizontal com tabs lado a lado
- **Mobile**: Layout vertical com tabs empilhadas
- **Breakpoint**: 768px

## 🔧 Configuração

### Tipos de Campo
```javascript
const FIELD_TYPES = {
  TIPO_ATIVIDADE: 'tipo_atividade',
  SITUACAO: 'situacao',
  FUNCIONALIDADE: 'funcionalidade',
  SUB_FUNCIONALIDADE: 'sub_funcionalidade',
};
```

### Configuração por Tipo
```javascript
const FIELD_TYPE_CONFIG = {
  [FIELD_TYPES.TIPO_ATIVIDADE]: {
    name: 'Tipo de Atividade',
    icon: '🎯',
    description: 'Tipos de atividade disponíveis para criação',
    storageKey: 'custom_activity_types',
  },
  // ... outros tipos
};
```

## 🧪 Testes

### Cenários de Teste
- ✅ Adicionar campo válido
- ✅ Tentar adicionar campo duplicado
- ✅ Editar campo existente
- ✅ Excluir campo com confirmação
- ✅ Cancelar edição com Esc
- ✅ Navegação entre tabs
- ✅ Responsividade mobile
- ✅ Persistência no localStorage

### Validações
- ✅ Campo não pode estar vazio
- ✅ Campo não pode ser duplicado
- ✅ Confirmação para exclusão
- ✅ Feedback visual de sucesso/erro

## 🔄 Atualizações Futuras

### Funcionalidades Planejadas
- [ ] **Importação/Exportação** de configurações
- [ ] **Backup automático** para cloud
- [ ] **Templates** de campos pré-definidos
- [ ] **Validação avançada** de formatos
- [ ] **Histórico** de alterações
- [ ] **Sincronização** entre dispositivos

### Melhorias de UX
- [ ] **Drag & Drop** para reordenar campos
- [ ] **Busca** em campos existentes
- [ ] **Filtros** por categoria
- [ ] **Atalhos** de teclado adicionais
- [ ] **Animações** mais fluidas

## 🐛 Troubleshooting

### Problemas Comuns

#### Modal não abre
- Verificar se `window.openCustomFieldsModal` está definido
- Confirmar que o modal está sendo renderizado no App.jsx

#### Campos não persistem
- Verificar permissões do localStorage
- Confirmar que não há erros no console
- Verificar se o hook está sendo usado corretamente

#### Integração não funciona
- Confirmar que o utilitário está sendo importado
- Verificar se as constantes existem
- Validar formato dos dados no localStorage

## 📝 Notas Técnicas

### Performance
- **Debounce** automático no hook
- **Memoização** de funções com useCallback
- **Lazy loading** de dados

### Segurança
- **Sanitização** de inputs
- **Validação** de dados
- **Tratamento** de erros

### Acessibilidade
- **ARIA labels** apropriados
- **Navegação** por teclado
- **Contraste** adequado
- **Screen readers** suportados



