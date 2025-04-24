import { CONFIG } from './config.js';

class ThemeManager {
    constructor() {
        this.init();
    }

    init() {
        this.loadThemePreference();
    }

    loadThemePreference() {
        // Sempre usar o tema escuro por padrão
        this.setTheme(CONFIG.THEME.DARK);
    }

    setTheme(theme) {
        if (theme === CONFIG.THEME.DARK) {
            document.body.classList.add('dark-theme');
            
            // Aplicar cores do tema
            const root = document.documentElement;
            const colors = CONFIG.THEME.COLORS;
            
            root.style.setProperty('--primary-color', colors.PRIMARY);
            root.style.setProperty('--secondary-color', colors.SECONDARY);
            root.style.setProperty('--success-color', colors.SUCCESS);
            root.style.setProperty('--background-color', colors.BACKGROUND);
            root.style.setProperty('--text-color', colors.TEXT_PRIMARY);
            root.style.setProperty('--card-bg', colors.CARD_BG);
            root.style.setProperty('--border-color', colors.BORDER);
        }
    }
}

export const themeManager = new ThemeManager(); 