# MyScheduler - PWA Calendar Application

Una aplicación de calendario progresiva (PWA) con soporte offline, instalación nativa y sincronización automática.

## 🚀 Características PWA

- ✅ **Instalable**: Se puede instalar como app nativa
- ✅ **Offline**: Funciona sin conexión a internet
- ✅ **Sincronización**: Los cambios se sincronizan automáticamente
- ✅ **Responsive**: Optimizada para móviles y desktop
- ✅ **Performance**: Carga rápida y navegación fluida
- ✅ **Notificaciones**: Soporte para notificaciones push (opcional)

## 📱 Instalación

### Como PWA (Recomendado)
1. Abre la aplicación en tu navegador
2. Busca el ícono de "Instalar" en la barra de direcciones
3. Haz clic en "Instalar" cuando aparezca el prompt
4. La app se instalará como una aplicación nativa

### Desarrollo Local

#### Prerrequisitos
- Node.js 16+ 
- Python 3.8+
- Conda (recomendado) o venv

#### Backend (FastAPI)
\`\`\`bash
# Crear entorno conda
conda create -n calendario-backend python=3.9
conda activate calendario-backend

# Instalar dependencias
pip install fastapi uvicorn sqlalchemy python-multipart

# Ejecutar servidor
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
\`\`\`

#### Frontend (Vue.js PWA)
\`\`\`bash
# Instalar dependencias
npm install

# Desarrollo con HTTPS (necesario para PWA)
npm run pwa:serve

# Build para producción
npm run build:pwa
\`\`\`

## 🔧 Configuración PWA

### Service Worker
El service worker se configura automáticamente y proporciona:
- Cache de archivos estáticos
- Cache de API con estrategia Network First
- Sincronización en background
- Soporte offline

### Manifest
La aplicación incluye un manifest.json que define:
- Nombre e iconos de la aplicación
- Tema y colores
- Modo de visualización standalone
- Shortcuts para acciones rápidas

### Estrategias de Cache

1. **Archivos Estáticos**: Cache First
   - HTML, CSS, JS, imágenes se cachean inmediatamente
   
2. **API Calls**: Network First con fallback
   - Intenta la red primero, fallback al cache
   - Datos offline disponibles cuando no hay conexión

3. **Background Sync**
   - Las operaciones offline se sincronizan automáticamente
   - Notificación cuando la sincronización se completa

## 📊 Funcionalidades Offline

### Crear Eventos
- Los eventos se guardan localmente cuando no hay conexión
- Se sincronizan automáticamente al recuperar la conexión
- Indicador visual de eventos pendientes de sincronización

### Editar/Eliminar
- Todas las operaciones funcionan offline
- Los cambios se almacenan en IndexedDB
- Sincronización automática en background

### Indicadores de Estado
- Indicador de conexión en tiempo real
- Contador de operaciones pendientes
- Notificaciones de sincronización completada

## 🎨 Optimizaciones de Performance

### Lazy Loading
- Componentes se cargan bajo demanda
- Imágenes con lazy loading automático

### Code Splitting
- Bundle dividido por rutas y vendors
- Carga inicial optimizada

### Critical CSS
- CSS crítico inline para First Paint rápido
- Preload de recursos importantes

### Compresión
- Gzip/Brotli en producción
- Minificación de assets

## 📱 Soporte Móvil

### Responsive Design
- Diseño adaptativo para todas las pantallas
- Touch-friendly para dispositivos móviles

### Gestos Táctiles
- Swipe para navegación
- Touch optimizado para calendario

### Safe Areas
- Soporte para notch y safe areas
- Optimizado para iOS y Android

## 🔔 Notificaciones (Opcional)

Para habilitar notificaciones push:

1. Configurar VAPID keys en el backend
2. Solicitar permisos en el frontend
3. Implementar endpoints de suscripción

\`\`\`javascript
// Ejemplo de suscripción a notificaciones
if ('Notification' in window && 'serviceWorker' in navigator) {
  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    // Configurar suscripción push
  }
}
\`\`\`

## 🚀 Deployment

### Vercel (Recomendado)
\`\`\`bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
\`\`\`

### Netlify
\`\`\`bash
# Build
npm run build:pwa

# Deploy carpeta dist/
\`\`\`

### Servidor Propio
\`\`\`bash
# Build
npm run build:pwa

# Servir con HTTPS (requerido para PWA)
# Usar nginx, Apache, o servidor de tu elección
\`\`\`

## 🔍 Testing PWA

### Lighthouse
\`\`\`bash
# Instalar Lighthouse CLI
npm install -g lighthouse

# Auditar PWA
lighthouse https://tu-app.com --view
\`\`\`

### PWA Builder
Usar [PWA Builder](https://www.pwabuilder.com/) para validar y generar packages para app stores.

## 📈 Métricas PWA

La aplicación está optimizada para:
- **Performance Score**: 90+
- **Accessibility**: 95+
- **Best Practices**: 90+
- **SEO**: 90+
- **PWA Score**: 100

## 🐛 Troubleshooting

### Service Worker no se actualiza
\`\`\`javascript
// Forzar actualización
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(registration => registration.unregister());
  });
}
\`\`\`

### Cache corrupto
\`\`\`javascript
// Limpiar cache
caches.keys().then(names => {
  names.forEach(name => caches.delete(name));
});
\`\`\`

### Problemas de sincronización
- Verificar conectividad de red
- Revisar logs del service worker
- Comprobar IndexedDB en DevTools

## 📄 Licencia

MIT License - ver archivo LICENSE para detalles.

## 🤝 Contribuir

1. Fork el proyecto
2. Crear feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request