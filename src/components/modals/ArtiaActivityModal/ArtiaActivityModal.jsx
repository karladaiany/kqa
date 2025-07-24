import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  FaTimes,
  FaEye,
  FaEyeSlash,
  FaSpinner,
  FaRocket,
  FaLock,
  FaClipboardList,
  FaLink,
  FaCheck,
  FaExclamationTriangle,
  FaCog,
  FaThumbtack,
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import {
  ACTIVITY_TYPES,
  ACTIVITY_FIELDS,
  FUNCIONALIDADE_OPTIONS,
  CUSTOM_STATUS_OPTIONS,
  DEFAULT_CUSTOM_STATUS_ID,
} from '../../../constants/artiaOptions';
import { ArtiaService } from '../../../services/artiaService';
import ActivityHistoryCard from './ActivityHistoryCard';
import { useSettings } from '../../../contexts/SettingsContext';
import './ArtiaActivityModal.css';

// Hook para debounce
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Função para gerar template do título baseado no tipo
const generateTitleTemplate = type => {
  if (type === ACTIVITY_TYPES.DEPLOY) {
    const today = new Date();
    const day = today.getDate().toString().padStart(2, '0');
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    return `[] Gerar versão para deploy (${day}/${month})`;
  } else if (
    type === ACTIVITY_TYPES.BUG_PRODUCAO ||
    type === ACTIVITY_TYPES.BUG_RETRABALHO
  ) {
    return '';
  }
  return '';
};

// Função para obter as configurações da badge baseado no tipo
const getActivityTypeToggleBadge = type => {
  const badgeConfig = {
    [ACTIVITY_TYPES.DEPLOY]: {
      text: 'Deploy',
      cssClass: 'deploy',
    },
    [ACTIVITY_TYPES.BUG_RETRABALHO]: {
      text: 'Bug retrabalho',
      cssClass: 'bug-retrabalho',
    },
    [ACTIVITY_TYPES.BUG_PRODUCAO]: {
      text: 'Bug produção',
      cssClass: 'bug-producao',
    },
  };

  return badgeConfig[type] || null;
};

// Função para obter as configurações da badge baseado no status customizado
const getCustomStatusToggleBadge = statusId => {
  const badgeConfig = {
    246888: {
      // Não iniciado
      text: 'Não iniciado',
      cssClass: 'nao-iniciado',
    },
    246886: {
      // Backlog
      text: 'Backlog',
      cssClass: 'backlog',
    },
    246887: {
      // Backlog Programado
      text: 'Backlog Programado',
      cssClass: 'backlog-programado',
    },
    246895: {
      // Triagem
      text: 'Triagem',
      cssClass: 'triagem',
    },
  };

  return badgeConfig[statusId] || null;
};

// Função para extrair IDs do link do Artia
const extractIdsFromArtiaLink = link => {
  if (!link || typeof link !== 'string') {
    return { accountId: '', folderId: '', isValid: false };
  }

  try {
    // Regex para capturar ID da conta após 'a/' e ID da pasta após 'f/'
    const accountMatch = link.match(/\/a\/(\d+)/);
    const folderMatch = link.match(/\/f\/(\d+)/);

    const accountId = accountMatch ? accountMatch[1] : '';
    const folderId = folderMatch ? folderMatch[1] : '';

    const isValid = !!(accountId && folderId);

    return { accountId, folderId, isValid };
  } catch (error) {
    return { accountId: '', folderId: '', isValid: false };
  }
};

// Função para validar se é um link válido do Artia
const validateArtiaLink = link => {
  if (!link) return { isValid: true, message: '' }; // Link vazio é válido (opcional)

  try {
    const url = new URL(link);

    // Verificar se contém domínio do Artia
    if (!url.hostname.includes('artia.com')) {
      return {
        isValid: false,
        message: 'Link deve ser do domínio artia.com',
      };
    }

    // Verificar se contém a/ e f/
    if (!link.includes('/a/') || !link.includes('/f/')) {
      return {
        isValid: false,
        message: 'Link deve conter ID do grupo (/a/) e ID da pasta (/f/)',
      };
    }

    const { accountId, folderId } = extractIdsFromArtiaLink(link);
    if (!accountId || !folderId) {
      return {
        isValid: false,
        message: 'Não foi possível extrair os IDs do link',
      };
    }

    return { isValid: true, message: '' };
  } catch {
    return {
      isValid: false,
      message: 'Link inválido',
    };
  }
};

const getInitialPinState = (fieldName) => {
  if (typeof window === 'undefined') return false;
  try {
    const pins = JSON.parse(localStorage.getItem('activityPinToggles') || '{}');
    return !!pins[fieldName];
  } catch {
    return false;
  }
};

