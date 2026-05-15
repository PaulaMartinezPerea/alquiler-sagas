[20/03/2026] - Decisión técnica: Elección del ORM
Decisión: Se utilizará Prisma ORM con TypeScript para interactuar con MySQL.
Motivo: Next.js se integra muy bien con Prisma, lo que permite tipar las consultas a la base de datos y evitar errores de inyección SQL nativamente.
Impacto: Requiere dedicar parte de la Semana 1 a crear el archivo schema.prisma para generar las migraciones iniciales antes de programar la lógica.

[20/03/2026] - Riesgo detectado: Integridad de datos en alquileres
Decisión: Diseñar la base de datos con restricciones de clave foránea (FOREIGN KEY) estrictas.
Motivo: Al agrupar películas por sagas y alquilar packs completos, es crucial que no existan relaciones circulares ni películas huérfanas en la base de datos.
Impacto: Si un administrador borra una saga del sistema, se debe decidir si hacer un borrado en cascada de sus películas o un borrado lógico para no corromper el historial de alquileres pasados.

[20/03/2026] - Decisión de infraestructura: Volúmenes Docker
Decisión: Mapear el directorio de datos de MySQL a un volumen local en el docker-compose.yml.
Motivo: Asegurar que los datos introducidos durante el desarrollo (usuarios de prueba, catálogo inicial) no se pierdan cada vez que se detiene el contenedor.
Impacto: Permite un desarrollo mucho más ágil a partir de la Semana 2, ya que no habrá que repoblar la base de datos constantemente tras un reinicio.

[13/04/2026] - Implementación de Seguridad y Catálogo
Hito 4: Sistema funcional
Decisión: Se ha implementado bcrypt para el hashing de contraseñas en el nuevo endpoint /api/auth/register.
Justificación: Cumplir estrictamente con el criterio de aceptación de seguridad definido en el Hito 2. Ninguna contraseña se guarda en texto plano, protegiendo la base de datos ante posibles fugas.
Avance estructural: Se ha creado la ruta de la API /api/sagas utilizando include de Prisma para traernos las sagas con sus películas anidadas en una sola consulta eficiente.
Problemas encontrados: Se me había olvidado instalar el cliente de Prisma y me daba errores hasta que lo instale (npm install @prisma/client). 

[27/04/2026] - Integración Frontend y Backend (PROVISIONAL)- (Registro)
Hito 4: Sistema funcional
Decisión: Se ha sustituido la plantilla por defecto de Next.js por un dashboard propio (page.tsx) y se ha creado la ruta visual /register.
Justificación: Demostrar que el prototipo es funcional. El usuario final ya no interactúa mediante peticiones HTTP en consola, sino mediante una interfaz de React que usa la API de forma segura.
Impacto: El sistema de autenticación cuenta ahora con validación visual y feedback directo para el usuario.

[03/05/2026] - Fase de Estabilidad, Pruebas y Backups
Hito: Verificación y Sistema Operativo
Decisión: Se ha diseñado un plan de pruebas manual centrado en la validación de usuarios y la integridad de las rutas de la API.
Riesgo detectado: Caída de la base de datos o pérdida de volúmenes de Docker.
Solución (Backups): Se ha implementado un sistema de copias de seguridad utilizando mysqldump directamente contra el contenedor de Docker (alquiler_sagas_mysql). La restauración se realiza inyectando el .sql a través de la entrada estándar del contenedor.
Incidencias documentadas: Durante las pruebas de registro, si un usuario ingresaba un email duplicado, Prisma lanzaba una excepción (P2002). Se ha comprobado que el bloque try/catch de route.ts la captura correctamente y devuelve un Status 500, que el Frontend (page.tsx) lee para mostrar un mensaje amigable al usuario sin romper la web.

[03/05/2026] - Reestructuración de Enrutamiento y Layout
Hito: Estructura Principal
Decisión: Se han implementado componentes globales de Navbar y Footer en el layout principal (layout.tsx) para unificar la navegación.
Justificación: El prototipo necesitaba una estructura navegable lógica. Se ha movido el catálogo de películas a su propia ruta (/catalogo) y se ha creado una landing page básica en el index (/).
Avance: Se ha creado el endpoint de la API /api/contacto e integrado con Nodemailer y SMTP para el envío real de correos electrónicos desde el Frontend.
Incidencias documentadas: Fallo inicial de autenticación en SMTP por restricciones de seguridad en la cuenta de Google institucional (@g.educaand.es). Solucionado mediante la generación y uso de una "Contraseña de Aplicación" a través de una cuenta de Gmail estándar.

