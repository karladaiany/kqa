import { ACTIVITY_TYPES, FUNCIONALIDADE_OPTIONS, CUSTOM_STATUS_OPTIONS } from '../constants/artiaOptions';

/**
 * Utilitário para integrar campos customizados com as constantes existentes
 */
export class CustomFieldsIntegrator {
  constructor() {
    this.storageKeys = {
      ACTIVITY_TYPES: 'custom_activity_types',
      STATUS_OPTIONS: 'custom_status_options',
      FUNCTIONALITY_OPTIONS: 'custom_functionality_options',
      SUB_FUNCTIONALITY_OPTIONS: 'custom_sub_functionality_options',
    };
  }

  /**
   * Carregar campos customizados do localStorage
   */
  loadCustomFields() {
    const customFields = {};
    
    try {
      Object.entries(this.storageKeys).forEach(([key, storageKey]) => {
        const saved = localStorage.getItem(storageKey);
        customFields[key] = saved ? JSON.parse(saved) : [];
      });
    } catch (error) {
      console.error('Erro ao carregar campos customizados:', error);
    }
    
    return customFields;
  }

  /**
   * Obter tipos de atividade combinados (padrão + customizados)
   */
  getCombinedActivityTypes() {
    const customFields = this.loadCustomFields();
    const defaultTypes = Object.values(ACTIVITY_TYPES);
    const customTypes = customFields.ACTIVITY_TYPES || [];
    
    return [...defaultTypes, ...customTypes];
  }

  /**
   * Obter opções de situação combinadas (padrão + customizadas)
   */
  getCombinedStatusOptions() {
    const customFields = this.loadCustomFields();
    const defaultStatus = CUSTOM_STATUS_OPTIONS.map(status => status.name);
    const customStatus = customFields.STATUS_OPTIONS || [];
    
    return [...defaultStatus, ...customStatus];
  }

  /**
   * Obter opções de funcionalidade combinadas (padrão + customizadas)
   */
  getCombinedFunctionalityOptions() {
    const customFields = this.loadCustomFields();
    const defaultFunctionalities = Object.keys(FUNCIONALIDADE_OPTIONS);
    const customFunctionalities = customFields.FUNCTIONALITY_OPTIONS || [];
    
    return [...defaultFunctionalities, ...customFunctionalities];
  }

  /**
   * Obter sub-funcionalidades para uma funcionalidade específica
   */
  getSubFunctionalitiesForFunctionality(functionality) {
    const customFields = this.loadCustomFields();
    const defaultSubFuncs = FUNCIONALIDADE_OPTIONS[functionality] || [];
    const customSubFuncs = customFields.SUB_FUNCTIONALITY_OPTIONS || [];
    
    // Para sub-funcionalidades customizadas, incluímos todas
    // pois não há mapeamento específico por funcionalidade
    return [...defaultSubFuncs, ...customSubFuncs];
  }

  /**
   * Verificar se um tipo de atividade existe (padrão ou customizado)
   */
  activityTypeExists(activityType) {
    if (!activityType) return false;
    
    const combinedTypes = this.getCombinedActivityTypes();
    return combinedTypes.includes(activityType);
  }

  /**
   * Verificar se uma situação existe (padrão ou customizada)
   */
  statusExists(status) {
    if (!status) return false;
    
    const combinedStatus = this.getCombinedStatusOptions();
    return combinedStatus.includes(status);
  }

  /**
   * Verificar se uma funcionalidade existe (padrão ou customizada)
   */
  functionalityExists(functionality) {
    if (!functionality) return false;
    
    const combinedFunctionalities = this.getCombinedFunctionalityOptions();
    return combinedFunctionalities.includes(functionality);
  }

  /**
   * Verificar se uma sub-funcionalidade existe para uma funcionalidade específica
   */
  subFunctionalityExists(functionality, subFunctionality) {
    if (!subFunctionality) return false;
    
    const subFuncs = this.getSubFunctionalitiesForFunctionality(functionality);
    return subFuncs.includes(subFunctionality);
  }

  /**
   * Obter todas as opções combinadas em um objeto
   */
  getAllCombinedOptions() {
    return {
      activityTypes: this.getCombinedActivityTypes(),
      statusOptions: this.getCombinedStatusOptions(),
      functionalityOptions: this.getCombinedFunctionalityOptions(),
      // Para sub-funcionalidades, retornamos todas as customizadas
      // pois não há mapeamento específico
      subFunctionalityOptions: this.loadCustomFields().SUB_FUNCTIONALITY_OPTIONS || [],
    };
  }

  /**
   * Validar campos de uma atividade usando opções combinadas
   */
  validateActivityFields(activity) {
    const errors = [];
    
    // Validar tipo de atividade
    if (activity.tipo && !this.activityTypeExists(activity.tipo)) {
      errors.push(`Tipo de atividade '${activity.tipo}' não é válido`);
    }
    
    // Validar situação
    if (activity.situacao && !this.statusExists(activity.situacao)) {
      errors.push(`Situação '${activity.situacao}' não é válida`);
    }
    
    // Validar funcionalidade
    if (activity.funcionalidade && !this.functionalityExists(activity.funcionalidade)) {
      errors.push(`Funcionalidade '${activity.funcionalidade}' não é válida`);
    }
    
    // Validar sub-funcionalidade
    if (activity.subFuncionalidade && activity.funcionalidade) {
      if (!this.subFunctionalityExists(activity.funcionalidade, activity.subFuncionalidade)) {
        errors.push(`Sub-funcionalidade '${activity.subFuncionalidade}' não é válida para funcionalidade '${activity.funcionalidade}'`);
      }
    }
    
    return errors;
  }

  /**
   * Obter opções para um campo específico
   */
  getOptionsForField(fieldName, context = {}) {
    switch (fieldName) {
      case 'tipo':
      case 'activityType':
        return this.getCombinedActivityTypes();
      
      case 'situacao':
      case 'status':
        return this.getCombinedStatusOptions();
      
      case 'funcionalidade':
      case 'functionality':
        return this.getCombinedFunctionalityOptions();
      
      case 'subFuncionalidade':
      case 'subFunctionality':
        // Se temos contexto de funcionalidade, retornamos sub-funcionalidades específicas
        if (context.funcionalidade) {
          return this.getSubFunctionalitiesForFunctionality(context.funcionalidade);
        }
        // Caso contrário, retornamos todas as customizadas
        return this.loadCustomFields().SUB_FUNCTIONALITY_OPTIONS || [];
      
      default:
        return [];
    }
  }
}

// Instância singleton
export const customFieldsIntegrator = new CustomFieldsIntegrator();

// Funções utilitárias para uso direto
export const getCombinedActivityTypes = () => customFieldsIntegrator.getCombinedActivityTypes();
export const getCombinedStatusOptions = () => customFieldsIntegrator.getCombinedStatusOptions();
export const getCombinedFunctionalityOptions = () => customFieldsIntegrator.getCombinedFunctionalityOptions();
export const getSubFunctionalitiesForFunctionality = (functionality) => 
  customFieldsIntegrator.getSubFunctionalitiesForFunctionality(functionality);
export const getAllCombinedOptions = () => customFieldsIntegrator.getAllCombinedOptions();
export const validateActivityFields = (activity) => customFieldsIntegrator.validateActivityFields(activity);
export const getOptionsForField = (fieldName, context) => customFieldsIntegrator.getOptionsForField(fieldName, context);



