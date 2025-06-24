import React, {
  useState,
  useRef,
  useCallback,
  createContext,
  useContext,
} from 'react';
import logger from '../../utils/logger.js';
import PropTypes from 'prop-types';
import {
  FaStickyNote,
  FaPlus,
  FaTrashAlt,
  FaBold,
  FaItalic,
  FaUnderline,
  FaStrikethrough,
  FaListUl,
  FaListOl,
  FaCheck,
  FaImage,
  FaPalette,
  FaFont,
  FaBolt,
  FaEdit,
} from 'react-icons/fa';
import { useAnnotations } from '../../hooks/useAnnotations';
import { useBugRegistration } from '../../hooks/useBugRegistration';
import { MiniCard } from './MiniCard';
import QuickNotesBadge from './QuickNotesBadge';

// Contexto para gerenciar o editor ativo
const ActiveEditorContext = createContext();

export const useActiveEditor = () => {
  const context = useContext(ActiveEditorContext);
  if (!context) {
    throw new Error('useActiveEditor must be used within ActiveEditorProvider');
  }
  return context;
};

// Cores específicas para os novos seletores
const EXTENDED_COLORS = {
  backgrounds: [
    { name: 'Preto', value: '#000000' },
    { name: 'Cinza', value: '#6272a4' },
    { name: 'Azul claro', value: '#8be9fd' },
    { name: 'Rosa', value: '#ff79c6' },
    { name: 'Branco', value: '#ffffff' },
  ],
  texts: [
    { name: 'Preto', value: '#000000' },
    { name: 'Cinza', value: '#6272a4' },
    { name: 'Azul claro', value: '#8be9fd' },
    { name: 'Rosa', value: '#ff79c6' },
    { name: 'Branco', value: '#ffffff' },
  ],
  general: [
    { name: 'Preto', value: '#000000' },
    { name: 'Cinza escuro', value: '#374151' },
    { name: 'Azul escuro', value: '#1e40af' },
    { name: 'Verde escuro', value: '#166534' },
    { name: 'Vermelho', value: '#dc2626' },
    { name: 'Roxo', value: '#7c3aed' },
    { name: 'Laranja', value: '#ea580c' },
    { name: 'Rosa escuro', value: '#be185d' },
    { name: 'Cinza claro', value: '#f9fafb' },
    { name: 'Branco', value: '#ffffff' },
    { name: 'Cinza', value: '#6272a4' },
    { name: 'Azul claro', value: '#8be9fd' },
    { name: 'Rosa', value: '#ff79c6' },
  ],
};

