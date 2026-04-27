import { prisma } from "@/src/lib/prisma";

export default async function Home() {
  // Conexión real a la base de datos: Obtenemos las sagas y sus películas
  const sagas = await prisma.sagas.findMany({
    include: { movies: true }
  });

  return (
    // Título y descripción de la plataforma
    <main className="min-h-screen p-8 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
      <header className="mb-10 text-center relative">
        <div className="absolute right-0 top-0">
          <a href="/register" className="bg-zinc-800 dark:bg-white text-white dark:text-black px-4 py-2 rounded-md font-medium text-sm hover:opacity-80 transition-opacity">
            Registrarse
          </a>
        </div>
        <h1 className="text-4xl font-bold mb-4">Plataforma de Alquiler de Sagas</h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          Prototipo Funcional - Catálogo Conectado a MySQL
        </p>
      </header>

      {/* Catálogo de sagas: Si no hay sagas, mostramos un mensaje de base de datos conectada pero sin datos */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sagas.length === 0 ? (
          <div className="col-span-full p-8 text-center bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-700">
            <h2 className="text-2xl font-semibold mb-2">Base de datos conectada!</h2>
            <p className="text-zinc-500">
              La conexión funciona perfectamente, pero aún no hay sagas registradas en el sistema.
            </p>
          </div>
        ) : (
          /* Renderizamos cada saga con su nombre, descripción y lista de películas */
          sagas.map((saga) => (
            <div key={saga.id} className="p-6 bg-white dark:bg-zinc-800 rounded-xl shadow-md border border-zinc-200 dark:border-zinc-700">
              <h2 className="text-2xl font-bold mb-2">{saga.name}</h2>
              <p className="text-sm mb-4">{saga.description || "Sin descripción"}</p>
              <h3 className="font-semibold text-zinc-700 dark:text-zinc-300">Películas ({saga.movies.length}):</h3>
              <ul className="list-disc pl-5 mt-2">
                {saga.movies.map(movie => (
                  <li key={movie.id} className="text-sm">{movie.title} ({movie.releaseYear})</li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </main>
  );
}