import { useState, useEffect, useCallback, useRef } from 'react';
import CryptoJS from 'crypto-js';

const STORAGE_KEY = 'kqa-annotations';
const ENCRYPTION_KEY = 'kqa-annotations-key';
const DEBUG_MODE = false; // Mude para true para testar sem criptografia

// Funções de criptografia para proteger os dados das anotações
const encryptData = data => {
  try {
    if (DEBUG_MODE) {
      return JSON.stringify(data);
    }
    const jsonString = JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(
      jsonString,
      ENCRYPTION_KEY
    ).toString();
    return encrypted;
  } catch (error) {
    console.error('Erro ao criptografar dados das anotações:', error);
    return null;
  }
};

const decryptData = encryptedData => {
  try {
    if (DEBUG_MODE) {
      return JSON.parse(encryptedData);
    }
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);

    if (!decryptedString) {
      return [];
    }

    const parsed = JSON.parse(decryptedString);
    return parsed;
  } catch (error) {
    console.error('Erro ao descriptografar dados das anotações:', error);
    return [];
  }
};

// Hook para gerenciar anotações
export const useAnnotations = () => {
  const [notes, setNotes] = useState([]);
  const saveTimeoutRef = useRef(null);
  const isInitialLoadRef = useRef(true);

  // Função de debug global (apenas para desenvolvimento)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.debugKQAAnnotations = {
        checkStorage: () => {
          const data = localStorage.getItem(STORAGE_KEY);
          if (data) {
            const decrypted = decryptData(data);
            return { raw: data, decrypted };
          }
          return null;
        },
        clearStorage: () => {
          localStorage.removeItem(STORAGE_KEY);
          return 'Storage limpo';
        },
        checkQuota: () => {
          const used = JSON.stringify(localStorage).length;
          const limit = 5 * 1024 * 1024; // 5MB aproximado
          return { used, limit, percentage: (used / limit) * 100 };
        },
        cleanOldData: () => {
          const keys = Object.keys(localStorage);
          let cleaned = 0;
          keys.forEach(key => {
            if (key.startsWith('kqa-') && key !== STORAGE_KEY) {
              localStorage.removeItem(key);
              cleaned++;
            }
          });
          return `${cleaned} chaves antigas removidas`;
        },
        saveTestData: () => {
          const testData = [
            {
              id: Date.now(),
              x: 100,
              y: 100,
              width: 300,
              height: 200,
              content: '<p>Anotação de teste via console!</p>',
              backgroundColor: '#fef9e7',
              textColor: '#374151',
              lastModified: new Date().toISOString(),
            },
          ];
          const encrypted = encryptData(testData);
          localStorage.setItem(STORAGE_KEY, encrypted);
          return 'Dados de teste salvos! Recarregue a página.';
        },
        saveTestDataNoEncryption: () => {
          const testData = [
            {
              id: Date.now(),
              x: 150,
              y: 150,
              width: 300,
              height: 200,
              content: '<p>Teste SEM criptografia!</p>',
              backgroundColor: '#eff6ff',
              textColor: '#8be9fd',
              lastModified: new Date().toISOString(),
            },
          ];
          localStorage.setItem(STORAGE_KEY, JSON.stringify(testData));
          console.log(
            '✅ Dados de teste salvos SEM criptografia! Recarregue a página.'
          );
        },
        getCurrentNotes: () => {
          // Debug: anotações carregadas
          return notes;
        },
        checkImages: () => {
          const results = [];
          notes.forEach((note, index) => {
            const imageMatches = note.content.match(
              /<img[^>]*src="data:image\/[^"]*"/g
            );
            if (imageMatches) {
              const images = imageMatches
                .map((img, imgIndex) => {
                  const srcMatch = img.match(/src="(data:image\/[^"]*)"/);
                  if (srcMatch) {
                    const src = srcMatch[1];
                    const sizeKB = Math.round((src.length * 0.75) / 1024);
                    return {
                      index: imgIndex + 1,
                      preview: src.substring(0, 50) + '...',
                      sizeKB,
                    };
                  }
                  return null;
                })
                .filter(Boolean);

              results.push({
                noteId: note.id,
                noteIndex: index + 1,
                imageCount: imageMatches.length,
                images,
              });
            }
          });

          const totalImages = notes.reduce((acc, note) => {
            const matches = note.content.match(
              /<img[^>]*src="data:image\/[^"]*"/g
            );
            return acc + (matches ? matches.length : 0);
          }, 0);

          return { totalImages, notesCount: notes.length, results };
        },
        testImageSave: () => {
          const testImageData =
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
          const testNote = {
            id: Date.now(),
            x: 100,
            y: 100,
            width: 300,
            height: 200,
            content: `<p>Teste de imagem:</p><img src="${testImageData}" class="note-image" alt="teste">`,
            backgroundColor: '#fef9e7',
            textColor: '#374151',
            lastModified: new Date().toISOString(),
          };

          const currentNotes = [...notes, testNote];
          const encrypted = encryptData(currentNotes);
          if (encrypted) {
            localStorage.setItem(STORAGE_KEY, encrypted);
            return 'Anotação de teste com imagem salva! Recarregue a página.';
          }
          return 'Erro ao salvar teste';
        },
      };
    }
  }, [notes]);

  // Carregar anotações do localStorage na inicialização
  useEffect(() => {
    const loadNotes = () => {
      try {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
          const decryptedNotes = decryptData(savedData);
          if (Array.isArray(decryptedNotes) && decryptedNotes.length > 0) {
            setNotes(decryptedNotes);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar anotações:', error);
        setNotes([]);
      }
    };

    loadNotes();
  }, []);

  // Salvar anotações no localStorage com debounce
  useEffect(() => {
    // Não salvar no carregamento inicial
    if (isInitialLoadRef.current) {
      isInitialLoadRef.current = false;
      return;
    }

    // Limpar timeout anterior se houver
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Definir novo timeout para salvar após 2 segundos
    saveTimeoutRef.current = setTimeout(() => {
      try {
        const encryptedData = encryptData(notes);
        if (encryptedData) {
          localStorage.setItem(STORAGE_KEY, encryptedData);
        }
      } catch (error) {
        console.error('Erro ao salvar anotações:', error);
      }
    }, 2000);

    // Cleanup do timeout quando o componente for desmontado
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [notes]);

  // Função para salvar imediatamente (chamada quando sair do foco)
  const saveImmediately = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    try {
      const encryptedData = encryptData(notes);
      if (encryptedData) {
        localStorage.setItem(STORAGE_KEY, encryptedData);
      }
    } catch (error) {
      console.error('Erro no salvamento imediato:', error);
    }
  }, [notes]);

  // Adicionar nova anotação
  const addNote = useCallback(noteData => {
    const newNote = {
      id: Date.now() + Math.random(), // ID mais único
      x: 50,
      y: 50,
      width: 300,
      height: 200,
      content: '<p>Digite sua anotação aqui...</p>',
      backgroundColor: '#fef9e7',
      textColor: '#374151',
      lastModified: new Date().toISOString(),
      ...noteData,
    };

    setNotes(prevNotes => [...prevNotes, newNote]);
    return newNote.id;
  }, []);

  // Atualizar anotação existente
  const updateNote = useCallback((noteId, updates) => {
    setNotes(prevNotes =>
      prevNotes.map(note =>
        note.id === noteId
          ? {
              ...note,
              ...updates,
              lastModified: new Date().toISOString(),
            }
          : note
      )
    );
  }, []);

  // Deletar anotação
  const deleteNote = useCallback(noteId => {
    setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));
  }, []);

  // Limpar todas as anotações
  const clearAllNotes = useCallback(() => {
    setNotes([]);
  }, []);

  // Buscar anotação por ID
  const getNoteById = useCallback(
    noteId => {
      return notes.find(note => note.id === noteId) || null;
    },
    [notes]
  );

  // Duplicar anotação
  const duplicateNote = useCallback(
    noteId => {
      const noteToClone = getNoteById(noteId);
      if (noteToClone) {
        const duplicatedNote = {
          ...noteToClone,
          id: Date.now() + Math.random(),
          x: noteToClone.x + 20, // Offset para não sobrepor
          y: noteToClone.y + 20,
          lastModified: new Date().toISOString(),
        };
        setNotes(prevNotes => [...prevNotes, duplicatedNote]);
        return duplicatedNote.id;
      }
      return null;
    },
    [getNoteById]
  );

  // Estatísticas das anotações
  const getNotesStats = useCallback(() => {
    const totalNotes = notes.length;
    const totalCharacters = notes.reduce((acc, note) => {
      // Remove HTML tags para contar apenas texto
      const textContent = note.content.replace(/<[^>]*>/g, '');
      return acc + textContent.length;
    }, 0);

    const lastModified =
      notes.length > 0
        ? Math.max(...notes.map(note => new Date(note.lastModified).getTime()))
        : null;

    return {
      totalNotes,
      totalCharacters,
      lastModified: lastModified ? new Date(lastModified) : null,
    };
  }, [notes]);

  // Exportar anotações como JSON
  const exportNotes = useCallback(() => {
    const exportData = {
      notes,
      exportDate: new Date().toISOString(),
      version: '1.0',
    };
    return JSON.stringify(exportData, null, 2);
  }, [notes]);

  // Importar anotações de JSON
  const importNotes = useCallback(jsonData => {
    try {
      const importData = JSON.parse(jsonData);
      if (importData.notes && Array.isArray(importData.notes)) {
        // Gerar novos IDs para evitar conflitos
        const importedNotes = importData.notes.map(note => ({
          ...note,
          id: Date.now() + Math.random(),
          lastModified: new Date().toISOString(),
        }));
        setNotes(prevNotes => [...prevNotes, ...importedNotes]);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro ao importar anotações:', error);
      return false;
    }
  }, []);

  return {
    notes,
    addNote,
    updateNote,
    deleteNote,
    clearAllNotes,
    getNoteById,
    duplicateNote,
    getNotesStats,
    exportNotes,
    importNotes,
    saveImmediately,
  };
};
