import React, { useState } from 'react';
import { useDataGenerator } from '../hooks/useDataGenerator';
import { toast } from 'react-toastify';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FaCopy, FaSync, FaMask, FaRedo } from 'react-icons/fa';

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
          <h2>Cartão de Crédito</h2>
        </div>
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
        <div className="card-header">
          <h2>Produto</h2>
        </div>
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