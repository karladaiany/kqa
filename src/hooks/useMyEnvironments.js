import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';

// Cores disponíveis para ícones e tags
export const COLORS = [
  '#3b82f6', // Azul
  '#10b981', // Verde
  '#f59e0b', // Amarelo
  '#ef4444', // Vermelho
  '#8b5cf6', // Roxo
  '#06b6d4', // Cyan
  '#f97316', // Laranja
  '#ec4899', // Rosa
  '#6b7280', // Cinza
  '#1f2937', // Cinza escuro
];

// Ícones relacionados à tecnologia e aprendizagem
export const TECH_ICONS = [
  'FaCode',
  'FaLaptopCode',
  'FaDesktop',
  'FaMobile',
  'FaTablet',
  'FaDatabase',
  'FaServer',
  'FaCloud',
  'FaGlobe',
  'FaLink',
  'FaRocket',
  'FaTools',
  'FaCog',
  'FaWrench',
  'FaBolt',
  'FaBook',
  'FaGraduationCap',
  'FaLightbulb',
  'FaFlask',
  'FaMicroscope',
  'FaChartBar',
  'FaChartLine',
  'FaFileAlt',
  'FaFolder',
  'FaArchive',
  'FaPlay',
  'FaPause',
  'FaStop',
  'FaForward',
  'FaBackward',
  'FaHeart',
  'FaStar',
  'FaFlag',
  'FaBookmark',
  'FaTag',
  'FaHome',
  'FaBuilding',
  'FaIndustry',
  'FaStore',
  'FaWarehouse',
  'FaShieldAlt',
  'FaLock',
  'FaKey',
  'FaUserShield',
  'FaEye',
  'FaEdit',
  'FaTrash',
  'FaPlus',
  'FaMinus',
  'FaCheck',
];

const STORAGE_KEY = 'kqa-my-environments';

const useMyEnvironments = () => {
  const [environments, setEnvironments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar ambientes do localStorage
  const loadEnvironments = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setEnvironments(Array.isArray(parsed) ? parsed : []);
      }
    } catch (error) {
      console.error('Erro ao carregar ambientes:', error);
      toast.error('Erro ao carregar ambientes salvos');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Salvar ambientes no localStorage
  const saveEnvironments = useCallback(envs => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(envs));
    } catch (error) {
      console.error('Erro ao salvar ambientes:', error);
      toast.error('Erro ao salvar ambientes');
    }
  }, []);

  // Adicionar novo ambiente
  const addEnvironment = useCallback(
    environment => {
      const newEnvironment = {
        id: Date.now().toString(),
        name: environment.name.trim(),
        url: environment.url.trim(),
        icon: environment.icon,
        iconColor: environment.iconColor,
        tagName: environment.tagName.trim(),
        tagColor: environment.tagColor,
        createdAt: new Date().toISOString(),
      };

      setEnvironments(prev => {
        const updated = [...prev, newEnvironment];
        saveEnvironments(updated);
        return updated;
      });

      toast.success('Ambiente adicionado com sucesso!');
      return newEnvironment;
    },
    [saveEnvironments]
  );

  // Editar ambiente existente
  const editEnvironment = useCallback(
    (id, updatedEnvironment) => {
      setEnvironments(prev => {
        const updated = prev.map(env =>
          env.id === id
            ? {
                ...env,
                name: updatedEnvironment.name.trim(),
                url: updatedEnvironment.url.trim(),
                icon: updatedEnvironment.icon,
                iconColor: updatedEnvironment.iconColor,
                tagName: updatedEnvironment.tagName.trim(),
                tagColor: updatedEnvironment.tagColor,
                updatedAt: new Date().toISOString(),
              }
            : env
        );
        saveEnvironments(updated);
        return updated;
      });

      toast.success('Ambiente atualizado com sucesso!');
    },
    [saveEnvironments]
  );

  // Remover ambiente
  const removeEnvironment = useCallback(
    id => {
      setEnvironments(prev => {
        const updated = prev.filter(env => env.id !== id);
        saveEnvironments(updated);
        return updated;
      });

      toast.success('Ambiente removido com sucesso!');
    },
    [saveEnvironments]
  );

  // Abrir ambiente em nova aba
  const openEnvironment = useCallback(url => {
    try {
      // Validar URL
      let finalUrl = url.trim();
      if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
        finalUrl = `https://${finalUrl}`;
      }

      // Validar se é uma URL válida
      new URL(finalUrl);

      window.open(finalUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Erro ao abrir ambiente:', error);
      toast.error('URL inválida ou erro ao abrir o ambiente');
    }
  }, []);

  // Validar URL
  const validateUrl = useCallback(url => {
    if (!url || !url.trim()) return false;

    try {
      const urlToValidate = url.trim();
      const finalUrl =
        urlToValidate.startsWith('http://') ||
        urlToValidate.startsWith('https://')
          ? urlToValidate
          : `https://${urlToValidate}`;

      new URL(finalUrl);
      return true;
    } catch {
      return false;
    }
  }, []);

  // Carregar ambientes na inicialização
  useEffect(() => {
    loadEnvironments();
  }, [loadEnvironments]);

  return {
    environments,
    isLoading,
    addEnvironment,
    editEnvironment,
    removeEnvironment,
    openEnvironment,
    validateUrl,
  };
};

export default useMyEnvironments;