[04/05/2026] - INCIDENCIA: Error de privilegios al ejecutar Backup en Docker
Problema: Al intentar exportar la base de datos con el comando 'mysqldump', MySQL devolvía el error: 'Access denied; you need (at least one of) the PROCESS privilege(s) for this operation' when trying to dump tablespaces'.
Impacto: Imposibilidad de generar las copias de seguridad.
Solución: Tras investigar la documentación de MySQL 8+, identifiqué que el usuario estándar no tiene acceso a los 'tablespaces' internos. Se modificó el comando de backup añadiendo el flag '--no-tablespaces', logrando extraer solo la estructura de tablas y los datos del E-commerce con éxito.

[04/05/2026] - INCIDENCIA: Bloqueo de seguridad en servidor SMTP (Nodemailer)
Problema: La API de contacto fallaba devolviendo un Status 500 al intentar enviar correos electrónicos a través de la cuenta institucional de Google Workspace (pmarper2003@g.educaand.es).
Impacto: El formulario de contacto no funcionaba en el entorno integrado.
Solución: Detecté que Google bloquea los inicios de sesión SMTP directos con contraseñas normales por políticas de seguridad organizacionales. Lo resolví sustituyendo la cuenta (pmarper2003@g.educaand.es) por una que yo tenía de Gmail y generando una Contraseña de Aplicación (App Password) de 16 caracteres, integrándola de forma segura en las variables de entorno (.env).

[10/05/2026] - Añadidos a la Base de Datos (Catálogo de Sagas)
Decisión: Finalizacé el añadido de datos iniciales en la base de datos.
Avance: Registré todas las franquicias cinematográficas y sus respectivas películas, estableciendo las relaciones "uno a muchos" correspondientes. El sistema queda listo con contenido real para su consumo dinámico en el Frontend.

[10/05/2026] - INCIDENCIA: Filtros de búsqueda estrictos (Tildes y Mayúsculas)
Problema: Al hacer el buscador del catálogo, la consulta literal impedía encontrar resultados si el usuario no escribía exactamente igual que en la base de datos (ignorando tildes o alternando mayúsculas/minúsculas, ej. "harry" vs "Harry").
Impacto: Mala experiencia de usuario y aparente falta de contenido en el catálogo.
Solución: Usé una función normalizadora en TypeScript utilizando 
.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() para los inputs de búsqueda en el Client Component, garantizando coincidencias exactas.

[11/05/2026] - Implementación de Autenticación, Roles y UI del Catálogo
Hito: Sistema funcional e Interfaz Dinámica
Avance Estructural: Modifiqué el esquema de Prisma para incluir la tabla Categorias (relación "muchos a muchos" con Sagas) y implementé un sistema de control de acceso mediante un campo enum role (CLIENT / ADMIN) en la tabla Usuarios.
Desarrollo Frontend: Añadí la lógica de inicio de sesión conectada al localStorage para la persistencia de la sesión en el cliente. El catálogo lo puse con tarjetas visuales, pósters dinámicos y filtros combinados. Además, añadí la página de detalle dinámico (/catalogo/[id]) incorporando un componente cliente (SagaCarousel.tsx) capaz de leer el sistema de archivos del servidor para generar un carrusel de imágenes automatizado.

[11/05/2026] - INCIDENCIA: Rutas de imágenes rotas y conflictos Client/Server
Problema 1: Las imágenes de los pósters no renderizaban cuando las carpetas físicas de las sagas contenían espacios en blanco en su nombre (ej. "Harry Potter").
Solución 1: Implementé una función encodeURIComponent() en la inyección de rutas del atributo src de las imágenes para que los navegadores interpretaran correctamente los espacios.
Problema 2: Error de compilación en Next.js ("Event handlers cannot be passed to Client Component props") al utilizar eventos onError en etiquetas <img> dentro de un Server Component.
Solución 2: Eliminé los manejadores de eventos del lado del cliente en el Server Component, delegando la interactividad a los Client Components correspondientes.

[12/05/2026] - E-commerce funcional, Roles Avanzados y Páginas Legales
Hito: Pasarela, Perfiles y Cumplimiento Normativo
Decisión: Evolución del prototipo a E-commerce. Actualizé Prisma añadiendo la columna precio en Sagas.
Desarrollo: E-commerce: Creé un componente de pasarela de pago simulada (RentalBox.tsx) registrando transacciones en la tabla Alquileres con cálculo automático de caducidad (1 semana / 1 mes) en el backend.
UI/UX: Implementé paginación en el catálogo (8 sagas por página) y diseño estructural de la página de Inicio (Hero, Carrusel, CTAs).
Gestión de Roles: Añadí un panel de Administrador completo con operaciones CRUD (Create, Read, Update, Delete) reales sobre la base de datos de usuarios. Creé la vista "Mi Espacio" para clientes, incluyendo actualización cifrada de contraseñas y monitorización en tiempo real de días restantes en alquileres activos.
Legal: Añadí las páginas de Política de Cookies, Privacidad y Aviso Legal adaptadas a la LSSICE (Inventado obviamente).

