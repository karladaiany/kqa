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
    // Adicione este console.log para debug
    console.log('Elemento produto-dados:', document.getElementById('produto-dados'));

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
        produtoDados: document.getElementById('produto-dados'),
        generateButtons: {
            cpf: document.getElementById('generate-cpf'),
            cnpj: document.getElementById('generate-cnpj'),
            rg: document.getElementById('generate-rg'),
            person: document.getElementById('generate-person'),
            card: document.getElementById('generate-card'),
            product: document.getElementById('generate-product')
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
        const maskToggle = document.getElementById('cpf-mask-toggle');
        elements.cpf.textContent = maskToggle.classList.contains('active') ? maskCPF(cpf) : cpf;
    }

    function updateCNPJ() {
        const cnpj = generateCNPJ();
        const maskToggle = document.getElementById('cnpj-mask-toggle');
        elements.cnpj.textContent = maskToggle.classList.contains('active') ? maskCNPJ(cnpj) : cnpj;
    }

    function updateRG() {
        elements.rg.textContent = generateRG();
    }

    function updatePessoaDados() {
        const pessoa = generatePerson();
        elements.pessoaDados.innerHTML = `
            <div class="dados-item">
                <div class="campo-item">
                    <label class="form-label">Nome</label>
                    <div class="campo-valor">
                        <span class="copyable" id="pessoa-nome">${pessoa.nome}</span>
                        <div class="campo-acoes">
                            <i class="fas fa-copy copy-icon" title="Copiar"></i>
                            <i class="fas fa-sync-alt regenerate-icon" id="generate-nome" title="Gerar novo"></i>
                        </div>
                    </div>
                </div>
                <div class="campo-item">
                    <label class="form-label">Email</label>
                    <div class="campo-valor">
                        <span class="copyable" id="pessoa-email">${pessoa.email}</span>
                        <div class="campo-acoes">
                            <i class="fas fa-copy copy-icon" title="Copiar"></i>
                            <i class="fas fa-sync-alt regenerate-icon" id="generate-email" title="Gerar novo"></i>
                        </div>
                    </div>
                </div>
                <div class="campo-item">
                    <label class="form-label">Telefone</label>
                    <div class="campo-valor">
                        <span class="copyable" id="pessoa-telefone">${pessoa.telefone}</span>
                        <div class="campo-acoes">
                            <i class="fas fa-copy copy-icon" title="Copiar"></i>
                            <i class="fas fa-sync-alt regenerate-icon" id="generate-telefone" title="Gerar novo"></i>
                        </div>
                    </div>
                </div>
                <div class="campo-item">
                    <label class="form-label">Celular</label>
                    <div class="campo-valor">
                        <span class="copyable" id="pessoa-celular">${pessoa.celular}</span>
                        <div class="campo-acoes">
                            <i class="fas fa-copy copy-icon" title="Copiar"></i>
                            <i class="fas fa-sync-alt regenerate-icon" id="generate-celular" title="Gerar novo"></i>
                        </div>
                    </div>
                </div>
                <div class="campo-item">
                    <label class="form-label">Rua</label>
                    <div class="campo-valor">
                        <span class="copyable" id="pessoa-rua">${pessoa.rua}</span>
                        <div class="campo-acoes">
                            <i class="fas fa-copy copy-icon" title="Copiar"></i>
                            <i class="fas fa-sync-alt regenerate-icon" id="generate-rua" title="Gerar novo"></i>
                        </div>
                    </div>
                </div>
                <div class="campo-item">
                    <label class="form-label">Número</label>
                    <div class="campo-valor">
                        <span class="copyable" id="pessoa-numero">${pessoa.numero}</span>
                        <div class="campo-acoes">
                            <i class="fas fa-copy copy-icon" title="Copiar"></i>
                            <i class="fas fa-sync-alt regenerate-icon" id="generate-numero" title="Gerar novo"></i>
                        </div>
                    </div>
                </div>
                <div class="campo-item">
                    <label class="form-label">Bairro</label>
                    <div class="campo-valor">
                        <span class="copyable" id="pessoa-bairro">${pessoa.bairro}</span>
                        <div class="campo-acoes">
                            <i class="fas fa-copy copy-icon" title="Copiar"></i>
                            <i class="fas fa-sync-alt regenerate-icon" id="generate-bairro" title="Gerar novo"></i>
                        </div>
                    </div>
                </div>
                <div class="campo-item">
                    <label class="form-label">Cidade</label>
                    <div class="campo-valor">
                        <span class="copyable" id="pessoa-cidade">${pessoa.cidade}</span>
                        <div class="campo-acoes">
                            <i class="fas fa-copy copy-icon" title="Copiar"></i>
                            <i class="fas fa-sync-alt regenerate-icon" id="generate-cidade" title="Gerar novo"></i>
                        </div>
                    </div>
                </div>
                <div class="campo-item">
                    <label class="form-label">Estado</label>
                    <div class="campo-valor">
                        <span class="copyable" id="pessoa-estado">${pessoa.estado}</span>
                        <div class="campo-acoes">
                            <i class="fas fa-copy copy-icon" title="Copiar"></i>
                            <i class="fas fa-sync-alt regenerate-icon" id="generate-estado" title="Gerar novo"></i>
                        </div>
                    </div>
                </div>
                <div class="campo-item">
                    <label class="form-label">CEP</label>
                    <div class="campo-valor">
                        <span class="copyable" id="pessoa-cep">${pessoa.cep}</span>
                        <div class="campo-acoes">
                            <i class="fas fa-copy copy-icon" title="Copiar"></i>
                            <i class="fas fa-sync-alt regenerate-icon" id="generate-cep" title="Gerar novo"></i>
                        </div>
                    </div>
                </div>
            </div>
            <div class="acoes-grupo">
                <button class="btn btn-primary btn-sm" id="generate-all-person">
                    <i class="fas fa-sync-alt"></i> Gerar Todos
                </button>
            </div>
        `;
    }

    function updateCreditCard() {
        const card = generateCard();
        elements.creditCard.innerHTML = `
            <div class="dados-item">
                <div class="campo-item">
                    <label class="form-label">Número</label>
                    <div class="campo-valor">
                        <span class="copyable" id="card-number">${card.number}</span>
                        <div class="campo-acoes">
                            <i class="fas fa-copy copy-icon" title="Copiar"></i>
                            <i class="fas fa-sync-alt regenerate-icon" id="generate-card-number" title="Gerar novo"></i>
                        </div>
                    </div>
                </div>
                <div class="campo-item">
                    <label class="form-label">Bandeira</label>
                    <div class="campo-valor">
                        <span class="copyable" id="card-brand">${card.brand}</span>
                        <div class="campo-acoes">
                            <i class="fas fa-copy copy-icon" title="Copiar"></i>
                            <i class="fas fa-sync-alt regenerate-icon" id="generate-card-brand" title="Gerar novo"></i>
                        </div>
                    </div>
                </div>
                <div class="campo-item">
                    <label class="form-label">Validade</label>
                    <div class="campo-valor">
                        <span class="copyable" id="card-expiry">${card.expiry}</span>
                        <div class="campo-acoes">
                            <i class="fas fa-copy copy-icon" title="Copiar"></i>
                            <i class="fas fa-sync-alt regenerate-icon" id="generate-card-expiry" title="Gerar novo"></i>
                        </div>
                    </div>
                </div>
                <div class="campo-item">
                    <label class="form-label">CVV</label>
                    <div class="campo-valor">
                        <span class="copyable" id="card-cvv">${card.cvv}</span>
                        <div class="campo-acoes">
                            <i class="fas fa-copy copy-icon" title="Copiar"></i>
                            <i class="fas fa-sync-alt regenerate-icon" id="generate-card-cvv" title="Gerar novo"></i>
                        </div>
                    </div>
                </div>
                <div class="acoes-grupo">
                    <button class="btn btn-primary btn-sm" id="generate-all-card">
                        <i class="fas fa-sync-alt"></i> Gerar Todos
                    </button>
                </div>
            </div>
        `;
    }

    function updateProdutoDados() {
        const produto = generateProduct();
        elements.produtoDados.innerHTML = `
            <div class="dados-item">
                <div class="campo-item">
                    <label class="form-label">Nome do Curso</label>
                    <div class="campo-valor">
                        <span class="copyable" id="produto-nome">${produto.nome}</span>
                        <div class="campo-acoes">
                            <i class="fas fa-copy copy-icon" title="Copiar"></i>
                            <i class="fas fa-sync-alt regenerate-icon" id="generate-produto-nome" title="Gerar novo"></i>
                        </div>
                    </div>
                </div>
                <div class="campo-item">
                    <label class="form-label">Descrição</label>
                    <div class="campo-valor">
                        <span class="copyable" id="produto-descricao">${produto.descricao}</span>
                        <div class="campo-acoes">
                            <i class="fas fa-copy copy-icon" title="Copiar"></i>
                            <i class="fas fa-sync-alt regenerate-icon" id="generate-produto-descricao" title="Gerar novo"></i>
                        </div>
                    </div>
                </div>
                <div class="campo-item">
                    <label class="form-label">Preço</label>
                    <div class="campo-valor">
                        <span class="copyable" id="produto-preco">${produto.preco}</span>
                        <div class="campo-acoes">
                            <i class="fas fa-copy copy-icon" title="Copiar"></i>
                            <i class="fas fa-sync-alt regenerate-icon" id="generate-produto-preco" title="Gerar novo"></i>
                        </div>
                    </div>
                </div>
                <div class="campo-item">
                    <label class="form-label">Categoria</label>
                    <div class="campo-valor">
                        <span class="copyable" id="produto-categoria">${produto.categoria}</span>
                        <div class="campo-acoes">
                            <i class="fas fa-copy copy-icon" title="Copiar"></i>
                            <i class="fas fa-sync-alt regenerate-icon" id="generate-produto-categoria" title="Gerar novo"></i>
                        </div>
                    </div>
                </div>
                <div class="acoes-grupo">
                    <button class="btn btn-primary btn-sm" id="generate-all-product">
                        <i class="fas fa-sync-alt"></i> Gerar Todos
                    </button>
                </div>
            </div>
        `;
    }

    // Gerenciamento de notas
    const notesArea = document.getElementById('notes-area');
    const notesFeedback = document.getElementById('notes-feedback');
    let saveTimeout;

    // Carregar notas salvas
    function loadNotes() {
        const savedNotes = localStorage.getItem('userNotes');
        if (savedNotes) {
            notesArea.value = savedNotes;
        }
    }

    // Salvar notas com debounce
    function saveNotes() {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
            localStorage.setItem('userNotes', notesArea.value);
            showSaveFeedback();
        }, 500);
    }

    // Mostrar feedback de salvamento
    function showSaveFeedback() {
        notesFeedback.classList.add('show');
        setTimeout(() => {
            notesFeedback.classList.remove('show');
        }, 2000);
    }

    // Event listeners para as notas
    if (notesArea) {
        notesArea.addEventListener('input', saveNotes);
        notesArea.addEventListener('blur', saveNotes);
        loadNotes(); // Carregar notas ao iniciar
    }

    // Event Listeners
    elements.generateButtons.cpf.addEventListener('click', updateCPF);
    elements.generateButtons.cnpj.addEventListener('click', updateCNPJ);
    elements.generateButtons.rg.addEventListener('click', updateRG);
    elements.generateButtons.person.addEventListener('click', updatePessoaDados);
    elements.generateButtons.card.addEventListener('click', updateCreditCard);
    elements.generateButtons.product.addEventListener('click', updateProdutoDados);
    elements.theme.addEventListener('click', toggleTheme);

    elements.maskToggles.cpf.addEventListener('change', updateCPF);
    elements.maskToggles.cnpj.addEventListener('change', updateCNPJ);

    // Copiar ao clicar
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('copy-icon')) {
            let textToCopy;
            
            // Verifica se está em um documento-valor (CPF, CNPJ, RG)
            if (e.target.closest('.documento-valor')) {
                textToCopy = e.target.closest('.documento-valor').querySelector('.copyable').textContent;
            }
            // Verifica se está em um campo-valor (outros campos)
            else if (e.target.closest('.campo-valor')) {
                textToCopy = e.target.closest('.campo-valor').querySelector('.copyable').textContent;
            }

            if (textToCopy) {
                copyToClipboard(textToCopy);
                showCopyFeedback(e.target);
            }
        }
    });

    // Adicione esta função para inicializar os toggles
    function initializeCardToggles() {
        document.querySelectorAll('.card-header').forEach(header => {
            header.addEventListener('click', function() {
                const cardBody = this.nextElementSibling;
                const toggleIcon = this.querySelector('.toggle-icon');
                
                // Toggle das classes
                cardBody.classList.toggle('collapsed');
                toggleIcon.style.transform = cardBody.classList.contains('collapsed') ? 'rotate(180deg)' : '';
                
                // Ajustar altura do card body
                if (!cardBody.classList.contains('collapsed')) {
                    cardBody.style.maxHeight = cardBody.scrollHeight + "px";
                } else {
                    cardBody.style.maxHeight = "0";
                }
            });
        });
    }

    // Inicialize os toggles junto com o resto
    initTheme();
    initializeCardToggles();
    updateCPF();
    updateCNPJ();
    updateRG();
    updatePessoaDados();
    updateCreditCard();
    updateProdutoDados();

    // Adicione dentro do DOMContentLoaded, junto com os outros event listeners
    const copyNotesBtn = document.getElementById('copy-notes');
    if (copyNotesBtn) {
        copyNotesBtn.addEventListener('click', function() {
            const notesText = notesArea.value;
            if (notesText) {
                navigator.clipboard.writeText(notesText).then(function() {
                    showToast('Notas copiadas com sucesso!');
                }).catch(function(err) {
                    console.error('Erro ao copiar: ', err);
                    // Fallback para navegadores que não suportam clipboard API
                    const tempTextArea = document.createElement('textarea');
                    tempTextArea.value = notesText;
                    document.body.appendChild(tempTextArea);
                    tempTextArea.select();
                    try {
                        document.execCommand('copy');
                        showToast('Notas copiadas com sucesso!');
                    } catch (err) {
                        console.error('Erro ao copiar: ', err);
                        showToast('Não foi possível copiar as notas');
                    }
                    document.body.removeChild(tempTextArea);
                });
            }
        });
    }

    // Event listeners para os ícones de regeneração
    document.querySelectorAll('.regenerate-icon').forEach(icon => {
        icon.addEventListener('click', function() {
            const id = this.id;
            if (id === 'generate-cpf') updateCPF();
            if (id === 'generate-cnpj') updateCNPJ();
            if (id === 'generate-rg') updateRG();
        });
    });

    // Event listeners para os toggles de máscara
    document.querySelectorAll('.mask-toggle').forEach(toggle => {
        toggle.addEventListener('click', function() {
            this.classList.toggle('active');
            const id = this.id.replace('-mask-toggle', '');
            const element = document.getElementById(id);
            
            if (id === 'cpf') {
                const cpfValue = element.textContent.replace(/\D/g, '');
                element.textContent = this.classList.contains('active') 
                    ? maskCPF(cpfValue) 
                    : cpfValue;
            } else if (id === 'cnpj') {
                const cnpjValue = element.textContent.replace(/\D/g, '');
                element.textContent = this.classList.contains('active') 
                    ? maskCNPJ(cnpjValue) 
                    : cnpjValue;
            }
        });
    });

    // Botões de gerar todos
    document.getElementById('generate-all-person').addEventListener('click', updatePessoaDados);
    document.getElementById('generate-all-card').addEventListener('click', updateCreditCard);
    document.getElementById('generate-all-product').addEventListener('click', updateProdutoDados);

    // Event listeners para as notas
    const clearNotesBtn = document.getElementById('clear-notes');
    if (clearNotesBtn) {
        clearNotesBtn.addEventListener('click', function() {
            notesArea.value = '';
            saveNotes();
        });
    }

    // Função para o botão Voltar ao topo
    const backToTopButton = document.getElementById('back-to-top');

    window.onscroll = function() {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            backToTopButton.style.display = "block";
        } else {
            backToTopButton.style.display = "none";
        }
    };

    backToTopButton.onclick = function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // Adicionar dentro do DOMContentLoaded
    const menuToggle = document.querySelector('.menu-toggle');
    const menuItems = document.querySelector('.menu-items');

    menuToggle.addEventListener('click', () => {
        menuItems.classList.toggle('active');
    });

    // Fechar menu ao clicar fora
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.floating-menu')) {
            menuItems.classList.remove('active');
        }
    });

    // Scroll suave para as seções com offset para o header
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = e.target.closest('a').getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80; // Ajuste este valor conforme necessário
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                menuItems.classList.remove('active');
            }
        });
    });
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

