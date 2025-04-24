import { useState, useEffect } from 'react';
import { fakerPT_BR as faker } from '@faker-js/faker';

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

    const generatePerson = () => ({
        nome: `${faker.person.firstName()} ${faker.person.lastName()}`,
        email: faker.internet.email(),
        telefone: faker.helpers.fromRegExp('\\([0-9]{2}\\) [0-9]{5}-[0-9]{4}'),
        endereco: {
            rua: faker.location.street(),
            numero: faker.string.numeric(4),
            complemento: faker.helpers.arrayElement(['', 'Apto', 'Casa', 'Sala']) + ' ' + faker.string.numeric(3),
            bairro: faker.location.county(),
            cidade: faker.location.city(),
            estado: faker.location.state({ abbreviated: true }),
            cep: faker.location.zipCode('#####-###')
        }
    });

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