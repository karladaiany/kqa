/**
 * Utilitários de analytics e monitoramento para a aplicação KQA
 * @author KQA Team
 * @description Funções para tracking de uso e performance
 */

/**
 * Classe para gerenciar eventos de analytics
 */
class AnalyticsManager {
  constructor() {
    this.events = [];
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
  }

  /**
   * Gera ID único para a sessão
   * @returns {string} ID da sessão
   */
  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Registra evento de uso
   * @param {string} category - Categoria do evento
   * @param {string} action - Ação realizada
   * @param {string} label - Label adicional
   * @param {Object} metadata - Metadados adicionais
   */
  trackEvent(category, action, label = '', metadata = {}) {
    const event = {
      timestamp: Date.now(),
      sessionId: this.sessionId,
      category,
      action,
      label,
      metadata,
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    this.events.push(event);
    
    // Armazenar no localStorage para análise posterior
    this.saveToStorage(event);
    
    // Log para desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics Event:', event);
    }
  }

  /**
   * Salva evento no localStorage
   * @param {Object} event - Evento a ser salvo
   */
  saveToStorage(event) {
    try {
      const stored = localStorage.getItem('kqa_analytics') || '[]';
      const events = JSON.parse(stored);
      events.push(event);
      
      // Manter apenas os últimos 100 eventos
      if (events.length > 100) {
        events.splice(0, events.length - 100);
      }
      
      localStorage.setItem('kqa_analytics', JSON.stringify(events));
    } catch (error) {
      console.warn('Erro ao salvar analytics:', error);
    }
  }

  /**
   * Obtém estatísticas de uso
   * @returns {Object} Estatísticas compiladas
   */
  getUsageStats() {
    try {
      const stored = localStorage.getItem('kqa_analytics') || '[]';
      const events = JSON.parse(stored);
      
      const stats = {
        totalEvents: events.length,
        categories: {},
        actions: {},
        sessionsCount: new Set(events.map(e => e.sessionId)).size,
        timeRange: {
          first: events.length > 0 ? new Date(events[0].timestamp) : null,
          last: events.length > 0 ? new Date(events[events.length - 1].timestamp) : null
        }
      };

      // Contar por categoria e ação
      events.forEach(event => {
        stats.categories[event.category] = (stats.categories[event.category] || 0) + 1;
        stats.actions[event.action] = (stats.actions[event.action] || 0) + 1;
      });

      return stats;
    } catch (error) {
      console.warn('Erro ao obter estatísticas:', error);
      return { totalEvents: 0, categories: {}, actions: {}, sessionsCount: 0 };
    }
  }

  /**
   * Limpa dados de analytics
   */
  clearAnalytics() {
    try {
      localStorage.removeItem('kqa_analytics');
      this.events = [];
    } catch (error) {
      console.warn('Erro ao limpar analytics:', error);
    }
  }
}

// Instância global do analytics
const analytics = new AnalyticsManager();

/**
 * Funções específicas para tracking de eventos do KQA
 */

/**
 * Registra geração de documento
 * @param {string} documentType - Tipo de documento (CPF, CNPJ, RG)
 * @param {boolean} withMask - Se foi gerado com máscara
 */
export const trackDocumentGeneration = (documentType, withMask = true) => {
  analytics.trackEvent('document', 'generate', documentType, { withMask });
};

/**
 * Registra cópia de valor
 * @param {string} dataType - Tipo de dado copiado
 * @param {string} source - Fonte da cópia
 */
export const trackCopyAction = (dataType, source = 'button') => {
  analytics.trackEvent('copy', 'clipboard', dataType, { source });
};

/**
 * Registra geração de dados pessoais
 * @param {string} fieldType - Tipo de campo gerado
 * @param {boolean} isComplete - Se foi geração completa
 */
export const trackPersonDataGeneration = (fieldType, isComplete = false) => {
  analytics.trackEvent('person', 'generate', fieldType, { isComplete });
};

/**
 * Registra uso de cartão de crédito
 * @param {string} cardBrand - Bandeira do cartão
 * @param {string} cardType - Tipo do cartão
 */
export const trackCreditCardGeneration = (cardBrand, cardType = 'normal') => {
  analytics.trackEvent('creditcard', 'generate', cardBrand, { cardType });
};

/**
 * Registra mudança de tema
 * @param {string} theme - Tema selecionado (light/dark)
 */
export const trackThemeChange = (theme) => {
  analytics.trackEvent('ui', 'theme_change', theme);
};

/**
 * Registra erro da aplicação
 * @param {string} errorType - Tipo do erro
 * @param {string} errorMessage - Mensagem do erro
 * @param {string} component - Componente onde ocorreu
 */
export const trackError = (errorType, errorMessage, component = 'unknown') => {
  analytics.trackEvent('error', errorType, component, { 
    message: errorMessage,
    timestamp: Date.now()
  });
};

/**
 * Registra tempo de sessão
 */
export const trackSessionDuration = () => {
  const duration = Date.now() - analytics.startTime;
  analytics.trackEvent('session', 'duration', 'end', { 
    durationMs: duration,
    durationMinutes: Math.round(duration / 60000)
  });
};

/**
 * Registra performance de carregamento
 * @param {string} component - Componente carregado
 * @param {number} loadTime - Tempo de carregamento em ms
 */
export const trackPerformance = (component, loadTime) => {
  analytics.trackEvent('performance', 'load_time', component, { 
    loadTimeMs: loadTime,
    loadTimeSec: Math.round(loadTime / 1000)
  });
};

/**
 * Registra uso de funcionalidades específicas
 * @param {string} feature - Nome da funcionalidade
 * @param {Object} metadata - Metadados adicionais
 */
export const trackFeatureUsage = (feature, metadata = {}) => {
  analytics.trackEvent('feature', 'usage', feature, metadata);
};

/**
 * Obtém estatísticas de uso
 * @returns {Object} Estatísticas compiladas
 */
export const getAnalyticsStats = () => {
  return analytics.getUsageStats();
};

/**
 * Limpa dados de analytics
 */
export const clearAnalyticsData = () => {
  analytics.clearAnalytics();
};

/**
 * Hook para monitoramento de performance de componentes
 * @param {string} componentName - Nome do componente
 */
export const usePerformanceMonitoring = (componentName) => {
  const startTime = Date.now();
  
  return {
    markLoadComplete: () => {
      const loadTime = Date.now() - startTime;
      trackPerformance(componentName, loadTime);
    }
  };
};

/**
 * Monitora erros não capturados
 */
export const initErrorTracking = () => {
  // Captura erros JavaScript
  window.addEventListener('error', (event) => {
    trackError('javascript', event.message, event.filename);
  });

  // Captura erros de Promise rejeitadas
  window.addEventListener('unhandledrejection', (event) => {
    trackError('promise', event.reason?.message || 'Promise rejeitada', 'unknown');
  });
};

/**
 * Monitora tempo de sessão automaticamente
 */
export const initSessionTracking = () => {
  // Registra fim da sessão ao sair da página
  window.addEventListener('beforeunload', () => {
    trackSessionDuration();
  });

  // Registra atividade a cada 5 minutos
  setInterval(() => {
    analytics.trackEvent('session', 'heartbeat', 'active');
  }, 5 * 60 * 1000);
};

// Exporta instância do analytics para uso direto se necessário
export { analytics };

// Inicialização automática
if (typeof window !== 'undefined') {
  initErrorTracking();
  initSessionTracking();
} 