import { fakerPT_BR as faker } from '@faker-js/faker'; // Explicitly use pt_BR

const ptBRCompanyNames = [
  'Soluções KQA',
  'Tecnologia Delta',
  'Inovações Brasil',
  'Consultoria Alfa',
  'Sistemas Omega',
  'Digital Max',
  'Web Prime',
  'Conecta BR',
  'Grupo Vanguarda',
  'PontoCom Inovações',
  'Avanço Digital',
  'Métrica Soluções',
  'Proativa Consultoria',
  'União Tech',
  'Fênix Desenvolvimento',
];

const ptBRDepartments = [
  'Recursos Humanos',
  'Desenvolvimento',
  'Marketing',
  'Vendas',
  'Suporte Técnico',
  'Financeiro',
  'Operações',
  'Qualidade',
  'Pesquisa e Desenvolvimento',
  'Logística',
  'Administrativo',
  'Jurídico',
  'Produto',
  'Infraestrutura',
  'Comercial',
];

const ptBRJobTitles = [
  'Analista de Sistemas',
  'Engenheiro de Software',
  'Gerente de Projetos',
  'Designer UX',
  'Especialista em Redes',
  'Desenvolvedor Frontend',
  'Desenvolvedor Backend',
  'Analista de Qualidade',
  'Cientista de Dados',
  'Arquiteto de Soluções',
  'Consultor de TI',
  'Gerente de Marketing',
  'Analista Financeiro',
  'Coordenador de Vendas',
  'Técnico de Suporte',
];

export const generateCompanyName = () => {
  return faker.helpers.arrayElement(ptBRCompanyNames);
};

export const generateDepartment = () => {
  return faker.helpers.arrayElement(ptBRDepartments);
};

export const generateJobTitle = () => {
  return faker.helpers.arrayElement(ptBRJobTitles);
};

export const generateBusinessSector = () => {
  // For BusinessSector, combining Faker's jobArea (often in PT-BR) with a fixed list is still good.
  // If faker.name.jobArea() is not reliably in PT-BR, this could also be replaced.
  // For now, assuming jobArea() from fakerPT_BR is mostly fine.
  const sectors = [
    faker.person.jobArea(), // Changed from name.jobArea() to person.jobArea() for v8+
    'Tecnologia',
    'Saúde',
    'Finanças',
    'Varejo',
    'Educação',
    'Consultoria',
    'Manufatura',
    'Serviços',
    'Imobiliário',
    'Entretenimento',
    'Agronegócio',
    'Construção Civil',
    'Energia',
    'Logística',
    'Turismo',
  ];
  return faker.helpers.arrayElement(sectors);
};

export const generateNumEmployees = () => {
  return faker.number.int({ min: 0, max: 9999 }).toString();
};

const CHARSETS = {
  LOWERCASE: 'abcdefghijklmnopqrstuvwxyz',
  UPPERCASE: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  NUMBERS: '0123456789',
  SPECIAL: '!@#$%^&*()_+-=[]{};\':",./<>?`~',
};

export const generatePassword = (
  length = 16,
  options = {
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSpecialChars: true,
  }
) => {
  if (length <= 0) return '';

  const {
    includeUppercase,
    includeLowercase,
    includeNumbers,
    includeSpecialChars,
  } = options;

  let availableChars = '';
  const guaranteedChars = [];

  if (includeLowercase) {
    availableChars += CHARSETS.LOWERCASE;
    if (length > guaranteedChars.length)
      guaranteedChars.push(
        faker.helpers.arrayElement(CHARSETS.LOWERCASE.split(''))
      );
  }
  if (includeUppercase) {
    availableChars += CHARSETS.UPPERCASE;
    if (length > guaranteedChars.length)
      guaranteedChars.push(
        faker.helpers.arrayElement(CHARSETS.UPPERCASE.split(''))
      );
  }
  if (includeNumbers) {
    availableChars += CHARSETS.NUMBERS;
    if (length > guaranteedChars.length)
      guaranteedChars.push(
        faker.helpers.arrayElement(CHARSETS.NUMBERS.split(''))
      );
  }
  if (includeSpecialChars) {
    availableChars += CHARSETS.SPECIAL;
    if (length > guaranteedChars.length)
      guaranteedChars.push(
        faker.helpers.arrayElement(CHARSETS.SPECIAL.split(''))
      );
  }

  if (!availableChars) {
    return 'Selecione os tipos de caracteres';
  }

  let passwordArray = [...guaranteedChars];

  for (let i = guaranteedChars.length; i < length; i++) {
    passwordArray.push(faker.helpers.arrayElement(availableChars.split('')));
  }

  // Shuffle the array to ensure guaranteed characters are not always at the beginning
  passwordArray = faker.helpers.shuffle(passwordArray);

  return passwordArray.join('');
};
