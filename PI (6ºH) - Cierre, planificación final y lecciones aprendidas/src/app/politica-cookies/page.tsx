"use client";

import Link from "next/link";
import Aurora from "../components/Aurora";

// Componente principal de la página de Política de Cookies
export default function PoliticaCookiesPage() {
  return (
    <main className="min-h-screen relative overflow-hidden p-8 text-[var(--text)]">
      
      {/* Capa de fondo animado fijada al fondo para no bloquear la interacción con el texto */}
      <div className="fixed inset-0 z-0 opacity-80 pointer-events-none">
        <Aurora colorStops={["#6BBFCB", "#FAF7F4", "#E8735A"]} speed={0.6} amplitude={1.0} blend={0.6} />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Enlace de retroceso a la página de inicio */}
        <Link href="/" className="text-[var(--teal-dark)] hover:text-[var(--teal)] transition-colors mb-10 inline-flex items-center gap-2 font-bold text-lg drop-shadow-sm bg-white/50 backdrop-blur-sm px-5 py-2.5 rounded-full border border-white/50 animate-fade-up-smooth">
          ← Volver al inicio
        </Link>

        {/* Contenedor principal del documento legal con efecto cristal translúcido */}
        <div className="bg-[var(--surface)]/95 backdrop-blur-md p-8 md:p-16 rounded-3xl shadow-xl border border-white/60 animate-fade-up-smooth" style={{ animationDelay: '0.2s' }}>
          {/* Cabecera del documento y párrafo introductorio */}
          <h1 className="text-4xl md:text-5xl font-black mb-6 text-[var(--text)] pb-2 leading-normal drop-shadow-sm">
            Política de Cookies
          </h1>
          
          <p className="text-xl text-[var(--text-soft)] mb-12 italic leading-relaxed border-l-4 border-[var(--teal)] pl-6">
            Navegación fluida y personalizada: así es como ASTROFILM utiliza las "galletas" digitales.
          </p>

          <div className="space-y-10 leading-relaxed">
            {/* Sección 1: Definición básica */}
            <section className="group">
              <h2 className="text-2xl font-black text-[var(--teal-dark)] mb-4 group-hover:text-[var(--coral)] transition-colors">1. ¿Qué son las cookies?</h2>
              <p className="text-[var(--text-soft)] font-medium">
                Son pequeños fragmentos de datos que nos permiten recordarte, guardar tu sesión y hacer que la búsqueda de tu próxima saga favorita sea instantánea.
              </p>
            </section>

            {/* Sección 2: Tipos de cookies renderizadas dinámicamente desde un array */}
            <section className="group">
              <h2 className="text-2xl font-black text-[var(--teal-dark)] mb-6 group-hover:text-[var(--coral)] transition-colors">2. Tipos de cookies en órbita</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { t: 'Técnicas', d: 'Esenciales para que puedas iniciar sesión y alquilar películas de forma segura.' },
                  { t: 'Personalización', d: 'Recuerdan tu idioma y tus preferencias visuales en la plataforma.' },
                  { t: 'Análisis', d: 'Nos ayudan a entender qué sagas son las más populares.' },
                  { t: 'Publicidad', d: 'Permiten mostrarte novedades que realmente te interesen.' }
                ].map((item) => (
                  <div key={item.t} className="p-6 bg-white/50 rounded-2xl border border-white/80 hover:border-[var(--teal-light)] hover:shadow-md transition-all">
                    <h3 className="font-black text-[var(--teal-dark)] mb-2 uppercase text-sm tracking-widest">{item.t}</h3>
                    <p className="text-sm text-[var(--text-soft)] font-semibold">{item.d}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Sección 3: Información de desactivación con lista de navegadores generada mediante map() */}
            <section className="p-8 bg-[var(--teal-deeper)] text-white rounded-3xl shadow-lg group">
              <h2 className="text-2xl font-black mb-4 group-hover:text-[var(--teal-light)] transition-colors">3. Desactivación</h2>
              <p className="mb-6 opacity-90 font-medium">Puedes configurar tu navegador para bloquearlas, aunque algunas funciones de la web podrían dejar de brillar:</p>
              <div className="flex flex-wrap gap-4 text-xs font-black uppercase">
                {['Chrome', 'Firefox', 'Safari', 'Edge', 'Opera'].map(nav => (
                  <span key={nav} className="px-4 py-2 border border-white/20 rounded-full bg-white/10">{nav}</span>
                ))}
              </div>
            </section>
            
            {/* Pie del documento con la fecha de actualización */}
            <p className="text-sm text-[var(--muted)] italic text-right mt-10">Última actualización: 10/03/2026</p>
          </div>
        </div>
      </div>
    </main>
  );
}