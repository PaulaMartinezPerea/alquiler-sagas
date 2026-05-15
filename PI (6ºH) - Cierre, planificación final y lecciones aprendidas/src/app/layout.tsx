import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react"; 
import "./globals.css";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import AuthModal from "./components/auth/AuthModal"; 
import ClickSpark from "./components/ClickSpark"; 

// Configuración de las tipografías principales
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadatos de la web para el SEO y las pestañas del navegador
export const metadata: Metadata = {
  title: "ASTROFILM",
  description: "Plataforma de alquiler de películas",
};

// Layout principal: envuelve absolutamente todas las páginas
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      {/* Cuerpo del documento con las fuentes aplicadas y flexbox para empujar el footer hacia abajo */}
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}>
        
        {/* Barra de navegación superior */}
        <Navbar />
        
        {/* Contenedor dinámico donde se inyecta el contenido de cada página individual */}
        <div className="flex-grow">
          {children}
        </div>
        
        {/* Pie de página */}
        <Footer />

        {/* Modal flotante de inicio de sesión/registro */}
        <Suspense fallback={null}>
          <AuthModal />
        </Suspense>

        {/* Componente visual que lanza partículas al hacer clic en cualquier parte de la web */}
        <ClickSpark />

      </body>
    </html>
  );
}