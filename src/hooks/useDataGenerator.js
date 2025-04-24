import { useState, useEffect } from 'react';
import { fakerPT_BR as faker } from '@faker-js/faker';

const removeAcentos = (texto) => {
    return texto
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '.');
};

// DDDs válidos no Brasil por região
const dddsValidos = [
    // Norte
    '68', '96', '92', '97', '91', '93', '94', '69', '95',
    // Nordeste
    '82', '71', '73', '74', '75', '77', '85', '88', '98', '99', '83', '81', '87', '86', '89', '84', '79',
    // Centro-Oeste
    '61', '62', '64', '65', '66', '67',
    // Sudeste
    '27', '28', '31', '32', '33', '34', '35', '37', '38', '21', '22', '24', '11', '12', '13', '14', '15', '16', '17', '18', '19',
    // Sul
    '41', '42', '43', '44', '45', '46', '51', '53', '54', '55', '47', '48', '49'
];

const tiposLogradouro = [
    'Rua', 'Avenida', 'Travessa', 'Alameda', 'Praça', 
    'Estrada', 'Rodovia', 'Viela', 'Beco', 'Largo',
    'Vila', 'Passagem', 'Ladeira'
];

// Faixas de CEP por estado
const faixasCEP = {
    'SP': { inicio: '01000000', fim: '19999999' },
    'RJ': { inicio: '20000000', fim: '28999999' },
    'ES': { inicio: '29000000', fim: '29999999' },
    'MG': { inicio: '30000000', fim: '39999999' },
    'BA': { inicio: '40000000', fim: '48999999' },
    'SE': { inicio: '49000000', fim: '49999999' },
    'PE': { inicio: '50000000', fim: '56999999' },
    'AL': { inicio: '57000000', fim: '57999999' },
    'PB': { inicio: '58000000', fim: '58999999' },
    'RN': { inicio: '59000000', fim: '59999999' },
    'CE': { inicio: '60000000', fim: '63999999' },
    'PI': { inicio: '64000000', fim: '64999999' },
    'MA': { inicio: '65000000', fim: '65999999' },
    'PA': { inicio: '66000000', fim: '68899999' },
    'AP': { inicio: '68900000', fim: '68999999' },
    'AM': { inicio: '69000000', fim: '69299999' },
    'RR': { inicio: '69300000', fim: '69399999' },
    'AC': { inicio: '69900000', fim: '69999999' },
    'DF': { inicio: '70000000', fim: '72799999' },
    'GO': { inicio: '72800000', fim: '76799999' },
    'TO': { inicio: '77000000', fim: '77999999' },
    'MT': { inicio: '78000000', fim: '78899999' },
    'RO': { inicio: '78900000', fim: '78999999' },
    'MS': { inicio: '79000000', fim: '79999999' },
    'PR': { inicio: '80000000', fim: '87999999' },
    'SC': { inicio: '88000000', fim: '89999999' },
    'RS': { inicio: '90000000', fim: '99999999' }
};

const gerarCEPValido = (estado) => {
    const faixa = faixasCEP[estado];
    const inicio = parseInt(faixa.inicio);
    const fim = parseInt(faixa.fim);
    const cep = inicio + Math.floor(Math.random() * (fim - inicio));
    return cep.toString().padStart(8, '0').replace(/(\d{5})(\d{3})/, '$1-$2');
};

export const useDataGenerator = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        try {
            setIsLoading(false);
        } catch (err) {
            setError('Erro ao inicializar o gerador de dados');
            console.error('Erro ao inicializar faker:', err);
        }
    }, []);

    const formatCPF = (cpf) => cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    const formatCNPJ = (cnpj) => cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    const formatRG = (rg) => rg.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4');

    const generateCPF = () => {
        const raw = Array.from({ length: 11 }, () => Math.floor(Math.random() * 10)).join('');
        return {
            raw,
            formatted: formatCPF(raw)
        };
    };

    const generateCNPJ = () => {
        const raw = Array.from({ length: 14 }, () => Math.floor(Math.random() * 10)).join('');
        return {
            raw,
            formatted: formatCNPJ(raw)
        };
    };

    const generateRG = () => {
        const raw = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10)).join('');
        return {
            raw,
            formatted: formatRG(raw)
        };
    };

    const generatePerson = () => {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const nome = `${firstName} ${lastName}`;
        const emailNome = removeAcentos(`${firstName}.${lastName}`);
        const ddd = faker.helpers.arrayElement(dddsValidos);
        const numeroBase = faker.string.numeric(8);
        const telefone = `(${ddd}) 9${numeroBase.slice(0, 4)}-${numeroBase.slice(4)}`;
        const tipoLogradouro = faker.helpers.arrayElement(tiposLogradouro);
        const estado = faker.location.state({ abbreviated: true });
        
        return {
            nome,
            email: `${emailNome}@teste.com`,
            telefone,
            endereco: {
                rua: `${tipoLogradouro} ${faker.location.street()}`,
                numero: faker.string.numeric(4),
                complemento: faker.helpers.arrayElement(['', 'Apto', 'Casa', 'Sala']) + ' ' + faker.string.numeric(3),
                bairro: faker.location.county(),
                cidade: faker.location.city(),
                estado,
                cep: gerarCEPValido(estado)
            }
        };
    };

    const generateCreditCard = () => ({
        numero: faker.finance.creditCardNumber(),
        nome: faker.person.fullName().toUpperCase(),
        validade: faker.date.future().toLocaleDateString('pt-BR', { month: '2-digit', year: '2-digit' }),
        cvv: faker.string.numeric(3),
        bandeira: faker.helpers.arrayElement(['Visa', 'Mastercard', 'American Express'])
    });

    const generateProduct = () => ({
        nome: faker.commerce.productName(),
        descricao: faker.commerce.productDescription(),
        preco: `R$ ${faker.commerce.price()}`,
        categoria: faker.commerce.department(),
        codigo: faker.string.alphanumeric(10).toUpperCase(),
        fabricante: faker.company.name()
    });

    return {
        isLoading,
        error,
        generateCPF,
        generateCNPJ,
        generateRG,
        generatePerson,
        generateCreditCard,
        generateProduct,
        formatCPF,
        formatCNPJ,
        formatRG
    };
}; 