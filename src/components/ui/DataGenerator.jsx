import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
import { useDataGenerator } from '../../hooks/useDataGenerator';
import useTextareaResize from '../../hooks/useTextareaResize';
import { useDocumentMasks } from '../../hooks/useDocumentMasks';
import { useDocuments } from '../../hooks/useDocuments';
import { usePersonalData } from '../../hooks/usePersonalData';
import { useCreditCard } from '../../hooks/useCreditCard';
import { useProduct } from '../../hooks/useProduct';
import { useRandomChars } from '../../hooks/useRandomChars';
import { useTextCounter } from '../../hooks/useTextCounter';
import { toast } from 'react-toastify';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useSettings, AVAILABLE_FEATURES } from '../../contexts/SettingsContext';
import {
  FaCopy,
  FaSync,
  FaRedo,
  FaTag,
  FaIdCard,
  FaUserAlt,
  FaGraduationCap,
  FaCreditCard,
  FaRandom,
  FaTimes,
  FaCalculator,
} from 'react-icons/fa';
import DataField from './DataField';

// Lazy loading dos componentes pesados
const ComplementaryDataCard = React.lazy(
  () => import('../cards/ComplementaryData/ComplementaryDataCard')
);
const FileGeneratorCard = React.lazy(
  () => import('../cards/FileGenerator/FileGeneratorCard')
);

import * as companyGenerators from '../../generators/companyData';

// Loading component para lazy loading
const LoadingSpinner = () => (
  <div className='card'>
    <div
      className='card-content'
      style={{ textAlign: 'center', padding: '2rem' }}
    >
      <div>Carregando...</div>
    </div>
  </div>
);

const CategoryTag = ({ category }) => {
  const handleCopy = () => {
    toast.success('Categoria copiada!');
  };

  return (
    <div className='category-tag'>
      <FaTag className='tag-icon' />
      <span className='tag-text'>{category}</span>
      <CopyToClipboard text={category} onCopy={handleCopy}>
        <FaCopy className='tag-copy-icon' title='Copiar categoria' />
      </CopyToClipboard>
    </div>
  );
};

CategoryTag.propTypes = {
  category: PropTypes.string.isRequired,
};

const CategoryCard = ({ category, children }) => (
  <section className='card'>
    <div className='card-header'>
      <h2>{category}</h2>
    </div>
    <div className='card-content'>{children}</div>
  </section>
);

