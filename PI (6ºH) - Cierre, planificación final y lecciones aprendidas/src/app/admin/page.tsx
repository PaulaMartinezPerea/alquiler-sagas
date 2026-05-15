import { prisma } from "@/src/lib/prisma";
import AdminClient from "./AdminClient";

// Componente de servidor: Carga los datos necesarios antes de renderizar la vista
export default async function AdminPage() {
  // Consulta a la BD: Obtiene todos los usuarios
  const usuarios = await prisma.usuarios.findMany({
    orderBy: { createdAt: 'desc' }
  });

  // Consultas: Cuenta el total de registros para el panel de métricas
  const totalSagas = await prisma.sagas.count();
  const totalAlquileres = await prisma.alquileres.count();

  // Renderiza el componenteinyectándole los datos
  return (
    <AdminClient 
      initialUsers={usuarios} 
      totalSagas={totalSagas} 
      totalAlquileres={totalAlquileres} 
    />
  );
}