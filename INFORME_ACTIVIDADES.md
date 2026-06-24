# INFORME DE ACTIVIDADES

Fecha: 24/06/2026

---

| Título del Proyecto | Sin Envolturas |
|---|---|
| Contrato | — |
| Período Proyecto | Del 02/03/2026 al 24/04/2026 |
| Entidad Ejecutora | Sin Envolturas |
| Coord Gral de Proy | Claudia Dawson Farro |

---

## 1. Datos Generales del Personal

*Sección llenada por el Personal*

| | |
|---|---|
| Nombres y Apellidos | Paolo Dellepiane |
| Rol en el proyecto | Desarrollador Móvil |
| Periodo de las actividades | Del 02/03/2026 al 24/04/2026 |

---

## 1.1 Actividades realizadas y resultados alcanzados

| Actividad detallada | Fecha | Lugar |
|---|---|---|
| **SEMANA 1 — Configuración del entorno y arquitectura base** | **02/03/2026 al 06/03/2026** | |
| Configuración del entorno de desarrollo local: instalación de Node.js, Expo CLI, Xcode y Android Studio; verificación de simuladores iOS y emuladores Android | 02/03/2026 al 06/03/2026 | Lima, Perú |
| Creación del proyecto con Expo SDK 52 usando la plantilla TypeScript; configuración de `app.json` con bundle ID, permisos de cámara/galería, íconos y splash screen | 02/03/2026 al 06/03/2026 | Lima, Perú |
| Configuración de ESLint, Prettier y reglas de TypeScript estrictas (`strict: true`); definición de aliases de paths en `tsconfig.json` | 02/03/2026 al 06/03/2026 | Lima, Perú |
| Definición de la arquitectura por capas: presentación (pantallas/componentes), dominio (repositorios), infraestructura (HTTP/storage) y contenedor de dependencias | 02/03/2026 al 06/03/2026 | Lima, Perú |
| Creación del design system base: tokens de color (primario, neutros, semánticos), tipografía, espaciado y radios de borde en constantes TypeScript | 02/03/2026 al 06/03/2026 | Lima, Perú |
| Configuración de Expo Router con estructura de directorios `(auth)/`, `(app)/`, `(tabs)/`; definición del layout raíz con slot y fuentes personalizadas | 02/03/2026 al 06/03/2026 | Lima, Perú |
| Creación de la interfaz `HttpClient` y la implementación `FetchHttpClient` con manejo de errores, tipado genérico de respuesta y inyección del token JWT en headers | 02/03/2026 al 06/03/2026 | Lima, Perú |
| Implementación del `AuthContext` con estado de sesión, métodos `login()` y `logout()`; estrategia de almacenamiento: token en `SecureStore`, datos de usuario en memoria | 02/03/2026 al 06/03/2026 | Lima, Perú |
| Configuración de EAS Build con perfiles `development`, `preview` y `production` en `eas.json`; configuración de cuenta de Expo y proyecto en la plataforma | 02/03/2026 al 06/03/2026 | Lima, Perú |
| **SEMANA 2 — Onboarding, autenticación y navegación principal** | **09/03/2026 al 13/03/2026** | |
| Implementación del carousel de onboarding con tres pantallas de presentación, animaciones de paginación y botón "Comenzar" | 09/03/2026 al 13/03/2026 | Lima, Perú |
| Implementación de la pantalla de login con campo de email, validación en tiempo real y llamada a `POST /api/auth/request-login-code` | 09/03/2026 al 13/03/2026 | Lima, Perú |
| Implementación de la pantalla de verificación de código: 6 inputs individuales con foco automático, temporizador de reenvío (60 s) y llamada a `POST /api/auth/login-code` | 09/03/2026 al 13/03/2026 | Lima, Perú |
| Creación del `AuthRepository` con los métodos `requestLoginCode()`, `verifyCode()` y `logout()`; definición de tipos TypeScript para las respuestas de autenticación | 09/03/2026 al 13/03/2026 | Lima, Perú |
| Implementación del contenedor de dependencias (singleton): instancia única de `FetchHttpClient`, `AuthRepository` y repositorios de dominio compartidos por la app | 09/03/2026 al 13/03/2026 | Lima, Perú |
| Implementación de `AuthSync`: recuperación de sesión desde `SecureStore` al iniciar la app; redirección automática entre `/(auth)` y `/(app)` según estado de sesión | 09/03/2026 al 13/03/2026 | Lima, Perú |
| Configuración de la navegación por tabs con Expo Router: iconos, colores activos/inactivos y manejo de historial de navegación dentro de cada tab | 09/03/2026 al 13/03/2026 | Lima, Perú |
| Construcción del primer build de desarrollo con `expo-dev-client` para pruebas en dispositivo físico iOS y Android | 09/03/2026 al 13/03/2026 | Lima, Perú |
| **SEMANA 3 — Home Feed y módulo de detalle de Evento** | **16/03/2026 al 20/03/2026** | |
| Creación del `EventRepository` con los métodos `getHostEvents()`, `getGuestEvents()`, `getBanners()` y `getEventDetail()`; tipado completo de las respuestas | 16/03/2026 al 20/03/2026 | Lima, Perú |
| Implementación del hook `useHomeFeed` con React Query: llamadas paralelas a host-events y guest-events, agrupación por estado (próximos, activos, pasados) | 16/03/2026 al 20/03/2026 | Lima, Perú |
| Construcción del componente `BannerCarousel` (eventos en vivo) y de las tarjetas de evento para el home | 16/03/2026 al 20/03/2026 | Lima, Perú |
| Creación del `EventDetailContext` para compartir el estado del evento entre los diferentes tabs del detalle | 16/03/2026 al 20/03/2026 | Lima, Perú |
| Implementación de la pantalla de detalle de evento con navegación por tabs: Resumen, Retos, Álbum, Ranking y Participantes | 16/03/2026 al 20/03/2026 | Lima, Perú |
| Implementación del tab Resumen: hero con portada, contador regresivo, listado de anfitriones y dirección del evento | 16/03/2026 al 20/03/2026 | Lima, Perú |
| Implementación de la pantalla de mapa (`EventMapScreen`) con picker de aplicación de navegación (Google Maps, Waze, Apple Maps) configurando `LSApplicationQueriesSchemes` en `app.json` | 16/03/2026 al 20/03/2026 | Lima, Perú |
| Implementación del sistema de reacciones: botón flotante `FloatingReactions` con animación de lanzamiento y llamada a `POST /api/events/{eventId}/reactions` | 16/03/2026 al 20/03/2026 | Lima, Perú |
| **SEMANA 4 — Módulo de Retos y sistema de puntos** | **23/03/2026 al 27/03/2026** | |
| Creación del `ChallengeRepository` con métodos para listar, obtener pendientes, crear, editar y responder retos; tipado completo de todas las respuestas | 23/03/2026 al 27/03/2026 | Lima, Perú |
| Implementación del flujo de reto fotográfico: pantalla de instrucciones → cámara/galería → preview de foto → confirmación y subida | 23/03/2026 al 27/03/2026 | Lima, Perú |
| Implementación del flujo de reto de trivia: pantalla de pregunta con opciones de selección, confirmación de respuesta y visualización de resultado con puntos obtenidos | 23/03/2026 al 27/03/2026 | Lima, Perú |
| Implementación del panel de creación/edición de retos (solo anfitriones): selector de tipo, campos del formulario y gestión de opciones de respuesta con `PATCH` y `POST` | 23/03/2026 al 27/03/2026 | Lima, Perú |
| Implementación del tab Álbum: grilla de fotos paginada con soporte de carga infinita; modal de foto completa con contador de likes y botón de like toggle | 23/03/2026 al 27/03/2026 | Lima, Perú |
| Implementación del tab Ranking: lista de invitados ordenada por puntos con posición, avatar, nombre y puntaje total | 23/03/2026 al 27/03/2026 | Lima, Perú |
| Implementación del sistema de feedback visual al completar retos: animación de confeti y toast con puntos obtenidos | 23/03/2026 al 27/03/2026 | Lima, Perú |
| Integración de sugerencias de retos: llamadas a los endpoints de sugerencias de preguntas y fotos para el flujo de creación | 23/03/2026 al 27/03/2026 | Lima, Perú |
| **SEMANA 5 — Internacionalización, perfil y analytics** | **30/03/2026 al 03/04/2026** | |
| Integración de `i18next` y `react-i18next` con `expo-localization` para detección automática del idioma del dispositivo | 30/03/2026 al 03/04/2026 | Lima, Perú |
| Creación de los archivos de traducción `en.json` y `es.json` con más de 200 claves; reemplazo de todos los strings hardcodeados en la aplicación | 30/03/2026 al 03/04/2026 | Lima, Perú |
| Implementación de la pantalla de perfil: datos del usuario, selector de idioma, opciones de menú y botón de cerrar sesión | 30/03/2026 al 03/04/2026 | Lima, Perú |
| Implementación de la pantalla de edición de perfil: campo de nombre y subida de avatar con compresión via `expo-image-manipulator` antes de subir a S3 | 30/03/2026 al 03/04/2026 | Lima, Perú |
| Integración de Mixpanel SDK: módulo `analytics` con funciones `trackPageView()`, `trackAction()` e `identifyUser()`; configuración del token según ambiente | 30/03/2026 al 03/04/2026 | Lima, Perú |
| Implementación del `RouteObserver` para tracking automático de navegación de pantallas en Mixpanel sin instrumentación manual por pantalla | 30/03/2026 al 03/04/2026 | Lima, Perú |
| Implementación de la pantalla de lista de notificaciones: listado paginado, estado de leído/no leído e indicador de notificaciones pendientes en el tab | 30/03/2026 al 03/04/2026 | Lima, Perú |
| Creación del `NotificationRepository` con `getNotifications()` (paginado) y `markAsRead()`; implementación del hook de polling para contador de no leídas | 30/03/2026 al 03/04/2026 | Lima, Perú |
| **SEMANA 6 — Push notifications y búsqueda de fotos por selfie** | **06/04/2026 al 10/04/2026** | |
| Integración de `expo-notifications`: solicitud de permisos en primer login, obtención del push token Expo y envío a `POST /api/user/push-token` | 06/04/2026 al 10/04/2026 | Lima, Perú |
| Implementación del ciclo de vida del push token: registro al autenticarse, eliminación en `DELETE /api/user/push-token` al cerrar sesión | 06/04/2026 al 10/04/2026 | Lima, Perú |
| Implementación del handler de notificaciones en foreground (muestra un toast) y en background/killed (navega a la pantalla correspondiente usando `data.action`) | 06/04/2026 al 10/04/2026 | Lima, Perú |
| Implementación del flujo de búsqueda de fotos por selfie: captura de foto → `POST /api/events/{eventId}/media/search` → grilla de resultados filtrados | 06/04/2026 al 10/04/2026 | Lima, Perú |
| Configuración de `QueryClient` de React Query: `staleTime`, `cacheTime` y configuración de reintentos; migración de llamadas directas a hooks con `useQuery` e `useInfiniteQuery` | 06/04/2026 al 10/04/2026 | Lima, Perú |
| Implementación de la invalidación de caché de React Query al completar retos fotográficos (invalida queries de álbum y ranking) | 06/04/2026 al 10/04/2026 | Lima, Perú |
| Integración de `expo-dev-client` en el perfil de desarrollo de EAS para generación de builds de prueba con módulos nativos personalizados | 06/04/2026 al 10/04/2026 | Lima, Perú |
| **SEMANA 7 — Soporte Android, builds de producción y tiendas** | **13/04/2026 al 17/04/2026** | |
| Configuración de restricción de orientación (portrait-only) y soporte exclusivo de teléfonos en `app.json` para las plataformas iOS y Android | 13/04/2026 al 17/04/2026 | Lima, Perú |
| Configuración del build de producción iOS en `eas.json`: certificados y provisioning profiles gestionados por EAS, configuración del bundle ID y del equipo de desarrollo | 13/04/2026 al 17/04/2026 | Lima, Perú |
| Configuración del build de producción Android en `eas.json`: generación y almacenamiento del keystore en EAS, build en formato AAB para Google Play | 13/04/2026 al 17/04/2026 | Lima, Perú |
| Actualización de íconos, splash screen y assets de branding para los builds de producción en ambas plataformas | 13/04/2026 al 17/04/2026 | Lima, Perú |
| Configuración de App Store Connect: API key para envío automatizado con EAS Submit; configuración de la ficha de la app (nombre, descripción, capturas) | 13/04/2026 al 17/04/2026 | Lima, Perú |
| Configuración de la cuenta de servicio de Google Play para envío automatizado con EAS Submit al track de pruebas internas | 13/04/2026 al 17/04/2026 | Lima, Perú |
| Revisión y limpieza final del código: eliminación de console.log, verificación de tipos TypeScript y formateo con Prettier en todos los componentes | 13/04/2026 al 17/04/2026 | Lima, Perú |
| **SEMANA 8 — Builds de producción, envío a tiendas y cierre** | **20/04/2026 al 24/04/2026** | |
| Ejecución del build de producción iOS con EAS Build (`eas build --platform ios --profile production`) y verificación del archivo `.ipa` generado | 20/04/2026 al 24/04/2026 | Lima, Perú |
| Envío a TestFlight mediante EAS Submit; verificación del build en App Store Connect y distribución a testers internos | 20/04/2026 al 24/04/2026 | Lima, Perú |
| Ejecución del build de producción Android con EAS Build (`eas build --platform android --profile production`) y verificación del archivo `.aab` generado | 20/04/2026 al 24/04/2026 | Lima, Perú |
| Envío al track de pruebas internas de Google Play mediante EAS Submit; verificación del estado en Google Play Console | 20/04/2026 al 24/04/2026 | Lima, Perú |
| Pruebas smoke en dispositivos físicos iOS y Android: login, home feed, detalle de evento, reto fotográfico, álbum, ranking y recepción de push notification | 20/04/2026 al 24/04/2026 | Lima, Perú |
| Verificación del flujo completo de integración con la API: autenticación → eventos → retos → subida de fotos → búsqueda por selfie → notificaciones | 20/04/2026 al 24/04/2026 | Lima, Perú |
| Elaboración del presente `INFORME_ACTIVIDADES.md`: informe de actividades del período completo en el formato oficial del proyecto | 20/04/2026 al 24/04/2026 | Lima, Perú |

