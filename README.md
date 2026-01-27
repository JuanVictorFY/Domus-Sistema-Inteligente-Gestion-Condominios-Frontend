# Domus — Frontend

<div align="center">

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-HTTP-5A29E4?style=for-the-badge&logo=axios&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES2023-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

**Interfaz de usuario del Sistema Inteligente de Gestión de Condominios**

[![Live Demo](https://img.shields.io/badge/Demo-Live-brightgreen?style=for-the-badge&logo=render&logoColor=white)](https://domus-sistema-inteligente-gestion.onrender.com/)

[🖥️ Backend API](https://github.com/JuanVictorFY/Domus-Sistema-Inteligente-Gestion-Condominios-Backend) · [🚀 Demo en vivo](https://domus-sistema-inteligente-gestion.onrender.com/) · [⚙️ API en vivo](https://domus-sistema-inteligente-gestion-who4.onrender.com/api/health)

</div>

---

## Descripción

Domus es una plataforma web completa para la gestión inteligente de condominios. Este repositorio contiene la **interfaz de usuario** construida con React 19 y Bootstrap 5, que se conecta a la [API REST del backend](https://github.com/JuanVictorFY/Domus-Sistema-Inteligente-Gestion-Condominios-Backend) para brindar una experiencia moderna a administradores, residentes y personal de seguridad.

---

## Stack Tecnológico

| Tecnología | Versión | Uso |
|-----------|---------|-----|
| React | 19 | Librería de UI declarativa |
| Vite | 8 | Build tool y dev server |
| Bootstrap | 5.3 | Framework de estilos y componentes |
| Bootstrap Icons | 1.13 | Iconografía |
| Axios | 1.7 | Cliente HTTP con interceptores |
| React Router DOM | 6.x | Enrutamiento SPA |
| AOS | 2.3 | Animaciones al hacer scroll |
| jsPDF | 4.x | Exportación de reportes en PDF |

---

## Vistas y Módulos

### 🏠 Landing Page Pública
- Hero con animaciones y CTA
- Sección de funcionalidades del sistema
- Cómo funciona (pasos del flujo)
- Planes y precios
- Sección nosotros
- Formulario de contacto conectado al backend
- Footer con redes sociales y enlaces

### 🔐 Autenticación
- Login con JWT
- Recuperación de contraseña por correo
- Restablecimiento de contraseña seguro
- Rutas protegidas por rol

### 👑 Dashboard Administrador
- Métricas en tiempo real (usuarios, tickets, reservas)
- Gestión completa de residentes (CRUD + correos de bienvenida)
- Gestión de áreas comunes
- Aprobación/rechazo de reservas
- Comunicados del condominio
- Panel de control de seguridad
- Bitácora digital de visitantes
- Módulo de encuestas y votaciones
- Notificaciones internas
- Reportes mensuales exportables en PDF

### 🏡 Dashboard Residente
- Resumen personal: tickets, reservas, notificaciones
- Solicitar y gestionar reservas de áreas
- Tickets de incidencias y mantenimiento
- Registro de visitantes autorizados
- Registro de familiares, vehículos y mascotas
- Encuestas activas
- Notificaciones no leídas

### 🛡️ Dashboard Seguridad
- Control de ingreso/salida de visitantes
- Bitácora digital de accesos
- Alertas de pánico
- Gestión de paquetes recibidos

---

## Estructura del Proyecto

```
frontend/
├── index.html
├── vite.config.js
├── public/
│   ├── favicon.svg
│   └── icons.svg
└── src/
    ├── api.js                    # Cliente Axios con interceptores JWT
    ├── App.jsx                   # Árbol de rutas principal
    ├── main.jsx
    ├── components/
    │   ├── Alert.jsx             # Alertas con variantes
    │   ├── Avatar.jsx            # Avatar con iniciales y color determinístico
    │   ├── Badge.jsx             # Etiquetas de colores
    │   ├── ConfirmModal.jsx      # Modal de confirmación reutilizable
    │   ├── Contact.jsx           # Formulario de contacto
    │   ├── DataTable.jsx         # Tabla con paginación integrada
    │   ├── EmptyState.jsx        # Estado vacío con icono
    │   ├── ErrorBoundary.jsx     # Límite de error React
    │   ├── FeatureCard.jsx       # Tarjeta de funcionalidades
    │   ├── Footer.jsx            # Footer con CTA y redes sociales
    │   ├── Hero.jsx              # Sección principal de la landing
    │   ├── LoadingScreen.jsx     # Pantalla de carga inicial
    │   ├── Navbar.jsx            # Navegación principal
    │   ├── Pagination.jsx        # Paginación con elipsis
    │   ├── ProtectedRoute.jsx    # HOC para rutas autenticadas
    │   ├── ScrollToTop.jsx       # Scroll al inicio en cambio de ruta
    │   ├── SearchInput.jsx       # Input de búsqueda con limpiar
    │   ├── SectionTitle.jsx      # Títulos de sección con línea decorativa
    │   ├── Services.jsx          # Sección de servicios
    │   ├── Spinner.jsx           # Indicador de carga
    │   ├── StatCard.jsx          # Tarjeta de métricas con tendencia
    │   ├── StatusBadge.jsx       # Badges de estado del sistema
    │   ├── Testimonials.jsx      # Testimonios
    │   └── Toast.jsx             # Sistema de notificaciones toast
    ├── hooks/
    │   ├── useApi.js             # Hook genérico para llamadas a la API
    │   ├── useAuth.js            # Estado de autenticación y roles
    │   ├── useDebounce.js        # Debounce para búsquedas
    │   ├── useForm.js            # Estado y validación de formularios
    │   ├── useInterval.js        # Intervalos con referencia estable
    │   ├── useLocalStorage.js    # localStorage sincronizado
    │   ├── useNotifications.js   # Notificaciones con polling cada 30s
    │   ├── useOnClickOutside.js  # Detectar clic fuera de elemento
    │   ├── usePagination.js      # Paginación local
    │   ├── useSearch.js          # Filtrado con debounce
    │   └── useWindowSize.js      # Breakpoints responsive
    ├── pages/
    │   ├── Home.jsx              # Landing page
    │   ├── Dashboard.jsx         # Dashboard principal (multi-rol)
    │   ├── NotFound.jsx          # Página 404
    │   ├── auth/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   └── ResetPassword.jsx
    │   └── landing/
    │       ├── About.jsx
    │       ├── AppPromo.jsx
    │       ├── DashboardPreview.jsx
    │       ├── Faq.jsx
    │       ├── Features.jsx
    │       ├── Integrations.jsx
    │       └── Steps.jsx
    ├── styles/
    │   ├── App.css
    │   └── index.css
    └── utils/
        ├── api.js                # Funciones de servicio por módulo
        ├── cn.js                 # Composición de clases CSS
        ├── constants.js          # Roles, estados y constantes de UI
        ├── dateUtils.js          # Formateo de fechas (es-PE)
        ├── format.js             # Moneda, números, texto
        ├── storage.js            # Wrapper de localStorage con prefijo
        └── validators.js         # Validadores de formularios componibles
```

---

## Requisitos Previos

- Node.js 18+
- [Backend de Domus](https://github.com/JuanVictorFY/Domus-Sistema-Inteligente-Gestion-Condominios-Backend) configurado y corriendo

---

## Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/JuanVictorFY/Domus-Sistema-Inteligente-Gestion-Condominios-Frontend.git
cd Domus-Sistema-Inteligente-Gestion-Condominios-Frontend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env
```

Editar `.env`:

```env
# URL de la API del backend
VITE_API_URL=http://localhost:3000/api
```

En producción, cambiar a la URL de tu backend desplegado:
```env
VITE_API_URL=https://tu-backend.onrender.com/api
```

### 4. Iniciar el servidor de desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

---

## Scripts Disponibles

```bash
npm run dev       # Servidor de desarrollo con HMR
npm run build     # Build de producción optimizado
npm run preview   # Vista previa del build de producción
npm run lint      # Análisis de código con ESLint
```

---

## Conexión con el Backend

Este frontend se comunica exclusivamente con la [API REST de Domus](https://github.com/JuanVictorFY/Domus-Sistema-Inteligente-Gestion-Condominios-Backend).

El cliente HTTP (`src/api.js`) incluye:
- **Interceptor de request**: agrega automáticamente el token JWT en el header `Authorization`
- **Interceptor de response**: redirige a `/login` si el servidor retorna `401`
- **Timeout** de 15 segundos para evitar esperas indefinidas

La variable de entorno `VITE_API_URL` controla el endpoint base de la API.

---

## Despliegue

### Produccion (Render)

| | URL |
|---|---|
| **Frontend** | https://domus-sistema-inteligente-gestion.onrender.com/ |
| **Backend API** | https://domus-sistema-inteligente-gestion-who4.onrender.com/ |

### Configuracion en Render (Static Site)

```bash
# Build command
npm install; npm run build

# Publish directory
dist
```

### Variables de entorno en produccion

```env
VITE_API_URL=https://domus-sistema-inteligente-gestion-who4.onrender.com/api
```

> ⚠️ Asegurate de que el backend tenga `FRONTEND_URL=https://domus-sistema-inteligente-gestion.onrender.com` configurado para que CORS funcione correctamente.

---

## Flujo de Autenticación

```
Usuario ingresa credenciales
        ↓
POST /api/auth/login
        ↓
Backend retorna { token, user }
        ↓
Frontend guarda en localStorage
        ↓
Cada request incluye Authorization: Bearer <token>
        ↓
ProtectedRoute verifica token en /api/auth/verify
        ↓
Dashboard según rol: ADMIN / RESIDENTE / SEGURIDAD
```

---

## Licencia

MIT © Juan Victor
