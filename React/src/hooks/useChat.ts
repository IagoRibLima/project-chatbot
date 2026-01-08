import { useState, useCallback, useEffect } from 'react';
import { Message } from '@/types/chat';
import { toast } from "sonner"; // Opcional: para avisar se der erro

// Função auxiliar para gerar ID caso o backend não envie (apenas fallback)
const generateId = () => Math.random().toString(36).substring(2, 15);

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 1. Carregar histórico do Backend ao iniciar
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch("http://localhost:5000/history");
        if (!response.ok) throw new Error("Falha ao carregar histórico");
        
        const data = await response.json();

        // Mapear os dados do Python para o formato do Frontend
        // O Python retorna "model", mas seu frontend usa "assistant"
        const formattedMessages: Message[] = data.map((msg: any) => ({
          id: msg.id ? String(msg.id) : generateId(),
          content: msg.content,
          role: msg.role === 'model' ? 'assistant' : 'user',
          timestamp: new Date(msg.timestamp)
        }));

        setMessages(formattedMessages);
      } catch (error) {
        console.error("Erro ao buscar histórico:", error);
        toast.error("Erro ao carregar conversas anteriores.");
      }
    };

    fetchHistory();
  }, []);

  // 2. Enviar nova mensagem
  const sendMessage = useCallback(async (content: string) => {
    // Cria a mensagem do usuário (Otimista - aparece antes de enviar)
    const userMessage: Message = {
      id: generateId(),
      content,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Chama a API Python
      const response = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content }),
      });

      if (!response.ok) throw new Error("Erro na resposta da API");

      const data = await response.json();

      // Cria a mensagem da IA baseada na resposta real
      const aiMessage: Message = {
        id: generateId(),
        content: data.response, // O Python retorna { response: "..." }
        role: 'assistant',      // Mapeamos para 'assistant' para seu frontend entender
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);

    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      toast.error("Erro ao comunicar com o Gemini.");
      
      // Opcional: Remover a mensagem do usuário se falhou?
      // Por enquanto, deixamos lá para ele tentar copiar e colar de novo.
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearMessages = useCallback(async() => {
    try {
      // Chama a rota DELETE do Python
      const response = await fetch("http://localhost:5000/history", {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Erro ao limpar banco de dados");

      // Se o backend confirmou que apagou, limpamos o frontend
      setMessages([]);
      toast.success("Histórico apagado com sucesso!");

    } catch (error) {
      console.error("Erro ao limpar:", error);
      toast.error("Não foi possível apagar o histórico.");
    }
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
  };
};