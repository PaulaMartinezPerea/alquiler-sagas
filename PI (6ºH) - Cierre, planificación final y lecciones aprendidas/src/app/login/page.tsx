"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  // Estados para controlar los datos del formulario y los mensajes de la interfaz
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje]   = useState("");
  const [error, setError]       = useState(false);
  const router = useRouter();

  // Función principal que procesa el intento de inicio de sesión
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("Comprobando credenciales...");
    setError(false);

    try {
      // Petición al backend para validar el usuario y contraseña
      const res  = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok) {
        setMensaje("¡Inicio de sesión exitoso! Redirigiendo...");
        // Guardamos los datos de sesión en el navegador
        localStorage.setItem("userSession", JSON.stringify({ email, role: data.role }));
        // Retraso de medio segundo para que el usuario lea el mensaje antes de cambiar de página
        setTimeout(() => {
          // Lógica de redirección: Vuelve a la página donde estaba o al inicio por defecto
          const returnUrl = localStorage.getItem("returnUrl") || "/";
          localStorage.removeItem("returnUrl");
          window.location.href = returnUrl;
        }, 500);
      } else {
        // Manejo de errores de credenciales incorrectas
        setMensaje(data.error || "Error al iniciar sesión.");
        setError(true);
      }
    } catch {
      // Manejo de errores si el servidor está caído
      setMensaje("Error de conexión con el servidor.");
      setError(true);
    }
  };

  // ESTRUCTURA VISUAL DE LA PÁGINA
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="top-bar" />

        {/* Logo */}
        <div className="auth-card__logo-bar">
          <img src="/images/logo/logo_astrofilm.png" alt="ASTROFILM" />
          <span className="auth-card__logo-name">ASTROFILM</span>
        </div>

        <h1 className="auth-card__title text-[var(--text)] dark:text-[var(--dark-text)]">
          Iniciar Sesión
        </h1>

        {/* Formulario de Login */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Campo: Correo Electrónico */}
          <div>
            <label className="section-label block mb-1">Correo Electrónico</label>
            <input
              type="email" required value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="astro-input"
              placeholder="paula@gmail.com"
            />
          </div>
          {/* Campo: Contraseña */}
          <div>
            <label className="section-label block mb-1">Contraseña</label>
            <input
              type="password" required value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="astro-input"
              placeholder="••••••••"
            />
          </div>
          {/* Botón de acceso */}
          <button type="submit" className="btn-coral w-full mt-2">
            Entrar
          </button>
        </form>

        {/* Feedback visual dinámico */}
        {mensaje && (
          <p className={`mt-4 text-center text-sm font-semibold ${error ? 'msg-error' : 'msg-success'}`}>
            {mensaje}
          </p>
        )}

        {/* Enlaces secundarios */}
        <div className="mt-6 text-center flex flex-col gap-2">
          <Link href="/register" className="text-sm text-[var(--teal-dark)] dark:text-[var(--teal-light)] hover:underline">
            ¿No tienes cuenta? Regístrate aquí
          </Link>
          <Link href="/" className="text-sm text-[var(--muted)] hover:underline">
            Volver al Inicio
          </Link>
        </div>
      </div>
    </div>
  );
}