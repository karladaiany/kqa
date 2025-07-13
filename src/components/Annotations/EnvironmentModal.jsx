import React, { useState, useEffect } from 'react';
import { FaTimes, FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import * as FaIcons from 'react-icons/fa';
import { COLORS, TECH_ICONS } from '../../hooks/useMyEnvironments';

const EnvironmentModal = ({
  isOpen,
  onClose,
  onSave,
  environment = null,
  validateUrl,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    icon: 'FaCode',
    iconColor: COLORS[0],
    tagName: '',
    tagColor: COLORS[0],
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (environment) {
      setFormData({
        name: environment.name || '',
        url: environment.url || '',
        icon: environment.icon || 'FaCode',
        iconColor: environment.iconColor || COLORS[0],
        tagName: environment.tagName || '',
        tagColor: environment.tagColor || COLORS[0],
      });
    } else {
      setFormData({
        name: '',
        url: '',
        icon: 'FaCode',
        iconColor: COLORS[0],
        tagName: '',
        tagColor: COLORS[0],
      });
    }
    setErrors({});
  }, [environment, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Limpar erro do campo quando ele é modificado
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    } else if (formData.name.length > 20) {
      newErrors.name = 'Nome deve ter até 20 caracteres';
    }

    if (!formData.url.trim()) {
      newErrors.url = 'URL é obrigatória';
    } else if (!validateUrl(formData.url)) {
      newErrors.url = 'URL inválida';
    }

    if (!formData.tagName.trim()) {
      newErrors.tagName = 'Nome da tag é obrigatório';
    } else if (formData.tagName.length > 20) {
      newErrors.tagName = 'Nome da tag deve ter até 20 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      url: '',
      icon: 'FaCode',
      iconColor: COLORS[0],
      tagName: '',
      tagColor: COLORS[0],
    });
    setErrors({});
    onClose();
  };

  const ColorPicker = ({ selectedColor, onColorChange, title }) => (
    <div className='color-picker'>
      <label className='form-label'>{title}</label>
      <div className='color-grid'>
        {COLORS.map(color => (
          <button
            key={color}
            type='button'
            className={`color-option ${selectedColor === color ? 'selected' : ''}`}
            style={{ backgroundColor: color }}
            onClick={() => onColorChange(color)}
            aria-label={`Selecionar cor ${color}`}
          />
        ))}
      </div>
    </div>
  );

  const IconPicker = ({ selectedIcon, onIconChange, iconColor }) => (
    <div className='icon-picker'>
      <label className='form-label'>Ícone</label>
      <div className='icon-grid'>
        {TECH_ICONS.map(iconName => {
          const IconComponent = FaIcons[iconName];
          if (!IconComponent) {
            return null;
          }
          return (
            <button
              key={iconName}
              type='button'
              className={`icon-option ${selectedIcon === iconName ? 'selected' : ''}`}
              onClick={() => onIconChange(iconName)}
              aria-label={`Selecionar ícone ${iconName}`}
            >
              <IconComponent style={{ color: iconColor }} />
            </button>
          );
        })}
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className='modal-overlay' onClick={handleClose}>
      <div
        className='modal-container environment-modal'
        onClick={e => e.stopPropagation()}
      >
        <div className='modal-header'>
          <h2>{environment ? 'Editar Ambiente' : 'Novo Ambiente'}</h2>
          <button
            type='button'
            className='modal-close-button'
            onClick={handleClose}
            aria-label='Fechar modal'
          >
            <FaTimes />
          </button>
        </div>
        <form onSubmit={handleSubmit} className='modal-form'>
          <div className='modal-body'>
            {/* Nome e URL */}
            <div className='modal-field-group'>
              <div className='modal-input-container'>
                <input
                  type='text'
                  value={formData.name}
                  onChange={e => handleInputChange('name', e.target.value)}
                  className={errors.name ? 'error' : ''}
                  maxLength={20}
                  required
                  aria-describedby={errors.name ? 'name-error' : undefined}
                />
                <label>
                  Nome
                  <span className='modal-required'>*</span>
                </label>
                <span className='char-count'>{formData.name.length}/20</span>
                {formData.name && (
                  <button
                    type='button'
                    className='modal-clear-field'
                    onClick={() => handleInputChange('name', '')}
                    title='Limpar Nome'
                    aria-label='Limpar Nome'
                    style={{ top: 12 }}
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
              {errors.name && (
                <span id='name-error' className='error-message'>
                  <FaExclamationTriangle /> {errors.name}
                </span>
              )}
            </div>
            <div className='modal-field-group'>
              <div className='modal-input-container'>
                <input
                  type='url'
                  value={formData.url}
                  onChange={e => handleInputChange('url', e.target.value)}
                  className={errors.url ? 'error' : ''}
                  required
                  aria-describedby={errors.url ? 'url-error' : undefined}
                />
                <label>
                  URL
                  <span className='modal-required'>*</span>
                </label>
                {formData.url && (
                  <button
                    type='button'
                    className='modal-clear-field'
                    onClick={() => handleInputChange('url', '')}
                    title='Limpar URL'
                    aria-label='Limpar URL'
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
              {errors.url && (
                <span id='url-error' className='error-message'>
                  <FaExclamationTriangle /> {errors.url}
                </span>
              )}
            </div>

            {/* Ícone e cor do ícone */}
            <div className='modal-field-group'>
              <div className='color-grid' style={{ marginBottom: '0.5rem' }}>
                {COLORS.map(color => (
                  <button
                    key={color}
                    type='button'
                    className={`color-option small${formData.iconColor === color ? ' selected' : ''}`}
                    style={{ backgroundColor: color, width: 16, height: 16 }}
                    onClick={() => handleInputChange('iconColor', color)}
                    aria-label={`Selecionar cor do ícone ${color}`}
                  />
                ))}
              </div>
              <div className='icon-grid'>
                {TECH_ICONS.map(iconName => {
                  const IconComponent = FaIcons[iconName];
                  if (!IconComponent) return null;
                  return (
                    <button
                      key={iconName}
                      type='button'
                      className={`icon-option${formData.icon === iconName ? ' selected' : ''}`}
                      onClick={() => handleInputChange('icon', iconName)}
                      aria-label={`Selecionar ícone ${iconName}`}
                    >
                      <IconComponent style={{ color: formData.iconColor }} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tag e cor da tag */}
            <div className='modal-field-group'>
              <div className='modal-input-container'>
                <input
                  type='text'
                  value={formData.tagName}
                  onChange={e => handleInputChange('tagName', e.target.value)}
                  className={errors.tagName ? 'error' : ''}
                  maxLength={20}
                  required
                  aria-describedby={
                    errors.tagName ? 'tagName-error' : undefined
                  }
                  style={{ width: '100%' }}
                />
                <label>
                  Tag
                  <span className='modal-required'>*</span>
                </label>
                <span className='char-count'>{formData.tagName.length}/20</span>
                {formData.tagName && (
                  <button
                    type='button'
                    className='modal-clear-field'
                    onClick={() => handleInputChange('tagName', '')}
                    title='Limpar Tag'
                    aria-label='Limpar Tag'
                    style={{ top: 12 }}
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
              {/* Color grid da tag abaixo do input-container */}
              <div
                className='color-grid'
                style={{ marginTop: 8, width: '100%' }}
              >
                {COLORS.map(color => (
                  <button
                    key={color}
                    type='button'
                    className={`color-option small${formData.tagColor === color ? ' selected' : ''}`}
                    style={{ backgroundColor: color, width: 16, height: 16 }}
                    onClick={() => handleInputChange('tagColor', color)}
                    aria-label={`Selecionar cor da tag ${color}`}
                  />
                ))}
              </div>
              {errors.tagName && (
                <span id='tagName-error' className='error-message'>
                  <FaExclamationTriangle /> {errors.tagName}
                </span>
              )}
            </div>
          </div>
          <div className='modal-footer'>
            <button
              type='button'
              className='modal-action-button secondary'
              onClick={handleClose}
            >
              Cancelar
            </button>
            <button type='submit' className='modal-action-button primary'>
              <FaCheck /> {environment ? 'Salvar' : 'Criar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnvironmentModal;
