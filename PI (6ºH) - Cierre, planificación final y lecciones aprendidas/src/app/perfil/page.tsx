"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import LightRays from "../components/LightRays";

export default function PerfilPage() {
  // Estados para manejar la información del usuario, sus alquileres y feedback de la interfaz
  const [user, setUser]                   = useState<any>(null);
  const [sagasAlquiladas, setSagasAlquiladas] = useState<any[]>([]);
  const [loading, setLoading]             = useState(true);
  const [newPassword, setNewPassword]     = useState("");
  const [message, setMessage]             = useState("");

  // Efecto inicial: Comprueba si hay una sesión guardada. Si no la hay, expulsa al usuario al login.
  useEffect(() => {
    const session = localStorage.getItem("userSession");
    if (session) { fetchUserData(JSON.parse(session).email); }
    else         { window.location.href = "/login"; }
  }, []);

  // Función para pedirle al servidor todos los datos del usuario y sus alquileres
  const fetchUserData = async (email: string) => {
    try {
      const res = await fetch("/api/perfil", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        // Agrupamos las películas por Saga para no mostrar elementos duplicados
        const sagasMap = new Map();
        data.rentals.forEach((rental: any) => {
          const saga = rental.movie.saga;
          if (saga && !sagasMap.has(saga.id)) {
            sagasMap.set(saga.id, { id: saga.id, name: saga.name, expiresAt: new Date(rental.expiresAt), canceled: rental.canceled });
          }
        });
        setSagasAlquiladas(Array.from(sagasMap.values()));
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  // Función para actualizar la contraseña en la base de datos
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    // Alerta de seguridad antes de procesar el cambio
    if (!window.confirm("¿Estás completamente seguro de que deseas cambiar tu contraseña?")) return;
    setMessage("Actualizando...");
    try {
      const res = await fetch("/api/perfil", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, newPassword }),
      });
      setMessage(res.ok ? "¡Contraseña actualizada con éxito!" : "Error al actualizar la contraseña.");
      if (res.ok) setNewPassword("");
    } catch { setMessage("Error de conexión."); }
    // Borramos el mensaje a los 3 segundos
    setTimeout(() => setMessage(""), 3000);
  };

  // Función para cancelar una suscripción activa
  const handleCancelarAlquiler = async (sagaId: number, sagaName: string) => {
    if (!window.confirm(`¿Estás seguro de que quieres cancelar el alquiler de ${sagaName}?`)) return;
    try {
      const res = await fetch("/api/perfil/cancelar", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, sagaId }),
      });
      // Si todo va bien, recargamos los datos para que la vista se actualice sola
      if (res.ok) { fetchUserData(user.email); alert("Alquiler cancelado correctamente."); }
      else { const d = await res.json(); alert(`Error al cancelar: ${d.error}`); }
    } catch { alert("Error de conexión con el servidor."); }
  };

  // Clasificamos los alquileres en tres grupos comparándolos con la fecha de hoy
  const hoy = new Date();
  const alquileresCancelados = sagasAlquiladas.filter(s =>  s.canceled);
  const alquileresActivos    = sagasAlquiladas.filter(s => !s.canceled && s.expiresAt > hoy);
  const alquileresCaducados  = sagasAlquiladas.filter(s => !s.canceled && s.expiresAt <= hoy);

  return (
    <main className="min-h-screen px-8 py-16 bg-[var(--cream)] text-[var(--text)] relative overflow-hidden">
      
      {/* Fondo animado de rayos de luz */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-85">
        <LightRays
          raysColor="#6BBFCB" 
          raysSpeed={0.8}    
          lightSpread={1.2}   
          distortion={0.15}  
          raysOrigin="top-center"
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">

        <h1 className="text-4xl md:text-5xl font-black mb-10 text-transparent bg-clip-text bg-gradient-to-r from-[var(--teal-deeper)] to-[var(--coral-dark)] pb-2 animate-fade-up drop-shadow-[0_4px_8px_rgba(0,0,0,0.15)]">
          Mi Espacio
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* COLUMNA IZQUIERDA: Formulario de actualización de datos */}
          <div className="lg:col-span-1 h-fit bg-[var(--surface)]/70 backdrop-blur-md rounded-3xl p-8 shadow-[0_15px_40px_rgba(46,122,136,0.1)] border border-white/50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[var(--teal)] to-[var(--coral)]"></div>
            
            <h2 className="font-black text-xl mb-6 pb-4 border-b border-[var(--border)] text-[var(--teal-dark)]">
              Mis Datos
            </h2>

            <form onSubmit={handleUpdatePassword} className="flex flex-col gap-5">
              <div>
                <label className="block text-[13px] font-bold text-[var(--muted)] mb-2 uppercase tracking-wide">Correo Electrónico</label>
                <input type="email" disabled value={user?.email || ""} className="w-full bg-white border border-[var(--border)] text-[var(--muted)] px-4 py-3 rounded-xl opacity-70 cursor-not-allowed font-medium" />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-[var(--muted)] mb-2 uppercase tracking-wide">Nueva Contraseña</label>
                <input type="password" required value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Escribe para cambiarla"
                  className="w-full bg-white border border-[var(--border)] text-[var(--text)] px-4 py-3 rounded-xl focus:outline-none focus:border-[var(--teal)] focus:ring-2 focus:ring-[var(--teal-light)] transition-all" />
              </div>
              <button type="submit" className="mt-2 bg-[var(--teal)] hover:bg-[var(--teal-dark)] text-white text-sm font-bold py-3.5 rounded-xl transition-all transform hover:-translate-y-1 shadow-md w-full">
                Actualizar Contraseña
              </button>
              {/* Feedback visual de éxito o error */}
              {message && (
                <p className={`text-sm font-bold text-center mt-2 p-3 rounded-lg ${message.includes("Error") ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
                  {message}
                </p>
              )}
            </form>
          </div>

          {/* COLUMNA DERECHA: Listado de Alquileres */}
          <div className="lg:col-span-2 space-y-8">

            {/* Subsección: Alquileres Activos */}
            <div className="bg-[var(--surface)]/70 backdrop-blur-md rounded-3xl p-8 shadow-[0_15px_40px_rgba(46,122,136,0.1)] border border-white/50">
              <h2 className="font-black text-2xl mb-6 pb-4 border-b border-[var(--border)] text-[var(--teal-dark)] flex items-center justify-between">
                Alquileres Activos
                <span className="bg-[var(--teal-light)] text-[var(--teal-deeper)] text-sm px-3 py-1 rounded-full font-bold">{alquileresActivos.length}</span>
              </h2>
              
              {alquileresActivos.length === 0 ? (
                <div className="text-center py-10 bg-white/60 rounded-2xl border border-[var(--border)]">
                  <p className="text-[var(--text-soft)] text-lg">No tienes ningún alquiler activo ahora mismo.</p>
                  <Link href="/catalogo" className="text-[var(--coral)] font-bold hover:underline mt-2 inline-block">¡Explora el catálogo!</Link>
                </div>
              ) : (
                <div className="grid gap-4">
                  {alquileresActivos.map(saga => {
                    // Cálculo matemático de los días que faltan para que caduque
                    const dias = Math.ceil((saga.expiresAt.getTime() - hoy.getTime()) / (1000 * 3600 * 24));
                    return (
                      <div key={saga.id} className="flex flex-col sm:flex-row justify-between items-center p-6 bg-white/60 border-2 border-[var(--teal-light)]/50 hover:border-[var(--teal)] rounded-2xl transition-all shadow-sm group">
                        
                        <div className="text-center sm:text-left mb-4 sm:mb-0">
                          <h3 className="font-black text-xl text-[var(--text)] group-hover:text-[var(--teal-dark)] transition-colors">{saga.name}</h3>
                          <Link href={`/catalogo/${saga.id}`} className="text-sm font-bold text-[var(--teal)] hover:text-[var(--coral)] transition-colors mt-1 inline-flex items-center gap-1">
                            Ver películas <span className="text-lg leading-none">→</span>
                          </Link>
                        </div>
                        
                        <div className="flex flex-col items-center sm:items-end bg-white/80 sm:bg-transparent p-4 sm:p-0 rounded-xl sm:rounded-none w-full sm:w-auto shadow-sm sm:shadow-none">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-4xl font-black text-[var(--coral)]">{dias}</span>
                            <span className="text-xs font-black text-[var(--muted)] uppercase tracking-widest">días restantes</span>
                          </div>
                          <button onClick={() => handleCancelarAlquiler(saga.id, saga.name)} className="text-xs font-bold text-red-400 hover:text-red-600 hover:underline mt-2 transition-colors">
                            Cancelar alquiler
                          </button>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Subsección: Alquileres Cancelados (Solo se muestra si hay alguno) */}
            {alquileresCancelados.length > 0 && (
              <div className="bg-[var(--surface)]/70 backdrop-blur-md rounded-3xl p-8 shadow-sm border border-white/50">
                <h2 className="font-black text-xl mb-6 pb-4 border-b border-[var(--border)] text-red-500">
                  Cancelados ({alquileresCancelados.length})
                </h2>
                <div className="grid gap-3">
                  {alquileresCancelados.map(saga => (
                    <div key={saga.id} className="flex justify-between items-center p-4 rounded-xl bg-red-50/90 border border-red-100">
                      <h3 className="font-bold line-through text-red-400/70">{saga.name}</h3>
                      <span className="text-xs font-black uppercase tracking-widest text-red-500 bg-red-100 px-3 py-1 rounded-md">Cancelado</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Subsección: Alquileres Pasados (Historial) */}
            <div className="bg-[var(--surface)]/70 backdrop-blur-md rounded-3xl p-8 shadow-sm border border-white/50 opacity-90">
              <h2 className="font-black text-xl mb-6 pb-4 border-b border-[var(--border)] text-[var(--muted)]">
                Historial Pasado ({alquileresCaducados.length})
              </h2>
              {alquileresCaducados.length === 0 ? (
                <p className="text-[var(--text-soft)] italic">No tienes alquileres finalizados.</p>
              ) : (
                <div className="grid gap-3">
                  {alquileresCaducados.map(saga => (
                    <div key={saga.id} className="flex justify-between items-center p-4 rounded-xl bg-white/60 border border-[var(--border)] grayscale hover:grayscale-0 transition-all">
                      <h3 className="font-bold text-[var(--text-soft)]">{saga.name}</h3>
                      <span className="text-xs font-black uppercase tracking-widest text-[var(--muted)] bg-[var(--border)] px-3 py-1 rounded-md">Finalizado</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}