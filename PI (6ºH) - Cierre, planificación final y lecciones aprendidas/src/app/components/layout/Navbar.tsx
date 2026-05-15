"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// Componente principal de la barra de navegación
export default function Navbar() {
  // Estados para la sesión del usuario y el efecto visual de scroll
  const [role, setRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  // Efecto que se ejecuta al montar el componente en el cliente
  useEffect(() => {
    // Recuperación de los datos de sesión almacenados localmente
    const session = localStorage.getItem("userSession");
    if (session) {
      const parsedSession = JSON.parse(session);
      setRole(parsedSession.role);
      const name = parsedSession.email.split("@")[0];
      setUserName(name);
    }

    // Lógica para detectar si el usuario ha hecho scroll hacia abajo
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    // Activamos y limpiamos el listener del scroll para evitar fugas de memoria
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Función para cerrar sesión, limpiando el almacenamiento y redirigiendo
  const handleLogout = () => {
    localStorage.removeItem("userSession");
    window.location.href = "/";
  };

  // ESTRUCTURA VISUAL DEL NAVBAR
  return (
    <nav 
      // Clases dinámicas: Se añade desenfoque y sombra si se ha hecho scroll
      className={`astro-navbar relative transition-all duration-300 ${
        isScrolled 
          ? 'backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.15)]' 
          : 'shadow-none'
      }`}
      // Fondo dinámico con gradiente que se vuelve semitransparente al hacer scroll
      style={{
        background: `linear-gradient(to right, 
          var(--teal-light) 0%, 
          rgba(var(--nav-bg), ${isScrolled ? '0.85' : '1'}) 50%, 
          var(--coral-light) 100%)`
      }}
    >
      {/* Borde inferior decorativo con gradiente */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-[var(--teal)] to-[var(--coral)] opacity-90"></div>

      {/* Sección de logotipo y nombre de la marca */}
      <Link href="/" className="astro-navbar__brand relative z-10">
        <img src="/images/logo/logo_astrofilm.png" alt="Logo" className="astro-navbar__logo" />
        <span className="astro-navbar__brand-name">ASTROFILM</span>
      </Link>

      {/* Menú de navegación principal */}
      <ul className="astro-navbar__nav relative z-10">
        <li><Link href="/" className="astro-navbar__link">Inicio</Link></li>
        <li><Link href="/catalogo" className="astro-navbar__link">Catálogo</Link></li>
        <li><Link href="/components/contacto" className="astro-navbar__link">Contacto</Link></li>

      {/* Renderizado condicional basado en el estado de autenticación */}
        {role ? (
          // Vista para usuarios logueados
          <>
            <li><span className="astro-navbar__greeting text-[var(--text-soft)]">¡Hola, <strong>{userName}</strong>!</span></li>
            {/* Botón exclusivo para Administradores */}
            {role === "ADMIN" && (
              <li><Link href="/admin" className="astro-navbar__icon-btn astro-navbar__icon-btn--admin"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg></Link></li>
            )}
            {/* Botón exclusivo para Clientes */}
            {role === "CLIENT" && (
              <li><Link href="/perfil" className="astro-navbar__icon-btn astro-navbar__icon-btn--client"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg></Link></li>
            )}
            <li><button onClick={handleLogout} className="astro-navbar__logout">Cerrar sesión</button></li>
          </>
        ) : (
          // Vista para visitantes (invocan el Modal Global de Autenticación mediante parámetros en la URL)
          <>
            <li className="astro-navbar__auth-divider" aria-hidden="true" />
            <li><Link href="?auth=login" className="astro-navbar__link">Iniciar sesión</Link></li>
            <li><Link href="?auth=register" className="btn-coral px-6 py-2">Registro</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}