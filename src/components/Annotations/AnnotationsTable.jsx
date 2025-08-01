import React, { useState, useEffect } from 'react';
import { FaPlay, FaCheck, FaTimes, FaClipboardList, FaRocket } from 'react-icons/fa';
import './AnnotationsTable.css';

const AnnotationsTable = ({ annotations = [], onLaunch }) => {
  const [localAnnotations, setLocalAnnotations] = useState(annotations);
  const [isLaunching, setIsLaunching] = useState(false);

  useEffect(() => {
    setLocalAnnotations(annotations);
  }, [annotations]);

  const handleLaunch = async () => {
    const pendingAnnotations = localAnnotations.filter(a => a.status === 'não lançado');
    if (pendingAnnotations.length === 0) return;

    setIsLaunching(true);
    try {
      if (onLaunch) {
        await onLaunch(pendingAnnotations);
        // Atualiza status para 'lançado' após sucesso
        setLocalAnnotations(prev => prev.map(a => 
          pendingAnnotations.some(p => p.id === a.id) 
            ? { ...a, status: 'lançado' }
            : a
        ));
      }
    } catch (error) {
      console.error('Erro ao lançar apontamentos:', error);
    } finally {
      setIsLaunching(false);
    }
  };

  const pendingCount = localAnnotations.filter(a => a.status === 'não lançado').length;
  const launchedCount = localAnnotations.filter(a => a.status === 'lançado').length;

  if (localAnnotations.length === 0) {
    return (
      <div className="annotations-table-empty">
        <FaClipboardList className="empty-icon" />
        <p>Nenhum apontamento registrado</p>
        <small>Adicione apontamentos na seção acima para visualizá-los aqui</small>
      </div>
    );
  }

  return (
    <div className="annotations-table-container">
      <div className="annotations-table-header">
        <div className="table-title">
          <FaClipboardList className="table-icon" />
          <span>Lista de Apontamentos</span>
        </div>
        <div className="table-stats">
          <span className="stat pending">
            <FaPlay /> {pendingCount} pendentes
          </span>
          <span className="stat launched">
            <FaCheck /> {launchedCount} lançados
          </span>
        </div>
      </div>

      <div className="annotations-table-content">
        <table className="annotations-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Início</th>
              <th>Fim</th>
              <th>Esforço</th>
              <th>Título</th>
              <th>Link</th>
              <th>Comentário</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {localAnnotations.map((annotation, index) => (
              <tr key={annotation.id || index} className={`annotation-row ${annotation.status}`}>
                <td>{annotation.date}</td>
                <td>{annotation.startTime}</td>
                <td>{annotation.endTime}</td>
                <td>{annotation.effort}</td>
                <td className="title-cell">
                  <span className="title-text" title={annotation.title}>
                    {annotation.title}
                  </span>
                </td>
                <td className="link-cell">
                  {annotation.link && (
                    <a 
                      href={annotation.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="activity-link"
                      title={annotation.link}
                    >
                      Ver atividade
                    </a>
                  )}
                </td>
                <td className="description-cell">
                  <span className="description-text" title={annotation.description}>
                    {annotation.description}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${annotation.status}`}>
                    {annotation.status === 'lançado' ? <FaCheck /> : <FaTimes />}
                    {annotation.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pendingCount > 0 && (
        <div className="annotations-table-actions">
          <button 
            className="btn-primary launch-btn" 
            onClick={handleLaunch}
            disabled={isLaunching}
          >
            <FaRocket />
            {isLaunching ? 'Lançando...' : `Lançar ${pendingCount} apontamento${pendingCount > 1 ? 's' : ''}`}
          </button>
        </div>
      )}
    </div>
  );
};

export default AnnotationsTable; 