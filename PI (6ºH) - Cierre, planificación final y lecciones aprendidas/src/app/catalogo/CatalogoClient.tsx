"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Aurora from "../components/Aurora";

// Definición de tipos basados en el esquema de Prisma
type Categoria = { id: number; name: string };
type Movie = { id: number; title: string; releaseYear: number };
type Saga = {
  id: number;
  name: string;
  description: string | null;
  precio: number;
  movies: Movie[];
  categorias: Categoria[];
};

interface Props {
  initialSagas: Saga[];
  allCategorias: Categoria[];
}

// Constante para controlar cuántas tarjetas se muestran por página
const ITEMS_PER_PAGE = 8;

export default function CatalogoClient({ initialSagas, allCategorias }: Props) {
  // Estados para controlar el buscador de texto, el filtro desplegable y la paginación
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Utilidad para limpiar textos (quita tildes y pasa a minúsculas)
  const normalizeText = (text: string) =>
    text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  // Efecto que devuelve al usuario a la página 1 automáticamente si escribe algo nuevo o cambia de categoría
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  // Lógica de filtrado: evalúa cada saga contra la categoría y el texto buscado
  const filteredSagas = initialSagas.filter((saga) => {
    // Filtro por categoría
    if (selectedCategory && !saga.categorias.some(c => c.name === selectedCategory)) return false;
    // Filtro por texto (busca en el nombre de la saga, el título de las películas o el año)
    if (searchTerm) {
      const s = normalizeText(searchTerm);
      const matchSaga  = normalizeText(saga.name).includes(s);
      const matchMovie = saga.movies.some(m =>
        normalizeText(m.title).includes(s) || m.releaseYear.toString().includes(s)
      );
      if (!matchSaga && !matchMovie) return false;
    }
    return true;
  });

  // Lógica de paginación: calcula cuántas páginas hay y recorta el array principal
  const totalPages = Math.ceil(filteredSagas.length / ITEMS_PER_PAGE);
  const paginatedSagas = filteredSagas.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // ESTRUCTURA VISUAL DE LA PÁGINA
  return (
    <main className="min-h-screen relative overflow-hidden px-8 py-16 text-[var(--text)]">
      
      {/* Inyección de CSS para la animación de entrada */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeUpAnim {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up-smooth {
          animation: fadeUpAnim 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />

      {/* Fondo animado */}
      <div className="fixed inset-0 z-0 opacity-80 pointer-events-none">
        <Aurora colorStops={["#6BBFCB", "#FAF7F4", "#E8735A"]} speed={0.6} amplitude={1.0} blend={0.6} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        
        {/* Cabecera, Título y Panel de Búsqueda */}
        <header className="text-center mb-16 animate-fade-up-smooth">
          <span className="text-[var(--coral-dark)] font-black tracking-widest uppercase text-sm mb-3 block drop-shadow-sm">
            Todo el cine en un solo lugar
          </span>
          <h1 className="text-4xl md:text-5xl font-black mb-4 text-[var(--text)] pb-2 leading-normal drop-shadow-sm">
            Catálogo de Sagas
          </h1>

          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center bg-[var(--surface)]/70 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.1)] border border-[var(--border)] overflow-hidden mt-8">
            {/* Input de texto */}
            <div className="flex-1 flex items-center w-full px-5 py-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--teal-dark)] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Buscar saga, película o año..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent border-none outline-none pl-3 py-2 text-[var(--text)] placeholder-[var(--muted)] font-medium"
              />
            </div>

            {/* Separador visual entre input y select */}
            <div className="w-full sm:w-px h-px sm:h-8 bg-[var(--border)] opacity-30"></div>

            {/* Selector de Categorías */}
            <div className="relative w-full sm:w-auto">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full appearance-none bg-transparent border-none outline-none pl-5 pr-12 py-4 text-[var(--teal-dark)] font-bold cursor-pointer hover:text-[var(--coral)] transition-colors"
                style={{ minWidth: '220px' }}
              >
                <option value="">Todas las categorías</option>
                {allCategorias.map((cat) => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
              {/* Icono de flecha para el select */}
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--teal-dark)]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </header>

        {/* Cuadrícula de Resultados */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {paginatedSagas.length === 0 ? (
            /* Muestra un mensaje si la búsqueda falla */
            <div className="col-span-full p-16 text-center bg-[var(--surface)]/70 backdrop-blur-xl rounded-3xl border border-[var(--border)] shadow-sm">
              <p className="text-3xl font-black text-[var(--teal-dark)] mb-3">Sin resultados</p>
              <p className="text-[var(--text-soft)] font-medium text-lg">No hemos encontrado ninguna saga o película que coincida con tu búsqueda.</p>
            </div>
          ) : (
            /* Renderizado de las Tarjetas de Sagas */
            paginatedSagas.map((saga) => (
              <div key={saga.id} className="group bg-[var(--surface)]/50 backdrop-blur-xl w-full h-full rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_35px_rgba(46,122,136,0.15)] transform hover:-translate-y-2 transition-all duration-300 flex flex-col border-2 border-[var(--coral)] hover:border-[var(--teal)]">

                {/* Contenedor de Imagen de la tarjeta */}
                <div className="relative aspect-[2/3] overflow-hidden bg-transparent">
                  <img src={`/images/posters/${saga.name}/poster.png`} alt={`Póster de ${saga.name}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (!target.src.includes('placeholder')) target.src = `/images/posters/${encodeURIComponent(saga.name)}/poster.png`;
                      target.onerror = () => { target.src = 'https://via.placeholder.com/400x600?text=No+Encontrado'; };
                    }}
                  />
                </div>

                {/* Contenidode la tarjeta: Títulos, Categorías y Precio */}
                <div className="p-6 flex flex-col flex-1">
                  <h2 className="text-xl font-black text-[var(--text)] group-hover:text-[var(--coral)] transition-colors duration-300 mb-3 line-clamp-1 drop-shadow-sm">
                    {saga.name}
                  </h2>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {saga.categorias.map(c => (
                      <span key={c.id} className="text-xs font-bold uppercase tracking-wider bg-[var(--teal-light)] text-[var(--teal-dark)] px-2.5 py-1 rounded-md border border-[var(--teal)]/20 backdrop-blur-sm">
                        {c.name}
                      </span>
                    ))}
                  </div>

                  {/* Pie de la tarjeta */}
                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-[var(--border)] group-hover:border-[var(--teal)]/30 transition-colors duration-300">
                    <span className="text-xl font-black text-[var(--coral)] drop-shadow-sm">{saga.precio.toFixed(2)} €</span>
                    <Link href={`/catalogo/${saga.id}`} className="bg-[var(--teal)]/90 backdrop-blur-sm border border-white/20 hover:bg-[var(--teal-dark)] text-white font-bold py-2 px-5 rounded-lg transition-colors shadow-md">
                      Ver más
                    </Link>
                  </div>
                </div>

              </div>
            ))
          )}
        </div>

        {/* Controles de Paginación */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-6 mt-16 pb-8">
            <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-5 py-2.5 rounded-full font-bold text-[var(--teal-dark)] bg-[var(--surface)]/70 backdrop-blur-md border border-[var(--border)] hover:border-[var(--teal)] hover:text-[var(--teal)] disabled:opacity-40 disabled:pointer-events-none transition-all shadow-sm">
              &larr; Anterior
            </button>
            <span className="text-base font-medium text-[var(--text-soft)] bg-[var(--surface)]/50 backdrop-blur-md px-4 py-1.5 rounded-full border border-[var(--border)]">
              Página <strong className="text-[var(--teal-dark)]">{currentPage}</strong> de {totalPages}
            </span>
            <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="px-5 py-2.5 rounded-full font-bold text-[var(--teal-dark)] bg-[var(--surface)]/70 backdrop-blur-md border border-[var(--border)] hover:border-[var(--teal)] hover:text-[var(--teal)] disabled:opacity-40 disabled:pointer-events-none transition-all shadow-sm">
              Siguiente &rarr;
            </button>
          </div>
        )}

      </div>
    </main>
  );
}