"use client";

import { useState } from "react";

export default function RegisterPage() {
  // Estados para almacenar lo que escribe el usuario y los mensajes de feedback
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje]   = useState("");

  // Función que se ejecuta al intentar crear la cuenta
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("Cargando...");

    // Llamada a nuestro endpoint de la API para registrar el usuario
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    // Manejo de la respuesta del servidor
    if (res.ok) {
      setMensaje("Usuario registrado");
      setEmail("");
      setPassword("");
    } else {
      setMensaje("Error al registrar: El email ya existe o faltan datos.");
    }
  };

  // ESTRUCTURA VISUAL DE LA PÁGINA
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="top-bar" />

        {/* Cabecera con el logo de la marca */}
        <div className="auth-card__logo-bar">
          <img src="/images/logo/logo_astrofilm.png" alt="ASTROFILM" />
          <span className="auth-card__logo-name">ASTROFILM</span>
        </div>

        <h1 className="auth-card__title text-[var(--text)] dark:text-[var(--dark-text)]">
          Crear Cuenta
        </h1>

        {/* Formulario de registro */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Campo: Email */}
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
          {/* Botón de envío */}
          <button type="submit" className="btn-coral w-full mt-2">
            Registrarse
          </button>
        </form>

        {/* Muestra el mensaje de éxito o error si existe */}
        {mensaje && (
          <p className="mt-4 text-center text-sm font-semibold msg-success">
            {mensaje}
          </p>
        )}

        {/* Enlace para volver atrás */}
        <div className="mt-6 text-center">
          <a href="/" className="text-sm text-[var(--teal-dark)] dark:text-[var(--teal-light)] hover:underline">
            Volver al Inicio
          </a>
        </div>
      </div>
    </div>
  );
}