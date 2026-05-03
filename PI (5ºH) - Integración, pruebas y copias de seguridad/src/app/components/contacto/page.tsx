import ContactForm from "./ContactForm";

export default function ContactoPage() {
  return (
    <main className="min-h-screen p-8 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold mb-4">Contacta con nosotros</h1>
      </header>
      
      {/* Insertamos el componente del formulario */}
      <ContactForm />
      
    </main>
  );
}