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
import './ArtiaActivityModal.css';

const ArtiaActivityModal = ({
  isOpen,
  onClose,
  activityType,
  initialData = {},
}) => {
  const [formData, setFormData] = useState({
    login: '',
    senha: '',
    titulo: '',
    tipo: '',
    ...initialData,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [subFuncionalidadeOptions, setSubFuncionalidadeOptions] = useState([]);

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
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
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
      !formData.tipo
    ) {
      toast.error('Preencha todos os campos básicos obrigatórios');
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

  const handleSubmit = async e => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Aqui será implementada a chamada GraphQL para o Artia
      console.log('Dados para enviar ao Artia:', formData);

      // Simulação de sucesso - substitua pela implementação real da API
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast.success('Atividade criada com sucesso no Artia!');
      onClose();
      resetForm();
    } catch (error) {
      console.error('Erro ao criar atividade:', error);
      toast.error('Erro ao criar atividade. Tente novamente.');
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
      ...initialData,
    });
    setSubFuncionalidadeOptions([]);
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
          <div key={field.name} className='field-group'>
            <div className='input-container'>
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
                {field.required && <span className='required'>*</span>}
              </label>
            </div>
          </div>
        );
      }

      case 'number':
        return (
          <div key={field.name} className='field-group'>
            <div className='input-container'>
              <input
                type='number'
                id={field.name}
                value={value}
                onChange={e => handleInputChange(field.name, e.target.value)}
                required={field.required}
              />
              <label htmlFor={field.name}>
                {field.label}
                {field.required && <span className='required'>*</span>}
              </label>
            </div>
          </div>
        );

      case 'email':
        return (
          <div key={field.name} className='field-group'>
            <div className='input-container'>
              <input
                type='email'
                id={field.name}
                value={value}
                onChange={e => handleInputChange(field.name, e.target.value)}
                required={field.required}
              />
              <label htmlFor={field.name}>
                {field.label}
                {field.required && <span className='required'>*</span>}
              </label>
            </div>
          </div>
        );

      default:
        return (
          <div key={field.name} className='field-group'>
            <div className='input-container'>
              <input
                type='text'
                id={field.name}
                value={value}
                onChange={e => handleInputChange(field.name, e.target.value)}
                required={field.required}
              />
              <label htmlFor={field.name}>
                {field.label}
                {field.required && <span className='required'>*</span>}
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
            className='close-button'
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

            <div className='field-group'>
              <div className='input-container'>
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
                  <span className='required'>*</span>
                </label>
              </div>
            </div>

            <div className='field-group'>
              <div className='password-field'>
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
                  <span className='required'>*</span>
                </label>
                <button
                  type='button'
                  className='toggle-password'
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

            <div className='field-group'>
              <div className='input-container'>
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
                  <span className='required'>*</span>
                </label>
              </div>
            </div>

            <div className='field-group'>
              <div className='input-container'>
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
                  <span className='required'>*</span>
                </label>
              </div>
            </div>

            {/* Campos específicos do tipo de atividade */}
            {formData.tipo && getFieldsForType(formData.tipo).length > 0 && (
              <div className='specific-fields'>
                {getFieldsForType(formData.tipo).map(renderField)}
              </div>
            )}
          </div>

          <div className='modal-footer'>
            <button
              type='button'
              className='btn btn-secondary'
              onClick={handleClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type='submit'
              className='btn btn-primary'
              disabled={loading}
            >
              {loading ? (
                <>
                  <FaSpinner className='spinner' />
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
