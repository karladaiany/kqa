import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';

const STORAGE_KEY = 'kqa-activity-storage';
const MAX_ACTIVITIES = 50; // Máximo de atividades salvas

/**
 * Hook para gerenciar armazenamento local de atividades
 */
export const useActivityStorage = () => {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar atividades do localStorage
  const loadActivities = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setActivities(Array.isArray(parsed) ? parsed : []);
      }
    } catch (error) {
      console.error('Erro ao carregar atividades:', error);
      toast.error('Erro ao carregar atividades salvas');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Salvar atividades no localStorage
  const saveActivities = useCallback((activitiesList) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(activitiesList));
    } catch (error) {
      console.error('Erro ao salvar atividades:', error);
      toast.error('Erro ao salvar atividades');
    }
  }, []);

  // Adicionar nova atividade
  const addActivity = useCallback((activityData) => {
    const newActivity = {
      id: Date.now().toString(),
      title: activityData.title?.trim() || '',
      link: activityData.link?.trim() || '',
      description: activityData.description?.trim() || '',
      createdAt: new Date().toISOString(),
      lastUsed: new Date().toISOString(),
      useCount: 1,
    };

    setActivities(prev => {
      // Verificar se já existe uma atividade com o mesmo título
      const existingIndex = prev.findIndex(
        activity => activity.title.toLowerCase() === newActivity.title.toLowerCase()
      );

      let updatedActivities;
      if (existingIndex >= 0) {
        // Atualizar atividade existente
        updatedActivities = [...prev];
        updatedActivities[existingIndex] = {
          ...updatedActivities[existingIndex],
          link: newActivity.link || updatedActivities[existingIndex].link,
          description: newActivity.description || updatedActivities[existingIndex].description,
          lastUsed: newActivity.lastUsed,
          useCount: updatedActivities[existingIndex].useCount + 1,
        };
      } else {
        // Adicionar nova atividade
        updatedActivities = [newActivity, ...prev];
        
        // Manter apenas as MAX_ACTIVITIES mais recentes
        if (updatedActivities.length > MAX_ACTIVITIES) {
          updatedActivities = updatedActivities.slice(0, MAX_ACTIVITIES);
        }
      }

      saveActivities(updatedActivities);
      return updatedActivities;
    });

    toast.success('Atividade salva com sucesso!');
    return newActivity;
  }, [saveActivities]);

  // Atualizar contador de uso de uma atividade
  const updateActivityUsage = useCallback((activityId) => {
    setActivities(prev => {
      const updated = prev.map(activity => 
        activity.id === activityId 
          ? { 
              ...activity, 
              lastUsed: new Date().toISOString(),
              useCount: activity.useCount + 1
            }
          : activity
      );
      saveActivities(updated);
      return updated;
    });
  }, [saveActivities]);

  // Remover atividade
  const removeActivity = useCallback((activityId) => {
    setActivities(prev => {
      const updated = prev.filter(activity => activity.id !== activityId);
      saveActivities(updated);
      return updated;
    });
    toast.success('Atividade removida!');
  }, [saveActivities]);

  // Limpar todas as atividades
  const clearAllActivities = useCallback(() => {
    if (window.confirm('Tem certeza que deseja limpar todas as atividades salvas?')) {
      setActivities([]);
      saveActivities([]);
      toast.success('Todas as atividades foram removidas!');
    }
  }, [saveActivities]);

  // Buscar atividades por termo
  const searchActivities = useCallback((searchTerm) => {
    if (!searchTerm?.trim()) return activities;

    const term = searchTerm.toLowerCase();
    return activities.filter(activity => 
      activity.title.toLowerCase().includes(term) ||
      activity.description.toLowerCase().includes(term) ||
      activity.link.toLowerCase().includes(term)
    );
  }, [activities]);

  // Obter atividades mais usadas
  const getMostUsedActivities = useCallback((limit = 10) => {
    return [...activities]
      .sort((a, b) => b.useCount - a.useCount)
      .slice(0, limit);
  }, [activities]);

  // Obter atividades recentes
  const getRecentActivities = useCallback((limit = 10) => {
    return [...activities]
      .sort((a, b) => new Date(b.lastUsed) - new Date(a.lastUsed))
      .slice(0, limit);
  }, [activities]);

  // Carregar atividades ao inicializar
  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  return {
    activities,
    isLoading,
    addActivity,
    updateActivityUsage,
    removeActivity,
    clearAllActivities,
    searchActivities,
    getMostUsedActivities,
    getRecentActivities,
  };
}; 