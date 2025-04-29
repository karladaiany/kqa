import React, { useState, useEffect, useCallback } from 'react';
import { useDataGenerator } from '../hooks/useDataGenerator';
import { toast } from 'react-toastify';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { 
  FaCopy, 
  FaSync, 
  FaMask, 
  FaRedo, 
  FaTag, 
  FaIdCard, 
  FaUserAlt,
  FaGraduationCap,
  FaCreditCard,
  FaRandom,
  FaTimes,
  FaCalculator,
  FaBug,
  FaComment,
  FaInfoCircle,
  FaCamera,
  FaPaperclip,
  FaBroom,
  FaEye,
  FaRocket
} from 'react-icons/fa';
import DataField from './DataField';
import { useBugRegistration } from '../hooks/useBugRegistration';

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

const FloatingNav = () => {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="floating-nav">
      <div className="floating-nav-item" onClick={() => scrollToSection('documentos')}>
        <FaIdCard /> Documentos
      </div>
      <div className="floating-nav-item" onClick={() => scrollToSection('dados-pessoais')}>
        <FaUserAlt /> Dados Pessoais
      </div>
      <div className="floating-nav-item" onClick={() => scrollToSection('produto')}>
        <FaGraduationCap /> Produtos
      </div>
      <div className="floating-nav-item" onClick={() => scrollToSection('cartao')}>
        <FaCreditCard /> Cartão
      </div>
      <div className="floating-nav-item" onClick={() => scrollToSection('caracteres')}>
        <FaRandom /> Gerador de Caracteres
      </div>
      <div className="floating-nav-item" onClick={() => scrollToSection('contador')}>
        <FaCalculator /> Contador de Caracteres
      </div>
      <div className="floating-nav-item" onClick={() => scrollToSection('bug')}>
        <FaBug /> Registro de BUG
      </div>
      <div className="floating-nav-item" onClick={() => scrollToSection('qa')}>
        <FaComment /> Comentário QA
      </div>
      <div className="floating-nav-item" onClick={() => scrollToSection('deploy')}>
        <FaRocket /> Deploy
      </div>
    </nav>
  );
};

