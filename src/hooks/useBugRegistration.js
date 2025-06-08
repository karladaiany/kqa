import { useState, useEffect, useCallback } from 'react';
import { encrypt, decrypt } from '../utils/crypto';

export const useBugRegistration = () => {
  const [bugData, setBugData] = useState(() => {
    const savedData = localStorage.getItem('bugRegistration');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      return {
        ...parsedData,
        login: parsedData.login ? decrypt(parsedData.login) : '',
        password: parsedData.password ? decrypt(parsedData.password) : '',
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
      hasAttachment: false,
    };
  });

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const dataToSave = {
      ...bugData,
      login: bugData.login ? encrypt(bugData.login) : '',
      password: bugData.password ? encrypt(bugData.password) : '',
    };
    localStorage.setItem('bugRegistration', JSON.stringify(dataToSave));
  }, [bugData]);

  const handleInputChange = (field, value) => {
    if (field === 'envId' && value.length > 7) return;
    setBugData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleClearField = field => {
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
        hasAttachment: false,
      });
      return;
    }

    setBugData(prev => ({
      ...prev,
      [field]: '',
    }));
  };

  const handleToggleAttachment = () => {
    setBugData(prev => ({
      ...prev,
      hasAttachment: !prev.hasAttachment,
    }));
  };

  const formatEvidenceSection = () => {
    // If evidenceLink is empty, the entire evidence section is omitted
    if (!bugData.evidenceLink) {
      return '';
    }

    const evidences = [];
    if (bugData.evidenceDescription) {
      evidences.push(bugData.evidenceDescription);
    }
    // evidenceLink is guaranteed to be non-empty here
    evidences.push(`Link da evidência: ${bugData.evidenceLink}`);

    if (bugData.hasAttachment) {
      evidences.push('Evidência em anexo na atividade');
    }

    // If evidenceLink is present, join collected evidences.
    // This will always include at least the link.
    return evidences.join('\n');
  };

  const handleCopyAll = async () => {
    // Prevent copying if evidenceLink is empty
    if (!bugData.evidenceLink) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Copy action aborted: evidenceLink is empty.');
      }
      return;
    }

    const evidenceSectionContent = formatEvidenceSection();

    const formattedSteps = bugData.steps
      .split('\n')
      .map(step => `» ${step}`)
      .join('\n');

    // Texto plano (sem formatação)
    let plainText = `    :: Incidente identificado ::
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
${bugData.others}`;

    if (evidenceSectionContent) {
      plainText += `\n\n    :: Evidência(s) ::\n${evidenceSectionContent}`;
    }

    // HTML formatado (com negrito, fonte e espaçamento)
    let htmlText = `<div style="font-family: Verdana;">
<p>&nbsp;&nbsp;&nbsp;&nbsp;<b style="color: #DC3545;">:: Incidente identificado ::</b><br>
${bugData.incident}</p>

<p>&nbsp;&nbsp;&nbsp;&nbsp;<b style="color: #DC3545;">:: Passo a passo para reprodução ::</b><br>
${formattedSteps.replace(/\n/g, '<br>')}</p>

<p>&nbsp;&nbsp;&nbsp;&nbsp;<b style="color: #DC3545;">:: Comportamento esperado ::</b><br>
${bugData.expectedBehavior}</p>

<p>&nbsp;&nbsp;&nbsp;&nbsp;<b style="color: #DC3545;">:: Informações ::</b><br>
<b>url:</b> ${bugData.url}<br>
<b>login:</b> ${bugData.login}<br>
<b>senha:</b> ${bugData.password}<br>
<b>org_id:</b> ${bugData.envId}<br>
${bugData.others}</p>`;

    if (evidenceSectionContent) {
      htmlText += `\n<p>&nbsp;&nbsp;&nbsp;&nbsp;<b style="color: #DC3545;">:: Evidência(s) ::</b><br>${evidenceSectionContent.replace(/\n/g, '<br>')}</p>`;
    }

    htmlText += '</div>';

    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/plain': new Blob([plainText.trim()], { type: 'text/plain' }),
          'text/html': new Blob([htmlText.trim()], { type: 'text/html' }),
        }),
      ]);
    } catch (err) {
      try {
        await navigator.clipboard.writeText(plainText.trim());
      } catch (err) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Failed to copy to clipboard:', err);
        }
      }
    }
  };

  const logBugData = useCallback(formData => {
    if (process.env.NODE_ENV === 'development') {
      console.error('Bug registration data:', formData);
    }
  }, []);

  return {
    bugData,
    showPassword,
    setShowPassword,
    handleInputChange,
    handleClearField,
    handleToggleAttachment,
    handleCopyAll,
    logBugData,
  };
};
