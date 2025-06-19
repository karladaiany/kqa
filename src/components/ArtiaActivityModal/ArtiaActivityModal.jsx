import React, { useState, useEffect } from 'react';
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
} from '../../constants/artiaOptions';
import { ArtiaService } from '../../services/artiaService';
import './ArtiaActivityModal.css';

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
      ...initialData,
    };

    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        return { ...defaultData, ...parsed };
      } catch (error) {
        console.error('Erro ao carregar dados salvos:', error);
        return defaultData;
      }
    }

    return defaultData;
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [testingAuth, setTestingAuth] = useState(false);
  const [subFuncionalidadeOptions, setSubFuncionalidadeOptions] = useState([]);

  // Estado para histórico de atividades criadas
  const [createdActivities, setCreatedActivities] = useState(() => {
    const saved = localStorage.getItem('artiaActivitiesHistory');
    return saved ? JSON.parse(saved) : [];
  });

  // Definir tipos disponíveis baseado na origem
  const availableTypes =
    activityType === 'bug'
      ? [ACTIVITY_TYPES.BUG_PRODUCAO, ACTIVITY_TYPES.BUG_RETRABALHO]
      : [ACTIVITY_TYPES.DEPLOY];

  useEffect(() => {
    if (isOpen) {
      // Se for deploy, já seleciona automaticamente
      if (activityType === 'deploy') {
        setFormData(prev => ({
          ...prev,
          tipo: ACTIVITY_TYPES.DEPLOY,
        }));
      }
    }
  }, [isOpen, activityType]);

  // Atualizar sub-funcionalidades quando funcionalidade mudar
  useEffect(() => {
    if (
      formData.funcionalidade &&
      FUNCIONALIDADE_OPTIONS[formData.funcionalidade]
    ) {
      setSubFuncionalidadeOptions(
        FUNCIONALIDADE_OPTIONS[formData.funcionalidade]
      );
      // Limpar sub-funcionalidade selecionada
      setFormData(prev => ({
        ...prev,
        subFuncionalidade: '',
      }));
    } else {
      setSubFuncionalidadeOptions([]);
    }
  }, [formData.funcionalidade]);

  const handleInputChange = (name, value) => {
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: value,
      };

      // Salvar no localStorage (exceto credenciais)
      const { login, senha, ...dataToSave } = newData;
      localStorage.setItem('artiaModalData', JSON.stringify(dataToSave));

      return newData;
    });
  };

  const getFieldsForType = type => {
    return ACTIVITY_FIELDS[type] || [];
  };

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

  const handleTestAuthentication = async () => {
    if (!formData.login || !formData.senha) {
      toast.error('Preencha login e senha para testar a autenticação');
      return;
    }

    setTestingAuth(true);

    try {
      // Iniciando teste de autenticação

      // Limpar token existente para teste limpo
      ArtiaService.logout();

      const result = await ArtiaService.testAuthentication(
        formData.login,
        formData.senha
      );

      if (result.success) {
        toast.success(`✅ ${result.message}`);
      } else {
        toast.error(`❌ ${result.message}`);
      }
    } catch (error) {
      toast.error('Erro inesperado no teste de autenticação');
      console.error('[Artia] Erro no teste:', error.message);
    } finally {
      setTestingAuth(false);
    }
  };

  const getGeneratedDescription = async () => {
    try {
      // Simular execução da função de copiar correspondente ao tipo de atividade
      if (activityType === 'bug') {
        // Importar o hook e executar a função de copiar
        const { useBugRegistration } = await import(
          '../../hooks/useBugRegistration'
        );
        // Como estamos fora do componente React, vamos usar os dados do localStorage diretamente
        const savedData = localStorage.getItem('bugRegistration');
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          const { decrypt } = await import('../../utils/crypto');

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
${bugData.others}`;

          return plainText.trim();
        }
      } else if (activityType === 'deploy') {
        // Para deploy, usar os dados do card de deploy
        const savedData = localStorage.getItem('deployData');
        if (savedData) {
          const deployData = JSON.parse(savedData);
          return `Deploy realizado: ${deployData.description || 'Deploy via KQA'}`;
        }
      }

      return `Atividade criada via KQA - ${formData.tipo}`;
    } catch (error) {
      console.error('Erro ao gerar descrição:', error);
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
      // Iniciando criação de atividade

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
      // Atividade criada com sucesso

      // Não fechar o modal para mostrar o resultado
      // onClose();
      // resetForm();
    } catch (error) {
      console.error('❌ Erro ao criar atividade:', error);
      toast.error(`❌ Erro ao criar atividade: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      login: '',
      senha: '',
      titulo: '',
      tipo: activityType === 'deploy' ? ACTIVITY_TYPES.DEPLOY : '',
      accountId: '',
      folderId: '',
      ...initialData,
    });
    setSubFuncionalidadeOptions([]);
  };

  const handleClearAllData = () => {
    // Limpar localStorage (dados do modal e histórico)
    localStorage.removeItem('artiaModalData');
    localStorage.removeItem('artiaActivitiesHistory');

    // Resetar estados
    setCreatedActivities([]);
    resetForm();

    toast.info('📄 Todos os dados foram limpos');
  };

  const handleClose = () => {
    resetForm();
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
                {options.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
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
              <div className='modal-password-field'>
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

            {/* Botão de teste de autenticação */}
            <div className='modal-field-group'>
              <button
                type='button'
                className='modal-test-auth-button'
                onClick={handleTestAuthentication}
                disabled={
                  loading || testingAuth || !formData.login || !formData.senha
                }
              >
                {testingAuth ? (
                  <>
                    <FaSpinner className='modal-spinner' />
                    Testando autenticação...
                  </>
                ) : (
                  <>🔍 Testar Autenticação</>
                )}
              </button>
              {ArtiaService.hasValidToken() && (
                <div className='modal-auth-status'>
                  ✅ Token válido armazenado
                  <button
                    type='button'
                    className='modal-clear-token-button'
                    onClick={() => {
                      ArtiaService.logout();
                      toast.info('Token removido');
                      setFormData(prev => ({ ...prev })); // Force re-render
                    }}
                    title='Limpar token para novo teste'
                  >
                    🗑️
                  </button>
                </div>
              )}
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

            <div className='modal-config-notice'>
              ⚠️ <strong>Configuração necessária:</strong> Os valores de Folder
              ID, Account ID e Organization ID estão configurados como padrão.
              Para produção, configure em{' '}
              <code>constants/artiaFieldHashes.js</code>
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

          {/* Histórico de atividades criadas */}
          {createdActivities.length > 0 && (
            <div className='modal-activities-history'>
              <div className='section-divider'>
                🎉 Atividades Criadas ({createdActivities.length})
              </div>
              <div className='activities-list'>
                {createdActivities.map((activity, index) => (
                  <div key={activity.id} className='activity-item'>
                    <div className='activity-info'>
                      <strong>#{activity.id}</strong> - {activity.title}
                      <span className='activity-type'>{activity.type}</span>
                    </div>
                    <div className='activity-link'>
                      <a
                        href={activity.link}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='activity-link-button'
                        title='Abrir atividade no Artia'
                      >
                        🔗 Abrir no Artia
                      </a>
                    </div>
                    <div className='activity-date'>
                      {new Date(activity.createdAt).toLocaleString('pt-BR')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

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
              disabled={loading || !formData.accountId || !formData.folderId}
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

export default ArtiaActivityModal;
