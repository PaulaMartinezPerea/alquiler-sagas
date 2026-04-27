"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("Cargando...");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      setMensaje("Usuario registrado");
      setEmail("");
      setPassword("");
    } else {
      setMensaje("Error al registrar: El email ya existe o faltan datos.");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 p-8">
      <div className="max-w-md w-full bg-white dark:bg-zinc-800 p-8 rounded-xl shadow-md border border-zinc-200 dark:border-zinc-700">
        <h1 className="text-2xl font-bold mb-6 text-center">Crear Cuenta</h1>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Correo Electrónico</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded-md dark:bg-zinc-700 dark:border-zinc-600"
              placeholder="paulamartinez@gmail.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Contraseña</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded-md dark:bg-zinc-700 dark:border-zinc-600"
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors">
            Registrarse
          </button>
        </form>

        {mensaje && (
          <p className="mt-4 text-center font-medium text-sm text-green-600 dark:text-green-400">
            {mensaje}
          </p>
        )}
        
        <div className="mt-6 text-center">
          <a href="/" className="text-sm text-blue-500 hover:underline">Volver al Catálogo</a>
        </div>
      </div>
    </main>
  );
}