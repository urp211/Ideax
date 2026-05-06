import * as React from "react"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { UserContext } from "@/services/geminiService";
import { Coins, MapPin, Clock, BrainCircuit, Globe, BookOpen } from "lucide-react";
import { Language, translations } from "@/lib/translations";

interface BusinessFormProps {
  onSubmit: (context: UserContext) => void;
  isLoading: boolean;
  lang: Language;
  remaining: number;
}

export function BusinessForm({ onSubmit, isLoading, lang, remaining }: BusinessFormProps) {
  const t = translations[lang];
  const [formData, setFormData] = useState<UserContext>({
    pais: lang === "pt" ? "Brasil" : lang === "en" ? "USA" : "España",
    investimento: "Até R$ 100",
    disponibilidade: "Parcial",
    habilidades: "",
    nivelDetalhe: "Completo",
    idioma: lang === "pt" ? "Português" : lang === "en" ? "English" : lang === "es" ? "Español" : "Français",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (remaining <= 0) return;
    onSubmit(formData);
  };

  return (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          {t.title.split("<br />").map((line, i) => (
            <span key={i}>{line}<br /></span>
          ))}
        </h2>
        <p className="text-slate-500 max-w-xl mx-auto text-sm md:text-base">
          {t.subtitle}
        </p>
        <div className="flex justify-center">
          <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 border-indigo-100">
            {t.usageCount.replace("{count}", remaining.toString())}
          </Badge>
        </div>
      </div>

      <Card className="max-w-2xl mx-auto border border-slate-200 shadow-xl bg-white overflow-hidden rounded-2xl">
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  {t.labels.pais}
                </Label>
                <Input
                  placeholder={t.placeholders.pais}
                  value={formData.pais}
                  onChange={(e) => setFormData({ ...formData, pais: e.target.value })}
                  className="bg-slate-50 border-slate-200 h-11 focus-visible:ring-indigo-600 focus-visible:border-indigo-600"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  {t.labels.investimento}
                </Label>
                <Select
                  value={formData.investimento}
                  onValueChange={(val) => setFormData({ ...formData, investimento: val })}
                >
                  <SelectTrigger className="bg-slate-50 border-slate-200 h-11 focus:ring-indigo-600">
                    <SelectValue placeholder="Selecione o valor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="R$ 0 (Começar com o que tem)">R$ 0 / $ 0</SelectItem>
                    <SelectItem value="Até R$ 100 / $ 20">Até R$ 100 / $ 20</SelectItem>
                    <SelectItem value="Até R$ 500 / $ 100">Até R$ 500 / $ 100</SelectItem>
                    <SelectItem value="Até R$ 2.000 / $ 400">Até R$ 2.000 / $ 400</SelectItem>
                    <SelectItem value="Acima de R$ 5.000 / $ 1000">Acima de R$ 5.000 / $ 1000</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  {t.labels.disponibilidade}
                </Label>
                <Select
                  value={formData.disponibilidade}
                  onValueChange={(val: "Parcial" | "Tempo Inteiro") => setFormData({ ...formData, disponibilidade: val })}
                >
                  <SelectTrigger className="bg-slate-50 border-slate-200 h-11 focus:ring-indigo-600">
                    <SelectValue placeholder="Selecione o tempo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Parcial">Part-Time</SelectItem>
                    <SelectItem value="Tempo Inteiro">Full-Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  {t.labels.habilidades}
                </Label>
                <Input
                  placeholder={t.placeholders.habilidades}
                  value={formData.habilidades}
                  onChange={(e) => setFormData({ ...formData, habilidades: e.target.value })}
                  className="bg-slate-50 border-slate-200 h-11 focus-visible:ring-indigo-600"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  <BookOpen className="w-3 h-3 inline mr-1" /> {t.labels.nivel}
                </Label>
                <Select
                  value={formData.nivelDetalhe}
                  onValueChange={(val: any) => setFormData({ ...formData, nivelDetalhe: val })}
                >
                  <SelectTrigger className="bg-slate-50 border-slate-200 h-11 focus:ring-indigo-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Resumido">Resumido</SelectItem>
                    <SelectItem value="Completo">Completo</SelectItem>
                    <SelectItem value="Extenso (Plano de Negócios)">Extenso (Plano de Negócios)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  <Globe className="w-3 h-3 inline mr-1" /> {t.labels.idioma}
                </Label>
                <Select
                  value={formData.idioma}
                  onValueChange={(val) => setFormData({ ...formData, idioma: val })}
                >
                  <SelectTrigger className="bg-slate-50 border-slate-200 h-11 focus:ring-indigo-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Português">Português</SelectItem>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Español">Español</SelectItem>
                    <SelectItem value="Français">Français</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading || remaining <= 0}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-12 rounded-lg text-sm transition-all focus:ring-4 focus:ring-indigo-100 shadow-md shadow-indigo-100"
            >
              {remaining <= 0 ? t.buttons.limitReached : isLoading ? t.buttons.generating : t.buttons.generate}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
