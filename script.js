// Lista de DDDs válidos - Movida para o escopo global
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

document.addEventListener('DOMContentLoaded', function() {
    // Verificar se o Faker está disponível
    if (typeof faker === 'undefined') {
        console.error('Faker.js não está carregado!');
        return;
    }

    // Elementos do DOM
    const elements = {
        cpf: document.querySelector('#cpf'),
        cnpj: document.querySelector('#cnpj'),
        rg: document.querySelector('#rg'),
        pessoaDados: document.getElementById('pessoa-dados'),
        creditCard: document.getElementById('credit-card-data'),
        generateButtons: {
            cpf: document.getElementById('generate-cpf'),
            cnpj: document.getElementById('generate-cnpj'),
            rg: document.getElementById('generate-rg'),
            person: document.getElementById('generate-person'),
            card: document.getElementById('generate-card')
        },
        maskToggles: {
            cpf: document.getElementById('cpf-mask-toggle'),
            cnpj: document.getElementById('cnpj-mask-toggle')
        },
        theme: document.getElementById('theme-toggle')
    };

    // Funções de formatação
    function formatWithMask(value, useMask, maskFunction) {
        if (useMask) {
            return maskFunction(value);
        }
        return value.replace(/\D/g, '');
    }

    function maskCPF(cpf) {
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }

    function maskCNPJ(cnpj) {
        return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }

    // Funções de atualização
    function updateCPF() {
        const cpf = generateCPF();
        elements.cpf.textContent = formatWithMask(cpf, elements.maskToggles.cpf.checked, maskCPF);
    }

    function updateCNPJ() {
        const cnpj = generateCNPJ();
        elements.cnpj.textContent = formatWithMask(cnpj, elements.maskToggles.cnpj.checked, maskCNPJ);
    }

    function updateRG() {
        elements.rg.textContent = generateRG();
    }

    function updatePessoaDados() {
        const pessoa = generateRandomPerson();
        elements.pessoaDados.innerHTML = `
            <div class="dados-pessoa-item">
                <p><strong>Nome:</strong> <span class="copyable">${pessoa.nome}</span> <i class="fas fa-copy copy-icon"></i></p>
                <p><strong>Email:</strong> <span class="copyable">${pessoa.email}</span> <i class="fas fa-copy copy-icon"></i></p>
                <p><strong>Telefone:</strong> <span class="copyable">${pessoa.telefone}</span> <i class="fas fa-copy copy-icon"></i></p>
                <p><strong>Nascimento:</strong> <span class="copyable">${pessoa.nascimento}</span> <i class="fas fa-copy copy-icon"></i></p>
                <p><strong>Logradouro:</strong> <span class="copyable">${pessoa.endereco.logradouro}</span> <i class="fas fa-copy copy-icon"></i></p>
                <p><strong>Número:</strong> <span class="copyable">${pessoa.endereco.numero}</span> <i class="fas fa-copy copy-icon"></i></p>
                <p><strong>Complemento:</strong> <span class="copyable">${pessoa.endereco.complemento}</span> <i class="fas fa-copy copy-icon"></i></p>
                <p><strong>Bairro:</strong> <span class="copyable">${pessoa.endereco.bairro}</span> <i class="fas fa-copy copy-icon"></i></p>
                <p><strong>Cidade:</strong> <span class="copyable">${pessoa.endereco.cidade}</span> <i class="fas fa-copy copy-icon"></i></p>
                <p><strong>Estado:</strong> <span class="copyable">${pessoa.endereco.estado}</span> <i class="fas fa-copy copy-icon"></i></p>
                <p><strong>País:</strong> <span class="copyable">${pessoa.endereco.pais}</span> <i class="fas fa-copy copy-icon"></i></p>
                <p><strong>CEP:</strong> <span class="copyable">${pessoa.endereco.cep}</span> <i class="fas fa-copy copy-icon"></i></p>
            </div>
        `;
    }

    function updateCreditCard() {
        const card = generateCreditCard();
        elements.creditCard.innerHTML = `
            <div class="card-info">
                <p><strong>Número:</strong> <span class="copyable">${card.number}</span> <i class="fas fa-copy copy-icon"></i></p>
                <p><strong>Bandeira:</strong> <span class="copyable">${card.brand}</span> <i class="fas fa-copy copy-icon"></i></p>
                <p><strong>Validade:</strong> <span class="copyable">${card.expiry}</span> <i class="fas fa-copy copy-icon"></i></p>
                <p><strong>CVV:</strong> <span class="copyable">${card.cvv}</span> <i class="fas fa-copy copy-icon"></i></p>
            </div>
        `;
    }

    // Event Listeners
    elements.generateButtons.cpf.addEventListener('click', updateCPF);
    elements.generateButtons.cnpj.addEventListener('click', updateCNPJ);
    elements.generateButtons.rg.addEventListener('click', updateRG);
    elements.generateButtons.person.addEventListener('click', updatePessoaDados);
    elements.generateButtons.card.addEventListener('click', updateCreditCard);
    elements.theme.addEventListener('click', toggleTheme);

    elements.maskToggles.cpf.addEventListener('change', updateCPF);
    elements.maskToggles.cnpj.addEventListener('change', updateCNPJ);

    // Copiar ao clicar
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('copy-icon')) {
            const textToCopy = e.target.previousElementSibling.textContent;
            copyToClipboard(textToCopy);
            showCopyFeedback(e.target);
        }
    });

    // Inicialização - Gerar todos os dados ao carregar
    initTheme();
    updateCPF();
    updateCNPJ();
    updateRG();
    updatePessoaDados();
    updateCreditCard();
});

