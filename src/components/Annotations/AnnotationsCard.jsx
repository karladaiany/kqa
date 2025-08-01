import React, { useState, useRef, useCallback, useEffect } from 'react';
import { FaRegClock, FaPlay, FaStop, FaPlus, FaClipboardList, FaTrash, FaBookmark, FaEye, FaExclamationTriangle, FaCheck } from 'react-icons/fa';
import AnnotationsTable from './AnnotationsTable';
import ActivitySelector from './ActivitySelector';
import { useActivityStorage } from '../../hooks';
import { ArtiaService } from '../../services/artiaService';
import './AnnotationsCard.css';

const initialLine = () => ({
  date: '',
  startTime: '',
  endTime: '',
  effort: '',
  title: '',
  link: '',
  description: '',
  activityStatus: '',
  activityArea: '',
  timerRunning: false,
});

function pad(num) {
  return num.toString().padStart(2, '0');
}

function calculateEffort(start, end) {
  if (!start || !end) return '';
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  let diff = (eh * 60 + em) - (sh * 60 + sm);
  if (diff < 0) diff += 24 * 60;
  const h = Math.floor(diff / 60);
  const m = diff % 60;
  return `${pad(h)}:${pad(m)}`;
}

const AnnotationsCard = () => {
  const [lines, setLines] = useState([initialLine()]);
  const [savedAnnotations, setSavedAnnotations] = useState([]);
  const [showActivitySelector, setShowActivitySelector] = useState(false);
  const timersRef = useRef([]);
  const [timerStarts, setTimerStarts] = useState([null]);
  const [activityData, setActivityData] = useState(null);
  const [loadingActivity, setLoadingActivity] = useState(false);
  const [activityError, setActivityError] = useState('');

  const { addActivity } = useActivityStorage();

  // Function to fetch data from Artia API
  const fetchActivityData = useCallback(async (url, lineIndex) => {
    if (!url || !url.trim()) {
      setActivityData(null);
      setActivityError('');
      return;
    }

    setLoadingActivity(true);
    setActivityError('');

    try {
      const { activityId, isValid, message } = ArtiaService.extractActivityIdFromUrl(url);

      if (!isValid) {
        setActivityError(message || 'Link inválido');
        setActivityData(null);
        return;
      }

      const activity = await ArtiaService.viewActivity(activityId, 1); // accountId padrão

      setActivityData(activity);
      setActivityError('');

      // Atualizar a linha específica com os dados da atividade
      setLines(prev => prev.map((line, idx) => {
        if (idx !== lineIndex) return line;
        
        const updatedLine = { ...line };
        
        if (activity.title) {
          updatedLine.title = activity.title;
        }

        if (activity.customStatus?.statusName) {
          updatedLine.activityStatus = activity.customStatus.statusName;
        }

        if (activity.customColumns) {
          const areaField = activity.customColumns.find(field =>
            field.name?.toLowerCase().includes('área') ||
            field.name?.toLowerCase().includes('area')
          );
          if (areaField?.value) {
            updatedLine.activityArea = areaField.value;
          }
        }

        return updatedLine;
      }));

    } catch (error) {
      setActivityError(`Erro ao buscar atividade: ${error.message}`);
      setActivityData(null);
    } finally {
      setLoadingActivity(false);
    }
  }, []);

  // Atualiza campos de uma linha
  const handleChange = (idx, e) => {
    const { name, value } = e.target;
    setLines(prev => prev.map((line, i) => {
      if (i !== idx) return line;
      const updated = { ...line, [name]: value };
      if (name === 'startTime' || name === 'endTime') {
        updated.effort = calculateEffort(
          name === 'startTime' ? value : line.startTime,
          name === 'endTime' ? value : line.endTime
        );
      }
      return updated;
    }));

    // Se o campo alterado for 'link', buscar dados da atividade
    if (name === 'link' && value.includes('app.artia.com')) {
      fetchActivityData(value, idx);
    }
  };

  // Inicia cronômetro de uma linha
  const handlePlay = idx => {
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    const currentTime = getNowTime();
    
    setLines(prev => prev.map((line, i) =>
      i === idx ? { 
        ...line, 
        timerRunning: true, 
        date: currentDate,
        startTime: currentTime 
      } : line
    ));
    setTimerStarts(prev => prev.map((t, i) => (i === idx ? Date.now() : t)));
    timersRef.current[idx] = setInterval(() => {}, 1000);
  };

  // Para cronômetro de uma linha
  const handleStop = idx => {
    setLines(prev => prev.map((line, i) => {
      if (i !== idx) return line;
      const endTime = getNowTime();
      return {
        ...line,
        endTime,
        effort: calculateEffort(line.startTime, endTime),
        timerRunning: false,
      };
    }));
    setTimerStarts(prev => prev.map((t, i) => (i === idx ? null : t)));
    clearInterval(timersRef.current[idx]);
  };

  // Adiciona nova linha
  const handleAddLine = () => {
    setLines(prev => [...prev, initialLine()]);
    setTimerStarts(prev => [...prev, null]);
  };

  // Remove linha
  const handleRemoveLine = idx => {
    setLines(prev => prev.filter((_, i) => i !== idx));
    setTimerStarts(prev => prev.filter((_, i) => i !== idx));
    clearInterval(timersRef.current[idx]);
  };

  // Adiciona todas as linhas válidas à tabela
  const handleAddAll = () => {
    const validLines = lines.filter(l => l.date && l.startTime && l.endTime && l.title);
    if (validLines.length > 0) {
      const newAnnotations = validLines.map(l => ({
        ...l,
        id: Date.now() + Math.random(), // ID único simples
        effort: calculateEffort(l.startTime, l.endTime),
        status: 'não lançado'
      }));
      setSavedAnnotations(prev => [...prev, ...newAnnotations]);
      
      // Limpa linhas preenchidas, mantém as incompletas para edição
      setLines(prev => prev.filter(l => !(l.date && l.startTime && l.endTime && l.title)).length > 0 ? prev.filter(l => !(l.date && l.startTime && l.endTime && l.title)) : [initialLine()]);
      setTimerStarts([null]);
      timersRef.current = [];
    }
  };

  // Lança apontamentos via API
  const handleLaunch = async (pendingAnnotations) => {
    // TODO: Implementar integração com API do Artia
    console.log('Lançando apontamentos:', pendingAnnotations);
    
    // Simulação de envio
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Atualiza status para 'lançado'
    setSavedAnnotations(prev => prev.map(a => 
      pendingAnnotations.some(p => p.id === a.id) 
        ? { ...a, status: 'lançado' }
        : a
    ));
  };

  // Seleciona atividade do histórico
  const handleSelectActivity = (activity) => {
    // Preencher a primeira linha com os dados da atividade selecionada
    setLines(prev => prev.map((line, i) => 
      i === 0 ? {
        ...line,
        title: activity.title || '',
        link: activity.link || '',
        description: activity.description || '',
      } : line
    ));
    setShowActivitySelector(false);
  };

  // Adiciona atividade atual ao histórico
  const handleAddActivityToStorage = () => {
    const currentLine = lines[0];
    if (currentLine.title?.trim()) {
      addActivity({
        title: currentLine.title,
        link: currentLine.link,
        description: currentLine.description,
      });
    }
  };

  function getNowTime() {
    const now = new Date();
    return `${pad(now.getHours())}:${pad(now.getMinutes())}`;
  }

  return (
    <div className="activity-import-card annotations-card">
      <div className="card-header">
        <span className="card-title">
          <FaClipboardList className="card-icon" /> Apontamentos (Artia)
        </span>
        <button
          type="button"
          className="activity-history-btn"
          onClick={() => setShowActivitySelector(!showActivitySelector)}
          title="Histórico de atividades"
        >
          <FaBookmark />
        </button>
      </div>
      
      <div className="card-content">
        {/* Seletor de atividades */}
        {showActivitySelector && (
          <ActivitySelector
            onSelectActivity={handleSelectActivity}
            onAddActivity={handleAddActivityToStorage}
          />
        )}

        <form className="annotations-form-table" onSubmit={e => { e.preventDefault(); handleAddAll(); }}>
          {/* Campos de entrada reorganizados */}
          {lines.map((line, idx) => (
            <div className="annotations-form-row" key={idx}>
              {/* Primeira linha: Controles de tempo e ações */}
              <div className="annotations-form-row-top">
                <input 
                  type="date" 
                  name="date" 
                  value={line.date} 
                  onChange={e => handleChange(idx, e)} 
                  className="import-name-input" 
                />
                <input 
                  type="time" 
                  name="startTime" 
                  value={line.startTime} 
                  onChange={e => handleChange(idx, e)} 
                  className="import-name-input" 
                />
                <input 
                  type="time" 
                  name="endTime" 
                  value={line.endTime} 
                  onChange={e => handleChange(idx, e)} 
                  className="import-name-input" 
                />
                <input 
                  type="text" 
                  name="effort" 
                  value={line.effort} 
                  readOnly 
                  placeholder="hh:mm" 
                  className="import-name-input" 
                />
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={line.timerRunning ? () => handleStop(idx) : () => handlePlay(idx)} 
                  title={line.timerRunning ? 'Parar cronômetro' : 'Iniciar cronômetro'}
                >
                  {line.timerRunning ? <FaStop /> : <FaPlay />}
                  <span className="sr-only">{line.timerRunning ? 'Parar' : 'Iniciar'}</span>
                </button>
                <button 
                  type="button" 
                  className="btn-danger" 
                  onClick={() => handleRemoveLine(idx)} 
                  title="Remover linha" 
                  disabled={lines.length === 1}
                >
                  <FaTrash />
                </button>
              </div>
              
              {/* Segunda linha: Link da atividade */}
              <div className="annotations-form-row-link">
                <div className="link-field-container">
                  <input 
                    type="text" 
                    name="link" 
                    value={line.link} 
                    onChange={e => handleChange(idx, e)} 
                    placeholder="Link da atividade" 
                    className="import-name-input link-field" 
                  />
                  {loadingActivity && (
                    <span className="loading-indicator">
                      <FaEye /> Carregando dados da atividade...
                    </span>
                  )}
                  {activityError && (
                    <span className="error-indicator">
                      <FaExclamationTriangle /> {activityError}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Terceira linha: Título, Situação e Área */}
              <div className="annotations-form-row-fields">
                <input 
                  type="text" 
                  name="title" 
                  value={line.title} 
                  onChange={e => handleChange(idx, e)} 
                  placeholder="Título da atividade" 
                  className="import-name-input title-field" 
                />
                <input 
                  type="text" 
                  name="activityStatus" 
                  value={line.activityStatus} 
                  onChange={e => handleChange(idx, e)} 
                  placeholder="Situação" 
                  className="import-name-input status-field" 
                  readOnly
                />
                <input 
                  type="text" 
                  name="activityArea" 
                  value={line.activityArea} 
                  onChange={e => handleChange(idx, e)} 
                  placeholder="Área" 
                  className="import-name-input area-field" 
                  readOnly
                />
              </div>
              
              {/* Quarta linha: Comentário */}
              <div className="annotations-form-row-comment">
                <input 
                  type="text" 
                  name="description" 
                  value={line.description} 
                  onChange={e => handleChange(idx, e)} 
                  placeholder="Comentário" 
                  className="import-name-input description-field" 
                />
              </div>
            </div>
          ))}
          
          <div className="annotations-actions-row">
            <button type="button" className="btn-secondary" onClick={handleAddLine}>
              <FaPlus /> Nova linha
            </button>
            <button type="submit" className="btn-primary" disabled={lines.every(l => !(l.date && l.startTime && l.endTime && l.title))}>
              <FaPlus /> Adicionar à tabela
            </button>
          </div>
        </form>
      </div>

      <AnnotationsTable 
        annotations={savedAnnotations}
        onLaunch={handleLaunch}
      />
    </div>
  );
};

export default AnnotationsCard;
