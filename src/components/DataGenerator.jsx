import React, { useState } from 'react';
import { useDataGenerator } from '../hooks/useDataGenerator';
import { toast } from 'react-toastify';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FaCopy, FaSync } from 'react-icons/fa';

const DataField = ({ label, value, onRegenerate }) => {
  const handleCopy = () => {
    toast.success('Copiado para a área de transferência!');
  };

  return (
    <div className="campo-item">
      <label>{label}:</label>
      <div className="campo-valor">
        <CopyToClipboard text={value} onCopy={handleCopy}>
          <span className="copyable">{value}</span>
        </CopyToClipboard>
        <CopyToClipboard text={value} onCopy={handleCopy}>
          <FaCopy className="copy-icon" title="Copiar" />
        </CopyToClipboard>
        {onRegenerate && (
          <FaSync 
            className="regenerate-icon" 
            title="Gerar novo"
            onClick={onRegenerate}
          />
        )}
      </div>
    </div>
  );
};

export const DataGenerator = () => {
  const {
    isLoading,
    error,
    generateCPF,
    generateCNPJ,
    generateRG,
    generatePerson,
    generateCreditCard,
    generateProduct
  } = useDataGenerator();

  const [documents, setDocuments] = useState({
    cpf: generateCPF(),
    cnpj: generateCNPJ(),
    rg: generateRG()
  });

  const [person, setPerson] = useState(generatePerson());
  const [card, setCard] = useState(generateCreditCard());
  const [product, setProduct] = useState(generateProduct());

  if (isLoading) {
    return <div>Carregando gerador de dados...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="data-generator">
      <section className="card">
        <h2>Documentos</h2>
        <div className="card-content">
          <DataField 
            label="CPF" 
            value={documents.cpf.formatted}
            onRegenerate={() => setDocuments(prev => ({ ...prev, cpf: generateCPF() }))}
          />
          <DataField 
            label="CNPJ" 
            value={documents.cnpj.formatted}
            onRegenerate={() => setDocuments(prev => ({ ...prev, cnpj: generateCNPJ() }))}
          />
          <DataField 
            label="RG" 
            value={documents.rg.formatted}
            onRegenerate={() => setDocuments(prev => ({ ...prev, rg: generateRG() }))}
          />
        </div>
      </section>

      <section className="card">
        <h2>Dados Pessoais</h2>
        <div className="card-content">
          <DataField 
            label="Nome" 
            value={person.nome}
            onRegenerate={() => setPerson(generatePerson())}
          />
          <DataField 
            label="Email" 
            value={person.email}
            onRegenerate={() => setPerson(generatePerson())}
          />
          <DataField 
            label="Telefone" 
            value={person.telefone}
            onRegenerate={() => setPerson(generatePerson())}
          />
          <DataField 
            label="Endereço" 
            value={`${person.endereco.rua}, ${person.endereco.numero}`}
            onRegenerate={() => setPerson(generatePerson())}
          />
          <DataField 
            label="Complemento" 
            value={person.endereco.complemento}
            onRegenerate={() => setPerson(generatePerson())}
          />
          <DataField 
            label="Bairro" 
            value={person.endereco.bairro}
            onRegenerate={() => setPerson(generatePerson())}
          />
          <DataField 
            label="Cidade/UF" 
            value={`${person.endereco.cidade}/${person.endereco.estado}`}
            onRegenerate={() => setPerson(generatePerson())}
          />
          <DataField 
            label="CEP" 
            value={person.endereco.cep}
            onRegenerate={() => setPerson(generatePerson())}
          />
        </div>
      </section>

      <section className="card">
        <h2>Cartão de Crédito</h2>
        <div className="card-content">
          <DataField 
            label="Número" 
            value={card.numero}
            onRegenerate={() => setCard(generateCreditCard())}
          />
          <DataField 
            label="Nome" 
            value={card.nome}
            onRegenerate={() => setCard(generateCreditCard())}
          />
          <DataField 
            label="Validade" 
            value={card.validade}
            onRegenerate={() => setCard(generateCreditCard())}
          />
          <DataField 
            label="CVV" 
            value={card.cvv}
            onRegenerate={() => setCard(generateCreditCard())}
          />
          <DataField 
            label="Bandeira" 
            value={card.bandeira}
            onRegenerate={() => setCard(generateCreditCard())}
          />
        </div>
      </section>

      <section className="card">
        <h2>Produto</h2>
        <div className="card-content">
          <DataField 
            label="Nome" 
            value={product.nome}
            onRegenerate={() => setProduct(generateProduct())}
          />
          <DataField 
            label="Descrição" 
            value={product.descricao}
            onRegenerate={() => setProduct(generateProduct())}
          />
          <DataField 
            label="Preço" 
            value={product.preco}
            onRegenerate={() => setProduct(generateProduct())}
          />
          <DataField 
            label="Categoria" 
            value={product.categoria}
            onRegenerate={() => setProduct(generateProduct())}
          />
          <DataField 
            label="Código" 
            value={product.codigo}
            onRegenerate={() => setProduct(generateProduct())}
          />
          <DataField 
            label="Fabricante" 
            value={product.fabricante}
            onRegenerate={() => setProduct(generateProduct())}
          />
        </div>
      </section>
    </div>
  );
}; 