const BugRegistrationCard = () => {
  const {
    bugData,
    showPassword,
    setShowPassword,
    handleInputChange,
    handleClearField,
    handleToggleAttachment,
    handleCopyAll
  } = useBugRegistration();

  return (
    <section className="card" id="bug">
      <div className="card-header">
        <h2><FaBug className="header-icon" /> Registro de BUG</h2>
      </div>
      <div className="card-content">
        <div className="campo-item">
          <label>Incidente identificado:</label>
          <div className="campo-valor" style={{ position: 'relative' }}>
            <textarea
              value={bugData.incident}
              onChange={(e) => handleInputChange('incident', e.target.value)}
              className="copyable"
              style={{ 
                width: '100%', 
                minHeight: '60px',
                resize: 'vertical',
                paddingRight: bugData.incident ? '30px' : '12px',
                color: 'var(--text-primary)'
              }}
            />
            {bugData.incident && (
              <FaTimes
                className="clear-icon"
                onClick={() => handleClearField('incident')}
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '8px',
                  cursor: 'pointer'
                }}
              />
            )}
          </div>
        </div>

        <div className="campo-item">
          <label>Passo a passo para reprodução:</label>
          <div className="campo-valor" style={{ position: 'relative' }}>
            <textarea
              value={bugData.steps}
              onChange={(e) => handleInputChange('steps', e.target.value)}
              className="copyable"
              style={{ 
                width: '100%', 
                minHeight: '100px',
                resize: 'vertical',
                paddingRight: bugData.steps ? '30px' : '12px',
                color: 'var(--text-primary)'
              }}
            />
            {bugData.steps && (
              <FaTimes
                className="clear-icon"
                onClick={() => handleClearField('steps')}
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '8px',
                  cursor: 'pointer'
                }}
              />
            )}
          </div>
        </div>

        <div className="campo-item">
          <label>Comportamento esperado:</label>
          <div className="campo-valor" style={{ position: 'relative' }}>
            <textarea
              value={bugData.expectedBehavior}
              onChange={(e) => handleInputChange('expectedBehavior', e.target.value)}
              className="copyable"
              style={{ 
                width: '100%', 
                minHeight: '60px',
                resize: 'vertical',
                paddingRight: bugData.expectedBehavior ? '30px' : '12px',
                color: 'var(--text-primary)'
              }}
            />
            {bugData.expectedBehavior && (
              <FaTimes
                className="clear-icon"
                onClick={() => handleClearField('expectedBehavior')}
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '8px',
                  cursor: 'pointer'
                }}
              />
            )}
          </div>
        </div>

        <div className="section-divider">
          <FaInfoCircle /> Informações
        </div>

        <div className="campo-item">
          <label>URL:</label>
          <div className="campo-valor" style={{ position: 'relative' }}>
            <input
              type="text"
              value={bugData.url}
              onChange={(e) => handleInputChange('url', e.target.value)}
              className="copyable"
              style={{ 
                width: '100%', 
                paddingRight: bugData.url ? '30px' : '12px',
                color: 'var(--text-primary)'
              }}
            />
            {bugData.url && (
              <FaTimes
                className="clear-icon"
                onClick={() => handleClearField('url')}
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  cursor: 'pointer'
                }}
              />
            )}
          </div>
        </div>

        <div className="campo-item">
          <label>Login:</label>
          <div className="campo-valor" style={{ position: 'relative' }}>
            <input
              type="text"
              value={bugData.login}
              onChange={(e) => handleInputChange('login', e.target.value)}
              className="copyable"
              style={{ 
                width: '100%', 
                paddingRight: bugData.login ? '30px' : '12px',
                color: 'var(--text-primary)'
              }}
            />
            {bugData.login && (
              <FaTimes
                className="clear-icon"
                onClick={() => handleClearField('login')}
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  cursor: 'pointer'
                }}
              />
            )}
          </div>
        </div>

        <div className="campo-item">
          <label>Senha:</label>
          <div className="campo-valor" style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={bugData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className="copyable"
              style={{ 
                width: '100%', 
                paddingRight: '60px',
                color: 'var(--text-primary)'
              }}
            />
            <FaEye
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '30px',
                top: '50%',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                color: showPassword ? 'var(--primary-color)' : 'var(--text-muted)'
              }}
            />
            {bugData.password && (
              <FaTimes
                className="clear-icon"
                onClick={() => handleClearField('password')}
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  cursor: 'pointer'
                }}
              />
            )}
          </div>
        </div>

        <div className="campo-item">
          <label>ID do ambiente:</label>
          <div className="campo-valor" style={{ position: 'relative' }}>
            <input
              type="number"
              value={bugData.envId}
              onChange={(e) => handleInputChange('envId', e.target.value)}
              className="copyable"
              style={{ 
                width: '100%', 
                paddingRight: bugData.envId ? '30px' : '12px',
                color: 'var(--text-primary)'
              }}
              max="9999999"
            />
            {bugData.envId && (
              <FaTimes
                className="clear-icon"
                onClick={() => handleClearField('envId')}
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  cursor: 'pointer'
                }}
              />
            )}
          </div>
        </div>

        <div className="campo-item">
          <label>Outros:</label>
          <div className="campo-valor" style={{ position: 'relative' }}>
            <textarea
              value={bugData.others}
              onChange={(e) => handleInputChange('others', e.target.value)}
              className="copyable"
              style={{ 
                width: '100%', 
                minHeight: '60px',
                resize: 'vertical',
                paddingRight: bugData.others ? '30px' : '12px',
                color: 'var(--text-primary)'
              }}
            />
            {bugData.others && (
              <FaTimes
                className="clear-icon"
                onClick={() => handleClearField('others')}
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '8px',
                  cursor: 'pointer'
                }}
              />
            )}
          </div>
        </div>

        <div className="section-divider">
          <FaCamera /> Evidências
        </div>

        <div className="campo-item">
          <label>Descrição da evidência:</label>
          <div className="campo-valor" style={{ position: 'relative' }}>
            <textarea
              value={bugData.evidenceDescription}
              onChange={(e) => handleInputChange('evidenceDescription', e.target.value)}
              className="copyable"
              style={{ 
                width: '100%', 
                minHeight: '60px',
                resize: 'vertical',
                paddingRight: bugData.evidenceDescription ? '30px' : '12px',
                color: 'var(--text-primary)'
              }}
            />
            {bugData.evidenceDescription && (
              <FaTimes
                className="clear-icon"
                onClick={() => handleClearField('evidenceDescription')}
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '8px',
                  cursor: 'pointer'
                }}
              />
            )}
          </div>
        </div>

        <div className="campo-item">
          <label>Link da evidência:</label>
          <div className="campo-valor" style={{ position: 'relative' }}>
            <input
              type="text"
              value={bugData.evidenceLink}
              onChange={(e) => handleInputChange('evidenceLink', e.target.value)}
              className="copyable"
              style={{ 
                width: '100%', 
                paddingRight: bugData.evidenceLink ? '30px' : '12px',
                color: 'var(--text-primary)'
              }}
            />
            {bugData.evidenceLink && (
              <FaTimes
                className="clear-icon"
                onClick={() => handleClearField('evidenceLink')}
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  cursor: 'pointer'
                }}
              />
            )}
          </div>
        </div>

        <div className="campo-item">
          <div 
            className={`attachment-toggle ${bugData.hasAttachment ? 'active' : ''}`}
            onClick={handleToggleAttachment}
          >
            <FaPaperclip /> Evidência em anexo na atividade
          </div>
        </div>

        <div className="card-actions" style={{ justifyContent: 'flex-start' }}>
          <button 
            className="generate-all-btn" 
            onClick={handleCopyAll}
            style={{ height: '36px', margin: '0 8px 0 0' }}
          >
            <FaCopy /> Copiar
          </button>
          <button 
            className="generate-all-btn" 
            onClick={() => handleClearField('all')}
            style={{ height: '36px' }}
          >
            <FaBroom /> Limpar tudo
          </button>
        </div>
      </div>
    </section>
  );
};