const AnnotationsCard = () => {
  const { notes, addNote, updateNote, deleteNote, clearAllNotes } =
    useAnnotations();
  const { bugData } = useBugRegistration();

  // Debug: monitorar mudanças no envId
  logger.debug('AnnotationsCard render - bugData.envId:', bugData?.envId);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [activeEditor, setActiveEditor] = useState(null);
  const [activeNote, setActiveNote] = useState(null);

  // Estados para controlar a linha secundária
  const [showColorLine, setShowColorLine] = useState(false);
  const [colorLineMode, setColorLineMode] = useState(null); // 'text' ou 'card'

  // Estados para cores personalizadas
  const [customTextColor, setCustomTextColor] = useState(null);
  const [customBackgroundColor, setCustomBackgroundColor] = useState(null);
  const [customGeneralColor, setCustomGeneralColor] = useState(null);

  const containerRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleAddNote = useCallback(() => {
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;

    // Posiciona o novo card em uma área livre ou centralizada
    const noteData = {
      x: Math.max(50, Math.random() * (containerRect.width - 350)), // Evita overflow
      y: Math.max(50, Math.random() * (containerRect.height - 250)),
      width: 300,
      height: 200,
      content: '<p>Digite sua anotação aqui...</p>',
      backgroundColor: '#fef9e7',
      textColor: '#374151',
    };

    addNote(noteData);
  }, [addNote]);

  // Funções da barra de formatação
  const handleToolbarAction = useCallback(
    (action, event) => {
      event.preventDefault();
      event.stopPropagation();

      if (!activeEditor) return;

      switch (action) {
        case 'bold':
          activeEditor.chain().focus().toggleBold().run();
          break;
        case 'italic':
          activeEditor.chain().focus().toggleItalic().run();
          break;
        case 'underline':
          activeEditor.chain().focus().toggleUnderline().run();
          break;
        case 'strike':
          activeEditor.chain().focus().toggleStrike().run();
          break;
        case 'bulletList':
          activeEditor.chain().focus().toggleBulletList().run();
          break;
        case 'orderedList':
          activeEditor.chain().focus().toggleOrderedList().run();
          break;
        case 'taskList':
          activeEditor.chain().focus().toggleTaskList().run();
          break;
        case 'image':
          fileInputRef.current?.click();
          break;
      }
    },
    [activeEditor]
  );

  const handleImageUpload = useCallback(
    event => {
      const file = event.target.files?.[0];
      if (file && activeEditor) {
        // Verificar tamanho do arquivo (limite de 2MB)
        const maxSize = 2 * 1024 * 1024;
        if (file.size > maxSize) {
          alert(
            'Imagem muito grande! Por favor, selecione uma imagem menor que 2MB.'
          );
          return;
        }

        const reader = new FileReader();
        reader.onload = e => {
          const url = e.target?.result;
          if (typeof url === 'string') {
            activeEditor
              .chain()
              .focus()
              .setImage({
                src: url,
                alt: file.name,
                title: file.name,
              })
              .run();
          }
        };
        reader.readAsDataURL(file);
      }

      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [activeEditor]
  );

  // Funções para controlar a linha de cores
  const handleTextColorClick = useCallback(() => {
    if (!activeEditor) return;

    if (showColorLine && colorLineMode === 'text') {
      setShowColorLine(false);
      setColorLineMode(null);
    } else {
      setShowColorLine(true);
      setColorLineMode('text');
    }
  }, [activeEditor, showColorLine, colorLineMode]);

  const handleCardColorsClick = useCallback(() => {
    if (!activeEditor) return;

    if (showColorLine && colorLineMode === 'card') {
      setShowColorLine(false);
      setColorLineMode(null);
    } else {
      setShowColorLine(true);
      setColorLineMode('card');
    }
  }, [activeEditor, showColorLine, colorLineMode]);

  // Funções para aplicar cores
  const handleTextColorChange = useCallback(
    color => {
      if (!activeEditor) return;

      const selection = activeEditor.state.selection;
      if (!selection.empty) {
        // Aplicar cor ao texto selecionado
        activeEditor.chain().focus().setColor(color).run();
      }

      setShowColorLine(false);
      setColorLineMode(null);
    },
    [activeEditor]
  );

  const handleCardColorChange = useCallback(
    (color, isBackground = true) => {
      if (!activeNote) return;

      const updates = {
        [isBackground ? 'backgroundColor' : 'textColor']: color,
        lastModified: new Date().toISOString(),
      };
      updateNote(activeNote.id, updates);
    },
    [activeNote, updateNote]
  );

  // Funções para cores personalizadas
  const handleCustomColorChange = useCallback((color, type) => {
    switch (type) {
      case 'text':
        setCustomTextColor(color);
        break;
      case 'background':
        setCustomBackgroundColor(color);
        break;
      case 'general':
        setCustomGeneralColor(color);
        break;
    }
  }, []);

  const handleDeleteNote = useCallback(noteId => {
    setShowDeleteConfirm(noteId);
  }, []);

  const confirmDelete = useCallback(() => {
    if (showDeleteConfirm) {
      deleteNote(showDeleteConfirm);
      setShowDeleteConfirm(null);
    }
  }, [showDeleteConfirm, deleteNote]);

  const cancelDelete = useCallback(() => {
    setShowDeleteConfirm(null);
  }, []);

  const handleClearAll = useCallback(() => {
    if (notes.length > 0) {
      if (
        window.confirm(
          'Tem certeza de que deseja excluir todas as anotações? Esta ação não pode ser desfeita.'
        )
      ) {
        clearAllNotes();
      }
    }
  }, [notes.length, clearAllNotes]);

  // Componente da barra de formatação
  const ToolbarButton = ({
    action,
    active,
    children,
    title,
    disabled,
    onClick,
  }) => (
    <button
      type='button'
      className={`global-toolbar-button ${active ? 'active' : ''} ${disabled ? 'disabled' : ''}`}
      onMouseDown={
        onClick ? undefined : e => !disabled && handleToolbarAction(action, e)
      }
      onClick={onClick ? e => !disabled && onClick(e) : undefined}
      title={disabled ? 'Selecione um card para usar esta ferramenta' : title}
      disabled={disabled}
    >
      {children}
    </button>
  );

  ToolbarButton.propTypes = {
    action: PropTypes.string,
    active: PropTypes.bool,
    children: PropTypes.node.isRequired,
    title: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
  };

  // Componente para o seletor de cores
  const ColorPicker = ({ type, onChange, value, title }) => (
    <div className='color-picker-container'>
      <input
        type='color'
        value={value || '#000000'}
        onChange={e => {
          onChange(e.target.value);
          handleCustomColorChange(e.target.value, type);
        }}
        title={title}
        className='color-picker-input'
      />
    </div>
  );

  ColorPicker.propTypes = {
    type: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string,
    title: PropTypes.string.isRequired,
  };

  // Componente para opções de cores
  const ColorOption = ({ color, isSelected, onClick, title }) => (
    <button
      type='button'
      className={`color-option ${isSelected ? 'selected' : ''}`}
      style={{ backgroundColor: color }}
      onClick={onClick}
      title={title}
    />
  );

  ColorOption.propTypes = {
    color: PropTypes.string.isRequired,
    isSelected: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
  };

  const contextValue = {
    activeEditor,
    setActiveEditor,
    activeNote,
    setActiveNote,
  };

  return (
    <ActiveEditorContext.Provider value={contextValue}>
      <section className='card' id='annotations'>
        <div className='card-header'>
          <h2>
            <FaStickyNote className='header-icon' /> Anotações
          </h2>
        </div>
        {/* Anotações Rápidas */}
        <div className='annotations-subsection'>
          <div className='subsection-header'>
            <h3>
              <FaBolt className='subsection-icon' /> Anotações rápidas
            </h3>
          </div>
          <div className='subsection-content'>
            <div className='quick-notes-container'>
              <QuickNotesBadge
                type='feature-flag'
                text='Organization'
                onFeatureFlagClick={async () => {
                  // Obter envId do hook primeiro, depois do localStorage como fallback
                  let envId = bugData?.envId || '';

                  // Se não tem no hook, buscar diretamente no localStorage
                  if (!envId || envId.toString().trim() === '') {
                    try {
                      const savedData = localStorage.getItem('bugRegistration');
                      if (savedData) {
                        const parsedData = JSON.parse(savedData);
                        envId = parsedData?.envId || '';
                      }
                    } catch (err) {
                      console.warn('Erro ao ler localStorage:', err);
                    }
                  }

                  const hasValidEnvId = envId && envId.toString().trim() !== '';
                  const featureFlagText = hasValidEnvId
                    ? `Organization;${envId}`
                    : 'Organization;';

                  logger.debug('Feature Flag Badge clicada!');
                  logger.debug('bugData.envId (hook):', bugData?.envId);
                  logger.debug('envId (final):', envId);
                  logger.debug('hasValidEnvId:', hasValidEnvId);
                  logger.debug('Texto copiado:', featureFlagText);

                  try {
                    await navigator.clipboard.writeText(featureFlagText);
                    logger.debug('Texto copiado com sucesso!');
                  } catch (err) {
                    console.error('Erro ao copiar:', err);
                  }
                }}
              />
              <QuickNotesBadge type='api-v1' text='API v1' />
              <QuickNotesBadge type='api-v2' text='API v2' />
              <QuickNotesBadge type='storage-produto' text='[TEC] Produto' />
              <QuickNotesBadge type='discoverys' text='[TEC] Discoverys' />
              <QuickNotesBadge
                type='documentacoes'
                text='[TEC] Documentações por funcionalidade'
              />
              <QuickNotesBadge type='style-guide' text='[TEC] Style Guide' />
              <QuickNotesBadge type='testlink' text='Testlink' />
            </div>
          </div>
        </div>
        {/* Anotações Personalizadas */}
        <div className='annotations-subsection'>
          <div className='subsection-header'>
            <h3>
              <FaEdit className='subsection-icon' /> Anotações personalizadas
            </h3>
          </div>
          <div className='subsection-content'>
            {/* Barra de formatação global */}
            <div className='global-formatting-toolbar'>
              <div
                className={`toolbar-formatting ${!activeEditor ? 'disabled' : ''}`}
              >
                <div className='toolbar-section'>
                  <ToolbarButton
                    action='bold'
                    active={activeEditor?.isActive('bold')}
                    title='Negrito'
                    disabled={!activeEditor}
                  >
                    <FaBold />
                  </ToolbarButton>
                  <ToolbarButton
                    action='italic'
                    active={activeEditor?.isActive('italic')}
                    title='Itálico'
                    disabled={!activeEditor}
                  >
                    <FaItalic />
                  </ToolbarButton>
                  <ToolbarButton
                    action='underline'
                    active={activeEditor?.isActive('underline')}
                    title='Sublinhado'
                    disabled={!activeEditor}
                  >
                    <FaUnderline />
                  </ToolbarButton>
                  <ToolbarButton
                    action='strike'
                    active={activeEditor?.isActive('strike')}
                    title='Riscado'
                    disabled={!activeEditor}
                  >
                    <FaStrikethrough />
                  </ToolbarButton>
                </div>

                <div className='toolbar-divider'></div>

                <div className='toolbar-section'>
                  <ToolbarButton
                    action='bulletList'
                    active={activeEditor?.isActive('bulletList')}
                    title='Lista'
                    disabled={!activeEditor}
                  >
                    <FaListUl />
                  </ToolbarButton>
                  <ToolbarButton
                    action='orderedList'
                    active={activeEditor?.isActive('orderedList')}
                    title='Lista numerada'
                    disabled={!activeEditor}
                  >
                    <FaListOl />
                  </ToolbarButton>
                  <ToolbarButton
                    action='taskList'
                    active={activeEditor?.isActive('taskList')}
                    title='Lista de tarefas'
                    disabled={!activeEditor}
                  >
                    <FaCheck />
                  </ToolbarButton>
                </div>

                <div className='toolbar-divider'></div>

                <div className='toolbar-section'>
                  <ToolbarButton
                    action='image'
                    title='Inserir imagem'
                    disabled={!activeEditor}
                  >
                    <FaImage />
                  </ToolbarButton>
                </div>

                <div className='toolbar-divider'></div>

                {/* Nova seção de cores */}
                <div className='toolbar-section'>
                  <ToolbarButton
                    action='textColor'
                    active={showColorLine && colorLineMode === 'text'}
                    title='Cor do texto selecionado'
                    disabled={!activeEditor}
                    onClick={handleTextColorClick}
                  >
                    <FaFont />
                  </ToolbarButton>
                  <ToolbarButton
                    action='cardColors'
                    active={showColorLine && colorLineMode === 'card'}
                    title='Cores do card (fundo e texto)'
                    disabled={!activeEditor}
                    onClick={handleCardColorsClick}
                  >
                    <FaPalette />
                  </ToolbarButton>
                </div>
              </div>

              {/* Spacer para empurrar os botões de ação para a direita */}
              <div className='toolbar-spacer'></div>

              {/* Botões de ação - sempre ativos */}
              <div className='toolbar-section toolbar-actions'>
                {notes.length > 0 && (
                  <button
                    className='global-toolbar-button action-clear'
                    onClick={handleClearAll}
                    title='Limpar todas as anotações'
                  >
                    <FaTrashAlt />
                  </button>
                )}
                <button
                  className='global-toolbar-button action-add'
                  onClick={handleAddNote}
                  title='Adicionar nova anotação'
                >
                  <FaPlus />
                </button>
              </div>
            </div>

            {/* Linha secundária de cores (expansível) */}
            {showColorLine && (
              <div className='color-line-toolbar'>
                {colorLineMode === 'text' && (
                  <div className='color-line-content'>
                    <div className='color-line-section'>
                      <span className='color-line-label'>Cor do texto:</span>
                      <div className='color-options-row'>
                        <ColorPicker
                          type='general'
                          onChange={handleTextColorChange}
                          title='Cor personalizada'
                        />
                        {customGeneralColor && (
                          <ColorOption
                            color={customGeneralColor}
                            onClick={() =>
                              handleTextColorChange(customGeneralColor)
                            }
                            title='Cor personalizada'
                          />
                        )}
                        {EXTENDED_COLORS.general.map(color => (
                          <ColorOption
                            key={color.value}
                            color={color.value}
                            onClick={() => handleTextColorChange(color.value)}
                            title={color.name}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {colorLineMode === 'card' && (
                  <div className='color-line-content' data-mode='card'>
                    <div className='color-line-section'>
                      <span className='color-line-label'>🎨 Fundo:</span>
                      <div className='color-options-row'>
                        <ColorPicker
                          type='background'
                          onChange={color => handleCardColorChange(color, true)}
                          title='Cor de fundo personalizada'
                        />
                        {customBackgroundColor && (
                          <ColorOption
                            color={customBackgroundColor}
                            isSelected={
                              activeNote?.backgroundColor ===
                              customBackgroundColor
                            }
                            onClick={() =>
                              handleCardColorChange(customBackgroundColor, true)
                            }
                            title='Cor personalizada'
                          />
                        )}
                        {EXTENDED_COLORS.backgrounds.map(color => (
                          <ColorOption
                            key={color.value}
                            color={color.value}
                            isSelected={
                              activeNote?.backgroundColor === color.value
                            }
                            onClick={() =>
                              handleCardColorChange(color.value, true)
                            }
                            title={color.name}
                          />
                        ))}
                      </div>
                    </div>

                    <div className='color-line-section'>
                      <span className='color-line-label'>📝 Texto:</span>
                      <div className='color-options-row'>
                        <ColorPicker
                          type='text'
                          onChange={color =>
                            handleCardColorChange(color, false)
                          }
                          title='Cor de texto personalizada'
                        />
                        {customTextColor && (
                          <ColorOption
                            color={customTextColor}
                            isSelected={
                              activeNote?.textColor === customTextColor
                            }
                            onClick={() =>
                              handleCardColorChange(customTextColor, false)
                            }
                            title='Cor personalizada'
                          />
                        )}
                        {EXTENDED_COLORS.texts.map(color => (
                          <ColorOption
                            key={color.value}
                            color={color.value}
                            isSelected={activeNote?.textColor === color.value}
                            onClick={() =>
                              handleCardColorChange(color.value, false)
                            }
                            title={color.name}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Área de trabalho das anotações dentro da seção */}
            <div ref={containerRef} className='annotations-workspace'>
              {notes.map(note => (
                <MiniCard
                  key={note.id}
                  note={note}
                  onUpdate={updates => updateNote(note.id, updates)}
                  onDelete={() => handleDeleteNote(note.id)}
                />
              ))}

              {notes.length === 0 && (
                <div className='empty-workspace'>
                  <div className='empty-content'>
                    <FaStickyNote className='empty-icon' />
                    <p>Nenhuma anotação ainda</p>
                    <p className='empty-subtitle'>
                      Clique no botão &ldquo;Nova&rdquo; para criar sua primeira
                      anotação
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Input hidden para upload de imagem */}
            <input
              ref={fileInputRef}
              type='file'
              accept='image/*'
              style={{ display: 'none' }}
              onChange={handleImageUpload}
            />
          </div>{' '}
          {/* Fim do subsection-content */}
        </div>{' '}
        {/* Fim da seção de anotações personalizadas */}
        {/* Modal de confirmação de exclusão */}
        {showDeleteConfirm && (
          <div className='delete-modal-overlay' onClick={cancelDelete}>
            <div className='delete-modal' onClick={e => e.stopPropagation()}>
              <div className='delete-modal-content'>
                <FaTrashAlt className='delete-modal-icon' />
                <h3>Confirmar exclusão</h3>
                <p>Tem certeza de que deseja excluir esta anotação?</p>
                <p className='delete-warning'>
                  Esta ação não pode ser desfeita.
                </p>
                <div className='delete-modal-actions'>
                  <button className='action-button' onClick={cancelDelete}>
                    Cancelar
                  </button>
                  <button
                    className='action-button delete'
                    onClick={confirmDelete}
                  >
                    <FaTrashAlt />
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </ActiveEditorContext.Provider>
  );
};

export default AnnotationsCard;