function generatePerson() {
    // Gerar nome completo e remover prefixos
    let fullName = faker.name.findName();
    const prefixos = ['Dr.', 'Sr.', 'Sra.', 'Srta.', 'Mrs.', 'Mr.', 'Ms.', 'Prof.', 'Rev.'];
    prefixos.forEach(prefix => {
        fullName = fullName.replace(prefix, '').trim();
    });

    const nameParts = fullName.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');

    // Função para remover acentos e caracteres especiais
    function normalizeText(text) {
        return text
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-zA-Z0-9]/g, '')
            .toLowerCase();
    }

    // Função para gerar telefone com DDD válido
    function generateValidPhone() {
        const ddd = DDDsValidos[Math.floor(Math.random() * DDDsValidos.length)];
        const numero = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
        return `(${ddd}) ${numero.slice(0,5)}-${numero.slice(5)}`;
    }

    const emailFirstName = normalizeText(firstName);
    const emailLastName = normalizeText(lastName);
    
    const randomCEP = `${Math.floor(Math.random() * 90000) + 10000}-${Math.floor(Math.random() * 900) + 100}`;
    const randomState = faker.address.stateAbbr();
    const streetNumber = Math.floor(Math.random() * 2000) + 1;
    
    const person = {
        nome: `${firstName} ${lastName}`,
        email: `${emailFirstName}.${emailLastName}@teste.com`,
        telefone: generateValidPhone(),
        celular: generateValidPhone(),
        rua: faker.address.streetName(),
        numero: streetNumber,
        bairro: faker.address.county(),
        cidade: faker.address.city(),
        estado: randomState,
        cep: randomCEP
    };
    return person;
}

