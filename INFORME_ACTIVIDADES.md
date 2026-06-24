# INFORME DE ACTIVIDADES

Fecha: 24/06/2026

---

| Título del Proyecto | Sin Envolturas |
|---|---|
| Contrato | — |
| Período Proyecto | Del 18/03/2026 al 05/06/2026 |
| Entidad Ejecutora | Sin Envolturas |
| Coord Gral de Proy | Claudia Dawson Farro |

---

## 1. Datos Generales del Personal

*Sección llenada por el Personal*

| | |
|---|---|
| Nombres y Apellidos | Paolo Dellepiane |
| Rol en el proyecto | Desarrollador Móvil |
| Periodo de las actividades | Del 18/03/2026 al 05/06/2026 |

---

## 1.1 Actividades realizadas y resultados alcanzados

| Actividad detallada | Fecha | Lugar |
|---|---|---|
| **SEMANA 1 — Configuración del entorno y arquitectura base** | **18/03/2026 al 22/03/2026** | |
| Configuración del entorno de desarrollo local: instalación de Node.js, Expo CLI, Xcode y Android Studio; verificación de simuladores iOS y emuladores Android | 18/03/2026 al 22/03/2026 | Lima, Perú |
| Creación del proyecto con Expo SDK 52 usando la plantilla TypeScript; configuración del identificador de la app, permisos de cámara y galería, íconos y splash screen | 18/03/2026 al 22/03/2026 | Lima, Perú |
| Configuración de herramientas de calidad de código: linter, formateador y reglas de TypeScript estrictas con alias de paths | 18/03/2026 al 22/03/2026 | Lima, Perú |
| Definición de la arquitectura por capas: presentación (pantallas y componentes), dominio (repositorios), infraestructura (cliente HTTP y almacenamiento) y contenedor de dependencias | 18/03/2026 al 22/03/2026 | Lima, Perú |
| Creación del sistema de diseño base: paleta de colores, tipografía, espaciado y radios de borde como constantes TypeScript reutilizables | 18/03/2026 al 22/03/2026 | Lima, Perú |
| Configuración de Expo Router con la estructura de directorios para rutas de autenticación, rutas protegidas y navegación por tabs | 18/03/2026 al 22/03/2026 | Lima, Perú |
| Creación del cliente HTTP: interfaz genérica e implementación concreta con manejo de errores, tipado de respuesta y envío automático del token de sesión en los headers | 18/03/2026 al 22/03/2026 | Lima, Perú |
| Implementación del contexto de autenticación con estado de sesión, métodos de inicio y cierre de sesión, y estrategia de almacenamiento seguro del token en el dispositivo | 18/03/2026 al 22/03/2026 | Lima, Perú |
| **SEMANA 2 — Configuración EAS y onboarding** | **23/03/2026 al 27/03/2026** | |
| Configuración de EAS Build con tres perfiles de entorno: desarrollo, vista previa y producción; conexión del proyecto a la plataforma Expo | 23/03/2026 al 27/03/2026 | Lima, Perú |
| Generación del primer build de desarrollo con módulos nativos personalizados para pruebas en dispositivos físicos | 23/03/2026 al 27/03/2026 | Lima, Perú |
| Implementación del carousel de onboarding con tres pantallas de presentación y animaciones de paginación | 23/03/2026 al 27/03/2026 | Lima, Perú |
| Implementación de la pantalla de inicio de sesión con campo de correo y validación en tiempo real | 23/03/2026 al 27/03/2026 | Lima, Perú |
| Implementación de la pantalla de verificación de código: seis entradas individuales con foco automático, temporizador de reenvío y manejo de errores | 23/03/2026 al 27/03/2026 | Lima, Perú |
| Creación del `AuthRepository` con los métodos de solicitud de código, verificación y cierre de sesión; tipado completo de las respuestas | 23/03/2026 al 27/03/2026 | Lima, Perú |
| Implementación de la recuperación de sesión al iniciar la app y redirección automática al home o al login según el estado de autenticación | 23/03/2026 al 27/03/2026 | Lima, Perú |
| **SEMANA 3 — Autenticación completa y navegación principal** | **30/03/2026 al 03/04/2026** | |
| Implementación del contenedor de dependencias con instancias únicas compartidas por toda la aplicación | 30/03/2026 al 03/04/2026 | Lima, Perú |
| Construcción del layout raíz con carga de fuentes personalizadas, proveedor del contexto de autenticación y pantalla de splash mientras se restaura la sesión | 30/03/2026 al 03/04/2026 | Lima, Perú |
| Configuración de la navegación por tabs con Expo Router: iconos, colores activos e inactivos y manejo del historial de navegación | 30/03/2026 al 03/04/2026 | Lima, Perú |
| Implementación de la protección de rutas: usuarios no autenticados son redirigidos automáticamente al flujo de inicio de sesión | 30/03/2026 al 03/04/2026 | Lima, Perú |
| Pruebas del flujo completo de autenticación en dispositivos iOS y Android: solicitud de código, verificación, acceso al home y cierre de sesión | 30/03/2026 al 03/04/2026 | Lima, Perú |
| Ajustes de experiencia de usuario en el flujo de autenticación: comportamiento del teclado, mensajes de error y estados de carga | 30/03/2026 al 03/04/2026 | Lima, Perú |
| Actualización del build de desarrollo con los módulos nativos configurados para las siguientes etapas del proyecto | 30/03/2026 al 03/04/2026 | Lima, Perú |
| **SEMANA 4 — Home Feed** | **06/04/2026 al 10/04/2026** | |
| Creación del `EventRepository` con los métodos de listado de banners, eventos como anfitrión y eventos como invitado; tipado completo de las respuestas | 06/04/2026 al 10/04/2026 | Lima, Perú |
| Configuración de React Query como gestor de estado del servidor: tiempos de caché, política de reintentos y comportamiento en segundo plano | 06/04/2026 al 10/04/2026 | Lima, Perú |
| Implementación del hook de home con llamadas paralelas a los tres endpoints y agrupación de eventos por estado: próximos, activos y pasados | 06/04/2026 al 10/04/2026 | Lima, Perú |
| Construcción del componente de carrusel de banners para mostrar los eventos en vivo en la parte superior del home | 06/04/2026 al 10/04/2026 | Lima, Perú |
| Construcción de las tarjetas de evento para el listado del home con imagen de portada, nombre y fecha | 06/04/2026 al 10/04/2026 | Lima, Perú |
| Implementación de los estados de carga y error en la pantalla de inicio | 06/04/2026 al 10/04/2026 | Lima, Perú |
| Navegación al detalle del evento al seleccionar una tarjeta del home | 06/04/2026 al 10/04/2026 | Lima, Perú |
| **SEMANA 5 — Módulo de detalle de Evento** | **13/04/2026 al 17/04/2026** | |
| Creación del método de detalle de evento en el repositorio y del contexto de evento para compartir el estado entre los diferentes tabs | 13/04/2026 al 17/04/2026 | Lima, Perú |
| Implementación de la pantalla de detalle con navegación por tabs: Resumen, Retos, Álbum, Ranking y Participantes | 13/04/2026 al 17/04/2026 | Lima, Perú |
| Implementación del tab Resumen: imagen de portada, contador regresivo hasta el inicio del evento, anfitriones y dirección | 13/04/2026 al 17/04/2026 | Lima, Perú |
| Implementación de la pantalla de mapa con selector de aplicación de navegación: permite abrir la dirección del evento en Google Maps, Waze o Apple Maps | 13/04/2026 al 17/04/2026 | Lima, Perú |
| Configuración de los esquemas de URL permitidos para abrir las aplicaciones de navegación externas desde la app | 13/04/2026 al 17/04/2026 | Lima, Perú |
| Implementación del listado de participantes del evento con avatar y nombre | 13/04/2026 al 17/04/2026 | Lima, Perú |
| Implementación del sistema de reacciones: botón flotante con animación de lanzamiento al presionar y llamada al endpoint correspondiente | 13/04/2026 al 17/04/2026 | Lima, Perú |
| **SEMANA 6 — Módulo de Retos** | **20/04/2026 al 24/04/2026** | |
| Creación del repositorio de retos con métodos para todas las operaciones del módulo: listado, pendientes, detalle, creación, edición y respuesta | 20/04/2026 al 24/04/2026 | Lima, Perú |
| Implementación del tab de listado de retos con separación visual de retos completados y pendientes | 20/04/2026 al 24/04/2026 | Lima, Perú |
| Implementación del flujo de reto fotográfico: instrucciones → captura o selección de galería → vista previa → confirmación y envío | 20/04/2026 al 24/04/2026 | Lima, Perú |
| Implementación del flujo de reto de trivia: pantalla de pregunta con opciones, confirmación de respuesta y resultado con puntos obtenidos | 20/04/2026 al 24/04/2026 | Lima, Perú |
| Implementación del panel de creación y edición de retos, disponible únicamente para anfitriones del evento | 20/04/2026 al 24/04/2026 | Lima, Perú |
| Integración de las sugerencias de preguntas y fotos en el flujo de creación de retos | 20/04/2026 al 24/04/2026 | Lima, Perú |
| Implementación del feedback visual al completar retos: animación de confeti y mensaje con los puntos ganados | 20/04/2026 al 24/04/2026 | Lima, Perú |
| Invalidación de la caché de React Query al responder un reto para actualizar el álbum y el ranking en tiempo real | 20/04/2026 al 24/04/2026 | Lima, Perú |
| **SEMANA 7 — Álbum y Ranking** | **27/04/2026 al 01/05/2026** | |
| Implementación del tab Álbum: grilla de fotos paginada con carga automática de más resultados al llegar al final de la lista | 27/04/2026 al 01/05/2026 | Lima, Perú |
| Implementación del modal de foto en pantalla completa con imagen ampliada, contador de likes y botón de like con estado toggle | 27/04/2026 al 01/05/2026 | Lima, Perú |
| Implementación del tab Ranking: lista de invitados ordenada por puntaje con posición, avatar, nombre y total de puntos acumulados | 27/04/2026 al 01/05/2026 | Lima, Perú |
| Implementación del flujo de búsqueda de fotos por selfie: captura de la foto propia y visualización de los resultados coincidentes del evento | 27/04/2026 al 01/05/2026 | Lima, Perú |
| Animaciones de transición entre las pantallas del módulo de eventos | 27/04/2026 al 01/05/2026 | Lima, Perú |
| Ajustes generales de interfaz en los tabs del detalle de evento basados en pruebas en dispositivos reales | 27/04/2026 al 01/05/2026 | Lima, Perú |
| **SEMANA 8 — Internacionalización** | **04/05/2026 al 08/05/2026** | |
| Integración de las librerías de internacionalización con detección automática del idioma del dispositivo | 04/05/2026 al 08/05/2026 | Lima, Perú |
| Creación de los archivos de traducción en español e inglés con más de 200 claves organizadas por módulo | 04/05/2026 al 08/05/2026 | Lima, Perú |
| Reemplazo de todos los textos estáticos de la aplicación por claves de traducción | 04/05/2026 al 08/05/2026 | Lima, Perú |
| Implementación del selector de idioma en la pantalla de perfil con cambio aplicado en tiempo real sin reiniciar la app | 04/05/2026 al 08/05/2026 | Lima, Perú |
| Manejo de casos especiales de traducción: textos plurales, interpolación de valores y formatos de fecha según el idioma | 04/05/2026 al 08/05/2026 | Lima, Perú |
| Verificación de la cobertura completa de traducciones en todas las pantallas y mensajes de error | 04/05/2026 al 08/05/2026 | Lima, Perú |
| **SEMANA 9 — Perfil de usuario y analytics** | **11/05/2026 al 15/05/2026** | |
| Implementación de la pantalla de perfil: datos personales del usuario, selector de idioma, opciones de menú y botón de cierre de sesión | 11/05/2026 al 15/05/2026 | Lima, Perú |
| Implementación de la pantalla de edición de perfil: campo de nombre editable y subida de foto de perfil | 11/05/2026 al 15/05/2026 | Lima, Perú |
| Compresión de la imagen de perfil antes de subirla para reducir el tamaño del archivo sin pérdida visual perceptible | 11/05/2026 al 15/05/2026 | Lima, Perú |
| Integración del servicio de análisis de comportamiento de usuarios Mixpanel | 11/05/2026 al 15/05/2026 | Lima, Perú |
| Creación del módulo de analytics con funciones de registro de pantallas visitadas, acciones del usuario e identificación del perfil | 11/05/2026 al 15/05/2026 | Lima, Perú |
| Implementación del observador de rutas para el registro automático de la navegación entre pantallas sin necesidad de instrumentación manual en cada una | 11/05/2026 al 15/05/2026 | Lima, Perú |
| Instrumentación de las acciones clave: inicio de sesión, respuesta a retos, likes en fotos y búsqueda por selfie | 11/05/2026 al 15/05/2026 | Lima, Perú |
| **SEMANA 10 — Notificaciones** | **18/05/2026 al 22/05/2026** | |
| Creación del repositorio de notificaciones con los métodos de obtención paginada y marcado como leído | 18/05/2026 al 22/05/2026 | Lima, Perú |
| Implementación de la pantalla de lista de notificaciones: listado paginado con diferenciación visual de leídas y no leídas | 18/05/2026 al 22/05/2026 | Lima, Perú |
| Implementación del indicador de notificaciones pendientes en el tab de navegación principal | 18/05/2026 al 22/05/2026 | Lima, Perú |
| Implementación del hook de contador de notificaciones no leídas con actualización periódica en segundo plano | 18/05/2026 al 22/05/2026 | Lima, Perú |
| Navegación desde la notificación al contenido relacionado usando el campo de acción del objeto de notificación | 18/05/2026 al 22/05/2026 | Lima, Perú |
| Acción de marcar todas las notificaciones como leídas desde la cabecera de la pantalla | 18/05/2026 al 22/05/2026 | Lima, Perú |
| **SEMANA 11 — Push Notifications y soporte Android** | **25/05/2026 al 29/05/2026** | |
| Integración del módulo de notificaciones push de Expo: solicitud de permisos al usuario en el primer inicio de sesión | 25/05/2026 al 29/05/2026 | Lima, Perú |
| Obtención y registro del token de push del dispositivo en el servidor al autenticarse | 25/05/2026 al 29/05/2026 | Lima, Perú |
| Eliminación del token de push del servidor al cerrar sesión para evitar notificaciones en dispositivos desconectados | 25/05/2026 al 29/05/2026 | Lima, Perú |
| Implementación del handler de notificaciones en primer plano: muestra un mensaje flotante mientras el usuario está usando la app | 25/05/2026 al 29/05/2026 | Lima, Perú |
| Implementación del handler de notificaciones en segundo plano y con la app cerrada: navega a la pantalla correspondiente al abrir la notificación | 25/05/2026 al 29/05/2026 | Lima, Perú |
| Configuración específica para Android: restricción de orientación, soporte exclusivo de teléfonos y canal de notificaciones | 25/05/2026 al 29/05/2026 | Lima, Perú |
| Configuración de la cuenta de servicio de Google para el envío automatizado de builds al track de pruebas internas de Google Play | 25/05/2026 al 29/05/2026 | Lima, Perú |
| **SEMANA 12 — Builds de producción, tiendas y cierre** | **01/06/2026 al 05/06/2026** | |
| Configuración de los certificados y perfiles de aprovisionamiento para el build de producción iOS gestionados por EAS | 01/06/2026 al 05/06/2026 | Lima, Perú |
| Generación del build de producción para iOS y envío a TestFlight para distribución a testers internos | 01/06/2026 al 05/06/2026 | Lima, Perú |
| Configuración del almacén de claves y generación del build de producción para Android en formato de paquete de aplicación para Google Play | 01/06/2026 al 05/06/2026 | Lima, Perú |
| Envío del build de Android al track de pruebas internas de Google Play | 01/06/2026 al 05/06/2026 | Lima, Perú |
| Actualización de íconos, splash screen y recursos gráficos para los builds de producción en ambas plataformas | 01/06/2026 al 05/06/2026 | Lima, Perú |
| Pruebas smoke en dispositivos físicos iOS y Android: flujo completo desde el inicio de sesión hasta la recepción de una notificación push | 01/06/2026 al 05/06/2026 | Lima, Perú |
| Elaboración del presente informe de actividades del período completo en el formato oficial del proyecto | 01/06/2026 al 05/06/2026 | Lima, Perú |

