
import React, { useState } from 'react';
import { File, FileText, Eye, Download, X, ArrowLeft } from 'lucide-react';
import { DocumentFile } from '../lib/types';

interface PreviewPanelProps {
  document: DocumentFile | null;
  onClose: () => void;
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({ document, onClose }) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'extracted'>('preview');

  if (!document) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-docai-darkGray animate-fade-in">
        <FileText className="h-12 w-12 mb-4 opacity-50" />
        <p className="text-sm">No document selected</p>
        <p className="text-xs mt-2">Upload a document to see preview</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button 
            onClick={onClose}
            className="h-8 w-8 flex items-center justify-center rounded-full bg-white hover:bg-gray-100 transition-colors duration-300"
          >
            <ArrowLeft className="h-4 w-4 text-docai-darkGray" />
          </button>
          <h3 className="text-sm font-medium text-docai-black">{document.name}</h3>
        </div>
        <div className="flex items-center gap-2">
          <button className="h-8 w-8 flex items-center justify-center rounded-full bg-white hover:bg-gray-100 transition-colors duration-300">
            <Download className="h-4 w-4 text-docai-darkGray" />
          </button>
          <button 
            onClick={onClose}
            className="h-8 w-8 flex items-center justify-center rounded-full bg-white hover:bg-gray-100 transition-colors duration-300"
          >
            <X className="h-4 w-4 text-docai-darkGray" />
          </button>
        </div>
      </div>
      
      <div className="flex border-b border-gray-200 mb-4">
        <button
          onClick={() => setActiveTab('preview')}
          className={`px-4 py-2 text-sm font-medium transition-colors duration-300 ${
            activeTab === 'preview'
              ? 'text-docai-blue border-b-2 border-docai-blue'
              : 'text-docai-darkGray hover:text-docai-black'
          }`}
        >
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Preview
          </div>
        </button>
        <button
          onClick={() => setActiveTab('extracted')}
          className={`px-4 py-2 text-sm font-medium transition-colors duration-300 ${
            activeTab === 'extracted'
              ? 'text-docai-blue border-b-2 border-docai-blue'
              : 'text-docai-darkGray hover:text-docai-black'
          }`}
        >
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Extracted Data
          </div>
        </button>
      </div>
      
      <div className="flex-1 overflow-hidden animate-fade-in">
        {activeTab === 'preview' ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden">
            {document.type.startsWith('image/') ? (
              <img 
                src={document.url} 
                alt={document.name} 
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <div className="flex flex-col items-center justify-center">
                <File className="h-16 w-16 text-docai-darkGray mb-4" />
                <p className="text-sm text-docai-darkGray">Preview not available</p>
                <p className="text-xs text-docai-darkGray mt-1">Document type: {document.type}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full overflow-y-auto p-4 bg-white/50 rounded-lg">
            {document.processed && document.processingResult ? (
              <div className="space-y-6">
                {document.processingResult.text && (
                  <div>
                    <h4 className="text-xs font-medium uppercase text-docai-darkGray mb-2">Extracted Text</h4>
                    <p className="text-sm text-docai-black p-3 bg-white rounded-lg">
                      {document.processingResult.text}
                    </p>
                  </div>
                )}
                
                {document.processingResult.entities && document.processingResult.entities.length > 0 && (
                  <div>
                    <h4 className="text-xs font-medium uppercase text-docai-darkGray mb-2">Entities</h4>
                    <div className="space-y-2">
                      {document.processingResult.entities.map((entity, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg">
                          <div>
                            <p className="text-sm font-medium text-docai-black">{entity.text}</p>
                            <p className="text-xs text-docai-darkGray">{entity.type}</p>
                          </div>
                          <div className="chip">
                            {Math.round(entity.confidence * 100)}% confident
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {document.processingResult.summary && (
                  <div>
                    <h4 className="text-xs font-medium uppercase text-docai-darkGray mb-2">Summary</h4>
                    <p className="text-sm text-docai-black p-3 bg-white rounded-lg">
                      {document.processingResult.summary}
                    </p>
                  </div>
                )}
                
                <div>
                  <h4 className="text-xs font-medium uppercase text-docai-darkGray mb-2">Confidence Score</h4>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 transition-all duration-300 ease-out"
                      style={{ width: `${document.processingResult.confidence * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-right mt-1 text-docai-darkGray">
                    {Math.round(document.processingResult.confidence * 100)}%
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center">
                <p className="text-sm text-docai-darkGray">Processing document...</p>
                <p className="text-xs text-docai-darkGray mt-1">Please wait while we extract the data</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewPanel;
