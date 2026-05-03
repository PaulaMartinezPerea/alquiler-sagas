import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 p-8">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-bold mb-6">Bienvenido a Alquiler Sagas</h1>
        <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-8">
          La plataforma para alquilar tus franquicias cinematográficas favoritas.
        </p>
        <Link 
          href="/catalogo" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md transition-colors text-lg"
        >
          Ver Catálogo
        </Link>
      </div>
    </main>
  );
}