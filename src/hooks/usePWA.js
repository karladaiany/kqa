/**
 * Hook para gerenciar funcionalidades PWA (Progressive Web App)
 * Inclui detecção de instalação, atualizações e notificações
 */

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export const usePWA = () => {
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [swUpdate, setSWUpdate] = useState(null);

  useEffect(() => {
    // Detecta se a aplicação é instalável
    const handleBeforeInstallPrompt = event => {
      event.preventDefault();
      setDeferredPrompt(event);
      setIsInstallable(true);
    };

    // Detecta quando a aplicação foi instalada
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      toast.success('✅ KQA foi instalado com sucesso!', {
        position: 'bottom-right',
        autoClose: 3000,
      });
    };

    // Detecta mudanças no status de conexão
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('🌐 Conexão restabelecida!', {
        position: 'bottom-right',
        autoClose: 2000,
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.warning('📱 Você está offline. Modo limitado ativado.', {
        position: 'bottom-right',
        autoClose: 4000,
      });
    };

    // Event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Detecta atualizações do Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;

          newWorker.addEventListener('statechange', () => {
            if (
              newWorker.state === 'installed' &&
              navigator.serviceWorker.controller
            ) {
              setSWUpdate(newWorker);
              toast.info('🔄 Nova versão disponível! Clique para atualizar.', {
                position: 'bottom-right',
                autoClose: false,
                closeOnClick: false,
                onClick: () => handleSWUpdate(),
              });
            }
          });
        });
      });

      // Escuta mensagens do Service Worker
      navigator.serviceWorker.addEventListener('message', event => {
        if (event.data && event.data.type === 'CACHE_UPDATED') {
          toast.success('📦 Cache atualizado com sucesso!', {
            position: 'bottom-right',
            autoClose: 2000,
          });
        }
      });
    }

    // Cleanup
    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Função para instalar a aplicação
  const installApp = async () => {
    if (!deferredPrompt) return false;

    try {
      deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;

      if (result.outcome === 'accepted') {
        setIsInstallable(false);
        setDeferredPrompt(null);
        return true;
      }

      return false;
    } catch (error) {
      console.warn('Erro ao instalar aplicação:', error);
      return false;
    }
  };

  // Função para atualizar o Service Worker
  const handleSWUpdate = () => {
    if (!swUpdate) return;

    swUpdate.postMessage({ type: 'SKIP_WAITING' });

    // Recarrega a página após a atualização
    swUpdate.addEventListener('statechange', () => {
      if (swUpdate.state === 'activated') {
        window.location.reload();
      }
    });

    setSWUpdate(null);
  };

  // Função para verificar se é PWA instalada
  const isPWAInstalled = () => {
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true ||
      document.referrer.includes('android-app://')
    );
  };

  // Função para detectar plataforma
  const getPlatform = () => {
    const userAgent = window.navigator.userAgent;

    if (/android/i.test(userAgent)) return 'android';
    if (/iPad|iPhone|iPod/.test(userAgent)) return 'ios';
    if (/Win/.test(userAgent)) return 'windows';
    if (/Mac/.test(userAgent)) return 'macos';
    if (/Linux/.test(userAgent)) return 'linux';

    return 'unknown';
  };

  // Função para notificar sobre funcionalidades offline
  const showOfflineCapabilities = () => {
    if (!isOnline) {
      toast.info(
        '💡 Algumas funcionalidades estão disponíveis offline:\n' +
          '• Geração de dados\n' +
          '• Formulários salvos\n' +
          '• Configurações do tema',
        {
          position: 'bottom-left',
          autoClose: 6000,
        }
      );
    }
  };

  return {
    // Estados
    isInstallable,
    isInstalled: isInstalled || isPWAInstalled(),
    isOnline,
    swUpdate: !!swUpdate,
    platform: getPlatform(),

    // Funções
    installApp,
    handleSWUpdate,
    showOfflineCapabilities,

    // Utilitários
    isPWAInstalled,
    getPlatform,
  };
};

export default usePWA;
