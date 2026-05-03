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