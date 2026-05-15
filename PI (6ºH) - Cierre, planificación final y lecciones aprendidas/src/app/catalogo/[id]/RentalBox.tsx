"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// Definición de las propiedades que recibe el componente
interface RentalBoxProps {
  sagaId: number;
  name: string;
  precioBase: number;
}

export default function RentalBox({ sagaId, name, precioBase }: RentalBoxProps) {
  // Estados para manejar la sesión del usuario, cargas, mensajes y pasos del flujo de compra
  const [userEmail, setUserEmail]           = useState<string | null>(null);
  const [loading, setLoading]               = useState(false);
  const [message, setMessage]               = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [step, setStep]                     = useState<"choose" | "checkout">("choose");
  const [selectedDuration, setSelectedDuration] = useState<"semana" | "mes">("semana");

  // Comprueba si el usuario está logueado leyendo el localStorage
  useEffect(() => {
    const session = localStorage.getItem("userSession");
    if (session) setUserEmail(JSON.parse(session).email);
  }, []);

  // Cálculo del precio de la oferta mensual
  const precioMes = precioBase * 2;

  // Función para avanzar al paso de pago según la duración
  const startCheckout = (duracion: "semana" | "mes") => {
    setSelectedDuration(duracion); setStep("checkout"); setMessage(null);
  };

  // Procesa la simulación de pago y envía los datos a la API
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setMessage(null);
    try {
      const res = await fetch("/api/alquileres", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, sagaId, duracion: selectedDuration }),
      });
      if (res.ok) {
        setMessage({ text: `¡Pago aceptado! Disfruta de la saga ${name}.`, type: "success" });
        setStep("choose");
      } else {
        // Error controlado desde la API
        const data = await res.json();
        setMessage({ text: data.error || "Error en la transacción.", type: "error" });
      }
    } catch {
      setMessage({ text: "Error de conexión.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // Usuario no autenticado (Pide iniciar sesión)
  if (!userEmail) {
    return (
      <div className="flex flex-col w-fit ml-auto">
        <p className="text-3xl font-black mb-3 text-[var(--coral-dark)] text-center sm:text-right drop-shadow-sm">
          Desde {precioBase.toFixed(2)}€
        </p>
        <Link
          href="?auth=login"
          onClick={() => localStorage.setItem("returnUrl", window.location.pathname)}
          className="w-full bg-[var(--coral)] hover:bg-[var(--coral-dark)] text-white text-sm font-bold py-2 rounded-lg text-center transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
        >
          Alquilar
        </Link>
      </div>
    );
  }

  // Pago completado con éxito 
  if (message?.type === "success") {
    return (
      <div className="p-6 rounded-2xl text-center sm:text-right w-full sm:w-[320px] bg-white/80 backdrop-blur-sm border-2 border-[var(--teal)] transform transition-all duration-500 shadow-md">
        <p className="font-black text-xl mb-2 text-[var(--teal-dark)]">
          ¡Alquiler Confirmado!
        </p>
        <p className="text-base text-[var(--text)] font-semibold mb-4 leading-snug">
          {message.text}
        </p>
        <button 
          onClick={() => setMessage(null)}
          className="font-bold underline text-[var(--teal-dark)] hover:text-[var(--coral)] transition-colors"
        >
          Realizar otro alquiler
        </button>
      </div>
    );
  }

  // Formulario de Checkout (Pasarela de pago simulada)
  if (step === "checkout") {
    const precioFinal = selectedDuration === "semana" ? precioBase : precioMes;
    return (
      <div className="w-full sm:w-[380px] relative z-10 shadow-xl rounded-2xl overflow-hidden border border-white/60">
        {/* EFECTO CRISTAL EN EL CHECKOUT SIN ELECTRIC BORDER */}
        <div className="w-full h-full bg-[var(--surface)]/90 backdrop-blur-md p-6">
          <div className="flex justify-between items-center mb-5 pb-4 border-b border-[var(--border)]">
            <h3 className="font-black text-lg text-[var(--teal-dark)]">
              Finalizar Compra
            </h3>
            <span className="font-black text-2xl text-[var(--coral-dark)]">
              {precioFinal.toFixed(2)}€
            </span>
          </div>

          <form onSubmit={handlePaymentSubmit} className="flex flex-col gap-3.5">
            {/* Datos de facturación */}
            <input type="text" required placeholder="Nombre completo" className="w-full bg-white/80 border border-[var(--border)] text-[var(--text)] px-4 py-3 rounded-lg text-sm focus:outline-none focus:border-[var(--teal)] transition-colors" />
            <input type="tel" required placeholder="Teléfono" className="w-full bg-white/80 border border-[var(--border)] text-[var(--text)] px-4 py-3 rounded-lg text-sm focus:outline-none focus:border-[var(--teal)] transition-colors" />
            <input type="text" required placeholder="Dirección de facturación" className="w-full bg-white/80 border border-[var(--border)] text-[var(--text)] px-4 py-3 rounded-lg text-sm focus:outline-none focus:border-[var(--teal)] transition-colors" />

            {/* Datos de la tarjeta simulada */}
            <div className="relative">
              <input type="text" required placeholder="Número de Tarjeta (16 dígitos)"
                pattern="\d{16}" title="Debe contener 16 números"
                className="w-full bg-white/80 border border-[var(--border)] text-[var(--text)] px-4 py-3 pl-11 rounded-lg text-sm focus:outline-none focus:border-[var(--teal)] transition-colors" />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg">💳</span>
            </div>

            <div className="flex gap-3">
              <input type="text" required placeholder="MM/AA" pattern="\d{2}/\d{2}"
                title="Formato MM/AA" className="w-1/2 bg-white/80 border border-[var(--border)] text-[var(--text)] px-4 py-3 rounded-lg text-sm focus:outline-none focus:border-[var(--teal)] transition-colors" />
              <input type="text" required placeholder="CVC" pattern="\d{3,4}"
                title="3 o 4 números" className="w-1/2 bg-white/80 border border-[var(--border)] text-[var(--text)] px-4 py-3 rounded-lg text-sm focus:outline-none focus:border-[var(--teal)] transition-colors" />
            </div>

            {/* Mensaje de error en el pago */}
            {message?.type === "error" && (
              <p className="text-red-600 font-bold text-sm bg-red-100/90 backdrop-blur-sm p-3 rounded-lg mt-1 border border-red-200">{message.text}</p>
            )}

            {/* Botones del formulario */}
            <div className="flex gap-3 mt-4">
              <button type="button" onClick={() => setStep("choose")}
                className="w-1/3 bg-white/80 border border-[var(--border)] hover:bg-white text-[var(--text)] text-sm font-bold py-3 rounded-xl transition-colors">
                Volver
              </button>
              <button type="submit" disabled={loading}
                className="w-2/3 bg-[var(--coral)] hover:bg-[var(--coral-dark)] text-white text-base font-bold py-3 rounded-xl transition-transform transform hover:-translate-y-1 shadow-md disabled:opacity-50 disabled:transform-none">
                {loading ? "Procesando..." : `Pagar ${precioFinal.toFixed(2)}€`}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // El usuario elige la duración del alquiler
  return (
    <div className="flex flex-col w-full sm:w-[320px]">
      <span className="text-[var(--teal-dark)] text-sm uppercase tracking-widest font-black mb-4 text-center sm:text-right drop-shadow-sm">
        Opciones de alquiler
      </span>
      <div className="flex flex-col gap-3">
        
        {/* Opción 1: Alquiler Semanal */}
        <button
          onClick={() => startCheckout("semana")} 
          className="flex justify-between items-center w-full bg-[var(--surface)]/80 backdrop-blur-sm border border-white/50 hover:border-[var(--teal)] hover:bg-[var(--surface)] text-[var(--text)] p-4 rounded-xl transition-all group shadow-sm"
        >
          <span className="font-bold text-lg group-hover:text-[var(--teal-dark)] transition-colors">1 Semana</span>
          <span className="font-black text-[var(--teal-dark)] text-xl drop-shadow-sm">{precioBase.toFixed(2)}€</span>
        </button>

        {/* Opción 2: Alquiler Mensual */}
        <button 
          onClick={() => startCheckout("mes")} 
          className="flex justify-between items-center w-full bg-[var(--surface)]/80 backdrop-blur-sm border border-[var(--coral-light)] hover:border-[var(--coral)] hover:bg-[var(--surface)] text-[var(--text)] p-4 rounded-xl transition-all shadow-sm relative overflow-hidden group"
        >
          <span className="absolute top-0 right-0 bg-[var(--coral)] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-bl-lg shadow-sm">
            Mejor Oferta
          </span>
          <div className="flex flex-col items-start">
            <span className="font-bold text-lg group-hover:text-[var(--coral-dark)] transition-colors">1 Mes</span>
          </div>
          <span className="font-black text-[var(--coral-dark)] text-xl drop-shadow-sm">{precioMes.toFixed(2)}€</span>
        </button>

      </div>
    </div>
  );
}