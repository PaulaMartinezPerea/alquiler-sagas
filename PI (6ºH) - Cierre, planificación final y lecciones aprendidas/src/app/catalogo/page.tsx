import { prisma } from "@/src/lib/prisma";
import CatalogoClient from "./CatalogoClient";

// Componente de Servidor: Se ejecuta antes de enviar la página al navegador
export default async function CatalogoPage() {
  // Consulta a la BD: Obtiene todas las sagas junto con sus películas y categorías
  const sagas = await prisma.sagas.findMany({
    include: { 
      movies: true,
      categorias: true 
    }
  });

  // Consulta a la BD: Obtiene la lista de categorías para el filtro de búsqueda
  const categorias = await prisma.categorias.findMany({
    orderBy: { name: 'asc' } 
  });

  // Renderiza el componente inyectándole los datos obtenidos
  return <CatalogoClient initialSagas={sagas} allCategorias={categorias} />;
}