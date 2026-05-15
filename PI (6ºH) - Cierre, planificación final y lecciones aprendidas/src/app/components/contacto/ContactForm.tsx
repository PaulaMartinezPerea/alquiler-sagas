"use client";

import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { FaPhoneAlt, FaEnvelope, FaGlobe, FaMapMarkerAlt, FaHeadset } from "react-icons/fa";

// Definición del tipo de datos para el formulario
type FormState = { nombre: string; email: string; telefono: string; asunto: string; mensaje: string; };

export default function ContactForm() {
  // Estados para manejar los datos del usuario y el estado del envío (cargando, éxito o error)
  const [form, setForm] = useState<FormState>({ nombre: '', email: '', telefono: '', asunto: '', mensaje: '' });
  const [status, setStatus] = useState<{ loading: boolean; ok: boolean | null; msg: string }>({ loading: false, ok: null, msg: '' });

  // Función dinámica para actualizar el estado cuando el usuario escribe en cualquier campo
  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.currentTarget;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Función principal que procesa el envío del formulario
  const handleButtonClick = async (e: FormEvent) => {
    e.preventDefault();
    setStatus({ loading: false, ok: null, msg: '' });

    // Validación básica: comprueba que no falten datos y que el teléfono tenga al menos 9 números
    const telefonoNumerico = form.telefono.replace(/\D/g, '');
    const isFormComplete = form.nombre.trim() !== '' && form.email.trim() !== '' && form.mensaje.trim() !== '' && telefonoNumerico.length >= 9;

    if (!isFormComplete) {
      setStatus({ loading: false, ok: false, msg: 'Por favor, rellena todos los campos obligatorios (*).' });
      return;
    }

    setStatus({ loading: true, ok: null, msg: '' });

    try {
      // Envío de la petición POST a la API
      const res = await fetch('/api/contacto', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      // Manejo de errores del servidor
      if (!res.ok || !data.ok) {
        setStatus({ loading: false, ok: false, msg: data.message || 'Error al enviar.' });
        return;
      }
      // Mostramos mensaje y limpiamos el formulario
      setStatus({ loading: false, ok: true, msg: '¡Mensaje enviado correctamente! 🚀' });
      setForm({ nombre: '', email: '', telefono: '', asunto: '', mensaje: '' });
    } catch (error) {
      setStatus({ loading: false, ok: false, msg: 'Error de conexión. Inténtalo más tarde.' });
    }
  };

  // ESTRUCTURA VISUAL DEL COMPONENTE
  return (
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row bg-[var(--surface)]/85 backdrop-blur-md rounded-3xl overflow-hidden shadow-[0_15px_40px_rgba(46,122,136,0.1)] border border-[var(--border)] relative z-10">
      
      {/* Inyección de CSS para las animaciones del panel de información (fondo dinámico e icono flotante) */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes vividGradient {
          0% { background-position: 0% 50%; }    
          35% { background-position: 15% 50%; }  
          50% { background-position: 100% 50%; } 
          65% { background-position: 15% 50%; }  
          100% { background-position: 0% 50%; }  
        }
        .info-animated-bg {
          background: linear-gradient(90deg, var(--teal-deeper) 0%, var(--teal-dark) 30%, var(--coral) 70%, var(--coral-dark) 100%);
          background-size: 300% 100%;
          animation: vividGradient 30s ease infinite; 
          opacity: 0.95; /* Le damos una opacidad súper suave al panel derecho para que dejen pasar los rayos */
        }
        @keyframes floatUpDown {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
          100% { transform: translateY(0px); }
        }
        .floating-icon {
          animation: floatUpDown 6s ease-in-out infinite;
        }
      `}} />

      {/* COLUMNA IZQUIERDA: Formulario de contacto interactivo */}
      <div className="flex-[1.2] p-8 md:p-14 flex flex-col justify-center bg-transparent">
        <h2 className="text-2xl md:text-3xl font-black text-[var(--teal-dark)] mb-8">Envíanos un mensaje</h2>
        
        <form className="flex flex-col gap-5">
          {/* Campo: Nombre */}
          <div>
            <label className="block text-[13px] font-bold text-[var(--muted)] mb-2 uppercase tracking-wide">Nombre Completo *</label>
            <input className="w-full bg-[var(--cream)]/80 border border-[var(--border)] rounded-lg p-4 text-[var(--text)] focus:outline-none focus:border-[var(--teal)] focus:ring-2 focus:ring-[var(--teal-light)] transition-all" name="nombre" value={form.nombre} onChange={onChange} required />
          </div>

          {/* Campos agrupados: Email y Teléfono */}
          <div className="flex flex-col sm:flex-row gap-5">
            <div className="flex-1">
              <label className="block text-[13px] font-bold text-[var(--muted)] mb-2 uppercase tracking-wide">E-MAIL *</label>
              <input className="w-full bg-[var(--cream)]/80 border border-[var(--border)] rounded-lg p-4 text-[var(--text)] focus:outline-none focus:border-[var(--teal)] focus:ring-2 focus:ring-[var(--teal-light)] transition-all" type="email" name="email" value={form.email} onChange={onChange} required />
            </div>
            <div className="flex-1">
              <label className="block text-[13px] font-bold text-[var(--muted)] mb-2 uppercase tracking-wide">Teléfono *</label>
              <input className="w-full bg-[var(--cream)]/80 border border-[var(--border)] rounded-lg p-4 text-[var(--text)] focus:outline-none focus:border-[var(--teal)] focus:ring-2 focus:ring-[var(--teal-light)] transition-all" type="tel" name="telefono" value={form.telefono} onChange={onChange} required />
            </div>
          </div>

          {/* Campo: Asunto */}
          <div>
            <label className="block text-[13px] font-bold text-[var(--muted)] mb-2 uppercase tracking-wide">Asunto</label>
            <input className="w-full bg-[var(--cream)]/80 border border-[var(--border)] rounded-lg p-4 text-[var(--text)] focus:outline-none focus:border-[var(--teal)] focus:ring-2 focus:ring-[var(--teal-light)] transition-all" name="asunto" value={form.asunto} onChange={onChange} placeholder="Consulta sobre alquileres..." />
          </div>

          {/* Campo: Mensaje */}
          <div>
            <label className="block text-[13px] font-bold text-[var(--muted)] mb-2 uppercase tracking-wide">Mensaje *</label>
            <textarea className="w-full bg-[var(--cream)]/80 border border-[var(--border)] rounded-lg p-4 text-[var(--text)] focus:outline-none focus:border-[var(--teal)] focus:ring-2 focus:ring-[var(--teal-light)] transition-all min-h-[140px] resize-y" name="mensaje" value={form.mensaje} onChange={onChange} required placeholder="¿En qué podemos ayudarte hoy?" />
          </div>

          {/* Botón de Enviar */}
          <button
            className="mt-6 bg-[var(--coral)] hover:bg-[var(--coral-dark)] text-white text-base font-bold py-4 rounded-xl shadow-[0_4px_15px_rgba(232,115,90,0.3)] transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:transform-none" 
            onClick={handleButtonClick} 
            disabled={status.loading}
          >
            {status.loading ? 'ENVIANDO...' : 'ENVIAR MENSAJE'}
          </button>

          {/* Mensaje de feedback dinámico */}
          {status.msg && (
            <div className={`p-4 rounded-xl mt-4 text-sm font-bold text-center border ${status.ok ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
              {status.msg}
            </div>
          )}
        </form>
      </div>

      {/* COLUMNA DERECHA: Panel informativo con fondo animado */}
      <div className="flex-[0.8] info-animated-bg p-8 md:p-14 text-white flex flex-col justify-center items-center text-center relative overflow-hidden backdrop-blur-md">
        
        <div className="relative z-10 w-full flex flex-col items-center gap-8">
          
          <div className="text-6xl floating-icon drop-shadow-md">
             <FaHeadset />
          </div>
          
          <div className="text-3xl md:text-4xl font-black tracking-tight leading-none drop-shadow-sm">
            608 65 44 30
          </div>
          
          {/* Vías de Contacto Digital */}
          <div className="w-full pt-6 border-t border-white/20">
            <span className="block text-xs uppercase tracking-widest font-black text-white/80 mb-4">Ubicación</span>
            <a href="https://www.google.com/maps/place/Av.+de+Alberto+Alcocer,+10,+1%C2%B0+-+F,+Chamart%C3%ADn,+28036+Madrid/@40.4586492,-3.6896431,17z/data=!3m1!4b1!4m6!3m5!1s0xd42291eafdbe5e7:0xe9ebd66e07649acd!8m2!3d40.4586451!4d-3.6870682!16s%2Fg%2F11khtjm7y_?entry=ttu&g_ep=EgoyMDI2MDMwOC4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 hover:scale-105 transition-transform group text-white/90 hover:text-white">
               <FaMapMarkerAlt className="text-xl" />
               <span className="text-base text-left leading-snug">Calle del Cine, 31<br/>41001 Sevilla</span>
            </a>
          </div>

          {/* Vías de Contacto Digital */}
          <div className="w-full pt-6 border-t border-white/20">
            <span className="block text-xs uppercase tracking-widest font-black text-white/80 mb-4">Contacto Directo</span>
            
            <div className="flex flex-col gap-4">
              <a href="tel:+34608654430" className="flex items-center justify-center gap-3 hover:scale-105 transition-transform group text-white/90 hover:text-white">
                <FaPhoneAlt className="text-lg" />
                <span className="text-base font-medium">+34 608 65 44 30</span>
              </a>
              
              <a href="mailto:martinezpereapaula@gmail.com" className="flex items-center justify-center gap-3 hover:scale-105 transition-transform group text-white/90 hover:text-white">
                <FaEnvelope className="text-lg" />
                <span className="text-base font-medium">martinezpereapaula@gmail.com</span>
              </a>
              
              <a href="https://www.alquilersagas.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 hover:scale-105 transition-transform group text-white/90 hover:text-white">
                <FaGlobe className="text-lg" />
                <span className="text-base font-medium">www.alquilersagas.com</span>
              </a>
            </div>
          </div>

        </div>
      </div>
      
    </div>
  );
}