"use client";

import { motion } from "framer-motion";

export default function HeroGraphic() {
  return (
    <div className="flex-1 w-full relative flex items-center justify-center">
      {/* Aura expansiva coral y crema */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] max-w-lg max-h-lg bg-gradient-to-tr from-[var(--coral-light)] via-[var(--cream)] to-transparent opacity-50 rounded-full blur-[60px]"></div>
      
      {/* Centro luminoso teal */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-[var(--teal-light)] opacity-40 rounded-full blur-[50px] animate-pulse-slow"></div>

      {/* Contenedor animado al hacer Scroll */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotate: -8, y: 50 }}
        whileInView={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 1.2, type: "spring", bounce: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Imagen con animación infinita de flotación */}
        <motion.img 
          animate={{ y: [-15, 15, -15] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          src="/images/logo/logo_sin_cohete.png" 
          alt="Presentación ASTROFILM" 
          className="w-full h-auto object-contain" 
          style={{ filter: 'drop-shadow(0px 15px 35px rgba(74, 155, 170, 0.4))' }}
        /> 
      </motion.div>
    </div>
  );
}