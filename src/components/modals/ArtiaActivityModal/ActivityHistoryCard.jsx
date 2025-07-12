import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  FaExternalLinkAlt,
  FaTrash,
  FaChevronDown,
  FaChevronUp,
} from 'react-icons/fa';

// Função para obter as configurações da badge baseado no tipo
const getActivityTypeBadge = type => {
  const badgeConfig = {
    Deploy: {
      text: 'Deploy',
      backgroundColor: 'var(--deploy-color)',
      textColor: 'var(--deploy-text-selected)',
    },
    'Bug retrabalho': {
      text: 'Bug retrabalho',
      backgroundColor: 'var(--bug-retrabalho-color)',
      textColor: 'var(--badge-text-selected)',
    },
    'Bug produção': {
      text: 'Bug Produção',
      backgroundColor: 'var(--bug-producao-color)',
      textColor: '#FFFFFF', // Mantém branco para melhor contraste no histórico
    },
  };

  return badgeConfig[type] || null;
};

// Função para filtrar atividades baseado no contexto
const filterActivitiesByContext = (activities, filterContext) => {
  if (!filterContext) {
    return activities; // Se não há contexto, retorna todas
  }

  return activities.filter(activity => {
    if (filterContext === 'bug') {
      // Para contexto de bug, mostra apenas atividades de bug
      return (
        activity.type === 'Bug retrabalho' || activity.type === 'Bug produção'
      );
    } else if (filterContext === 'deploy') {
      // Para contexto de deploy, mostra apenas atividades de deploy
      return activity.type === 'Deploy';
    }

    return true; // Se contexto não reconhecido, mostra todas
  });
};

const ActivityHistoryCard = ({ activities, onClearHistory, filterContext }) => {
  // Inicializar estado com valor do localStorage
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const savedState = localStorage.getItem('activityHistoryCollapsed');
    return savedState ? JSON.parse(savedState) : false;
  });

  // Salvar estado no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem(
      'activityHistoryCollapsed',
      JSON.stringify(isCollapsed)
    );
  }, [isCollapsed]);

  // Filtrar atividades baseado no contexto antes de verificar se há atividades
  const filteredActivities = filterActivitiesByContext(
    activities,
    filterContext
  );

  if (!filteredActivities.length) {
    return null;
  }

  // Ordenar por data mais recente primeiro
  const sortedActivities = [...filteredActivities].sort(
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
          {sortedActivities.map(activity => {
            const badgeConfig = getActivityTypeBadge(activity.type);

            return (
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

                <div className='activity-title-row'>
                  <div className='activity-title'>{activity.title}</div>
                  {badgeConfig && (
                    <span
                      className='activity-type-badge'
                      style={{
                        backgroundColor: badgeConfig.backgroundColor,
                        color: badgeConfig.textColor,
                        border: `1px solid ${badgeConfig.backgroundColor}`,
                      }}
                    >
                      {badgeConfig.text}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
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
      type: PropTypes.string,
      link: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
    })
  ).isRequired,
  onClearHistory: PropTypes.func.isRequired,
  filterContext: PropTypes.oneOf(['bug', 'deploy']),
};

export default ActivityHistoryCard;
