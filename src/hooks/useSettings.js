import { useState, useEffect, useCallback } from 'react';
import { encrypt, decrypt } from '../utils/crypto';

const SETTINGS_STORAGE_KEY = 'kqa_settings';
const ARTIA_CREDENTIALS_KEY = 'artia_credentials';

// Lista de funcionalidades disponíveis
export const AVAILABLE_FEATURES = {
  DOCUMENTOS: 'documentos',
  DADOS_PESSOAIS: 'dados-pessoais',
  PRODUTO: 'produto',
  CARTAO: 'cartao',
  CARACTERES: 'caracteres',
  CONTADOR: 'contador',
  DADOS_COMPLEMENTARES: 'dados-complementares',
  FILE_GENERATOR: 'file-generator',
  BUG: 'bug',
  TEST_STATUS: 'test-status',
  DEPLOY: 'deploy',
  ACTIVITY_IMPORT: 'activity-import',
  ANNOTATIONS: 'annotations',
};

// Configurações padrão
const DEFAULT_SETTINGS = {
  features: {
    [AVAILABLE_FEATURES.DOCUMENTOS]: true,
    [AVAILABLE_FEATURES.DADOS_PESSOAIS]: true,
    [AVAILABLE_FEATURES.PRODUTO]: true,
    [AVAILABLE_FEATURES.CARTAO]: true,
    [AVAILABLE_FEATURES.CARACTERES]: true,
    [AVAILABLE_FEATURES.CONTADOR]: true,
    [AVAILABLE_FEATURES.DADOS_COMPLEMENTARES]: true,
    [AVAILABLE_FEATURES.FILE_GENERATOR]: true,
    [AVAILABLE_FEATURES.BUG]: true,
    [AVAILABLE_FEATURES.TEST_STATUS]: true,
    [AVAILABLE_FEATURES.DEPLOY]: true,
    [AVAILABLE_FEATURES.ACTIVITY_IMPORT]: true,
    [AVAILABLE_FEATURES.ANNOTATIONS]: true,
  },
};

const useSettings = () => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [artiaCredentials, setArtiaCredentials] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [hasUserModifiedSettings, setHasUserModifiedSettings] = useState(false);

  // Carregar configurações do localStorage
  const loadSettings = useCallback(() => {
    try {
      const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
      const savedCredentials = localStorage.getItem(ARTIA_CREDENTIALS_KEY);

      // Se há dados salvos, marca que o usuário já modificou as configurações
      if (savedSettings || savedCredentials) {
        setHasUserModifiedSettings(true);
      }

      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({
          ...prev,
          ...parsed,
          features: {
            ...prev.features,
            ...parsed.features,
          },
        }));
      }

      // Carregar credenciais criptografadas
      if (savedCredentials) {
        try {
          const decrypted = JSON.parse(decrypt(savedCredentials));
          setArtiaCredentials(decrypted);
        } catch (error) {
          console.warn('Erro ao descriptografar credenciais:', error);
          setArtiaCredentials({ email: '', password: '' });
        }
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Salvar configurações no localStorage
  const saveSettings = useCallback(
    newSettings => {
      try {
        const settingsToSave = {
          ...settings,
          ...newSettings,
          features: {
            ...settings.features,
            ...newSettings.features,
          },
        };

        // Só salva no localStorage se o usuário já modificou as configurações
        if (hasUserModifiedSettings) {
          localStorage.setItem(
            SETTINGS_STORAGE_KEY,
            JSON.stringify(settingsToSave)
          );
        }
        setSettings(settingsToSave);
      } catch (error) {
        console.error('Erro ao salvar configurações:', error);
      }
    },
    [settings, hasUserModifiedSettings]
  );

  // Salvar credenciais do Artia de forma criptografada
  const saveArtiaCredentials = useCallback(credentials => {
    try {
      const encrypted = encrypt(JSON.stringify(credentials));
      localStorage.setItem(ARTIA_CREDENTIALS_KEY, encrypted);
      setArtiaCredentials(credentials);
      setHasUserModifiedSettings(true);
    } catch (error) {
      console.error('Erro ao salvar credenciais:', error);
    }
  }, []);

  // Limpar credenciais do Artia
  const clearArtiaCredentials = useCallback(() => {
    try {
      localStorage.removeItem(ARTIA_CREDENTIALS_KEY);
      setArtiaCredentials({ email: '', password: '' });
      setHasUserModifiedSettings(true);
    } catch (error) {
      console.error('Erro ao limpar credenciais:', error);
    }
  }, []);

  // Verificar se uma funcionalidade está visível
  const isFeatureVisible = useCallback(
    featureId => {
      return settings.features[featureId] !== false;
    },
    [settings.features]
  );

  // Alternar visibilidade de uma funcionalidade
  const toggleFeature = useCallback(
    featureId => {
      setHasUserModifiedSettings(true);
      saveSettings({
        features: {
          [featureId]: !settings.features[featureId],
        },
      });
    },
    [settings.features, saveSettings]
  );

  // Verificar se as credenciais do Artia estão configuradas
  const hasArtiaCredentials = useCallback(() => {
    return !!(artiaCredentials.email && artiaCredentials.password);
  }, [artiaCredentials]);

  // Carregar configurações na inicialização
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  return {
    settings,
    artiaCredentials,
    isLoading,
    isFeatureVisible,
    toggleFeature,
    saveSettings,
    saveArtiaCredentials,
    clearArtiaCredentials,
    hasArtiaCredentials,
    AVAILABLE_FEATURES,
  };
};

export default useSettings;