// Funções de geração de dados
function generateCPF() {
    const numbers = [];
    for(let i = 0; i < 9; i++) {
        numbers[i] = Math.floor(Math.random() * 10);
    }
    
    let sum = numbers.reduce((acc, cur, idx) => acc + cur * (10 - idx), 0);
    const dv1 = 11 - (sum % 11);
    numbers[9] = dv1 >= 10 ? 0 : dv1;
    
    sum = numbers.reduce((acc, cur, idx) => acc + cur * (11 - idx), 0);
    const dv2 = 11 - (sum % 11);
    numbers[10] = dv2 >= 10 ? 0 : dv2;
    
    return numbers.join('');
}

function generateCNPJ() {
    const numbers = [];
    for(let i = 0; i < 12; i++) {
        numbers[i] = Math.floor(Math.random() * 10);
    }
    
    let multipliers = [5,4,3,2,9,8,7,6,5,4,3,2];
    let sum = numbers.reduce((acc, cur, idx) => acc + cur * multipliers[idx], 0);
    const dv1 = 11 - (sum % 11);
    numbers[12] = dv1 >= 10 ? 0 : dv1;
    
    multipliers = [6,5,4,3,2,9,8,7,6,5,4,3,2];
    sum = numbers.reduce((acc, cur, idx) => acc + cur * multipliers[idx], 0);
    const dv2 = 11 - (sum % 11);
    numbers[13] = dv2 >= 10 ? 0 : dv2;
    
    return numbers.join('');
}

function generateRG() {
    const numbers = [];
    for(let i = 0; i < 8; i++) {
        numbers[i] = Math.floor(Math.random() * 10);
    }
    
    let sum = numbers.reduce((acc, cur, idx) => acc + cur * (9 - idx), 0);
    const dv = sum % 11;
    const lastDigit = dv === 10 ? 'X' : dv.toString();
    
    return numbers.join('') + lastDigit;
}

function generateRandomPerson() {
    const nome = faker.name.findName();
    const emailBase = nome
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z]/g, '.')
        .replace(/\.+/g, '.')
        .replace(/^\.|\.$/g, '');

    const ddd = DDDsValidos[Math.floor(Math.random() * DDDsValidos.length)];
    const telefone = `(${ddd}) ${Math.floor(Math.random() * 90000) + 10000}-${Math.floor(Math.random() * 9000) + 1000}`;

    return {
        nome: nome,
        email: `${emailBase}@teste.com`,
        telefone: telefone,
        nascimento: faker.date.between('1960-01-01', '2000-12-31').toLocaleDateString('pt-BR'),
        endereco: {
            logradouro: faker.address.streetName(),
            numero: faker.random.number({min: 1, max: 9999}),
            complemento: faker.random.arrayElement(['Apto', 'Casa', 'Sala', 'Loja']) + ' ' + faker.random.number({min: 1, max: 999}),
            bairro: faker.address.county(),
            cidade: faker.address.city(),
            estado: faker.address.stateAbbr(),
            pais: 'Brasil',
            cep: faker.address.zipCode('#####-###')
        }
    };
}

function generateCreditCard() {
    const cards = [
        { brand: 'Visa', prefix: '4', length: 16 },
        { brand: 'Mastercard', prefix: '5', length: 16 },
        { brand: 'Amex', prefix: '34', length: 15 }
    ];
    
    const selectedCard = cards[Math.floor(Math.random() * cards.length)];
    let number = selectedCard.prefix;
    
    for(let i = number.length; i < selectedCard.length - 1; i++) {
        number += Math.floor(Math.random() * 10);
    }
    
    let sum = 0;
    let isEven = false;
    
    for(let i = number.length - 1; i >= 0; i--) {
        let digit = parseInt(number[i]);
        if(isEven) {
            digit *= 2;
            if(digit > 9) digit -= 9;
        }
        sum += digit;
        isEven = !isEven;
    }
    
    const checkDigit = ((Math.floor(sum / 10) + 1) * 10 - sum) % 10;
    number += checkDigit;

    const today = new Date();
    const expYear = today.getFullYear() + Math.floor(Math.random() * 5) + 1;
    const expMonth = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    const cvv = String(Math.floor(Math.random() * 900) + 100);
    
    return {
        number: number.replace(/(\d{4})/g, '$1 ').trim(),
        brand: selectedCard.brand,
        expiry: `${expMonth}/${expYear.toString().slice(2)}`,
        cvv: cvv
    };
}

function copyToClipboard(text) {
    if (!navigator.clipboard) {
        fallbackCopyToClipboard(text);
        return;
    }
    navigator.clipboard.writeText(text).then(function() {
        showToast('Texto copiado com sucesso!');
    }, function(err) {
        console.error('Falha ao copiar: ', err);
        fallbackCopyToClipboard(text);
    });
}

function fallbackCopyToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.top = "0";
    textArea.style.left = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        document.execCommand('copy');
        showToast('Texto copiado com sucesso!');
    } catch (err) {
        console.error('Falha ao copiar: ', err);
        showToast('Não foi possível copiar o texto');
    }

    document.body.removeChild(textArea);
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => document.body.removeChild(toast), 2000);
}

function showCopyFeedback(element) {
    element.classList.remove('fa-copy');
    element.classList.add('fa-check');
    setTimeout(() => {
        element.classList.remove('fa-check');
        element.classList.add('fa-copy');
    }, 1000);
}

function toggleTheme() {
    const body = document.body;
    const isDark = body.classList.toggle('dark-theme');
    localStorage.setItem('darkTheme', isDark);
    const themeIcon = document.getElementById('theme-icon');
    themeIcon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
}

function initTheme() {
    const prefersDark = localStorage.getItem('darkTheme') === 'true';
    if (prefersDark) {
        document.body.classList.add('dark-theme');
        document.getElementById('theme-icon').className = 'fas fa-sun';
    }
}