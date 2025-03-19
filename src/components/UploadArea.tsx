
import React, { useState, useCallback } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
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
    <div className="w-full animate-fade-in">
      <div 
        className={`w-full border-2 border-dashed rounded-xl p-6 transition-all duration-300 flex flex-col items-center justify-center ${
          isDragging 
            ? 'border-docai-blue bg-docai-blue/5' 
            : selectedFile 
              ? 'border-green-500 bg-green-50' 
              : 'border-gray-200 hover:border-docai-blue hover:bg-docai-blue/5'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{ minHeight: '200px' }}
      >
        {selectedFile ? (
          <div className="w-full flex flex-col items-center">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-16 w-16 rounded-lg overflow-hidden border border-gray-200">
                {preview && preview.startsWith('data:image') ? (
                  <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-gray-100">
                    <FileText className="h-8 w-8 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <p className="text-sm font-medium text-docai-black">{selectedFile.name}</p>
                <p className="text-xs text-docai-darkGray">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <button 
                onClick={cancelUpload}
                className="ml-auto h-8 w-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-300"
              >
                <X className="h-4 w-4 text-docai-darkGray" />
              </button>
            </div>
            
            {isUploading ? (
              <div className="w-full max-w-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-docai-darkGray">Uploading...</span>
                  <span className="text-xs font-medium text-docai-blue">{uploadProgress}%</span>
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
                className="primary-button mt-4"
              >
                Process Document
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="h-12 w-12 rounded-full bg-docai-blue/10 flex items-center justify-center mb-4">
              <Upload className="h-6 w-6 text-docai-blue" />
            </div>
            <p className="text-sm font-medium text-center mb-2">
              Drag & drop files here, or <span className="text-docai-blue">browse</span>
            </p>
            <p className="text-xs text-docai-darkGray text-center mb-4">
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
              className="glass-button cursor-pointer"
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
