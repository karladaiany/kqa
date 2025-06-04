import React, { useState, useEffect, useCallback } from 'react';
import {
  FaBuilding,
  FaRedo,
  FaKey,
  FaFont,
  FaHashtag,
  FaSortNumericDown,
  FaBriefcase,
  FaUsers,
  FaSitemap,
  FaIndustry,
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

  const regeneratePassword = useCallback(() => {
    const newPassword = generatePasswordUtil(passwordLength, {
      includeUppercase,
      includeLowercase,
      includeNumbers,
      includeSpecialChars,
    });
    setPassword(newPassword);
  }, [
    passwordLength,
    includeUppercase,
    includeLowercase,
    includeNumbers,
    includeSpecialChars,
  ]);

  const generateAllFields = useCallback(() => {
    setCompany(generateCompanyName());
    setDepartment(generateDepartment());
    setRole(generateJobTitle());
    setBusinessLine(generateBusinessSector());
    setNumEmployees(generateNumEmployees());
    const newPassword = generatePasswordUtil(passwordLength, {
      includeUppercase,
      includeLowercase,
      includeNumbers,
      includeSpecialChars,
    });
    setPassword(newPassword);
  }, [
    passwordLength,
    includeUppercase,
    includeLowercase,
    includeNumbers,
    includeSpecialChars,
  ]);

  useEffect(() => {
    generateAllFields();
  }, [generateAllFields]);

  useEffect(() => {
    if (!password) {
      regeneratePassword();
    }
  }, [password, regeneratePassword]);

  const handleLengthChange = e => {
    const val = e.target.value;
    if (val === '' || (parseInt(val) >= 1 && parseInt(val) <= 128)) {
      setPasswordLength(val === '' ? '' : parseInt(val));
    }
  };

  const createToggleHandler = setter => () => setter(prev => !prev);

  return (
    <section className='card' id='dados-complementares'>
      <div className='card-header'>
        <h2>
          <FaBriefcase className='header-icon' /> Dados complementares
        </h2>
        <button
          className='generate-all-btn'
          onClick={generateAllFields}
          title='Gerar todos os dados complementares'
        >
          <FaRedo className='generate-icon' />
          Gerar tudo
        </button>
      </div>
      <div className='card-content'>
        <DataField
          label='Empresa'
          value={company}
          onRegenerate={() => setCompany(generateCompanyName())}
          icon={<FaBuilding />}
        />
        <DataField
          label='Área'
          value={department}
          onRegenerate={() => setDepartment(generateDepartment())}
          icon={<FaSitemap />}
        />
        <DataField
          label='Cargo'
          value={role}
          onRegenerate={() => setRole(generateJobTitle())}
          icon={<FaUsers />} // Using FaUsers as a proxy for role/job title
        />
        <DataField
          label='Ramo de atuação'
          value={businessLine}
          onRegenerate={() => setBusinessLine(generateBusinessSector())}
          icon={<FaIndustry />}
        />
        <DataField
          label='Nº colaboradores'
          value={numEmployees}
          onRegenerate={() => setNumEmployees(generateNumEmployees())}
          icon={<FaUsers />}
        />

        {/* Combined Password Configuration Section */}
        <div className='campo-item'>
          <label htmlFor='password-length'>Configurações da senha</label>
          <div className='campo-valor'>
            <div className='password-config-container'>
              <input
                type='number'
                id='password-length'
                value={passwordLength}
                onChange={handleLengthChange}
                min='1'
                max='128'
                className='password-length-input'
                title='Tamanho da Senha (1-128)'
              />
              <button
                className={`option-toggle ${includeUppercase ? 'active' : ''}`}
                onClick={createToggleHandler(setIncludeUppercase)}
                title='Incluir Maiúsculas'
              >
                <FaFont style={{ marginRight: '4px' }} />
              </button>
              <button
                className={`option-toggle ${includeLowercase ? 'active' : ''}`}
                onClick={createToggleHandler(setIncludeLowercase)}
                title='Incluir Minúsculas'
              >
                <span>a</span>
              </button>
              <button
                className={`option-toggle ${includeNumbers ? 'active' : ''}`}
                onClick={createToggleHandler(setIncludeNumbers)}
                title='Incluir Números'
              >
                <FaSortNumericDown style={{ marginRight: '4px' }} />
              </button>
              <button
                className={`option-toggle ${
                  includeSpecialChars ? 'active' : ''
                }`}
                onClick={createToggleHandler(setIncludeSpecialChars)}
                title='Incluir Caracteres Especiais'
              >
                <FaHashtag style={{ marginRight: '4px' }} />
              </button>
            </div>
          </div>
        </div>

        <DataField
          label='Senha gerada'
          value={password}
          onRegenerate={regeneratePassword}
          // isPassword={true} // This prop is not standard for DataField
          showMask={false} // Ensure password is always visible
          onToggleMask={null} // Do not pass onToggleMask to hide the eye icon
          icon={<FaKey />}
        />
      </div>
    </section>
  );
};

export default ComplementaryDataCard;
