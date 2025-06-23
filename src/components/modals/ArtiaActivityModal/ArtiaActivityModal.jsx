import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  FaTimes,
  FaEye,
  FaEyeSlash,
  FaSpinner,
  FaRocket,
  FaLock,
  FaClipboardList,
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import {
  ACTIVITY_TYPES,
  ACTIVITY_FIELDS,
  FUNCIONALIDADE_OPTIONS,
} from '../../../constants/artiaOptions';
import { ArtiaService } from '../../../services/artiaService';
import ActivityHistoryCard from './ActivityHistoryCard';
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
    return '[] ';
  }
  return '';
};

const ArtiaActivityModal = ({
  isOpen,
  onClose,
  activityType,
  initialData = {},
}) => {
  const [formData, setFormData] = useState(() => {
    // Carregar dados salvos do localStorage
    const savedData = localStorage.getItem('artiaModalData');
    const defaultData = {
      login: '',
      senha: '',
      titulo: '',
      tipo: '',
      accountId: '',
      folderId: '',
      funcionalidade: '',
      subFuncionalidade: '',
      responsibleId: '',
      ...initialData,
    };

    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        return { ...defaultData, ...parsed };
      } catch (error) {
        return defaultData;
      }
    }

    return defaultData;
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [subFuncionalidadeOptions, setSubFuncionalidadeOptions] = useState([]);

  // Estado para histórico de atividades criadas
  const [createdActivities, setCreatedActivities] = useState(() => {
    const saved = localStorage.getItem('artiaActivitiesHistory');
    return saved ? JSON.parse(saved) : [];
  });

  // Debounce para salvar dados no localStorage (exceto credenciais)
  const debouncedFormData = useDebounce(formData, 800);

  // Definir tipos disponíveis baseado na origem
  const availableTypes =
    activityType === 'bug'
      ? [ACTIVITY_TYPES.BUG_PRODUCAO, ACTIVITY_TYPES.BUG_RETRABALHO]
      : [ACTIVITY_TYPES.DEPLOY];

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
      const { login, senha, ...dataToSave } = debouncedFormData;
      localStorage.setItem('artiaModalData', JSON.stringify(dataToSave));
    }
  }, [debouncedFormData]);

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
  }, [formData.funcionalidade]);

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
  }, [formData.tipo]);

  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const getFieldsForType = type => {
    return ACTIVITY_FIELDS[type] || [];
  };

  // Validação melhorada para todos os campos obrigatórios
  const isFormValid = useCallback(() => {
    // Campos básicos obrigatórios
    if (
      !formData.login?.trim() ||
      !formData.senha?.trim() ||
      !formData.titulo?.trim() ||
      !formData.tipo?.trim() ||
      !formData.accountId?.toString().trim() ||
      !formData.folderId?.toString().trim()
    ) {
      return false;
    }

    // Validar se os IDs são números válidos
    if (
      isNaN(parseInt(formData.accountId)) ||
      isNaN(parseInt(formData.folderId))
    ) {
      return false;
    }

    // Campos específicos do tipo de atividade
    const fields = getFieldsForType(formData.tipo);
    for (const field of fields) {
      if (field.required && !formData[field.name]?.toString().trim()) {
        return false;
      }
    }

    return true;
  }, [formData]);

  const validateForm = () => {
    // Campos básicos obrigatórios
    if (
      !formData.login ||
      !formData.senha ||
      !formData.titulo ||
      !formData.tipo ||
      !formData.accountId ||
      !formData.folderId
    ) {
      toast.error('Preencha todos os campos básicos obrigatórios');
      return false;
    }

    // Validar se os IDs são números válidos
    if (
      isNaN(parseInt(formData.accountId)) ||
      isNaN(parseInt(formData.folderId))
    ) {
      toast.error('IDs do Grupo e da Pasta devem ser números válidos');
      return false;
    }

    // Campos específicos do tipo de atividade
    const fields = getFieldsForType(formData.tipo);
    for (const field of fields) {
      if (field.required && !formData[field.name]) {
        toast.error(`O campo "${field.label}" é obrigatório`);
        return false;
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

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Gerar descrição baseada na função de copiar
      const generatedDescription = await getGeneratedDescription();

      // Tentar criar atividade completa primeiro, se falhar, criar simples
      let result;
      try {
        result = await ArtiaService.createActivity(
          formData,
          generatedDescription
        );
      } catch (error) {
        // Se o erro for relacionado a CustomField, tentar versão simples
        if (
          error.message.includes('CustomField') ||
          error.message.includes('input type')
        ) {
          result = await ArtiaService.createSimpleActivity(
            formData,
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
      localStorage.removeItem('artiaModalData');
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
                <option value=''>Selecione...</option>
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
              <label htmlFor={field.name}>
                {field.label}
                {field.required && <span className='modal-required'>*</span>}
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
              />
              <label htmlFor={field.name}>
                {field.label}
                {field.required && <span className='modal-required'>*</span>}
              </label>
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
              <label htmlFor={field.name}>
                {field.label}
                {field.required && <span className='modal-required'>*</span>}
              </label>
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
              <label htmlFor={field.name}>
                {field.label}
                {field.required && <span className='modal-required'>*</span>}
              </label>
            </div>
          </div>
        );
    }
  };

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
            {/* Campos básicos obrigatórios */}
            <div className='section-divider'>
              <FaLock /> Autenticação
            </div>

            <div className='modal-field-group'>
              <div className='modal-input-container'>
                <input
                  type='text'
                  id='login'
                  value={formData.login}
                  onChange={e => handleInputChange('login', e.target.value)}
                  required
                  disabled={loading}
                  placeholder='Seu login do Artia'
                />
                <label htmlFor='login'>
                  Login
                  <span className='modal-required'>*</span>
                </label>
              </div>
            </div>

            <div className='modal-field-group'>
              <div className='modal-input-container'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id='senha'
                  value={formData.senha}
                  onChange={e => handleInputChange('senha', e.target.value)}
                  required
                  disabled={loading}
                  placeholder='Sua senha do Artia'
                />
                <label htmlFor='senha'>
                  Senha
                  <span className='modal-required'>*</span>
                </label>
                <button
                  type='button'
                  className='modal-toggle-password'
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className='section-divider'>
              <FaClipboardList /> Dados da atividade
            </div>

            <div className='modal-field-group'>
              <div className='modal-input-container'>
                <input
                  type='text'
                  id='titulo'
                  value={formData.titulo}
                  onChange={e => handleInputChange('titulo', e.target.value)}
                  required
                  disabled={loading}
                  placeholder='Título da atividade'
                />
                <label htmlFor='titulo'>
                  Título
                  <span className='modal-required'>*</span>
                </label>
              </div>
            </div>

            <div className='modal-field-group'>
              <div className='modal-input-container'>
                <select
                  id='tipo'
                  value={formData.tipo}
                  onChange={e => handleInputChange('tipo', e.target.value)}
                  required
                  disabled={loading || activityType === 'deploy'}
                >
                  <option value=''>Selecione o tipo...</option>
                  {availableTypes.map(type => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <label htmlFor='tipo'>
                  Tipo
                  <span className='modal-required'>*</span>
                </label>
              </div>
            </div>

            <div className='modal-field-group'>
              <div className='modal-input-container'>
                <input
                  type='number'
                  id='accountId'
                  value={formData.accountId}
                  onChange={e => handleInputChange('accountId', e.target.value)}
                  required
                  disabled={loading}
                  placeholder='Ex: 4874953'
                />
                <label htmlFor='accountId'>
                  ID do Grupo de Trabalho
                  <span className='modal-required'>*</span>
                </label>
              </div>
            </div>

            <div className='modal-field-group'>
              <div className='modal-input-container'>
                <input
                  type='number'
                  id='folderId'
                  value={formData.folderId}
                  onChange={e => handleInputChange('folderId', e.target.value)}
                  required
                  disabled={loading}
                  placeholder='Ex: 4883952'
                />
                <label htmlFor='folderId'>
                  ID da Pasta/Projeto
                  <span className='modal-required'>*</span>
                </label>
              </div>
            </div>

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
              disabled={loading || !isFormValid()}
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
