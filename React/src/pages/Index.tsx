import ChatHeader from '@/components/chat/ChatHeader';
import ChatContainer from '@/components/chat/ChatContainer';
import ChatInput from '@/components/chat/ChatInput';
import { useChat } from '@/hooks/useChat';

const Index = () => {
  const { messages, isLoading, sendMessage, clearMessages } = useChat();

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Verifica se passou a função corretamente aqui */}
      <ChatHeader onClear={clearMessages} />
      
      <ChatContainer messages={messages} isLoading={isLoading} />
      <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
    </div>
  );
};

export default Index;