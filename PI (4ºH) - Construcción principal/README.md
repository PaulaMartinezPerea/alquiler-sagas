# Plataforma de Alquiler de Sagas - Prototipo

Web de E-commerce para alquiler digital de películas por franquicias. 
**Stack tecnológico:** Next.js (App Router), React, TailwindCSS, Prisma ORM, MySQL, Docker.

## Prerrequisitos
- **Node.js** (v18 o superior)
- **Docker Desktop** (Motor en marcha)

## Guía Exacta de Arranque (Reproducible)

Sigue estos pasos en orden para levantar la infraestructura y la aplicación:

**1. Clonar e instalar dependencias**
\`\`\`bash
git clone <https://github.com/PaulaMartinezPerea/alquiler-sagas>
cd alquiler-sagas
npm install
\`\`\`

**2. Configurar el entorno**
Crea un archivo llamado `.env` en la raíz copiando el ejemplo:
\`\`\`bash
cp .env.example .env
\`\`\`
*(Nota: El archivo `.env.example` contiene la conexión por defecto: `DATABASE_URL="mysql://paula:paulapassword@localhost:3307/alquilersagas"`)*

**3. Levantar la Base de Datos (Docker)**
Inicia el contenedor de MySQL en el puerto 3307:
\`\`\`bash
docker-compose up -d
\`\`\`

**4. Sincronizar el Esquema (Prisma)**
Genera el cliente y empuja las tablas a MySQL:
\`\`\`bash
npx prisma generate
npx prisma db push
\`\`\`

**5. Arrancar la Aplicación**
\`\`\`bash
npm run dev
\`\`\`
La web estará disponible en [http://localhost:3000]

## Pruebas de Verificación
**1. Catálogo Dinámico: Entrar a http://localhost:3000 mostrará la interfaz principal extrayendo las sagas y películas directamente desde la base de datos MySQL.

**2. Registro Seguro: Entrar a http://localhost:3000/register permite crear un usuario. La contraseña es procesada mediante bcrypt antes de guardarse.

**3. Auditoría de Datos: Ejecutar npx prisma studio (puerto 5555) permite verificar que las contraseñas en la tabla Usuarios están correctamente hasheadas, previniendo fugas de información.