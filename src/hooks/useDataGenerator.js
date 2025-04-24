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

const produtosTecnologia = [
    'Sistema de Automação de Testes',
    'Framework de Desenvolvimento Web',
    'Plataforma de Machine Learning',
    'Software de Análise de Dados',
    'Ferramenta de DevOps',
    'Sistema de Gestão Ágil',
    'Plataforma de Testes A/B',
    'Software de Monitoramento de Performance',
    'IDE Inteligente',
    'Ferramenta de Code Review',
    'Sistema de CI/CD',
    'Plataforma de Design System',
    'Software de Prototipação',
    'Ferramenta de Versionamento',
    'Sistema de Análise de Código',
    'Plataforma de Documentação',
    'Software de Gerenciamento de APIs',
    'Ferramenta de Debug',
    'Sistema de Logging',
    'Plataforma de Cloud Computing'
];

const categoriasTecnologia = [
    'Desenvolvimento de Software',
    'Qualidade de Software',
    'DevOps',
    'Inteligência Artificial',
    'Machine Learning',
    'UI/UX Design',
    'Gestão de Projetos',
    'Metodologias Ágeis',
    'Automação de Testes',
    'Cloud Computing',
    'Segurança da Informação',
    'Arquitetura de Software',
    'Frontend Development',
    'Backend Development',
    'Mobile Development',
    'Data Science',
    'Big Data',
    'Blockchain',
    'IoT',
    'Microserviços',
    'API Development',
    'Design System',
    'Code Quality',
    'Performance',
    'Acessibilidade',
    'DevSecOps',
    'SRE',
    'Infraestrutura',
    'Banco de Dados',
    'Business Intelligence'
];

const descricoesProdutosTecnologia = [
    'Solução avançada que automatiza todo o ciclo de testes, desde a criação até a execução e relatórios, aumentando a eficiência da equipe de QA.',
    'Plataforma integrada que utiliza inteligência artificial para otimizar processos de desenvolvimento e garantir a qualidade do código.',
    'Sistema completo de gestão de projetos ágeis com recursos de planejamento, monitoramento e métricas em tempo real.',
    'Ferramenta inovadora para análise estática e dinâmica de código, identificando vulnerabilidades e sugerindo melhorias.',
    'Software especializado em testes de performance, permitindo simulações de carga e análise detalhada de desempenho.',
    'Plataforma colaborativa para design e prototipação, facilitando a criação e validação de interfaces com usuários.',
    'Sistema robusto de integração contínua e entrega contínua (CI/CD) com suporte a múltiplas tecnologias e ambientes.',
    'Ferramenta completa para documentação técnica, com suporte a versionamento e colaboração em tempo real.',
    'Solução moderna para monitoramento e análise de APIs, garantindo performance e segurança em todas as integrações.',
    'Plataforma unificada de DevOps que integra ferramentas de desenvolvimento, teste e implantação em um único ambiente.',
    'Sistema inteligente de revisão de código que utiliza ML para identificar padrões e sugerir melhorias.',
    'Ferramenta especializada em testes de acessibilidade e usabilidade, garantindo a melhor experiência para todos os usuários.',
    'Plataforma avançada de análise de dados com recursos de visualização e geração de relatórios personalizados.',
    'Software de gerenciamento de configuração que automatiza processos de deploy e rollback com zero downtime.',
    'Sistema integrado de logging e monitoramento com alertas em tempo real e análise preditiva de problemas.',
    'Ferramenta de automação de processos de QA com suporte a testes funcionais, de integração e end-to-end.',
    'Plataforma completa para desenvolvimento de APIs com recursos de documentação, teste e monitoramento.',
    'Solução especializada em testes de segurança, identificando vulnerabilidades e sugerindo correções.',
    'Sistema de versionamento avançado com recursos de branching, merging e resolução de conflitos.',
    'Ferramenta de análise de qualidade de código com métricas detalhadas e sugestões de refatoração.'
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

const gerarCategoriasUnicas = (quantidade) => {
    const categorias = [...categoriasTecnologia];
    const selecionadas = [];
    
    for (let i = 0; i < quantidade; i++) {
        if (categorias.length === 0) break;
        const index = Math.floor(Math.random() * categorias.length);
        selecionadas.push(categorias.splice(index, 1)[0]);
    }
    
    return selecionadas;
};

const cartoesBandeiras = {
    visa: {
        credito: {
            prefixos: ['4'],
            tamanho: 16
        },
        debito: {
            prefixos: ['4'],
            tamanho: 16
        }
    },
    mastercard: {
        credito: {
            prefixos: ['51', '52', '53', '54', '55'],
            tamanho: 16
        },
        debito: {
            prefixos: ['51', '52', '53', '54', '55'],
            tamanho: 16
        }
    },
    amex: {
        credito: {
            prefixos: ['34', '37'],
            tamanho: 15
        }
    },
    elo: {
        credito: {
            prefixos: ['636368', '636369', '438935', '504175', '451416', '509048', '509067', '509049', '509069', '509050', '509074', '509068', '509040', '509045', '509051', '509046', '509066', '509047', '509042', '509052', '509043', '509064', '509040'],
            tamanho: 16
        },
        debito: {
            prefixos: ['636368', '636369', '438935', '504175', '451416', '509048', '509067', '509049', '509069', '509050', '509074', '509068', '509040', '509045', '509051', '509046', '509066', '509047', '509042', '509052', '509043', '509064', '509040'],
            tamanho: 16
        }
    },
    hipercard: {
        credito: {
            prefixos: ['606282'],
            tamanho: 16
        }
    }
};

const formatCardNumber = (numero, bandeira) => {
    // AMEX: 4 + 6 + 5 dígitos
    if (bandeira.toLowerCase() === 'amex') {
        return numero.replace(/(\d{4})(\d{6})(\d{5})/, '$1 $2 $3');
    }
    // Outros cartões: grupos de 4 dígitos
    return numero.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, '$1 $2 $3 $4');
};

