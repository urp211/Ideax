import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface BusinessIdea {
  nome: string;
  descricao: string;
  comoComecar: string[];
  investimento: string;
  comoGanharDinheiro: string;
  nivelDificuldade: "Fácil" | "Médio" | "Difícil";
  tempoParaResultados: string;
  dicaPratica: string;
  detalhesExtensos: {
    analiseMercado: string;
    operacoes: string;
    marketing: string;
    financeiro: string;
    escalabilidade: string;
  };
  socialMediaTips: {
    platform: string;
    tip: string;
  }[];
  estatisticasSucesso: {
    taxaSucessoEstimada: string;
    pilaresPrincipais: string[];
    riscosPotenciais: string[];
    proximaAcaoImediata: string;
    estimativaCrescimento: string;
  };
}

export interface UserContext {
  pais: string;
  investimento: string;
  disponibilidade: "Parcial" | "Tempo Inteiro";
  habilidades: string;
  nivelDetalhe: "Resumido" | "Completo" | "Extenso (Plano de Negócios)";
  idioma: string;
}

export async function generateBusinessIdeas(context: UserContext): Promise<BusinessIdea[]> {
  const prompt = `Gere exatamente 3 ideias de negócios lucrativos e realistas baseadas no seguinte contexto:
- País/Realidade: ${context.pais}
- Investimento disponível: ${context.investimento}
- Disponibilidade: ${context.disponibilidade}
- Habilidades: ${context.habilidades || "Nenhuma habilidade específica"}
- Nível de Detalhe Desejado: ${context.nivelDetalhe}
- Idioma da Resposta: ${context.idioma}

Para o nível "${context.nivelDetalhe}", forneça conteúdo extremamente rico. Se for "Extenso", inclua análises profundas de mercado, operações detalhadas e projeções financeiras em cada ideia. 

Além disso, inclua uma seção de "Estatísticas de Sucesso" para cada ideia, detalhando a probabilidade de sucesso, os pilares fundamentais, riscos e um plano de ação imediato.

As ideias devem ser práticas, detalhadas e adaptadas ao contexto. Priorize ideias que funcionem com pouco dinheiro e possam ser feitas com celular. 

IMPORTANTE: Responda TODO o conteúdo no idioma: ${context.idioma}.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            nome: { type: Type.STRING },
            descricao: { type: Type.STRING },
            comoComecar: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            investimento: { type: Type.STRING },
            comoGanharDinheiro: { type: Type.STRING },
            nivelDificuldade: { 
              type: Type.STRING,
              enum: ["Fácil", "Médio", "Difícil"]
            },
            tempoParaResultados: { type: Type.STRING },
            dicaPratica: { type: Type.STRING },
            detalhesExtensos: {
              type: Type.OBJECT,
              properties: {
                analiseMercado: { type: Type.STRING },
                operacoes: { type: Type.STRING },
                marketing: { type: Type.STRING },
                financeiro: { type: Type.STRING },
                escalabilidade: { type: Type.STRING }
              }
            },
            socialMediaTips: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  platform: { type: Type.STRING },
                  tip: { type: Type.STRING }
                }
              }
            },
            estatisticasSucesso: {
              type: Type.OBJECT,
              properties: {
                taxaSucessoEstimada: { type: Type.STRING },
                pilaresPrincipais: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                riscosPotenciais: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                proximaAcaoImediata: { type: Type.STRING },
                estimativaCrescimento: { type: Type.STRING }
              },
              required: ["taxaSucessoEstimada", "pilaresPrincipais", "riscosPotenciais", "proximaAcaoImediata", "estimativaCrescimento"]
            }
          },
          required: [
            "nome", 
            "descricao", 
            "comoComecar", 
            "investimento", 
            "comoGanharDinheiro", 
            "nivelDificuldade", 
            "tempoParaResultados", 
            "dicaPratica",
            "detalhesExtensos",
            "socialMediaTips",
            "estatisticasSucesso"
          ]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    console.error("Erro ao analisar resposta da IA:", e);
    throw new Error("Não foi possível gerar as ideias. Tente novamente.");
  }
}
