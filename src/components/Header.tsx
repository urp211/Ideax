import { motion } from "motion/react";
import { AppMenu } from "./AppMenu";
import { Language } from "@/lib/translations";

interface HeaderProps {
  lang: Language;
  onSetLang: (l: Language) => void;
  theme: string;
  onSetTheme: (t: string) => void;
}

export function Header({ lang, onSetLang, theme, onSetTheme }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-8 py-4 bg-card border-b border-border shadow-sm fixed top-0 left-0 right-0 z-50">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center space-x-3 cursor-pointer"
        onClick={() => window.location.reload()}
      >
        <div className="px-3 h-10 bg-primary rounded-xl flex items-center justify-center">
          <span className="text-primary-foreground font-black text-lg tracking-tighter">IDEAX</span>
        </div>
        <div className="hidden sm:block">
          <h1 className="text-xl font-bold tracking-tight text-foreground">Ideax Pro</h1>
          <p className="text-[10px] text-primary font-semibold uppercase tracking-wider">Makina Company</p>
        </div>
      </motion.div>
      
      <div className="flex items-center gap-4">
        <select 
          value={lang} 
          onChange={(e) => onSetLang(e.target.value as Language)}
          className="text-xs font-bold uppercase tracking-widest text-muted-foreground bg-transparent border-none outline-none cursor-pointer hover:text-primary"
        >
          <option value="pt">PT</option>
          <option value="en">EN</option>
          <option value="es">ES</option>
          <option value="fr">FR</option>
        </select>
        
        <AppMenu lang={lang} currentTheme={theme} onThemeChange={onSetTheme} />
      </div>
    </header>
  );
}
