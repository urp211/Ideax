import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { BusinessForm } from "@/components/BusinessForm";
import { IdeaResult } from "@/components/IdeaResult";
import { LoadingState } from "@/components/LoadingState";
import { generateBusinessIdeas, BusinessIdea, UserContext } from "@/services/geminiService";
import { motion, AnimatePresence } from "motion/react";
import { AlertCircle, RefreshCw, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Language, translations } from "@/lib/translations";

export default function App() {
  const [lang, setLang] = useState<Language>("pt");
  const [theme, setTheme] = useState<string>(() => localStorage.getItem("ideax_theme") || "default");
  const [loading, setLoading] = useState(false);
  const [ideas, setIdeas] = useState<BusinessIdea[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [remaining, setRemaining] = useState(10);

  useEffect(() => {
    localStorage.setItem("ideax_theme", theme);
  }, [theme]);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const storedDate = localStorage.getItem("ideax_date");
    const storedCount = localStorage.getItem("ideax_count");

    if (storedDate !== today) {
      localStorage.setItem("ideax_date", today);
      localStorage.setItem("ideax_count", "10");
      setRemaining(10);
    } else {
      setRemaining(parseInt(storedCount || "10"));
    }
  }, []);

  const t = translations[lang];

  const handleGenerate = async (context: UserContext) => {
    if (remaining <= 0) return;
    
    setLoading(true);
    setError(null);
    setIdeas(null);
    try {
      const generatedIdeas = await generateBusinessIdeas(context);
      setIdeas(generatedIdeas);
      const newRemaining = remaining - 1;
      setRemaining(newRemaining);
      localStorage.setItem("ideax_count", newRemaining.toString());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocorreu um erro inesperado.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setIdeas(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={`min-h-screen bg-brand-bg text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900 transition-colors duration-300 ${theme === 'default' ? '' : theme}`}>
      <Header lang={lang} onSetLang={setLang} theme={theme} onSetTheme={setTheme} />

      <main className="container mx-auto px-4 pt-40 pb-24 max-w-6xl">
        <AnimatePresence mode="wait">
          {!ideas && !loading && !error && (
            <motion.div
              key="form"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
            >
              <BusinessForm 
                onSubmit={handleGenerate} 
                isLoading={loading} 
                lang={lang} 
                remaining={remaining}
              />
              
              <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center max-w-4xl mx-auto">
                <div className="space-y-3 p-4">
                  <div className="w-10 h-10 bg-white shadow-sm border border-slate-200 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Smartphone className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h4 className="font-bold text-[10px] uppercase tracking-widest text-slate-400">Prático</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">Gerencie tudo pelo seu smartphone sem complicações.</p>
                </div>
                <div className="space-y-3 p-4">
                  <div className="w-10 h-10 bg-white shadow-sm border border-slate-200 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h4 className="font-bold text-[10px] uppercase tracking-widest text-slate-400">Realista</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">Oportunidades mapeadas para o seu contexto e orçamento.</p>
                </div>
                <div className="space-y-3 p-4">
                  <div className="w-10 h-10 bg-white shadow-sm border border-slate-200 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <RefreshCw className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h4 className="font-bold text-[10px] uppercase tracking-widest text-slate-400">Escalável</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">Cresça através do WhatsApp, Instagram e Google Maps.</p>
                </div>
              </div>
            </motion.div>
          )}

          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
               <div className="text-center py-12">
                  <div className="inline-block w-8 h-8 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin mb-4" />
                  <p className="text-indigo-900 font-bold tracking-tight uppercase">Analizando Oportunidades...</p>
                  <p className="text-slate-500 text-sm">Nossa IA está cruzando dados de mercado com seu contexto.</p>
               </div>
               <LoadingState />
            </motion.div>
          )}

          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-slate-200 p-12 rounded-2xl shadow-xl text-center max-w-lg mx-auto"
            >
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">{t.buttons.retry}</h3>
              <p className="text-slate-500 mb-8">{error}</p>
              <Button onClick={() => setError(null)} className="rounded-lg bg-indigo-600 hover:bg-indigo-700 px-8">
                {t.buttons.retry}
              </Button>
            </motion.div>
          )}

          {ideas && !loading && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              <div className="flex justify-start mb-4">
                 <button 
                  onClick={reset} 
                  className="text-xs font-bold text-slate-500 hover:text-indigo-600 uppercase tracking-widest flex items-center gap-2 transition-colors"
                 >
                   <RefreshCw className="w-3 h-3" /> {t.buttons.refine}
                 </button>
              </div>
              <IdeaResult ideas={ideas} lang={lang} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="px-8 py-8 bg-white border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 mt-24">
        <div className="flex items-center space-x-2 text-[10px] font-medium text-slate-400 uppercase tracking-widest">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span>{t.status}</span>
        </div>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          &copy; 2026 Makina Company • Inteligência de Negócios
        </p>
      </footer>
    </div>
  );
}
