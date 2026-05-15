import { prisma } from "@/src/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";
import SagaCarousel from "./SagaCarousel";
import RentalBox from "./RentalBox";
import ElectricBorder from "../../components/ElectricBorder";
import Aurora from "../../components/Aurora"; 

// Componente: Renderiza los detalles de una saga específica según su ID en la URL
export default async function DetalleSagaPage({ params }: { params: { id: string } }) {
  const sagaId = parseInt(params.id);

  // Consulta a la base de datos: Obtiene la saga, sus categorías y sus películas ordenadas cronológicamente
  const saga = await prisma.sagas.findUnique({
    where: { id: sagaId },
    include: {
      categorias: true,
      movies: {
        orderBy: { releaseYear: 'asc' } 
      }
    }
  });

  // Si la saga no existe, lanza la página 404 de Next.js
  if (!saga) {
    notFound();
  }

  // Lee la carpeta de la saga para extraer imágenes para el carrusel
  let carrouselImages: string[] = [];
  try {
    const folderPath = path.join(process.cwd(), 'public', 'images', 'posters', saga.name);
    const files = fs.readdirSync(folderPath);
    
    // Filtra los pósters principales y se queda solo con las imágenes extra
    carrouselImages = files
      .filter(file => file !== 'poster.jpg' && file !== 'poster.png')
      .filter(file => file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.jpeg'))
      .map(file => `/images/posters/${encodeURIComponent(saga.name)}/${encodeURIComponent(file)}`);
      
  } catch (error) {
    console.log("No se pudo leer la carpeta de imágenes para:", saga.name);
  }

  // Si la carpeta no tiene imágenes extra, usa el póster por defecto
  if (carrouselImages.length === 0) {
    carrouselImages = [`/images/posters/${encodeURIComponent(saga.name)}/poster.png`];
  }

  // ESTRUCTURA VISUAL DE LA PÁGINA
  return (
    <main className="min-h-screen relative overflow-hidden p-8 text-[var(--text)]">
      
      {/* Inyección de CSS para las animaciones de aparición */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeUpAnim {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up-smooth {
          animation: fadeUpAnim 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />

      {/* Efecto visual de fondo animado (Aurora) */}
      <div className="fixed inset-0 z-0 opacity-80 pointer-events-none">
        <Aurora colorStops={["#6BBFCB", "#FAF7F4", "#E8735A"]} speed={0.6} amplitude={1.0} blend={0.6} />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Botón de regreso al catálogo */}
        <Link href="/catalogo" className="text-[var(--teal-dark)] hover:text-[var(--teal)] transition-colors mb-10 inline-flex items-center gap-2 font-bold text-lg drop-shadow-sm bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-white/50 animate-fade-up-smooth">
          ← Volver al catálogo
        </Link>

        {/* Información de la saga, panel de alquiler y carrusel de imágenes */}
        <div className="flex flex-col-reverse md:flex-row gap-12 items-center md:items-start mb-20">
          
          {/* Textos y caja de alquiler */}
          <div className="flex-1 w-full animate-fade-up-smooth" style={{ animationDelay: '0.1s' }}>
            
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight text-[var(--text)] pb-2 drop-shadow-sm">
              {saga.name}
            </h1>
            
            <p className="text-xl md:text-2xl text-[var(--text-soft)] font-medium mb-10 leading-relaxed drop-shadow-sm max-w-3xl">
              {saga.description || "Esta saga aún no tiene una descripción detallada en nuestra base de datos."}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start justify-between bg-[var(--surface)]/90 backdrop-blur-md p-8 rounded-3xl shadow-[0_8px_30px_rgba(46,122,136,0.1)] border border-white/60">
              
              <div className="flex-1 w-full text-center sm:text-left">
                <h3 className="text-sm font-black uppercase text-[var(--teal-dark)] mb-4 tracking-widest drop-shadow-sm">
                  Categorías
                </h3>
                <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                  {saga.categorias.map(c => (
                    <span key={c.id} className="text-sm uppercase tracking-wider font-bold bg-white/80 text-[var(--teal-dark)] px-4 py-1.5 rounded-lg border border-[var(--border)] shadow-sm">
                      {c.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Componente de cliente para gestionar el flujo de pago */}
              <RentalBox sagaId={saga.id} name={saga.name} precioBase={saga.precio} />

            </div>
          </div>

          {/* Carrusel de imágenes obtenidas del servidor */}
          <div className="w-full md:w-[380px] flex-shrink-0 animate-fade-up-smooth" style={{ animationDelay: '0.2s' }}>
            <SagaCarousel images={carrouselImages} />
          </div>

        </div>

        {/* Listado de películas pertenecientes a la saga */}
        <div className="w-full mb-16 animate-fade-up-smooth" style={{ animationDelay: '0.3s' }}>
          
          <div className="inline-block bg-[var(--surface)]/95 backdrop-blur-md px-8 py-4 rounded-2xl border border-white/60 shadow-lg mb-10">
            <h2 className="text-2xl md:text-3xl font-black text-[var(--teal-dark)] flex items-center gap-3">
              Películas de la colección 
              <span className="text-[var(--coral)] bg-[var(--coral)]/10 px-3 py-1 rounded-xl text-xl">
                {saga.movies.length}
              </span>
            </h2>
          </div>
          
          {saga.movies.length === 0 ? (
            // Mensaje si la saga no tiene películas asociadas
            <div className="bg-white/40 backdrop-blur-sm rounded-3xl p-12 border border-white/30 text-center">
              <p className="text-[var(--text-soft)] text-lg italic font-medium">
                Aún no hay películas registradas para esta saga.
              </p>
            </div>
          ) : (
            // Cuadrícula dinámica de películas
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {saga.movies.map((movie, index) => (
                <div 
                  key={movie.id} 
                  className="flex items-center gap-5 p-6 rounded-2xl bg-[var(--surface)]/90 backdrop-blur-md border border-white/60 shadow-md hover:shadow-xl hover:bg-white transition-all duration-300 group"
                >
                  <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center bg-[var(--teal-light)]/80 text-[var(--teal-deeper)] group-hover:bg-[var(--teal)] group-hover:text-white transition-colors font-black rounded-2xl shadow-inner text-xl">
                    {index + 1}
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold leading-tight text-[var(--text)] group-hover:text-[var(--teal-dark)] transition-colors drop-shadow-sm">
                      {movie.title}
                    </h3>
                    <p className="text-[var(--text-soft)] font-semibold mt-1 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--coral)]"></span>
                      Estreno: {movie.releaseYear}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </main>
  );
}