const TypingIndicator = () => {
  return (
    <div className="flex items-center gap-3 animate-fade-in-up">
      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
        <span className="text-primary text-sm font-semibold">AI</span>
      </div>
      <div className="message-bubble-ai flex items-center gap-1.5 py-4">
        <div className="typing-dot" />
        <div className="typing-dot" />
        <div className="typing-dot" />
      </div>
    </div>
  );
};

export default TypingIndicator;
