
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const MODEL_NAME = 'gemini-2.5-flash-preview-04-17';

/**
 * Gera uma sugestão de biografia para um prestador de serviço usando a API Gemini.
 * @param keywords Palavras-chave ou breve descrição dos serviços e diferenciais do prestador.
 * @returns Uma string contendo a biografia sugerida.
 * @throws Erro se a API falhar ou não retornar texto, ou se a API Key não estiver configurada.
 */
export const generateProviderBio = async (keywords: string): Promise<string> => {
  if (!process.env.API_KEY) {
    console.error("API Key for Gemini not found in environment variables.");
    throw new Error("A chave da API para o serviço de IA não está configurada. Por favor, contate o suporte da plataforma.");
  }
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    Você é um especialista em marketing digital criando biografias concisas e impactantes para prestadores de serviço.
    Crie uma biografia profissional e atraente (entre 50 e 120 palavras) para um prestador com as seguintes características/serviços:
    "${keywords}"

    Destaque os pontos fortes, use uma linguagem clara, confiável e convidativa.
    A biografia deve ser em primeira pessoa (como se o prestador estivesse falando).
    Não inclua saudações como "Olá!" nem despedidas. Foque na descrição do serviço e valor.
    Retorne apenas o texto da biografia.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt, 
        // Exemplo de configuração adicional, se necessário:
        // config: { 
        //   temperature: 0.7,
        //   topK: 50,
        //   topP: 0.95,
        // }
    });
    
    const text = response.text;

    if (text) {
      return text.trim();
    } else {
      console.error("Gemini API returned no text for bio generation. Response:", response);
      throw new Error("O assistente de IA não retornou um texto válido para a biografia. Tente refazer a solicitação com palavras-chave diferentes ou contate o suporte.");
    }
  } catch (error: unknown) { 
    console.error('Erro ao gerar biografia com Gemini:', error);
    let errorMessage = 'Não foi possível gerar a biografia no momento devido a um erro desconhecido. Tente novamente mais tarde ou contate o suporte.';
    if (error instanceof Error) {
        // Tenta extrair uma mensagem mais específica, se disponível
        if (error.message.includes('API key not valid') || error.message.includes('API_KEY_INVALID')) {
            errorMessage = "A chave da API configurada para o assistente de IA é inválida. Por favor, contate o suporte da plataforma.";
        } else if (error.message.includes('quota') || error.message.includes('rate limit') || error.message.includes('RESOURCE_EXHAUSTED')) {
            errorMessage = "O limite de solicitações ao assistente de IA foi atingido. Por favor, tente novamente mais tarde.";
        } else if (error.message.includes('service is currently unavailable')) {
            errorMessage = "O serviço de IA está temporariamente indisponível. Por favor, tente novamente mais tarde.";
        } else if (error.message) {
            // Para outros erros da API Gemini, tenta ser um pouco mais genérico mas informativo.
            errorMessage = `Falha ao comunicar com o assistente de IA. Verifique sua conexão ou tente novamente. (Detalhe: ${error.message})`;
        }
    }
    throw new Error(errorMessage);
  }
};
