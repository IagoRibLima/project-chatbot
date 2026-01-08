import { MessageSquare, Sparkles, Zap } from 'lucide-react';

const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full px-4 animate-fade-in-up">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
        <MessageSquare className="w-8 h-8 text-primary" />
      </div>
      <h2 className="text-xl font-semibold text-foreground mb-2">
        Como posso ajudar?
      </h2>
      <p className="text-muted-foreground text-sm text-center mb-8 max-w-md">
        Sou seu assistente virtual. Faça uma pergunta.
      </p>
    </div>
  );
};

export default EmptyState;
