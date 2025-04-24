export const CONFIG = {
    // Configurações de tema
    THEME: {
        LIGHT: 'light',
        DARK: 'dark',
        STORAGE_KEY: 'theme-preference',
        COLORS: {
            PRIMARY: '#007bff',
            SECONDARY: '#6c757d',
            SUCCESS: '#28a745',
            DANGER: '#dc3545',
            WARNING: '#ffc107',
            INFO: '#17a2b8',
            BACKGROUND: '#1e2124',
            CARD_BG: '#2a2e33',
            TEXT_PRIMARY: '#ffffff',
            TEXT_SECONDARY: '#8b9199',
            BORDER: '#373b40'
        }
    },
    
    // Configurações de máscaras
    MASK: {
        CPF: '###.###.###-##',
        CNPJ: '##.###.###/####-##',
        RG: '##.###.###-#'
    },
    
    // Configurações de feedback
    TOAST: {
        DURATION: 3000,
        POSITION: {
            TOP: '20px',
            RIGHT: '20px'
        },
        STYLES: {
            SUCCESS: {
                BACKGROUND: '#28a745',
                COLOR: '#fff'
            },
            ERROR: {
                BACKGROUND: '#dc3545',
                COLOR: '#fff'
            },
            INFO: {
                BACKGROUND: '#17a2b8',
                COLOR: '#fff'
            }
        }
    },
    
    // Configurações de performance
    DEBOUNCE: {
        REGENERATE: 300,
        COPY: 200
    },

    // Configurações de layout
    LAYOUT: {
        CARD: {
            BORDER_RADIUS: '0.5rem',
            BOX_SHADOW: '0 4px 6px rgba(0, 0, 0, 0.1)',
            HOVER_SHADOW: '0 6px 12px rgba(0, 0, 0, 0.15)',
            MARGIN: '1rem 0',
            PADDING: '1.5rem'
        },
        BUTTON: {
            BORDER_RADIUS: '0.375rem',
            PADDING: '0.5rem 1rem',
            ICON_SIZE: '1.25rem'
        },
        FIELD: {
            MARGIN: '1rem 0',
            LABEL_COLOR: '#8b9199',
            INPUT_BG: '#2a2e33',
            INPUT_BORDER: '#373b40',
            INPUT_TEXT: '#ffffff'
        },
        HEADER: {
            TITLE_SIZE: '2rem',
            SUBTITLE_SIZE: '1rem',
            TITLE_COLOR: '#ffffff',
            SUBTITLE_COLOR: '#8b9199'
        }
    }
}; 