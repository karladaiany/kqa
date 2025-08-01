/**
 * Gerador de dados pessoais para a aplicação KQA
 * @author KQA Team
 * @description Funções para geração de dados pessoais completos
 */

import { fakerPT_BR as faker } from '@faker-js/faker';
import { formatarNomeParaEmail } from '../utils/formatters';
import { gerarEnderecoCompleto, gerarTelefone } from './address';

// ============================================================================
// GERAÇÃO DE DADOS BÁSICOS
// ============================================================================

/**
 * Gera nome completo
 * @returns {Object} Objeto com nome e suas variações
 */
export const gerarNome = () => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const nomeCompleto = `${firstName} ${lastName}`;

  return {
    primeiro: firstName,
    ultimo: lastName,
    completo: nomeCompleto,
    paraEmail: formatarNomeParaEmail(nomeCompleto),
  };
};

/**
 * Gera email baseado no nome
 * @param {string} nome - Nome para gerar o email
 * @param {string} [dominio='teste.com'] - Domínio do email
 * @returns {string} E-mail formatado
 */
export const gerarEmail = (nome, dominio = 'teste.com') => {
  const nomeFormatado = formatarNomeParaEmail(nome);
  return `${nomeFormatado}@${dominio}`;
};

/**
 * Gera idade aleatória
 * @param {number} [min=18] - Idade mínima
 * @param {number} [max=80] - Idade máxima
 * @returns {number} Idade gerada
 */
export const gerarIdade = (min = 18, max = 80) => {
  return faker.number.int({ min, max });
};

/**
 * Gera data de nascimento baseada na idade
 * @param {number} [idade] - Idade específica (opcional)
 * @returns {Object} Objeto com data de nascimento em vários formatos
 */
export const gerarDataNascimento = (idade = null) => {
  const idadeReal = idade || gerarIdade();
  const anoNascimento = new Date().getFullYear() - idadeReal;
  const dataNascimento = faker.date.birthdate({
    min: anoNascimento,
    max: anoNascimento,
    mode: 'year',
  });

  return {
    data: dataNascimento,
    formatada: dataNascimento.toLocaleDateString('pt-BR'),
    iso: dataNascimento.toISOString(),
    idade: idadeReal,
  };
};

// ============================================================================
// GERAÇÃO DE DADOS PROFISSIONAIS
// ============================================================================

/**
 * Gera profissão/cargo
 * @returns {string} Profissão aleatória
 */
export const gerarProfissao = () => {
  return faker.person.jobTitle();
};

/**
 * Gera área de trabalho
 * @returns {string} Área profissional
 */
export const gerarAreaTrabalho = () => {
  return faker.person.jobArea();
};

/**
 * Gera tipo de trabalho
 * @returns {string} Tipo de trabalho
 */
export const gerarTipoTrabalho = () => {
  return faker.person.jobType();
};

/**
 * Gera dados profissionais completos
 * @returns {Object} Objeto com dados profissionais
 */
export const gerarDadosProfissionais = () => {
  return {
    cargo: gerarProfissao(),
    area: gerarAreaTrabalho(),
    tipo: gerarTipoTrabalho(),
    empresa: faker.company.name(),
    salario: faker.number.int({ min: 1500, max: 15000 }),
  };
};

// ============================================================================
// GERAÇÃO DE PESSOA COMPLETA
// ============================================================================

/**
 * Gera pessoa completa com todos os dados
 * @param {Object} [opcoes={}] - Opções de personalização
 * @returns {Object} Objeto com dados completos da pessoa
 */
export const gerarPessoaCompleta = (opcoes = {}) => {
  const {
    incluirProfissao = false,
    incluirDataNascimento = false,
    estado = null,
    dominioEmail = 'teste.com',
    idadeMin = 18,
    idadeMax = 80,
  } = opcoes;

  // Gera dados básicos
  const nome = gerarNome();
  const endereco = gerarEnderecoCompleto(estado);
  const telefone = gerarTelefone(estado);

  // Monta objeto base da pessoa
  const pessoa = {
    nome: nome.completo,
    email: gerarEmail(nome.completo, dominioEmail),
    telefone: telefone.numeroCompleto,
    endereco,
  };

  // Adiciona data de nascimento se solicitado
  if (incluirDataNascimento) {
    const idadePersonalizada = gerarIdade(idadeMin, idadeMax);
    const dataNascimento = gerarDataNascimento(idadePersonalizada);
    pessoa.nascimento = dataNascimento;
    pessoa.idade = dataNascimento.idade;
  }

  // Adiciona dados profissionais se solicitado
  if (incluirProfissao) {
    pessoa.profissao = gerarDadosProfissionais();
  }

  return pessoa;
};

/**
 * Gera pessoa simples (apenas dados básicos)
 * @param {string} [estado] - Estado específico para endereço
 * @returns {Object} Objeto com dados básicos da pessoa
 */
export const gerarPessoaSimples = (estado = null) => {
  return gerarPessoaCompleta({ estado });
};

