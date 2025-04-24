import { useState, useEffect } from 'react';
import { faker } from '@faker-js/faker';

// Configurar locale para pt_BR
faker.setLocale('pt_BR');

// Mover as funções de geração de dados para cá
export const useDataGenerator = () => {
  // Estado para controlar máscaras
  const [useCPFMask, setUseCPFMask] = useState(true);
  const [useCNPJMask, setUseCNPJMask] = useState(true);

  // Funções auxiliares
  const generateRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const calculateCPFDigit = (numbers) => {
    let sum = 0;
    for (let i = 0; i < numbers.length; i++) {
      sum += numbers[i] * (numbers.length + 1 - i);
    }
    const digit = 11 - (sum % 11);
    return digit > 9 ? 0 : digit;
  };

  // Gerador de CPF
  const generateCPF = () => {
    const numbers = [];
    for (let i = 0; i < 9; i++) {
      numbers.push(generateRandomNumber(0, 9));
    }

    const digit1 = calculateCPFDigit(numbers);
    numbers.push(digit1);
    const digit2 = calculateCPFDigit(numbers);
    numbers.push(digit2);

    const cpf = numbers.join('');
    const cpfElement = document.getElementById('cpf');
    if (cpfElement) {
      cpfElement.textContent = useCPFMask ? 
        cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4') : 
        cpf;
    }
  };

  // Gerador de CNPJ
  const generateCNPJ = () => {
    const numbers = [];
    for (let i = 0; i < 12; i++) {
      numbers.push(generateRandomNumber(0, 9));
    }

    // Cálculo dos dígitos verificadores
    let sum = 0;
    let pos = 5;
    for (let i = 0; i < 12; i++) {
      sum += numbers[i] * pos;
      pos = pos === 2 ? 9 : pos - 1;
    }

    let digit = 11 - (sum % 11);
    numbers.push(digit > 9 ? 0 : digit);

    sum = 0;
    pos = 6;
    for (let i = 0; i < 13; i++) {
      sum += numbers[i] * pos;
      pos = pos === 2 ? 9 : pos - 1;
    }

    digit = 11 - (sum % 11);
    numbers.push(digit > 9 ? 0 : digit);

    const cnpj = numbers.join('');
    const cnpjElement = document.getElementById('cnpj');
    if (cnpjElement) {
      cnpjElement.textContent = useCNPJMask ? 
        cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5') : 
        cnpj;
    }
  };

  // Gerador de RG
  const generateRG = () => {
    const numbers = [];
    for (let i = 0; i < 8; i++) {
      numbers.push(generateRandomNumber(0, 9));
    }

    let sum = 0;
    for (let i = 0; i < 8; i++) {
      sum += numbers[i] * (2 + i);
    }

    const digit = 11 - (sum % 11);
    numbers.push(digit === 11 ? 0 : digit);

    const rg = numbers.join('');
    const rgElement = document.getElementById('rg');
    if (rgElement) {
      rgElement.textContent = rg.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4');
    }
  };

  // Lista de DDDs válidos
  const DDDsValidos = [
    11, 12, 13, 14, 15, 16, 17, 18, 19, // São Paulo
    21, 22, 24, 27, 28, // Rio de Janeiro e Espírito Santo
    31, 32, 33, 34, 35, 37, 38, // Minas Gerais
    41, 42, 43, 44, 45, 46, 47, 48, 49, // Paraná e Santa Catarina
    51, 53, 54, 55, // Rio Grande do Sul
    61, 62, 63, 64, 65, 66, 67, 68, 69, // Centro-Oeste
    71, 73, 74, 75, 77, 79, // Bahia e Sergipe
    81, 82, 83, 84, 85, 86, 87, 88, 89, // Nordeste
    91, 92, 93, 94, 95, 96, 97, 98, 99 // Norte
  ];

  // Gerador de Dados Pessoais
  const generatePerson = () => {
    const pessoa = {
      nome: faker.name.findName(),
      email: faker.internet.email().toLowerCase(),
      telefone: `(${DDDsValidos[Math.floor(Math.random() * DDDsValidos.length)]}) ${faker.phone.phoneNumber('####-####')}`,
      celular: `(${DDDsValidos[Math.floor(Math.random() * DDDsValidos.length)]}) ${faker.phone.phoneNumber('#####-####')}`,
      rua: faker.address.streetName(),
      numero: faker.random.number({ min: 1, max: 9999 }),
      bairro: faker.address.county(),
      cidade: faker.address.city(),
      estado: faker.address.stateAbbr(),
      cep: faker.address.zipCode('#####-###')
    };

    const pessoaDados = document.getElementById('pessoa-dados');
    if (pessoaDados) {
      pessoaDados.innerHTML = `
        <div class="campo-item">
          <label>Nome:</label>
          <div class="campo-valor">
            <span class="copyable">${pessoa.nome}</span>
            <i class="fas fa-copy copy-icon" title="Copiar"></i>
            <i class="fas fa-sync-alt regenerate-icon" id="generate-nome" title="Gerar novo"></i>
          </div>
        </div>
        <div class="campo-item">
          <label>Email:</label>
          <div class="campo-valor">
            <span class="copyable">${pessoa.email}</span>
            <i class="fas fa-copy copy-icon" title="Copiar"></i>
            <i class="fas fa-sync-alt regenerate-icon" id="generate-email" title="Gerar novo"></i>
          </div>
        </div>
        <div class="campo-item">
          <label>Telefone:</label>
          <div class="campo-valor">
            <span class="copyable">${pessoa.telefone}</span>
            <i class="fas fa-copy copy-icon" title="Copiar"></i>
            <i class="fas fa-sync-alt regenerate-icon" id="generate-telefone" title="Gerar novo"></i>
          </div>
        </div>
        <div class="campo-item">
          <label>Celular:</label>
          <div class="campo-valor">
            <span class="copyable">${pessoa.celular}</span>
            <i class="fas fa-copy copy-icon" title="Copiar"></i>
            <i class="fas fa-sync-alt regenerate-icon" id="generate-celular" title="Gerar novo"></i>
          </div>
        </div>
        <div class="campo-item">
          <label>Endereço:</label>
          <div class="campo-valor">
            <span class="copyable">${pessoa.rua}, ${pessoa.numero}</span>
            <i class="fas fa-copy copy-icon" title="Copiar"></i>
            <i class="fas fa-sync-alt regenerate-icon" id="generate-endereco" title="Gerar novo"></i>
          </div>
        </div>
        <div class="campo-item">
          <label>Bairro:</label>
          <div class="campo-valor">
            <span class="copyable">${pessoa.bairro}</span>
            <i class="fas fa-copy copy-icon" title="Copiar"></i>
            <i class="fas fa-sync-alt regenerate-icon" id="generate-bairro" title="Gerar novo"></i>
          </div>
        </div>
        <div class="campo-item">
          <label>Cidade/UF:</label>
          <div class="campo-valor">
            <span class="copyable">${pessoa.cidade}/${pessoa.estado}</span>
            <i class="fas fa-copy copy-icon" title="Copiar"></i>
            <i class="fas fa-sync-alt regenerate-icon" id="generate-cidade" title="Gerar novo"></i>
          </div>
        </div>
        <div class="campo-item">
          <label>CEP:</label>
          <div class="campo-valor">
            <span class="copyable">${pessoa.cep}</span>
            <i class="fas fa-copy copy-icon" title="Copiar"></i>
            <i class="fas fa-sync-alt regenerate-icon" id="generate-cep" title="Gerar novo"></i>
          </div>
        </div>
      `;
    }
  };

  // Gerador de Cartão de Crédito
  const generateCard = () => {
    const card = {
      number: faker.finance.creditCardNumber(),
      brand: faker.finance.creditCardIssuer(),
      expiry: faker.date.future().toLocaleDateString('pt-BR', { month: '2-digit', year: '2-digit' }),
      cvv: faker.finance.creditCardCVV()
    };

    const cardData = document.getElementById('credit-card-data');
    if (cardData) {
      cardData.innerHTML = `
        <div class="campo-item">
          <label>Número:</label>
          <div class="campo-valor">
            <span class="copyable">${card.number}</span>
            <i class="fas fa-copy copy-icon" title="Copiar"></i>
            <i class="fas fa-sync-alt regenerate-icon" id="generate-card-number" title="Gerar novo"></i>
          </div>
        </div>
        <div class="campo-item">
          <label>Bandeira:</label>
          <div class="campo-valor">
            <span class="copyable">${card.brand}</span>
            <i class="fas fa-copy copy-icon" title="Copiar"></i>
            <i class="fas fa-sync-alt regenerate-icon" id="generate-card-brand" title="Gerar novo"></i>
          </div>
        </div>
        <div class="campo-item">
          <label>Validade:</label>
          <div class="campo-valor">
            <span class="copyable">${card.expiry}</span>
            <i class="fas fa-copy copy-icon" title="Copiar"></i>
            <i class="fas fa-sync-alt regenerate-icon" id="generate-card-expiry" title="Gerar novo"></i>
          </div>
        </div>
        <div class="campo-item">
          <label>CVV:</label>
          <div class="campo-valor">
            <span class="copyable">${card.cvv}</span>
            <i class="fas fa-copy copy-icon" title="Copiar"></i>
            <i class="fas fa-sync-alt regenerate-icon" id="generate-card-cvv" title="Gerar novo"></i>
          </div>
        </div>
      `;
    }
  };

  // Gerador de Produtos/Cursos
  const generateProduct = () => {
    const categorias = [
      'Desenvolvimento', 'QA', 'DevOps', 'Agile', 
      'Cloud', 'Security', 'Data Science', 'Mobile'
    ];

    const produto = {
      nome: `Curso de ${faker.random.arrayElement(categorias)} ${faker.random.number({ min: 1, max: 3 })}`,
      descricao: faker.lorem.sentence(),
      preco: faker.commerce.price(297, 1997, 2, 'R$ '),
      categoria: faker.random.arrayElement(categorias)
    };

    const produtoDados = document.getElementById('produto-dados');
    if (produtoDados) {
      produtoDados.innerHTML = `
        <div class="campo-item">
          <label>Nome:</label>
          <div class="campo-valor">
            <span class="copyable">${produto.nome}</span>
            <i class="fas fa-copy copy-icon" title="Copiar"></i>
            <i class="fas fa-sync-alt regenerate-icon" id="generate-produto-nome" title="Gerar novo"></i>
          </div>
        </div>
        <div class="campo-item">
          <label>Descrição:</label>
          <div class="campo-valor">
            <span class="copyable">${produto.descricao}</span>
            <i class="fas fa-copy copy-icon" title="Copiar"></i>
            <i class="fas fa-sync-alt regenerate-icon" id="generate-produto-descricao" title="Gerar novo"></i>
          </div>
        </div>
        <div class="campo-item">
          <label>Preço:</label>
          <div class="campo-valor">
            <span class="copyable">${produto.preco}</span>
            <i class="fas fa-copy copy-icon" title="Copiar"></i>
            <i class="fas fa-sync-alt regenerate-icon" id="generate-produto-preco" title="Gerar novo"></i>
          </div>
        </div>
        <div class="campo-item">
          <label>Categoria:</label>
          <div class="campo-valor">
            <span class="copyable">${produto.categoria}</span>
            <i class="fas fa-copy copy-icon" title="Copiar"></i>
            <i class="fas fa-sync-alt regenerate-icon" id="generate-produto-categoria" title="Gerar novo"></i>
          </div>
        </div>
      `;
    }
  };

  // Handlers de eventos
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      showToast('Copiado para a área de transferência!');
    });
  };

  const showToast = (message) => {
    const toast = document.createElement('div');
    toast.className = 'toast show';
    toast.textContent = message;
    document.querySelector('.toast-container').appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 2000);
  };

  // Contador de Caracteres
  const updateCount = () => {
    const text = document.getElementById('character-counter')?.value || '';
    const charCount = document.getElementById('char-count');
    const wordCount = document.getElementById('word-count');

    if (charCount) {
      charCount.textContent = text.length;
    }
    if (wordCount) {
      wordCount.textContent = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    }
  };

  // Gerador de Texto Aleatório
  const words = [
    'teste', 'qualidade', 'software', 'automação', 'desenvolvimento',
    'sistema', 'projeto', 'análise', 'dados', 'processo', 'método',
    'código', 'programa', 'função', 'classe', 'objeto', 'variável',
    'interface', 'módulo', 'componente', 'estrutura', 'padrão'
  ];

  const generateText = (length) => {
    let text = '';
    while (text.length < length) {
      const word = words[Math.floor(Math.random() * words.length)];
      if (text.length + word.length + 1 <= length) {
        text += (text ? ' ' : '') + word;
      } else if (text.length < length) {
        text += 'a'.repeat(length - text.length);
      }
    }
    return text;
  };

  // Event listeners setup
  useEffect(() => {
    // Copiar ao clicar
    document.querySelectorAll('.copy-icon').forEach(icon => {
      icon.addEventListener('click', (e) => {
        const text = e.target.previousElementSibling.textContent;
        handleCopy(text);
      });
    });

    // Toggle de máscaras
    document.getElementById('cpf-mask-toggle')?.addEventListener('click', () => {
      toggleCPFMask();
      generateCPF();
    });

    document.getElementById('cnpj-mask-toggle')?.addEventListener('click', () => {
      toggleCNPJMask();
      generateCNPJ();
    });

    // Limpar campos
    document.getElementById('clear-counter')?.addEventListener('click', () => {
      const counter = document.getElementById('character-counter');
      if (counter) {
        counter.value = '';
        updateCount();
      }
    });

    document.getElementById('clear-generator')?.addEventListener('click', () => {
      const length = document.getElementById('char-length');
      const text = document.getElementById('generated-text');
      if (length && text) {
        length.value = '';
        text.value = '';
        document.getElementById('generate-chars').disabled = true;
      }
    });

    // Contador de caracteres
    const counter = document.getElementById('character-counter');
    counter?.addEventListener('input', updateCount);

    // Gerador de caracteres
    const lengthInput = document.getElementById('char-length');
    const generateButton = document.getElementById('generate-chars');
    const outputText = document.getElementById('generated-text');

    lengthInput?.addEventListener('input', (e) => {
      const value = parseInt(e.target.value);
      if (generateButton) {
        generateButton.disabled = !value || value <= 0;
      }
    });

    generateButton?.addEventListener('click', () => {
      const length = parseInt(lengthInput?.value || '0');
      if (length > 0 && outputText) {
        outputText.value = generateText(length);
      }
    });

    // Event listeners para campos individuais do cartão
    const setupCardField = (fieldId, generateFunction) => {
      const icon = document.getElementById(`generate-card-${fieldId}`);
      if (icon) {
        icon.addEventListener('click', generateFunction);
      }
    };

    setupCardField('number', () => {
      const cardData = document.getElementById('credit-card-data');
      if (cardData) {
        const number = faker.finance.creditCardNumber();
        cardData.querySelector('#card-number').textContent = number;
      }
    });

    setupCardField('brand', () => {
      const cardData = document.getElementById('credit-card-data');
      if (cardData) {
        const brand = faker.finance.creditCardIssuer();
        cardData.querySelector('#card-brand').textContent = brand;
      }
    });

    setupCardField('expiry', () => {
      const cardData = document.getElementById('credit-card-data');
      if (cardData) {
        const expiry = faker.date.future().toLocaleDateString('pt-BR', { month: '2-digit', year: '2-digit' });
        cardData.querySelector('#card-expiry').textContent = expiry;
      }
    });

    setupCardField('cvv', () => {
      const cardData = document.getElementById('credit-card-data');
      if (cardData) {
        const cvv = faker.finance.creditCardCVV();
        cardData.querySelector('#card-cvv').textContent = cvv;
      }
    });

    return () => {
      counter?.removeEventListener('input', updateCount);
      lengthInput?.removeEventListener('input', () => {});
      generateButton?.removeEventListener('click', () => {});
      
      // Cleanup para campos do cartão
      ['number', 'brand', 'expiry', 'cvv'].forEach(field => {
        const icon = document.getElementById(`generate-card-${field}`);
        if (icon) {
          icon.removeEventListener('click', () => {});
        }
      });
    };
  }, []);

  return {
    generateCPF,
    generateCNPJ,
    generateRG,
    generatePerson,
    generateCard,
    generateProduct,
    toggleCPFMask,
    toggleCNPJMask,
    handleCopy,
    showToast,
    updateCount,
    generateText
  };
}; 