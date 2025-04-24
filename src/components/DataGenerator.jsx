import React, { useState } from 'react';
import { useDataGenerator } from '../hooks/useDataGenerator';
import { toast } from 'react-toastify';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FaCopy, FaSync, FaMask } from 'react-icons/fa';

const DataField = ({ label, value, raw, onRegenerate, onToggleMask, showMask = true }) => {
  const handleCopy = () => {
    toast.success('Copiado para a área de transferência!');
  };

  return (
    <div className="campo-item">
      <label>{label}:</label>
      <div className="campo-valor">
        <CopyToClipboard text={showMask ? value : raw} onCopy={handleCopy}>
          <span className="copyable">{showMask ? value : raw}</span>
        </CopyToClipboard>
        <CopyToClipboard text={showMask ? value : raw} onCopy={handleCopy}>
          <FaCopy className="copy-icon" title="Copiar" />
        </CopyToClipboard>
        {onRegenerate && (
          <FaSync 
            className="regenerate-icon" 
            title="Gerar novo"
            onClick={onRegenerate}
          />
        )}
        {onToggleMask && (
          <FaMask
            className={`mask-icon ${showMask ? 'active' : ''}`}
            title={showMask ? "Remover máscara" : "Aplicar máscara"}
            onClick={onToggleMask}
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

  const [masks, setMasks] = useState({
    cpf: true,
    cnpj: true,
    rg: true
  });

  const [person, setPerson] = useState(generatePerson());
  const [card, setCard] = useState(generateCreditCard());
  const [product, setProduct] = useState(generateProduct());

  const toggleMask = (field) => {
    setMasks(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
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
        <h2>Documentos</h2>
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
            value={person.endereco.rua}
            onRegenerate={() => setPerson(generatePerson())}
          />
          <DataField 
            label="Número" 
            value={person.endereco.numero}
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
            label="Cidade" 
            value={person.endereco.cidade}
            onRegenerate={() => setPerson(generatePerson())}
          />
          <DataField 
            label="UF" 
            value={person.endereco.estado}
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