---

## 1.2 Programación de actividades para el siguiente período

- Publicación en App Store (producción) y Google Play (producción) tras aprobación del proceso de revisión
- Implementación del manejo de deep links para notificaciones push adicionales (invitación a evento, inicio de evento)
- Evaluación e integración de actualizaciones OTA con EAS Update para correcciones de bugs sin requerir nuevos builds
- Mejoras de rendimiento en la grilla del álbum para eventos con alta cantidad de fotos
- Integración del flujo de confirmación de asistencia al evento

---

## 2. Grado de cumplimiento de resultados

*Sección llenada por el Coordinador de Proyectos*

| Objetivos y Resultados esperados | Grado de Cumplimiento |
|---|---|
| **Objetivos** | |
| — Pantallas desarrolladas: 27 | |
| — Módulos funcionales completados: 8 | **Bien** |
| — Integración con API (recap-api): 100% de endpoints consumidos | |
| — Internacionalización completada (ES/EN): 200+ claves de traducción | |
| — Builds de producción generados y enviados a TestFlight y Google Play | |
| — Elaboración del informe de actividades del período | |
| **Resultados** | |
| — Pantallas desarrolladas: 27 (Alcance 100%) | |
| — Módulos completados: Onboarding, Autenticación, Home Feed, Detalle de Evento, Retos, Álbum, Ranking, Perfil, Notificaciones, Push Notifications (Alcance 100%) | |
| — Internacionalización completada: ES/EN con 200+ claves en `i18n/` (Alcance 100%) | |
| — Analytics implementado con Mixpanel: tracking de pantallas y acciones clave (Alcance 100%) | |
| — Builds de producción iOS (TestFlight) y Android (Google Play interno) enviados (Alcance 100%) | |
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
