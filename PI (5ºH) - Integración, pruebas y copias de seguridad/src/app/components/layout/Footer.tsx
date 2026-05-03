import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      {/* Cabecera del footer */}
      <div>
        <strong>Alquiler Sagas</strong>
        <p>Plataforma online de alquiler de películas por franquicias.</p>
      </div>

      {/* Contenedor de las columnas */}
      <div>
        {/* Columna 1 */}
        <div>
          <h4>ALQUIER SAGAS</h4>
          <ul>
            <li><Link href="/">Quiénes somos</Link></li>
            <li><Link href="/catalogo">Catálogo</Link></li>
            <li><Link href="./components/contacto">Contacto</Link></li>
          </ul>
        </div>

        {/* Columna 2 */}
        <div>
          <h4>LEGAL</h4>
          <ul>
            <li><Link href="/">Política de cookies</Link></li>
            <li><Link href="/">Política de privacidad</Link></li>
            <li><Link href="/">Aviso legal</Link></li>
          </ul>
        </div>

        {/* Columna 3 */}
        <div>
          <h4>CONTACTO</h4>
          <p>martinezpereapaula@gmail.com</p>
          <p>Horario: L-V · 8:15-14:45</p>
        </div>

        {/* Caja Destacada Derecha */}
        <div>
          <h4>¿Hablamos?</h4>
          <p>Cuéntanos qué necesitas y te responderemos lo antes posible.</p>
          <button><Link href="/contacto">Solicitar información</Link></button>
        </div>
      </div>
    </footer>
  );
}