import React, { useState } from 'react';
import { FaEdit, FaTimes, FaCheck } from 'react-icons/fa';
import * as FaIcons from 'react-icons/fa';
import { FaExclamationTriangle } from 'react-icons/fa';

const EnvironmentCard = ({ environment, onEdit, onDelete, onOpen }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const IconComponent = FaIcons[environment.icon] || FaIcons.FaCode;

  const handleCardClick = () => {
    if (!showDeleteConfirm) {
      onOpen(environment.url);
    }
  };

  const handleEdit = e => {
    e.stopPropagation();
    onEdit(environment);
  };

  const handleDeleteClick = e => {
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = e => {
    e.stopPropagation();
    onDelete(environment.id);
    setShowDeleteConfirm(false);
  };

  const handleDeleteCancel = e => {
    e.stopPropagation();
    setShowDeleteConfirm(false);
  };

  return (
    <div
      className={`environment-card ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
      role='button'
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
      aria-label={`Abrir ambiente ${environment.name}`}
    >
      {/* Ações de hover */}
      {isHovered && !showDeleteConfirm && (
        <div className='environment-actions'>
          <button
            type='button'
            className='action-button'
            onClick={handleEdit}
            aria-label='Editar ambiente'
          >
            <FaEdit />
          </button>
          <button
            type='button'
            className='action-button'
            onClick={handleDeleteClick}
            aria-label='Excluir ambiente'
          >
            <FaTimes />
          </button>
        </div>
      )}

      {/* Confirmação de exclusão */}
      {showDeleteConfirm && (
        <div className='delete-confirm modern-confirm'>
          <p
            style={{
              fontWeight: 600,
              fontSize: '0.8rem',
              marginBottom: 16,
              textAlign: 'center',
            }}
          >
            Confirma exclusão?
          </p>
          <div
            style={{
              display: 'flex',
              gap: 32,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <FaCheck
              style={{
                color: '#22c55e',
                fontSize: 22,
                cursor: 'pointer',
                transition: 'color 0.2s',
              }}
              title='Confirmar exclusão'
              aria-label='Confirmar exclusão'
              tabIndex={0}
              onClick={handleDeleteConfirm}
              onKeyDown={e =>
                (e.key === 'Enter' || e.key === ' ') && handleDeleteConfirm(e)
              }
            />
            <FaTimes
              style={{
                color: '#ef4444',
                fontSize: 22,
                cursor: 'pointer',
                transition: 'color 0.2s',
              }}
              title='Cancelar exclusão'
              aria-label='Cancelar exclusão'
              tabIndex={0}
              onClick={handleDeleteCancel}
              onKeyDown={e =>
                (e.key === 'Enter' || e.key === ' ') && handleDeleteCancel(e)
              }
            />
          </div>
        </div>
      )}

      {/* Conteúdo do card */}
      {!showDeleteConfirm && (
        <div className='environment-content'>
          <div className='environment-icon'>
            <IconComponent
              style={{ color: environment.iconColor }}
              aria-hidden='true'
            />
          </div>
          <div className='environment-name' title={environment.name}>
            {environment.name}
          </div>
          <div
            className='environment-tag'
            style={{
              backgroundColor: environment.tagColor,
              color: '#ffffff',
            }}
            title={environment.tagName}
          >
            {environment.tagName}
          </div>
        </div>
      )}
    </div>
  );
};

export default EnvironmentCard;
