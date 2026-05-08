import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const LANGUAGES = ['PT', 'EN', 'ES'];

export default function KivoLanguageSwitcher() {
  const [langIndex, setLangIndex] = useState(0);

  const nextLang = () => {
    setLangIndex((prev) => (prev + 1) % LANGUAGES.length);
  };

  return (
    <button 
      onClick={nextLang}
      className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm font-medium overflow-hidden h-6 relative w-16"
      title="Mudar Idioma"
    >
      {/* @ts-ignore */}
      <iconify-icon icon="solar:global-bold"></iconify-icon>
      <AnimatePresence mode="popLayout">
        <motion.span
          key={langIndex}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="absolute left-6"
        >
          {LANGUAGES[langIndex]}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
