"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export default function AuthModal() {
  // Hooks para interactuar con la URL actual
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Control de visibilidad basado en los parámetros de la URL (?auth=login o ?auth=register)
  const authType = searchParams.get("auth"); 
  const isOpen = authType === "login" || authType === "register";

  // Estados del formulario y feedback de la interfaz
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // Limpia los mensajes y campos de texto al cambiar de pestaña (de login a registro y viceversa)
  useEffect(() => {
    setMensaje("");
    setError(false);
    setEmail("");
    setPassword("");
  }, [authType]);

  // Si el parámetro de la URL no coincide, el modal se oculta (no renderiza nada)
  if (!isOpen) return null;

  // Cierra el modal navegando a la misma ruta en la que estamos pero sin parámetros
  const closeModal = () => {
    router.push(pathname); 
  };

  // Función principal unificada que procesa tanto el inicio de sesión como el registro
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensaje(authType === "login" ? "Comprobando credenciales..." : "Registrando...");
    setError(false);

    // Selección dinámica de la ruta de la API según el modo activo
    const endpoint = authType === "login" ? "/api/auth/login" : "/api/auth/register";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await res.json();

      if (res.ok) {
        if (authType === "login") {
          // Lógica de éxito para Login
          setMensaje("¡Inicio de sesión exitoso!");
          localStorage.setItem("userSession", JSON.stringify({ email, role: data.role }));
          setTimeout(() => {
            window.location.href = pathname; 
          }, 600);
        } else {
          // Lógica de éxito para Registro
          setMensaje("¡Usuario registrado! Cambiando a inicio de sesión...");
          setTimeout(() => {
            router.push(pathname + "?auth=login"); 
          }, 1500);
        }
      } else {
        // Fallo en la autenticación o registro devuelto por la API
        setMensaje(data.error || "Error en la operación. Revisa los datos.");
        setError(true);
      }
    } catch {
      // Error de red o servidor caído
      setMensaje("Error de conexión con el servidor.");
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // ESTRUCTURA VISUAL DEL MODAL
  return (
    // Capa oscura de fondo que intercepta el clic para cerrar el modal
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-opacity animate-fade-up" 
      onClick={closeModal}
    >
      {/* Contenedor principal de la tarjeta */}
      <div
        className="bg-[var(--surface)] w-full max-w-md rounded-3xl shadow-2xl border border-[var(--border)] overflow-hidden relative transform transition-transform animate-scale-in"
        onClick={(e) => e.stopPropagation()} 
      >
        {/* Detalle visual superior */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[var(--teal)] to-[var(--coral)]"></div>
        
        {/* Botón flotante para cerrar */}
        <button onClick={closeModal} className="absolute top-5 right-5 text-[var(--muted)] hover:text-[var(--coral)] transition-colors bg-[var(--cream)] rounded-full p-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-8 md:p-10">
          
          {/* Cabecera del formulario: Logo y textos dinámicos */}
          <div className="flex flex-col items-center mb-8 text-center">
            <img src="/images/logo/logo_astrofilm.png" alt="ASTROFILM" className="h-12 w-auto mb-4 drop-shadow-sm" />
            <h2 className="text-2xl font-black text-[var(--teal-dark)] uppercase tracking-wide">
              {authType === "login" ? "Bienvenido de nuevo" : "Únete a Astrofilm"}
            </h2>
            <p className="text-[var(--muted)] text-sm mt-1">
              {authType === "login" ? "Inicia sesión para continuar" : "Crea tu cuenta para alquilar sagas"}
            </p>
          </div>

          {/* Formulario de envío */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-[12px] font-bold text-[var(--muted)] mb-2 uppercase tracking-wide">Correo Electrónico</label>
              <input
                type="email" required value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[var(--cream)] border border-[var(--border)] text-[var(--text)] px-4 py-3 rounded-xl focus:outline-none focus:border-[var(--teal)] focus:ring-2 focus:ring-[var(--teal-light)] transition-all"
                placeholder="tu@email.com"
              />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-[var(--muted)] mb-2 uppercase tracking-wide">Contraseña</label>
              <input
                type="password" required value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[var(--cream)] border border-[var(--border)] text-[var(--text)] px-4 py-3 rounded-xl focus:outline-none focus:border-[var(--teal)] focus:ring-2 focus:ring-[var(--teal-light)] transition-all"
                placeholder="••••••••"
              />
            </div>

            {/* Botón de envío dinámico */}
            <button type="submit" disabled={loading} className="w-full mt-2 bg-[var(--coral)] hover:bg-[var(--coral-dark)] text-white text-base font-bold py-3.5 rounded-xl transition-all transform hover:-translate-y-1 shadow-[0_4px_15px_rgba(232,115,90,0.3)] disabled:opacity-50 disabled:transform-none">
              {loading ? "Procesando..." : (authType === "login" ? "Entrar" : "Crear Cuenta")}
            </button>
          </form>

          {/* Feedback visual de errores o éxito */}
          {mensaje && (
            <p className={`mt-5 p-3 rounded-lg text-center text-sm font-bold ${error ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
              {mensaje}
            </p>
          )}

          {/* Enlaces inferiores para alternar entre el registro y el inicio de sesión modificando la URL */}
          <div className="mt-8 text-center pt-5 border-t border-[var(--border)]">
            {authType === "login" ? (
              <button type="button" onClick={() => router.push(pathname + "?auth=register")} className="text-sm font-bold text-[var(--teal)] hover:text-[var(--coral)] transition-colors">
                ¿No tienes cuenta? Regístrate aquí
              </button>
            ) : (
              <button type="button" onClick={() => router.push(pathname + "?auth=login")} className="text-sm font-bold text-[var(--teal)] hover:text-[var(--coral)] transition-colors">
                ¿Ya tienes cuenta? Inicia sesión
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}