/**
 * Gera pessoa com profissão
 * @param {string} [estado] - Estado específico para endereço
 * @returns {Object} Objeto com dados da pessoa incluindo profissão
 */
export const gerarPessoaComProfissao = (estado = null) => {
  return gerarPessoaCompleta({
    estado,
    incluirProfissao: true,
    incluirDataNascimento: true,
  });
};

// ============================================================================
// GERAÇÃO DE MÚLTIPLAS PESSOAS
// ============================================================================

/**
 * Gera múltiplas pessoas
 * @param {number} quantidade - Quantidade de pessoas a gerar
 * @param {Object} [opcoes={}] - Opções de personalização
 * @returns {Object[]} Array com pessoas geradas
 */
export const gerarMultiplasPessoas = (quantidade, opcoes = {}) => {
  const pessoas = [];

  for (let i = 0; i < quantidade; i++) {
    pessoas.push(gerarPessoaCompleta(opcoes));
  }

  return pessoas;
};

/**
 * Gera família (pessoas com mesmo endereço)
 * @param {number} [quantidade=4] - Quantidade de membros da família
 * @param {string} [estado] - Estado específico
 * @returns {Object[]} Array com membros da família
 */
export const gerarFamilia = (quantidade = 4, estado = null) => {
  const endereco = gerarEnderecoCompleto(estado);
  const telefone = gerarTelefone(estado);
  const familia = [];

  for (let i = 0; i < quantidade; i++) {
    const nome = gerarNome();
    const dataNascimento = gerarDataNascimento();

    familia.push({
      nome: nome.completo,
      email: gerarEmail(nome.completo),
      telefone: telefone.numeroCompleto,
      endereco,
      nascimento: dataNascimento,
      idade: dataNascimento.idade,
      posicaoFamilia: i === 0 ? 'Responsável' : `Membro ${i}`,
    });
  }

  return familia;
};

// ============================================================================
// GERAÇÃO DE DADOS ESPECÍFICOS
// ============================================================================

/**
 * Gera apenas dados de contato
 * @param {string} [estado] - Estado específico
 * @returns {Object} Objeto com dados de contato
 */
export const gerarDadosContato = (estado = null) => {
  const nome = gerarNome();
  const telefone = gerarTelefone(estado);

  return {
    nome: nome.completo,
    email: gerarEmail(nome.completo),
    telefone: telefone.numeroCompleto,
    celular: telefone.numeroCompleto, // Mesmo número como celular
  };
};

/**
 * Gera dados pessoais para formulário
 * @param {string[]} [campos] - Campos específicos a incluir
 * @param {string} [estado] - Estado específico
 * @returns {Object} Objeto com campos solicitados
 */
export const gerarDadosFormulario = (campos = [], estado = null) => {
  const pessoa = gerarPessoaCompleta({
    incluirProfissao: true,
    incluirDataNascimento: true,
    estado,
  });

  // Se não especificar campos, retorna tudo
  if (campos.length === 0) {
    return pessoa;
  }

  // Filtra apenas os campos solicitados
  const dadosFiltrados = {};
  campos.forEach(campo => {
    if (Object.prototype.hasOwnProperty.call(pessoa, campo)) {
      dadosFiltrados[campo] = pessoa[campo];
    }
  });

  return dadosFiltrados;
};

/**
 * Gera username baseado no nome
 * @param {string} [nome] - Nome específico (se não fornecido, gera um)
 * @returns {Object} Objeto com username e variações
 */
export const gerarUsername = (nome = null) => {
  const nomeReal = nome || gerarNome().completo;
  const nomeFormatado = formatarNomeParaEmail(nomeReal)
    .replace('@', '')
    .replace('.com', '');

  return {
    username: nomeFormatado,
    comNumeros: nomeFormatado + faker.string.numeric(2),
    comUnderscore: nomeFormatado.replace(/\./g, '_'),
    abreviado:
      nomeFormatado
        .split('.')
        .map(parte => parte.charAt(0))
        .join('') + faker.string.numeric(3),
  };
};

// ============================================================================
// UTILITÁRIOS
// ============================================================================

/**
 * Valida se os dados de uma pessoa estão completos
 * @param {Object} pessoa - Objeto pessoa para validar
 * @returns {Object} Resultado da validação
 */
export const validarPessoaCompleta = pessoa => {
  const camposObrigatorios = ['nome', 'email', 'telefone', 'endereco'];
  const camposFaltando = [];

  camposObrigatorios.forEach(campo => {
    if (!pessoa[campo]) {
      camposFaltando.push(campo);
    }
  });

  return {
    valida: camposFaltando.length === 0,
    camposFaltando,
    temTodosOsDados: Boolean(
      pessoa.nome &&
        pessoa.email &&
        pessoa.telefone &&
        pessoa.endereco &&
        pessoa.endereco.cep &&
        pessoa.endereco.cidade &&
        pessoa.endereco.estado
    ),
  };
};
