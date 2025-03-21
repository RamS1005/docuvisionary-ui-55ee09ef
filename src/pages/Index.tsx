
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import FeatureToggle from '../components/FeatureToggle';
import UploadArea from '../components/UploadArea';
import PreviewPanel from '../components/PreviewPanel';
import Chat from '../components/Chat';
import { DocumentFile, FeatureType, ChatMessage } from '../lib/types';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { generateDocumentResponse } from '../lib/document-service';
import { toast } from "@/components/ui/use-toast";

const Index = () => {
  const [activeFeature, setActiveFeature] = useState<FeatureType>('ocr');
  const [document, setDocument] = useState<DocumentFile | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showPreview, setShowPreview] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [documentReady, setDocumentReady] = useState(false);

  // Check if environment variables are set properly on component mount
  useEffect(() => {
    const isApiKeySet = import.meta.env.VITE_GOOGLE_VISION_API_KEY && 
                        import.meta.env.VITE_GOOGLE_VISION_API_KEY !== 'your_api_key_here';
    
    if (!isApiKeySet) {
      toast({
        title: "API Key Not Configured",
        description: "Please add your Google Vision API key in the .env file to use real AI processing.",
        variant: "destructive",
        duration: 5000,
      });
    }
    
    const useRealVision = import.meta.env.VITE_USE_REAL_GOOGLE_VISION === 'true';
    if (useRealVision && !isApiKeySet) {
      console.warn("Real Vision API is enabled but API key is not set correctly");
    }
  }, []);

  // Reset chat when a new document is uploaded
  useEffect(() => {
    if (document && document.processed) {
      setMessages([
        {
          id: '1',
          content: `I've analyzed your document "${document.name}" using Google's AI services. What would you like to know about it?`,
          role: 'ai',
          timestamp: new Date()
        }
      ]);
      setShowPreview(true);
      setDocumentReady(true);
      
      // Show a toast notification
      toast({
        title: "Document Processed",
        description: "Your document is now ready for analysis!",
        duration: 3000,
      });
    } else {
      setDocumentReady(false);
    }
  }, [document]);

  const handleUploadComplete = (uploadedDocument: DocumentFile) => {
    setDocument(uploadedDocument);
  };

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);
    
    try {
      // Generate AI response
      const response = await generateDocumentResponse(content, document);
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error generating AI response:", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I encountered an error processing your request. Please try again.",
        role: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Error",
        description: "Failed to generate a response. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNewChat = () => {
    if (document) {
      setMessages([
        {
          id: Date.now().toString(),
          content: `Starting a new conversation about "${document.name}". What would you like to know?`,
          role: 'ai',
          timestamp: new Date()
        }
      ]);
    } else {
      setMessages([]);
    }
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
                isProcessing={isProcessing}
                documentReady={documentReady}
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