---

## 1.2 Programación de actividades para el siguiente período

- Publicación en App Store (producción) y Google Play (producción) tras aprobación del proceso de revisión de ambas tiendas
- Implementación del manejo de enlaces profundos para notificaciones push adicionales aún no implementadas
- Evaluación e integración de actualizaciones por aire para correcciones de bugs sin requerir nuevos builds completos
- Mejoras de rendimiento en la grilla del álbum para eventos con alta cantidad de fotos
- Integración del flujo de confirmación de asistencia al evento

---

## 2. Grado de cumplimiento de resultados

*Sección llenada por el Coordinador de Proyectos*

| Objetivos y Resultados esperados | Grado de Cumplimiento |
|---|---|
| **Objetivos** | |
| — Pantallas desarrolladas: 27 | |
| — Módulos funcionales completados: 10 | **Bien** |
| — Integración completa con la API del proyecto | |
| — Internacionalización completada en español e inglés | |
| — Builds de producción generados y enviados a TestFlight y Google Play | |
| — Elaboración del informe de actividades del período | |
| **Resultados** | |
| — Pantallas desarrolladas: 27 (Alcance 100%) | |
| — Módulos completados: Onboarding, Autenticación, Home Feed, Detalle de Evento, Retos, Álbum, Ranking, Perfil, Notificaciones y Push Notifications (Alcance 100%) | |
| — Internacionalización completada con más de 200 claves de traducción en español e inglés (Alcance 100%) | |
| — Analytics implementado con seguimiento automático de pantallas y acciones clave (Alcance 100%) | |
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
