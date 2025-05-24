import React, { useState, useEffect, useCallback } from 'react';
import { 
  FaBuilding, FaRedo, FaKey, FaFont, FaHashtag, FaSortNumericDown, 
  FaToggleOn, FaToggleOff, FaBriefcase, FaUsers, FaSitemap, FaIndustry, FaShieldAlt
} from 'react-icons/fa';
import DataField from '../DataField';
import {
  generateCompanyName,
  generateDepartment,
  generateJobTitle,
  generateBusinessSector,
  generateNumEmployees,
  generatePassword as generatePasswordUtil, // Renamed to avoid conflict
} from '../../generators/companyData'; // Adjust path as needed

const ComplementaryDataCard = () => {
  const [company, setCompany] = useState('');
  const [department, setDepartment] = useState(''); // "Área" in the requirements
  const [role, setRole] = useState(''); // "Cargo"
  const [businessLine, setBusinessLine] = useState(''); // "Ramo de atuação"
  const [numEmployees, setNumEmployees] = useState('');

  const [passwordLength, setPasswordLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSpecialChars, setIncludeSpecialChars] = useState(true);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const regeneratePassword = useCallback(() => {
    const newPassword = generatePasswordUtil(passwordLength, {
      includeUppercase,
      includeLowercase,
      includeNumbers,
      includeSpecialChars,
    });
    setPassword(newPassword);
  }, [passwordLength, includeUppercase, includeLowercase, includeNumbers, includeSpecialChars]);

  const generateAllFields = useCallback(() => {
    setCompany(generateCompanyName());
    setDepartment(generateDepartment());
    setRole(generateJobTitle());
    setBusinessLine(generateBusinessSector());
    setNumEmployees(generateNumEmployees());
    regeneratePassword();
  }, [regeneratePassword]);

  useEffect(() => {
    generateAllFields();
  }, [generateAllFields]);

  useEffect(() => {
    regeneratePassword();
  }, [regeneratePassword]);

  const handleLengthChange = (e) => {
    const val = e.target.value;
    if (val === '' || (parseInt(val) >= 1 && parseInt(val) <= 128)) {
      setPasswordLength(val === '' ? '' : parseInt(val));
    }
  };
  
  const createToggleHandler = (setter) => () => setter(prev => !prev);

  return (
    <section className="card" id="dados-complementares">
      <div className="card-header">
        <h2><FaBriefcase className="header-icon" /> Dados Complementares</h2>
        <button
          className="generate-all-btn"
          onClick={generateAllFields}
          title="Gerar todos os dados complementares"
        >
          <FaRedo className="generate-icon" />
          Gerar tudo
        </button>
      </div>
      <div className="card-content">
        <DataField 
          label="Empresa" 
          value={company} 
          onRegenerate={() => setCompany(generateCompanyName())} 
          icon={<FaBuilding />}
        />
        <DataField 
          label="Área" 
          value={department} 
          onRegenerate={() => setDepartment(generateDepartment())}
          icon={<FaSitemap />}
        />
        <DataField 
          label="Cargo" 
          value={role} 
          onRegenerate={() => setRole(generateJobTitle())}
          icon={<FaUsers />} // Using FaUsers as a proxy for role/job title
        />
        <DataField 
          label="Ramo de Atuação" 
          value={businessLine} 
          onRegenerate={() => setBusinessLine(generateBusinessSector())}
          icon={<FaIndustry />}
        />
        <DataField 
          label="Nº Colaboradores" 
          value={numEmployees} 
          onRegenerate={() => setNumEmployees(generateNumEmployees())}
          icon={<FaUsers />}
        />

        <div className="section-divider" style={{ marginTop: '1rem', marginBottom: '1rem' }}>
          <FaShieldAlt /> Configurações da Senha
        </div>
        
        <div className="campo-item">
          <label htmlFor="password-length">Tamanho da Senha</label>
          <div className="campo-valor">
            <input
              type="number"
              id="password-length"
              value={passwordLength}
              onChange={handleLengthChange}
              min="1"
              max="128"
              className="number-input" 
              style={{ width: '80px', textAlign: 'center', flexGrow: 0, marginRight: '10px' }}
              placeholder=" "
            />
             <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)'}}> (1-128)</span>
          </div>
        </div>

        <div className="campo-item password-options">
          <label>Tipos de Caracteres</label>
          <div className="campo-valor options-group" style={{ justifyContent: 'space-around', flexWrap: 'wrap' }}>
            <button 
              className={`option-toggle ${includeLowercase && includeUppercase ? 'active' : ''}`}
              onClick={() => {
                const bothOff = !includeLowercase && !includeUppercase;
                const nextState = bothOff ? true : !(includeLowercase && includeUppercase);
                setIncludeLowercase(nextState);
                setIncludeUppercase(nextState);
              }}
              title="Incluir Maiúsculas e Minúsculas (Aa)"
            >
              <FaFont /> Aa
            </button>
            <button 
              className={`option-toggle ${includeNumbers ? 'active' : ''}`}
              onClick={createToggleHandler(setIncludeNumbers)}
              title="Incluir Números (123)"
            >
              <FaSortNumericDown /> 123
            </button>
            <button 
              className={`option-toggle ${includeSpecialChars ? 'active' : ''}`}
              onClick={createToggleHandler(setIncludeSpecialChars)}
              title="Incluir Caracteres Especiais (@#%)"
            >
              <FaHashtag /> @#%
            </button>
          </div>
        </div>
        
        <DataField
          label="Senha Gerada"
          value={password}
          onRegenerate={regeneratePassword}
          isPassword={true}
          showMask={!showPassword}
          onToggleMask={() => setShowPassword(prev => !prev)}
          icon={<FaKey />}
        />
      </div>
    </section>
  );
};

export default ComplementaryDataCard;
