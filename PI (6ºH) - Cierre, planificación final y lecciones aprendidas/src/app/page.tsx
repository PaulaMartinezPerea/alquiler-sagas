import { prisma } from "@/src/lib/prisma";
import Link from "next/link";
import HomeCarousel from "./HomeCarousel";
import RotatingText from "./components/RotatingText"; 
import HeroGraphic from "./components/HeroGraphic";   
import Aurora from "./components/Aurora";
import DarkModeToggle from "./components/DarkModeToggle";

export default async function HomePage() {
  // Consulta a la base de datos: Obtiene las 5 sagas más recientes
  const ultimasSagas = await prisma.sagas.findMany({
    orderBy: { id: 'desc' },
    take: 5,                 
  });

  return (
    <main className="min-h-screen bg-[var(--surface)] text-[var(--text)] ...">
      {/* Componente para alternar entre el tema claro y oscuro */}
      <DarkModeToggle />
      {/* SECCIÓN PRINCIPAL (HERO) */}
      <section className="min-h-[90vh] flex flex-col-reverse md:flex-row items-center justify-center gap-16 py-16 md:py-20 relative overflow-hidden">
        
        {/* Contenedor principal de texto y botones */}
        <div className="absolute inset-0 z-0 opacity-80 pointer-events-none">
          <Aurora 
            colorStops={["#6BBFCB", "#FAF7F4", "#E8735A"]} 
            speed={0.6}
            amplitude={1.0}
            blend={0.6}
          />
        </div>

        <div className="max-w-7xl mx-auto px-8 w-full flex flex-col-reverse md:flex-row items-center justify-center gap-16 relative z-10">
          <div className="flex-1 space-y-8 text-center md:text-left flex flex-col justify-center">
            
            <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tight drop-shadow-sm">
              Tu cine en casa,<br/> 
              
              {/* Texto dinámico con efecto de escritura/rotación */}
              <RotatingText
                texts={['saga a saga.', '100% fiable.', 'pilla palomitas.']}
                mainClassName="text-[var(--coral)] inline-flex overflow-hidden pb-2 drop-shadow-sm"
                staggerDuration={0.03}
                staggerFrom="last"
                rotationInterval={3500}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
              />
            </h1>
            
            <p className="text-lg md:text-xl text-[var(--text-soft)] font-medium leading-relaxed max-w-2xl mx-auto md:mx-0 text-justify">
              Descubre la mejor plataforma para alquilar franquicias completas. Maratones de fin de semana sin interrupciones con las mejores colecciones de la historia del cine.
            </p>
            
            {/* Enlaces de navegación principales (Call to Actions) */}
            <div className="pt-6 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
              <Link 
                href="/catalogo" 
                className="w-full sm:w-[260px] text-center bg-[var(--coral)] hover:bg-[var(--coral-dark)] text-white font-bold text-lg py-4 px-6 rounded-full transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Explorar Catálogo
              </Link>
              <Link 
                href="/components/contacto" 
                className="w-full sm:w-[260px] text-center text-[var(--teal-dark)] border-2 border-[var(--teal)] font-bold text-lg py-4 px-6 rounded-full hover:bg-[var(--teal-light)] hover:text-[var(--teal-deeper)] transition-all bg-white/70 backdrop-blur-sm"
              >
                Contactar con soporte
              </Link>
            </div>
          </div>
          
          {/* Ilustración de cabecera */}
          <HeroGraphic />
        </div>
      </section>

      {/* SECCIÓN DE NOVEDADES (CARRUSEL) */}
      <section className="bg-gradient-to-b from-[var(--cream)] to-[var(--coral)]/25 py-32 px-8 border-t border-[var(--border)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--teal-light)] to-transparent opacity-50"></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--text)] mb-4">
              ¡Recién llegadas a nuestro catálogo!
            </h2>
            <p className="text-[var(--muted)] text-lg font-medium">
              Las últimas incorporaciones listas para alquilar y disfrutar.
            </p>
          </div>
          {/* Renderizado del carrusel pasándole las sagas obtenidas de Prisma */}
          <HomeCarousel sagas={ultimasSagas} />
        </div>
      </section>
    </main>
  );
}