import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  FaTimes,
  FaPlus,
  FaTrash,
  FaEdit,
  FaSave,
  FaCog,
  FaList,
  FaCheck,
  FaExclamationTriangle,
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useCustomFields, FIELD_TYPES, FIELD_TYPE_CONFIG } from '../../../hooks/useCustomFields';
import './CustomFieldsModal.css';

const CustomFieldsModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState(FIELD_TYPES.TIPO_ATIVIDADE);
  const [editingField, setEditingField] = useState(null);
  const [newFieldValue, setNewFieldValue] = useState('');
  
  const {
    customFields,
    isLoading,
    addCustomField,
    editCustomField,
    deleteCustomField,
  } = useCustomFields();

  // Carregar campos customizados quando o modal abrir
  useEffect(() => {
    if (isOpen) {
      // Os campos são carregados automaticamente pelo hook
    }
  }, [isOpen]);

  const handleAddField = (type) => {
    if (!newFieldValue.trim()) {
      toast.error('Digite um valor para o campo');
      return;
    }

    const success = addCustomField(type, newFieldValue);
    if (success) {
      const config = FIELD_TYPE_CONFIG[type];
      toast.success(`${config.name} adicionado com sucesso!`);
      setNewFieldValue('');
    } else {
      toast.error('Este valor já existe');
    }
  };

  const handleEditField = (type, index) => {
    const currentFields = customFields[type];
    const currentValue = currentFields[index];
    
    setEditingField({ type, index, value: currentValue });
    setNewFieldValue(currentValue);
  };

  const handleSaveEdit = () => {
    if (!editingField || !newFieldValue.trim()) {
      toast.error('Digite um valor válido');
      return;
    }

    const { type, index } = editingField;
    const success = editCustomField(type, index, newFieldValue);
    
    if (success) {
      const config = FIELD_TYPE_CONFIG[type];
      toast.success(`${config.name} atualizado com sucesso!`);
      setEditingField(null);
      setNewFieldValue('');
    } else {
      toast.error('Este valor já existe');
    }
  };

  const handleDeleteField = (type, index) => {
    if (window.confirm('Tem certeza que deseja excluir este campo?')) {
      const success = deleteCustomField(type, index);
      if (success) {
        const config = FIELD_TYPE_CONFIG[type];
        toast.success(`${config.name} excluído com sucesso!`);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setNewFieldValue('');
  };

  const handleKeyPress = (e, action, type, index = null) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (action === 'add') {
        handleAddField(type);
      } else if (action === 'save') {
        handleSaveEdit();
      }
    } else if (e.key === 'Escape') {
      if (action === 'save') {
        handleCancelEdit();
      }
    }
  };

  const renderFieldList = (type) => {
    const fields = customFields[type];
    const config = FIELD_TYPE_CONFIG[type];

    if (fields.length === 0) {
      return (
        <div className="empty-state">
          <FaList className="empty-icon" />
          <p>Nenhum campo customizado adicionado</p>
          <small>Adicione campos para personalizar as opções disponíveis</small>
        </div>
      );
    }

    return (
      <div className="field-list">
        {fields.map((field, index) => (
          <div key={index} className="field-item">
            {editingField?.type === type && editingField?.index === index ? (
              <div className="field-edit">
                <input
                  type="text"
                  value={newFieldValue}
                  onChange={(e) => setNewFieldValue(e.target.value)}
                  onKeyDown={(e) => handleKeyPress(e, 'save')}
                  placeholder="Digite o novo valor"
                  autoFocus
                />
                <div className="field-actions">
                  <button
                    className="action-button save"
                    onClick={handleSaveEdit}
                    title="Salvar"
                  >
                    <FaCheck />
                  </button>
                  <button
                    className="action-button cancel"
                    onClick={handleCancelEdit}
                    title="Cancelar"
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <span className="field-value">{field}</span>
                <div className="field-actions">
                  <button
                    className="action-button edit"
                    onClick={() => handleEditField(type, index)}
                    title="Editar"
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="action-button delete"
                    onClick={() => handleDeleteField(type, index)}
                    title="Excluir"
                  >
                    <FaTrash />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderTabContent = (type) => {
    const config = FIELD_TYPE_CONFIG[type];
    const isEditing = editingField?.type === type;

    return (
      <div className="tab-content">
        <div className="tab-header">
          <div className="tab-info">
            <span className="tab-icon">{config.icon}</span>
            <div>
              <h3>{config.name}</h3>
              <p>{config.description}</p>
            </div>
          </div>
        </div>

        <div className="add-field-section">
          <div className="add-field-input">
            <input
              type="text"
              value={newFieldValue}
              onChange={(e) => setNewFieldValue(e.target.value)}
              onKeyDown={(e) => handleKeyPress(e, 'add', type)}
              placeholder={`Adicionar ${config.name.toLowerCase()}`}
              disabled={isEditing}
            />
            <button
              className="add-button"
              onClick={() => handleAddField(type)}
              disabled={isEditing || !newFieldValue.trim()}
              title={`Adicionar ${config.name.toLowerCase()}`}
            >
              <FaPlus />
            </button>
          </div>
          {isEditing && (
            <div className="edit-notice">
              <FaExclamationTriangle />
              <span>Editando campo - pressione Enter para salvar ou Esc para cancelar</span>
            </div>
          )}
        </div>

        <div className="fields-section">
          <h4>Campos Customizados ({customFields[type].length})</h4>
          {renderFieldList(type)}
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container custom-fields-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <FaCog className="modal-icon" />
            Adicionar Campos Customizados
          </h2>
          <button
            className="modal-close-button"
            onClick={onClose}
            title="Fechar modal"
          >
            <FaTimes />
          </button>
        </div>

        <div className="modal-body">
          <div className="tabs-container">
            <div className="tabs-header">
              {Object.entries(FIELD_TYPE_CONFIG).map(([type, config]) => (
                <button
                  key={type}
                  className={`tab-button ${activeTab === type ? 'active' : ''}`}
                  onClick={() => setActiveTab(type)}
                >
                  <span className="tab-icon">{config.icon}</span>
                  <span className="tab-label">{config.name}</span>
                  <span className="tab-count">({customFields[type].length})</span>
                </button>
              ))}
            </div>

            <div className="tabs-content">
              {renderTabContent(activeTab)}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <div className="footer-info">
            <FaExclamationTriangle className="info-icon" />
            <span>Os campos customizados serão aplicados em toda a aplicação</span>
          </div>
          <button className="modal-action-button secondary" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

CustomFieldsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CustomFieldsModal;
