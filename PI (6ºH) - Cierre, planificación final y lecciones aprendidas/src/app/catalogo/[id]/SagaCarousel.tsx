"use client";

import { useState, useEffect } from "react";
import ElectricBorder from "../../components/ElectricBorder"; // Ajusta la ruta si es necesario

// Componente de carrusel automático para las imágenes de la saga
export default function SagaCarousel({ images }: { images: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Efecto para iniciar la rotación automática de las imágenes cada 3 segundos
  useEffect(() => {
    if (images.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); 

    // Limpieza al desmontar el componente
    return () => clearInterval(interval);
  }, [images.length]);

  // ESTRUCTURA VISUAL DEL CARRUSEL
  return (
    // Contenedor principal con borde animado
    <ElectricBorder color="#6BBFCB" borderRadius={16} className="w-full h-full aspect-[2/3] shadow-[0_15px_40px_rgba(46,122,136,0.15)]">
      <div className="relative w-full h-full rounded-2xl overflow-hidden bg-[var(--cream)]/80 backdrop-blur-md border border-white/50 group">
        
        {/* Renderizado superpuesto de las imágenes */}
        {images.map((img, index) => (
          <img 
            key={index}
            src={img} 
            alt={`Póster ${index + 1}`} 
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
              index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          />
        ))}
        
        {/* Capa de controles (flechas y puntos) */}
        {images.length > 1 && (
          <div className="absolute inset-0 z-20 pointer-events-none">
            
            {/* Botón hacia atrás */}
            <button
              onClick={() => setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-[var(--surface)]/70 hover:bg-[var(--coral)] text-[var(--teal-dark)] hover:text-white p-3 md:p-4 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-md backdrop-blur-sm border border-white/50 pointer-events-auto"
            >
              ❮
            </button>
            
            {/* Botón de avance */}
            <button
              onClick={() => setCurrentIndex((prev) => (prev + 1) % images.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-[var(--surface)]/70 hover:bg-[var(--coral)] text-[var(--teal-dark)] hover:text-white p-3 md:p-4 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-md backdrop-blur-sm border border-white/50 pointer-events-auto"
            >
              ❯
            </button>
            
            {/* Paginación (puntos) */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2.5 p-2 rounded-full bg-black/30 backdrop-blur-md border border-white/20 pointer-events-auto">
              {images.map((_, i) => (
                <div 
                  key={i} 
                  className={`w-2.5 h-2.5 rounded-full transition-all ${i === currentIndex ? 'bg-[var(--coral)] scale-125 shadow-sm' : 'bg-white/60 hover:bg-white'}`} 
                />
              ))}
            </div>
            
          </div>
        )}
      </div>
    </ElectricBorder>
  );
}