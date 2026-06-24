# INFORME DE ACTIVIDADES

Fecha: 24/06/2026

---

| Título del Proyecto | Sin Envolturas |
|---|---|
| Contrato | — |
| Período Proyecto | Del 02/03/2026 al 24/06/2026 |
| Entidad Ejecutora | Sin Envolturas |
| Coord Gral de Proy | Claudia Dawson Farro |

---

## 1. Datos Generales del Personal

*Sección llenada por el Personal*

| | |
|---|---|
| Nombres y Apellidos | Paolo Dellepiane |
| Rol en el proyecto | Especialista en Software |
| Periodo de las actividades | Del 02/03/2026 al 24/06/2026 |

---

## 1.1 Actividades realizadas y resultados alcanzados

| Actividad detallada | Fecha | Lugar |
|---|---|---|
| **SEMANA 1 — Configuración del entorno de desarrollo y proyecto inicial** | **02/03/2026 al 06/03/2026** | |
| Configuración del entorno de desarrollo local: instalación de Node.js LTS, npm, Expo CLI y verificación de versiones de herramientas requeridas | 02/03/2026 al 06/03/2026 | Lima, Perú |
| Instalación y configuración de herramientas para desarrollo iOS: Xcode, simuladores de iPhone y CocoaPods | 02/03/2026 al 06/03/2026 | Lima, Perú |
| Instalación y configuración de herramientas para desarrollo Android: Android Studio, JDK y emuladores de dispositivos | 02/03/2026 al 06/03/2026 | Lima, Perú |
| Creación del proyecto Expo con plantilla TypeScript y estructura inicial de directorios del proyecto Recap Mobile | 02/03/2026 al 06/03/2026 | Lima, Perú |
| Configuración de EAS (Expo Application Services) para builds y deployments: vinculación del proyecto con la cuenta de Expo | 02/03/2026 al 06/03/2026 | Lima, Perú |
| Configuración inicial de `app.json`: nombre del app, bundle ID iOS (`com.sinenvolturas.recap`), package Android, íconos y permisos base | 02/03/2026 al 06/03/2026 | Lima, Perú |
| Configuración de TypeScript con paths alias `@/` en `tsconfig.json` para importaciones absolutas | 02/03/2026 al 06/03/2026 | Lima, Perú |
| Configuración de ESLint y Prettier con soporte para ordenamiento automático de imports (`@trivago/prettier-plugin-sort-imports`) | 02/03/2026 al 06/03/2026 | Lima, Perú |
| **SEMANA 2 — Diseño de arquitectura y sistema de diseño** | **09/03/2026 al 13/03/2026** | |
| Definición de la arquitectura por capas del proyecto: screens (Expo Router) → features → repositories → HTTP client | 09/03/2026 al 13/03/2026 | Lima, Perú |
| Diseño del sistema de inyección de dependencias centralizado (`container.ts`) con instancias singleton de repositorios y servicios | 09/03/2026 al 13/03/2026 | Lima, Perú |
| Selección e integración de fuentes personalizadas: PlusJakartaSans (5 pesos: Light, Regular, Medium, SemiBold, Bold) y Signika (5 pesos) mediante `expo-font` | 09/03/2026 al 13/03/2026 | Lima, Perú |
| Definición de tokens de diseño: paleta de colores (`src/ui/colors.ts`), escala de espaciado y radios de borde para consistencia visual | 09/03/2026 al 13/03/2026 | Lima, Perú |
| Revisión de wireframes y flujos de navegación con el equipo de diseño; definición de las pantallas y rutas principales de la aplicación | 09/03/2026 al 13/03/2026 | Lima, Perú |
| Evaluación y selección del sistema de navegación: Expo Router (file-based routing) con rutas tipadas para prevenir errores de parámetros | 09/03/2026 al 13/03/2026 | Lima, Perú |
| Definición de la estructura de directorios: `app/` (rutas), `src/features/` (lógica por dominio), `src/ui/` (componentes), `src/core/` (infraestructura), `src/domain/` (entidades) | 09/03/2026 al 13/03/2026 | Lima, Perú |
| **SEMANA 3 — Infraestructura base: navegación, HTTP client y autenticación** | **16/03/2026 al 20/03/2026** | |
| Implementación de la estructura de rutas con Expo Router: layouts anidados, grupos de rutas y redirección inicial desde el índice raíz | 16/03/2026 al 20/03/2026 | Lima, Perú |
| Definición de la interfaz `HttpClient` con métodos `get`, `post`, `patch`, `put`, `delete` como contrato de la capa de infraestructura | 16/03/2026 al 20/03/2026 | Lima, Perú |
| Implementación del `FetchHttpClient`: cliente HTTP basado en Fetch API nativo con inyección automática del token Bearer, estandarización de errores (`ApiRequestError`) y soporte para señales de cancelación (`AbortSignal`) | 16/03/2026 al 20/03/2026 | Lima, Perú |
| Implementación del `AuthContext` para manejo de sesión global: estado del usuario autenticado, métodos `login`, `logout` y `refreshUser` disponibles en toda la aplicación | 16/03/2026 al 20/03/2026 | Lima, Perú |
| Configuración de la estrategia de persistencia del token JWT: almacenamiento cifrado en `SecureStore` (para arranques en frío) y caché en memoria (para acceso rápido durante la sesión) | 16/03/2026 al 20/03/2026 | Lima, Perú |
| Creación de los primeros componentes UI reutilizables: `Button`, `InputField`, `Spinner`, `ScreenLoading`, `BackButton`, `CloseButton` | 16/03/2026 al 20/03/2026 | Lima, Perú |
| Configuración del layout raíz (`app/_layout.tsx`) con los proveedores de contexto globales: `AuthProvider`, `QueryClientProvider`, fuentes y configuración del sistema de color | 16/03/2026 al 20/03/2026 | Lima, Perú |
| **SEMANA 4 — Módulo de onboarding, autenticación y perfil inicial** | **23/03/2026 al 27/03/2026** | |
| Implementación del módulo de onboarding: carrusel de múltiples slides con indicadores de progreso, imágenes decorativas por slide y CTA de inicio de sesión | 23/03/2026 al 27/03/2026 | Lima, Perú |
| Creación de la pantalla de login (`/login`): formulario de ingreso de email con validaciones y envío de solicitud de código OTP a la API | 23/03/2026 al 27/03/2026 | Lima, Perú |
| Creación de la pantalla de verificación de código (`/verify-code`): input de 6 dígitos, cuenta regresiva para reenvío, manejo de errores y navegación post-verificación | 23/03/2026 al 27/03/2026 | Lima, Perú |
| Implementación del `AuthRepository` con los métodos `requestLoginCode`, `verifyCode` y `logout`; integración con `FetchHttpClient` y almacenamiento del token en `SecureStore` | 23/03/2026 al 27/03/2026 | Lima, Perú |
| Definición del módulo de API de autenticación: paths (`/api/auth/request-login-code`, `/api/auth/login-code`, `/api/auth/logout`) y tipos de request/response | 23/03/2026 al 27/03/2026 | Lima, Perú |
| Implementación del sistema de inyección de dependencias en `container.ts`: instancias singleton de `AuthRepository`, `EventRepository` y `FetchHttpClient` con cadena de resolución del token | 23/03/2026 al 27/03/2026 | Lima, Perú |
| Refactorización de componentes de onboarding con estilos mejorados y separación de responsabilidades entre componentes de presentación y lógica | 23/03/2026 al 27/03/2026 | Lima, Perú |
| Implementación del `AuthSync` para sincronización del estado de autenticación al montar la app: recuperación del token persistido y redirección automática al flujo correcto | 23/03/2026 al 27/03/2026 | Lima, Perú |
| Actualización de rutas de navegación y coordinador para manejo del flujo de perfil inicial post-autenticación | 23/03/2026 al 27/03/2026 | Lima, Perú |
| **SEMANA 5 — Módulo Home y detalle de evento inicial** | **30/03/2026 al 03/04/2026** | |
| Creación de la pantalla de detalle de evento (`/event/[id]`): layout inicial con imagen de portada, título y datos del evento | 30/03/2026 al 03/04/2026 | Lima, Perú |
| Incorporación de nuevos assets de presentación de eventos: imágenes de portada por defecto y placeholders para el detalle | 30/03/2026 al 03/04/2026 | Lima, Perú |
| Implementación del `EventRepository` con el método `getEventDetail`: fetch del detalle del evento, mapeo de respuesta API a entidad de dominio | 30/03/2026 al 03/04/2026 | Lima, Perú |
| Actualización del contenedor de inyección de dependencias para incluir `EventRepository` con la instancia compartida del cliente HTTP autenticado | 30/03/2026 al 03/04/2026 | Lima, Perú |
| Implementación del hook `useHomeFeed`: fetch paralelo de eventos como anfitrión (`host-events`) y como invitado (`guest-events`) con React Query; partición de eventos en categorías | 30/03/2026 al 03/04/2026 | Lima, Perú |
| Creación del carrusel de banners en vivo (`LiveBannerCarousel`): visualización de eventos activos con estado `live`, `starting_soon` o `memory` | 30/03/2026 al 03/04/2026 | Lima, Perú |
| Creación de la pantalla home (`/home`) con carrusel de eventos del usuario: Mis Eventos, Planes y Eventos Pasados | 30/03/2026 al 03/04/2026 | Lima, Perú |
| **SEMANA 6 — Módulo de detalle de evento completo y sistema de retos** | **06/04/2026 al 10/04/2026** | |
| Creación de la pantalla de mapa del evento (`/event/[id]/map`): visualización de la ubicación y selector de app de navegación (Google Maps, Apple Maps, Waze) | 06/04/2026 al 10/04/2026 | Lima, Perú |
| Creación de los componentes base del sistema de retos: tarjetas de reto fotográfico y reto de quiz con assets específicos por tipo | 06/04/2026 al 10/04/2026 | Lima, Perú |
| Definición de la estructura de datos del ranking (`EventRanking`): posición, nombre del invitado, puntos totales y avatar | 06/04/2026 al 10/04/2026 | Lima, Perú |
| Definición de estructuras de datos para el álbum de fotos (`EventAlbum`), extras del detalle y stories del evento | 06/04/2026 al 10/04/2026 | Lima, Perú |
| Creación del `EventDetailContext` con estado compartido para las pestañas del detalle: tab activa, estados de carga, draft de respuestas | 06/04/2026 al 10/04/2026 | Lima, Perú |
| Implementación de las pantallas de las pestañas del detalle del evento: Overview, Challenges, Album, Ranking y Stories con el hook `useEventDetailScreen` | 06/04/2026 al 10/04/2026 | Lima, Perú |
| Implementación de las reacciones flotantes con efectos de partículas animadas (`FloatingReactions`): emoji animados que suben y desaparecen usando `react-native-reanimated` | 06/04/2026 al 10/04/2026 | Lima, Perú |
| Extensión del `EventRepository` con métodos para home: `getHostEvents`, `getGuestEvents` y `getBanners` con mapeo completo de respuestas | 06/04/2026 al 10/04/2026 | Lima, Perú |
| Definición de los paths y tipos de la API del módulo home: banners, eventos de anfitrión e invitado con sus respectivas interfaces TypeScript | 06/04/2026 al 10/04/2026 | Lima, Perú |
| Actualización de las rutas de navegación del evento con nuevos métodos en el coordinador para los flujos de detalle, mapa, retos y participantes | 06/04/2026 al 10/04/2026 | Lima, Perú |
| **SEMANA 7 — Refinamiento del detalle de evento y nuevos paths de API** | **13/04/2026 al 17/04/2026** | |
| Extensión del módulo de API de eventos: nuevos paths para challenges (`/api/events/:id/challenges`), ranking (`/api/events/:id/ranking`), álbum (`/api/events/:id/media`) y reacciones | 13/04/2026 al 17/04/2026 | Lima, Perú |
| Actualización de los tipos TypeScript del detalle del evento: nuevos campos en `EventDetail`, `EventChallenge`, `EventMedia`, `EventRanking` y `EventGuest` | 13/04/2026 al 17/04/2026 | Lima, Perú |
| Implementación del hook `useEventDetail`: fetch del detalle con caché instantáneo desde el snapshot del home feed para mejor percepción de rendimiento | 13/04/2026 al 17/04/2026 | Lima, Perú |
| Refinamiento de los componentes de layout del detalle del evento: hero de portada, encabezado flotante, temporizador de cuenta regresiva (`CountdownTimer`) | 13/04/2026 al 17/04/2026 | Lima, Perú |
| Implementación del `HostInitialsAvatar`: componente de avatar con iniciales del usuario cuando no hay foto de perfil | 13/04/2026 al 17/04/2026 | Lima, Perú |
| Implementación del `AppRefreshControl`: pull-to-refresh personalizado con estilos acorde al sistema de diseño del proyecto | 13/04/2026 al 17/04/2026 | Lima, Perú |
| Creación de funciones utilitarias: conteo de invitados, partición de eventos del home en categorías y formateo de fechas del evento | 13/04/2026 al 17/04/2026 | Lima, Perú |
| **SEMANA 8 — Mejoras del home y refinamiento visual** | **20/04/2026 al 24/04/2026** | |
| Mejoras en la gestión de eventos del home: nuevas propiedades en la entidad `HomeEvent` para estado del evento, fechas y conteo de invitados | 20/04/2026 al 24/04/2026 | Lima, Perú |
| Rediseño del layout de la pestaña home: nuevos íconos de navegación inferior, tipografía mejorada y estructura visual actualizada | 20/04/2026 al 24/04/2026 | Lima, Perú |
| Actualización del `LiveBannerStructuredStatusRow`: reemplazo del indicador visual de punto por ícono para mejor legibilidad del estado del evento | 20/04/2026 al 24/04/2026 | Lima, Perú |
| Adición de nuevos estilos de fuente y assets de imagen para mayor consistencia visual en las pantallas del detalle del evento | 20/04/2026 al 24/04/2026 | Lima, Perú |
| Actualización de componentes del detalle del evento: nuevo manejo de imágenes de portada con fallbacks, ajustes de layout y espaciado | 20/04/2026 al 24/04/2026 | Lima, Perú |
| Actualización de la configuración del entorno: variables de entorno base para URL de la API en los distintos perfiles (development, staging, production) | 20/04/2026 al 24/04/2026 | Lima, Perú |
| Sincronización con la rama principal del repositorio: integración de cambios paralelos y resolución de conflictos de merge | 20/04/2026 al 24/04/2026 | Lima, Perú |
| **SEMANA 9 — Internacionalización (i18n) y optimización del detalle de evento** | **27/04/2026 al 01/05/2026** | |
| Integración de `i18next` y `react-i18next` para soporte multi-idioma en toda la aplicación | 27/04/2026 al 01/05/2026 | Lima, Perú |
| Creación de los archivos de traducción en inglés (`en.json`) y español (`es.json`) con más de 200 claves de texto de la interfaz | 27/04/2026 al 01/05/2026 | Lima, Perú |
| Configuración de `expo-localization` para detección automática del idioma del dispositivo y selección del locale inicial | 27/04/2026 al 01/05/2026 | Lima, Perú |
| Reemplazo de todos los textos hardcodeados en los componentes existentes por claves de traducción usando el hook `useTranslation()` | 27/04/2026 al 01/05/2026 | Lima, Perú |
| Actualización de los componentes de detalle del evento para consumir las nuevas traducciones y refactorización de los tipos de respuesta asociados | 27/04/2026 al 01/05/2026 | Lima, Perú |
| Implementación de la preferencia de idioma en el perfil del usuario: cambio dinámico de idioma desde la pantalla de perfil con persistencia en la API | 27/04/2026 al 01/05/2026 | Lima, Perú |
| **SEMANA 10 — Pruebas de integración y refinamiento de flujos** | **04/05/2026 al 08/05/2026** | |
| Pruebas de integración end-to-end de los flujos de autenticación: solicitud de código, verificación, sesión persistente y logout | 04/05/2026 al 08/05/2026 | Lima, Perú |
| Pruebas del flujo completo del home feed: carga de eventos de anfitrión e invitado, banners en vivo y navegación al detalle | 04/05/2026 al 08/05/2026 | Lima, Perú |
| Verificación del comportamiento de la caché del home snapshot: navegación instantánea al detalle sin espera de red en segundo acceso | 04/05/2026 al 08/05/2026 | Lima, Perú |
| Revisión y corrección de la lógica de partición de eventos en el home: casos límite en eventos sin fecha, sin invitados o con estado ambiguo | 04/05/2026 al 08/05/2026 | Lima, Perú |
| Pruebas de las animaciones de reacciones flotantes en dispositivos físicos iOS y Android: verificación de rendimiento y fluidez | 04/05/2026 al 08/05/2026 | Lima, Perú |
| Correcciones de UX en la pantalla de verificación de código: manejo del teclado, foco automático del input y retroalimentación visual de error | 04/05/2026 al 08/05/2026 | Lima, Perú |
| Revisión de la consistencia visual entre iOS y Android: ajustes de estilos para diferencias de plataforma en navegación y tipografía | 04/05/2026 al 08/05/2026 | Lima, Perú |
| **SEMANA 11 — Refactorización de flujos, analytics y preparación para producción** | **11/05/2026 al 15/05/2026** | |
| Refactorización de los flujos de detalle del evento: unificación de la navegación de completado de retos (foto y quiz) hacia una única pantalla de confirmación | 11/05/2026 al 15/05/2026 | Lima, Perú |
| Implementación del sistema de tracking de navegación: `RouteObserver` que detecta transiciones de pantalla y registra el evento `page_route_enter` con el path actual | 11/05/2026 al 15/05/2026 | Lima, Perú |
| Integración de Mixpanel React Native: configuración con token de entorno, identificación del usuario autenticado y limpieza de sesión en logout | 11/05/2026 al 15/05/2026 | Lima, Perú |
| Implementación del módulo de analytics (`src/core/analytics/`): funciones `trackPageView`, `trackAction` y `identifyUser` como interfaz unificada sobre Mixpanel | 11/05/2026 al 15/05/2026 | Lima, Perú |
| Adición de eventos de tracking a las acciones clave del usuario: respuesta a reto, like en foto, reacción al evento, cierre de sesión | 11/05/2026 al 15/05/2026 | Lima, Perú |
| Actualización de la resolución de URLs de assets de la API para usar variable de entorno (`EXPO_PUBLIC_API_ASSET_URL`) en lugar de URL hardcodeada | 11/05/2026 al 15/05/2026 | Lima, Perú |
| **SEMANA 12 — Integración de expo-dev-client, configuración de producción y soporte Android** | **18/05/2026 al 22/05/2026** | |
| Integración de `expo-dev-client`: generación de builds de desarrollo personalizados con módulos nativos (cámara, SecureStore, notificaciones) sin depender de Expo Go | 18/05/2026 al 22/05/2026 | Lima, Perú |
| Configuración de soporte exclusivo para teléfonos en Android: restricción de orientación a portrait y exclusión de tablets en el manifest (`app.json`) | 18/05/2026 al 22/05/2026 | Lima, Perú |
| Adición de nuevos eventos de tracking a acciones específicas del usuario en los flujos de retos, álbum y reacciones del evento | 18/05/2026 al 22/05/2026 | Lima, Perú |
| Refactorización y limpieza de formato de código en múltiples componentes: estandarización de imports, espaciado y convenciones TypeScript | 18/05/2026 al 22/05/2026 | Lima, Perú |
| Actualización de `.gitignore` para excluir artefactos de build (`/android`, `/ios`, `*.ipa`, `*.aab`) y archivos sensibles del repositorio | 18/05/2026 al 22/05/2026 | Lima, Perú |
| Actualización de `eas.json` con perfiles de build: `development` (builds internos con dev client), `preview` (builds de prueba sin store) y `production` (builds firmados para tiendas) | 18/05/2026 al 22/05/2026 | Lima, Perú |
| Actualización del README con instrucciones detalladas para la configuración del entorno de producción Android y el proceso de submission | 18/05/2026 al 22/05/2026 | Lima, Perú |
| **SEMANA 13 — Hooks de ciclo de vida, store review y actualización de assets** | **25/05/2026 al 29/05/2026** | |
| Implementación del hook `useAbortController`: crea y gestiona un `AbortController` por componente, cancelando automáticamente las peticiones en curso al desmontarse | 25/05/2026 al 29/05/2026 | Lima, Perú |
| Implementación del hook `useMountedRef`: referencia booleana que indica si el componente sigue montado, previniendo actualizaciones de estado en componentes ya desmontados | 25/05/2026 al 29/05/2026 | Lima, Perú |
| Integración de los hooks de ciclo de vida en todos los repositorios y pantallas que realizan peticiones HTTP, eliminando fugas de memoria y condiciones de carrera | 25/05/2026 al 29/05/2026 | Lima, Perú |
| Integración del paquete `expo-store-review`: solicitud de valoración in-app en el momento óptimo del flujo del usuario (completado de reto o interacción en álbum) | 25/05/2026 al 29/05/2026 | Lima, Perú |
| Actualización de la configuración del app (`app.json`): nuevo ícono de la aplicación, splash screen con imagen de marca y colores de fondo actualizados | 25/05/2026 al 29/05/2026 | Lima, Perú |
| Actualización del script de EAS build y submission en `package.json`: comandos unificados para compilar y subir a App Store y Google Play desde la terminal | 25/05/2026 al 29/05/2026 | Lima, Perú |
| Mejoras al README: documentación detallada del proceso de setup para producción en Android, incluyendo configuración de firma, `google-services.json` y cuenta de servicio de Google Play | 25/05/2026 al 29/05/2026 | Lima, Perú |
| **SEMANA 14 — Módulo de perfil, notificaciones in-app y mejoras de retos** | **01/06/2026 al 05/06/2026** | |
| Implementación de la pantalla de perfil (`/home/profile`): visualización de nombre, email, teléfono, idioma y menú de opciones de cuenta | 01/06/2026 al 05/06/2026 | Lima, Perú |
| Implementación de la pantalla de edición de perfil (`/home/profile/edit`): formulario de edición de nombre con validaciones y botón de guardado | 01/06/2026 al 05/06/2026 | Lima, Perú |
| Implementación de la subida de avatar en la edición de perfil: selección desde galería con `expo-image-picker`, compresión con `expo-image-manipulator` y upload como `multipart/form-data` | 01/06/2026 al 05/06/2026 | Lima, Perú |
| Creación del `NotificationRepository` con los métodos `getNotifications` (paginado), `markAsRead` y `markAllAsRead` | 01/06/2026 al 05/06/2026 | Lima, Perú |
| Implementación de la pantalla de notificaciones (`/home/notifications`): listado paginado con estado de lectura, timestamp y empty state | 01/06/2026 al 05/06/2026 | Lima, Perú |
| Refactorización de la creación de retos de quiz: separación de la pantalla de creación de preguntas individuales (`challenge-quiz-create/question`) del flujo general | 01/06/2026 al 05/06/2026 | Lima, Perú |
| Actualización de `app.json` para incluir `LSApplicationQueriesSchemes` en iOS: soporte para apertura de apps externas (Google Maps, Waze) desde la pantalla de mapa | 01/06/2026 al 05/06/2026 | Lima, Perú |
| Implementación del sistema de toast notifications (`UserToastOverlay`): mensajes emergentes personalizables con soporte para distintos tipos (éxito, error, info) y duración configurable | 01/06/2026 al 05/06/2026 | Lima, Perú |
| Mejoras al flujo de creación y edición de retos de quiz: manejo de múltiples preguntas, gestión de opciones de respuesta y selección de respuesta correcta | 01/06/2026 al 05/06/2026 | Lima, Perú |
| Actualización de dependencias del proyecto: nuevos paquetes añadidos y actualización de versiones existentes para compatibilidad con módulos nativos | 01/06/2026 al 05/06/2026 | Lima, Perú |
| **SEMANA 15 — Integración de toasts, configuración de Google Play y build Android** | **08/06/2026 al 12/06/2026** | |
| Integración del `UserToastOverlay` en el layout raíz de la aplicación: disponibilidad global del sistema de toasts desde cualquier pantalla | 08/06/2026 al 12/06/2026 | Lima, Perú |
| Creación del archivo de ejemplo `google-play-service-account.json.example` con la estructura requerida por la cuenta de servicio de Google Play para submissions automáticos | 08/06/2026 al 12/06/2026 | Lima, Perú |
| Configuración de las opciones de build Android en `eas.json`: tipo de build (`app-bundle`), versión de Gradle, credenciales de firma para producción y canales de distribución | 08/06/2026 al 12/06/2026 | Lima, Perú |
| Actualización de `.gitignore` para excluir directorios de build nativos generados (`android/`, `ios/`), credenciales locales y archivos de cuenta de servicio de Google Play | 08/06/2026 al 12/06/2026 | Lima, Perú |
| Pruebas del sistema de toasts en distintos flujos: confirmación de acciones exitosas, mensajes de error de red y notificaciones informativas durante la carga | 08/06/2026 al 12/06/2026 | Lima, Perú |
| Pruebas de los flujos de creación y edición de retos de quiz y foto desde la perspectiva del anfitrión en dispositivos físicos | 08/06/2026 al 12/06/2026 | Lima, Perú |
| **SEMANA 16 — Push notifications, álbum de fotos, React Query y cierre de funcionalidades** | **15/06/2026 al 19/06/2026** | |
| Integración del sistema de push notifications con `expo-notifications`: configuración del manejador en primer plano (alertas, sonido, badge y banner), registro del token del dispositivo al iniciar sesión y eliminación al cerrar sesión | 15/06/2026 al 19/06/2026 | Lima, Perú |
| Implementación del registro del token de push en la API: detección del tipo de dispositivo (iOS/Android) y llamada al endpoint `POST /api/user/push-token` | 15/06/2026 al 19/06/2026 | Lima, Perú |
| Mejoras al flujo del reto de quiz: validación de selección de respuesta antes de permitir envío, feedback inmediato post-respuesta y actualización de estado de completado | 15/06/2026 al 19/06/2026 | Lima, Perú |
| Actualización de la integración con la API de retos de quiz: corrección de paths y tipos para creación, edición y obtención de sugerencias desde el endpoint de la API | 15/06/2026 al 19/06/2026 | Lima, Perú |
| Creación de la pantalla de detalle de foto del álbum (`/event/[id]/album-photo`): visualización en pantalla completa, like/unlike con actualización optimista del contador y metadata del autor | 15/06/2026 al 19/06/2026 | Lima, Perú |
| Mejoras al layout del detalle del evento: reorganización de importaciones de las pestañas, reducción de acoplamiento entre módulos de navegación y componentes de UI | 15/06/2026 al 19/06/2026 | Lima, Perú |
| Implementación del manejo de intents nativos (`/+native-intent`): procesamiento de deep links recibidos desde otras apps o notificaciones push para navegación directa a pantallas específicas | 15/06/2026 al 19/06/2026 | Lima, Perú |
| Integración de React Query (`@tanstack/react-query`) como sistema de gestión de estado del servidor: configuración del `QueryClient` con tiempos de caché y stale time; migración de fetches manuales en Home, Event Detail, Album y Ranking | 15/06/2026 al 19/06/2026 | Lima, Perú |
| Implementación de la paginación del álbum con React Query: hook `useEventDetailAlbumScrollLoadMore` con `fetchNextPage` y detección del scroll para carga automática de más fotos | 15/06/2026 al 19/06/2026 | Lima, Perú |
| Mejoras a los componentes del detalle del evento aprovechando React Query: invalidación automática de caché al completar retos, actualización del ranking sin recarga manual | 15/06/2026 al 19/06/2026 | Lima, Perú |
| **SEMANA 17 — Configuración de builds de producción y publicación en tiendas** | **22/06/2026 al 24/06/2026** | |
| Configuración de variables de entorno de producción en EAS: `EXPO_PUBLIC_API_URL`, `EXPO_PUBLIC_API_ASSET_URL`, token de Mixpanel y clave de push notifications | 22/06/2026 al 24/06/2026 | Lima, Perú |
| Generación del build de producción iOS con EAS (`eas build --profile production --platform ios`): compilación firmada con certificado de distribución y provisioning profile gestionados automáticamente por EAS | 22/06/2026 al 24/06/2026 | Lima, Perú |
| Submission del build iOS a TestFlight mediante EAS Submit (`--auto-submit`): configuración del App Store Connect API key para envíos automáticos sin intervención manual | 22/06/2026 al 24/06/2026 | Lima, Perú |
| Generación del build de producción Android (`.aab`) con EAS: firmado con keystore de producción, configuración de `versionCode` y `versionName` para Google Play | 22/06/2026 al 24/06/2026 | Lima, Perú |
| Submission del build Android a Google Play (internal testing) mediante EAS Submit con cuenta de servicio JSON para autenticación automatizada | 22/06/2026 al 24/06/2026 | Lima, Perú |
| Verificación del build de producción en dispositivos físicos iOS y Android: pruebas smoke del flujo completo (login → home → evento → reto → álbum → notificaciones) | 22/06/2026 al 24/06/2026 | Lima, Perú |
| Elaboración del presente `INFORME_ACTIVIDADES.md`: informe de actividades del período completo de desarrollo de la aplicación móvil Recap | 22/06/2026 al 24/06/2026 | Lima, Perú |