CategoryCard.propTypes = {
  category: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

const DataGenerator = () => {
  useTextareaResize();
  const { isFeatureVisible } = useSettings();

  const {
    isLoading,
    error,
    generateCPF,
    generateCNPJ,
    generateRG,
    generatePerson,
  } = useDataGenerator();

  const { masks, toggleMask } = useDocumentMasks();
  const { documents, regenerateCPF, regenerateCNPJ, regenerateRG } =
    useDocuments();
  const { person, regenerateField, regenerateAllPersonData } =
    usePersonalData();
  const {
    card,
    cardConfig,
    eredeStatuses,
    handleCardConfigChange,
    regenerateCard,
  } = useCreditCard();
  const { product, regenerateProductField, regenerateAllProduct } =
    useProduct();
  const { randomChars, handleRandomCharsChange, handleClearLength } =
    useRandomChars();
  const { textCounter, handleTextChange, handleClearText } = useTextCounter();

  const allGeneratorFunctions = {
    generatePerson,
    generateCPF,
    generateCNPJ,
    generateRG,
    ...companyGenerators,
  };

  if (isLoading) {
    return <div>Carregando gerador de dados...</div>;
  }

  if (error) {
    return <div className='error'>{error}</div>;
  }

  const renderDocumentosCard = () => (
    <section className='card' id='documentos' data-testid='documentos-card'>
      <div className='card-header'>
        <h2>
          <FaIdCard className='header-icon' /> Documentos
        </h2>
      </div>
      <div className='card-content' data-testid='documentos-content'>
        <DataField
          label='CPF'
          value={documents.cpf.formatted}
          raw={documents.cpf.raw}
          showMask={masks.cpf}
          onRegenerate={regenerateCPF}
          onToggleMask={() => toggleMask('cpf')}
        />
        <DataField
          label='CNPJ'
          value={documents.cnpj.formatted}
          raw={documents.cnpj.raw}
          showMask={masks.cnpj}
          onRegenerate={regenerateCNPJ}
          onToggleMask={() => toggleMask('cnpj')}
        />
        <DataField
          label='RG'
          value={documents.rg.formatted}
          raw={documents.rg.raw}
          showMask={masks.rg}
          onRegenerate={regenerateRG}
          onToggleMask={() => toggleMask('rg')}
        />
      </div>
    </section>
  );

  const renderDadosPessoaisCard = () => (
    <section
      className='card'
      id='dados-pessoais'
      data-testid='dados-pessoais-card'
    >
      <div className='card-header'>
        <h2>
          <FaUserAlt className='header-icon' /> Dados pessoais
        </h2>
        <button
          className='generate-all-btn'
          onClick={regenerateAllPersonData}
          title='Gerar todos os dados pessoais novamente'
          data-testid='dados-pessoais-generate-all-btn'
        >
          <FaRedo className='generate-icon' /> Gerar tudo
        </button>
      </div>
      <div className='card-content' data-testid='dados-pessoais-content'>
        <DataField
          label='Nome'
          value={person.nome}
          onRegenerate={() => regenerateField('nome')}
        />
        <DataField
          label='E-mail'
          value={person.email}
          onRegenerate={() => regenerateField('nome')}
        />
        <DataField
          label='Telefone'
          value={person.telefone}
          onRegenerate={() => regenerateField('telefone')}
        />
        <DataField
          label='Endereço'
          value={person.endereco.rua}
          onRegenerate={() => regenerateField('endereco')}
        />
        <DataField
          label='Número'
          value={person.endereco.numero}
          onRegenerate={() => regenerateField('numero')}
        />
        <DataField
          label='Complemento'
          value={person.endereco.complemento}
          onRegenerate={() => regenerateField('complemento')}
        />
        <DataField
          label='Bairro'
          value={person.endereco.bairro}
          onRegenerate={() => regenerateField('bairro')}
        />
        <DataField
          label='Cidade'
          value={person.endereco.cidade}
          onRegenerate={() => regenerateField('cidade')}
        />
        <DataField
          label='UF'
          value={person.endereco.estado}
          onRegenerate={() => regenerateField('estado')}
        />
        <DataField
          label='CEP'
          value={person.endereco.cep}
          onRegenerate={() => regenerateField('cep')}
        />
      </div>
    </section>
  );

  const renderProdutoCard = () => (
    <section className='card' id='produto' data-testid='produto-card'>
      <div className='card-header'>
        <h2>
          <FaGraduationCap className='header-icon' /> Produto
        </h2>
        <button
          className='generate-all-btn'
          onClick={regenerateAllProduct}
          title='Gerar todos os dados do produto novamente'
          data-testid='produto-generate-all-btn'
        >
          <FaRedo className='generate-icon' /> Gerar tudo
        </button>
      </div>
      <div className='card-content' data-testid='produto-content'>
        <DataField
          label='Nome'
          value={product.nome}
          onRegenerate={() => regenerateProductField('nome')}
        />
        <DataField
          label='Descrição'
          value={product.descricao}
          onRegenerate={() => regenerateProductField('descricao')}
        />
        <div className='campo-item' data-testid='produto-categorias-field'>
          <div className='campo-label'>Categorias</div>
          <div className='campo-valor'>
            <div className='categories-container'>
              {product.categorias.map((categoria, index) => (
                <CategoryTag key={index} category={categoria} />
              ))}
            </div>
            <button
              type='button'
              className='icon-button regenerate'
              aria-label='Gerar novas categorias'
              onClick={() => regenerateProductField('categorias')}
              data-testid='produto-categorias-regenerate-btn'
            >
              <FaSync className='regenerate-icon' />
            </button>
          </div>
        </div>
      </div>
    </section>
  );

  const renderCartaoCard = () => (
    <section className='card' id='cartao' data-testid='cartao-card'>
      <div className='card-header'>
        <h2>
          <FaCreditCard className='header-icon' /> Cartão
        </h2>
        <div className='card-filters'>
          <select
            name='bandeira'
            value={cardConfig.bandeira}
            onChange={handleCardConfigChange}
            className='card-select'
            data-testid='cartao-bandeira-select'
          >
            <option value='visa'>Visa</option>
            <option value='mastercard'>Mastercard</option>
            <option value='amex'>American Express</option>
            <option value='elo'>Elo</option>
            <option value='erede'>Erede</option>
          </select>
          {cardConfig.bandeira.toLowerCase() === 'erede' ? (
            <select
              name='eredeStatus'
              value={cardConfig.eredeStatus}
              onChange={handleCardConfigChange}
              className='card-select erede-status-select'
              data-testid='cartao-erede-status-select'
              style={{ maxWidth: '200px' }}
            >
              {eredeStatuses.map(s => (
                <option key={s.status} value={s.status}>
                  {s.description}
                </option>
              ))}
            </select>
          ) : (
            <>
              <select
                name='tipo'
                value={cardConfig.tipo}
                onChange={handleCardConfigChange}
                className='card-select'
                data-testid='cartao-tipo-select'
              >
                <option value='credito'>Crédito</option>
                <option value='debito'>Débito</option>
                <option value='multiplo'>Múltiplo</option>
              </select>
              <button
                onClick={regenerateCard}
                className='generate-all-btn'
                data-testid='cartao-generate-btn'
              >
                <FaRedo className='generate-icon' /> Novo
              </button>
            </>
          )}
        </div>
      </div>
      <div className='card-content' data-testid='cartao-content'>
        <DataField
          label='Número'
          value={card.numeroFormatado}
          raw={card.numero}
        />
        <DataField label='Nome' value={card.nome} />
        <DataField label='Validade' value={card.validade} />
        <DataField label='CVV' value={card.cvv} />
      </div>
    </section>
  );

  const renderCaracteresCard = () => (
    <section className='card' id='caracteres' data-testid='caracteres-card'>
      <div className='card-header'>
        <h2>
          <FaRandom className='header-icon' /> Gerador de caracteres
        </h2>
        <div className='card-filters'>
          <div className='input-clearable'>
            <input
              id='caracteres-length'
              name='caracteresLength'
              type='number'
              min='1'
              max='99999'
              value={randomChars.length}
              onChange={handleRandomCharsChange}
              className='number-input'
              placeholder='Quantidade'
              data-testid='caracteres-length-input'
            />
            {randomChars.length && (
              <button
                type='button'
                className='icon-button clear-input-btn'
                tabIndex={-1}
                onClick={handleClearLength}
                aria-label='Limpar campo'
                data-testid='caracteres-clear-btn'
              >
                <FaTimes className='clear-icon' />
              </button>
            )}
          </div>
        </div>
      </div>
      <div className='card-content' data-testid='caracteres-content'>
        <DataField
          label='Caracteres gerados'
          value={randomChars.value}
          raw={randomChars.value}
        />
      </div>
    </section>
  );

  const renderContadorCard = () => (
    <section className='card' id='contador' data-testid='contador-card'>
      <div className='card-header'>
        <h2>
          <FaCalculator className='header-icon' /> Contador de caracteres
        </h2>
      </div>
      <div className='card-content' data-testid='contador-content'>
        <DataField
          label='Texto'
          value={textCounter.text}
          onTextChange={handleTextChange}
          isTextArea={true}
          onClear={handleClearText}
          showCopy={false}
        />
        <div className='campo-item' data-testid='contador-total-field'>
          <div className='campo-label'>Total de caracteres</div>
          <div className='campo-valor'>
            <span className='copyable' data-testid='contador-total-value'>
              {textCounter.count}
            </span>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <div className='row'>
      <div className='col-6'>
        <div className='card-stack'>
          {isFeatureVisible(AVAILABLE_FEATURES.DOCUMENTOS) &&
            renderDocumentosCard()}
          {isFeatureVisible(AVAILABLE_FEATURES.DADOS_PESSOAIS) &&
            renderDadosPessoaisCard()}
          {isFeatureVisible(AVAILABLE_FEATURES.FILE_GENERATOR) && (
            <Suspense fallback={<LoadingSpinner />}>
              <FileGeneratorCard generatorFunctions={allGeneratorFunctions} />
            </Suspense>
          )}
          {isFeatureVisible(AVAILABLE_FEATURES.DOCUMENTOS) &&
            renderDocumentosCard()}
          {isFeatureVisible(AVAILABLE_FEATURES.DADOS_PESSOAIS) &&
            renderDadosPessoaisCard()}
          {isFeatureVisible(AVAILABLE_FEATURES.FILE_GENERATOR) && (
            <Suspense fallback={<LoadingSpinner />}>
              <FileGeneratorCard generatorFunctions={allGeneratorFunctions} />
            </Suspense>
          )}
        </div>
      </div>

      <div className='col-6'>
        <div className='card-stack'>
          {isFeatureVisible(AVAILABLE_FEATURES.PRODUTO) && renderProdutoCard()}
          {isFeatureVisible(AVAILABLE_FEATURES.CARTAO) && renderCartaoCard()}
          {isFeatureVisible(AVAILABLE_FEATURES.CARACTERES) &&
            renderCaracteresCard()}
          {isFeatureVisible(AVAILABLE_FEATURES.CONTADOR) &&
            renderContadorCard()}
          {isFeatureVisible(AVAILABLE_FEATURES.DADOS_COMPLEMENTARES) && (
            <Suspense fallback={<LoadingSpinner />}>
              <ComplementaryDataCard />
            </Suspense>
          )}
          {isFeatureVisible(AVAILABLE_FEATURES.PRODUTO) && renderProdutoCard()}
          {isFeatureVisible(AVAILABLE_FEATURES.CARTAO) && renderCartaoCard()}
          {isFeatureVisible(AVAILABLE_FEATURES.CARACTERES) &&
            renderCaracteresCard()}
          {isFeatureVisible(AVAILABLE_FEATURES.CONTADOR) &&
            renderContadorCard()}
          {isFeatureVisible(AVAILABLE_FEATURES.DADOS_COMPLEMENTARES) && (
            <Suspense fallback={<LoadingSpinner />}>
              <ComplementaryDataCard />
            </Suspense>
          )}
        </div>
      </div>
    </div>
  );
};

export { DataGenerator };
export default DataGenerator;

DataGenerator.propTypes = {};
