import Link from "next/link";

export default function Footer() {
  return (
    <footer className="astro-footer relative bg-gradient-to-r from-[var(--teal)]/15 via-[var(--surface)] to-[var(--coral)]/15">
      
      {/* Borde decorativo superior con gradiente dinámico */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[var(--teal)] to-[var(--coral)] opacity-90"></div>

      <div className="astro-footer__inner relative z-10">

        {/* Logo, nombre de la marca y breve eslogan */}
        <div className="astro-footer__header">
          <img
            src="/images/logo/logo_astrofilm.png"
            alt="Logo ASTROFILM"
            className="astro-footer__logo"
          />
          <span className="astro-footer__brand">ASTROFILM</span>
        </div>
        <p className="astro-footer__tagline">
          Plataforma online de alquiler de películas por franquicias.
        </p>

        {/* Línea divisoria tenue */}
        <hr className="astro-footer__divider opacity-50" />

        {/* Cuadrícula principal de contenido organizada en 4 columnas */}
        <div className="astro-footer__grid">

          {/* Columna 1: Enlaces de navegación principal */}
          <div>
            <h4 className="astro-footer__col-title">ASTROFILM</h4>
            <ul className="astro-footer__list">
              <li><Link href="/">Quiénes somos</Link></li>
              <li><Link href="/catalogo">Catálogo</Link></li>
              <li><Link href="/components/contacto">Contacto</Link></li>
            </ul>
          </div>

          {/* Columna 2: Enlaces a documentación legal */}
          <div>
            <h4 className="astro-footer__col-title">LEGAL</h4>
            <ul className="astro-footer__list">
              <li><Link href="/politica-cookies">Política de cookies</Link></li>
              <li><Link href="/politica-privacidad">Política de privacidad</Link></li>
              <li><Link href="/aviso-legal">Aviso legal</Link></li>
            </ul>
          </div>

          {/* Columna 3: Información directa de contacto y disponibilidad */}
          <div>
            <h4 className="astro-footer__col-title">CONTACTO</h4>
            <p className="astro-footer__contact-text">
              martinezpereapaula@gmail.com<br />
              Horario: L-V · 8:15-14:45
            </p>
          </div>

          {/* Columna 4: Caja de llamada a la acción (CTA) para atención al cliente */}
          <div>
            <h4 className="astro-footer__col-title">¿HABLAMOS?</h4>
            <div className="astro-footer__cta-box">
              <p>Cuéntanos qué necesitas y te responderemos lo antes posible.</p>
              <Link href="/components/contacto" className="astro-footer__cta-btn bg-[var(--coral)] hover:bg-[var(--coral-dark)] text-white transition-colors">
                Solicitar información
              </Link>
            </div>
          </div>

        </div>

        {/* Pie final con derechos de autor y año calculado automáticamente */}
        <div className="astro-footer__bottom">
          © {new Date().getFullYear()} ASTROFILM — Todos los derechos reservados
        </div>

      </div>
    </footer>
  );
}