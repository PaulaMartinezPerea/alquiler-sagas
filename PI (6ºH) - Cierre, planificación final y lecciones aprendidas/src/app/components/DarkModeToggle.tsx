"use client";

import { useEffect, useState } from "react";

// Componente flotante para alternar entre el tema claro y oscuro
export default function DarkModeToggle() {
  // Estado para controlar qué tema está activo actualmente
  const [darkMode, setDarkMode] = useState(false);

  // Efecto inicial: Recupera la preferencia del usuario guardada en localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Función que alterna el tema, actualiza la clase en el HTML y guarda la preferencia
  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setDarkMode(true);
    }
  };

  // Botón flotante con posicionamiento fijo y efecto "glassmorphism"
  return (
    <button 
      onClick={toggleDarkMode}
      className="fixed top-32 right-8 z-[1001] flex items-center gap-3 px-5 py-2.5 rounded-full 
                 bg-[var(--surface)]/80 backdrop-blur-md border border-[var(--coral)]/40 
                 hover:border-[var(--teal)] hover:scale-105 shadow-[0_8px_30px_rgba(0,0,0,0.1)] 
                 transition-all duration-300 group"
      title="Cambiar ambiente"
    >
      {/* Texto indicador dinámico */}
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-soft)] group-hover:text-[var(--teal-dark)] transition-colors">
        {darkMode ? 'Noche' : 'Día'}
      </span>
      
      <div className="relative w-6 h-6 flex items-center justify-center">
        {/* Icono de Sol */}
        <svg
          xmlns="http://www.w3.org/2000/svg" 
          className={`absolute w-6 h-6 transition-all duration-500 ease-out ${darkMode ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100 text-[var(--coral)]'}`} 
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 3v1m0 16v1m9-9h-1M4 9h-1m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        
        {/* Icono de Luna */}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`absolute w-5 h-5 transition-all duration-500 ease-out ${!darkMode ? 'opacity-0 -rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100 text-[var(--teal)]'}`} 
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      </div>
    </button>
  );
}