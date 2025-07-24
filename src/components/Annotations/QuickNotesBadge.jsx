import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FaToggleOn, FaFolderOpen, FaFigma, FaVial, FaRadiation } from 'react-icons/fa';
import { SiPostman, SiJenkins, SiGithub, SiDatadog, SiNewrelic } from 'react-icons/si';

const QuickNotesBadge = ({
  type,
  text,
  icon: CustomIcon,
  onClick,
  onFeatureFlagClick,
  className = '',
}) => {
  const [showCopyFeedback] = useState(false);

  // Função para abrir link em nova aba
  const openInNewTab = url => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Handler para clique na badge
  const handleClick = () => {
    switch (type) {
      case 'feature-flag': {
        if (onFeatureFlagClick) {
          onFeatureFlagClick();
        }
        break;
      }
      case 'jenkins':
        openInNewTab('https://jenkins.twygo.com.br/');
        break;
      case 'github':
        openInNewTab('https://github.com/Twygo');
        break;
      case 'datadog':
        openInNewTab('https://app.datadoghq.com/');
        break;
      case 'newrelic':
        openInNewTab('https://login.newrelic.com/');
        break;

      case 'api-v1':
        openInNewTab(
          'https://documenter.getpostman.com/view/10208526/SWTA9dne'
        );
        break;

      case 'api-v2':
        openInNewTab(
          'https://documenter.getpostman.com/view/10208526/2s9YXmWzny'
        );
        break;

      case 'storage-produto':
        openInNewTab(
          'https://twygoead.sharepoint.com/sites/Twygo-TeamHub-GPRODUTO/Documentos%20Compartilhados/Forms/AllItems.aspx?e=5%3A7645647215404e2e851fb2565838ef12&sharingv2=true&fromShare=true&at=9&CT=1719856122272&OR=OWA%2DNT%2DMail&CID=9cef77f3%2D1855%2D21af%2D4b42%2D629c5bcbb9d1&FolderCTID=0x012000710E5FA3DA9EB94E9FC8CF10CAD8320C&id=%2Fsites%2FTwygo%2DTeamHub%2DGPRODUTO%2FDocumentos%20Compartilhados%2F%5BTEC%5D%20PRODUTO'
        );
        break;

      case 'discoverys':
        openInNewTab(
          'https://twygoead.sharepoint.com/:f:/r/sites/Twygo-TeamHub-GPRODUTO/Documentos%20Compartilhados/%5BTEC%5D%20PRODUTO/01.%20%F0%9F%92%A1%20DISCOVERYS?csf=1&web=1&e=tIXlZE'
        );
        break;

      case 'documentacoes':
        openInNewTab(
          'https://twygoead.sharepoint.com/:f:/s/Twygo-TeamHub-GPRODUTO/EsjyJ3Pv395Cqu_Nvdv0KXYBQagLSfzHRK52oYKvKrI7zg?e=S74VWH'
        );
        break;

      case 'style-guide':
        openInNewTab(
          'https://www.figma.com/design/yaSPGMWLAXekiGovtubpKC/Design-System-Twygo?node-id=0-1&p=f'
        );
        break;

      case 'testlink':
        openInNewTab('https://testelink.twygo.com/login.php');
        break;

      default:
        if (onClick) onClick();
        break;
    }
  };

  // Paleta de cores oficiais para cada serviço
  const BADGE_COLORS = {
    'jenkins': {
      background: '#D24939', // Vermelho Jenkins
      color: '#fff',
    },
    'github': {
      background: '#24292F', // Preto GitHub
      color: '#fff',
    },
    'datadog': {
      background: '#632CA6', // Roxo Datadog
      color: '#fff',
    },
    'newrelic': {
      background: '#008C99', // Azul New Relic
      color: '#fff',
    },
    'api-v1': {
      background: '#FF6C37', // Laranja Postman
      color: '#fff',
    },
    'api-v2': {
      background: '#FF6C37',
      color: '#fff',
    },
    'feature-flag': {
      background: '#7C3AED', // Roxo
      color: '#fff',
    },
    'storage-produto': {
      background: '#2563EB', // Azul
      color: '#fff',
    },
    'discoverys': {
      background: '#2563EB',
      color: '#fff',
    },
    'documentacoes': {
      background: '#2563EB',
      color: '#fff',
    },
    'style-guide': {
      background: '#0AC5F5', // Azul Figma
      color: '#fff',
    },
    'testlink': {
      background: '#22C55E', // Verde
      color: '#fff',
    },
  };

  // Função para gerar gradiente mais marcante baseado na cor principal
  const getGradient = (color) => {
    // Gradiente do tom principal para uma versão mais clara do próprio tom
    return `linear-gradient(90deg, ${color} 0%, ${color}66 60%, ${color}11 100%)`;
  };

  // SVG customizado de radiação com dois tons para TestLink
  const TestLinkRadiationIcon = () => (
    <svg width="18" height="18" viewBox="0 0 18 18" style={{ marginRight: 4 }}>
      <circle cx="9" cy="9" r="9" fill="#fff" />
      <path d="M9 1.5a7.5 7.5 0 0 1 7.5 7.5H9V1.5z" fill="#222" />
      <path d="M9 9v7.5A7.5 7.5 0 0 1 1.5 9H9z" fill="#222" />
    </svg>
  );

  // Renderizar ícone padrão baseado no tipo
  const renderIcon = () => {
    if (CustomIcon) {
      return <CustomIcon className='badge-icon' />;
    }
    switch (type) {
      case 'feature-flag':
        return <FaToggleOn className='badge-icon' />;
      case 'api-v1':
      case 'api-v2':
        return <SiPostman className='badge-icon' />;
      case 'jenkins':
        return <SiJenkins className='badge-icon' />;
      case 'github':
        return <SiGithub className='badge-icon' />;
      case 'datadog':
        return <SiDatadog className='badge-icon' />;
      case 'newrelic':
        return <SiNewrelic className='badge-icon' />;
      case 'storage-produto':
      case 'discoverys':
      case 'documentacoes':
        return <FaFolderOpen className='badge-icon' />;
      case 'style-guide':
        return <FaFigma className='badge-icon' />;
      case 'testlink':
        return <TestLinkRadiationIcon />;
      default:
        return null;
    }
  };

  // Estilo dinâmico para gradiente, borda e sombra
  const badgeColor = BADGE_COLORS[type]?.background || '#e5e7eb';
  // Detecta se o fundo é claro para ajustar a cor da fonte
  function isColorLight(hex) {
    if (!hex) return false;
    const c = hex.substring(1); // remove #
    const rgb = parseInt(c, 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = rgb & 0xff;
    // Percepção de luminosidade
    return (0.299 * r + 0.587 * g + 0.114 * b) > 180;
  }
  const fontColor = isColorLight(badgeColor) ? '#222' : (BADGE_COLORS[type]?.color || '#fff');
  const badgeStyle = {
    background: getGradient(badgeColor),
    color: fontColor,
    // Borda mais suave: sombra leve, sem borda sólida
    border: 'none',
    boxShadow: `0 2px 8px 0 ${badgeColor}33`,
    fontWeight: 'bold',
  };

  return (
    <div
      className={`quick-notes-badge ${showCopyFeedback ? 'copy-feedback' : ''} ${className}`}
      data-type={type}
      onClick={handleClick}
      title={`Clique para ${type === 'feature-flag' ? 'copiar' : 'abrir'}`}
      style={badgeStyle}
    >
      {renderIcon()}
      <span className='badge-text' style={{ fontWeight: 'bold' }}>{text}</span>
    </div>
  );
};

QuickNotesBadge.propTypes = {
  type: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  icon: PropTypes.elementType,
  onClick: PropTypes.func,
  onFeatureFlagClick: PropTypes.func,
  className: PropTypes.string,
};

export default QuickNotesBadge;
