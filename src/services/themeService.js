// src/services/themeService.js
export class ThemeService {
  constructor() {
    this.themes = {
      soft: {
        name: 'Strawberry Blush',
        colors: {
          primary: '#F28BA8',      // Rosa fresa (para títulos y detalles)
          secondary: '#FADADD',    // Rosa claro (para fondos suaves)
          accent: '#FFB5B5',       // Coral pastel (áreas resaltadas como el fondo del calendario)
          background: '#FFF9F6',   // Fondo blanco cálido con un toque rosado
          surface: '#FFFFFF',      // Blanco puro para contraste
          text: '#E7627D',         // Rosa fuerte (texto principal)
          textSecondary: '#A6C8A0' // Verde menta pastel (hojitas de la fresa)
        }
      },
      coral: {
        name: 'Coral',
        colors: {
          primary: '#FF8A95',      // Coral principal
          secondary: '#FFAAA5',    // Coral claro
          accent: '#FFD3A5',       // Naranja suave
          background: '#FFF8F6',   // Fondo coral muy suave
          surface: '#FFFFFF',      // Blanco para contraste
          text: '#2D3748',         // Texto oscuro
          textSecondary: '#718096' // Texto secundario
        }
      },
      peach: {
        name: 'Durazno',
        colors: {
          primary: '#FFAB91',      // Durazno principal
          secondary: '#FFCC94',    // Durazno claro
          accent: '#FFE082',       // Amarillo suave
          background: '#FFF9F5',   // Fondo durazno muy suave
          surface: '#FFFFFF',      // Blanco
          text: '#37474F',         // Gris azulado oscuro
          textSecondary: '#78909C' // Gris azulado medio
        }
      },
      lavender: {
        name: 'Lavanda',
        colors: {
          primary: '#CE93D8',      // Lavanda suave
          secondary: '#E1BEE7',    // Lavanda más claro
          accent: '#F8BBD9',       // Rosa lavanda
          background: '#FAF5FF',   // Fondo lavanda muy suave
          surface: '#FFFFFF',      // Blanco
          text: '#4A5568',         // Gris oscuro
          textSecondary: '#A0AEC0' // Gris medio
        }
      },
      mint: {
        name: 'Menta',
        colors: {
          primary: '#A5D6A7',      // Verde menta suave
          secondary: '#C8E6C9',    // Verde más claro
          accent: '#DCEDC8',       // Verde lima suave
          background: '#F1F8E9',   // Fondo verde muy suave
          surface: '#FFFFFF',      // Blanco
          text: '#2E7D32',         // Verde oscuro
          textSecondary: '#66BB6A' // Verde medio
        }
      },
      sky: {
        name: 'Cielo',
        colors: {
          primary: '#90CAF9',      // Azul cielo suave
          secondary: '#BBDEFB',    // Azul más claro
          accent: '#E3F2FD',       // Azul muy claro
          background: '#F3F8FF',   // Fondo azul muy suave
          surface: '#FFFFFF',      // Blanco
          text: '#1565C0',         // Azul oscuro
          textSecondary: '#42A5F5' // Azul medio
        }
      }
    };

    this.fonts = {
      inter: 'Inter, system-ui, sans-serif',
      roboto: 'Roboto, system-ui, sans-serif',
      poppins: 'Poppins, system-ui, sans-serif',
      montserrat: 'Montserrat, system-ui, sans-serif',
      openSans: 'Open Sans, system-ui, sans-serif',
      comfortaa: 'Comfortaa, cursive, system-ui, sans-serif',
      nunito: 'Nunito, system-ui, sans-serif'
    };

    this.currentTheme = 'soft'; // Tema suave por defecto
    this.currentFont = 'inter';
    
    this.loadTheme();
  }

  applyTheme(themeName = this.currentTheme) {
    const theme = this.themes[themeName];
    if (!theme) return;

    const root = document.documentElement;
    
    // Aplicar colores como variables CSS
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    // Aplicar fuente
    root.style.setProperty('--font-family', this.fonts[this.currentFont]);

    this.currentTheme = themeName;
    this.saveTheme();
  }

  setFont(fontName) {
    if (this.fonts[fontName]) {
      this.currentFont = fontName;
      document.documentElement.style.setProperty('--font-family', this.fonts[fontName]);
      this.saveTheme();
    }
  }

  saveTheme() {
    const preferences = {
      theme: this.currentTheme,
      font: this.currentFont
    };
    localStorage.setItem('theme-preferences', JSON.stringify(preferences));
  }

  loadTheme() {
    const saved = localStorage.getItem('theme-preferences');
    if (saved) {
      const preferences = JSON.parse(saved);
      this.currentTheme = preferences.theme || 'soft';
      this.currentFont = preferences.font || 'inter';
    }
    this.applyTheme();
  }

  getThemes() {
    return Object.entries(this.themes).map(([key, theme]) => ({
      id: key,
      name: theme.name,
      colors: theme.colors
    }));
  }

  getFonts() {
    return Object.entries(this.fonts).map(([key, font]) => ({
      id: key,
      name: this.getFontDisplayName(key),
      fontFamily: font
    }));
  }

  getFontDisplayName(fontKey) {
    const names = {
      inter: 'Inter',
      roboto: 'Roboto',
      poppins: 'Poppins',
      montserrat: 'Montserrat',
      openSans: 'Open Sans',
      comfortaa: 'Comfortaa',
      nunito: 'Nunito'
    };
    return names[fontKey] || fontKey;
  }

  getCurrentTheme() {
    return this.currentTheme;
  }

  getCurrentFont() {
    return this.currentFont;
  }
}

export const themeService = new ThemeService();