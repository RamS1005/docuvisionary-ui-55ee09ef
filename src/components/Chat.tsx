
import React, { useState, useRef, useEffect } from 'react';
import { Send, Plus, Bot, Loader2, FileText, CheckCircle } from 'lucide-react';
import { ChatMessage } from '../lib/types';

interface ChatProps {
  messages: ChatMessage[];
  onSendMessage: (content: string) => void;
  onNewChat: () => void;
  isProcessing?: boolean;
  documentReady?: boolean;
}

const Chat: React.FC<ChatProps> = ({ 
  messages, 
  onSendMessage, 
  onNewChat, 
  isProcessing = false,
  documentReady = false
}) => {
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
    if (input.trim() && !isProcessing) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="w-full h-full flex flex-col p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-docai-blue rounded-full flex items-center justify-center">
            <Bot className="h-4 w-4 text-white" />
          </div>
          <h3 className="text-sm font-medium text-docai-black">Google Document AI</h3>
          {documentReady && (
            <div className="flex items-center gap-1 text-green-600 text-xs bg-green-50 px-2 py-0.5 rounded-full">
              <CheckCircle className="h-3 w-3" />
              <span>Document Ready</span>
            </div>
          )}
        </div>
        <button 
          onClick={onNewChat}
          className="h-7 w-7 flex items-center justify-center rounded-full bg-white hover:bg-gray-100 transition-colors duration-300 border border-gray-200"
        >
          <Plus className="h-4 w-4 text-docai-darkGray" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 bg-gray-50 rounded-lg mb-3 hide-scrollbar">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4">
            <Bot className="h-10 w-10 text-docai-darkGray mb-4 opacity-50" />
            <h3 className="text-sm font-medium text-docai-black mb-2">How can I help with your document?</h3>
            <p className="text-xs text-docai-darkGray mb-4">
              {documentReady 
                ? "Your document is ready. What would you like to know about it?" 
                : "Upload a document to analyze it with Google's Vision AI technology"}
            </p>
            <div className="grid grid-cols-1 gap-2 w-full max-w-xs">
              {[
                "Summarize this document",
                "Extract key information",
                "List objects and their prices",
                "What is the confidence level of analysis?"
              ].map((suggestion, index) => (
                <button 
                  key={index}
                  onClick={() => onSendMessage(suggestion)}
                  className={`text-xs text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-300 border ${
                    documentReady 
                      ? "bg-white border-gray-200 text-docai-black" 
                      : "bg-gray-100 border-gray-200 text-docai-darkGray cursor-not-allowed"
                  }`}
                  disabled={!documentReady || isProcessing}
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
            {isProcessing && (
              <div className="chat-bubble chat-bubble-ai flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <p className="text-sm">Analyzing document...</p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={documentReady ? "Ask about your document..." : "Upload a document to start chatting..."}
          className="w-full px-4 py-3 pr-12 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-docai-blue transition-all duration-300 text-sm"
          disabled={isProcessing || !documentReady}
        />
        <button 
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 flex items-center justify-center rounded-full bg-docai-blue text-white disabled:opacity-50 disabled:bg-gray-300"
          disabled={!input.trim() || isProcessing || !documentReady}
        >
          {isProcessing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </button>
      </form>
    </div>
  );
};

export default Chat;
