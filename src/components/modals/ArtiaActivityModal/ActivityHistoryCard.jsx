import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  FaExternalLinkAlt,
  FaTrash,
  FaChevronDown,
  FaChevronUp,
} from 'react-icons/fa';

const ActivityHistoryCard = ({ activities, onClearHistory }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!activities.length) {
    return null;
  }

  // Ordenar por data mais recente primeiro
  const sortedActivities = [...activities].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className='activity-history-card'>
      <div className='activity-history-header'>
        <button
          type='button'
          className='activity-history-toggle'
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <h3>Atividades Criadas</h3>
          {isCollapsed ? <FaChevronDown /> : <FaChevronUp />}
        </button>
        <button
          type='button'
          className='clear-history-btn'
          onClick={onClearHistory}
          title='Limpar histórico de atividades'
        >
          <FaTrash />
        </button>
      </div>

      {!isCollapsed && (
        <div className='activity-history-list'>
          {sortedActivities.map(activity => (
            <div key={activity.id} className='activity-history-item'>
              <div className='activity-item-content'>
                <div className='activity-id-link'>
                  <span className='activity-id'>#{activity.id}</span>
                  <a
                    href={activity.link}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='activity-link'
                    title='Abrir atividade no Artia'
                  >
                    <FaExternalLinkAlt />
                  </a>
                </div>
                <span className='activity-date'>
                  {new Date(activity.createdAt).toLocaleString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>

              <div className='activity-title'>{activity.title}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

ActivityHistoryCard.propTypes = {
  activities: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
    })
  ).isRequired,
  onClearHistory: PropTypes.func.isRequired,
};

export default ActivityHistoryCard;
