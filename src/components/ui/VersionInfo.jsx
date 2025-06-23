import { useState, useEffect } from 'react';
import { FaCode, FaGitAlt, FaClock } from 'react-icons/fa';

/**
 * Componente para exibir informações de versão da aplicação
 */
export function VersionInfo({ variant = 'compact' }) {
  const [versionInfo, setVersionInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVersionInfo() {
      try {
        const response = await fetch('/version.json');
        if (response.ok) {
          const data = await response.json();
          setVersionInfo(data);
        } else {
          // Fallback para versão do package.json se version.json não existir
          const packageVersion = import.meta.env.PACKAGE_VERSION || '1.0.0';
          setVersionInfo({
            version: packageVersion,
            timestamp: new Date().toISOString(),
            git: { branch: 'unknown', shortCommit: 'local' },
            environment: import.meta.env.MODE || 'development',
          });
        }
      } catch (error) {
        console.warn('Não foi possível carregar informações de versão:', error);
        setVersionInfo({
          version: '1.0.0',
          timestamp: new Date().toISOString(),
          git: { branch: 'unknown', shortCommit: 'local' },
          environment: 'development',
        });
      } finally {
        setLoading(false);
      }
    }

    fetchVersionInfo();
  }, []);

  if (loading) {
    return variant === 'compact' ? (
      <span className='version-info-loading'>...</span>
    ) : (
      <div className='version-info-card loading'>Carregando...</div>
    );
  }

  if (!versionInfo) return null;

  const formatDate = timestamp => {
    try {
      return new Date(timestamp).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Data inválida';
    }
  };

  if (variant === 'compact') {
    return (
      <span
        className='version-info-compact'
        title={`Versão ${versionInfo.version} | Branch: ${versionInfo.git.branch} | Commit: ${versionInfo.git.shortCommit}`}
      >
        <FaCode className='version-icon' />v{versionInfo.version}
      </span>
    );
  }

  return (
    <div className='version-info-card'>
      <div className='version-header'>
        <FaCode className='version-icon' />
        <h4>Informações da Versão</h4>
      </div>

      <div className='version-details'>
        <div className='version-item'>
          <strong>Versão:</strong>
          <span className='version-badge'>v{versionInfo.version}</span>
        </div>

        <div className='version-item'>
          <FaGitAlt className='version-item-icon' />
          <strong>Branch:</strong>
          <code>{versionInfo.git.branch}</code>
        </div>

        <div className='version-item'>
          <strong>Commit:</strong>
          <code>{versionInfo.git.shortCommit}</code>
        </div>

        <div className='version-item'>
          <FaClock className='version-item-icon' />
          <strong>Build:</strong>
          <span>{formatDate(versionInfo.timestamp)}</span>
        </div>

        <div className='version-item'>
          <strong>Environment:</strong>
          <span className={`env-badge env-${versionInfo.environment}`}>
            {versionInfo.environment}
          </span>
        </div>
      </div>
    </div>
  );
}

export default VersionInfo;
