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

        {/* Combined Password Configuration Section */}
        <div className="campo-item">
          <label htmlFor="password-length">Configurações da Senha</label>
          <div className="campo-valor password-config-container"> {/* Apply estilo de campo-valor aqui */}
            <input
              type="number"
              id="password-length"
              value={passwordLength}
              onChange={handleLengthChange}
              min="1"
              max="128"
              className="password-length-input" // New class for specific styling
              title="Tamanho da Senha (1-128)"
            />
            {/* Icon-only buttons for character types */}
            <button
              className={`option-toggle icon-only ${includeUppercase ? 'active' : ''}`}
              onClick={createToggleHandler(setIncludeUppercase)}
              title="Incluir Maiúsculas (ABC)"
            >
              <FaFont /> {/* Using FaFont as a placeholder for 'ABC' or similar */}
            </button>
            <button
              className={`option-toggle icon-only ${includeLowercase ? 'active' : ''}`}
              onClick={createToggleHandler(setIncludeLowercase)}
              title="Incluir Minúsculas (abc)"
            >
              {/* Need a different icon for lowercase, reusing FaFont or specific icon */}
              <span style={{fontFamily: 'monospace', fontSize: '0.9em'}}>abc</span>
            </button>
            <button
              className={`option-toggle icon-only ${includeNumbers ? 'active' : ''}`}
              onClick={createToggleHandler(setIncludeNumbers)}
              title="Incluir Números (123)"
            >
              <FaSortNumericDown />
            </button>
            <button
              className={`option-toggle icon-only ${includeSpecialChars ? 'active' : ''}`}
              onClick={createToggleHandler(setIncludeSpecialChars)}
              title="Incluir Caracteres Especiais (@#%)"
            >
              <FaHashtag />
            </button>
          </div>
        </div>
        
        <DataField
          label="Senha Gerada"
          value={password}
          onRegenerate={regeneratePassword}
          // isPassword={true} // This prop is not standard for DataField
          showMask={false}  // Ensure password is always visible
          onToggleMask={null} // Do not pass onToggleMask to hide the eye icon
          icon={<FaKey />}
        />
      </div>
    </section>
  );
};

export default ComplementaryDataCard;
