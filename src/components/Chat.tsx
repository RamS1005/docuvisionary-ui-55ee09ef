
import React, { useState, useRef, useEffect } from 'react';
import { Send, Plus, Bot } from 'lucide-react';
import { ChatMessage } from '../lib/types';

interface ChatProps {
  messages: ChatMessage[];
  onSendMessage: (content: string) => void;
  onNewChat: () => void;
}

const Chat: React.FC<ChatProps> = ({ messages, onSendMessage, onNewChat }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="w-full h-full flex flex-col animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-docai-blue rounded-full flex items-center justify-center">
            <Bot className="h-4 w-4 text-white" />
          </div>
          <h3 className="text-sm font-medium text-docai-black">Document AI Assistant</h3>
        </div>
        <button 
          onClick={onNewChat}
          className="h-8 w-8 flex items-center justify-center rounded-full bg-white hover:bg-gray-100 transition-colors duration-300"
        >
          <Plus className="h-4 w-4 text-docai-darkGray" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 bg-white/50 rounded-lg mb-4 hide-scrollbar">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4">
            <Bot className="h-12 w-12 text-docai-darkGray mb-4 opacity-50" />
            <h3 className="text-sm font-medium text-docai-black mb-2">How can I help you today?</h3>
            <p className="text-xs text-docai-darkGray mb-4">
              I can answer questions about your documents, help extract information, or explain document content.
            </p>
            <div className="grid grid-cols-1 gap-2 w-full max-w-xs">
              {[
                "Summarize this document",
                "Extract contact information",
                "Find all dates in this document",
                "What is this document about?"
              ].map((suggestion, index) => (
                <button 
                  key={index}
                  onClick={() => onSendMessage(suggestion)}
                  className="text-xs text-left px-3 py-2 bg-white rounded-lg hover:bg-gray-50 transition-colors duration-300"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`chat-bubble ${message.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something about your document..."
          className="w-full px-4 py-3 pr-12 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-docai-blue transition-all duration-300"
        />
        <button 
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 flex items-center justify-center rounded-full bg-docai-blue text-white disabled:opacity-50"
          disabled={!input.trim()}
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
};

export default Chat;
