import React, { useState, useCallback } from 'react';
import { useToast } from '../../context/ToastContext';
import { faker } from '@faker-js/faker/locale/pt_BR';
import './Products.css';

const TECH_PREFIXES = [
  'Curso de', 'Treinamento em', 'Workshop de', 'Especialização em',
  'Formação em', 'Certificação em', 'Bootcamp de'
];

const TECH_SUBJECTS = [
  'Automação de Testes', 'Testes de API', 'Testes de Performance',
  'Selenium WebDriver', 'Cypress', 'Robot Framework',
  'DevOps', 'CI/CD', 'Docker', 'Kubernetes',
  'JavaScript', 'Python', 'Java', 'C#',
  'React', 'Angular', 'Vue.js', 'Node.js',
  'AWS', 'Azure', 'Google Cloud', 'Microserviços'
];

const TECH_CATEGORIES = [
  'QA', 'Automação', 'DevOps', 'Frontend',
  'Backend', 'Full Stack', 'Cloud', 'Arquitetura',
  'Frameworks', 'API', 'Mobile', 'Web',
  'Database', 'Security', 'Performance', 'Agile'
];

export const Products = () => {
  const { showToast } = useToast();

  function getRandomCategories() {
    // Embaralha o array e pega 3 categorias únicas
    return faker.helpers.shuffle([...TECH_CATEGORIES]).slice(0, 3);
  }

  function generateProductName() {
    const prefix = faker.helpers.arrayElement(TECH_PREFIXES);
    const subject = faker.helpers.arrayElement(TECH_SUBJECTS);
    return `${prefix} ${subject}`;
  }

  function generateNewProduct() {
    const categories = getRandomCategories();
    return {
      nome: generateProductName(),
      descricao: faker.lorem.paragraph(),
      categoria1: categories[0],
      categoria2: categories[1],
      categoria3: categories[2]
    };
  }

  const [product, setProduct] = useState(() => generateNewProduct());

  const handleCopy = useCallback((text) => {
    navigator.clipboard.writeText(text)
      .then(() => showToast('Copiado para a área de transferência!'))
      .catch(err => console.error('Erro ao copiar:', err));
  }, [showToast]);

  const regenerateField = useCallback((field) => {
    if (field.startsWith('categoria')) {
      // Gera apenas uma nova categoria
      const availableCategories = TECH_CATEGORIES.filter(cat => 
        cat !== product.categoria1 && 
        cat !== product.categoria2 && 
        cat !== product.categoria3
      );
      const newCategory = faker.helpers.arrayElement(availableCategories);
      
      setProduct(prev => ({
        ...prev,
        [field]: newCategory
      }));
    } else {
      setProduct(prev => ({
        ...prev,
        [field]: field === 'nome' ? generateProductName() : generateNewProduct()[field]
      }));
    }
  }, [product.categoria1, product.categoria2, product.categoria3]);

  const DataField = ({ label, value, field, isTextArea = false }) => (
    <div className="campo-item">
      <label>{label}</label>
      <div className="campo-valor">
        <div className="valor-wrapper">
          {isTextArea ? (
            <textarea
              className="copyable form-control"
              value={value}
              readOnly
              rows="2"
            />
          ) : (
            <span className="copyable">{value}</span>
          )}
          <div className="acoes">
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
      </div>
    </div>
  );

  return (
    <div className="card" id="cursos-produtos">
      <div className="card-header">
        <h5><i className="fas fa-graduation-cap"></i> Cursos e Produtos</h5>
      </div>
      <div className="card-body">
        <div id="produto-dados">
          <DataField label="Nome" value={product.nome} field="nome" />
          <DataField 
            label="Descrição" 
            value={product.descricao} 
            field="descricao"
            isTextArea={true}
          />
          <DataField label="Categoria 1" value={product.categoria1} field="categoria1" />
          <DataField label="Categoria 2" value={product.categoria2} field="categoria2" />
          <DataField label="Categoria 3" value={product.categoria3} field="categoria3" />
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