---

## 1.2 Programación de actividades para el siguiente período

- Implementación de la pantalla de stories del evento con carrusel de slides y navegación entre historias
- Implementación de la pantalla de participantes del evento (`/event/[id]/participants`) con lista de invitados confirmados y pendientes
- Integración de la recepción de notificaciones push: navegación automática a la pantalla correspondiente al tocar una notificación
- Manejo del tipo de notificación `event_invitation` una vez habilitado en la API
- Implementación del módulo de cámara del evento (`/event/[id]/camera`) con captura de fotos y subida directa al álbum
- Reconocimiento facial (selfie search): integración de la pantalla de búsqueda de fotos por selfie usando el endpoint de Rekognition
- Incremento de cobertura de traducciones para los nuevos flujos de notificaciones, perfil y creación de retos
- Pruebas de regresión completas en iOS y Android previas al lanzamiento público en tiendas

---

## 2. Grado de cumplimiento de resultados

*Sección llenada por el Coordinador de Proyectos*

| Objetivos y Resultados esperados | Grado de Cumplimiento |
|---|---|
| **Objetivos** | |
| — Pantallas desarrolladas: 27 | |
| — Módulos funcionales completados: 10 | **Bien** |
| — Integración con la Recap API (endpoints consumidos): 20+ | |
| — Soporte multiplataforma iOS y Android | |
| — Publicación en TestFlight y Google Play (internal testing) | |
| **Resultados** | |
| — Pantallas desarrolladas: 27 (Autenticación, Home, Detalle de evento, Retos foto y quiz, Álbum, Ranking, Perfil, Notificaciones, Mapa) (Alcance 100%) | |
| — Módulos completados: Onboarding, Autenticación, Home Feed, Detalle de Evento, Sistema de Retos, Álbum, Ranking, Perfil, Notificaciones, Push Notifications (Alcance 100%) | |
| — Endpoints de la API consumidos: autenticación, home, eventos, retos, álbum, likes, ranking, reacciones, perfil, notificaciones, push tokens (Alcance 100%) | |
| — Soporte multiplataforma iOS y Android verificado en dispositivos físicos (Alcance 100%) | |
| — Internacionalización implementada: inglés y español (Alcance 100%) | |
| — Analytics con Mixpanel integrado en flujos clave (Alcance 100%) | |
| — Informe de actividades del período elaborado y entregado (Alcance 100%) | |

*(\*) Valoración general del personal en la marcha del proyecto:*
- **Bien**
- Regular
- Mal

*En caso de que la anterior respuesta haya sido "regular" o "mal", explíquelo brevemente.*

---

_____________________________ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; _____________________________

Evaluado: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Coordinador General del Proyecto

Paolo Dellepiane
