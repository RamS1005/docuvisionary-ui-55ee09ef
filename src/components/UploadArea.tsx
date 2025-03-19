
import React, { useState, useCallback } from 'react';
import { Upload, X, Loader2, FileText } from 'lucide-react';
import { processDocument, getFilePreview } from '../lib/document-service';
import { DocumentFile, FeatureType } from '../lib/types';
import ProcessingOptions from './ProcessingOptions';

interface UploadAreaProps {
  feature: FeatureType;
  onUploadComplete: (document: DocumentFile) => void;
}

const UploadArea: React.FC<UploadAreaProps> = ({ feature, onUploadComplete }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  }, []);

  const handleFile = async (file: File) => {
    setSelectedFile(file);
    
    try {
      const previewUrl = await getFilePreview(file);
      setPreview(previewUrl);
    } catch (error) {
      console.error('Failed to generate preview:', error);
    }
  };

  const processFile = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return prev;
        }
        return prev + 5;
      });
    }, 100);
    
    try {
      const processedDocument = await processDocument(selectedFile, feature);
      onUploadComplete(processedDocument);
      clearInterval(interval);
      setUploadProgress(100);
      
      // Reset states after a short delay
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        setSelectedFile(null);
        setPreview(null);
      }, 500);
    } catch (error) {
      console.error('Error processing document:', error);
      clearInterval(interval);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const cancelUpload = () => {
    setSelectedFile(null);
    setPreview(null);
  };

  return (
    <div className="w-full overflow-y-auto flex-grow animate-fade-in">
      <div 
        className={`w-full border border-dashed rounded-lg p-4 transition-all duration-300 flex flex-col items-center justify-center ${
          isDragging 
            ? 'border-docai-blue bg-docai-blue/5' 
            : selectedFile 
              ? 'border-green-500 bg-green-50' 
              : 'border-gray-200 hover:border-docai-blue hover:bg-docai-blue/5'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{ minHeight: '140px' }}
      >
        {selectedFile ? (
          <div className="w-full flex flex-col items-center">
            <div className="flex items-center gap-2 mb-3 w-full">
              <div className="h-10 w-10 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                {preview && preview.startsWith('data:image') ? (
                  <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-gray-100">
                    <FileText className="h-5 w-5 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="flex flex-col overflow-hidden flex-grow">
                <p className="text-xs font-medium text-docai-black truncate">{selectedFile.name}</p>
                <p className="text-[10px] text-docai-darkGray">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <button 
                onClick={cancelUpload}
                className="h-6 w-6 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-300 flex-shrink-0"
              >
                <X className="h-3 w-3 text-docai-darkGray" />
              </button>
            </div>
            
            {isUploading ? (
              <div className="w-full">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-docai-darkGray">Uploading...</span>
                  <span className="text-[10px] font-medium text-docai-blue">{uploadProgress}%</span>
                </div>
                <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-docai-blue transition-all duration-300 ease-out"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            ) : (
              <button
                onClick={processFile}
                className="primary-button mt-3 text-xs py-1.5 px-3"
              >
                Process Document
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="h-10 w-10 rounded-full bg-docai-blue/10 flex items-center justify-center mb-3">
              <Upload className="h-5 w-5 text-docai-blue" />
            </div>
            <p className="text-xs font-medium text-center mb-1">
              Drag & drop files here, or <span className="text-docai-blue">browse</span>
            </p>
            <p className="text-[10px] text-docai-darkGray text-center mb-3">
              Supports PDF, PNG, JPG, and TIFF documents
            </p>
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept=".pdf,.png,.jpg,.jpeg,.tiff,.tif"
              onChange={handleFileSelect}
            />
            <label
              htmlFor="file-upload"
              className="glass-button cursor-pointer text-xs py-1.5 px-3"
            >
              Select File
            </label>
          </>
        )}
      </div>
      
      <ProcessingOptions feature={feature} />
    </div>
  );
};

export default UploadArea;
