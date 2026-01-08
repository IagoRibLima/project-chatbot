import { useState, useCallback } from 'react';
import { Message } from '@/types/chat';

const mockResponses = [
  "Olá! Como posso ajudá-lo hoje?",
  "Essa é uma ótima pergunta! Deixe-me pensar sobre isso...",
  "Interessante! Baseado no que você disse, posso sugerir algumas abordagens.",
  "Claro, posso ajudar com isso. Vou explicar de forma simples e clara.",
  "Excelente ponto! Há várias maneiras de abordar essa questão.",
  "Entendo sua dúvida. Vou compartilhar algumas informações úteis sobre isso.",
  "Fico feliz em ajudar! Vamos analisar isso juntos.",
  "Boa observação! Isso me lembra de alguns conceitos importantes que podemos explorar.",
];

const getRandomResponse = () => {
  return mockResponses[Math.floor(Math.random() * mockResponses.length)];
};

const generateId = () => Math.random().toString(36).substring(2, 15);

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: Message = {
      id: generateId(),
      content,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Simula delay de resposta da IA
    await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 1000));

    const aiMessage: Message = {
      id: generateId(),
      content: getRandomResponse(),
      role: 'assistant',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, aiMessage]);
    setIsLoading(false);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
  };
};