const DeployCard = () => {
  const [fields, setFields] = useState(() => {
    const savedFields = localStorage.getItem('deployFields');
    return savedFields ? JSON.parse(savedFields) : [];
  });

  const [fieldValues, setFieldValues] = useState(() => {
    const savedValues = localStorage.getItem('deployFieldValues');
    return savedValues ? JSON.parse(savedValues) : {};
  });

  useEffect(() => {
    localStorage.setItem('deployFields', JSON.stringify(fields));
  }, [fields]);

  useEffect(() => {
    localStorage.setItem('deployFieldValues', JSON.stringify(fieldValues));
  }, [fieldValues]);

  const formatDeployText = () => {
    let plainText = 'Gerar versão para deploy\n';
    
    let htmlText = `<div style="font-family: Verdana;">
      <p style="text-align: center; color: #9C27B0; font-family: Verdana;"><b>Gerar versão para deploy</b></p>`;
    
    // Primeiro bloco - Branch, PR principal, Feature flag e Runner
    const branchPrincipal = fields.find(f => f.label === 'Branch principal');
    const prPrincipal = fields.find(f => f.label === 'PR principal');
    const featureFlag = fields.find(f => f.label === 'Feature flag');
    const runner = fields.find(f => f.label === 'Runner');

    let firstBlockContent = '';
    if (branchPrincipal && fieldValues[branchPrincipal.id]) {
      firstBlockContent += `<b>Branch principal:</b> ${fieldValues[branchPrincipal.id]}<br>`;
      plainText += `Branch principal: ${fieldValues[branchPrincipal.id]}\n`;
    }
    if (prPrincipal && fieldValues[prPrincipal.id]) {
      firstBlockContent += `<b>PR principal:</b> <a href="${fieldValues[prPrincipal.id]}" style="color: #0000FF;">${fieldValues[prPrincipal.id]}</a><br>`;
      plainText += `PR principal: ${fieldValues[prPrincipal.id]}\n`;
    }
    if (featureFlag && fieldValues[featureFlag.id]) {
      firstBlockContent += `<b>Feature flag:</b> ${fieldValues[featureFlag.id]}<br>`;
      plainText += `Feature flag: ${fieldValues[featureFlag.id]}\n`;
    }
    if (runner && fieldValues[runner.id]) {
      firstBlockContent += `<b>Runner:</b> ${fieldValues[runner.id]}`;
      plainText += `Runner: ${fieldValues[runner.id]}\n`;
    }

    if (firstBlockContent) {
      // Remove o último <br> se o último item for o Runner
      if (runner && fieldValues[runner.id]) {
        htmlText += `<p>${firstBlockContent}</p>`;
      } else {
        // Remove o último <br> se o Runner não estiver presente
        htmlText += `<p>${firstBlockContent.replace(/<br>$/, '')}</p>`;
      }

      // Separador com linha horizontal mais grossa
      plainText += '━'.repeat(70) + '\n';
      htmlText += `<p>${'━'.repeat(70)}</p>`;
    }

    // Blocos de Título, Link e PR
    const titulos = fields.filter(f => f.label === 'Título');
    const links = fields.filter(f => f.label === 'Link');
    const prs = fields.filter(f => f.label === 'PR');

    for (let i = 0; i < Math.max(titulos.length, links.length, prs.length); i++) {
      let blockContent = '';
      
      if (titulos[i] && fieldValues[titulos[i].id]) {
        blockContent += `<b>Título:</b> ${fieldValues[titulos[i].id]}<br>`;
        plainText += `Título: ${fieldValues[titulos[i].id]}\n`;
      }
      if (links[i] && fieldValues[links[i].id]) {
        blockContent += `<b>Link:</b> <a href="${fieldValues[links[i].id]}" style="color: #0000FF;">${fieldValues[links[i].id]}</a><br>`;
        plainText += `Link: ${fieldValues[links[i].id]}\n`;
      }
      if (prs[i] && fieldValues[prs[i].id]) {
        blockContent += `<b>PR:</b> <a href="${fieldValues[prs[i].id]}" style="color: #0000FF;">${fieldValues[prs[i].id]}</a>`;
        plainText += `PR: ${fieldValues[prs[i].id]}\n`;
      }

      if (blockContent) {
        // Remove o último <br> do bloco
        htmlText += `<p>${blockContent.replace(/<br>$/, '')}</p>`;
        if (i < Math.max(titulos.length, links.length, prs.length) - 1) {
          plainText += '\n';
        }
      }
    }

    htmlText += '</div>';
    return { plainText, htmlText };
  };

  const handleCopy = async () => {
    const { plainText, htmlText } = formatDeployText();
    
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/plain': new Blob([plainText], { type: 'text/plain' }),
          'text/html': new Blob([htmlText], { type: 'text/html' })
        })
      ]);
      toast.success('Texto copiado com formatação!');
    } catch (err) {
      try {
        await navigator.clipboard.writeText(plainText);
        toast.success('Texto copiado (sem formatação)');
      } catch (err) {
        toast.error('Erro ao copiar texto. Tente novamente.');
      }
    }
  };

  const addBranchAndPRFields = () => {
    const newFields = [
      { type: 'text', label: 'Branch principal', id: `branch-principal-${Date.now()}` },
      { type: 'text', label: 'PR principal', id: `pr-principal-${Date.now()}` }
    ];
    setFields([...fields, ...newFields]);
  };

  const addFeatureFlagField = () => {
    const newField = { type: 'text', label: 'Feature flag', id: `feature-flag-${Date.now()}` };
    setFields([...fields, newField]);
  };

  const addRunnerField = () => {
    const newField = { type: 'text', label: 'Runner', id: `runner-${Date.now()}` };
    setFields([...fields, newField]);
  };

  const addTitleLinkPRFields = () => {
    const newFields = [
      { type: 'text', label: 'Título', id: `titulo-${Date.now()}` },
      { type: 'text', label: 'Link', id: `link-${Date.now()}` },
      { type: 'text', label: 'PR', id: `pr-${Date.now()}` }
    ];
    setFields([...fields, ...newFields]);
  };

  const handleInputChange = (id, value) => {
    setFieldValues(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const removeField = (idToRemove) => {
    setFields(fields.filter(field => field.id !== idToRemove));
    setFieldValues(prev => {
      const newValues = { ...prev };
      delete newValues[idToRemove];
      return newValues;
    });
    toast.success('Campo removido com sucesso!');
  };

  const handleClearAll = () => {
    setFields([]);
    setFieldValues({});
    localStorage.removeItem('deployFields');
    localStorage.removeItem('deployFieldValues');
    toast.success('Todos os campos foram limpos!');
  };

  return (
    <section className="card" id="deploy">
      <div className="card-header">
        <h2><FaRocket className="header-icon" /> Deploy</h2>
        <div className="card-filters">
          <button className="generate-all-btn" onClick={addBranchAndPRFields}>
            ➕ Branch e PR
          </button>
          <button className="generate-all-btn" onClick={addFeatureFlagField}>
            ➕ Feature flag
          </button>
          <button className="generate-all-btn" onClick={addRunnerField}>
            ➕ Runner
          </button>
          <button className="generate-all-btn" onClick={addTitleLinkPRFields}>
            ➕ Título, Link e PR
          </button>
        </div>
      </div>
      <div className="card-content">
        {fields.map((field) => (
          <div key={field.id} className="campo-item">
            <label>{field.label}:</label>
            <div className="campo-valor" style={{ position: 'relative' }}>
              <textarea
                value={fieldValues[field.id] || ''}
                onChange={(e) => handleInputChange(field.id, e.target.value)}
                className="copyable"
                style={{ 
                  width: '100%', 
                  height: '24px',
                  minHeight: 'unset',
                  resize: 'none',
                  paddingRight: fieldValues[field.id] ? '30px' : '12px',
                  color: 'var(--text-primary)',
                  paddingTop: '2px',
                  paddingBottom: '2px',
                  overflow: 'hidden',
                  lineHeight: '24px'
                }}
                rows="1"
              />
              {fieldValues[field.id] && (
                <FaTimes
                  className="clear-icon"
                  onClick={() => removeField(field.id)}
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    cursor: 'pointer'
                  }}
                />
              )}
            </div>
          </div>
        ))}
        <div className="card-actions" style={{ justifyContent: 'flex-start', marginTop: '16px', gap: '8px' }}>
          {fields.length > 0 && (
            <>
              <button 
                className="generate-all-btn" 
                onClick={handleCopy}
                style={{ height: '36px' }}
              >
                <FaCopy /> Copiar
              </button>
              <button 
                className="generate-all-btn" 
                onClick={handleClearAll}
                style={{ height: '36px' }}
              >
                <FaBroom /> Limpar tudo
              </button>
            </>
          )}
        </div>
      </div>
    </section>
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
    gerarCEPValido,
    generateRandomChars
  } = useDataGenerator();

  const [documents, setDocuments] = useState({
    cpf: generateCPF(),
    cnpj: generateCNPJ(),
    rg: generateRG()
  });

  const [masks, setMasks] = useState(() => {
    const savedMasks = localStorage.getItem('document-masks');
    return savedMasks ? JSON.parse(savedMasks) : {
      cpf: true,
      cnpj: true,
      rg: true
    };
  });

  const [person, setPerson] = useState(generatePerson());
  const [card, setCard] = useState(generateCreditCard());
  const [product, setProduct] = useState(generateProduct());

  const [cardConfig, setCardConfig] = useState({
    bandeira: 'visa',
    tipo: 'credito'
  });

  const [randomChars, setRandomChars] = useState({
    length: '',
    value: ''
  });

  const [textCounter, setTextCounter] = useState({
    text: '',
    count: 0
  });

  const toggleMask = (field) => {
    setMasks(prev => {
      const newMasks = {
        ...prev,
        [field]: !prev[field]
      };
      localStorage.setItem('document-masks', JSON.stringify(newMasks));
      return newMasks;
    });
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

  const handleRandomCharsChange = (e) => {
    const value = e.target.value;
    // Permite campo vazio ou números positivos
    if (value === '' || (parseInt(value) > 0 && parseInt(value) <= 9999999)) {
      setRandomChars(prev => ({
        ...prev,
        length: value
      }));
    }
  };

  const handleClearLength = () => {
    setRandomChars(prev => ({
      ...prev,
      length: ''
    }));
  };

  const generateNewRandomChars = () => {
    // Só gera se houver um número válido
    if (randomChars.length && parseInt(randomChars.length) > 0) {
      setRandomChars(prev => ({
        ...prev,
        value: generateRandomChars(parseInt(prev.length))
      }));
    }
  };

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setTextCounter({
      text: newText,
      count: newText.length
    });
  };

  const handleClearText = () => {
    setTextCounter({
      text: '',
      count: 0
    });
  };

  useEffect(() => {
    // Só gera automaticamente se houver um número válido
    if (randomChars.length && parseInt(randomChars.length) > 0) {
      generateNewRandomChars();
    } else {
      // Limpa o valor gerado se o comprimento não for válido
      setRandomChars(prev => ({
        ...prev,
        value: ''
      }));
    }
  }, [randomChars.length]);

  if (isLoading) {
    return <div>Carregando gerador de dados...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="data-generator">
      <FloatingNav />
      <section className="card" id="documentos">
        <div className="card-header">
          <h2><FaIdCard className="header-icon" /> Documentos</h2>
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

      <section className="card" id="dados-pessoais">
        <div className="card-header">
          <h2><FaUserAlt className="header-icon" /> Dados Pessoais</h2>
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

      <section className="card" id="produto">
        <div className="card-header">
          <h2><FaGraduationCap className="header-icon" /> Produto</h2>
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

      <section className="card" id="cartao">
        <div className="card-header">
          <h2><FaCreditCard className="header-icon" /> Cartão</h2>
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

      <section className="card" id="caracteres">
        <div className="card-header">
          <h2><FaRandom className="header-icon" /> Gerador de caracteres</h2>
          <div className="card-filters">
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <input
                type="number"
                min="1"
                max="9999999"
                value={randomChars.length}
                onChange={handleRandomCharsChange}
                className="number-input"
                style={{ 
                  width: '120px',
                  height: '36px',
                  padding: '0 28px 0 12px'
                }}
              />
              {randomChars.length && (
                <FaTimes
                  className="clear-icon"
                  onClick={handleClearLength}
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    cursor: 'pointer',
                    color: 'var(--text-secondary)',
                    fontSize: '14px'
                  }}
                />
              )}
            </div>
            <button 
              onClick={generateNewRandomChars}
              className="generate-all-btn"
            >
              <FaRedo className="generate-icon" /> Gerar
            </button>
          </div>
        </div>
        <div className="card-content">
          <DataField 
            label="Caracteres" 
            value={randomChars.value}
            rawValue={randomChars.value}
          />
        </div>
      </section>

      <section className="card" id="contador">
        <div className="card-header">
          <h2><FaCalculator className="header-icon" /> Contador de caracteres</h2>
        </div>
        <div className="card-content">
          <div className="campo-item">
            <div className="campo-valor" style={{ position: 'relative' }}>
              <textarea
                value={textCounter.text}
                onChange={handleTextChange}
                className="number-input"
                placeholder="Cole seu texto aqui..."
                style={{
                  width: '100%',
                  minHeight: '100px',
                  resize: 'vertical',
                  padding: '12px 28px 12px 12px',
                  fontFamily: 'var(--font-primary)'
                }}
              />
              {textCounter.text && (
                <FaTimes
                  className="clear-icon"
                  onClick={handleClearText}
                  style={{
                    position: 'absolute',
                    right: '24px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    cursor: 'pointer',
                    color: 'var(--text-secondary)',
                    fontSize: '14px',
                    zIndex: 1
                  }}
                />
              )}
            </div>
          </div>
          <div className="campo-item">
            <label>Total de caracteres:</label>
            <div className="campo-valor">
              <span className="copyable" style={{ textAlign: 'center' }}>
                {textCounter.count}
              </span>
            </div>
          </div>
        </div>
      </section>

      <BugRegistrationCard />

      <section className="card" id="qa">
        {/* ... rest of the existing code ... */}
      </section>

      <DeployCard />
    </div>
  );
};

export { DataGenerator };
export default DataGenerator; 