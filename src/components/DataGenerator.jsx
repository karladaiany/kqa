import React, { useState } from 'react';
import { useDataGenerator } from '../hooks/useDataGenerator';
import { toast } from 'react-toastify';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FaCopy, FaSync, FaMask, FaRedo, FaTag, FaCreditCard } from 'react-icons/fa';
import DataField from './DataField';

const CategoryTag = ({ category }) => {
  const handleCopy = () => {
    toast.success('Categoria copiada!');
  };

  return (
    <div className="category-tag">
      <FaTag className="tag-icon" />
      <span className="tag-text">{category}</span>
      <CopyToClipboard text={category} onCopy={handleCopy}>
        <FaCopy className="tag-copy-icon" title="Copiar categoria" />
      </CopyToClipboard>
    </div>
  );
};

const DataGenerator = ({ onGenerate = () => {} }) => {
  const {
    isLoading,
    error,
    generateCPF,
    generateCNPJ,
    generateRG,
    generatePerson,
    generateCreditCard,
    generateProduct,
    gerarCEPValido
  } = useDataGenerator();

  const [documents, setDocuments] = useState({
    cpf: generateCPF(),
    cnpj: generateCNPJ(),
    rg: generateRG()
  });

  const [masks, setMasks] = useState({
    cpf: true,
    cnpj: true,
    rg: true
  });

  const [person, setPerson] = useState(generatePerson());
  const [card, setCard] = useState(generateCreditCard());
  const [product, setProduct] = useState(generateProduct());

  const [cardConfig, setCardConfig] = useState({
    bandeira: 'visa',
    tipo: 'credito'
  });

  const toggleMask = (field) => {
    setMasks(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const regenerateField = (field) => {
    const newPerson = { ...person };
    
    switch(field) {
      case 'nome':
        const { nome, email } = generatePerson();
        newPerson.nome = nome;
        newPerson.email = email; // Atualiza email junto com nome pois são relacionados
        break;
      case 'telefone':
        newPerson.telefone = generatePerson().telefone;
        break;
      case 'endereco':
        newPerson.endereco = {
          ...newPerson.endereco,
          rua: generatePerson().endereco.rua
        };
        break;
      case 'numero':
        newPerson.endereco = {
          ...newPerson.endereco,
          numero: generatePerson().endereco.numero
        };
        break;
      case 'complemento':
        newPerson.endereco = {
          ...newPerson.endereco,
          complemento: generatePerson().endereco.complemento
        };
        break;
      case 'bairro':
        newPerson.endereco = {
          ...newPerson.endereco,
          bairro: generatePerson().endereco.bairro
        };
        break;
      case 'cidade':
        newPerson.endereco = {
          ...newPerson.endereco,
          cidade: generatePerson().endereco.cidade
        };
        break;
      case 'estado':
        const novaPessoa = generatePerson();
        newPerson.endereco = {
          ...newPerson.endereco,
          estado: novaPessoa.endereco.estado,
          cep: novaPessoa.endereco.cep // Atualiza CEP junto com estado pois são relacionados
        };
        break;
      case 'cep':
        // Gera um novo CEP baseado no estado atual
        newPerson.endereco = {
          ...newPerson.endereco,
          cep: gerarCEPValido(newPerson.endereco.estado)
        };
        break;
      default:
        return;
    }
    
    setPerson(newPerson);
  };

  const regenerateProductField = (field) => {
    const newProduct = { ...product };
    const tempProduct = generateProduct();
    
    switch(field) {
      case 'nome':
        newProduct.nome = tempProduct.nome;
        break;
      case 'descricao':
        newProduct.descricao = tempProduct.descricao;
        break;
      case 'categorias':
        newProduct.categorias = tempProduct.categorias;
        break;
      default:
        return;
    }
    
    setProduct(newProduct);
  };

  const handleCardConfigChange = (e) => {
    const { name, value } = e.target;
    setCardConfig(prev => {
      const newConfig = {
        ...prev,
        [name]: value
      };
      setCard(generateCreditCard(newConfig.bandeira, newConfig.tipo));
      return newConfig;
    });
  };

  if (isLoading) {
    return <div>Carregando gerador de dados...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="data-generator">
      <section className="card">
        <div className="card-header">
          <h2>Documentos</h2>
        </div>
        <div className="card-content">
          <DataField 
            label="CPF" 
            value={documents.cpf.formatted}
            raw={documents.cpf.raw}
            showMask={masks.cpf}
            onRegenerate={() => setDocuments(prev => ({ ...prev, cpf: generateCPF() }))}
            onToggleMask={() => toggleMask('cpf')}
          />
          <DataField 
            label="CNPJ" 
            value={documents.cnpj.formatted}
            raw={documents.cnpj.raw}
            showMask={masks.cnpj}
            onRegenerate={() => setDocuments(prev => ({ ...prev, cnpj: generateCNPJ() }))}
            onToggleMask={() => toggleMask('cnpj')}
          />
          <DataField 
            label="RG" 
            value={documents.rg.formatted}
            raw={documents.rg.raw}
            showMask={masks.rg}
            onRegenerate={() => setDocuments(prev => ({ ...prev, rg: generateRG() }))}
            onToggleMask={() => toggleMask('rg')}
          />
        </div>
      </section>

      <section className="card">
        <div className="card-header">
          <h2>Dados Pessoais</h2>
          <button 
            className="generate-all-btn" 
            onClick={() => setPerson(generatePerson())}
            title="Gerar todos os dados pessoais novamente"
          >
            <FaRedo className="generate-icon" />
            Gerar tudo
          </button>
        </div>
        <div className="card-content">
          <DataField 
            label="Nome" 
            value={person.nome}
            onRegenerate={() => regenerateField('nome')}
          />
          <DataField 
            label="Email" 
            value={person.email}
            onRegenerate={() => regenerateField('nome')} // Email é atualizado junto com o nome
          />
          <DataField 
            label="Telefone" 
            value={person.telefone}
            onRegenerate={() => regenerateField('telefone')}
          />
          <DataField 
            label="Endereço" 
            value={person.endereco.rua}
            onRegenerate={() => regenerateField('endereco')}
          />
          <DataField 
            label="Número" 
            value={person.endereco.numero}
            onRegenerate={() => regenerateField('numero')}
          />
          <DataField 
            label="Complemento" 
            value={person.endereco.complemento}
            onRegenerate={() => regenerateField('complemento')}
          />
          <DataField 
            label="Bairro" 
            value={person.endereco.bairro}
            onRegenerate={() => regenerateField('bairro')}
          />
          <DataField 
            label="Cidade" 
            value={person.endereco.cidade}
            onRegenerate={() => regenerateField('cidade')}
          />
          <DataField 
            label="UF" 
            value={person.endereco.estado}
            onRegenerate={() => regenerateField('estado')}
          />
          <DataField 
            label="CEP" 
            value={person.endereco.cep}
            onRegenerate={() => regenerateField('cep')}
          />
        </div>
      </section>

      <section className="card">
        <div className="card-header">
          <h2>Produto</h2>
          <button 
            className="generate-all-btn" 
            onClick={() => setProduct(generateProduct())}
            title="Gerar todos os dados do produto novamente"
          >
            <FaRedo className="generate-icon" />
            Gerar tudo
          </button>
        </div>
        <div className="card-content">
          <DataField 
            label="Nome" 
            value={product.nome}
            onRegenerate={() => regenerateProductField('nome')}
          />
          <DataField 
            label="Descrição" 
            value={product.descricao}
            onRegenerate={() => regenerateProductField('descricao')}
          />
          <div className="campo-item">
            <label>Categorias:</label>
            <div className="campo-valor">
              <div className="categories-container">
                {product.categorias.map((categoria, index) => (
                  <CategoryTag key={index} category={categoria} />
                ))}
              </div>
              <FaSync 
                className="regenerate-icon" 
                title="Gerar novas categorias"
                onClick={() => regenerateProductField('categorias')}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="card">
        <div className="card-header">
          <h2>Cartão</h2>
          <div className="card-filters">
            <select 
              name="bandeira"
              value={cardConfig.bandeira}
              onChange={handleCardConfigChange}
              className="card-select"
            >
              <option value="visa">Visa</option>
              <option value="mastercard">Mastercard</option>
              <option value="amex">American Express</option>
              <option value="elo">Elo</option>
            </select>

            <select
              name="tipo"
              value={cardConfig.tipo}
              onChange={handleCardConfigChange}
              className="card-select"
            >
              <option value="credito">Crédito</option>
              <option value="debito">Débito</option>
              <option value="multiplo">Múltiplo</option>
            </select>

            <button 
              onClick={() => setCard(generateCreditCard(cardConfig.bandeira, cardConfig.tipo))}
              className="generate-all-btn"
            >
              <FaRedo className="generate-icon" /> Gerar novo cartão
            </button>
          </div>
        </div>
        <div className="card-content">
          <DataField 
            label="Número" 
            value={card.numeroFormatado}
            rawValue={card.numero}
          />
          <DataField 
            label="Nome" 
            value={card.nome}
          />
          <DataField 
            label="Validade" 
            value={card.validade}
          />
          <DataField 
            label="CVV" 
            value={card.cvv}
          />
        </div>
      </section>
    </div>
  );
};

export { DataGenerator };
export default DataGenerator; 