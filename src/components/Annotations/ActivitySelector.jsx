import React, { useState, useMemo } from 'react';
import { FaSearch, FaHistory, FaStar, FaTrash, FaPlus } from 'react-icons/fa';
import { useActivityStorage } from '../../hooks';
import './ActivitySelector.css';

const ActivitySelector = ({ onSelectActivity, onAddActivity }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('recent'); // 'recent', 'popular', 'search'
  
  const {
    activities,
    isLoading,
    searchActivities,
    getMostUsedActivities,
    getRecentActivities,
    updateActivityUsage,
    removeActivity,
  } = useActivityStorage();

  // Filtrar atividades baseado na busca
  const filteredActivities = useMemo(() => {
    if (activeTab === 'search' && searchTerm) {
      return searchActivities(searchTerm);
    }
    return [];
  }, [searchTerm, activeTab, searchActivities]);

  // Obter atividades baseado na aba ativa
  const displayActivities = useMemo(() => {
    switch (activeTab) {
      case 'recent':
        return getRecentActivities(10);
      case 'popular':
        return getMostUsedActivities(10);
      case 'search':
        return filteredActivities;
      default:
        return [];
    }
  }, [activeTab, getRecentActivities, getMostUsedActivities, filteredActivities]);

  const handleActivitySelect = (activity) => {
    updateActivityUsage(activity.id);
    onSelectActivity(activity);
  };

  const handleAddToStorage = () => {
    onAddActivity();
  };

  if (isLoading) {
    return (
      <div className="activity-selector">
        <div className="activity-selector-loading">
          Carregando atividades...
        </div>
      </div>
    );
  }

  return (
    <div className="activity-selector">
      {/* Barra de busca */}
      <div className="activity-selector-search">
        <div className="search-input-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Buscar atividades..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setActiveTab('search')}
            className="search-input"
          />
        </div>
        <button
          type="button"
          className="add-activity-btn"
          onClick={handleAddToStorage}
          title="Adicionar atividade atual ao histórico"
        >
          <FaPlus />
        </button>
      </div>

      {/* Abas */}
      <div className="activity-selector-tabs">
        <button
          type="button"
          className={`tab-button ${activeTab === 'recent' ? 'active' : ''}`}
          onClick={() => setActiveTab('recent')}
        >
          <FaHistory />
          Recentes
        </button>
        <button
          type="button"
          className={`tab-button ${activeTab === 'popular' ? 'active' : ''}`}
          onClick={() => setActiveTab('popular')}
        >
          <FaStar />
          Populares
        </button>
        {searchTerm && (
          <button
            type="button"
            className={`tab-button ${activeTab === 'search' ? 'active' : ''}`}
            onClick={() => setActiveTab('search')}
          >
            <FaSearch />
            Busca ({filteredActivities.length})
          </button>
        )}
      </div>

      {/* Lista de atividades */}
      <div className="activity-selector-list">
        {displayActivities.length === 0 ? (
          <div className="activity-selector-empty">
            {activeTab === 'search' && searchTerm 
              ? 'Nenhuma atividade encontrada para "' + searchTerm + '"'
              : activeTab === 'recent'
              ? 'Nenhuma atividade recente'
              : 'Nenhuma atividade popular'
            }
          </div>
        ) : (
          displayActivities.map((activity) => (
            <div key={activity.id} className="activity-item">
              <div 
                className="activity-item-content"
                onClick={() => handleActivitySelect(activity)}
              >
                <div className="activity-title">
                  {activity.title || 'Sem título'}
                </div>
                {activity.description && (
                  <div className="activity-description">
                    {activity.description}
                  </div>
                )}
                {activity.link && (
                  <div className="activity-link">
                    {activity.link}
                  </div>
                )}
                <div className="activity-meta">
                  <span className="activity-use-count">
                    Usado {activity.useCount} vez{activity.useCount !== 1 ? 'es' : ''}
                  </span>
                  <span className="activity-last-used">
                    {new Date(activity.lastUsed).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="activity-remove-btn"
                onClick={() => removeActivity(activity.id)}
                title="Remover atividade"
              >
                <FaTrash />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActivitySelector; 