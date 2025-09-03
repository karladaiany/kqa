import { useState, useEffect, useCallback } from 'react';

// Chaves de armazenamento para campos customizados
const STORAGE_KEYS = {
  ACTIVITY_TYPES: 'custom_activity_types',
  STATUS_OPTIONS: 'custom_status_options',
  FUNCTIONALITY_OPTIONS: 'custom_functionality_options',
  SUB_FUNCTIONALITY_OPTIONS: 'custom_sub_functionality_options',
};

// Tipos de campos customizados
export const FIELD_TYPES = {
  TIPO_ATIVIDADE: 'tipo_atividade',
  SITUACAO: 'situacao',
  FUNCIONALIDADE: 'funcionalidade',
  SUB_FUNCIONALIDADE: 'sub_funcionalidade',
};

// Configuração dos tipos de campos
export const FIELD_TYPE_CONFIG = {
  [FIELD_TYPES.TIPO_ATIVIDADE]: {
    name: 'Tipo de Atividade',
    icon: '🎯',
    description: 'Tipos de atividade disponíveis para criação',
    storageKey: STORAGE_KEYS.ACTIVITY_TYPES,
  },
  [FIELD_TYPES.SITUACAO]: {
    name: 'Situação',
    icon: '📊',
    description: 'Status disponíveis para atividades',
    storageKey: STORAGE_KEYS.STATUS_OPTIONS,
  },
  [FIELD_TYPES.FUNCIONALIDADE]: {
    name: 'Funcionalidade',
    icon: '⚙️',
    description: 'Funcionalidades disponíveis para atividades',
    storageKey: STORAGE_KEYS.FUNCTIONALITY_OPTIONS,
  },
  [FIELD_TYPES.SUB_FUNCIONALIDADE]: {
    name: 'Sub-funcionalidade',
    icon: '🔧',
    description: 'Sub-funcionalidades disponíveis para atividades',
    storageKey: STORAGE_KEYS.SUB_FUNCTIONALITY_OPTIONS,
  },
};

export const useCustomFields = () => {
  const [customFields, setCustomFields] = useState({
    [FIELD_TYPES.TIPO_ATIVIDADE]: [],
    [FIELD_TYPES.SITUACAO]: [],
    [FIELD_TYPES.FUNCIONALIDADE]: [],
    [FIELD_TYPES.SUB_FUNCIONALIDADE]: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  // Carregar campos customizados do localStorage
  const loadCustomFields = useCallback(() => {
    try {
      const loadedFields = {};
      Object.entries(FIELD_TYPE_CONFIG).forEach(([type, config]) => {
        const saved = localStorage.getItem(config.storageKey);
        loadedFields[type] = saved ? JSON.parse(saved) : [];
      });
      setCustomFields(loadedFields);
    } catch (error) {
      console.error('Erro ao carregar campos customizados:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Salvar campos customizados no localStorage
  const saveCustomFields = useCallback((type, fields) => {
    try {
      const config = FIELD_TYPE_CONFIG[type];
      localStorage.setItem(config.storageKey, JSON.stringify(fields));
      
      // Atualizar estado local
      setCustomFields(prev => ({
        ...prev,
        [type]: fields,
      }));
      
      return true;
    } catch (error) {
      console.error('Erro ao salvar campos customizados:', error);
      return false;
    }
  }, []);

  // Adicionar campo customizado
  const addCustomField = useCallback((type, value) => {
    if (!value?.trim()) return false;

    const currentFields = customFields[type];
    const trimmedValue = value.trim();

    // Verificar se já existe
    if (currentFields.includes(trimmedValue)) {
      return false;
    }

    const updatedFields = [...currentFields, trimmedValue];
    return saveCustomFields(type, updatedFields);
  }, [customFields, saveCustomFields]);

  // Editar campo customizado
  const editCustomField = useCallback((type, index, newValue) => {
    if (!newValue?.trim()) return false;

    const currentFields = customFields[type];
    const trimmedValue = newValue.trim();

    // Verificar se já existe (exceto o próprio item sendo editado)
    const exists = currentFields.some((field, i) => i !== index && field === trimmedValue);
    if (exists) {
      return false;
    }

    const updatedFields = [...currentFields];
    updatedFields[index] = trimmedValue;
    
    return saveCustomFields(type, updatedFields);
  }, [customFields, saveCustomFields]);

  // Excluir campo customizado
  const deleteCustomField = useCallback((type, index) => {
    const currentFields = customFields[type];
    const updatedFields = currentFields.filter((_, i) => i !== index);
    return saveCustomFields(type, updatedFields);
  }, [customFields, saveCustomFields]);

  // Obter campos customizados combinados com campos padrão
  const getCombinedFields = useCallback((type, defaultFields = []) => {
    const custom = customFields[type] || [];
    return [...defaultFields, ...custom];
  }, [customFields]);

  // Obter campos customizados por tipo
  const getCustomFieldsByType = useCallback((type) => {
    return customFields[type] || [];
  }, [customFields]);

  // Verificar se um campo existe (customizado ou padrão)
  const fieldExists = useCallback((type, value, defaultFields = []) => {
    if (!value) return false;
    
    const custom = customFields[type] || [];
    const allFields = [...defaultFields, ...custom];
    return allFields.includes(value);
  }, [customFields]);

  // Limpar todos os campos customizados
  const clearAllCustomFields = useCallback(() => {
    try {
      Object.values(FIELD_TYPE_CONFIG).forEach(config => {
        localStorage.removeItem(config.storageKey);
      });
      
      setCustomFields({
        [FIELD_TYPES.TIPO_ATIVIDADE]: [],
        [FIELD_TYPES.SITUACAO]: [],
        [FIELD_TYPES.FUNCIONALIDADE]: [],
        [FIELD_TYPES.SUB_FUNCIONALIDADE]: [],
      });
      
      return true;
    } catch (error) {
      console.error('Erro ao limpar campos customizados:', error);
      return false;
    }
  }, []);

  // Carregar campos na inicialização
  useEffect(() => {
    loadCustomFields();
  }, [loadCustomFields]);

  return {
    // Estado
    customFields,
    isLoading,
    
    // Ações
    loadCustomFields,
    saveCustomFields,
    addCustomField,
    editCustomField,
    deleteCustomField,
    clearAllCustomFields,
    
    // Utilitários
    getCombinedFields,
    getCustomFieldsByType,
    fieldExists,
    
    // Constantes
    FIELD_TYPES,
    FIELD_TYPE_CONFIG,
  };
};