const setPinState = (fieldName, value) => {
  try {
    const pins = JSON.parse(localStorage.getItem('activityPinToggles') || '{}');
    pins[fieldName] = value;
    localStorage.setItem('activityPinToggles', JSON.stringify(pins));
  } catch (e) {
    // Silencia o erro propositalmente
  }
};

// Função auxiliar para obter a chave do localStorage conforme o tipo de atividade
const getModalStorageKey = (activityType) => {
  if (activityType === 'deploy') return 'artiaModalData_deploy';
  if (activityType === 'bug') return 'artiaModalData_bug';
  return 'artiaModalData';
};

const ArtiaActivityModal = ({
  isOpen,
  onClose,
  activityType,
  initialData = {},
}) => {
  const { artiaCredentials, hasArtiaCredentials } = useSettings();

  const storageKey = useMemo(() => getModalStorageKey(activityType), [activityType]);

  const [formData, setFormData] = useState(() => {
    // Carregar dados salvos do localStorage (exceto credenciais)
    const savedData = localStorage.getItem(storageKey);
    const defaultData = {
      titulo: '',
      tipo: '',
      accountId: '',
      folderId: '',
      artiaLink: '',
      funcionalidade: '',
      subFuncionalidade: '',
      responsibleId: '',
      customStatusId: DEFAULT_CUSTOM_STATUS_ID,
      ...initialData,
    };

    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        // Não carregar credenciais do localStorage, usar do hook de configurações
        const { login, senha, ...otherData } = parsed;
        return { ...defaultData, ...otherData };
      } catch (error) {
        return defaultData;
      }
    }

    return defaultData;
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [subFuncionalidadeOptions, setSubFuncionalidadeOptions] = useState([]);

  // Estados para validação e feedback do link
  const [linkValidation, setLinkValidation] = useState({
    isValid: true,
    message: '',
  });
  const [linkExtracted, setLinkExtracted] = useState(false);
  const [shouldHideIdFields, setShouldHideIdFields] = useState(false);

  // Estado para histórico de atividades criadas
  const [createdActivities, setCreatedActivities] = useState(() => {
    const saved = localStorage.getItem('artiaActivitiesHistory');
    return saved ? JSON.parse(saved) : [];
  });

  // Estado dos pinos
  const [pinToggles, setPinToggles] = useState(() => ({
    prioridade: getInitialPinState('prioridade'),
    funcionalidade: getInitialPinState('funcionalidade'),
    subFuncionalidade: getInitialPinState('subFuncionalidade'),
  }));

  const handleTogglePin = (fieldName) => {
    setPinToggles((prev) => {
      const updated = { ...prev, [fieldName]: !prev[fieldName] };
      setPinState(fieldName, updated[fieldName]);
      return updated;
    });
  };

  // Definir tipos disponíveis baseado na origem
  const availableTypes =
    activityType === 'bug'
      ? [ACTIVITY_TYPES.BUG_PRODUCAO, ACTIVITY_TYPES.BUG_RETRABALHO]
      : [ACTIVITY_TYPES.DEPLOY];

  // Debounce para salvar dados no localStorage (exceto credenciais)
  const debouncedFormData = useDebounce(formData, 800);

  // Verificar se as credenciais estão configuradas
  useEffect(() => {
    if (isOpen && !hasArtiaCredentials()) {
      toast.error(
        'Credenciais do Artia não configuradas. Configure-as nas configurações.',
        { autoClose: 5000 }
      );
    }
  }, [isOpen, hasArtiaCredentials]);

  // Bloquear scroll da página quando modal está aberto
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');

      // Se for deploy, já seleciona automaticamente
      if (activityType === 'deploy') {
        setFormData(prev => ({
          ...prev,
          tipo: ACTIVITY_TYPES.DEPLOY,
          // Aplicar template do título apenas se não houver título salvo
          titulo: prev.titulo || generateTitleTemplate(ACTIVITY_TYPES.DEPLOY),
        }));
      } else if (activityType === 'bug') {
        // Para bug, aplicar template apenas se não houver título e tipo definidos
        setFormData(prev => {
          const needsTemplate =
            !prev.titulo &&
            (prev.tipo === ACTIVITY_TYPES.BUG_PRODUCAO ||
              prev.tipo === ACTIVITY_TYPES.BUG_RETRABALHO);
          return {
            ...prev,
            titulo: needsTemplate
              ? generateTitleTemplate(prev.tipo)
              : prev.titulo,
          };
        });
      }
    } else {
      document.body.classList.remove('modal-open');
    }

    // Cleanup ao desmontar
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isOpen, activityType]);

  // Salvar dados com debounce (exceto credenciais)
  useEffect(() => {
    if (debouncedFormData && Object.keys(debouncedFormData).length > 0) {
      localStorage.setItem(storageKey, JSON.stringify(debouncedFormData));
    }
  }, [debouncedFormData, storageKey]);

  // Atualizar sub-funcionalidades quando funcionalidade mudar
  useEffect(() => {
    if (
      formData.funcionalidade &&
      FUNCIONALIDADE_OPTIONS[formData.funcionalidade]
    ) {
      setSubFuncionalidadeOptions(
        FUNCIONALIDADE_OPTIONS[formData.funcionalidade]
      );
      // Limpar sub-funcionalidade selecionada se não for compatível
      if (
        formData.subFuncionalidade &&
        !FUNCIONALIDADE_OPTIONS[formData.funcionalidade].includes(
          formData.subFuncionalidade
        )
      ) {
        setFormData(prev => ({
          ...prev,
          subFuncionalidade: '',
        }));
      }
    } else {
      setSubFuncionalidadeOptions([]);
    }
  }, [formData.funcionalidade, formData.subFuncionalidade]);

  // Aplicar template do título quando tipo de atividade mudar (especialmente para bugs)
  useEffect(() => {
    if (formData.tipo && !formData.titulo) {
      const template = generateTitleTemplate(formData.tipo);
      if (template) {
        setFormData(prev => ({
          ...prev,
          titulo: template,
        }));
      }
    }
  }, [formData.tipo, formData.titulo]);

  // Processar link do Artia quando alterado
  useEffect(() => {
    const link = formData.artiaLink?.trim();

    if (!link) {
      setLinkValidation({ isValid: true, message: '' });
      setLinkExtracted(false);
      setShouldHideIdFields(false);
      return;
    }

    // Validar formato do link
    const validation = validateArtiaLink(link);
    setLinkValidation(validation);

    if (validation.isValid) {
      // Extrair IDs do link
      const { accountId, folderId, isValid } = extractIdsFromArtiaLink(link);

      if (isValid && accountId && folderId) {
        // Atualizar campos apenas se estiverem vazios ou se os valores forem diferentes
        const shouldUpdateAccount =
          !formData.accountId || formData.accountId !== accountId;
        const shouldUpdateFolder =
          !formData.folderId || formData.folderId !== folderId;

        if (shouldUpdateAccount || shouldUpdateFolder) {
          setLinkExtracted(true);
          // Mostrar feedback positivo temporário
          setTimeout(() => setLinkExtracted(false), 3000);

          setFormData(prev => ({
            ...prev,
            accountId: accountId,
            folderId: folderId,
          }));
        }

        // Ocultar os campos de ID quando o link for válido e os IDs forem extraídos
        setShouldHideIdFields(true);
      } else {
        setShouldHideIdFields(false);
      }
    } else {
      setLinkExtracted(false);
      setShouldHideIdFields(false);
    }
  }, [formData.artiaLink, formData.accountId, formData.folderId]);

  const handleInputChange = useCallback((name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const getFieldsForType = type => {
    return ACTIVITY_FIELDS[type] || [];
  };

  // Validação melhorada para todos os campos obrigatórios
  const isFormValid = useCallback(() => {
    // Verificar se as credenciais estão configuradas
    if (!hasArtiaCredentials()) {
      return false;
    }

    // Link do Artia obrigatório
    if (!formData.artiaLink?.trim()) {
      return false;
    }

    // Validar se o link é válido e se os IDs foram extraídos
    const { accountId, folderId, isValid } = extractIdsFromArtiaLink(formData.artiaLink);
    if (!isValid || !accountId || !folderId) {
      return false;
    }

    // Campos específicos do tipo de atividade
    const fields = getFieldsForType(formData.tipo);
    for (const field of fields) {
      if (field.required && (formData[field.name] === undefined || formData[field.name] === '' || formData[field.name] === null)) {
        return false;
      }
    }

    return true;
  }, [formData]);

  const validateForm = () => {
    // Verificar se as credenciais estão configuradas
    if (!hasArtiaCredentials()) {
      toast.error(
        'Credenciais do Artia não configuradas. Configure-as nas configurações.'
      );
      return false;
    }

    // Link do Artia obrigatório
    if (!formData.artiaLink?.trim()) {
      toast.error('Link do Artia é obrigatório');
      return false;
    }

    // Validar se o link é válido e se os IDs foram extraídos
    const { accountId, folderId, isValid } = extractIdsFromArtiaLink(formData.artiaLink);
    if (!isValid || !accountId || !folderId) {
      toast.error('Link do Artia inválido ou IDs não extraídos');
      return false;
    }

    // Campos específicos do tipo de atividade
    const fields = getFieldsForType(formData.tipo);
    for (const field of fields) {
      if (field.required && (formData[field.name] === undefined || formData[field.name] === '' || formData[field.name] === null)) {
        toast.error(`O campo "${field.label}" é obrigatório`);
        return false;
      }

      // Validação específica para campos numéricos com min/max
      if (
        field.type === 'number' &&
        formData[field.name] !== undefined &&
        formData[field.name] !== ''
      ) {
        const value = Number(formData[field.name]);
        if (field.min !== undefined && value < field.min) {
          toast.error(
            `O campo "${field.label}" deve ser maior ou igual a ${field.min}`
          );
          return false;
        }
        if (field.max !== undefined && value > field.max) {
          toast.error(
            `O campo "${field.label}" deve ser menor ou igual a ${field.max}`
          );
          return false;
        }
      }
    }

    return true;
  };

  const getGeneratedDescription = async () => {
    try {
      // Simular execução da função de copiar correspondente ao tipo de atividade
      if (activityType === 'bug') {
        // Importar o hook e executar a função de copiar
        await import('../../../hooks/useBugRegistration');
        // Como estamos fora do componente React, vamos usar os dados do localStorage diretamente
        const savedData = localStorage.getItem('bugRegistration');
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          const { decrypt } = await import('../../../utils/crypto');

          const bugData = {
            ...parsedData,
            login: parsedData.login ? decrypt(parsedData.login) : '',
            password: parsedData.password ? decrypt(parsedData.password) : '',
          };

          // Reproduzir a lógica de formatação do handleCopyAll
          const formattedSteps = bugData.steps
            .split('\n')
            .map(step => `» ${step}`)
            .join('\n');

          // Preparar seção de evidências (igual ao hook useBugRegistration)
          let evidenceSection = '';
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

          if (evidences.length > 0) {
            evidenceSection = `

    :: Evidência(s) ::
${evidences.join('\n')}`;
          }

          const plainText = `    :: Incidente identificado ::
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
${bugData.others}${evidenceSection}`;

          return plainText.trim();
        }
      } else if (activityType === 'deploy') {
        // Para deploy, usar os dados do card de deploy
        // Buscar dados do Deploy nas chaves corretas
        const deployFieldValues = localStorage.getItem('deployFieldValues');
        const deployFields = localStorage.getItem('deployFields');

        if (deployFieldValues && deployFields) {
          const fieldValues = JSON.parse(deployFieldValues);
          const fieldsConfig = JSON.parse(deployFields);

          // Gerar descrição formatada baseada nos campos preenchidos
          let deployDescription = '';

          // Usar o mapeamento correto dos deployFields
          fieldsConfig.forEach(field => {
            const fieldId = field.id;
            const fieldLabel = field.label;
            const fieldValue = fieldValues[fieldId];

            if (fieldValue && fieldValue.trim() !== '') {
              deployDescription += `${fieldLabel}: ${fieldValue}\n`;
            }
          });

          return deployDescription.trim() || 'Deploy preparado via KQA';
        }
      }

      return `Atividade criada via KQA - ${formData.tipo}`;
    } catch (error) {
      return `Atividade criada via KQA - ${formData.tipo}`;
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!hasArtiaCredentials()) {
      toast.error('Credenciais do Artia não configuradas. Configure-as nas configurações.');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Gerar descrição baseada na função de copiar
      const generatedDescription = await getGeneratedDescription();

      // Garantir que as credenciais do contexto estejam presentes no formData
      const formDataWithCredentials = {
        ...formData,
        login: artiaCredentials.email,
        senha: artiaCredentials.password,
      };

      // Tentar criar atividade completa primeiro, se falhar, criar simples
      let result;
      try {
        result = await ArtiaService.createActivity(
          formDataWithCredentials,
          generatedDescription
        );
      } catch (error) {
        // Se o erro for relacionado a CustomField, tentar versão simples
        if (
          error.message.includes('CustomField') ||
          error.message.includes('input type')
        ) {
          result = await ArtiaService.createSimpleActivity(
            formDataWithCredentials,
            generatedDescription
          );
        } else {
          throw error; // Re-throw se não for erro de CustomField
        }
      }

      // Adicionar ao histórico
      const newActivity = {
        id: result.id,
        title: result.title || formData.titulo,
        type: formData.tipo,
        accountId: formData.accountId,
        folderId: formData.folderId,
        createdAt: new Date().toISOString(),
        link: `https://app2.artia.com/a/${formData.accountId}/f/${formData.folderId}/activities/${result.id}`,
      };

      const updatedActivities = [newActivity, ...createdActivities];
      setCreatedActivities(updatedActivities);
      localStorage.setItem(
        'artiaActivitiesHistory',
        JSON.stringify(updatedActivities)
      );

      toast.success(`✅ Atividade criada com sucesso! ID: ${result.id}`);
    } catch (error) {
      toast.error(`❌ Erro ao criar atividade: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    const tipo = activityType === 'deploy' ? ACTIVITY_TYPES.DEPLOY : '';
    const titulo = tipo ? generateTitleTemplate(tipo) : '';

    setFormData({
      login: '',
      senha: '',
      titulo,
      tipo,
      accountId: '',
      folderId: '',
      funcionalidade: '',
      subFuncionalidade: '',
      responsibleId: '',
      customStatusId: DEFAULT_CUSTOM_STATUS_ID,
      ...initialData,
    });
    setSubFuncionalidadeOptions([]);
  };

  const handleClearHistory = () => {
    if (
      window.confirm(
        'Tem certeza que deseja limpar o histórico de atividades criadas?'
      )
    ) {
      localStorage.removeItem('artiaActivitiesHistory');
      setCreatedActivities([]);
      toast.info('📄 Histórico de atividades limpo');
    }
  };

  const handleClearAllData = () => {
    if (
      window.confirm(
        'Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.'
      )
    ) {
      // Limpar localStorage (dados do modal e histórico)
      localStorage.removeItem(storageKey);
      localStorage.removeItem('artiaActivitiesHistory');

      // Resetar estados
      setCreatedActivities([]);
      resetForm();

      toast.info('📄 Todos os dados foram limpos');
    }
  };

  const handleClose = () => {
    onClose();
  };

  const renderField = field => {
    const value = formData[field.name] || '';
    const isPinField = ['prioridade', 'funcionalidade', 'subFuncionalidade'].includes(field.name);
    const pinActive = pinToggles[field.name];

    switch (field.type) {
      case 'select': {
        let options = field.options;

        // Para sub-funcionalidade, usar as opções dinâmicas
        if (field.name === 'subFuncionalidade') {
          options = subFuncionalidadeOptions;
        }

        return (
          <div key={field.name} className='modal-field-group'>
            <div className='modal-input-container'>
              <select
                id={field.name}
                value={value}
                onChange={e => handleInputChange(field.name, e.target.value)}
                required={field.required}
                disabled={
                  field.name === 'subFuncionalidade' && !formData.funcionalidade
                }
              >
                <option value=''></option>
                {options.map(option => {
                  // Verificar se a opção é um objeto com id e name (para responsáveis)
                  if (typeof option === 'object' && option.id && option.name) {
                    return (
                      <option key={option.id} value={option.id}>
                        {option.name}
                      </option>
                    );
                  }
                  // Caso contrário, é uma string simples
                  return (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  );
                })}
              </select>
              <label htmlFor={field.name} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                {field.label}
                {field.required && <span className='modal-required'>*</span>}
                {isPinField && (
                  <button
                    type='button'
                    aria-label={`Fixar no título: ${field.label}`}
                    style={{ background: 'none', border: 'none', padding: 0, marginLeft: 4, cursor: 'pointer' }}
                    onClick={() => handleTogglePin(field.name)}
                    tabIndex={0}
                  >
                    <FaThumbtack
                      size={16}
                      color={pinActive ? '#F90EF4' : 'currentColor'}
                      style={{
                        transform: pinActive ? 'rotate(-20deg)' : 'none',
                        opacity: pinActive ? 1 : 0.7,
                        transition: 'transform 0.2s, color 0.2s, opacity 0.2s',
                      }}
                    />
                  </button>
                )}
              </label>
            </div>
          </div>
        );
      }

      case 'number':
        return (
          <div key={field.name} className='modal-field-group'>
            <div className='modal-input-container'>
              <input
                type='number'
                id={field.name}
                value={value}
                onChange={e => handleInputChange(field.name, e.target.value)}
                required={field.required}
                min={field.min}
                max={field.max}
              />
              <label htmlFor={field.name} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                {field.label}
                {field.required && <span className='modal-required'>*</span>}
                {isPinField && (
                  <button
                    type='button'
                    aria-label={`Fixar no título: ${field.label}`}
                    style={{ background: 'none', border: 'none', padding: 0, marginLeft: 4, cursor: 'pointer' }}
                    onClick={() => handleTogglePin(field.name)}
                    tabIndex={0}
                  >
                    <FaThumbtack
                      size={16}
                      color={pinActive ? '#F90EF4' : 'currentColor'}
                      style={{
                        transform: pinActive ? 'rotate(-20deg)' : 'none',
                        opacity: pinActive ? 1 : 0.7,
                        transition: 'transform 0.2s, color 0.2s, opacity 0.2s',
                      }}
                    />
                  </button>
                )}
                {field.min !== undefined && field.max !== undefined && (
                  <span className='modal-field-hint'>
                    {' '}
                    ({field.min} a {field.max})
                  </span>
                )}
              </label>
              {value && (
                <button
                  type='button'
                  className='modal-clear-field'
                  onClick={() => handleInputChange(field.name, '')}
                  title={`Limpar ${field.label}`}
                >
                  <FaTimes />
                </button>
              )}
            </div>
          </div>
        );

      case 'email':
        return (
          <div key={field.name} className='modal-field-group'>
            <div className='modal-input-container'>
              <input
                type='email'
                id={field.name}
                value={value}
                onChange={e => handleInputChange(field.name, e.target.value)}
                required={field.required}
              />
              <label htmlFor={field.name} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                {field.label}
                {field.required && <span className='modal-required'>*</span>}
                {isPinField && (
                  <button
                    type='button'
                    aria-label={`Fixar no título: ${field.label}`}
                    style={{ background: 'none', border: 'none', padding: 0, marginLeft: 4, cursor: 'pointer' }}
                    onClick={() => handleTogglePin(field.name)}
                    tabIndex={0}
                  >
                    <FaThumbtack
                      size={16}
                      color={pinActive ? '#F90EF4' : 'currentColor'}
                      style={{
                        transform: pinActive ? 'rotate(-20deg)' : 'none',
                        opacity: pinActive ? 1 : 0.7,
                        transition: 'transform 0.2s, color 0.2s, opacity 0.2s',
                      }}
                    />
                  </button>
                )}
              </label>
              {value && (
                <button
                  type='button'
                  className='modal-clear-field'
                  onClick={() => handleInputChange(field.name, '')}
                  title={`Limpar ${field.label}`}
                >
                  <FaTimes />
                </button>
              )}
            </div>
          </div>
        );

      default:
        return (
          <div key={field.name} className='modal-field-group'>
            <div className='modal-input-container'>
              <input
                type='text'
                id={field.name}
                value={value}
                onChange={e => handleInputChange(field.name, e.target.value)}
                required={field.required}
              />
              <label htmlFor={field.name} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                {field.label}
                {field.required && <span className='modal-required'>*</span>}
                {isPinField && (
                  <button
                    type='button'
                    aria-label={`Fixar no título: ${field.label}`}
                    style={{ background: 'none', border: 'none', padding: 0, marginLeft: 4, cursor: 'pointer' }}
                    onClick={() => handleTogglePin(field.name)}
                    tabIndex={0}
                  >
                    <FaThumbtack
                      size={16}
                      color={pinActive ? '#F90EF4' : 'currentColor'}
                      style={{
                        transform: pinActive ? 'rotate(-20deg)' : 'none',
                        opacity: pinActive ? 1 : 0.7,
                        transition: 'transform 0.2s, color 0.2s, opacity 0.2s',
                      }}
                    />
                  </button>
                )}
              </label>
              {value && (
                <button
                  type='button'
                  className='modal-clear-field'
                  onClick={() => handleInputChange(field.name, '')}
                  title={`Limpar ${field.label}`}
                >
                  <FaTimes />
                </button>
              )}
            </div>
          </div>
        );
    }
  };

  // Função para gerar o texto da tag de cada campo
  const getPinTag = (fieldName, pinToggles, formData) => {
    if (!pinToggles[fieldName]) return '';
    if (fieldName === 'prioridade' && formData.prioridade !== undefined && formData.prioridade !== '') {
      return `P${formData.prioridade}`;
    }
    if (fieldName === 'funcionalidade' && formData.funcionalidade) {
      return `[${formData.funcionalidade}]`;
    }
    if (fieldName === 'subFuncionalidade' && formData.subFuncionalidade) {
      return `[${formData.subFuncionalidade}]`;
    }
    return '';
  };

  // Substitua a declaração de fixedTags por:
  const fixedTags = useMemo(() => {
    // Só exibe tags para Bug Produção ou Bug Retrabalho
    if (
      formData.tipo === ACTIVITY_TYPES.BUG_PRODUCAO ||
      formData.tipo === ACTIVITY_TYPES.BUG_RETRABALHO
    ) {
      return [
        getPinTag('prioridade', pinToggles, formData),
        getPinTag('funcionalidade', pinToggles, formData),
        getPinTag('subFuncionalidade', pinToggles, formData),
      ].filter(Boolean);
    }
    // Para outros tipos (ex: Deploy), não exibe tags
    return [];
  }, [formData.tipo, pinToggles, formData.prioridade, formData.funcionalidade, formData.subFuncionalidade]);

  const [userTitle, setUserTitle] = useState('');

  // Atualiza userTitle quando o formData.titulo muda externamente (reset, etc)
  useEffect(() => {
    // Só atualiza se o modal abrir ou o título for resetado
    if (!isOpen) return;
    let t = formData.titulo || '';
    fixedTags.forEach(tag => {
      if (t.startsWith(tag + ' ')) t = t.slice(tag.length + 1);
      else if (t.startsWith(tag)) t = t.slice(tag.length);
    });
    setUserTitle(t.trimStart());
    // eslint-disable-next-line
  }, [isOpen]);

  // Atualiza formData.titulo sempre que as tags ou userTitle mudam
  useEffect(() => {
    const newTitle = (fixedTags.length > 0 ? fixedTags.join(' ') + ' ' : '') + (userTitle || '');
    if (formData.titulo !== newTitle) {
      setFormData(prev => ({ ...prev, titulo: newTitle }));
    }
    // eslint-disable-next-line
  }, [userTitle, fixedTags, setFormData]);

  if (!isOpen) return null;

  return (
    <div className='modal-overlay'>
      <div className='modal-container'>
        <div className='modal-header'>
          <h2>
            <FaRocket className='modal-icon' />
            Criar atividade
          </h2>
          <button
            type='button'
            className='modal-close-button'
            onClick={handleClose}
            disabled={loading}
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className='modal-form'>
          <div className='modal-body'>
            {/* Aviso sobre credenciais do Artia */}
            {/* Aviso sobre credenciais do Artia */}
            <div className='section-divider'>
              <FaLock /> Autenticação Artia
            </div>
            <div className='modal-field-group'>
              <div
                className='modal-input-container'
                style={{
                  background: '#181c1f',
                  border: '1px solid #222',
                  color: hasArtiaCredentials() ? '#2ecc40' : '#fff',
                  padding: 12,
                  borderRadius: 6,
                  marginBottom: 8,
                  fontWeight: 500,
                  fontSize: 15,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                }}
              >
                {hasArtiaCredentials() ? (
                  <span style={{ color: '#2ecc40', fontWeight: 600, marginBottom: 2 }}>Status: ✓ Configurado</span>
                ) : (
                  <>
                    <span style={{ color: '#e74c3c', fontWeight: 600, marginBottom: 2 }}>Status: ✗ Não configurado</span>
                    <span style={{ color: '#fff', fontWeight: 400, fontSize: 14 }}>
                      Configure suas credenciais na área de <b>Configurações</b> (no menu lateral).
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className='section-divider'>
              <FaLink /> Link do Artia
            </div>

            <div className='modal-field-group'>
              <div className='modal-input-container'>
                <input
                  type='url'
                  id='artiaLink'
                  value={formData.artiaLink}
                  onChange={e => handleInputChange('artiaLink', e.target.value)}
                  disabled={loading}
                  required
                  placeholder='https://app2.artia.com/a/4874953/f/4885568/kanban...'
                  className={
                    !linkValidation.isValid
                      ? 'input-error'
                      : linkExtracted
                        ? 'input-success'
                        : ''
                  }
                />
                <label htmlFor='artiaLink'>
                  Link do Artia
                  <span className='modal-required'>*</span>
                  {!linkValidation.isValid && (
                    <span className='input-error-message'>
                      Link do Artia é obrigatório
                    </span>
                  )}
                </label>
                {formData.artiaLink && !loading && (
                  <button
                    type='button'
                    className='modal-clear-field'
                    onClick={() => {
                      handleInputChange('artiaLink', '');
                      setShouldHideIdFields(false);
                    }}
                    title='Limpar Link do Artia'
                  >
                    <FaTimes />
                  </button>
                )}
                {!linkValidation.isValid && (
                  <div className='input-error-message'>
                    <FaExclamationTriangle />
                    {linkValidation.message}
                  </div>
                )}
                {linkValidation.isValid &&
                  formData.artiaLink &&
                  !linkExtracted && (
                    <div
                      className={
                        shouldHideIdFields
                          ? 'input-success-message'
                          : 'input-help-message'
                      }
                    >
                      {shouldHideIdFields ? (
                        <>
                          <FaCheck /> IDs do Grupo e Pasta preenchidos automaticamente
                        </>
                      ) : (
                        'Link válido - os IDs serão extraídos automaticamente'
                      )}
                    </div>
                  )}
              </div>
            </div>

            <div className='section-divider'>
              <FaClipboardList /> Dados da atividade
            </div>

            <div className='modal-field-group'>
              <label className='modal-toggle-badge-label'>
                Tipo
                <span className='modal-required'>*</span>
              </label>
              <div className='modal-toggle-badges-container'>
                {availableTypes.map(type => {
                  const badgeConfig = getActivityTypeToggleBadge(type);
                  const isSelected = formData.tipo === type;
                  const isDisabled =
                    loading ||
                    (activityType === 'deploy' &&
                      type !== ACTIVITY_TYPES.DEPLOY);

                  return (
                    <button
                      key={type}
                      type='button'
                      className={`modal-toggle-badge ${badgeConfig ? badgeConfig.cssClass : ''} ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
                      onClick={() =>
                        !isDisabled && handleInputChange('tipo', type)
                      }
                      disabled={isDisabled}
                    >
                      {badgeConfig ? badgeConfig.text : type}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className='modal-field-group'>
              <label className='modal-toggle-badge-label'>
                Situação
                <span className='modal-required'>*</span>
              </label>
              <div className='modal-toggle-badges-container'>
                {CUSTOM_STATUS_OPTIONS.map(status => {
                  const badgeConfig = getCustomStatusToggleBadge(status.id);
                  const isSelected = formData.customStatusId === status.id;

                  return (
                    <button
                      key={status.id}
                      type='button'
                      className={`modal-toggle-badge ${badgeConfig ? badgeConfig.cssClass : ''} ${isSelected ? 'selected' : ''} ${loading ? 'disabled' : ''}`}
                      onClick={() =>
                        !loading && handleInputChange('customStatusId', status.id)
                      }
                      disabled={loading}
                    >
                      {badgeConfig ? badgeConfig.text : status.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className='modal-field-group'>
              <div className='modal-input-container' style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                {/* Tags fixadas à esquerda */}
                {fixedTags.map((tag, idx) => (
                  <span key={tag + idx} className='fixed-title-tag' style={{
                    background: 'var(--primary-color, #F90EF4)',
                    color: '#fff',
                    borderRadius: 4,
                    padding: '2px 8px',
                    fontSize: 13,
                    fontWeight: 500,
                    marginRight: 4,
                    userSelect: 'none',
                    letterSpacing: 0.5,
                    display: 'inline-block',
                    whiteSpace: 'nowrap',
                  }}>{tag}</span>
                ))}
                {/* Input editável */}
                <input
                  type='text'
                  id='titulo'
                  value={userTitle}
                  onChange={e => setUserTitle(e.target.value)}
                  required
                  disabled={loading}
                  style={{ flex: 1, minWidth: 0 }}
                  placeholder={fixedTags.length > 0 ? 'Descreva o restante do título...' : 'Título da atividade'}
                />
                <label htmlFor='titulo'>
                  Título
                  <span className='modal-required'>*</span>
                </label>
                {userTitle && !loading && (
                  <button
                    type='button'
                    className='modal-clear-field'
                    onClick={() => setUserTitle('')}
                    title='Limpar Título'
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
            </div>

            {/* Remover campos de ID do Grupo e Pasta, pois agora são extraídos automaticamente e o link é obrigatório */}

            {/* Campos específicos do tipo de atividade */}
            {formData.tipo && getFieldsForType(formData.tipo).length > 0 && (
              <div className='modal-specific-fields'>
                {getFieldsForType(formData.tipo).map(renderField)}
              </div>
            )}
          </div>

          {/* Histórico de atividades usando o novo componente */}
          <ActivityHistoryCard
            activities={createdActivities}
            onClearHistory={handleClearHistory}
            filterContext={activityType}
          />

          <div className='modal-footer'>
            <button
              type='button'
              className='modal-action-button secondary'
              onClick={handleClose}
              disabled={loading}
            >
              Fechar
            </button>
            <button
              type='button'
              className='modal-action-button warning'
              onClick={handleClearAllData}
              disabled={loading}
              title='Limpar todos os dados salvos'
            >
              Limpar Dados
            </button>
            <button
              type='submit'
              className='modal-action-button primary'
              disabled={loading || !isFormValid() || !hasArtiaCredentials()}
            >
              {loading ? (
                <>
                  <FaSpinner className='modal-spinner' />
                  Criando...
                </>
              ) : (
                'Criar Atividade'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

ArtiaActivityModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  activityType: PropTypes.oneOf(['bug', 'deploy']).isRequired,
  initialData: PropTypes.object,
};

export default ArtiaActivityModal;
