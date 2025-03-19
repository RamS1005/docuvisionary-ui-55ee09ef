
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import FeatureToggle from '../components/FeatureToggle';
import UploadArea from '../components/UploadArea';
import PreviewPanel from '../components/PreviewPanel';
import Chat from '../components/Chat';
import { DocumentFile, FeatureType, ChatMessage } from '../lib/types';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

const Index = () => {
  const [activeFeature, setActiveFeature] = useState<FeatureType>('ocr');
  const [document, setDocument] = useState<DocumentFile | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showPreview, setShowPreview] = useState<boolean>(true);

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

  return (
    <div className="min-h-screen bg-docai-gray/30">
      <Header />
      
      <main className="container mx-auto px-4 py-4 h-[calc(100vh-80px)]">
        <ResizablePanelGroup direction="horizontal" className="min-h-full rounded-lg border">
          {/* Left panel - Upload and Settings */}
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30} className="bg-white rounded-l-lg">
            <div className="h-full p-3 flex flex-col">
              <FeatureToggle 
                activeFeature={activeFeature}
                onChange={setActiveFeature}
              />
              
              <div className="my-3 h-px bg-gray-200"></div>
              
              <UploadArea
                feature={activeFeature}
                onUploadComplete={handleUploadComplete}
              />
            </div>
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          {/* Middle panel - Chat */}
          <ResizablePanel defaultSize={40} minSize={30}>
            <div className="h-full bg-white">
              <Chat 
                messages={messages}
                onSendMessage={handleSendMessage}
                onNewChat={handleNewChat}
              />
            </div>
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          {/* Right panel - Document Preview */}
          <ResizablePanel defaultSize={40} minSize={30} className="bg-white rounded-r-lg">
            <div className="h-full">
              <PreviewPanel 
                document={document}
                onClose={() => setShowPreview(false)}
              />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    </div>
  );
};

export default Index;
