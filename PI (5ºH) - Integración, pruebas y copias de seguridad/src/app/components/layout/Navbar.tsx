import Link from "next/link";

export default function Navbar() {
  return (
    <nav>
      {/* Logo */}
      <div>
        <strong>Alquiler Sagas</strong>
      </div>

      {/* Enlaces de navegación */}
      <ul>
        <li>
          <Link href="/">INICIO</Link>
        </li>
        <li>
          <Link href="/catalogo">CATÁLOGO</Link>
        </li>
        <li>
          <Link href="./components/contacto">CONTACTO</Link>
        </li>
        <li>
          <Link href="/register">REGISTRO</Link>
        </li>
      </ul>
    </nav>
  );
}