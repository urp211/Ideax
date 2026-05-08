import { FileText, Download, TrendingUp, Users, Wallet, Target, Info, Share2, Copy, Check, BarChart3, ShieldAlert, Zap, ArrowUpRight } from "lucide-react";
import { Language, translations } from "@/lib/translations";
import { jsPDF } from "jspdf";
import { saveAs } from "file-saver";
import { useState } from "react";
import { BusinessIdea } from "@/services/geminiService";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface IdeaResultProps {
  ideas: BusinessIdea[];
  lang: Language;
}

export function IdeaResult({ ideas, lang }: IdeaResultProps) {
  const t = translations[lang];
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<Record<number, 'details' | 'success'>>({});

  const toggleTab = (index: number, tab: 'details' | 'success') => {
    setActiveTab(prev => ({ ...prev, [index]: tab }));
  };

  const handleShare = async (idea: BusinessIdea, index: number) => {
    const shareData = {
      title: `Ideax Pro: ${idea.nome}`,
      text: `${idea.nome}\n\n${idea.descricao}\n\nConfira esta ideia de negócio no Ideax Pro:`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        setCopiedId(index);
        setTimeout(() => setCopiedId(null), 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  };

  const exportToPDF = (idea: BusinessIdea) => {
    const doc = new jsPDF();
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text(idea.nome, 20, 20);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    const splitDesc = doc.splitTextToSize(idea.descricao, 170);
    doc.text(splitDesc, 20, 35);
    
    let y = 35 + (splitDesc.length * 7);
    
    doc.setFont("helvetica", "bold");
    doc.text("Investimento:", 20, y + 10);
    doc.setFont("helvetica", "normal");
    doc.text(idea.investimento, 60, y + 10);
    
    doc.setFont("helvetica", "bold");
    doc.text("Monetização:", 20, y + 20);
    doc.setFont("helvetica", "normal");
    const splitMonet = doc.splitTextToSize(idea.comoGanharDinheiro, 130);
    doc.text(splitMonet, 60, y + 20);
    
    y += 20 + (splitMonet.length * 7);
    
    doc.setFont("helvetica", "bold");
    doc.text("Como Começar:", 20, y + 10);
    doc.setFont("helvetica", "normal");
    idea.comoComecar.forEach((step, i) => {
      doc.text(`- ${step}`, 25, y + 20 + (i * 7));
    });

    const finalY = y + 20 + (idea.comoComecar.length * 7);
    
    doc.setFont("helvetica", "bold");
    doc.text("Roadmap de Sucesso:", 20, finalY + 10);
    doc.setFont("helvetica", "normal");
    doc.text(`Taxa de Sucesso: ${idea.estatisticasSucesso.taxaSucessoEstimada}`, 20, finalY + 20);
    doc.text(`Próxima Ação: ${idea.estatisticasSucesso.proximaAcaoImediata}`, 20, finalY + 30);
    
    doc.save(`${idea.nome.replace(/\s+/g, "_")}.pdf`);
  };

  const exportToDoc = (idea: BusinessIdea) => {
    const content = `
      ${idea.nome}
      
      ${idea.descricao}
      
      Investimento: ${idea.investimento}
      Monetização: ${idea.comoGanharDinheiro}
      Dificuldade: ${idea.nivelDificuldade}
      
      Como Começar:
      ${idea.comoComecar.map(step => `- ${step}`).join("\n")}

      Detalhes Estratégicos:
      - Mercado: ${idea.detalhesExtensos.analiseMercado}
      - Operacional: ${idea.detalhesExtensos.operacoes}
      - Marketing: ${idea.detalhesExtensos.marketing}
      - Financeiro: ${idea.detalhesExtensos.financeiro}
      
      Roadmap de Sucesso:
      - Taxa Estimada: ${idea.estatisticasSucesso.taxaSucessoEstimada}
      - Pilares: ${idea.estatisticasSucesso.pilaresPrincipais.join(", ")}
      - Riscos: ${idea.estatisticasSucesso.riscosPotenciais.join(", ")}
      - Ação Imediata: ${idea.estatisticasSucesso.proximaAcaoImediata}
    `;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    saveAs(blob, `${idea.nome.replace(/\s+/g, "_")}.doc`);
  };

  return (
    <div className="grid grid-cols-1 gap-12">
      {ideas.map((idea, index) => (
        <div 
          key={index} 
          className="bg-card rounded-3xl overflow-hidden border border-border shadow-2xl transition-all group"
        >
          <div className="md:grid md:grid-cols-12">
            {/* Sidebar de Status */}
            <div className="bg-muted/50 md:col-span-4 p-8 border-r border-border">
               <Badge className="mb-4 bg-primary hover:bg-primary/90 text-primary-foreground border-transparent">
                  IDEIA #{index + 1}
               </Badge>
               <h2 className="text-3xl font-black text-card-foreground leading-tight mb-6">
                {idea.nome}
               </h2>
               
               <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
                      <Wallet className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">Custo Médio</p>
                      <p className="font-bold text-foreground">{idea.investimento}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                      <Target className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">Dificuldade</p>
                      <p className="font-bold text-foreground">{idea.nivelDificuldade}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">Resultados</p>
                      <p className="font-bold text-foreground">{idea.tempoParaResultados}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 mt-8">
                     <div className="flex items-center gap-2 mb-2">
                        <Info className="w-4 h-4 text-primary" />
                        <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Dica de Especialista</span>
                     </div>
                     <p className="text-xs italic text-foreground font-medium leading-relaxed">
                       "{idea.dicaPratica}"
                     </p>
                  </div>
               </div>
            </div>

            {/* Conteúdo Principal */}
            <div className="md:col-span-8 p-8 md:p-12">
              <div className="flex gap-4 mb-8 border-b border-border pb-2">
                <button 
                  onClick={() => toggleTab(index, 'details')}
                  className={`pb-2 px-1 text-sm font-bold uppercase tracking-widest transition-colors relative ${
                    (activeTab[index] || 'details') === 'details' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Visão Geral
                  {(activeTab[index] || 'details') === 'details' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                  )}
                </button>
                <button 
                  onClick={() => toggleTab(index, 'success')}
                  className={`pb-2 px-1 text-sm font-bold uppercase tracking-widest transition-colors relative ${
                    activeTab[index] === 'success' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Roadmap & Grátis
                  {activeTab[index] === 'success' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                  )}
                </button>
              </div>

              {(activeTab[index] || 'details') === 'details' ? (
                <>
                  <section className="mb-12">
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-500" /> O Conceito
                    </h3>
                    <p className="text-foreground leading-relaxed text-lg font-medium">
                      {idea.descricao}
                    </p>
                  </section>

                  <section className="grid md:grid-cols-2 gap-8 mb-12">
                    <div>
                      <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-4">Passos Iniciais</h4>
                      <ul className="space-y-4">
                        {idea.comoComecar.map((step, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <span className="w-5 h-5 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">{i+1}</span>
                            <span className="text-muted-foreground text-sm leading-snug">{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-muted/30 p-6 rounded-2xl border border-border">
                      <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-4">Estratégia de Receita</h4>
                      <p className="text-foreground text-sm leading-relaxed font-medium">
                        {idea.comoGanharDinheiro}
                      </p>
                    </div>
                  </section>

                  <section className="space-y-6">
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest border-b border-border pb-2">Plano Estratégico</h3>
                    <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
                       <div>
                         <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Mercado</p>
                         <p className="text-sm text-foreground">{idea.detalhesExtensos.analiseMercado}</p>
                       </div>
                       <div>
                         <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Marketing</p>
                         <p className="text-sm text-foreground">{idea.detalhesExtensos.marketing}</p>
                       </div>
                    </div>
                  </section>
                </>
              ) : (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
                   <div className="grid md:grid-cols-2 gap-6">
                      <div className="p-6 bg-green-500/5 rounded-2xl border border-green-500/10 flex items-center gap-4">
                        <div className="w-12 h-12 bg-card rounded-xl shadow-sm flex items-center justify-center text-green-500 border border-border">
                           <BarChart3 className="w-6 h-6" />
                        </div>
                        <div>
                           <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Taxa de Sucesso</p>
                           <p className="text-xl font-black text-foreground">{idea.estatisticasSucesso.taxaSucessoEstimada}</p>
                        </div>
                      </div>
                      
                      <div className="p-6 bg-amber-500/5 rounded-2xl border border-amber-500/10 flex items-center gap-4">
                        <div className="w-12 h-12 bg-card rounded-xl shadow-sm flex items-center justify-center text-amber-500 border border-border">
                           <ArrowUpRight className="w-6 h-6" />
                        </div>
                        <div>
                           <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Potencial de Crescimento</p>
                           <p className="text-xl font-black text-foreground">{idea.estatisticasSucesso.estimativaCrescimento}</p>
                        </div>
                      </div>
                   </div>

                   <div className="bg-primary rounded-2xl p-8 text-primary-foreground relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-10">
                         <Zap className="w-32 h-32" />
                      </div>
                      <h4 className="text-xs font-bold uppercase tracking-widest mb-4 opacity-80">Ação Imediata (Grátis)</h4>
                      <p className="text-lg font-medium leading-relaxed relative z-10">
                        {idea.estatisticasSucesso.proximaAcaoImediata}
                      </p>
                   </div>

                   <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                          <Users className="w-4 h-4" /> Pilares para Vencer
                        </h4>
                        <ul className="space-y-3">
                          {idea.estatisticasSucesso.pilaresPrincipais.map((pilar, i) => (
                            <li key={i} className="flex items-center gap-3 text-sm text-foreground font-medium">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                              {pilar}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-red-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                          <ShieldAlert className="w-4 h-4" /> Riscos Reais
                        </h4>
                        <ul className="space-y-3">
                          {idea.estatisticasSucesso.riscosPotenciais.map((risco, i) => (
                            <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                              <div className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                              {risco}
                            </li>
                          ))}
                        </ul>
                      </div>
                   </div>
                </div>
              )}

              <div className="flex flex-wrap gap-4 mt-12 pt-8 border-t border-border">
                <Button onClick={() => exportToPDF(idea)} className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                  <Download className="w-4 h-4 mr-2" /> {t.buttons.downloadPdf}
                </Button>
                <Button onClick={() => exportToDoc(idea)} variant="outline">
                  <FileText className="w-4 h-4 mr-2" /> {t.buttons.downloadDoc}
                </Button>
                <Button 
                  onClick={() => handleShare(idea, index)} 
                  variant="ghost" 
                  className="text-muted-foreground hover:text-primary hover:bg-primary/5"
                >
                  {copiedId === index ? (
                    <Check className="w-4 h-4 mr-2 text-green-600" />
                  ) : (
                    <Share2 className="w-4 h-4 mr-2" />
                  )}
                  {copiedId === index ? (lang === 'pt' ? "Copiado!" : "Copied!") : (lang === 'pt' ? "Compartilhar" : "Share")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

