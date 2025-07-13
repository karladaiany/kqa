import React, { useState } from 'react';
import { FaPlus, FaGlobe } from 'react-icons/fa';
import useMyEnvironments from '../../hooks/useMyEnvironments';
import EnvironmentCard from './EnvironmentCard';
import EnvironmentModal from './EnvironmentModal';

const MyEnvironmentsSection = () => {
  const {
    environments,
    isLoading,
    addEnvironment,
    editEnvironment,
    removeEnvironment,
    openEnvironment,
    validateUrl,
  } = useMyEnvironments();

  const [showModal, setShowModal] = useState(false);
  const [editingEnvironment, setEditingEnvironment] = useState(null);

  const handleAddEnvironment = () => {
    setEditingEnvironment(null);
    setShowModal(true);
  };

  const handleEditEnvironment = environment => {
    setEditingEnvironment(environment);
    setShowModal(true);
  };

  const handleSaveEnvironment = environmentData => {
    if (editingEnvironment) {
      editEnvironment(editingEnvironment.id, environmentData);
    } else {
      addEnvironment(environmentData);
    }
    setEditingEnvironment(null);
  };

  const handleDeleteEnvironment = environmentId => {
    removeEnvironment(environmentId);
  };

  const handleOpenEnvironment = url => {
    openEnvironment(url);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingEnvironment(null);
  };

  if (isLoading) {
    return (
      <div className='my-environments-section'>
        <div className='section-header'>
          <h4>
            <FaGlobe className='section-icon' />
            Meus ambientes
          </h4>
        </div>
        <div className='loading-state'>
          <p>Carregando ambientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='my-environments-section'>
      <div className='section-header'>
        <h4>
          <FaGlobe className='section-icon' />
          Meus ambientes
        </h4>
        <button
          type='button'
          className='global-toolbar-button action-add'
          onClick={handleAddEnvironment}
          aria-label='Adicionar novo ambiente'
          title='Adicionar novo ambiente'
        >
          <FaPlus />
        </button>
      </div>

      {environments.length === 0 ? (
        <div className='empty-state'>
          <p>Nenhum ambiente cadastrado.</p>
          <button
            type='button'
            className='global-toolbar-button action-add'
            onClick={handleAddEnvironment}
            style={{ width: 'auto', padding: '0.5rem 1rem' }}
          >
            <FaPlus /> Adicionar Primeiro Ambiente
          </button>
        </div>
      ) : (
        <div className='environments-grid'>
          {environments.map(environment => (
            <EnvironmentCard
              key={environment.id}
              environment={environment}
              onEdit={handleEditEnvironment}
              onDelete={handleDeleteEnvironment}
              onOpen={handleOpenEnvironment}
            />
          ))}
        </div>
      )}

      <EnvironmentModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onSave={handleSaveEnvironment}
        environment={editingEnvironment}
        validateUrl={validateUrl}
      />
    </div>
  );
};

export default MyEnvironmentsSection;
