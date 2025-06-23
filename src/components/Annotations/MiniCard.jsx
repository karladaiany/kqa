import React, { useState, useRef, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Rnd } from 'react-rnd';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextStyle from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Image from '@tiptap/extension-image';
import { FaGripVertical, FaTrashAlt, FaCopy } from 'react-icons/fa';
import { useAnnotations } from '../../hooks/useAnnotations';
import { useActiveEditor } from './AnnotationsCard';

export const MiniCard = ({ note, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { saveImmediately } = useAnnotations();
  const { setActiveEditor, setActiveNote } = useActiveEditor();
  const fileInputRef = useRef(null);
  const cardRef = useRef(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Underline,
      Highlight.configure({ multicolor: true }),
      TaskList,
      TaskItem.configure({
        nested: true,
        HTMLAttributes: {
          class: 'task-item-custom',
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: 'note-image',
          style:
            'max-width: 100%; height: auto; border-radius: 4px; margin: 4px 0;',
        },
      }),
    ],
    content: note.content,
    onUpdate: ({ editor: editorInstance }) => {
      const html = editorInstance.getHTML();
      const updates = {
        content: html,
        lastModified: new Date().toISOString(),
      };
      onUpdate(updates);
    },
    onSelectionUpdate: ({ editor: editorInstance }) => {
      handleSelectionChange(editorInstance);
    },
    editorProps: {
      attributes: {
        class: 'mini-card-editor',
      },
    },
  });

  // Função para detectar seleção de texto
  const handleSelectionChange = useCallback(
    editorInstance => {
      // Verificar se este editor é o ativo atual
      if (editorInstance !== editor) return;

      const { from, to } = editorInstance.state.selection;
      const hasSelection = from !== to;

      console.log('🎯 Selection change:', { hasSelection, isEditing });
    },
    [isEditing, editor]
  );

  useEffect(() => {
    if (editor && editor.getHTML() !== note.content) {
      editor.commands.setContent(note.content);
    }
  }, [editor, note.content]);

  const handleResize = useCallback(
    (e, direction, ref, delta, position) => {
      const updates = {
        width: ref.style.width,
        height: ref.style.height,
        x: position.x,
        y: position.y,
        lastModified: new Date().toISOString(),
      };
      onUpdate(updates);
    },
    [onUpdate]
  );

  const handleDragStop = useCallback(
    (e, data) => {
      const updates = {
        x: data.x,
        y: data.y,
        lastModified: new Date().toISOString(),
      };
      onUpdate(updates);
    },
    [onUpdate]
  );

  const handleCopy = useCallback(
    async event => {
      event.preventDefault();
      event.stopPropagation();

      if (!editor) return;

      try {
        // Obter texto puro do editor, removendo HTML
        const textContent = editor.getText();

        if (textContent.trim()) {
          await navigator.clipboard.writeText(textContent);

          // Feedback visual opcional - pode ser implementado como toast depois
          console.log('📋 Conteúdo copiado para área de transferência');

          // Criar feedback visual temporário
          const button = event.currentTarget;
          const originalTitle = button.title;
          button.title = 'Copiado!';
          button.style.background = '#10b981';
          button.style.color = 'white';

          setTimeout(() => {
            button.title = originalTitle;
            button.style.background = '';
            button.style.color = '';
          }, 1000);
        }
      } catch (error) {
        console.error('❌ Erro ao copiar conteúdo:', error);

        // Fallback para navegadores mais antigos
        try {
          const textArea = document.createElement('textarea');
          textArea.value = editor.getText();
          textArea.style.position = 'fixed';
          textArea.style.left = '-9999px';
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);

          console.log('📋 Conteúdo copiado usando fallback');
        } catch (fallbackError) {
          console.error('❌ Erro no fallback de cópia:', fallbackError);
        }
      }
    },
    [editor]
  );

  const handleFocus = useCallback(() => {
    setIsEditing(true);
    setActiveEditor(editor);
    setActiveNote(note);
  }, [editor, note, setActiveEditor, setActiveNote]);

  const handleBlur = useCallback(
    event => {
      // Verificar se o clique foi na toolbar flutuante
      const clickedElement = event.relatedTarget;
      if (clickedElement && clickedElement.closest('.floating-toolbar')) {
        console.log('🎯 Clique na toolbar detectado, mantendo foco');
        return; // Não fazer blur se clicou na toolbar
      }

      // Delay para permitir cliques na toolbar
      setTimeout(() => {
        console.log('🎯 Blur timeout executado');
        setIsEditing(false);
        saveImmediately();
      }, 200);
    },
    [saveImmediately]
  );

  const handleImageUpload = useCallback(
    event => {
      const file = event.target.files?.[0];
      // Upload de imagem iniciado

      if (file && editor) {
        // Verificar tamanho do arquivo (limite de 2MB para evitar problemas de quota)
        const maxSize = 2 * 1024 * 1024; // 2MB
        if (file.size > maxSize) {
          console.warn(
            '⚠️ Imagem muito grande:',
            file.size,
            'bytes. Máximo:',
            maxSize
          );
          alert(
            'Imagem muito grande! Por favor, selecione uma imagem menor que 2MB.'
          );
          return;
        }

        const reader = new FileReader();
        reader.onload = e => {
          const url = e.target?.result;
          console.log(
            '📸 Imagem convertida para base64:',
            typeof url,
            url?.toString().substring(0, 100) + '...'
          );

          if (typeof url === 'string') {
            // Inserir imagem no editor
            editor
              .chain()
              .focus()
              .setImage({
                src: url,
                alt: file.name,
                title: file.name,
              })
              .run();

            // Imagem inserida no editor

            // Forçar atualização do conteúdo
            setTimeout(() => {
              const currentContent = editor.getHTML();
              console.log(
                '📝 Conteúdo atual do editor:',
                currentContent.substring(0, 200) + '...'
              );

              // Verificar se a imagem foi realmente inserida
              const hasImage = currentContent.includes('data:image/');
              // Verificando se há imagem no conteúdo

              if (hasImage) {
                // Forçar salvamento imediato
                const updates = {
                  content: currentContent,
                  lastModified: new Date().toISOString(),
                };
                onUpdate(updates);
                console.log('💾 Salvamento forçado após inserção de imagem');
              }
            }, 100);
          }
        };

        reader.onerror = error => {
          console.error('❌ Erro ao ler arquivo:', error);
          alert('Erro ao processar a imagem. Tente novamente.');
        };

        reader.readAsDataURL(file);
      }

      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [editor, onUpdate]
  );

  const handleToolbarAction = useCallback(
    (action, event) => {
      event.preventDefault();
      event.stopPropagation();

      if (!editor) return;

      switch (action) {
        case 'bold':
          editor.chain().focus().toggleBold().run();
          break;
        case 'italic':
          editor.chain().focus().toggleItalic().run();
          break;
        case 'underline':
          editor.chain().focus().toggleUnderline().run();
          break;
        case 'strike':
          editor.chain().focus().toggleStrike().run();
          break;
        case 'bulletList':
          editor.chain().focus().toggleBulletList().run();
          break;
        case 'orderedList':
          editor.chain().focus().toggleOrderedList().run();
          break;
        case 'taskList':
          editor.chain().focus().toggleTaskList().run();
          break;
        case 'image':
          fileInputRef.current?.click();
          break;
        default:
          break;
      }
    },
    [editor]
  );

  const MenuButton = ({ action, active, children, title }) => (
    <button
      type='button'
      className={`toolbar-button ${active ? 'active' : ''}`}
      onMouseDown={e => handleToolbarAction(action, e)}
      title={title}
    >
      {children}
    </button>
  );

  MenuButton.propTypes = {
    action: PropTypes.string.isRequired,
    active: PropTypes.bool,
    children: PropTypes.node.isRequired,
    title: PropTypes.string.isRequired,
  };

  if (!editor) {
    return null;
  }

  return (
    <Rnd
      size={{
        width: note.width,
        height: note.height,
      }}
      position={{
        x: note.x,
        y: note.y,
      }}
      onDragStop={handleDragStop}
      onResizeStop={handleResize}
      minWidth={200}
      minHeight={200}
      bounds='parent'
      dragHandleClassName='mini-card-drag-handle'
      style={{
        zIndex: isEditing ? 1000 : 1,
      }}
    >
      <div
        ref={cardRef}
        className='mini-card'
        style={{
          backgroundColor: note.backgroundColor,
          color: note.textColor,
        }}
        onMouseEnter={handleFocus}
      >
        {/* Header da anotação */}
        <div className='mini-card-header'>
          <div className='mini-card-drag-handle'>
            <FaGripVertical />
          </div>
          <div className='mini-card-actions'>
            <button
              type='button'
              className='mini-card-action copy'
              onClick={handleCopy}
              title='Copiar conteúdo'
            >
              <FaCopy />
            </button>
            <button
              type='button'
              className='mini-card-action delete'
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                onDelete();
              }}
              title='Excluir anotação'
            >
              <FaTrashAlt />
            </button>
          </div>
        </div>
        {/* Área de conteúdo editável */}
        <div
          className='mini-card-content'
          onFocus={handleFocus}
          onBlur={handleBlur}
        >
          <EditorContent editor={editor} />
        </div>
        {/* Input hidden para upload de imagem */}
        <input
          ref={fileInputRef}
          type='file'
          accept='image/*'
          style={{ display: 'none' }}
          onChange={handleImageUpload}
        />
        {/* Timestamp da última modificação */}
        <div className='mini-card-timestamp'>
          {new Date(note.lastModified).toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
    </Rnd>
  );
};

MiniCard.propTypes = {
  note: PropTypes.shape({
    id: PropTypes.string.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    content: PropTypes.string.isRequired,
    backgroundColor: PropTypes.string.isRequired,
    textColor: PropTypes.string.isRequired,
    lastModified: PropTypes.string.isRequired,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
