"use client";

import Link from "next/link";
import Aurora from "../components/Aurora";

// Componente principal de la página de Política de Privacidad
export default function PoliticaPrivacidadPage() {
  return (
    <main className="min-h-screen relative overflow-hidden p-8 text-[var(--text)]">
      
      {/* Fondo animado fijado en la capa posterior para no interferir con los clics */}
      <div className="fixed inset-0 z-0 opacity-80 pointer-events-none">
        <Aurora colorStops={["#6BBFCB", "#FAF7F4", "#E8735A"]} speed={0.6} amplitude={1.0} blend={0.6} />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Botón de navegación para regresar a la página de inicio */}
        <Link href="/" className="text-[var(--teal-dark)] hover:text-[var(--teal)] transition-colors mb-10 inline-flex items-center gap-2 font-bold text-lg drop-shadow-sm bg-white/50 backdrop-blur-sm px-5 py-2.5 rounded-full border border-white/50 animate-fade-up-smooth">
          ← Volver al inicio
        </Link>

        {/* Contenedor principal del texto con efecto glassmorphism (cristal translúcido) */}
        <div className="bg-[var(--surface)]/95 backdrop-blur-md p-8 md:p-16 rounded-3xl shadow-xl border border-white/60 animate-fade-up-smooth" style={{ animationDelay: '0.2s' }}>
          {/* Título de la página y párrafo de introducción */}
          <h1 className="text-4xl md:text-5xl font-black mb-6 text-[var(--text)] pb-2 leading-normal drop-shadow-sm">
            Política de Privacidad
          </h1>
          
          <p className="text-xl text-[var(--text-soft)] mb-12 italic leading-relaxed border-l-4 border-[var(--coral)] pl-6">
            Información sobre cómo tratamos los datos personales que nos confías en ASTROFILM y los derechos que te asisten.
          </p>

          {/* Bloque con las diferentes secciones legales del documento */}
          <div className="space-y-12 leading-relaxed">
            {/* Sección 1: Introducción */}
            <section className="group p-6 rounded-2xl transition-all hover:bg-white/50 border border-transparent hover:border-white/60">
              <h2 className="text-2xl font-black text-[var(--teal-dark)] mb-4 group-hover:text-[var(--coral)] transition-colors">1. Introducción</h2>
              <p className="text-[var(--text-soft)] font-medium">
                En <strong>ASTROFILM</strong>, sensibilizados con las necesidades de los usuarios de Internet y conscientes de la importancia de la rigurosa privacidad, protegemos tu información con estándares galácticos.
              </p>
            </section>

            {/* Sección 2: Información de contacto del responsable de datos */}
            <section className="group p-6 rounded-2xl transition-all hover:bg-white/50 border border-transparent hover:border-white/60">
              <h2 className="text-2xl font-black text-[var(--teal-dark)] mb-4 group-hover:text-[var(--coral)] transition-colors">2. Responsable del Tratamiento</h2>
              <div className="bg-white/60 border border-white/80 p-6 rounded-xl shadow-sm space-y-2">
                <p><strong>Email:</strong> <a href="mailto:martinezpereapaula@gmail.com" className="text-[var(--coral)] font-bold hover:underline">martinezpereapaula@gmail.com</a></p>
                <p><strong>Teléfono:</strong> 608 65 44 30</p>
                <p><strong>Dirección:</strong> Calle del Cine, 31, 41001 Sevilla</p>
              </div>
            </section>

            {/* Sección 3: Propósito de la recopilación de datos */}
            <section className="group p-6 rounded-2xl transition-all hover:bg-white/50 border border-transparent hover:border-white/60">
              <h2 className="text-2xl font-black text-[var(--teal-dark)] mb-4 group-hover:text-[var(--coral)] transition-colors">3. Finalidad</h2>
              <p className="text-[var(--text-soft)] mb-4 font-medium">Gestionamos tus datos para asegurar que tus alquileres y maratones lleguen a buen puerto:</p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm font-bold text-[var(--teal-deeper)]">
                <li className="flex items-center gap-2"> <span className="text-[var(--coral)]">✦</span> Gestión de alquileres</li>
                <li className="flex items-center gap-2"> <span className="text-[var(--coral)]">✦</span> Soporte técnico</li>
                <li className="flex items-center gap-2"> <span className="text-[var(--coral)]">✦</span> Seguridad Anti-Spam</li>
                <li className="flex items-center gap-2"> <span className="text-[var(--coral)]">✦</span> Mejoras en la plataforma</li>
              </ul>
            </section>

            {/* Sección 4: Derechos del usuario renderizados dinámicamente mediante un array */}
            <section className="group p-6 rounded-2xl transition-all hover:bg-white/50 border border-transparent hover:border-white/60">
              <h2 className="text-2xl font-black text-[var(--teal-dark)] mb-4 group-hover:text-[var(--coral)] transition-colors">4. Tus Derechos</h2>
              <p className="text-[var(--text-soft)] mb-6 font-medium">Como comandante de tus datos, tienes derecho a:</p>
              <div className="flex flex-wrap gap-3">
                {['Acceso', 'Rectificación', 'Supresión', 'Limitación', 'Oposición'].map((derecho) => (
                  <span key={derecho} className="bg-[var(--teal-light)] text-[var(--teal-deeper)] px-4 py-1.5 rounded-lg font-bold text-xs uppercase tracking-wider border border-[var(--teal)]/20 shadow-sm">
                    {derecho}
                  </span>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}