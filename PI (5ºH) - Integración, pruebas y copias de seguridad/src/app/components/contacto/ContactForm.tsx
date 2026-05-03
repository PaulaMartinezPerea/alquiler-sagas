'use client'

import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import styles from './contact.module.css'
import { FaPhoneAlt, FaEnvelope, FaGlobe, FaMapMarkerAlt, FaFilm } from "react-icons/fa";

// El formulario tendrá estos 5 campos y todos serán de texto
type FormState = {
  nombre: string
  email: string
  telefono: string
  asunto: string
  mensaje: string
}

export default function ContactForm() {
  // ESTADO DEL FORMULARIO
  const [form, setForm] = useState<FormState>({ 
    nombre: '', email: '', telefono: '', asunto: '', mensaje: '' 
  })
  
  // ESTADO DEL ENVÍO
  const [status, setStatus] = useState<{ loading: boolean; ok: boolean | null; msg: string }>({ 
    loading: false, ok: null, msg: '' 
  })

  // FUNCIÓN PARA LEER TECLADO
  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.currentTarget
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  // FUNCIÓN PRINCIPAL DE ENVÍO
  const handleButtonClick = async (e: FormEvent) => {
    e.preventDefault();
    setStatus({ loading: false, ok: null, msg: '' });

    // VALIDACIÓN
    const telefonoNumerico = form.telefono.replace(/\D/g, '');
    const isFormComplete = 
      form.nombre.trim() !== '' &&
      form.email.trim() !== '' &&
      form.mensaje.trim() !== '' &&
      telefonoNumerico.length >= 9;

    // Si falta algo, bloqueamos el envío y mostramos un mensaje de error rojo
    if (!isFormComplete) {
      setStatus({ loading: false, ok: false, msg: 'Por favor, rellena todos los campos obligatorios.' });
      return;
    }

    setStatus({ loading: true, ok: null, msg: '' });

    try {
      // LLAMADA AL BACKEND: Enviamos nuestros datos a la API
      const res = await fetch('/api/contacto', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      // Si el servidor nos dice que algo fue mal
      if (!res.ok || !data.ok) {
        setStatus({ loading: false, ok: false, msg: data.message || 'Error al enviar.' })
        return
      }

      // Si el servidor nos dice que todo fue perfecto
      setStatus({ loading: false, ok: true, msg: '¡Mensaje enviado correctamente!' })
      // Vaciamos los campos del formulario para que quede limpio de nuevo
      setForm({ nombre: '', email: '', telefono: '', asunto: '', mensaje: '' })

    } catch (error) {
      setStatus({ loading: false, ok: false, msg: 'Error de conexión. Inténtalo más tarde.' })
    }
  }

  // RENDERIZADO VISUAL (Formulario)
  return (
    <div className={styles.container}>
      
      {/* SECCIÓN IZQUIERDA: Formulario */}
      <div className={styles.formSide}>
        <form>
          <label className={styles.label}>Nombre Completo *</label>
          <input className={styles.input} name="nombre" value={form.nombre} onChange={onChange} required />

          <label className={styles.label}>E-MAIL *</label>
          <input className={styles.input} type="email" name="email" value={form.email} onChange={onChange} required />

          <label className={styles.label}>Teléfono *</label>
          <input className={styles.input} type="tel" name="telefono" value={form.telefono} onChange={onChange} required />

          <label className={styles.label}>Asunto</label>
          <input className={styles.input} name="asunto" value={form.asunto} onChange={onChange} placeholder="Consulta sobre alquileres" />

          <label className={styles.label}>Mensaje *</label>
          <textarea className={styles.textarea} name="mensaje" value={form.mensaje} onChange={onChange} required placeholder="¿En qué podemos ayudarte?" />

          <button className={styles.button} onClick={handleButtonClick} disabled={status.loading}>
            {status.loading ? 'Enviando...' : 'ENVIAR MENSAJE'}
          </button>

          {status.msg && (
            <div style={{ color: status.ok ? 'green' : 'red', marginTop: '1rem' }}>
              {status.msg}
            </div>
          )}
        </form>
      </div>

      {/* SECCIÓN DERECHA: Información de Alquiler Sagas */}
      <div className={styles.infoSide}>
        <div>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
             <FaFilm />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>608 65 44 30</div>
          
          <div className={styles.infoSection}>
            <span className={styles.infoLabel}>UBICACIÓN</span>
            <div className={styles.contactLink}>
               <span className={styles.infoIconSmall}><FaMapMarkerAlt /></span>
               <span>Calle del Cine, 31<br/>41001 Sevilla</span>
            </div>
          </div>

          <div className={styles.infoSection}>
            <span className={styles.infoLabel}>CONTACTO</span>
            
            <a href="tel:+34900123456" className={styles.contactLink}>
              <span className={styles.infoIconSmall}><FaPhoneAlt /></span>
              <span>+34 608 65 44 30 (Atención al cliente)</span>
            </a>
            
            <a href="mailto:info@alquilersagas.com" className={styles.contactLink}>
              <span className={styles.infoIconSmall}><FaEnvelope /></span>
              <span>martinezpereapaula@gmail.com</span>
            </a>
            
            <a href="https://www.alquilersagas.com" target="_blank" rel="noopener noreferrer" className={styles.contactLink}>
              <span className={styles.infoIconSmall}><FaGlobe /></span>
              <span>www.alquilersagas.com</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}