import React, { useState } from 'react';
import {
  FaToggleOn,
  FaFolderOpen,
  FaFigma,
  FaFlask,
  FaVial,
} from 'react-icons/fa';
import { SiPostman } from 'react-icons/si';

const QuickNotesBadge = ({
  type,
  text,
  icon: CustomIcon,
  onClick,
  onFeatureFlagClick,
  className = '',
}) => {
  const [showCopyFeedback, setShowCopyFeedback] = useState(false);

  // Função para copiar texto para a área de transferência
  const copyToClipboard = async text => {
    try {
      await navigator.clipboard.writeText(text);
      // Feedback visual
      setShowCopyFeedback(true);
      setTimeout(() => setShowCopyFeedback(false), 300);
      // Texto copiado para clipboard
    } catch (err) {
      console.error('Erro ao copiar texto:', err);
    }
  };

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
      case 'storage-produto':
      case 'discoverys':
      case 'documentacoes':
        return <FaFolderOpen className='badge-icon' />;
      case 'style-guide':
        return <FaFigma className='badge-icon' />;
      case 'testlink':
        return <FaVial className='badge-icon' />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`quick-notes-badge ${showCopyFeedback ? 'copy-feedback' : ''} ${className}`}
      data-type={type}
      onClick={handleClick}
      title={`Clique para ${type === 'feature-flag' ? 'copiar' : 'abrir'}`}
    >
      {renderIcon()}
      <span className='badge-text'>{text}</span>
    </div>
  );
};

export default QuickNotesBadge;