[12/05/2026] - INCIDENCIA: Desincronización de ORM y Errores de Precisión Decimal
Problema 1: Al añadir la columna de precio en la base de datos, TypeScript y Next.js lanzaban errores críticos de compilación diciendo que el tipo Saga no coincidía con los props enviados.
Impacto 1: Bloqueaba el servidor al no reconocer la nueva estructura de datos.
Solución 1: Forzé la sincronización apagando el servidor y ejecutando npx prisma generate para reconstruir los diccionarios internos del Prisma Client.
Problema 2: Los precios (inventados) mostraban un montón de decimales infinitos en la interfaz (ej. 9.9899999€), rompiendo la estética y no me gustaba nada.
Solución 2: Formateé el valor numérico aplicando el método nativo 
.toFixed(2) en la capa visual.

[13/05/2026] - Interfaz (UI/UX) y Estilos Globales
Hito: Diseño Visual y Experiencia de Usuario
Decisión: Implementé un sistema de diseño utilizando Tailwind CSS. Decidí usar una paleta de colores combinando oscuros con acentos vibrantes en verde azulado y coral.
Avance: Rediseño de vistas: Transformación del Navbar a una cabecera flotante optimizando el código HTML mediante el uso de la directiva @apply en el archivo CSS global para mantener los componentes limpios. Rediseñé la página de inicio y del formulario de Contacto usando gradientes de texto, sombras difuminadas y efectos hover avanzados.
Mejora de Experiencia de Usuario (UX): Usé una lógica de redirección inteligente utilizando localStorage. Ahora, cuando un usuario es redirigido a la pantalla de login para realizar una acción el sistema memoriza su ruta previa (window.location.pathname) y lo devuelve exactamente a la misma página tras autenticarse con éxito, evitando lios a la hora de navegar.

[13/05/2026] - INCIDENCIA: Renderización del Favicon en Next.js
Problema: El icono (favicon) estaba en .jpg y no se mostraba en la pestaña del navegador a pesar de estar vinculado en el proyecto.
Impacto: Me daba coraje y me parecia feo que no tuviera icono.
Solución: Adapté el archivo a los requisitos del App Router de Next.js. Renombré el archivo de favicon.jpg a icon.jpg, lo metí directamente en la raíz del directorio src/app/, eliminé archivos residuales .ico predeterminados y forcé una limpieza de caché del navegador (Hard Reload) y reinicio del servidor de desarrollo para que el compilador inyectara correctamente los metadatos en el <head>.

[14/05/2026] - Finalización Visual, Componentes Interactivos y Modo Oscuro
Hito: Interfaz Final
Decisión: Adapté toda la plataforma para que se viera cómoda y moderna, priorizando un esquema de colores oscuros (Dark Mode) que encaja con una plataforma de cine.
Avance: Sustituí los textos genéricos de navegación en el perfil y administración por iconos SVG escalables, mejorando el minimalismo de la cabecera.
Mejoré las interacciones del Panel de Administración, dandole un formulario "inteligente" que alterna entre los modos de 'Creación' y 'Edición' dinámicamente reutilizando los mismos campos de input.
Implementé la funcionalidad de "Cancelar Alquiler" desde el panel del cliente, renderizando condicionalmente una nueva sección visual de historial para los elementos cancelados.

[14/05/2026] - INCIDENCIA: Error 500 en Mutaciones de Base de Datos (Caché ORM)
Problema: Al ejecutar por primera vez la función de "Cancelar Alquiler", el servidor devolvía un error HTTP 500 ("Hubo un problema al cancelar el alquiler").
Causa: Había añadido la nueva columna booleana canceled al archivo schema.prisma, y aunque se había empujado a MySQL (db push), el cliente de Prisma que se ejecutaba en el entorno de desarrollo de Node.js seguía utilizando una versión cacheada antigua del esquema, por lo que desconocía la existencia del campo.
Solución: 1. Detuvé el servidor de Next.js.
2. Ejecuté el comando npx prisma generate para reconstruir las definiciones de tipos de TypeScript y sincronizar el cliente local con la estructura real de la base de datos.
3. Cambié el bloque catch de la API para devolver y exponer mensajes de error específicos al frontend (errorData.error), facilitando la depuración en lugar de mostrar errores. Tras el reinicio, la transacción en la base de datos se completó con éxito.
