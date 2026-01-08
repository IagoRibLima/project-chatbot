import { Bot, Sparkles, Trash2 } from 'lucide-react';

interface ChatHeaderProps {
  onClear: () => void;
}

const ChatHeader = ({ onClear }: ChatHeaderProps) => {
  
  const handleClearClick = () => {
    if (window.confirm("Tem certeza que deseja apagar todo o histórico?")) {
      onClear();
    }
  };

  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-3xl mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          
          {/* Ícone e Status */}
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center pulse-glow">
              <Bot className="w-5 h-5 text-primary" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
              <Sparkles className="w-2.5 h-2.5 text-primary-foreground" />
            </div>
          </div>
          
          <div>
            <h1 className="font-semibold text-foreground">Assistente IA</h1>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Online
            </p>
          </div>

          {/* Botão de Lixeira */}
          <button 
            onClick={handleClearClick}
            className="ml-auto p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
            title="Apagar histórico"
          >
            <Trash2 className="w-5 h-5" />
          </button>

        </div>
      </div>
    </header>
  );
};

export default ChatHeader;