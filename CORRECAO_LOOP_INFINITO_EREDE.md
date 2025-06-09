# Correção do Loop Infinito - Cartões Erede

## Problema Identificado

Foi detectado um loop infinito na geração de nomes para cartões Erede, causando o seguinte erro:

```
Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render.
```

## Causa Raiz

O problema estava ocorrendo porque:

1. **Geração de Nome a Cada Render**: A função `gerarNomeCartao()` estava sendo chamada dentro de `getEredeTestCardByOption()` a cada execução
2. **Objeto Sempre Diferente**: Como `faker.person.fullName()` gera um nome diferente a cada chamada, o objeto retornado era sempre diferente
3. **Re-renders Contínuos**: O `useEffect` no hook `useCreditCard` detectava mudanças constantes e executava novamente, criando um loop infinito

## Soluções Implementadas

### 1. **Separação da Geração de Nome** (`src/generators/eredeTestCards.js`)

**Antes:**

```javascript
export const getEredeTestCardByOption = option => {
  const card = eredeTestCards.find(card => card.option === option);
  if (card) {
    return {
      ...card,
      nome: gerarNomeCartao(), // ← Nome gerado a cada chamada
    };
  }
  return {
    ...eredeTestCards[0],
    nome: gerarNomeCartao(), // ← Nome gerado a cada chamada
  };
};
```

**Depois:**

```javascript
// Função exportada separadamente
export const gerarNomeCartaoErede = () => {
  return faker.person.fullName().toUpperCase();
};

// Função que retorna apenas os dados do cartão
export const getEredeTestCardByOption = option => {
  const card = eredeTestCards.find(card => card.option === option);
  if (card) {
    return { ...card }; // ← Sem nome, objeto estável
  }
  return { ...eredeTestCards[0] }; // ← Sem nome, objeto estável
};
```

### 2. **Geração de Nome no Local Correto** (`src/generators/creditCard.js`)

**Implementação:**

```javascript
import {
  getEredeTestCardByOption,
  gerarNomeCartaoErede,
} from './eredeTestCards';

export const gerarCartaoErede = (eredeStatus = 'Mastercard Crédito') => {
  const eredeCard = getEredeTestCardByOption(eredeStatus);

  return {
    numero: eredeCard.numero,
    numeroFormatado: formatarNumeroCartao(eredeCard.numero, 'erede'),
    nome: gerarNomeCartaoErede(), // ← Nome gerado apenas uma vez por chamada
    validade: eredeCard.validade,
    cvv: eredeCard.cvv,
    bandeira: 'EREDE',
    tipo: `${eredeCard.bandeira} ${eredeCard.tipo}`,
    isErede: true,
  };
};
```

### 3. **Otimização do Hook** (`src/hooks/useCreditCard.js`)

**Melhorias implementadas:**

1. **useMemo para Estabilizar Arrays:**

```javascript
const eredeStatuses = useMemo(() => {
  return getEredeTestCardStatuses ? getEredeTestCardStatuses() : [];
}, [getEredeTestCardStatuses]);
```

2. **useState com Lazy Initialization:**

```javascript
const [card, setCard] = useState(() => generateCreditCard('visa', 'credito'));
```

3. **Gestão de Estado Otimizada:**

```javascript
const handleCardConfigChange = useCallback(
  e => {
    const { name, value } = e.target;

    setCardConfig(prev => {
      const newConfig = { ...prev, [name]: value };

      // Gera novo cartão apenas quando necessário
      if (name === 'bandeira') {
        if (value.toLowerCase() === 'erede') {
          newConfig.eredeStatus = 'Mastercard Crédito';
          const newCard = generateCreditCard(value, '', 'Mastercard Crédito');
          setCard(newCard);
        } else {
          const newCard = generateCreditCard(value, newConfig.tipo);
          setCard(newCard);
        }
      } else if (
        name === 'eredeStatus' &&
        newConfig.bandeira.toLowerCase() === 'erede'
      ) {
        const newCard = generateCreditCard(newConfig.bandeira, '', value);
        setCard(newCard);
      } else if (
        name === 'tipo' &&
        newConfig.bandeira.toLowerCase() !== 'erede'
      ) {
        const newCard = generateCreditCard(newConfig.bandeira, value);
        setCard(newCard);
      }

      return newConfig;
    });
  },
  [generateCreditCard]
);
```

4. **useEffect Simplificado:**

```javascript
useEffect(() => {
  if (cardConfig.bandeira.toLowerCase() === 'erede') {
    const newCard = generateCreditCard(
      cardConfig.bandeira,
      '',
      cardConfig.eredeStatus
    );
    setCard(newCard);
  }
}, [cardConfig.bandeira, cardConfig.eredeStatus, generateCreditCard]);
```

## Benefícios das Correções

### ✅ **Performance**

- Eliminação do loop infinito
- Menos re-renders desnecessários
- Melhor responsividade da interface

### ✅ **Estabilidade**

- Objetos estáveis que não mudam a cada render
- Estado gerenciado de forma controlada
- Dependências corretas nos hooks

### ✅ **Manutenibilidade**

- Separação clara de responsabilidades
- Funções reutilizáveis
- Código mais fácil de debugar

### ✅ **Funcionalidade Preservada**

- Comportamento visual mantido
- Geração de nomes em maiúsculas funcionando
- Todas as 22 opções de cartão disponíveis

## Testes Realizados

### ✅ **Verificações de Loop**

1. **Console Clean**: Não há mais warnings de loop infinito
2. **Performance**: Interface responsiva sem travamentos
3. **Memory**: Sem vazamentos de memória evidentes

### ✅ **Funcionalidades**

1. **Seleção de Erede**: Funciona corretamente
2. **Mudança de Opções**: Atualização imediata dos dados
3. **Geração de Nomes**: Sempre em maiúsculas
4. **Compatibilidade**: Outras bandeiras não afetadas

### ✅ **Build e Lint**

1. **Compilação**: Sem erros de build
2. **Lint**: Apenas warnings não relacionados
3. **Tipo Safety**: Estruturas de dados consistentes

## Monitoramento Contínuo

Para evitar problemas similares no futuro:

1. **Performance Tools**: Usar React DevTools para monitorar re-renders
2. **Console Monitoring**: Observar warnings de dependências
3. **Testing**: Implementar testes automatizados para hooks
4. **Code Review**: Revisar hooks que usam `useEffect` com cuidado

---

**Status**: ✅ **RESOLVIDO**  
**Data**: $(date +"%d/%m/%Y")  
**Responsável**: KQA Team  
**Validação**: Loop infinito eliminado, funcionalidade preservada
