"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ElectricBorder from "./components/ElectricBorder"; 

// Componente auxiliar de imagen que maneja los errores de carga progresivamente
const SagaImage = ({ sagaName }: { sagaName: string }) => {
  const [imgSrc, setImgSrc] = useState(`/images/posters/${encodeURIComponent(sagaName)}/poster.jpg`);
  const [errorCount, setErrorCount] = useState(0);

  return (
    <img
      src={imgSrc}
      alt={sagaName}
      className="w-full h-full object-cover object-center"
      onError={() => {
        // Sistema de fallback: intenta cargar un PNG si el JPG falla, o un marcador si ambos fallan
        if (errorCount === 0) {
          setImgSrc(`/images/posters/${encodeURIComponent(sagaName)}/poster.png`);
          setErrorCount(1);
        } else if (errorCount === 1) {
          setImgSrc('https://via.placeholder.com/600x800/2E7A88/FFFFFF?text=Sin+Imagen');
          setErrorCount(2);
        }
      }}
    />
  );
};

// Componente principal del carrusel de inicio
export default function HomeCarousel({ sagas }: { sagas: any[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Efecto que controla la rotación automática de las diapositivas
  useEffect(() => {
    if (sagas.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % sagas.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [sagas.length]);

  if (sagas.length === 0) return null;

  return (
    <ElectricBorder color="#6BBFCB" borderRadius={16} className="w-full max-w-5xl mx-auto h-[450px] shadow-[0_20px_50px_rgba(46,122,136,0.08)]">
      <div className="relative w-full h-full bg-[var(--surface)] rounded-2xl overflow-hidden flex group">
        {/* Generación dinámica de las diapositivas */}
        {sagas.map((saga, index) => (
          <div
            key={saga.id}
            className={`absolute inset-0 flex transition-opacity duration-1000 ${
              index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {/* Columna izquierda: Información detallada y llamada a la acción */}
            <div className="w-1/2 p-8 md:p-14 flex flex-col justify-center text-[var(--text)] z-20 relative">
              <span className="text-[var(--coral)] font-extrabold tracking-widest text-xs mb-3 uppercase">
                Nuevo Ingreso
              </span>
              <h2 className="text-3xl md:text-5xl font-black mb-4 leading-tight">
                {saga.name}
              </h2>
              
              <p className="text-[var(--text-soft)] line-clamp-3 mb-8 text-sm md:text-base font-medium leading-relaxed text-justify">
                {saga.description || "Descubre todas las películas de esta increíble saga y prepárate para un maratón inolvidable."}
              </p>
              
              <Link 
                href={`/catalogo/${saga.id}`} 
                className="bg-[var(--teal)] hover:bg-[var(--teal-dark)] text-white font-bold py-3 px-6 rounded-lg w-fit transition-all transform hover:-translate-y-1"
                style={{ boxShadow: '0 6px 20px rgba(107, 191, 203, 0.3)' }}
              >
                Alquilar por {saga.precio?.toFixed(2)}€
              </Link>
            </div>

            {/* Columna derecha: Imagen de fondo con máscara de degradado */}
            <div className="w-1/2 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--surface)] via-[var(--surface)]/70 to-transparent z-10"></div>
              
              <SagaImage sagaName={saga.name} />
              
            </div>
          </div>
        ))}

        {/* Controles de navegación inferiores (paginación) */}
        <div className="absolute bottom-6 left-1/4 -translate-x-1/2 flex gap-3 z-30">
          {sagas.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                i === currentIndex 
                  ? 'bg-[var(--coral)] w-8 shadow-md' 
                  : 'bg-[var(--border)] w-2.5 hover:bg-[var(--coral-light)]'
              }`}
            />
          ))}
        </div>
      </div>
    </ElectricBorder>
  );
}