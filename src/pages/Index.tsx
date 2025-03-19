
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import FeatureToggle from '../components/FeatureToggle';
import UploadArea from '../components/UploadArea';
import PreviewPanel from '../components/PreviewPanel';
import Chat from '../components/Chat';
import { DocumentFile, FeatureType, ChatMessage } from '../lib/types';

const Index = () => {
  const [activeFeature, setActiveFeature] = useState<FeatureType>('ocr');
  const [document, setDocument] = useState<DocumentFile | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showPreview, setShowPreview] = useState<boolean>(false);

  // Reset chat when a new document is uploaded
  useEffect(() => {
    if (document) {
      setMessages([
        {
          id: '1',
          content: `I've analyzed your document "${document.name}". What would you like to know about it?`,
          role: 'ai',
          timestamp: new Date()
        }
      ]);
      setShowPreview(true);
    }
  }, [document]);

  const handleUploadComplete = (uploadedDocument: DocumentFile) => {
    setDocument(uploadedDocument);
  };

  const handleSendMessage = (content: string) => {
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Simulate AI response after a short delay
    setTimeout(() => {
      const aiResponses = [
        "I've found that information in the document. The key details are on page 1.",
        "Based on the document analysis, there are 3 main sections with relevant data.",
        "The document appears to be an invoice with payment details and line items.",
        "I've extracted the dates from the document. The main date is January 15, 2023.",
        "This looks like a contract document with signature fields and legal clauses.",
      ];
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: aiResponses[Math.floor(Math.random() * aiResponses.length)],
        role: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  const handleNewChat = () => {
    setMessages([]);
  };

  const closePreview = () => {
    setShowPreview(false);
  };

  return (
    <div className="min-h-screen bg-docai-gray/50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Left column: Feature selection and upload */}
          <div className="col-span-12 lg:col-span-4">
            <div className="glass-panel p-6 h-full">
              <FeatureToggle 
                activeFeature={activeFeature}
                onChange={setActiveFeature}
              />
              
              <div className="my-6 h-px bg-gray-200"></div>
              
              <UploadArea
                feature={activeFeature}
                onUploadComplete={handleUploadComplete}
              />
            </div>
          </div>
          
          {/* Middle column: Document preview or chat */}
          <div className="col-span-12 lg:col-span-4">
            <div className="glass-panel p-6 h-full min-h-[600px] flex flex-col">
              {!document || showPreview ? (
                <PreviewPanel 
                  document={document}
                  onClose={closePreview}
                />
              ) : (
                <Chat 
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  onNewChat={handleNewChat}
                />
              )}
            </div>
          </div>
          
          {/* Right column: Chat or preview toggle */}
          <div className="col-span-12 lg:col-span-4">
            <div className="glass-panel p-6 h-full min-h-[600px] flex flex-col">
              {document && showPreview ? (
                <Chat 
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  onNewChat={handleNewChat}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-docai-darkGray">
                  <div className="animate-pulse-light">
                    <svg className="w-24 h-24 mb-6 text-docai-blue opacity-20" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-docai-black mb-2">No Document Selected</h3>
                  <p className="text-sm text-center max-w-xs mb-6">
                    Upload a document using the panel on the left to begin analyzing its content
                  </p>
                  <p className="text-xs text-center text-docai-darkGray max-w-xs">
                    Our AI will process your document, extract information, and allow you to interact through chat
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
