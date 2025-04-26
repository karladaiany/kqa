import { useState, useEffect } from 'react';
import { encrypt, decrypt } from '../utils/crypto';

export const useBugRegistration = () => {
  const [bugData, setBugData] = useState(() => {
    const savedData = localStorage.getItem('bugRegistration');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      return {
        ...parsedData,
        login: parsedData.login ? decrypt(parsedData.login) : '',
        password: parsedData.password ? decrypt(parsedData.password) : ''
      };
    }
    return {
      incident: '',
      steps: '',
      expectedBehavior: '',
      url: '',
      login: '',
      password: '',
      envId: '',
      others: '',
      evidenceDescription: '',
      evidenceLink: '',
      hasAttachment: false
    };
  });

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const dataToSave = {
      ...bugData,
      login: bugData.login ? encrypt(bugData.login) : '',
      password: bugData.password ? encrypt(bugData.password) : ''
    };
    localStorage.setItem('bugRegistration', JSON.stringify(dataToSave));
  }, [bugData]);

  const handleInputChange = (field, value) => {
    if (field === 'envId' && value.length > 7) return;
    setBugData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleClearField = (field) => {
    if (field === 'all') {
      setBugData({
        incident: '',
        steps: '',
        expectedBehavior: '',
        url: '',
        login: '',
        password: '',
        envId: '',
        others: '',
        evidenceDescription: '',
        evidenceLink: '',
        hasAttachment: false
      });
      return;
    }

    setBugData(prev => ({
      ...prev,
      [field]: ''
    }));
  };

  const handleToggleAttachment = () => {
    setBugData(prev => ({
      ...prev,
      hasAttachment: !prev.hasAttachment
    }));
  };

  const formatEvidenceSection = () => {
    const evidences = [];
    
    if (bugData.evidenceDescription) {
      evidences.push(bugData.evidenceDescription);
    }
    
    if (bugData.evidenceLink) {
      evidences.push(`Link da evidência: ${bugData.evidenceLink}`);
    }
    
    if (bugData.hasAttachment) {
      evidences.push('Evidência em anexo na atividade');
    }

    return evidences.length > 0 ? evidences.join('\n') : '';
  };

  const handleCopyAll = () => {
    const evidenceSection = formatEvidenceSection();
    
    const formattedSteps = bugData.steps
      .split('\n')
      .map(step => `» ${step}`)
      .join('\n');
    
    const textToCopy = `    :: Incidente identificado ::
${bugData.incident}

    :: Passo a passo para reprodução ::
${formattedSteps}

    :: Comportamento esperado ::
${bugData.expectedBehavior}

    :: Informações ::
url: ${bugData.url}
login: ${bugData.login}
senha: ${bugData.password}
org_id: ${bugData.envId}
${bugData.others}

    :: Evidência(s) ::
${evidenceSection}`;

    navigator.clipboard.writeText(textToCopy);
  };

  return {
    bugData,
    showPassword,
    setShowPassword,
    handleInputChange,
    handleClearField,
    handleToggleAttachment,
    handleCopyAll
  };
}; 