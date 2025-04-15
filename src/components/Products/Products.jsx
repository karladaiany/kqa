import React, { useState, useCallback } from 'react';
import { useToast } from '../../context/ToastContext';
import { faker } from '@faker-js/faker/locale/pt_BR';
import './Products.css';

const CATEGORIAS = [
  'Desenvolvimento', 'QA', 'DevOps', 'Agile', 
  'Cloud', 'Security', 'Data Science', 'Mobile'
];

export const Products = () => {
  const { showToast } = useToast();
  const [product, setProduct] = useState(() => generateNewProduct());

  function generateNewProduct() {
    return {
      nome: `Curso de ${faker.helpers.arrayElement(CATEGORIAS)} ${faker.number.int({ min: 1, max: 3 })}`,
      descricao: faker.lorem.sentence(),
      preco: faker.commerce.price({ min: 297, max: 1997, dec: 2, symbol: 'R$ ' }),
      categoria: faker.helpers.arrayElement(CATEGORIAS),
      instrutor: faker.person.fullName(),
      duracao: `${faker.number.int({ min: 4, max: 40 })}h`,
      nivel: faker.helpers.arrayElement(['Básico', 'Intermediário', 'Avançado']),
      avaliacoes: faker.number.float({ min: 4, max: 5, precision: 0.1 })
    };
  }

  const handleCopy = useCallback((text) => {
    navigator.clipboard.writeText(text)
      .then(() => showToast('Copiado para a área de transferência!'))
      .catch(err => console.error('Erro ao copiar:', err));
  }, [showToast]);

  const regenerateField = useCallback((field) => {
    setProduct(prev => ({
      ...prev,
      [field]: generateNewProduct()[field]
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
    <div className="card" id="cursos">
      <div className="card-header">
        <h5><i className="fas fa-graduation-cap"></i> Cursos e Produtos</h5>
      </div>
      <div className="card-body">
        <div id="produto-dados">
          <DataField label="Nome" value={product.nome} field="nome" />
          <DataField label="Descrição" value={product.descricao} field="descricao" />
          <DataField label="Preço" value={product.preco} field="preco" />
          <DataField label="Categoria" value={product.categoria} field="categoria" />
          <DataField label="Instrutor" value={product.instrutor} field="instrutor" />
          <DataField label="Duração" value={product.duracao} field="duracao" />
          <DataField label="Nível" value={product.nivel} field="nivel" />
          <DataField label="Avaliações" value={`${product.avaliacoes} ⭐`} field="avaliacoes" />
        </div>
        <button 
          className="btn btn-primary btn-sm regenerate-btn"
          onClick={() => setProduct(generateNewProduct())}
        >
          <i className="fas fa-sync-alt"></i>
        </button>
      </div>
    </div>
  );
}; 