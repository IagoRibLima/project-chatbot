import { MessageSquare, Sparkles, Zap } from 'lucide-react';

const EmptyState = () => {
  const suggestions = [
    { icon: Sparkles, text: 'Me explique como funciona a inteligência artificial' },
    { icon: Zap, text: 'Quais são as melhores práticas de programação?' },
    { icon: MessageSquare, text: 'Me ajude a escrever um e-mail profissional' },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full px-4 animate-fade-in-up">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
        <MessageSquare className="w-8 h-8 text-primary" />
      </div>
      <h2 className="text-xl font-semibold text-foreground mb-2">
        Como posso ajudar?
      </h2>
      <p className="text-muted-foreground text-sm text-center mb-8 max-w-md">
        Sou seu assistente virtual. Faça uma pergunta ou escolha uma das sugestões abaixo.
      </p>
      <div className="space-y-3 w-full max-w-md">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            className="w-full flex items-center gap-3 p-4 rounded-xl bg-secondary/50 hover:bg-secondary border border-border hover:border-primary/30 transition-all duration-200 text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <suggestion.icon className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm text-foreground">{suggestion.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmptyState;
