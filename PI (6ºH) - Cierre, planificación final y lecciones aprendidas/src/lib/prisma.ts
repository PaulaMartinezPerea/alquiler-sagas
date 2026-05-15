import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

// Configuramos el adaptador exactamente con los datos de mi Docker
const adapter = new PrismaMariaDb({
  host: "localhost",
  port: 3307,
  user: "paula",
  password: "paulapassword",
  database: "alquilersagas",
});

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Inicializamos Prisma obligatoriamente con el adaptador
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    // Esto mostrará las sentencias SQL en la terminal
    log: ["query"], 
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;