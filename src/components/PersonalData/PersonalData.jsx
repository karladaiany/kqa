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

export const PersonalData = () => {
  const { showToast } = useToast();
  const [personalData, setPersonalData] = useState(() => generateNewData());

  function generateNewData() {
    return {
      nome: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      telefone: `(${DDDsValidos[Math.floor(Math.random() * DDDsValidos.length)]}) ${faker.number.int({ min: 1000, max: 9999 })}-${faker.number.int({ min: 1000, max: 9999 })}`,
      celular: `(${DDDsValidos[Math.floor(Math.random() * DDDsValidos.length)]}) 9${faker.number.int({ min: 1000, max: 9999 })}-${faker.number.int({ min: 1000, max: 9999 })}`,
      rua: faker.location.street(),
      numero: faker.number.int({ min: 1, max: 9999 }),
      bairro: faker.location.county(),
      cidade: faker.location.city(),
      estado: faker.location.state('BR'),
      cep: faker.location.zipCode('#####-###')
    };
  }

  const handleCopy = useCallback((text) => {
    navigator.clipboard.writeText(text)
      .then(() => showToast('Copiado para a área de transferência!'))
      .catch(err => console.error('Erro ao copiar:', err));
  }, [showToast]);

  const regenerateField = useCallback((field) => {
    setPersonalData(prev => ({
      ...prev,
      [field]: generateNewData()[field]
    }));
  }, []);

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
          <DataField 
            label="Endereço" 
            value={`${personalData.rua}, ${personalData.numero}`} 
            field="rua" 
          />
          <DataField label="Bairro" value={personalData.bairro} field="bairro" />
          <DataField 
            label="Cidade/UF" 
            value={`${personalData.cidade}/${personalData.estado}`} 
            field="cidade" 
          />
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