function generateCard() {
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

function generateProduct() {
    const cursos = [
        'Curso de Automação de Testes',
        'Desenvolvimento Web Full Stack',
        'Análise de Dados com Python',
        'Gestão Ágil de Projetos',
        'DevOps na Prática',
        'Testes de API Rest',
        'Cypress Avançado',
        'Selenium com Java',
        'Quality Assurance Completo',
        'Testes de Performance',
        'Testes Mobile com Appium',
        'Cucumber e BDD',
        'Robot Framework',
        'Postman para Testes de API',
        'Jira para Times Ágeis'
    ];

    const categorias = [
        'Automação de Testes',
        'Desenvolvimento',
        'Quality Assurance',
        'Metodologias Ágeis',
        'DevOps',
        'Testes Manuais',
        'Ferramentas de QA'
    ];

    const product = {
        nome: cursos[Math.floor(Math.random() * cursos.length)],
        descricao: faker.lorem.paragraph(),
        preco: faker.commerce.price(100, 5000, 2, 'R$ '),
        categoria: categorias[Math.floor(Math.random() * categorias.length)]
    };
    return product;
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
    document.body.classList.add('dark-theme');
    document.getElementById('theme-icon').className = 'fas fa-sun';
    localStorage.setItem('darkTheme', 'true');
}

// Funções para gerar campos individuais do cartão
function generateCardField(field) {
    const card = generateCard();
    const element = document.getElementById(`card-${field}`);
    if (element) {
        element.textContent = card[field];
    }
}

// Funções para gerar campos individuais do produto
function generateProductField(field) {
    const produto = generateProduct();
    const element = document.getElementById(`produto-${field}`);
    if (element) {
        element.textContent = produto[field];
    }
}

// Funções para gerar campos individuais da pessoa
function generatePersonField(field) {
    const pessoa = generatePerson();
    const element = document.getElementById(`pessoa-${field}`);
    if (element) {
        element.textContent = pessoa[field];
    }
}

// Event listeners para os ícones de regeneração
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('regenerate-icon')) {
        const id = e.target.id;
        
        // Para dados pessoais
        if (id.startsWith('generate-')) {
            const field = id.replace('generate-', '');
            if (['nome', 'email', 'telefone', 'celular', 'rua', 'numero', 'bairro', 'cidade', 'estado', 'cep'].includes(field)) {
                generatePersonField(field);
            }
        }
        
        // Para cartão de crédito
        if (id.startsWith('generate-card-')) {
            const field = id.replace('generate-card-', '');
            if (['number', 'brand', 'expiry', 'cvv'].includes(field)) {
                generateCardField(field);
            }
        }
        
        // Para produtos/cursos
        if (id.startsWith('generate-produto-')) {
            const field = id.replace('generate-produto-', '');
            if (['nome', 'descricao', 'preco', 'categoria'].includes(field)) {
                generateProductField(field);
            }
        }
    }
});