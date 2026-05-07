import { motion } from "motion/react";
import { BusinessIdea } from "@/services/geminiService";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download, TrendingUp, Users, Wallet, Target, Info, Share2, Copy, Check } from "lucide-react";
import { Language, translations } from "@/lib/translations";
import { jsPDF } from "jspdf";
import { saveAs } from "file-saver";
import { useState } from "react";

interface IdeaResultProps {
  ideas: BusinessIdea[];
  lang: Language;
}

export function IdeaResult({ ideas, lang }: IdeaResultProps) {
  const t = translations[lang];
  const [copiedId, setCopiedId] = useState<number | null>(null);

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
    let y = 20;
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text(idea.nome, 20, y);
    y += 15;
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "italic");
    const descLines = doc.splitTextToSize(idea.descricao, 170);
    doc.text(descLines, 20, y);
    y += (descLines.length * 7) + 10;
    
    const sections = [
      { title: "Plano de Mercado", content: idea.detalhesExtensos.analiseMercado },
      { title: "Marketing & Vendas", content: idea.detalhesExtensos.marketing },
      { title: "Operações", content: idea.detalhesExtensos.operacoes },
      { title: "Financeiro", content: idea.detalhesExtensos.financeiro },
      { title: "Escalabilidade", content: idea.detalhesExtensos.escalabilidade }
    ];

    sections.forEach(sec => {
      if (y > 250) { 
        doc.addPage(); 
        y = 20; 
      }
      doc.setFont("helvetica", "bold");
      doc.text(sec.title, 20, y);
      y += 7;
      doc.setFont("helvetica", "normal");
      const lines = doc.splitTextToSize(sec.content, 170);
      doc.text(lines, 20, y);
      y += (lines.length * 6) + 10;
    });

    doc.save(`Ideax_${idea.nome.replace(/\s+/g, '_')}.pdf`);
  };

  const exportToDoc = (idea: BusinessIdea) => {
    const content = `
      TITLE: ${idea.nome}
      DESCRIPTION: ${idea.descricao}
      
      MARKET ANALYSIS:
      ${idea.detalhesExtensos.analiseMercado}
      
      MARKETING & SALES:
      ${idea.detalhesExtensos.marketing}
      
      OPERATIONS:
      ${idea.detalhesExtensos.operacoes}
      
      FINANCIALS:
      ${idea.detalhesExtensos.financeiro}
      
      SCALABILITY:
      ${idea.detalhesExtensos.escalabilidade}
      
      DICA: ${idea.dicaPratica}
    `;
    const blob = new Blob([content], { type: "application/msword" });
    saveAs(blob, `Ideax_${idea.nome.replace(/\s+/g, '_')}.doc`);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-indigo-900 text-white p-8 rounded-3xl mb-12">
        <h2 className="text-3xl font-bold mb-2 leading-tight">Planos Gerados</h2>
        <p className="text-indigo-200 text-sm max-w-2xl">
          Seus modelos de negócio detalhados estão prontos para exportação.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-12">
        {ideas.map((idea, index) => (
          <div
            key={index}
            className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col md:flex-row"
          >
            {/* Sidebar with Meta */}
            <div className="md:w-72 bg-slate-50 p-8 border-r border-slate-100 flex flex-col">
               <span className="text-slate-400 font-mono text-xs mb-4">#0{index + 1} PRO PLAN</span>
               <h3 className="text-2xl font-bold text-slate-900 mb-6 leading-tight">
                {idea.nome}
              </h3>
              
              <div className="space-y-6 mt-auto">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Dificuldade</span>
                  <Badge variant="secondary" className="w-fit">{idea.nivelDificuldade}</Badge>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Investimento</span>
                  <span className="text-sm font-bold text-slate-700">{idea.investimento}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Retorno</span>
                  <span className="text-sm font-bold text-indigo-600">{idea.tempoParaResultados}</span>
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-8 space-y-8 md:max-h-[600px] overflow-y-auto">
              <div>
                <h4 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <Info className="w-5 h-5 text-indigo-600" /> Introdução
                </h4>
                <p className="text-slate-600 text-base leading-relaxed">
                  {idea.descricao}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4 bg-indigo-50/30 p-5 rounded-2xl">
                  <h4 className="font-bold text-indigo-900 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" /> Mercado
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed">{idea.detalhesExtensos.analiseMercado}</p>
                </div>
                <div className="space-y-4 bg-indigo-50/30 p-5 rounded-2xl">
                  <h4 className="font-bold text-indigo-900 flex items-center gap-2">
                    <Target className="w-4 h-4" /> Marketing
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed">{idea.detalhesExtensos.marketing}</p>
                </div>
                <div className="space-y-4 bg-indigo-50/30 p-5 rounded-2xl">
                  <h4 className="font-bold text-indigo-900 flex items-center gap-2">
                    <Users className="w-4 h-4" /> Operações
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed">{idea.detalhesExtensos.operacoes}</p>
                </div>
                <div className="space-y-4 bg-indigo-50/30 p-5 rounded-2xl">
                  <h4 className="font-bold text-indigo-900 flex items-center gap-2">
                    <Wallet className="w-4 h-4" /> Financeiro
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed">{idea.detalhesExtensos.financeiro}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-6">
                <Button onClick={() => exportToPDF(idea)} className="bg-indigo-600 hover:bg-indigo-700">
                  <Download className="w-4 h-4 mr-2" /> {t.buttons.downloadPdf}
                </Button>
                <Button onClick={() => exportToDoc(idea)} variant="outline">
                  <FileText className="w-4 h-4 mr-2" /> {t.buttons.downloadDoc}
                </Button>
                <Button 
                  onClick={() => handleShare(idea, index)} 
                  variant="ghost" 
                  className="text-slate-500 hover:text-indigo-600 hover:bg-indigo-50"
                >
                  {copiedId === index ? (
                    <Check className="w-4 h-4 mr-2 text-green-600" />
                  ) : (
                    <Share2 className="w-4 h-4 mr-2" />
                  )}
                  {copiedId === index ? "Copiado!" : "Compartilhar"}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
