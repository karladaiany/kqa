import React, { useState, useCallback } from 'react';
import { useToast } from '../../context/ToastContext';
import { faker } from '@faker-js/faker/locale/pt_BR';
import './PersonalData.css';

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

// CEPs válidos por estado
const CEPRanges = {
  SP: { start: '01000000', end: '19999999' },
  RJ: { start: '20000000', end: '28999999' },
  ES: { start: '29000000', end: '29999999' },
  MG: { start: '30000000', end: '39999999' },
  BA: { start: '40000000', end: '48999999' },
  SE: { start: '49000000', end: '49999999' },
  PE: { start: '50000000', end: '56999999' },
  AL: { start: '57000000', end: '57999999' },
  PB: { start: '58000000', end: '58999999' },
  RN: { start: '59000000', end: '59999999' },
  CE: { start: '60000000', end: '63999999' },
  PI: { start: '64000000', end: '64999999' },
  MA: { start: '65000000', end: '65999999' },
  PA: { start: '66000000', end: '68899999' },
  AP: { start: '68900000', end: '68999999' },
  AM: { start: '69000000', end: '69299999' },
  RR: { start: '69300000', end: '69399999' },
  AC: { start: '69900000', end: '69999999' },
  DF: { start: '70000000', end: '73699999' },
  GO: { start: '73700000', end: '76799999' },
  RO: { start: '76800000', end: '76999999' },
  TO: { start: '77000000', end: '77999999' },
  MT: { start: '78000000', end: '78899999' },
  MS: { start: '79000000', end: '79999999' },
  PR: { start: '80000000', end: '87999999' },
  SC: { start: '88000000', end: '89999999' },
  RS: { start: '90000000', end: '99999999' }
};

export const PersonalData = () => {
  const { showToast } = useToast();

  const normalizeText = useCallback((text) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '');
  }, []);

  const generateEmail = useCallback((useFullName = false, fullName = '') => {
    if (useFullName) {
      const [firstName, ...lastNameParts] = fullName.split(' ');
      const lastName = lastNameParts[lastNameParts.length - 1];
      return `${normalizeText(firstName)}.${normalizeText(lastName)}@teste.com`;
    }
    
    // Email aleatório para regeneração individual
    const firstName = normalizeText(faker.person.firstName());
    const lastName = normalizeText(faker.person.lastName());
    return `${firstName}.${lastName}@teste.com`;
  }, [normalizeText]);

  const generateName = useCallback(() => {
    // Remove prefixos do nome
    let fullName = faker.person.fullName()
      .replace(/^(Sr\.|Sra\.|Srta\.|Dr\.|Dra\.|Prof\.|Profa\.) /, '');
    return fullName;
  }, []);

  const generateValidCEP = useCallback((estado) => {
    const range = CEPRanges[estado] || CEPRanges.SP;
    const min = parseInt(range.start);
    const max = parseInt(range.end);
    const cep = faker.number.int({ min, max });
    
    // Garante que o CEP tenha 8 dígitos
    const cepString = cep.toString().padStart(8, '0');
    return cepString.replace(/(\d{5})(\d{3})/, '$1-$2');
  }, []);

  function generateNewData() {
    const fullName = generateName();
    const estado = faker.location.state('BR');
    const complementos = ['Apto', 'Casa', 'Sala', 'Conjunto', 'Bloco'];
    
    return {
      nome: fullName,
      email: generateEmail(true, fullName),
      telefone: `(${DDDsValidos[Math.floor(Math.random() * DDDsValidos.length)]}) ${faker.number.int({ min: 1000, max: 9999 })}-${faker.number.int({ min: 1000, max: 9999 })}`,
      celular: `(${DDDsValidos[Math.floor(Math.random() * DDDsValidos.length)]}) 9${faker.number.int({ min: 1000, max: 9999 })}-${faker.number.int({ min: 1000, max: 9999 })}`,
      rua: faker.location.street(),
      numero: faker.number.int({ min: 1, max: 9999 }),
      complemento: `${faker.helpers.arrayElement(complementos)} ${faker.number.int({ min: 1, max: 999 })}`,
      bairro: faker.location.county(),
      cidade: faker.location.city(),
      estado: estado,
      cep: generateValidCEP(estado)
    };
  }

  const [personalData, setPersonalData] = useState(() => generateNewData());

  const handleCopy = useCallback((text) => {
    navigator.clipboard.writeText(text)
      .then(() => showToast('Copiado para a área de transferência!'))
      .catch(err => console.error('Erro ao copiar:', err));
  }, [showToast]);

  const regenerateField = useCallback((field) => {
    setPersonalData(prev => ({
      ...prev,
      [field]: field === 'email' ? generateEmail() :
              field === 'nome' ? generateName() :
              generateNewData()[field]
    }));
  }, [generateEmail, generateName]);

  const DataField = ({ label, value, field }) => (
    <div className="campo-item">
      <label>{label}:</label>
      <div className="campo-valor">
        <span className="copyable">{value}</span>
        <i 
          className="fas fa-copy copy-icon" 
          title="Copiar"
          onClick={() => handleCopy(value)}
        />
        <i 
          className="fas fa-sync-alt regenerate-icon" 
          title="Gerar novo"
          onClick={() => regenerateField(field)}
        />
      </div>
    </div>
  );

  return (
    <div className="card" id="dados-pessoais">
      <div className="card-header">
        <h5><i className="fas fa-user"></i> Dados Pessoais</h5>
      </div>
      <div className="card-body">
        <div id="pessoa-dados">
          <DataField label="Nome" value={personalData.nome} field="nome" />
          <DataField label="Email" value={personalData.email} field="email" />
          <DataField label="Telefone" value={personalData.telefone} field="telefone" />
          <DataField label="Celular" value={personalData.celular} field="celular" />
          <DataField label="Endereço" value={personalData.rua} field="rua" />
          <DataField label="Número" value={personalData.numero} field="numero" />
          <DataField label="Complemento" value={personalData.complemento} field="complemento" />
          <DataField label="Bairro" value={personalData.bairro} field="bairro" />
          <DataField label="Cidade" value={personalData.cidade} field="cidade" />
          <DataField label="Estado" value={personalData.estado} field="estado" />
          <DataField label="CEP" value={personalData.cep} field="cep" />
        </div>
        <button 
          className="btn btn-primary btn-sm regenerate-btn" 
          onClick={() => setPersonalData(generateNewData())}
        >
          <i className="fas fa-sync-alt"></i>
        </button>
      </div>
    </div>
  );
}; 