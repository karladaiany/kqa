import { useState, useEffect, useCallback } from 'react';
import { encrypt, decrypt } from '../utils/crypto';
import { ArtiaService } from '../services/artiaService';

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
      activityStatus: '',
      activityArea: '',
      comment: '',
    };
  });

  const [showPassword, setShowPassword] = useState(false);
  const [activityData, setActivityData] = useState(null);
  const [loadingActivity, setLoadingActivity] = useState(false);
  const [activityError, setActivityError] = useState('');

  useEffect(() => {
    const dataToSave = {
      ...bugData,
      login: bugData.login ? encrypt(bugData.login) : '',
      password: bugData.password ? encrypt(bugData.password) : '',
    };
    localStorage.setItem('bugRegistration', JSON.stringify(dataToSave));
  }, [bugData]);

  const handleInputChange = useCallback((field, value) => {
    if (field === 'envId' && value.length > 7) return;
    setBugData(prev => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleClearField = useCallback(field => {
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
        activityStatus: '',
        activityArea: '',
        comment: '',
      });
      return;
    }

    setBugData(prev => ({
      ...prev,
      [field]: '',
    }));
  }, []);

  const handleToggleAttachment = useCallback(() => {
    setBugData(prev => ({
      ...prev,
      hasAttachment: !prev.hasAttachment,
    }));
  }, []);

  const formatEvidenceSection = () => {
    // Incluir seção de evidências apenas se houver algum conteúdo
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

  const handleCopyAll = async () => {
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

    // Adicionar dados da atividade se disponíveis
    if (bugData.activityStatus || bugData.activityArea) {
      plainText += `\n    :: Dados da Atividade ::
situação: ${bugData.activityStatus || 'N/A'}
área: ${bugData.activityArea || 'N/A'}`;
    }

    // Adicionar comentário se disponível
    if (bugData.comment) {
      plainText += `\n\n    :: Comentário ::
${bugData.comment}`;
    }

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

    // Adicionar dados da atividade se disponíveis
    if (bugData.activityStatus || bugData.activityArea) {
      htmlText += `<p>&nbsp;&nbsp;&nbsp;&nbsp;<b style="color: #DC3545;">:: Dados da Atividade ::</b><br>
<b>situação:</b> ${bugData.activityStatus || 'N/A'}<br>
<b>área:</b> ${bugData.activityArea || 'N/A'}</p>`;
    }

    // Adicionar comentário se disponível
    if (bugData.comment) {
      htmlText += `<p>&nbsp;&nbsp;&nbsp;&nbsp;<b style="color: #DC3545;">:: Comentário ::</b><br>
${bugData.comment.replace(/\n/g, '<br>')}</p>`;
    }

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

  // Função para buscar dados da atividade do Artia
  const fetchActivityData = useCallback(async (url) => {
    if (!url || !url.trim()) {
      setActivityData(null);
      setActivityError('');
      return;
    }

    setLoadingActivity(true);
    setActivityError('');

    try {
      // Extrair ID da atividade do link
      const { activityId, isValid, message } = ArtiaService.extractActivityIdFromUrl(url);
      
      if (!isValid) {
        setActivityError(message || 'Link inválido');
        setActivityData(null);
        return;
      }

      // Buscar dados da atividade
      const activity = await ArtiaService.viewActivity(activityId, bugData.accountId || 1);
      
      setActivityData(activity);
      setActivityError('');
      
      // Preencher automaticamente campos relevantes
      if (activity.title) {
        handleInputChange('incident', activity.title);
      }
      
      if (activity.customStatus?.statusName) {
        handleInputChange('activityStatus', activity.customStatus.statusName);
      }
      
      if (activity.customColumns) {
        // Extrair área dos campos customizados se disponível
        const areaField = activity.customColumns.find(field => 
          field.name?.toLowerCase().includes('área') || 
          field.name?.toLowerCase().includes('area')
        );
        if (areaField?.value) {
          handleInputChange('activityArea', areaField.value);
        }
      }
      
    } catch (error) {
      setActivityError(`Erro ao buscar atividade: ${error.message}`);
      setActivityData(null);
    } finally {
      setLoadingActivity(false);
    }
  }, [bugData.accountId, handleInputChange]);

  // Observar mudanças na URL para buscar dados da atividade
  useEffect(() => {
    const url = bugData.url?.trim();
    if (url && url.includes('app.artia.com')) {
      fetchActivityData(url);
    } else {
      setActivityData(null);
      setActivityError('');
    }
  }, [bugData.url, fetchActivityData]);

  return {
    bugData,
    showPassword,
    setShowPassword,
    handleInputChange,
    handleClearField,
    handleToggleAttachment,
    handleCopyAll,
    logBugData,
    activityData,
    loadingActivity,
    activityError,
    fetchActivityData,
  };
};
