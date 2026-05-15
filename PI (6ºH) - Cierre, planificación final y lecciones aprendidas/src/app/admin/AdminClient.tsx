"use client";

import { useState } from "react";
import Link from "next/link";
import LightRays from "../components/LightRays";

// Definición de tipos y propiedades 
type Usuario = { id: number; email: string; role: string };
interface AdminProps {
  initialUsers: Usuario[];
  totalSagas: number;
  totalAlquileres: number;
}

export default function AdminClient({ initialUsers, totalSagas, totalAlquileres }: AdminProps) {
  // Estados de la lista de usuarios, formulario, modo edición y feedback
  const [users, setUsers]               = useState<Usuario[]>(initialUsers);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [newEmail, setNewEmail]         = useState("");
  const [newPassword, setNewPassword]   = useState("");
  const [newRole, setNewRole]           = useState("CLIENT");
  const [loading, setLoading]           = useState(false);
  const [message, setMessage]           = useState("");

  // Función que procesa la creación y la actualización de usuarios
  const handleSubmitUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(editingUserId ? "Actualizando usuario..." : "Creando usuario...");
    try {
      // Determina el método HTTP y el cuerpo de la petición según si estamos editando o creando
      const method = editingUserId ? "PUT" : "POST";
      const body   = editingUserId
        ? { id: editingUserId, email: newEmail, password: newPassword, role: newRole }
        : { email: newEmail, password: newPassword, role: newRole };

      const res = await fetch("/api/admin/users", {
        method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
      });

      if (res.ok) {
        const savedUser = await res.json();
        // Actualiza el estado local para los cambios en la tabla sin recargar la página
        if (editingUserId) {
          setUsers(users.map(u => u.id === editingUserId ? savedUser : u));
          setMessage("¡Usuario actualizado con éxito!");
        } else {
          setUsers([savedUser, ...users]);
          setMessage("¡Usuario creado con éxito!");
        }
        cancelEdit();
      } else {
        setMessage("Error: No se pudo guardar (¿El email ya existe?).");
      }
    } catch {
      setMessage("Error de conexión.");
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  // Carga los datos de un usuario en el formulario para editarlo
  const startEdit = (user: Usuario) => {
    setEditingUserId(user.id); setNewEmail(user.email);
    setNewRole(user.role); setNewPassword(""); setMessage("");
  };

  // Limpia el formulario y cancela el modo de edición
  const cancelEdit = () => {
    setEditingUserId(null); setNewEmail(""); setNewRole("CLIENT");
    setNewPassword(""); setMessage("");
  };

  // Función para procesar la eliminación de un usuario 
  const handleDeleteUser = async (id: number, email: string) => {
    if (!window.confirm(`¿Estás seguro de que quieres eliminar a ${email}? Se borrarán también sus alquileres.`)) return;
    try {
      const res = await fetch("/api/admin/users", {
        method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }),
      });
      // Si la API responde OK, retira al usuario del estado local
      if (res.ok) setUsers(users.filter(u => u.id !== id));
      else alert("Hubo un error al intentar borrar el usuario.");
    } catch {
      alert("Error de conexión al borrar.");
    }
  };

  // ESTRUCTURA VISUAL DEL PANEL DE ADMINISTRACIÓN
  return (
    <main className="min-h-screen px-8 py-16 bg-[var(--cream)] text-[var(--text)] relative overflow-hidden">
      
      {/* Capa de fondo animado */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-85">
        <LightRays
          raysColor="#6BBFCB"
          raysSpeed={0.8}     
          lightSpread={1.2}   
          distortion={0.15}    
          raysOrigin="top-center"
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Cabecera: Títulos principales y enlace al catálogo */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-4 animate-fade-up">
          <div>
            <span className="text-[var(--coral-dark)] font-black tracking-widest uppercase text-sm mb-2 block drop-shadow-sm">
              Centro de Mando
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[var(--teal-deeper)] to-[var(--coral-dark)] pb-2 leading-normal drop-shadow-[0_4px_8px_rgba(0,0,0,0.15)]">
              Panel de Administración
            </h1>
          </div>
          <Link href="/catalogo"
            className="bg-[var(--surface)]/70 backdrop-blur-md border border-white/50 hover:border-[var(--teal)] text-[var(--teal-dark)] font-bold py-3 px-6 rounded-xl transition-all shadow-sm hover:shadow-md">
            Ir al catálogo →
          </Link>
        </div>

        {/* Sección de Métricas usando los datos del servidor */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-[var(--surface)]/70 backdrop-blur-md p-6 rounded-2xl border-l-4 border-[var(--teal)] shadow-lg border-y border-r border-white/50 flex flex-col justify-center">
            <p className="text-[var(--muted)] text-sm font-black uppercase tracking-widest mb-1">Total Usuarios</p>
            <p className="text-4xl font-black text-[var(--teal-dark)]">{users.length}</p>
          </div>
          <div className="bg-[var(--surface)]/70 backdrop-blur-md p-6 rounded-2xl border-l-4 border-[var(--coral)] shadow-lg border-y border-r border-white/50 flex flex-col justify-center">
            <p className="text-[var(--muted)] text-sm font-black uppercase tracking-widest mb-1">Sagas en Catálogo</p>
            <p className="text-4xl font-black text-[var(--coral)]">{totalSagas}</p>
          </div>
          <div className="bg-[var(--surface)]/70 backdrop-blur-md p-6 rounded-2xl border-l-4 border-[var(--teal-deeper)] shadow-lg border-y border-r border-white/50 flex flex-col justify-center">
            <p className="text-[var(--muted)] text-sm font-black uppercase tracking-widest mb-1">Alquileres Activos</p>
            <p className="text-4xl font-black text-[var(--teal-deeper)]">{totalAlquileres}</p>
          </div>
        </div>

        {/* Formulario a la izquierda, Tabla a la derecha */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Columna Izquierda: Formulario */}
          <div className={`lg:col-span-1 h-fit bg-[var(--surface)]/70 backdrop-blur-md rounded-3xl p-8 shadow-[0_15px_40px_rgba(46,122,136,0.1)] border-2 transition-colors duration-300 relative overflow-hidden ${editingUserId ? 'border-[var(--coral)]' : 'border-white/50'}`}>
            
            {/* Indicador visual de modo edición */}
            {editingUserId && <div className="absolute top-0 left-0 w-full h-1.5 bg-[var(--coral)]"></div>}

            <div className="flex justify-between items-center mb-6 pb-4 border-b border-[var(--border)]">
              <h2 className="font-black text-xl text-[var(--teal-dark)]">
                {editingUserId ? "Editar Usuario" : "Añadir Usuario"}
              </h2>
              {editingUserId && (
                <button onClick={cancelEdit} className="text-xs font-bold text-[var(--muted)] bg-white/80 px-3 py-1.5 rounded-lg border border-[var(--border)] hover:text-[var(--text)] transition-colors">
                  Cancelar
                </button>
              )}
            </div>

            <form onSubmit={handleSubmitUser} className="flex flex-col gap-5">
              <div>
                <label className="block text-[13px] font-bold text-[var(--muted)] mb-2 uppercase tracking-wide">Email *</label>
                <input type="email" required value={newEmail} onChange={e => setNewEmail(e.target.value)}
                  className="w-full bg-white border border-[var(--border)] text-[var(--text)] px-4 py-3 rounded-xl focus:outline-none focus:border-[var(--teal)] focus:ring-2 focus:ring-[var(--teal-light)] transition-all" placeholder="usuario@email.com" />
              </div>
              
              <div>
                <label className="block text-[13px] font-bold text-[var(--muted)] mb-2 uppercase tracking-wide">Contraseña</label>
                {/* La contraseña no es obligatoria si estamos editando */}
                <input type="password" required={!editingUserId} value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder={editingUserId ? "Dejar en blanco para mantener" : "Mínimo 6 caracteres..."}
                  className="w-full bg-white border border-[var(--border)] text-[var(--text)] px-4 py-3 rounded-xl focus:outline-none focus:border-[var(--teal)] focus:ring-2 focus:ring-[var(--teal-light)] transition-all" />
              </div>
              
              <div>
                <label className="block text-[13px] font-bold text-[var(--muted)] mb-2 uppercase tracking-wide">Rol de usuario</label>
                <select value={newRole} onChange={e => setNewRole(e.target.value)} className="w-full bg-white border border-[var(--border)] text-[var(--text)] px-4 py-3 rounded-xl focus:outline-none focus:border-[var(--teal)] font-bold cursor-pointer">
                  <option value="CLIENT">Cliente Normal</option>
                  <option value="ADMIN">Administrador</option>
                </select>
              </div>

              {/* Botón de enviar */}
              <button disabled={loading} type="submit"
                className={`mt-4 w-full text-white text-sm font-bold py-4 rounded-xl transition-all transform hover:-translate-y-1 shadow-md disabled:opacity-50 disabled:transform-none ${editingUserId ? 'bg-[var(--teal)] hover:bg-[var(--teal-dark)]' : 'bg-[var(--coral)] hover:bg-[var(--coral-dark)]'}`}>
                {loading ? "Procesando..." : (editingUserId ? "Actualizar Usuario" : "Crear Usuario")}
              </button>

              {/* Mensaje al enviar el formulario */}
              {message && (
                <p className={`text-sm font-bold text-center mt-2 p-3 rounded-lg ${message.includes("Error") ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
                  {message}
                </p>
              )}
            </form>
          </div>

          {/* Columna Derecha: Tabla */}
          <div className="lg:col-span-2 h-fit bg-[var(--surface)]/70 backdrop-blur-md rounded-3xl p-8 shadow-[0_15px_40px_rgba(46,122,136,0.1)] border border-white/50 overflow-x-auto">
            <h2 className="font-black text-xl mb-6 pb-4 border-b border-[var(--border)] text-[var(--teal-dark)]">
              Directorio de Usuarios
            </h2>

            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="bg-white/80 rounded-lg">
                  {['ID', 'Email', 'Rol', 'Acciones'].map((h, i) => (
                    <th key={h} className={`p-4 text-xs font-black uppercase tracking-widest text-[var(--muted)] border-b border-[var(--border)] ${i === 0 ? 'rounded-tl-lg' : ''} ${i === 3 ? 'rounded-tr-lg' : ''}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="border-b border-[var(--border)] hover:bg-white transition-colors group">
                    <td className="p-4 text-sm font-bold text-[var(--muted)]">#{user.id}</td>
                    <td className="p-4 font-bold text-sm text-[var(--text)]">
                      {user.email}
                    </td>
                    <td className="p-4">
                      {/* Diferencia entre ADMIN y CLIENT */}
                      <span className={`text-xs font-black px-3 py-1.5 rounded-md tracking-wider ${user.role === 'ADMIN' ? 'bg-[var(--teal-light)] text-[var(--teal-deeper)]' : 'bg-[var(--border)]/50 text-[var(--text-soft)]'}`}>
                        {user.role}
                      </span>
                    </td>
                    {/* Botones de acción */}
                    <td className="p-4 flex gap-4">
                      <button onClick={() => startEdit(user)} className="text-sm font-bold text-[var(--teal)] hover:text-[var(--teal-dark)] transition-colors">
                        Editar
                      </button>
                      <button onClick={() => handleDeleteUser(user.id, user.email)} className="text-sm font-bold text-red-400 hover:text-red-600 transition-colors">
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mensaje por si la tabla se queda sin registros */}
            {users.length === 0 && (
              <div className="text-center p-10 bg-white/80 rounded-2xl mt-4 border border-[var(--border)]">
                <p className="text-[var(--text-soft)] text-sm font-medium">
                  No hay usuarios registrados en el sistema.
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}