import { faker } from '@faker-js/faker'; // Assuming faker is available

export const generateCompanyName = () => {
  const formats = [
    () => `${faker.company.name()} ${faker.company.companySuffix()}`,
    () => `${faker.commerce.department()} Soluções`,
    () => `Tecnologia ${faker.word.adjective()} ${faker.word.noun()}`,
    () => `${faker.word.verb().toUpperCase()} KQA`,
    () => `Grupo ${faker.company.name()}`,
  ];
  return faker.helpers.arrayElement(formats)();
};

export const generateDepartment = () => {
  return faker.commerce.department();
};

export const generateJobTitle = () => {
  return faker.name.jobTitle();
};

export const generateBusinessSector = () => {
  // Combining job area with a broader sector for more variety
  const sectors = [
    faker.name.jobArea(),
    'Tecnologia', 'Saúde', 'Finanças', 'Varejo', 'Educação', 
    'Consultoria', 'Manufatura', 'Serviços', 'Imobiliário', 'Entretenimento'
  ];
  return faker.helpers.arrayElement(sectors);
};

export const generateNumEmployees = () => {
  return faker.datatype.number({ min: 0, max: 9999 }).toString();
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
    if (length > guaranteedChars.length) guaranteedChars.push(faker.helpers.arrayElement(CHARSETS.LOWERCASE.split('')));
  }
  if (includeUppercase) {
    availableChars += CHARSETS.UPPERCASE;
    if (length > guaranteedChars.length) guaranteedChars.push(faker.helpers.arrayElement(CHARSETS.UPPERCASE.split('')));
  }
  if (includeNumbers) {
    availableChars += CHARSETS.NUMBERS;
    if (length > guaranteedChars.length) guaranteedChars.push(faker.helpers.arrayElement(CHARSETS.NUMBERS.split('')));
  }
  if (includeSpecialChars) {
    availableChars += CHARSETS.SPECIAL;
    if (length > guaranteedChars.length) guaranteedChars.push(faker.helpers.arrayElement(CHARSETS.SPECIAL.split('')));
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
