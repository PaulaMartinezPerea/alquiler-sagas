import ContactForm from "./ContactForm";
import LightRays from "../LightRays";

// Página principal de la sección de Contacto
export default function ContactoPage() {
  return (
    <main className="min-h-screen px-8 py-16 bg-[var(--cream)] text-[var(--text)] relative overflow-hidden">
      
      {/* Inyección de CSS en línea para definir la animación de aparición fluida (fade-up) */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeUpAnim {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up-smooth {
          animation: fadeUpAnim 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />

      {/* Capa de fondo animada (Rayos de luz) fijada en el fondo sin bloquear interacción */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-80">
        <LightRays
          raysColor="#6BBFCB"
          raysSpeed={0.8}     
          lightSpread={1.2}   
          distortion={0.15}    
          raysOrigin="top-center"
        />
      </div>

      {/* Contenedor principal del contenido en el plano frontal */}
      <div className="relative z-10">
        {/* Cabecera con título y subtítulo animados */}
        <header className="max-w-6xl mx-auto text-center mb-16 animate-fade-up-smooth">
          <span className="text-[var(--coral-dark)] font-black tracking-widest uppercase text-sm mb-3 block drop-shadow-sm">
            Atención al cliente
          </span>
          <h1 className="text-4xl md:text-5xl font-black mb-4 text-[var(--text)] pb-2 leading-normal drop-shadow-sm">
            Contacta con nosotros
          </h1>
        </header>
        
        {/* Envoltorio del formulario de contacto con un retraso en la animación (efecto cascada) */}
        <div className="animate-fade-up-smooth" style={{ animationDelay: "0.2s" }}>
          <ContactForm />
        </div>
      </div>
      
    </main>
  );
}