const gerarNumeroCartao = (bandeira, tipo) => {
    if (!bandeira || !cartoesBandeiras[bandeira] || !cartoesBandeiras[bandeira][tipo]) {
        // Se não especificar bandeira ou tipo, gera aleatório
        const todasBandeiras = Object.keys(cartoesBandeiras);
        bandeira = faker.helpers.arrayElement(todasBandeiras);
        tipo = faker.helpers.arrayElement(Object.keys(cartoesBandeiras[bandeira]));
    }

    const config = cartoesBandeiras[bandeira][tipo];
    const prefixo = faker.helpers.arrayElement(config.prefixos);
    const tamanho = config.tamanho;
    
    // Gera os dígitos restantes
    const numeroBase = prefixo + faker.string.numeric(tamanho - prefixo.length - 1);
    
    // Implementação do algoritmo de Luhn para gerar o dígito verificador
    let soma = 0;
    let dobra = false;
    
    for (let i = numeroBase.length - 1; i >= 0; i--) {
        let digito = parseInt(numeroBase[i]);
        
        if (dobra) {
            digito *= 2;
            if (digito > 9) {
                digito -= 9;
            }
        }
        
        soma += digito;
        dobra = !dobra;
    }
    
    const digitoVerificador = ((Math.floor(soma / 10) + 1) * 10 - soma) % 10;
    return numeroBase + digitoVerificador;
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

    const generateCreditCard = (bandeira = '', tipo = '') => {
        const numero = gerarNumeroCartao(bandeira, tipo);
        const bandeiraSelecionada = bandeira || detectarBandeira(numero);
        
        return {
            numero,
            numeroFormatado: formatCardNumber(numero, bandeiraSelecionada),
            nome: faker.person.fullName().toUpperCase(),
            validade: faker.date.future().toLocaleDateString('pt-BR', { month: '2-digit', year: '2-digit' }),
            cvv: faker.string.numeric(bandeiraSelecionada === 'amex' ? 4 : 3),
            bandeira: bandeiraSelecionada.toUpperCase(),
            tipo: tipo || 'credito'
        };
    };

    const detectarBandeira = (numero) => {
        for (const [bandeira, config] of Object.entries(cartoesBandeiras)) {
            for (const tipo of Object.values(config)) {
                for (const prefixo of tipo.prefixos) {
                    if (numero.startsWith(prefixo)) {
                        return bandeira;
                    }
                }
            }
        }
        return 'desconhecida';
    };

    const generateProduct = () => ({
        nome: faker.helpers.arrayElement(produtosTecnologia),
        descricao: faker.helpers.arrayElement(descricoesProdutosTecnologia),
        categorias: gerarCategoriasUnicas(3)
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
        gerarCEPValido,
        formatCPF,
        formatCNPJ,
        formatRG
    };
}; 