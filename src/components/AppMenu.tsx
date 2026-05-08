import * as React from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Info, Settings, Zap, Moon, Sun, User, Github, Check } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

import { Language, translations } from "@/lib/translations";

interface AppMenuProps {
  lang: Language;
  currentTheme: string;
  onThemeChange: (t: string) => void;
}

export function AppMenu({ lang, currentTheme, onThemeChange }: AppMenuProps) {
  const t = translations[lang];
  const version = "1.5.0";

  const themes = [
    { id: "default", name: "Sleek (Default)", colors: "bg-indigo-600", secondary: "bg-slate-50" },
    { id: "theme-olive", name: "Modern Olive", colors: "bg-[#5A5A40]", secondary: "bg-[#f5f5f0]" },
    { id: "theme-midnight", name: "Midnight Pro", colors: "bg-[#1e1b4b]", secondary: "bg-[#0f172a]" },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:order-2">
          <Menu className="w-6 h-6 text-slate-600" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-white border-l border-slate-200">
        <SheetHeader className="text-left">
          <SheetTitle className="font-bold text-2xl tracking-tight text-slate-800">Menu</SheetTitle>
          <SheetDescription className="text-slate-500">
            {t.subtitle}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-8 space-y-8">
          {/* Plano Section */}
          <section className="space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{t.plano.title}</h4>
            <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-indigo-600">{t.plano.actual}</span>
                <span className="px-2 py-1 bg-indigo-600 text-[8px] font-black text-white rounded-md uppercase tracking-tighter">ATIVO</span>
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">{t.plano.proText}</p>
              <ul className="space-y-2">
                {t.plano.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                    <Check className="w-3 h-3 text-indigo-500" /> {feature}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <Separator className="opacity-50" />

          {/* Settings Section */}
          <section className="space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Personalização</h4>
            <div className="grid grid-cols-1 gap-3 px-1">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => onThemeChange(theme.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left group ${
                    currentTheme === theme.id 
                      ? "border-indigo-600 ring-2 ring-indigo-100 bg-indigo-50/10" 
                      : "border-slate-100 hover:border-slate-300"
                  }`}
                >
                  <div className="flex -space-x-2 shrink-0">
                    <div className={`w-8 h-8 rounded-full border-2 border-white ${theme.colors}`} />
                    <div className={`w-8 h-8 rounded-full border-2 border-white ${theme.secondary}`} />
                  </div>
                  <div className="flex-1">
                    <p className={`text-xs font-bold ${currentTheme === theme.id ? "text-indigo-600" : "text-slate-700"}`}>
                      {theme.name}
                    </p>
                    <div className="flex gap-1 mt-1">
                      <div className={`h-1 w-4 rounded-full ${theme.colors} opacity-40`} />
                      <div className={`h-1 w-2 rounded-full ${theme.colors} opacity-20`} />
                    </div>
                  </div>
                  {currentTheme === theme.id && (
                    <div className="w-2 h-2 bg-indigo-600 rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </section>

          <Separator className="opacity-50" />

          {/* About Section */}
          <section className="space-y-4 overflow-y-auto max-h-[300px]">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{t.about.title}</h4>
            <div className="space-y-4 px-2">
              <div className="flex items-start gap-3">
                <Info className="w-4 h-4 text-indigo-600 mt-1" />
                <div>
                  <p className="text-sm font-bold text-slate-800">{t.about.purpose}</p>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    {t.about.purposeText}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Zap className="w-4 h-4 text-indigo-600" />
                <div>
                  <p className="text-sm font-bold text-slate-800">{t.about.version}</p>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{version}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <User className="w-4 h-4 text-indigo-600 mt-1" />
                <div>
                  <p className="text-sm font-bold text-slate-800">{t.about.dev}</p>
                  <p className="text-[11px] text-slate-700 font-bold uppercase tracking-tight">Makina Company</p>
                  <p className="text-[11px] text-slate-500 leading-relaxed italic">
                    "Transformando código em soluções reais para pequenos empreendedores."
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="absolute bottom-8 left-6 right-6 text-center">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              &copy; 2026 Makina Company.
            </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
